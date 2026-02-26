import { Response } from "express";

export class CookieService {
  async storeAccessTokenInCookie(response: Response, accessToken: string) {
    // Store the access token in an HTTP-only cookie
    // Set the cookie to expire in 1 hour
    const oneHourInMs = 60 * 60 * 1000; // 1 hour in milliseconds

    response.cookie("accessToken", accessToken, {
      domain: "localhost",
      sameSite: "strict",
      maxAge: oneHourInMs, // 1 hour
      httpOnly: true,
    });
  }

  async storeRefreshTokenInCookie(response: Response, refreshToken: string) {
    // Store the refresh token in an HTTP-only cookie
    // Set the cookie to expire in 1 year (365 days)
    const oneYearInMs = 365 * 24 * 60 * 60 * 1000; // 1 year in milliseconds

    response.cookie("refreshToken", refreshToken, {
      domain: "localhost",
      sameSite: "strict",
      maxAge: oneYearInMs, // 1 year
      httpOnly: true,
    });
  }
}
