import $api, { setHeader } from "../axios";
import { AuthCredentials, AuthResponse, LoginCredentials } from "./auth-types";
import { toast } from "react-toastify";
import axios from "axios";
import serviceErrorHandler from "../service-error-handler";
import authStore from "./auth-store";
import { DetailedUserResponse } from "../user/user-types";

interface VerifyResponse {user: DetailedUserResponse, message: string}

export default new class AuthService {
    setupHeaderAndStore(token: string, user: DetailedUserResponse) {
        setHeader(token);
        console.log(user);
        authStore.setUser(user);
        localStorage.setItem("token", token);
    }

    async login(credentials: LoginCredentials) {
        const response = (await $api.post("/auth/login", {credentials})).data as AuthResponse;
        this.setupHeaderAndStore(response.token, response.user);
        return response;
    }

    async register(credentials: AuthCredentials) {
        const response = (await $api.post("/auth/register", {credentials})) as Axios.AxiosXHR<AuthResponse>;
        this.setupHeaderAndStore(response.data.token, response.data.user);
        return response.data;
    }

    async verify(): Promise<VerifyResponse> {
        const response = (await $api.get("/auth")).data as VerifyResponse; 
        return response;
    }

    logout() {
        authStore.dropUser();
        localStorage.removeItem("token");
    }

    async sendEmailConfirmation() {
        return (await $api.post("/user/send-confirmation")).data;
      }
      
}