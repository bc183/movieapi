import { NextFunction, Request, Response } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import db from "../db";
import UnAuthenticatedError from "../exceptions/unathenticated-error";
import { ITokenPayload, Tokens } from "../types";

export const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const accessToken = req.cookies["access_token"];
        if (!accessToken) {
            throw new UnAuthenticatedError("Token not found");
        }
        const decodedValue: ITokenPayload = jwt.verify(
            accessToken,
            process.env.SECRET!
        ) as ITokenPayload;
        if (decodedValue.type === Tokens.refresh) {
            throw new UnAuthenticatedError("Refresh token found.");
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
        req.user = user;
        return next();
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            error = new UnAuthenticatedError("Token expired");
            return next(error);
        }
        return next(error);
    }
};
