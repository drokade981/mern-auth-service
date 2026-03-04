import { Request, NextFunction, Response } from "express";
import { TenantService } from "../services/tenantService";
import { CreateTenantRequest } from "../types";
import { Logger } from "winston";

export class TenantController {
  constructor(
    private tenantService: TenantService,
    private logger: Logger,
  ) {}

  async create(req: CreateTenantRequest, res: Response, next: NextFunction) {
    const { name, address } = req.body;
    this.logger.debug("New tenant creation request", {
      name,
      address,
    });
    try {
      const tenant = await this.tenantService.create({ name, address });
      this.logger.info(`Tenant created with id: ${tenant.id}`);
      res.status(201).json({ id: tenant.id });
    } catch (error) {
      next(error);
    }
  }

  async update(req: CreateTenantRequest, res: Response, next: NextFunction) {
    const { name, address } = req.body;
    const tenantId = req.params.id;

    if (isNaN(Number(tenantId))) {
      return res.status(400).json({ message: "Invalid tenant ID" });
    }
    try {
      const tenant = await this.tenantService.update(Number(tenantId), {
        name,
        address,
      });
      if (!tenant) {
        return res.status(404).json({ message: "Tenant not found" });
      }
      this.logger.info(`Tenant updated with id: ${tenantId}`);
      res.status(200).json({ id: tenantId });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const tenants = await this.tenantService.getAll();
      res.status(200).json(tenants);
    } catch (error) {
      next(error);
    }
  }

  async getTenantById(req: Request, res: Response, next: NextFunction) {
    const tenantId = req.params.id;

    if (isNaN(Number(tenantId))) {
      return res.status(400).json({ message: "Invalid Url Parameter" });
    }
    try {
      const tenant = await this.tenantService.getTenantById(Number(tenantId));
      if (!tenant) {
        return res.status(404).json({ message: "Tenant not found" });
      }
      res.status(200).json(tenant);
    } catch (error) {
      next(error);
    }
  }
}
