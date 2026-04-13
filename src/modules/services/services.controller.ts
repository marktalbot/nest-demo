import { Controller, Get, Param, Query } from '@nestjs/common';
import { ListServicesQueryDto } from './dto/list-services-query.dto';
import { ServicesService } from './services.service';

@Controller('organizations/:orgId/services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  findAll(@Param('orgId') orgId: string, @Query() query: ListServicesQueryDto) {
    return this.servicesService.findAll(orgId, query);
  }

  @Get(':id')
  findOne(@Param('orgId') orgId: string, @Param('id') id: string) {
    return this.servicesService.findOne(orgId, id);
  }

  @Get(':id/versions')
  findVersions(@Param('orgId') orgId: string, @Param('id') id: string) {
    return this.servicesService.findVersions(orgId, id);
  }
}
