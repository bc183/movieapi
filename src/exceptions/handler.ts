import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IResponse } from "../types";
import NotFoundError from "./not-found-error";
import UnAuthenticatedError from "./unathenticated-error";
import ValidationError from "./validation-error";

const knownExceptionTypes = [NotFoundError, ValidationError, UnAuthenticatedError];

export const handler = (error: any, request: Request, response: Response, next: NextFunction) => {
    console.error(error);

    if (checkIfKnownException(error)) {
        error.handler(response, error);
    } else {
        const res: IResponse<null, string> = {
            data: null,
            status: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            error: "Something went wrong",
        };
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(res);
    }
};

const checkIfKnownException = (error: any) => {
    for (const exception of knownExceptionTypes) {
        if (error instanceof exception) {
            return true;
        }
    }
    return false;
};
