export const emailVerificationMailGenContent = (fullname: string, verificationUrl: string) => ({
  body: {
    name: fullname,
    intro: "Welcome to AuthKit! We're very excited to have you on board.",
    action: {
      instructions: "Please verify your email to continue with AuthKit.",
      button: {
        color: "#15181cff",
        text: "Verify Email",
        link: verificationUrl,
      },
    },
    outro: "Ignore this email if you haven't created an account with AuthKit.",
  },
});

export const forgotPasswordMailGenContent = (fullname: string, forgotPasswordUrl: string) => ({
  body: {
    name: fullname,
    intro: "You recently requested to reset your password for your AuthKit account.",
    action: {
      instructions: "Click the button below to reset your password:",
      button: {
        color: "#15181cff",
        text: "Reset Password",
        link: forgotPasswordUrl,
      },
    },
    outro:
      "If you did not request a password reset, no further action is required. This link will expire shortly for your security.",
  },
});
