import User, { UserCredentials } from "../user/user-types"

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
    user: User,
    token: string,
    message: string
}