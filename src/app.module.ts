import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './modules/organizations/organization.entity';
import { ServiceVersionsModule } from './modules/service-versions/service-versions.module';
import { ServiceVersion } from './modules/service-versions/service-version.entity';
import { ServicesModule } from './modules/services/services.module';
import { Service } from './modules/services/service.entity';
import { User } from './modules/users/user.entity';
import { UserOrganization } from './modules/users/user-organization.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [Organization, User, UserOrganization, Service, ServiceVersion],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      migrationsRun: true,
    }),
    ServicesModule,
    ServiceVersionsModule,
  ],
})
export class AppModule {}
