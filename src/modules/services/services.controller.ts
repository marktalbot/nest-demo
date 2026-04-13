import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ListServicesQueryDto } from './dto/list-services-query.dto';
import { ServicesService } from './services.service';

@Controller('organizations/:orgId/services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  findAll(
    @Param('orgId', ParseUUIDPipe) orgId: string,
    @Query() query: ListServicesQueryDto,
  ) {
    return this.servicesService.findAll(orgId, query);
  }

  @Get(':id')
  findOne(
    @Param('orgId', ParseUUIDPipe) orgId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.servicesService.findOne(orgId, id);
  }

  @Get(':id/versions')
  findVersions(
    @Param('orgId', ParseUUIDPipe) orgId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.servicesService.findVersions(orgId, id);
  }

  @Post()
  create(
    @Param('orgId', ParseUUIDPipe) orgId: string,
    @Body() dto: CreateServiceDto,
  ) {
    return this.servicesService.create(orgId, dto);
  }

  @Patch(':id')
  update(
    @Param('orgId', ParseUUIDPipe) orgId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateServiceDto,
  ) {
    return this.servicesService.update(orgId, id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(
    @Param('orgId', ParseUUIDPipe) orgId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.servicesService.delete(orgId, id);
  }
}
