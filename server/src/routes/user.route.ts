import { Router } from "express";
import {
  deleteMyAllSessionController,
  deleteMySessionByIdController,
  deleteUserByIdController,
  getAllUsersController,
  getMeController,
  getMyAllSessionController,
  getMySessionByIdController,
  getUserByIdController,
  updateMyAvatarController,
} from "../controllers/user.controller.js";
import { isAdmin, isLoggedIn, isModOrAdmin } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const userRouter = Router();

userRouter.route("/me").get(isLoggedIn, getMeController);

userRouter.route("/me/avatar").post(isLoggedIn, upload.single("avatar"), updateMyAvatarController);

// Session Management Routes
userRouter.route("/me/sessions").get(isLoggedIn, getMyAllSessionController);
userRouter.route("/me/sessions").delete(isLoggedIn, deleteMyAllSessionController);

userRouter.route("/me/sessions/:sessionId").get(isLoggedIn, getMySessionByIdController);
userRouter.route("/me/sessions/:sessionId").delete(isLoggedIn, deleteMySessionByIdController);

// Mod and Admin Routes

userRouter.route("/").get(isLoggedIn, isModOrAdmin, getAllUsersController);
userRouter.route("/:userId").get(isLoggedIn, isModOrAdmin, getUserByIdController);

// Admin Only Routes
userRouter.route("/:userId").delete(isLoggedIn, isAdmin, deleteUserByIdController);

export { userRouter };
