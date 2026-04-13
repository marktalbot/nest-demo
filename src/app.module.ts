import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Organization } from './modules/organizations/organization.entity';
import { ServiceVersion } from './modules/service-versions/service-version.entity';
import { Service } from './modules/services/service.entity';
import { User } from './modules/users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [Organization, User, Service, ServiceVersion],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      migrationsRun: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
