import { upload } from "../middlewares/multer.middleware.js";
import { Router } from "express";
import { loginUser, registerUser,logout, refreshAccesToken, updateCurrentpassword } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const userRouter = Router()

userRouter.route("/register").post(upload.single("avatar"),registerUser)
userRouter.route("/login").post(loginUser)
userRouter.route("/logout").post(verifyToken,logout)
userRouter.route("/refreshAccessToken").post(verifyToken,refreshAccesToken)
userRouter.route("/updatePassword").post(verifyToken,updateCurrentpassword)



export default userRouter



