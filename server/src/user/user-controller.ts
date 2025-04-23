import { NextFunction, Request, Response } from "express";
import userService from "./user-service";

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
}