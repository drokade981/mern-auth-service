import { DataSource } from "typeorm";
import request from "supertest";
import { AppDataSource } from "../../src/config/data-source";
import app from "../../src/app";
import createJWKSMock from "mock-jwks";

import { User } from "../../src/entity/User";
import { Roles } from "../../src/constants";
import { Tenant } from "../../src/entity/Tenant";
import { createTenant } from "../utils";

describe("POST /auth/users", () => {
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
    it("should persist user in database", async () => {
      const tenant = await createTenant(connection.getRepository(Tenant));

      const adminToken = jwks.token({
        sub: "1",
        role: Roles.ADMIN,
      });

      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "x1e7D@example.com",
        password: "password",
        tenantId: tenant.id,
        role: Roles.MANAGER,
      };

      // act
      await request(app)
        .post("/users")
        .set("Cookie", [`accessToken=${adminToken}`])
        .send(userData);

      // assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users).toHaveLength(1);
      expect(users[0].email).toBe(userData.email);
    });

    it("should create a manager user", async () => {
      const tenant = await createTenant(connection.getRepository(Tenant));

      const adminToken = jwks.token({
        sub: "1",
        role: Roles.ADMIN,
      });

      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "x1e7D@example.com",
        password: "password",
        tenantId: tenant.id,
        role: Roles.MANAGER,
      };

      // act
      await request(app)
        .post("/users")
        .set("Cookie", [`accessToken=${adminToken}`])
        .send(userData);

      // assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users).toHaveLength(1);
      expect(users[0].role).toBe(Roles.MANAGER);
    });

    it("should return 403 status code if non admin tries to create user", async () => {
      const tenant = await createTenant(connection.getRepository(Tenant));

      const nonAdminToken = jwks.token({
        sub: "2",
        role: Roles.MANAGER,
      });

      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "x1e7D@example.com",
        password: "password",
        tenantId: tenant,
      };

      // add token to cookie
      const response = await request(app)
        .post("/users")
        .set("Cookie", [`accessToken=${nonAdminToken}`])
        .send(userData);

      expect(response.status).toBe(403);

      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users).toHaveLength(0);
    });
  });
});
