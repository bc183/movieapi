import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import NotFoundError from "../exceptions/not-found-error";
import ValidationError from "../exceptions/validation-error";
import passwordService from "../services/password-service";
import tokenService from "../services/token-service";
import userService from "../services/user-service";
import { IResponse, IUser, IUserWithPassword } from "../types";
import { Environment, getEnv, removeUserPassword } from "../utils";

class AuthController {
    constructor() {
        this.login = this.login.bind(this);
        // this.getAccessToken = this.getAccessToken.bind(this);
    }

    async register(
        req: Request,
        res: Response<IResponse<IUser>>,
        next: NextFunction
    ): Promise<Response<IResponse<IUser>> | void> {
        try {
            // save user
            const user = req.body as IUserWithPassword;

            const retrivedUser = await userService.findUserByEmail(user.email);

            if (retrivedUser) {
                throw new ValidationError(`User with email ${user.email} already exists`);
            }

            const savedUser = await userService.saveUser(user);

            const response: IResponse<IUser> = {
                data: removeUserPassword(savedUser),
                statusCode: StatusCodes.CREATED,
                status: true,
                error: null,
            };

            return res.status(StatusCodes.CREATED).json(response);
        } catch (error) {
            return next(error);
        }
    }

    async logout(
        req: Request,
        res: Response<IResponse<string>>,
        next: NextFunction
    ): Promise<Response<IResponse<string>> | void> {
        try {
            // unset cookies
            res.cookie("access_token", null, {
                httpOnly: true,
                domain: process.env.DOMAIN,
                path: "/",
                sameSite: true,
                secure: process.env.NODE_ENV === "production",
                expires: new Date(Date.now()),
            });

            res.cookie("refresh_token", null, {
                httpOnly: true,
                domain: process.env.DOMAIN,
                path: "/",
                sameSite: true,
                secure: process.env.NODE_ENV === "production",
                expires: new Date(Date.now()),
            });

            const response: IResponse<string> = {
                data: "Logged out",
                statusCode: StatusCodes.OK,
                status: true,
                error: null,
            };

            return res.status(StatusCodes.OK).json(response);
        } catch (error) {
            console.error(error);
            return next(error);
        }
    }

    async login(
        req: Request,
        res: Response<IResponse<IUser>>,
        next: NextFunction
    ): Promise<Response<IResponse<IUser>> | void> {
        try {
            const { email, password } = req.body;

            // check email
            const user = await userService.findUserByEmail(email);

            if (!user) {
                throw new NotFoundError(`User with this email ${email} not found`);
            }

            if (!user.password) {
                throw new ValidationError("No password provided");
            }

            await passwordService.comparePassword(user.password, password);

            // generate tokens
            const accessToken = tokenService.generateAccessToken(user.email);
            const refreshToken = tokenService.generateRefreshToken(user.email);

            // set cookies
            res.cookie("access_token", accessToken, {
                httpOnly: true,
                domain: getEnv(Environment.DOMAIN),
                path: "/",
                sameSite: true,
                secure: process.env.NODE_ENV === "production",
            });

            res.cookie("refresh_token", refreshToken, {
                httpOnly: true,
                domain: getEnv(Environment.DOMAIN),
                path: "/",
                sameSite: true,
                secure: process.env.NODE_ENV === "production",
            });

            const response: IResponse<IUser> = {
                data: removeUserPassword(user),
                statusCode: StatusCodes.OK,
                status: true,
                error: null,
            };

            return res.status(StatusCodes.OK).json(response);
        } catch (error) {
            return next(error);
        }
    }

    async getAccessToken(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response<IResponse<string>> | void> {
        try {
            // refresh token
            const refreshToken = tokenService.generateRefreshToken(req.userEmail!);

            // access token
            const accessToken = tokenService.generateAccessToken(req.userEmail!);

            // set cookies
            res.cookie("access_token", accessToken, {
                httpOnly: true,
                domain: getEnv(Environment.DOMAIN),
                path: "/",
                sameSite: true,
                secure: process.env.NODE_ENV === "production",
            });

            res.cookie("refresh_token", refreshToken, {
                httpOnly: true,
                domain: getEnv(Environment.DOMAIN),
                path: "/",
                sameSite: true,
                secure: process.env.NODE_ENV === "production",
            });

            const response: IResponse<string> = {
                data: "Token generated successfully",
                statusCode: StatusCodes.OK,
                status: true,
                error: null,
            };
            return res.status(StatusCodes.OK).json(response);
        } catch (error) {
            console.error(error);
            return next(error);
        }
    }
}

export default new AuthController();
