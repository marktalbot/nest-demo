import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['src/modules/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
});
