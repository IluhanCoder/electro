import mongoose from "mongoose";
import User, { DetailedUserResponse, UserCredentials } from "../user/user-types";
import { IncomingHttpHeaders } from "http";
import { Request } from "express";

export interface AuthCredentials {
    userCredentials: UserCredentials,
    password: string,
    passwordSubmit: string
};

export interface LoginCredentials {
    nicknameOrEmail: string,
    password: string
}

export interface AuthResponse {
    user: DetailedUserResponse,
    token: string,
    message: string
}

interface CustomHeaders extends IncomingHttpHeaders {
    authorization?: string;
}

export interface AuthenticatedRequest extends Request {
    user?: User,
    headers: CustomHeaders;
}