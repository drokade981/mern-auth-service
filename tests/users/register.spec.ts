import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import { User } from "../../src/entity/User";
import { Roles } from "../../src/constants";

describe("POST /auth/register", () => {
  let connection: DataSource;

  beforeAll(async () => {
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    // database truncate
    await connection.dropDatabase();
    await connection.synchronize();
    // await truncateTables(connection);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  describe("given all fields", () => {
    it("should return 201", async () => {
      /// AAA arrange act assert
      // arrange
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "x1e7D@example.com",
        password: "password",
      };

      // act
      const res = await request(app).post("/auth/register").send(userData);

      // assert
      expect(res.status).toBe(201);
    });

    it("should return valid json response", async () => {
      // arrange
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "x1e7D@example.com",
        password: "password",
      };

      // act
      const res = await request(app).post("/auth/register").send(userData);

      // assert application/json content type
      expect((res.headers as Record<string, string>)["content-type"]).toEqual(
        expect.stringContaining("json"),
      );
    });

    it("should persist user in database", async () => {
      // arrange
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "x1e7D@example.com",
        password: "password",
      };

      // act
      await request(app).post("/auth/register").send(userData);

      // assert
      const userRepository = connection.getRepository("User");
      const users = await userRepository.find();
      expect(users).toHaveLength(1);
      expect(users[0].firstName).toBe(userData.firstName);
      expect(users[0].lastName).toBe(userData.lastName);
      expect(users[0].email).toBe(userData.email);
    });
    it("should return user data", async () => {
      // arrange
      // const userData = {
      //     firstName: "John",
      //     lastName: "Doe",
      //     email: "x1e7D@example.com",
      //     password: "password",
      // };
      // act
      // const res = await request(app).post("/auth/register").send(userData);
      // assert
      // expect(res.body.data).toEqual({
      //     firstName: "John",
      //     lastName: "Doe",
      //     email: "x1e7D@example.com",
      // });
    });

    it("should return an id of created user", async () => {
      // arrange
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "x1e7D@example.com",
        password: "password",
      };

      // act
      const res = await request(app).post("/auth/register").send(userData);
      console.log(res.body);

      // assert
      expect(res.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
        }),
      );
    });

    it("should assign a customer role to created user", async () => {
      // arrange
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "x1e7D@example.com",
        password: "password",
      };

      // act
      await request(app).post("/auth/register").send(userData);

      // assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users[0]).toHaveProperty("role");
      expect(users[0].role).toBe(Roles.CUSTOMER);
    });
  });

  describe("fields are missing", () => {});
});
