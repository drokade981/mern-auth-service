import { NextFunction, Response } from "express";
import { RegisterUserRequest } from "../types";
import { JwtPayload } from "jsonwebtoken";
import { UserService } from "../services/userService";
import { Logger } from "winston";
import { validationResult } from "express-validator";
import { TokenService } from "../services/TokenService";

export class AuthController {
  constructor(
    private userService: UserService,
    private logger: Logger,
    private TokenService: TokenService,
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

      const payload: JwtPayload = {
        sub: String(user.id),
        role: user.role,
      };

      const accessToken = this.TokenService.generateAccessToken(payload);

      // persist refresh token in database with user association and expiration time
      const newRefreshToken = await this.TokenService.persistRefreshToken(user);

      // const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET!, {
      //   algorithm: "HS256",
      //   expiresIn: "1y",
      //   issuer: "auth-service",
      //   jwtid: String(newRefreshToken.id), // use the database ID of the refresh token as the JWT ID (jti)
      // });
      const refreshToken = this.TokenService.generateRefreshToken({
        ...payload,
        id: String(newRefreshToken),
      });

      res.cookie("accessToken", accessToken, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: 60 * 60 * 1000, // 1 hour
        httpOnly: true,
      });
      res.cookie("refreshToken", refreshToken, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: 24 * 365 * 60 * 60 * 1000, // 1 year
        httpOnly: true,
      });

      res.status(201).json(user);
    } catch (error) {
      next(error);
      return;
    }
  }
}
