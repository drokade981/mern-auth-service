import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { CreateUserRequest } from "../types";
import { NextFunction } from "express-serve-static-core";

export class UserController {
  constructor(private userService: UserService) {}
  async create(req: CreateUserRequest, res: Response, next: NextFunction) {
    const { firstName, lastName, email, password, role } = req.body;
    try {
      const user = await this.userService.create({
        firstName,
        lastName,
        email,
        password,
        role: role,
      });
      res.status(201).json({ id: user.id });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.userService.getAll();
      res.status(201).json(users);
    } catch (error) {
      next(error);
    }
  }
}
