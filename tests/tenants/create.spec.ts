import { DataSource } from "typeorm";
import request from "supertest";
import { AppDataSource } from "../../src/config/data-source";
import app from "../../src/app";
import { Tenant } from "../../src/entity/Tenant";
import createJWKSMock from "mock-jwks";
import { Roles } from "../../src/constants";

describe("POST /tenants", () => {
  let connection: DataSource;
  let jwks: ReturnType<typeof createJWKSMock>;
  let adminToken: string;

  beforeAll(async () => {
    connection = await AppDataSource.initialize();
    jwks = createJWKSMock("http://localhost:3000");
  });

  beforeEach(async () => {
    // database truncate
    await connection.dropDatabase();
    await connection.synchronize();
    // await truncateTables(connection);
    jwks.start();

    adminToken = jwks.token({
      sub: "1",
      role: Roles.ADMIN,
    });
  });

  afterAll(async () => {
    await connection.destroy();
  });

  afterEach(() => {
    jwks.stop();
  });

  describe("given all fields", () => {
    it("should return 201 status code", async () => {
      const tenantData = {
        name: "Tenant 1",
        address: "This is tenant 1",
      };
      const res = await request(app)
        .post("/tenants")
        .set("Cookie", [`accessToken=${adminToken}`])
        .send(tenantData);
      expect(res.status).toBe(201);
    });

    it("should create tenant in database", async () => {
      const tenantData = {
        name: "Tenant 1",
        address: "This is tenant 1",
      };
      await request(app)
        .post("/tenants")
        .set("Cookie", [`accessToken=${adminToken}`])
        .send(tenantData);
      const tenantRepository = connection.getRepository(Tenant);
      const tenants = await tenantRepository.find();
      expect(tenants).toHaveLength(1);
      expect(tenants[0].name).toBe(tenantData.name);
      expect(tenants[0].address).toBe(tenantData.address);
    });

    it("should return 401 if user is not authenticated", async () => {
      const tenantData = {
        name: "Tenant 1",
        address: "This is tenant 1",
      };
      const response = await request(app).post("/tenants").send(tenantData);
      expect(response.status).toBe(401);
      const tenantRepository = connection.getRepository(Tenant);
      const tenants = await tenantRepository.find();
      expect(tenants).toHaveLength(0);
    });

    it("should return 403 if user is not admin", async () => {
      const managerToken = jwks.token({
        sub: "2",
        role: Roles.MANAGER,
      });
      const tenantData = {
        name: "Tenant 1",
        address: "This is tenant 1",
      };
      const response = await request(app)
        .post("/tenants")
        .set("Cookie", [`accessToken=${managerToken}`])
        .send(tenantData);
      expect(response.status).toBe(403);
      const tenantRepository = connection.getRepository(Tenant);
      const tenants = await tenantRepository.find();
      expect(tenants).toHaveLength(0);
    });
  });
});
