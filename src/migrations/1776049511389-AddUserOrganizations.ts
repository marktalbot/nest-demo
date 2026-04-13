import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserOrganizations1776049511389 implements MigrationInterface {
  name = 'AddUserOrganizations1776049511389';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_organizations" ("userId" uuid NOT NULL, "organizationId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_481a3d21c68396d6b180ab9795d" PRIMARY KEY ("userId", "organizationId"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_organizations" ADD CONSTRAINT "FK_11d4cd5202bd8914464f4bec379" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_organizations" ADD CONSTRAINT "FK_71997faba4726730e91d514138e" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_organizations" DROP CONSTRAINT "FK_71997faba4726730e91d514138e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_organizations" DROP CONSTRAINT "FK_11d4cd5202bd8914464f4bec379"`,
    );
    await queryRunner.query(`DROP TABLE "user_organizations"`);
  }
}
