import authStore from "../auth/auth-store";
import $api from "../axios";

interface isAdminResponse {
    isAdmin: boolean,
    messsage: string
}

export default new class UserService {
    

    async currentUserIsAdmin() {
        const currentUser = authStore.user;
        const response = (await $api.get(`/isAdmin/${currentUser?._id}`)).data as isAdminResponse;
        return response;
    }
}