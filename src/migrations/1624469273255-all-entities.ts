import { MigrationInterface, QueryRunner } from 'typeorm';

export class allEntities1624469273255 implements MigrationInterface {
  name = 'allEntities1624469273255';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS  "hospital" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP, "updatedAt" TIMESTAMP, "name" character varying NOT NULL, CONSTRAINT "PK_10f19e0bf17ded693ea0da07d95" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "customer_response" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP, "updatedAt" TIMESTAMP, "answer" integer NOT NULL, "complaintId" integer NOT NULL, CONSTRAINT "PK_57ddf944602106e6a68ab921043" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "complaint" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP, "updatedAt" TIMESTAMP, "description" character varying NOT NULL, "category" character varying NOT NULL, "state" character varying NOT NULL, "assignedUserId" integer NOT NULL, "hospitalId" integer NOT NULL, CONSTRAINT "PK_a9c8dbc2ab4988edcc2ff0a7337" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP, "updatedAt" TIMESTAMP, "name" character varying NOT NULL, "email" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "payment" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP, "updatedAt" TIMESTAMP, "admissionId" integer NOT NULL, "amount" integer NOT NULL, "method" character varying NOT NULL, CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "admission" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP, "updatedAt" TIMESTAMP, "hospitalId" integer NOT NULL, CONSTRAINT "PK_6e91be345099f3da80fb2cc0d9e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `DO $$ 
      BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_14f4ddf7536361abd62e8c4ee87') THEN 
      ALTER TABLE "customer_response" ADD CONSTRAINT "FK_14f4ddf7536361abd62e8c4ee87" FOREIGN KEY ("complaintId") REFERENCES "complaint"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
      END IF;
      END;
      $$`,
    );
    await queryRunner.query(
      `DO $$ 
      BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_e68def0f96d44c3d33e4a65ca54') THEN 
      ALTER TABLE "complaint" ADD CONSTRAINT "FK_e68def0f96d44c3d33e4a65ca54" FOREIGN KEY ("assignedUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
      END IF;
      END;
      $$`,
    );
    await queryRunner.query(
      `DO $$ 
      BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_97e1d4a5bbbf0696656ab69db71') THEN 
      ALTER TABLE "complaint" ADD CONSTRAINT "FK_97e1d4a5bbbf0696656ab69db71" FOREIGN KEY ("hospitalId") REFERENCES "hospital"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
      END IF;
      END;
      $$`,
    );
    await queryRunner.query(
      `DO $$ 
      BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_e1a5d7f67dfea472342407920e3') THEN 
      ALTER TABLE "payment" ADD CONSTRAINT "FK_e1a5d7f67dfea472342407920e3" FOREIGN KEY ("admissionId") REFERENCES "admission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
      END IF;
      END;
      $$`,
    );
    await queryRunner.query(
      `DO $$ 
      BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_c6fe440a7c92221349081c622f4') THEN 
      ALTER TABLE "admission" ADD CONSTRAINT "FK_c6fe440a7c92221349081c622f4" FOREIGN KEY ("hospitalId") REFERENCES "hospital"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
      END IF;
      END;
      $$`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admission" DROP CONSTRAINT "FK_c6fe440a7c92221349081c622f4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" DROP CONSTRAINT "FK_e1a5d7f67dfea472342407920e3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "complaint" DROP CONSTRAINT "FK_97e1d4a5bbbf0696656ab69db71"`,
    );
    await queryRunner.query(
      `ALTER TABLE "complaint" DROP CONSTRAINT "FK_e68def0f96d44c3d33e4a65ca54"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_response" DROP CONSTRAINT "FK_14f4ddf7536361abd62e8c4ee87"`,
    );
    await queryRunner.query(`DROP TABLE "admission"`);
    await queryRunner.query(`DROP TABLE "payment"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "complaint"`);
    await queryRunner.query(`DROP TABLE "customer_response"`);
    await queryRunner.query(`DROP TABLE "hospital"`);
  }
}
