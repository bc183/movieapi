import bcrypt from "bcrypt";

/**
 * Service class for Password based operations
 */
class PasswordService {
    /**
     *
     * @param password
     * @description Encrypt password using bcrypt
     */
    async encryptPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(6);
        const encryptPassword = await bcrypt.hash(password, salt);
        return encryptPassword;
    }

    /**
     *
     * @param password
     * @param encryptedPassword
     * @description Compare password against encrypted password
     */
    async comparePassword(password: string, encryptedPassword: string): Promise<boolean> {
        const result = await bcrypt.compare(password, encryptedPassword);
        return result;
    }
}

export default new PasswordService();
