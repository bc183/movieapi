import { Router } from "express";
import movieController from "../controllers/movie-controller";
import { auth } from "../middlewares/auth-middleware";

const router = Router();

router.post("/create", auth, movieController.createMovie);

router.get("/all", movieController.getAllMovies);

router.put("/update/:id", auth, movieController.updateMovie);

router.delete("/delete/:id", auth, movieController.deleteMovie);

router.get("/:id", movieController.getMovie);

export { router as movieRouter };
