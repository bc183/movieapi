import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import { StatusCodes } from "http-status-codes";
import { handler } from "./exceptions/handler";
import { authRouter } from "./routes/auth-routes";
import { movieRouter } from "./routes/movie-routes";

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", authRouter);
app.use("/api/movies", movieRouter);

app.get("/api/status", (request: Request, response: Response) => {
    return response.status(StatusCodes.OK).json({ status: "OK" });
});

// error handler
app.use("*/", handler);

export default app;
