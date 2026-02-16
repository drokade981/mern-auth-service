import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import { User } from "../../src/entity/User";
import { Roles } from "../../src/constants";
import { isJwt } from "../utils";

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

    it("should stored hashed password in database", async () => {
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
      expect(users[0]).toHaveProperty("password");
      expect(users[0].password).not.toBe(userData.password);
      expect(users[0].password).toHaveLength(60); // bcrypt hash length is 60 characters
      expect(users[0].password).toMatch(/^\$2b\$\d+\$/); // bcrypt hash format
    });

    it("should return 400 status code if email already exists", async () => {
      // arrange
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "x1e7D@example.com",
        password: "password",
      };

      const userRepository = connection.getRepository(User);
      await userRepository.save({
        ...userData,
        role: Roles.CUSTOMER,
      });

      // act

      const res = await request(app).post("/auth/register").send(userData);
      const users = await userRepository.find();

      // assert
      expect(res.statusCode).toBe(400);
      expect(users).toHaveLength(1);
    });
  });

  describe("fields are missing", () => {
    it("should return 400 status code if email is missing", async () => {
      // arrange
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "",
        password: "password",
      };

      // act
      const res = await request(app).post("/auth/register").send(userData);

      // assert
      expect(res.statusCode).toBe(400);

      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users).toHaveLength(0);
    });

    it("should return the access token and refresh token in cookiee", async () => {
      // arrange
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "x1e7D@example.com",
        password: "password",
      };

      // act
      const res = await request(app).post("/auth/register").send(userData);

      interface Headers {
        ["set-cookie"]: string[];
      }
      // assert
      let accessToken = null;
      let refreshToken = null;
      const cookies = (res.headers as Headers)["set-cookie"] || [];
      cookies.forEach((cookie) => {
        if (cookie.startsWith("accessToken")) {
          accessToken = cookie.split(";")[0].split("=")[1];
        }

        if (cookie.startsWith("refreshToken")) {
          refreshToken = cookie.split(";")[0].split("=")[1];
        }
      });
      expect(accessToken).not.toBeNull();
      expect(refreshToken).not.toBeNull();

      expect(isJwt(accessToken!)).toBeTruthy();
      expect(isJwt(refreshToken!)).toBeTruthy();
    });

    it("should return 400 status code if firstname is missing", async () => {
      // arrange
      const userData = {
        firstName: "",
        lastName: "Doe",
        email: "x1e7D@example.com",
        password: "password",
      };

      // act
      const res = await request(app).post("/auth/register").send(userData);

      // assert
      expect(res.statusCode).toBe(400);
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users).toHaveLength(0);
    });

    it("should return 400 status code if lastname is missing", async () => {
      // arrange
      const userData = {
        firstName: "John",
        lastName: "",
        email: "x1e7D@example.com",
        password: "password",
      };

      // act
      const res = await request(app).post("/auth/register").send(userData);

      // assert
      expect(res.statusCode).toBe(400);
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users).toHaveLength(0);
    });

    it("should return 400 status code if password is missing", async () => {
      // arrange
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "x1e7D@example.com",
        password: "",
      };

      // act
      const res = await request(app).post("/auth/register").send(userData);

      // assert
      expect(res.statusCode).toBe(400);
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users).toHaveLength(0);
    });
  });

  describe("fields are invalid", () => {
    it("should trim spaces from email", async () => {
      // arrange
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: " invalid-email@example.com ",
        password: "password",
      };

      // act
      await request(app).post("/auth/register").send(userData);

      // assert

      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      const user = users[0];

      expect(user.email).toBe("invalid-email@example.com");
    });

    it.todo("should return 400 status code if email is invalid");
    it.todo(
      "should return 400 status code if password length is less than 8 characters",
    );
    it.todo(
      "should return array of validation errors if multiple fields are invalid",
    );
  });
});
