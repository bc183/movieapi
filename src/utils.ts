import EnvironmentError from "./exceptions/environment-error";

export enum Environment {
    PORT = "PORT",
    DOMAIN = "DOMAIN",
    COOKIE_NAME = "COOKIE_NAME",
    REFRESH_TOKEN_EXPIRY = "REFRESH_TOKEN_EXPIRY",
    ACCESS_TOKEN_EXPIRY = "ACCESS_TOKEN_EXPIRY",
    SECRET = "SECRET",
}

export const getEnv = (name: string | Environment) => {
    const value = process.env[name];
    if (!value) {
        throw new EnvironmentError(`${name} is not present in the environment`);
    }
    return value;
};

export const checkEnvironment = () => {
    for (const key in Environment) {
        getEnv(key);
    }
};

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
