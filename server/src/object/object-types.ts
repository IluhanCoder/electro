import mongoose from "mongoose"
import { ConsumptionType } from "./object-model"

export default interface Object extends Document {
    owner: mongoose.Types.ObjectId,
    type: ConsumptionType,
    name: string,
    createdAt: Date,
    updatedAt: Date,
    limit?: number
}

export interface ObjectCredentials extends Omit<Object, "_id" | "createdAt" | "updatedAt" | "owner" | "limit"> {
    owner: string
}

