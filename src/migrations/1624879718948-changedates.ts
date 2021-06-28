import { MigrationInterface, QueryRunner } from 'typeorm';

export class changedates1624879718948 implements MigrationInterface {
  name = 'changedates1624879718948';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "hospital" ALTER COLUMN "createdAt" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospital" ALTER COLUMN "createdAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospital" ALTER COLUMN "updatedAt" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospital" ALTER COLUMN "updatedAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "complaint" ALTER COLUMN "createdAt" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "complaint" ALTER COLUMN "createdAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "complaint" ALTER COLUMN "updatedAt" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "complaint" ALTER COLUMN "updatedAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "createdAt" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "updatedAt" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ALTER COLUMN "createdAt" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ALTER COLUMN "createdAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ALTER COLUMN "updatedAt" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ALTER COLUMN "updatedAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "admission" ALTER COLUMN "createdAt" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "admission" ALTER COLUMN "createdAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "admission" ALTER COLUMN "updatedAt" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "admission" ALTER COLUMN "updatedAt" SET DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admission" ALTER COLUMN "updatedAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "admission" ALTER COLUMN "updatedAt" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "admission" ALTER COLUMN "createdAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "admission" ALTER COLUMN "createdAt" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ALTER COLUMN "updatedAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ALTER COLUMN "updatedAt" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ALTER COLUMN "createdAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ALTER COLUMN "createdAt" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "updatedAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "updatedAt" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "createdAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "createdAt" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "complaint" ALTER COLUMN "updatedAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "complaint" ALTER COLUMN "updatedAt" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "complaint" ALTER COLUMN "createdAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "complaint" ALTER COLUMN "createdAt" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospital" ALTER COLUMN "updatedAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospital" ALTER COLUMN "updatedAt" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospital" ALTER COLUMN "createdAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospital" ALTER COLUMN "createdAt" DROP NOT NULL`,
    );
  }
}
