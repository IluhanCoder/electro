import { Router } from "express";
import userService from "./user-service";

const userRouter = Router();

userRouter.get("/isAdmin/:userId", userService.isAdmin);

export default userRouter;