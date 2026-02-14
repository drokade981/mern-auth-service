import { NextFunction, Response } from "express";
import { RegisterUserRequest } from "../types";
import { UserService } from "../services/userService";
import { Logger } from "winston";
import { validationResult } from "express-validator";

export class AuthController {
  constructor(
    private userService: UserService,
    private logger: Logger,
  ) {}

  async register(req: RegisterUserRequest, res: Response, next: NextFunction) {
    // validate request body
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    const { firstName, lastName, email, password } = req.body;

    this.logger.debug("New registration request", {
      firstName,
      lastName,
      email,
      password: "****",
    });
    try {
      const user = await this.userService.create({
        firstName,
        lastName,
        email,
        password,
      });
      this.logger.info(`User created with id: ${user.id}`);
      res.status(201).json(user);
    } catch (error) {
      next(error);
      return;
    }
  }
}
