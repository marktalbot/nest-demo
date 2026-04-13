/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Service } from './service.entity';
import { ServiceVersionResponseDto } from '../service-versions/dto/service-version-response.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
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

  create(orgId: string, dto: CreateServiceDto): Promise<Service> {
    return this.servicesRepository.createService(orgId, dto);
  }

  async update(orgId: string, id: string, dto: UpdateServiceDto): Promise<Service> {
    const service = await this.servicesRepository.findByIdAndOrg(id, orgId);
    if (!service) {
      throw new NotFoundException(`Service ${id} not found`);
    }
    return this.servicesRepository.updateService(id, orgId, dto);
  }

  async delete(orgId: string, id: string): Promise<void> {
    const service = await this.servicesRepository.findByIdAndOrg(id, orgId);
    if (!service) {
      throw new NotFoundException(`Service ${id} not found`);
    }
    return this.servicesRepository.deleteService(id, orgId);
  }
}
