import { NextFunction, Request, Response } from "express";
import bindAll from "../helpers/bind-all";
import dataService from "./data-service";
import { DataCredentials } from "./data-types";
import { AuthenticatedRequest } from "../auth/auth-types";
import userService from "../user/user-service";
import UserError from "../user/user-error";

class DataController { 
    async createData(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const {user} = req;
            const {credentials} = req.body;
            await dataService.createData({...credentials, user: user._id});
            return res.status(200).json({message: "success"});
        } catch (error) {
            next(error);
        }
    }   

    async fetchUserData(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const {user} = req;
            const data = await dataService.fetchUserData(user._id.toString());
            return res.status(200).json({data, message: "success"});
        } catch (error) {
            next(error);
        }
    }

    async fetchDataForAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const {user} = req as AuthenticatedRequest;
            const userIsAdmin = await userService.isAdmin(user._id.toString());
            if(userIsAdmin) {
                const data = dataService.fetchDataForAdmin();
                return res.status(200).json({data, message: "success"});
            }
            throw UserError.WrongRole();
        } catch (error) {
            next(error);
        }
    }

    async getDataByDateRange(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const {user} = req;
            const {startDate, endDate} = req.body;
            const data = await dataService.getDataByDateRange(user._id.toString(), startDate, endDate);
            return res.status(200).send({data, message: "success"});
        } catch (error) {
            next(error);
        }
    }

    async getObjectData(req: Request, res: Response, next: NextFunction) {
        try {
            const {objectId} = req.params;
            const data = await dataService.getObjectData(objectId);
            return res.status(200).send({data, message: "success"});
        } catch (error) {
            next(error);
        }
    }

    async deleteDataById(req: Request, res: Response, next: NextFunction) {
        try {
            const {dataId} = req.params;
            await dataService.deleteDataById(dataId);
            return res.status(200).json({message: "success"});
        } catch (error) {
            next(error);
        }
    }

    async generateDataforUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const {user} = req;
            const {objectId} = req.params;
            await dataService.generateDataForUser(user._id.toString(), objectId);
            return res.status(200).json({message: "success"});
        } catch (error) {
            next(error);
        }
    }

    async generateInstantDataforUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const {user} = req;
            const {objectId} = req.params;
            await dataService.generateInstantDataForUser(user._id.toString(), objectId);
            return res.status(200).json({message: "success"});
        } catch (error) {
            next(error);
        }
    }
}

const dataController = new DataController();
bindAll(dataController);
export default dataController;