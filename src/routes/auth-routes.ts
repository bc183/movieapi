import { Router } from "express";
import authController from "../controllers/auth-controller";
import { auth } from "../middlewares/auth-middleware";
import { checkRefreshToken } from "../middlewares/refresh-middleware";
import { validate } from "../middlewares/validate-middleware";
import { loginSchemaValidators, userSchemaValidators } from "../validators/auth-validators";

const router = Router();

router.post("/login", validate(loginSchemaValidators), authController.login);

router.post("/register", validate(userSchemaValidators), authController.register);

router.get("/logout", auth, authController.logout);

router.get("/refresh", checkRefreshToken, authController.getAccessToken);

export { router as authRouter };
