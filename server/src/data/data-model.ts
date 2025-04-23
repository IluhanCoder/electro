import mongoose from "mongoose";
import { ConsumptionCategory } from "./data-types";

const dataModel = new mongoose.Schema({
    object: {type: mongoose.Types.ObjectId, ref: "Object"},
    user: {type: mongoose.Types.ObjectId, ref: "User"},
    amount: Number,
    category: {
        type: String,
        enum: Object.values(ConsumptionCategory),
        required: false
    },
    comment: {
        type: String,
        required: false
    },
    date: Date
    }
);
  
const DataModel = mongoose.model('Data', dataModel);
  
export default DataModel;