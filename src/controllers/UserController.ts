import { Response } from "express";
import { UserService } from "../services/userService";
import { CreateUserRequest } from "../types";
import { NextFunction } from "express-serve-static-core";
import { Roles } from "../constants";
export class UserController {
  constructor(private userService: UserService) {}
  async create(req: CreateUserRequest, res: Response, next: NextFunction) {
    const { firstName, lastName, email, password } = req.body;
    try {
      const user = await this.userService.create({
        firstName,
        lastName,
        email,
        password,
        role: Roles.MANAGER,
      });
      res.status(201).json({ id: user.id });
    } catch (error) {
      next(error);
    }
  }
}
