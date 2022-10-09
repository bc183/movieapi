import { NextFunction, Request, Response } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import db from "../db";
import UnAuthenticatedError from "../exceptions/unathenticated-error";
import { ITokenPayload, Tokens } from "../types";

/**
 *
 * @param req
 * @param res
 * @param next
 * @description Check if refresh token is valid
 */
export const checkRefreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const refreshToken = req.cookies["refresh_token"];
        if (!refreshToken) {
            throw new UnAuthenticatedError("Token not found");
        }
        const decodedValue: ITokenPayload = jwt.verify(
            refreshToken,
            process.env.SECRET!
        ) as ITokenPayload;
        if (decodedValue.type === Tokens.access) {
            throw new UnAuthenticatedError("access token found.");
        }
        // check user
        const user = await db.users.findUnique({
            where: {
                email: decodedValue.email,
            },
        });

        if (!user) {
            throw new UnAuthenticatedError("Token not valid");
        }
        req.userEmail = decodedValue.email;
        return next();
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            error = new UnAuthenticatedError("Token expired");
            return next(error);
        }
        return next(error);
    }
};
