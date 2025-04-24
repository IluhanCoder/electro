import UserModel from "./user-model";
import User, { Roles, UserCredentials } from "./user-types";
import { sendEmail } from "../../email/email-service";

export default new class UserService {
    async createUser(credentials: UserCredentials): Promise<User> {
        return await UserModel.create({ ...credentials, role: Roles.USER }) as User;
    }

    async findByNameOrEmail(nameOrEmail: string): Promise<User | null> {
        return await UserModel.findOne({ $or: [{ nickname: nameOrEmail }, { email: nameOrEmail }] });
    }

    async findById(userId: string): Promise<User> {
        return await UserModel.findById(userId);
    }

    async isAdmin(userId: string) {
        const user = await UserModel.findById(userId);
        return user.role === "admin";
    }

    async isSubmited(userId: string) {
        const user = await UserModel.findById(userId);
        return user.emailSubmited;
    }

    async getEmail(userId: string) {
        const user = await UserModel.findById(userId);
        return user.email;
    }

    async sendConfirmationEmail(userId: string) {
        const user = await UserModel.findById(userId);
        if (!user) throw new Error("User not found");

        const confirmationLink = `http://localhost:3000/confirm-email/${user._id}`;
        const html = `<p>Підтвердьте свою електронну адресу, натиснувши <a href="${confirmationLink}">сюди</a>.</p>`;

        await sendEmail(user.email, "Підтвердження електронної пошти", html);
    }

}