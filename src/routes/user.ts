import express, { Response, NextFunction } from "express";

import authenticate from "../middlewares/authenticate";
import { canAccess } from "../middlewares/canAccess";
import { Roles } from "../constants";
import { UserController } from "../controllers/UserController";
import { UserService } from "../services/userService";
import { User } from "../entity/User";
import { AppDataSource } from "../config/data-source";
import updateUserValidator from "../validators/update-user.validator";
import createUserValidator from "../validators/create-user.validator";
import { CreateUserRequest, UpdateUserRequest } from "../types";

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.post(
  "/",
  authenticate,
  canAccess([Roles.ADMIN]),
  createUserValidator,
  (req: CreateUserRequest, res: Response, next: NextFunction) => {
    userController.create(req, res, next);
  },
);

router.get("/", authenticate, canAccess([Roles.ADMIN]), (req, res, next) => {
  userController.getAll(req, res, next);
});

router.patch(
  "/:id",
  authenticate,
  canAccess([Roles.ADMIN]),
  updateUserValidator,
  (req: UpdateUserRequest, res: Response, next: NextFunction) => {
    userController.update(req, res, next);
  },
);

router.get("/:id", authenticate, canAccess([Roles.ADMIN]), (req, res, next) => {
  userController.getUserById(req, res, next);
});

router.delete(
  "/:id",
  authenticate,
  canAccess([Roles.ADMIN]),
  (req, res, next) => {
    userController.destroy(req, res, next);
  },
);

export default router;
