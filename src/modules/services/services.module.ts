import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceVersion } from '../service-versions/service-version.entity';
import { Service } from './service.entity';
import { ServicesController } from './services.controller';
import { ServicesRepository } from './services.repository';
import { ServicesService } from './services.service';

@Module({
  imports: [TypeOrmModule.forFeature([Service, ServiceVersion])],
  controllers: [ServicesController],
  providers: [ServicesService, ServicesRepository],
  exports: [ServicesRepository],
})
export class ServicesModule {}
