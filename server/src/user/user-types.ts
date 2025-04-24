import { Document } from "mongoose";

export enum Roles {
    USER = "user",
    ADMIN = "admin",
    SERVICE = "service"
}

interface User extends Document {
    name: string,
    surname: string,
    nickname: string,
    email: string,
    password: string,
    role: Roles,
    emailSubmited: boolean
}

export default User;

export type UserResponse = Pick<User, '_id' | 'name' | 'surname' | 'nickname' | 'emailSubmited'>;
export type UserCredentials = Pick<User, 'name' | 'surname' | 'nickname' | 'email'>;
export type DetailedUserResponse = Omit<User, 'password'>;