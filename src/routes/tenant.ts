import express from "express";
import { TenantController } from "../controllers/TenantController";
import { TenantService } from "../services/tenantService";
import { Tenant } from "../entity/Tenant";
import { AppDataSource } from "../config/data-source";
import logger from "../config/logger";
import authenticate from "../middlewares/authenticate";
import { canAccess } from "../middlewares/canAccess";
import { Roles } from "../constants";

const router = express.Router();

const tenantRepository = AppDataSource.getRepository(Tenant);
const tenantService = new TenantService(tenantRepository);
const tentantController = new TenantController(tenantService, logger);

router.post("/", authenticate, canAccess([Roles.ADMIN]), (req, res, next) => {
  tentantController.create(req, res, next);
});

export default router;
