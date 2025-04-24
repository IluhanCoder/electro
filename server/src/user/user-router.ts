import { Router } from "express";
import userController from "./user-controller";
import { sendUserEmail } from "../../email/email-controller";

const userRouter = Router();

userRouter.get("/isAdmin/:userId", userController.isAdmin);
userRouter.get("/confirm-email/:id", userController.confirmEmail);
userRouter.post("/send-confirmation", userController.sendConfirmation);

export default userRouter;