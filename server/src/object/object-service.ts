import mongoose from "mongoose";
import ObjectModel from "./object-model";
import Object, { ObjectCredentials } from "./object-types";
import ObjectError from "./object-error";
import dataService from "../data/data-service";
import { DataResponse } from "../data/data-types";
import userService from "../user/user-service";

export default new class ObjectService {
    async createObject(credentials: ObjectCredentials) {
        const convertedOwnerId = new mongoose.Types.ObjectId(credentials.owner);
        const candidate = await ObjectModel.find({owner: convertedOwnerId, name: credentials.name});
        if(candidate.length === 0)
            await ObjectModel.create(credentials);
        else throw ObjectError.ObjectExists();
    }

    async getUserObjects(userId: string): Promise<Object[]> {
        const convertedOwnerId = new mongoose.Types.ObjectId(userId);
        const isAdmin = await userService.isAdmin(userId);
        return isAdmin ? await ObjectModel.find() : await ObjectModel.find({owner: convertedOwnerId});
    }

    async deleteObjectById(objectId: string) {
        const dataToDelete = await dataService.getObjectData(objectId);
        dataToDelete.map(async (data: DataResponse) => {
            await dataService.deleteDataById(data._id.toString())
        })
        await ObjectModel.findByIdAndDelete(objectId);
    }

    async setLimit(objectId: string, limit: number) {
        await ObjectModel.findByIdAndUpdate(objectId, {limit});
    }
}