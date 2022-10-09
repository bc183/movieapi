import jwt from "jsonwebtoken";
import { Tokens } from "../types";
import { Environment, getEnv } from "../utils";

class TokenService {
    generateAccessToken(email: string): string {
        try {
            const accessToken = jwt.sign(
                { email: email, type: Tokens.access },
                getEnv(Environment.SECRET),
                {
                    expiresIn: getEnv(Environment.ACCESS_TOKEN_EXPIRY),
                }
            );
            return accessToken;
        } catch (error) {
            throw error;
        }
    }

    generateRefreshToken(email: string): string {
        try {
            const refreshToken = jwt.sign(
                { email: email, type: Tokens.refresh },
                getEnv(Environment.SECRET),
                {
                    expiresIn: getEnv(Environment.REFRESH_TOKEN_EXPIRY),
                }
            );
            return refreshToken;
        } catch (error) {
            throw error;
        }
    }
}

export default new TokenService();
