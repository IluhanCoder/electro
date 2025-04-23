import { MongoServerError } from 'mongodb';
import bcrypt from 'bcrypt';
import mongoose from "mongoose";
import userService from "../user/user-service";
import User from "../user/user-types";
import AuthError from "./auth-error";
import { AuthCredentials, AuthResponse, LoginCredentials } from "./auth-types";
import jwt from "jsonwebtoken";

export default new class authService {
    #checkPasswordCredentials(pswd1: string, pswd2: string): boolean {
        if(pswd1 === pswd2) return true;
        throw AuthError.LoginPasswordNotMatches();
    }

    async #assignToken(userId: mongoose.Types.ObjectId): Promise<string> {
        return jwt.sign({userId}, process.env.JWT_SECRET);
    }

    async #generateNewUser(credentials: AuthCredentials): Promise<User> {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(credentials.password, salt);
        try { 
            const user: User = await userService.createUser({...credentials.userCredentials, password: hashedPassword} as User);
            return user;
        } catch (error) {
            if (error.code === 11000) {
                const duplicatedField = Object.keys(error.keyPattern)[0];
                throw AuthError.DataExists(duplicatedField);
            }
            throw error;
        }
    }   

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const candidate: User = await userService.findByNameOrEmail(credentials.nicknameOrEmail);
        if(!candidate) throw AuthError.UserNotFound();
        const passwordIsValid: boolean = await bcrypt.compare(credentials.password, candidate.password);
        if(!passwordIsValid) throw AuthError.InvalidPassword();

        //pompiler cries if you don't do this
        const candidateId: mongoose.Types.ObjectId = candidate._id as mongoose.Types.ObjectId;
        const token = await this.#assignToken(candidateId);
        
        const response: AuthResponse = {message: "success", user: candidate, token};
        return response;
    }

    async register(credentials: AuthCredentials): Promise<AuthResponse> {
        this.#checkPasswordCredentials(credentials.password, credentials.passwordSubmit);
        const user = await this.#generateNewUser(credentials);
        const loginCredentials: LoginCredentials = {nicknameOrEmail: user.name, password: credentials.password};

        const token: string = (await this.login(loginCredentials)).token;
        
        const response: AuthResponse = {message: "success", user, token};
        return response;
    }

    async verify(token: string) {
        interface DecodedJWTPayload {
            userId: string
        }
    
        const {userId}: DecodedJWTPayload = jwt.verify(token, process.env.JWT_SECRET) as DecodedJWTPayload;
        if(!userId) throw AuthError.VerificationFailed();
        const user: User = await userService.findById(userId);
        return user;
    }
}