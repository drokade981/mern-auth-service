import { calculateDiscount } from "./src/utils";
import request from "supertest";
import app from "./src/app";

describe.skip("App", () => {
  it("should return correct discount amount", () => {
    const discount = calculateDiscount(200, 15);
    expect(discount).toBe(30);
  });

  it("should return 200 status code", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
  });
});
