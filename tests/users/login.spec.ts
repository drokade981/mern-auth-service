import { DataSource } from "typeorm";

describe("POST /auth/login", () => {
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
    it("should return 200", async () => {
      /// AAA arrange act assert
      // arrange
      const userData = {
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

    it("should return an id of login user", async () => {
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
  });
});
