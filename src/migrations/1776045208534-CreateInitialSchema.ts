import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialSchema1776045208534 implements MigrationInterface {
  name = 'CreateInitialSchema1776045208534';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "organizations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6b031fcd0863e3f6b44230163f9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "service_versions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "organizationId" uuid NOT NULL, "serviceId" uuid NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2cdf123a2486f00862495e81101" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "services" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "organizationId" uuid NOT NULL, "name" character varying NOT NULL, "description" text, "activeVersionId" uuid, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ba2d347a3168a296416c6c5ccb2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_versions" ADD CONSTRAINT "FK_a9c199f87231f886db9056e3bc3" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_versions" ADD CONSTRAINT "FK_b94e0f41ebbfefd949ac1f0f60e" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "services" ADD CONSTRAINT "FK_e8e52dffc3bcbf5d3a90364c7c5" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "services" ADD CONSTRAINT "FK_4b6b8c205395ac0e7ff74c849c4" FOREIGN KEY ("activeVersionId") REFERENCES "service_versions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "services" DROP CONSTRAINT "FK_4b6b8c205395ac0e7ff74c849c4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "services" DROP CONSTRAINT "FK_e8e52dffc3bcbf5d3a90364c7c5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_versions" DROP CONSTRAINT "FK_b94e0f41ebbfefd949ac1f0f60e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_versions" DROP CONSTRAINT "FK_a9c199f87231f886db9056e3bc3"`,
    );
    await queryRunner.query(`DROP TABLE "services"`);
    await queryRunner.query(`DROP TABLE "service_versions"`);
    await queryRunner.query(`DROP TABLE "organizations"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
