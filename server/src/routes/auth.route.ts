import { Router } from "express";
import {
  googleAuthCallbackController,
  googleAuthController,
  loginController,
  logoutController,
  refreshAccessTokenController,
  registerController,
  verifyEmailController,
} from "../controllers/auth.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import passport from "passport";

const authRouter = Router();

authRouter.route("/register").post(registerController);
authRouter.route("/verify-email/:token").get(verifyEmailController);
authRouter.route("/login").post(loginController);
authRouter.route("/refresh").post(refreshAccessTokenController);
authRouter.route("/logout").post(isLoggedIn, logoutController);

// Google Login
authRouter.route("/google").get(googleAuthController);
authRouter.route("/google/callback").get(googleAuthCallbackController);

export { authRouter };
