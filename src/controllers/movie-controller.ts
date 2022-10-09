import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import movieService from "../services/movie-service";
import { IMovie, IMovieDTO, IResponse } from "../types";

class MovieController {
    async getAllMovies(
        req: Request,
        res: Response<IResponse<IMovie[]>>,
        next: NextFunction
    ): Promise<Response<IResponse<IMovie[]>> | void> {
        try {
            const { page, pageSize, sortField } = req.query;
            const pageNumber = page ? +page : 1;
            const pageSizeNumber = pageSize ? +pageSize : 10;

            // save movie
            const movies = await movieService.getAllMovies(
                pageSizeNumber,
                pageNumber,
                sortField as string
            );

            const response: IResponse<IMovie[]> = {
                data: movies,
                statusCode: StatusCodes.OK,
                status: true,
                error: null,
            };

            return res.status(StatusCodes.OK).json(response);
        } catch (error) {
            return next(error);
        }
    }

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
