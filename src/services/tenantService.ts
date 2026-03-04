import { Repository } from "typeorm";
import { ITenant } from "../types";
import { Tenant } from "../entity/Tenant";

export class TenantService {
  constructor(private tenantRepository: Repository<Tenant>) {}

  async create(tenatnData: ITenant) {
    return await this.tenantRepository.save(tenatnData);
  }

  async update(tenantId: number, tenantData: ITenant) {
    return await this.tenantRepository.update(tenantId, tenantData);
  }

  async getAll() {
    return await this.tenantRepository.find();
  }

  async getById(tenantId: number) {
    return await this.tenantRepository.findOne({
      where: { id: tenantId },
    });
  }

  async deletetById(tenantId: number) {
    const tenant = await this.tenantRepository.findOne({
      where: { id: tenantId },
    });
    if (!tenant) {
      return null;
    }
    await this.tenantRepository.delete(tenantId);
    return tenant;
  }
}
