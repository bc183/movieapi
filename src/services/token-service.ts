import jwt from "jsonwebtoken";
import { Tokens } from "../types";

class TokenService {
    generateAccessToken(email: string): string {
        try {
            const accessToken = jwt.sign(
                { email: email, type: Tokens.access },
                process.env.SECRET!,
                {
                    expiresIn: "5m",
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
                process.env.SECRET!,
                {
                    expiresIn: "2 days",
                }
            );
            return refreshToken;
        } catch (error) {
            throw error;
        }
    }
}

export default new TokenService();
