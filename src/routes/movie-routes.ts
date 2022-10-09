import { Router } from "express";
import movieController from "../controllers/movie-controller";
import { auth } from "../middlewares/auth-middleware";
import { validate } from "../middlewares/validate-middleware";
import { movieSchemaValidators } from "../validators/movie-validators";

const router = Router();

router.post("/create", auth, validate(movieSchemaValidators), movieController.createMovie);

router.get("/all", movieController.getAllMovies);

router.put("/update/:id", auth, validate(movieSchemaValidators), movieController.updateMovie);

router.delete("/delete/:id", auth, movieController.deleteMovie);

router.get("/:id", movieController.getMovie);

export { router as movieRouter };
