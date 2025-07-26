import { Router } from "express";
import {
  loginController,
  refreshAccessTokenController,
  registerController,
  verifyEmailController,
} from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.route("/register").post(registerController);
authRouter.route("/verify-email/:token").get(verifyEmailController);
authRouter.route("/login").post(loginController);
authRouter.route("/refresh-token").post(refreshAccessTokenController);

export { authRouter };
