import { Response } from "express";

export interface IBaseError {
    handler: (response: Response, error: Error | any) => {};
}
