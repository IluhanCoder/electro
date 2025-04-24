import { NextFunction, Request, Response } from "express";
import userService from "./user-service";
import { AuthenticatedRequest } from "../auth/auth-types";
import UserModel from "./user-model";

export default new class UserController {
    

    async isAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            const {userId} = req.params;
            const isAdmin = await userService.isAdmin(userId);
            return res.status(200).json({isAdmin, message: "success"});
        } catch (error) {
            next(error);
        }
    }

    async sendConfirmation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
          const userId = req.user!._id;
          await userService.sendConfirmationEmail(userId.toString());
          res.status(200).json({ message: "Email sent" });
        } catch (error) {
          next(error);
        }
      }

      async confirmEmail(req: Request, res: Response, next: NextFunction) {
        try {
          const { id } = req.params;
          console.log(id);
          await UserModel.findByIdAndUpdate(id, { emailSubmited: true });
          res.send("Email підтверджено. Тепер ви можете отримувати листи.");
        } catch (error) {
          next(error);
        }
      }
      
      
}