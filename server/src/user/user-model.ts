import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { Roles } from "./user-types";

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: false,
    },
    surname: {
        type: String,
        required: true,
        unique: false,
    },
    nickname: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      unique: false,
    },
    role: {
        type: String,
        enum: Object.values(Roles)
    }
  });
  
  const UserModel = mongoose.model('User', userSchema);
  
export default UserModel;