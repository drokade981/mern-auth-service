import { Repository } from "typeorm";
import { User } from "../entity/User";
import { UserData } from "../types";
import createHttpError from "http-errors";
import { Roles } from "../constants";
import bcrypt from "bcrypt";

export class UserService {
  constructor(private userRepository: Repository<User>) {}

  async create({ firstName, lastName, email, password }: UserData) {
    // hash password before saving to database
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    try {
      return this.userRepository.save({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: Roles.CUSTOMER, // assign customer role to created user
      });
    } catch {
      const error = createHttpError(500, "Error creating user");
      throw error;
    }
  }
}
