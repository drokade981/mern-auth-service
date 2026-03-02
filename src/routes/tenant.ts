import express from "express";
import { TenantController } from "../controllers/TenantController";
import { TenantService } from "../services/tenantService";
import { Tenant } from "../entity/Tenant";
import { AppDataSource } from "../config/data-source";
import logger from "../config/logger";

const router = express.Router();

const tenantRepository = AppDataSource.getRepository(Tenant);
const tenantService = new TenantService(tenantRepository);
const tentantController = new TenantController(tenantService, logger);

router.post("/", (req, res, next) => {
  tentantController.creeate(req, res, next);
});

export default router;
