import express, { NextFunction, Request, Response } from "express";
import { AuthController } from "../controllers/AuthController";
import { UserService } from "../services/userService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import logger from "../config/logger";
import { TokenService } from "../services/TokenService";
import registerValidator from "../validators/register.validator";
import { RefreshToken } from "../entity/RefreshToken";
import loginValidator from "../validators/login.validator";
import { CredentialService } from "../services/CredentialService";
import authenticate from "../middlewares/authenticate";
import { AuthRequest } from "../types";
import validateRefreshToken from "../middlewares/validateRefreshToken";
import { CookieService } from "../services/CookieService";

const router = express.Router();
const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
const tokenService = new TokenService(refreshTokenRepository);
const credentialService = new CredentialService();
const cookieService = new CookieService();

const authController = new AuthController(
  userService,
  logger,
  tokenService,
  credentialService,
  cookieService,
);
router.post(
  "/register",
  registerValidator,
  (req: Request, res: Response, next: NextFunction) =>
    authController.register(req, res, next),
);

router.post(
  "/login",
  loginValidator,
  (req: Request, res: Response, next: NextFunction) =>
    authController.login(req, res, next),
);

router.get(
  "/me",
  authenticate,
  (req: Request, res: Response, next: NextFunction) =>
    authController.me(req as AuthRequest, res, next),
);

router.post(
  "/refresh",
  validateRefreshToken,
  (req: Request, res: Response, next: NextFunction) =>
    authController.refresh(req as AuthRequest, res, next),
);

export default router;
