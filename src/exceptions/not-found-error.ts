import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IResponse } from "../types";
import { IBaseError } from "./base-error";

export default class NotFoundError extends Error implements IBaseError {
    constructor(message: string) {
        super(message);
    }

    handler(response: Response, error: any) {
        const res: IResponse<null, string> = {
            data: null,
            status: false,
            error: this.message,
            statusCode: StatusCodes.NOT_FOUND,
        };

        return response.status(StatusCodes.NOT_FOUND).json(res);
    }
}
