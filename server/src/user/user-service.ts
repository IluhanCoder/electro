import UserModel from "./user-model";
import User, { Roles, UserCredentials } from "./user-types";

export default new class UserService {
    async createUser(credentials: UserCredentials): Promise<User> {
        return await UserModel.create({...credentials, role: Roles.USER}) as User;
    }
    
    async findByNameOrEmail(nameOrEmail: string): Promise<User | null> {
        return await UserModel.findOne({ $or: [{ nickname: nameOrEmail }, { email: nameOrEmail }]});
    }

    async findById(userId: string): Promise<User> {
        return await UserModel.findById(userId);
    }

    async isAdmin(userId: string) {
        const user = await UserModel.findById(userId);
        return user.role === "admin";
    }
}