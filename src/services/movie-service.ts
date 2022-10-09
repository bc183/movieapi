import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import db from "../db";
import NotFoundError from "../exceptions/not-found-error";
import UnAuthenticatedError from "../exceptions/unathenticated-error";
import { IMovie, IMovieDTO, IUser, PrismaErrorCodes } from "../types";
import { createStartAndEndIndex } from "../utils";

/**
 * Service class for Movie operations
 */
class MovieService {
    /**
     * @description Returns a list of movies paginated by the specified parameters
     */
    async getAllMovies(
        noOfRecords?: number,
        page?: number
    ): Promise<{ movies: IMovie[]; totalRecords: number }> {
        try {
            const { startIndex, endIndex } = createStartAndEndIndex(page, noOfRecords);
            const movies = await db.$transaction([
                db.movies.count(),
                db.movies.findMany({
                    orderBy: {
                        releaseDate: "desc",
                    },
                    skip: startIndex,
                    take: endIndex,
                }),
            ]);
            return { movies: movies[1], totalRecords: movies[0] };
        } catch (error) {
            throw error;
        }
    }

    /**
     *
     * @param movie
     * @param user
     * @description Saves a movie to the database
     */
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

    /**
     *
     * @param id
     * @description Returns a movie based on id from the database
     */
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

    /**
     *
     * @param movie
     * @param id
     * @returns Updates a movie based on id in the database
     */
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

    /**
     *
     * @param id
     * @returns deletes a movie based on id from the database
     */
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
