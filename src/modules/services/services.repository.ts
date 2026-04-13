import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceVersion } from '../service-versions/service-version.entity';
import { Service } from './service.entity';
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
}
