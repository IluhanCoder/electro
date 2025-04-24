import mongoose from "mongoose";
import { ConsumptionCategory } from "./data-types";

const counterModel = new mongoose.Schema({
    ip: String,
    user: {type: mongoose.Types.ObjectId, ref: "User"},
    object: {type: mongoose.Types.ObjectId, ref: "Object"}
    }, {timestamps: true}
);
  
const CounterModel = mongoose.model('Counter', counterModel);
  
export default CounterModel;