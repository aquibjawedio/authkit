import { Router } from "express";
import {
  deleteMyAllSessionController,
  deleteMySessionByIdController,
  getMeController,
  getMyAllSessionController,
  getMySessionByIdController,
} from "../controllers/user.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/me").get(isLoggedIn, getMeController);

// Session Management Routes
userRouter.route("/me/sessions").get(isLoggedIn, getMyAllSessionController);
userRouter.route("/me/sessions").delete(isLoggedIn, deleteMyAllSessionController);

userRouter.route("/me/sessions/:sessionId").get(isLoggedIn, getMySessionByIdController);
userRouter.route("/me/sessions/:sessionId").delete(isLoggedIn, deleteMySessionByIdController);

export { userRouter };
