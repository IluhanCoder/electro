import mongoose from "mongoose";
import { DetailedUserResponse, UserResponse } from "../user/user-types";
import Object from "../object/object-types";

export enum ConsumptionCategory {
    HEATING = 'heating',
    LIGHTING = 'lighting',
    HOUSEHOLD = 'household',
    MEDIA = 'media'
}
//можливо додати I в назві
export default interface Data extends Document {
    object: mongoose.Types.ObjectId,
    user: mongoose.Types.ObjectId,
    amount: number,
    category?: ConsumptionCategory,
    comment?: string,
    date: Date
}

export interface DataCredentials extends Omit<Data, "_id" | "object"> {
    object: string
}

export interface DataResponse extends Omit<Data, "user" | "object"> {
    _id: mongoose.Types.ObjectId,
    user: string,
    object: Object
}

export interface DetailedDataResponse extends Omit<Data, "user" | "object"> {
    _id: mongoose.Types.ObjectId,
    object: Object,
    user: DetailedUserResponse
}