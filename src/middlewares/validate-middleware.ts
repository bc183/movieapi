import { NextFunction, Request, Response } from "express";
import { ValidationChain, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { IResponse } from "../types";

export const validate = (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        for (let validation of validations) {
            await validation.run(req);
        }

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        const response: IResponse<null, { params: string; message: any }[]> = {
            data: null,
            error: errors.array().map((f) => {
                return {
                    params: f.param,
                    message: f.msg,
                };
            }),
            statusCode: StatusCodes.BAD_REQUEST,
            status: false,
        };

        return res.status(StatusCodes.BAD_REQUEST).json(response);
    };
};
