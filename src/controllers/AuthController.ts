import { NextFunction, Response } from "express";
import { AuthRequest, RegisterUserRequest } from "../types";
import { JwtPayload } from "jsonwebtoken";
import { UserService } from "../services/userService";
import { Logger } from "winston";
import { validationResult } from "express-validator";
import { TokenService } from "../services/TokenService";
import createHttpError from "http-errors";
import { CredentialService } from "../services/CredentialService";
import { CookieService } from "../services/CookieService";

export class AuthController {
  constructor(
    private userService: UserService,
    private logger: Logger,
    private tokenService: TokenService,
    private credentialService: CredentialService,
    private cookieService: CookieService,
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

      const accessToken = this.tokenService.generateAccessToken(payload);

      // persist refresh token in database with user association and expiration time
      const newRefreshToken = await this.tokenService.persistRefreshToken(user);

      const refreshToken = this.tokenService.generateRefreshToken({
        ...payload,
        id: String(newRefreshToken.id), // include the database ID of the refresh token in the payload
      });

      await this.cookieService.storeAccessTokenInCookie(res, accessToken);
      await this.cookieService.storeRefreshTokenInCookie(res, refreshToken);

      res.status(201).json(user);
    } catch (error) {
      next(error);
      return;
    }
  }

  async login(req: RegisterUserRequest, res: Response, next: NextFunction) {
    // validate request body
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    const { email, password } = req.body;

    this.logger.debug("New request to login user", {
      email,
      password: "****",
    });

    // check if username (email) exists in database

    try {
      const user = await this.userService.findByEmail(email);
      if (!user) {
        const error = createHttpError(
          400,
          "Email or password does not matched",
        );
        next(error);
        return;
      }

      //compare password
      const passwordMatch = await this.credentialService.comparePassword(
        password,
        user.password,
      );

      if (!passwordMatch) {
        const error = createHttpError(
          400,
          "Email or password does not matched",
        );
        next(error);
        return;
      }

      //generate token

      const payload: JwtPayload = {
        sub: String(user.id),
        role: user.role,
      };

      const accessToken = this.tokenService.generateAccessToken(payload);

      // persist refresh token in database with user association and expiration time
      const newRefreshToken = await this.tokenService.persistRefreshToken(user);

      const refreshToken = this.tokenService.generateRefreshToken({
        ...payload,
        id: String(newRefreshToken.id),
      });

      await this.cookieService.storeAccessTokenInCookie(res, accessToken);
      await this.cookieService.storeRefreshTokenInCookie(res, refreshToken);

      this.logger.info(`User logged in with id: ${user.id}`);
      // return the response

      res.status(200).json({ ...user, password: undefined });
    } catch (error) {
      next(error);
      return;
    }
  }

  async me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      this.logger.info(`User logged auth id: ${req.auth}`);
      const user = await this.userService.findById(Number(req.auth.sub));
      res.status(200).json(user);
    } catch (error) {
      next(error);
      return;
    }
  }

  async refresh(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const payload: JwtPayload = {
        sub: req.auth.sub,
        role: req.auth.role,
      };

      const accessToken = this.tokenService.generateAccessToken(payload);

      const user = await this.userService.findById(Number(req.auth.sub));

      if (!user) {
        const error = createHttpError(
          400,
          "User with token could not be found",
        );
        next(error);
        return;
      }

      // persist refresh token in database with user association and expiration time
      const newRefreshToken = await this.tokenService.persistRefreshToken(user);

      // delete the old refresh token from database using the ID from the token payload
      await this.tokenService.deleteRefreshToken(Number(req.auth.id));
      const refreshToken = this.tokenService.generateRefreshToken({
        ...payload,
        id: String(newRefreshToken.id),
      });

      await this.cookieService.storeAccessTokenInCookie(res, accessToken);
      await this.cookieService.storeRefreshTokenInCookie(res, refreshToken);

      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ error: "Error refreshing token", err });
    }
  }
}
