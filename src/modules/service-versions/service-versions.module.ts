import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from '../services/service.entity';
import { ServiceVersion } from './service-version.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceVersion, Service])],
})
export class ServiceVersionsModule {}
