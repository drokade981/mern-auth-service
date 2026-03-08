import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { CreateUserRequest, UpdateUserRequest } from "../types";
import { NextFunction } from "express-serve-static-core";
import { validationResult } from "express-validator";

export class UserController {
  constructor(private userService: UserService) {}
  async create(req: CreateUserRequest, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
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

  async update(req: UpdateUserRequest, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    const { firstName, lastName, role } = req.body;
    const userId = req.params.id;

    if (isNaN(Number(userId))) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    try {
      const user = await this.userService.update(Number(userId), {
        firstName,
        lastName,
        role,
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res
        .status(200)
        .json({ id: userId, message: "User updated successfully" });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    const userId = req.params.id;

    if (isNaN(Number(userId))) {
      return res.status(400).json({ message: "Invalid Url Parameter" });
    }
    try {
      const user = await this.userService.getById(Number(userId));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async destroy(req: Request, res: Response, next: NextFunction) {
    const userId = req.params.id;

    if (isNaN(Number(userId))) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    try {
      const user = await this.userService.deletetById(Number(userId));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}
