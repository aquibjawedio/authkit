import { prisma } from "../config/prisma.js";
import { RegisterDTO, VerifyEmailDTO } from "../schemas/auth.schema.js";
import { ApiError } from "../utils/ApiError.js";
import { createCryptoHash, generateTemporaryToken, hashPassword } from "../utils/helper.js";
import { logger } from "../utils/logger.js";
import { sanitizeUser } from "../utils/sanitize.js";
import { sendEmail } from "../utils/sendEmail.js";
import { emailVerificationMailGenContent } from "../utils/emailTemplates.js";
import { env } from "../config/env.js";

export const registerService = async ({ fullname, username, email, password }: RegisterDTO) => {
  logger.info(`Attempt to register user : email - ${email}`);

  const userByEmail = await prisma.user.findUnique({ where: { email } });
  if (userByEmail) {
    logger.warn(`Registration failed: User already exists with Email - ${email}`);
    throw new ApiError(409, "User already exists with this email");
  }

  const userByUsername = await prisma.user.findUnique({ where: { username } });
  if (userByUsername) {
    logger.warn(`Registration failed: User already exists with Username - ${username}`);
    throw new ApiError(409, "User already exists with this username");
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      fullname,
      username,
      email,
      password: hashedPassword,
    },
  });

  logger.info(`User Created: Now sending email at - ${email}`);

  const { hashedToken, unHashedToken, tokenExpiry } = generateTemporaryToken();

  const verificationUrl = `${env.FRONTEND_URL}/auth/verify/${unHashedToken}`;

  sendEmail({
    email,
    subject: "Verify Email",
    mailGenContent: emailVerificationMailGenContent(fullname, verificationUrl),
  });

  const updateUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      emailVerificationToken: hashedToken,
      emailVerificationExpiry: tokenExpiry,
    },
  });

  logger.info(`Register Attempt Successfull : User registed and email sent at - ${email} `);
  return sanitizeUser(updateUser);
};

export const VerifyEmailService = async ({ token }: VerifyEmailDTO) => {
  logger.info(`Attemp To Verify User Email : Checking if user exists for token - ${token}`);

  const newHashedToken = createCryptoHash(token);

  const user = await prisma.user.findFirst({
    where: {
      emailVerificationToken: newHashedToken,
    },
  });

  if (!user) {
    logger.error(`Invalid Request : User not found for this token - ${token}`);
    throw new ApiError(400, "User not found with this token");
  }

  if (user.isEmailVerified) {
    logger.warn(`Invalid request : User is already verified with email - ${user.email}`);
    throw new ApiError(403, "User email is already verified");
  }

  if (user.emailVerificationExpiry && user.emailVerificationExpiry < new Date()) {
    logger.warn(`Veification Failed : Token expired for - ${user.email}`);
    const { hashedToken, unHashedToken, tokenExpiry } = generateTemporaryToken();

    const verificationUrl = `${env.FRONTEND_URL}/auth/verify/${unHashedToken}`;

    sendEmail({
      email: user.email,
      subject: "Verify Email",
      mailGenContent: emailVerificationMailGenContent(user.fullname, verificationUrl),
    });

    await prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        emailVerificationToken: hashedToken,
        emailVerificationExpiry: tokenExpiry,
      },
    });

    throw new ApiError(401, "Token expired. A new verification link has been sent to your email.");
  }

  const updatedUser = await prisma.user.update({
    where: {
      email: user.email,
    },
    data: {
      isEmailVerified: true,
      emailVerificationExpiry: null,
      emailVerificationToken: null,
    },
  });

  logger.info(`Verification Successfull : User verified with email - ${user.email}`);

  return sanitizeUser(updatedUser);
};
