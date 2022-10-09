import { StatusCodes } from "http-status-codes";

export interface IResponse<Data = void, E = void> {
    data: Data;
    error: E | null;
    status: boolean;
    statusCode: StatusCodes;
}

export interface IUser {
    id?: string;
    email: string;
    password?: string;
    username: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IUserWithPassword extends IUser {
    password: string;
}

export enum Tokens {
    access = "access",
    refresh = "refresh",
}

export interface IActor {
    id?: string;
    firstName: string;
    lastName: string;
    movies?: IMovie[];
    createdAt?: Date;
    updatedAt?: Date;
}

export enum PrismaErrorCodes {
    RECORD_NOT_FOUND = "P2001",
    RECORD_TO_INTERACT_NOT_FOUND = "P2025",
}

export interface IMovieDTO {
    name: string;
    rating: number;
    genre: string;
    releaseDate: Date;
    cast: string[];
}

export interface IMovie {
    id?: string;
    name: string;
    rating: number;
    genre: string;
    releaseDate: Date;
    createdBy?: IUser;
    createdById: string;
    cast: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ITokenPayload {
    email: string;
    type: Tokens;
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            userEmail?: string;
            user?: IUser;
        }
    }
}
