import { Repository } from "typeorm";
import { User } from "../entity/User";
import { LimitedUserData, UserData } from "../types";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";

export class UserService {
  constructor(private userRepository: Repository<User>) {}

  async create({
    firstName,
    lastName,
    email,
    password,
    role,
    tenantId,
  }: UserData) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw createHttpError(400, "User with this email already exists");
    }

    // hash password before saving to database
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    try {
      return this.userRepository.save({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: role, // assign role to created user
        tenant: tenantId ? { id: tenantId } : undefined,
      });
    } catch {
      const error = createHttpError(500, "Error creating user");
      throw error;
    }
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      select: ["id", "firstName", "lastName", "email", "role", "password"],
    });
  }

  async findById(id: number) {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  async getAll() {
    return await this.userRepository.find();
  }

  async update(userId: number, userData: LimitedUserData) {
    try {
      const { firstName, lastName, role } = userData;

      return await this.userRepository.update(userId, {
        firstName,
        lastName,
        role,
      });
    } catch (err) {
      const error = createHttpError(500, "Error updating user", { cause: err });
      throw error;
    }
  }

  async getById(userId: number) {
    return await this.userRepository.findOne({
      where: { id: userId },
    });
  }

  async deletetById(userId: number) {
    return await this.userRepository.delete(userId);
  }
}
