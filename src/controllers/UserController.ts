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

  async update(req: CreateUserRequest, res: Response, next: NextFunction) {
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
}
