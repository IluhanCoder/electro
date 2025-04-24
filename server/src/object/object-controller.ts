import { NextFunction, Request, Response } from "express";
import bindAll from "../helpers/bind-all";
import objectService from "./object-service";
import { AuthenticatedRequest } from "../auth/auth-types";

class ObjectController {
    async createObject(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const {user} = req;
            const {credentials} = req.body;
            await objectService.createObject({...credentials, owner: user._id.toString()});
            return res.status(200).json({message: "success"});
        } catch (error) {
            next(error);
        }
    }

    async getUserObjects(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const {user} = req;
            const objects = await objectService.getUserObjects(user._id.toString());
            return res.status(200).json({objects, message: "success"});
        } catch (error) {
            next(error);
        }
    }

    async deleteObjectById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const {objectId} = req.params;
            await objectService.deleteObjectById(objectId);
            return res.status(200).json({message: "success"});
        } catch (error) {
            next(error);
        }
    }

    async setLimit(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const {objectId} = req.params;
            const {limit} = req.body;
            await objectService.setLimit(objectId, limit);
            return res.status(200).json({message: "success"});
        } catch (error) {
            next(error);
        }
    }
}

const objectController = new ObjectController();
bindAll(objectController);
export default objectController;