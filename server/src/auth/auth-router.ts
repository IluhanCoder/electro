import { Router } from "express";
import authController from "./auth-controller";

const authRouter = Router();

authRouter.get('/', authController.verify);
authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);

export default authRouter;