import { JsonWebTokenError } from 'jsonwebtoken';
import User, { DetailedUserResponse } from '../user/user-types';
import AuthError from './auth-error';
import authService from './auth-service';
import { AuthCredentials, AuthenticatedRequest, AuthResponse, LoginCredentials } from './auth-types';
import { NextFunction, Request, Response } from "express";
import bindAll from '../helpers/bind-all';

class AuthController {
    async #verifyAuthHeader(authorization: string) {
        if (!authorization) {
            throw AuthError.VerificationFailed();
        }
        const token = authorization.split(' ')[1];
        const user: User = await authService.verify(token);
        if(!user) {
            throw AuthError.VerificationFailed();
        }            
        return user;
    }

    async authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const {authorization} = req.headers;   
        try {
            const user = await this.#verifyAuthHeader(authorization);
            req.user = user;
            next();
        } catch (error) {
            if (error instanceof JsonWebTokenError) {
                console.log(error);
                error = AuthError.VerificationFailed();
            }
            next(error);
        }
        
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const {credentials} = req.body as {credentials: LoginCredentials};
            const response: AuthResponse= await authService.login(credentials);
            return res.status(200).json({...response, message: "success"});
        } catch (error) {
            next(error);
        }
    }

    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const {credentials} = req.body as {credentials: AuthCredentials};
            const response: AuthResponse = await authService.register(credentials);
            return res.status(200).json({...response, message: "success"});
        } catch (error) {
            next(error);
        }   
    }

    async verify(req: Request, res: Response, next: NextFunction) {
        const {authorization} = req.headers;   
        try {
            const user = await this.#verifyAuthHeader(authorization);
            const response = {user} as {user: DetailedUserResponse} ;
            return res.status(200).json({...response, message: "success"});
        } catch (error) {
            if (error instanceof JsonWebTokenError) {
                console.log(error);
                error = AuthError.VerificationFailed();
            }
            next(error);
        }
    }
}
//todo: зробити так для всіх
const authController = new AuthController();
bindAll(authController);
export default authController;