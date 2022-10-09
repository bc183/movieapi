import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IResponse } from "../types";
import { IBaseError } from "./base-error";

export default class UnAuthenticatedError extends Error implements IBaseError {
    constructor(message: string) {
        super(message);
    }

    handler(response: Response, error: any) {
        const res: IResponse<null, string> = {
            data: null,
            status: false,
            error: this.message,
            statusCode: StatusCodes.UNAUTHORIZED,
        };

        return response.status(StatusCodes.UNAUTHORIZED).json(res);
    }
}
