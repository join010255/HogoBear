import { Router } from "express";
import UserController from './user.controller.js';
import { validate, createAccountSchema, loginSchema } from "../../core/middlewares/validation.middleware.js";


const userRouter = Router();

userRouter.post("/create-account", validate(createAccountSchema), UserController.createAccount);
userRouter.post("/login", validate(loginSchema), UserController.login);
userRouter.put("/update-public-key", UserController.updatePublicKeyUser);

export default userRouter;