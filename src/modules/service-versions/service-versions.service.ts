import { Injectable, NotFoundException } from '@nestjs/common';
import { ServicesRepository } from '../services/services.repository';
import { ServiceVersion } from './service-version.entity';
import { CreateServiceVersionDto } from './dto/create-service-version.dto';
import { UpdateServiceVersionDto } from './dto/update-service-version.dto';

@Injectable()
export class ServiceVersionsService {
  constructor(private readonly servicesRepository: ServicesRepository) {}

  async create(
    orgId: string,
    serviceId: string,
    dto: CreateServiceVersionDto,
  ): Promise<ServiceVersion> {
    const service = await this.servicesRepository.findByIdAndOrg(serviceId, orgId);
    if (!service) {
      throw new NotFoundException(`Service ${serviceId} not found`);
    }
    return this.servicesRepository.createVersion(serviceId, orgId, dto.name);
  }

  async update(
    orgId: string,
    serviceId: string,
    versionId: string,
    dto: UpdateServiceVersionDto,
  ): Promise<ServiceVersion> {
    const version = await this.servicesRepository.findVersionById(versionId, serviceId, orgId);
    if (!version) {
      throw new NotFoundException(`Version ${versionId} not found`);
    }
    return this.servicesRepository.updateVersion(versionId, serviceId, orgId, dto.name);
  }

  async delete(
    orgId: string,
    serviceId: string,
    versionId: string,
  ): Promise<void> {
    const version = await this.servicesRepository.findVersionById(versionId, serviceId, orgId);
    if (!version) {
      throw new NotFoundException(`Version ${versionId} not found`);
    }
    return this.servicesRepository.deleteVersion(versionId, serviceId, orgId);
  }
}
