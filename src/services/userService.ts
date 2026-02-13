import { Repository } from "typeorm";
import { User } from "../entity/User";
import { UserData } from "../types";

export class UserService {
  constructor(private userRepository: Repository<User>) {}
  create({ firstName, lastName, email, password }: UserData) {
    const user = this.userRepository.save({
      firstName,
      lastName,
      email,
      password,
    });
    return user;
  }
}
