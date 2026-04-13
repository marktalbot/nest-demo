import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [],
      migrations: ['dist/migrations/*{.ts,.js}'],
      migrationsRun: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
