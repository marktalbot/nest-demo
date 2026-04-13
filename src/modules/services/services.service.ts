import { Injectable, NotFoundException } from '@nestjs/common';
import { ServiceVersionResponseDto } from '../service-versions/dto/service-version-response.dto';
import { ListServicesQueryDto } from './dto/list-services-query.dto';
import {
  PaginatedServicesResponseDto,
  ServiceDetailResponseDto,
} from './dto/service-response.dto';
import { ServicesRepository } from './services.repository';

@Injectable()
export class ServicesService {
  constructor(private readonly servicesRepository: ServicesRepository) {}

  findAll(
    orgId: string,
    query: ListServicesQueryDto,
  ): Promise<PaginatedServicesResponseDto> {
    return this.servicesRepository.findPaginated(orgId, query);
  }

  async findOne(orgId: string, id: string): Promise<ServiceDetailResponseDto> {
    const service = await this.servicesRepository.findByIdAndOrg(id, orgId);

    if (!service) {
      throw new NotFoundException(`Service ${id} not found`);
    }

    return service;
  }

  async findVersions(
    orgId: string,
    id: string,
  ): Promise<ServiceVersionResponseDto[]> {
    const service = await this.servicesRepository.findByIdAndOrg(id, orgId);

    if (!service) {
      throw new NotFoundException(`Service ${id} not found`);
    }

    return this.servicesRepository.findVersionsByServiceId(id, orgId);
  }
}
