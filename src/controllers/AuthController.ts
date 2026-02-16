import { NextFunction, Response } from "express";
import { RegisterUserRequest } from "../types";
import { JwtPayload, sign } from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { UserService } from "../services/userService";
import { Logger } from "winston";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { Config } from "../config";
import { AppDataSource } from "../config/data-source";
import { RefreshToken } from "../entity/refreshtoken";

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

      let privateKey: Buffer;
      try {
        privateKey = fs.readFileSync(
          path.join(__dirname, "../../certs/private.pem"),
        );
      } catch {
        const error = createHttpError(500, "Error reading private key");
        next(error);
        return;
      }
      const payload: JwtPayload = {
        sub: String(user.id),
        role: user.role,
      };
      const accessToken = sign(payload, privateKey, {
        algorithm: "RS256",
        expiresIn: "1h",
        issuer: "auth-service",
      });

      // persist refresh token in database with user association and expiration time
      const MS_IN_YEAR = 365 * 24 * 60 * 60 * 1000;
      const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
      const newRefreshToken = await refreshTokenRepository.save({
        user,
        expiresAt: new Date(Date.now() + MS_IN_YEAR), // 1 year
      });

      const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET!, {
        algorithm: "HS256",
        expiresIn: "1y",
        issuer: "auth-service",
        jwtid: String(newRefreshToken.id), // use the database ID of the refresh token as the JWT ID (jti)
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
