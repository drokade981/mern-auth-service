import request from "supertest";
import app from "../../src/app";

describe("POST /auth/register", () => {
  describe("given all fields", () => {
    it("should return 201", async () => {
      /// AAA arrange act assert
      // arrange
      const userData = {
        fistName: "John",
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
        fistName: "John",
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
      //     fistName: "John",
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
  });

  describe("fields are missing", () => {});
});
