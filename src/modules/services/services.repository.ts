import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceVersion } from '../service-versions/service-version.entity';
import { Service } from './service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ListServicesQueryDto } from './dto/list-services-query.dto';
import { PaginatedServicesResponseDto } from './dto/service-response.dto';

@Injectable()
export class ServicesRepository {
  constructor(
    @InjectRepository(Service)
    private readonly repo: Repository<Service>,
    @InjectRepository(ServiceVersion)
    private readonly versionRepo: Repository<ServiceVersion>,
  ) {}

  async findPaginated(
    orgId: string,
    query: ListServicesQueryDto,
  ): Promise<PaginatedServicesResponseDto> {
    const {
      search,
      sortBy = 'name',
      sortOrder = 'asc',
      page = 1,
      limit = 20,
    } = query;

    const qb = this.repo
      .createQueryBuilder('service')
      .loadRelationCountAndMap('service.versionCount', 'service.versions')
      .where('service.organizationId = :orgId', { orgId });

    if (search) {
      qb.andWhere('service.name ILIKE :search', { search: `%${search}%` });
    }

    qb.orderBy(`service.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return { data: data as any, total, page, limit };
  }

  findByIdAndOrg(id: string, orgId: string): Promise<Service | null> {
    return this.repo.findOne({ where: { id, organizationId: orgId } });
  }

  findVersionsByServiceId(
    serviceId: string,
    orgId: string,
  ): Promise<ServiceVersion[]> {
    return this.versionRepo.find({
      where: { serviceId, organizationId: orgId },
      order: { createdAt: 'ASC' },
    });
  }

  createService(orgId: string, dto: CreateServiceDto): Promise<Service> {
    return this.repo.save(this.repo.create({ ...dto, organizationId: orgId }));
  }

  async updateService(
    id: string,
    orgId: string,
    dto: UpdateServiceDto,
  ): Promise<Service> {
    await this.repo.update({ id, organizationId: orgId }, dto);
    return this.repo.findOne({ where: { id, organizationId: orgId } });
  }

  async deleteService(id: string, orgId: string): Promise<void> {
    await this.repo.update(
      { id, organizationId: orgId },
      { activeVersionId: null },
    );
    await this.versionRepo.delete({ serviceId: id, organizationId: orgId });
    await this.repo.delete({ id, organizationId: orgId });
  }

  findVersionById(
    versionId: string,
    serviceId: string,
    orgId: string,
  ): Promise<ServiceVersion | null> {
    return this.versionRepo.findOne({
      where: { id: versionId, serviceId, organizationId: orgId },
    });
  }

  createVersion(
    serviceId: string,
    orgId: string,
    name: string,
  ): Promise<ServiceVersion> {
    return this.versionRepo.save(
      this.versionRepo.create({ name, serviceId, organizationId: orgId }),
    );
  }

  async updateVersion(
    versionId: string,
    serviceId: string,
    orgId: string,
    name: string,
  ): Promise<ServiceVersion> {
    await this.versionRepo.update(
      { id: versionId, serviceId, organizationId: orgId },
      { name },
    );
    return this.versionRepo.findOne({
      where: { id: versionId, serviceId, organizationId: orgId },
    });
  }

  async deleteVersion(
    versionId: string,
    serviceId: string,
    orgId: string,
  ): Promise<void> {
    const service = await this.repo.findOne({
      where: { id: serviceId, organizationId: orgId },
    });
    if (service?.activeVersionId === versionId) {
      await this.repo.update({ id: serviceId }, { activeVersionId: null });
    }
    await this.versionRepo.delete({
      id: versionId,
      serviceId,
      organizationId: orgId,
    });
  }
}
