import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesModule } from '../services/services.module';
import { Service } from '../services/service.entity';
import { ServiceVersion } from './service-version.entity';
import { ServiceVersionsController } from './service-versions.controller';
import { ServiceVersionsService } from './service-versions.service';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceVersion, Service]), ServicesModule],
  controllers: [ServiceVersionsController],
  providers: [ServiceVersionsService],
})
export class ServiceVersionsModule {}
