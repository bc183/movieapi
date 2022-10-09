import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import db from "../db";
import NotFoundError from "../exceptions/not-found-error";
import UnAuthenticatedError from "../exceptions/unathenticated-error";
import { IMovie, IMovieDTO, IUser, PrismaErrorCodes } from "../types";
import { createStartAndEndIndex } from "../utils";

class MovieService {
    async getAllMovies(noOfRecords?: number, page?: number, sortField?: string): Promise<IMovie[]> {
        try {
            const { startIndex, endIndex } = createStartAndEndIndex(page, noOfRecords);
            const movies = await db.movies.findMany({
                orderBy: {
                    releaseDate: "desc",
                },
                skip: startIndex,
                take: endIndex,
            });
            return movies;
        } catch (error) {
            throw error;
        }
    }

    async saveMovie(movie: IMovieDTO, user?: IUser): Promise<IMovie> {
        try {
            if (!user) {
                throw new UnAuthenticatedError("You must be logged in to create a movie");
            }

            const savedMovie = await db.movies.create({
                data: {
                    ...movie,
                    releaseDate: new Date(movie.releaseDate),
                    createdBy: {
                        connect: {
                            id: user.id,
                        },
                    },
                },
            });

            return savedMovie;
        } catch (error) {
            throw error;
        }
    }

    async getMovieById(id: string): Promise<IMovie> {
        try {
            const movie = await db.movies.findUnique({
                where: {
                    id: id,
                },
            });
            if (!movie) {
                throw new NotFoundError("Record not found");
            }
            return movie;
        } catch (error) {
            throw error;
        }
    }

    async updateMovie(movie: IMovieDTO, id: string): Promise<IMovie> {
        try {
            const updatedMovie = await db.movies.update({
                where: {
                    id: id,
                },
                data: {
                    ...movie,
                    releaseDate: new Date(movie.releaseDate),
                },
            });

            return updatedMovie;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                // The .code property can be accessed in a type-safe manner
                if (error.code === PrismaErrorCodes.RECORD_TO_INTERACT_NOT_FOUND) {
                    throw new NotFoundError("Record not found");
                }
            }
            throw error;
        }
    }

    async deleteMovie(id: string): Promise<boolean> {
        try {
            await db.movies.delete({
                where: {
                    id: id,
                },
            });

            return true;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                // The .code property can be accessed in a type-safe manner
                if (error.code === PrismaErrorCodes.RECORD_TO_INTERACT_NOT_FOUND) {
                    throw new NotFoundError("Record not found");
                }
            }
            throw error;
        }
    }
}

export default new MovieService();
