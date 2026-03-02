import { DataSource } from "typeorm";
import request from "supertest";
import { AppDataSource } from "../../src/config/data-source";
import app from "../../src/app";
import { Tenant } from "../../src/entity/Tenant";

describe("POST /tenants", () => {
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
    it("should return 201 status code", async () => {
      const tenantData = {
        name: "Tenant 1",
        address: "This is tenant 1",
      };
      const res = await request(app).post("/tenants").send(tenantData);
      expect(res.status).toBe(201);
    });

    it("should create tenant in database", async () => {
      const tenantData = {
        name: "Tenant 1",
        address: "This is tenant 1",
      };
      await request(app).post("/tenants").send(tenantData);
      const tenantRepository = connection.getRepository(Tenant);
      const tenants = await tenantRepository.find();
      expect(tenants).toHaveLength(1);
      expect(tenants[0].name).toBe(tenantData.name);
      expect(tenants[0].address).toBe(tenantData.address);
    });
  });
});
