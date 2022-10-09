import bcrypt from "bcrypt";

class PasswordService {
    async encryptPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(6);
        const encryptPassword = await bcrypt.hash(password, salt);
        return encryptPassword;
    }

    async comparePassword(password: string, encryptedPassword: string): Promise<boolean> {
        const result = await bcrypt.compare(password, encryptedPassword);
        return result;
    }
}

export default new PasswordService();
