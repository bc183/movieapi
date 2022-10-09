import db from "../db";
import { IUser } from "../types";
import passwordService from "./password-service";

class UserService {
    async findUserByEmail(email: string): Promise<IUser | null> {
        try {
            const user = await db.users.findUnique({
                where: {
                    email: email,
                },
            });
            return user;
        } catch (error) {
            throw error;
        }
    }

    async saveUser(user: IUser): Promise<IUser> {
        try {
            const encryptedPassword = await passwordService.encryptPassword(user.password);
            const savedUser = await db.users.create({
                data: {
                    ...user,
                    password: encryptedPassword,
                },
            });
            return savedUser;
        } catch (error) {
            throw error;
        }
    }
}

export default new UserService();
