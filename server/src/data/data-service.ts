import mongoose from "mongoose";
import bindAll from "../helpers/bind-all";
import DataModel from "./data-model";
import { ConsumptionCategory, DataCredentials, DataResponse, DetailedDataResponse } from "./data-types";
import { Document } from "mongodb";
import objectService from "../object/object-service";
import { faker } from "@faker-js/faker";
import ObjectModel from "../object/object-model";
import analyticService from "../analytics/analytics-service";

class DataService {
    async createData(credentials: DataCredentials) {
        await DataModel.create(credentials);
        await analyticService.checkAndNotifyAnomalies(credentials.object);
    }

    async fetchUserData(userId: string): Promise<DataResponse[]> {
        const convertedUserId = new mongoose.Types.ObjectId(userId);
        const data: DataResponse[] = await DataModel
            .find({ user: convertedUserId }).sort({ date: -1 })
            .populate("object", "name type createdAt updatedAt") as unknown as DataResponse[]
        return data;
    }

    async fetchDataForAdmin(): Promise<DetailedDataResponse[]> {
        const data: DetailedDataResponse[] = (await DataModel
            .find().sort({ date: -1 })
            .populate("object", "name createdAt updatedAt")
            .populate("user", "name surname nickname email")) as unknown as DetailedDataResponse[];
        return data;
    }

    async getDataByDateRange(userId: string, startDate: Date, endDate: Date): Promise<DataResponse[]> {
        return (await DataModel.find({
            user: userId,
            date: {
                $gte: startDate,
                $lte: endDate
            }
        }).sort({ date: -1 }).populate("object", "name type createdAt updatedAt")) as unknown as DataResponse[];
    }

    async getObjectData(objectId: string): Promise<DataResponse[]> {
        const convertedObjectId = new mongoose.Types.ObjectId(objectId);
        return (await DataModel.find({
            object: convertedObjectId
        }).sort({ date: -1 }).populate("object", "name type createdAt updatedAt")) as unknown as DataResponse[];
    }

    async deleteDataById(dataId: string) {
        await DataModel.findByIdAndDelete(dataId);
    }

    async generateDataForUser(userId: string, objectId: string) {
        const INTERVAL_MS = 20 * 1000;
        const MINUTES_BACK = 60;
        const MAX_ENTRIES_PER_CATEGORY = 100;
    
        const START_DATE = new Date(Date.now() - MINUTES_BACK * 60 * 1000);
        const END_DATE = new Date();
    
        const object = await ObjectModel.findById(objectId);
        if (!object) {
            throw new Error("Object not found.");
        }
    
        const categories = Object.values(ConsumptionCategory);
        const dataToInsert = [];
    
        for (const category of categories) {
            let current = new Date(START_DATE);
            let entriesCount = 0;
    
            while (current <= END_DATE && entriesCount < MAX_ENTRIES_PER_CATEGORY) {
                const randomAmount = +(Math.random() * 10).toFixed(2);
    
                const data = new DataModel({
                    object: objectId,
                    user: userId,
                    amount: randomAmount,
                    category,
                    comment: faker.lorem.words(3),
                    date: new Date(current)
                });
    
                dataToInsert.push(data);
    
                current = new Date(current.getTime() + INTERVAL_MS);
                entriesCount++;
            }
        }
    
        console.log(`Generated ${dataToInsert.length} records for object ${objectId}`);
        await DataModel.insertMany(dataToInsert);
    }
    
    async generateInstantDataForUser(userId: string, objectId: string) {
        const object = await ObjectModel.findById(objectId);
        if (!object) {
            throw new Error("Object not found.");
        }
    
        const categories = Object.values(ConsumptionCategory);
        const now = new Date();
        const dataToInsert = categories.map(category => {
            return new DataModel({
                object: objectId,
                user: userId,
                amount: +(Math.random() * 10).toFixed(2),
                category,
                comment: faker.lorem.words(3),
                date: now
            });
        });
    
        console.log(`Generated ${dataToInsert.length} instant records for object ${objectId}`);
        await DataModel.insertMany(dataToInsert);
        await analyticService.checkAndNotifyAnomalies(objectId);
    }
    
}

const dataService = new DataService();
bindAll(dataService);
export default dataService;