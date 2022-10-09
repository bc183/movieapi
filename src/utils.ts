import EnvironmentError from "./exceptions/environment-error";
import { IUser, IUserWithPassword } from "./types";

export enum Environment {
    PORT = "PORT",
    DOMAIN = "DOMAIN",
    COOKIE_NAME = "COOKIE_NAME",
    REFRESH_TOKEN_EXPIRY = "REFRESH_TOKEN_EXPIRY",
    ACCESS_TOKEN_EXPIRY = "ACCESS_TOKEN_EXPIRY",
    SECRET = "SECRET",
}

/**
 *
 * @param name
 * @description Get the environment variable with the given name
 */
export const getEnv = (name: string | Environment) => {
    const value = process.env[name];
    if (!value) {
        throw new EnvironmentError(`${name} is not present in the environment`);
    }
    return value;
};

/**
 * @description checks if all environment variables exist
 */
export const checkEnvironment = () => {
    for (const key in Environment) {
        getEnv(key);
    }
};

/**
 * @description removes the password field from user object
 * @param user
 */
export const removeUserPassword = (user: IUserWithPassword) => {
    const userWithoutPassword: IUser = {
        ...user,
    };
    delete userWithoutPassword.password;
    return userWithoutPassword;
};

/**
 *
 * @param page
 * @param pageSize
 * @description created start index and end index for pagination
 */
export const createStartAndEndIndex = (
    page?: number,
    pageSize?: number
): { startIndex: number; endIndex: number } => {
    if (!page || !pageSize) {
        return { startIndex: 0, endIndex: 10 };
    }
    const startIndex = page * pageSize - pageSize;
    return { startIndex: startIndex, endIndex: pageSize };
};
