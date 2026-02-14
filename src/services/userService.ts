import { Repository } from "typeorm";
import { User } from "../entity/User";
import { UserData } from "../types";
import createHttpError from "http-errors";
import { Roles } from "../constants";

export class UserService {
  constructor(private userRepository: Repository<User>) {}

  create({ firstName, lastName, email, password }: UserData) {
    try {
      return this.userRepository.save({
        firstName,
        lastName,
        email,
        password,
        role: Roles.CUSTOMER, // assign customer role to created user
      });
    } catch {
      const error = createHttpError(500, "Error creating user");
      throw error;
    }
  }
}
