import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceVersion } from '../service-versions/service-version.entity';
import { Service } from './service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ListServicesQueryDto } from './dto/list-services-query.dto';
import {
  PaginatedServicesResponseDto,
  ServiceResponseDto,
} from './dto/service-response.dto';

type ServiceWithCount = Service & { versionCount: number };

/**
 * Error code that Postgres returns when violating a foreign key constraint
 */
const PG_FK_VIOLATION = '23503';

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

    return { data: data as ServiceWithCount[], total, page, limit };
  }

  findByIdAndOrg(id: string, orgId: string): Promise<Service | null> {
    return this.repo.findOne({ where: { id, organizationId: orgId } });
  }

  async findByIdAndOrgWithCount(
    id: string,
    orgId: string,
  ): Promise<ServiceResponseDto | null> {
    const result = await this.repo
      .createQueryBuilder('service')
      .loadRelationCountAndMap('service.versionCount', 'service.versions')
      .where('service.id = :id AND service.organizationId = :orgId', { id, orgId })
      .getOne();

    return result ? (result as ServiceWithCount) : null;
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
    try {
      await this.repo.update({ id, organizationId: orgId }, dto);
    } catch (err) {
      if ((err as any)?.code === PG_FK_VIOLATION) {
        throw new BadRequestException('Invalid activeVersionId');
      }
      throw err;
    }
    return this.repo.findOne({ where: { id, organizationId: orgId } });
  }

  async deleteService(id: string, orgId: string): Promise<void> {
    await this.repo.manager.transaction(async (em) => {
      await em.update(
        Service,
        { id, organizationId: orgId },
        { activeVersionId: null },
      );
      await em.delete(ServiceVersion, { serviceId: id, organizationId: orgId });
      await em.delete(Service, { id, organizationId: orgId });
    });
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
    await this.repo.manager.transaction(async (em) => {
      await em.update(
        Service,
        { id: serviceId, organizationId: orgId, activeVersionId: versionId },
        { activeVersionId: null },
      );
      await em.delete(ServiceVersion, {
        id: versionId,
        serviceId,
        organizationId: orgId,
      });
    });
  }
}
