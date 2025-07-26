import nodemailer from "nodemailer";
import { env } from "./env.js";
import { string } from "zod";

const mailtrapTransporter = nodemailer.createTransport({
  host: env.MAILTRAP_HOST,
  port: env.MAILTRAP_PORT,
  secure: false,
  auth: {
    user: env.MAILTRAP_USERNAME,
    pass: env.MAILTRAP_PASSWORD,
  },
});

export { mailtrapTransporter };
