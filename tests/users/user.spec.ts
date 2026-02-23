import { DataSource } from "typeorm";
import request from "supertest";
import { AppDataSource } from "../../src/config/data-source";
import app from "../../src/app";
import createJWKSMock from "mock-jwks";

import { User } from "../../src/entity/User";
import { Roles } from "../../src/constants";

describe("POST /auth/me", () => {
  let connection: DataSource;
  let jwks: ReturnType<typeof createJWKSMock>;

  beforeAll(async () => {
    jwks = createJWKSMock("http://localhost:3000");
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    jwks.start();
    // database truncate
    await connection.dropDatabase();
    await connection.synchronize();
    // await truncateTables(connection);
  });

  afterEach(() => {
    jwks.stop();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  describe("given all fields", () => {
    it("should return 200 status code", async () => {
      const accessToken = jwks.token({
        sub: "1",
        role: Roles.CUSTOMER,
      });

      const response = await request(app)
        .get("/auth/me")
        .set("Cookie", [`accessToken=${accessToken}`])
        .send();

      expect(response.statusCode).toBe(200);
    });

    it.skip("should return user data", async () => {
      /// AAA arrange act assert
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "x1e7D@example.com",
        password: "password",
      };
      const userRepository = connection.getRepository(User);
      const user = await userRepository.save({
        ...userData,
        role: Roles.CUSTOMER,
      });

      // generate access token for the user
      const accessToken = jwks.token({
        sub: String(user.id),
        role: user.role,
      });
      // const accessToken = jwks.token({
      //   aud: 'private',
      //   iss: 'auth-service',
      //   sub: String(user.id),
      //   role: user.role,
      // })
      // act

      // arrange
      const res = await request(app)
        .get("/auth/me")
        .set("Cookie", [`access_token=${accessToken}`])
        .send();

      // assert
      expect(res.body.id as Record<string, number>).toBe(user.id);
    });
  });
});
