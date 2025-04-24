import mongoose from "mongoose";

export enum ConsumptionType {
    HOUSE = 'house',
    APARTAMENT = 'apartament',
    OFFICE = 'office',
    ENTERPRISE = 'enterprise'
}

const objectModel = new mongoose.Schema({
    owner: {type: mongoose.Types.ObjectId, ref: "User"},
    type: {
        type: String,
        enum: Object.values(ConsumptionType),
        required: false
    },
    name: String,
    limit: {type: Number, required: false },
    }, {
        timestamps: true
    });

  
const ObjectModel = mongoose.model('Object', objectModel);
  
export default ObjectModel;