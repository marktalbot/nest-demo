import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddServiceIndexes1776049511390 implements MigrationInterface {
  name = 'AddServiceIndexes1776049511390';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_services_organizationId_name" ON "services" ("organizationId", "name")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_services_organizationId_createdAt" ON "services" ("organizationId", "createdAt")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_service_versions_serviceId_organizationId" ON "service_versions" ("serviceId", "organizationId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "IDX_service_versions_serviceId_organizationId"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_services_organizationId_createdAt"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_services_organizationId_name"`,
    );
  }
}
