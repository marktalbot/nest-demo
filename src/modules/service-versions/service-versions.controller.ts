import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateServiceVersionDto } from './dto/create-service-version.dto';
import { UpdateServiceVersionDto } from './dto/update-service-version.dto';
import { ServiceVersionsService } from './service-versions.service';

@Controller('organizations/:orgId/services/:serviceId/versions')
export class ServiceVersionsController {
  constructor(private readonly serviceVersionsService: ServiceVersionsService) {}

  @Post()
  create(
    @Param('orgId') orgId: string,
    @Param('serviceId') serviceId: string,
    @Body() dto: CreateServiceVersionDto,
  ) {
    return this.serviceVersionsService.create(orgId, serviceId, dto);
  }

  @Patch(':versionId')
  update(
    @Param('orgId') orgId: string,
    @Param('serviceId') serviceId: string,
    @Param('versionId') versionId: string,
    @Body() dto: UpdateServiceVersionDto,
  ) {
    return this.serviceVersionsService.update(orgId, serviceId, versionId, dto);
  }

  @Delete(':versionId')
  @HttpCode(204)
  delete(
    @Param('orgId') orgId: string,
    @Param('serviceId') serviceId: string,
    @Param('versionId') versionId: string,
  ) {
    return this.serviceVersionsService.delete(orgId, serviceId, versionId);
  }
}
