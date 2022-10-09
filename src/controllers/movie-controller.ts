import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import movieService from "../services/movie-service";
import { IMovie, IMovieDTO, IResponse } from "../types";

/**
 * Controller class Movie based requests
 */
class MovieController {
    /**
     *
     * @param req
     * @param res
     * @param next
     * @description Returns All movies paginated with the given parameters
     */
    async getAllMovies(
        req: Request,
        res: Response<IResponse<IMovie[]>>,
        next: NextFunction
    ): Promise<Response<IResponse<IMovie[]>> | void> {
        try {
            const { page, pageSize } = req.query;
            const pageNumber = page ? +page : 1;
            const pageSizeNumber = pageSize ? +pageSize : 10;

            // save movie
            const movies = await movieService.getAllMovies(pageSizeNumber, pageNumber);

            const response: IResponse<IMovie[]> = {
                data: movies.movies,
                statusCode: StatusCodes.OK,
                status: true,
                error: null,
                totalRecords: movies.totalRecords,
            };

            return res.status(StatusCodes.OK).json(response);
        } catch (error) {
            return next(error);
        }
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     * @description Returns the movie that has the given id.
     */
    async getMovie(
        req: Request,
        res: Response<IResponse<IMovie>>,
        next: NextFunction
    ): Promise<Response<IResponse<IMovie>> | void> {
        try {
            const { id } = req.params;

            const movie = await movieService.getMovieById(id);

            const response: IResponse<IMovie> = {
                data: movie,
                statusCode: StatusCodes.OK,
                status: true,
                error: null,
            };

            return res.status(StatusCodes.OK).json(response);
        } catch (error) {
            return next(error);
        }
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     * @description Create a movie
     */
    async createMovie(
        req: Request,
        res: Response<IResponse<IMovieDTO>>,
        next: NextFunction
    ): Promise<Response<IResponse<IMovieDTO>> | void> {
        try {
            // save movie
            const movie = req.body as IMovieDTO;
            const savedMovie = await movieService.saveMovie(movie, req.user);

            const response: IResponse<IMovie> = {
                data: savedMovie,
                statusCode: StatusCodes.CREATED,
                status: true,
                error: null,
            };

            return res.status(StatusCodes.CREATED).json(response);
        } catch (error) {
            return next(error);
        }
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     * @description Update a movie based on id
     */
    async updateMovie(
        req: Request,
        res: Response<IResponse<IMovieDTO>>,
        next: NextFunction
    ): Promise<Response<IResponse<IMovieDTO>> | void> {
        try {
            const { id } = req.params;
            const movie = req.body as IMovieDTO;
            const updatedMovie = await movieService.updateMovie(movie, id);

            const response: IResponse<IMovie> = {
                data: updatedMovie,
                statusCode: StatusCodes.OK,
                status: true,
                error: null,
            };

            return res.status(StatusCodes.OK).json(response);
        } catch (error) {
            return next(error);
        }
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     * @description Delete a movie based on id
     */
    async deleteMovie(
        req: Request,
        res: Response<IResponse<string>>,
        next: NextFunction
    ): Promise<Response<IResponse<string>> | void> {
        try {
            const { id } = req.params;
            await movieService.deleteMovie(id);

            const response: IResponse<string> = {
                data: "Movie deleted successfully",
                statusCode: StatusCodes.OK,
                status: true,
                error: null,
            };

            return res.status(StatusCodes.OK).json(response);
        } catch (error) {
            return next(error);
        }
    }
}

export default new MovieController();
