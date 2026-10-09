import { Router } from "express";
import UserController from './user.controller.js';
import { requireAuth } from "../../core/middlewares/auth.middleware.js";
import { validate, createAccountSchema, loginSchema } from "../../core/middlewares/validation.middleware.js";


const userRouter = Router();

userRouter.post("/create-account", validate(createAccountSchema), UserController.createAccount);
userRouter.post("/login", validate(loginSchema), UserController.login);
userRouter.put("/update-public-key", requireAuth, UserController.updatePublicKeyUser);
userRouter.post("/refresh-recovery", UserController.refreshRecoveryText);
userRouter.post("/get-token", UserController.getToken);
userRouter.get("/verify-token", requireAuth, UserController.tokenVerify);

export default userRouter;