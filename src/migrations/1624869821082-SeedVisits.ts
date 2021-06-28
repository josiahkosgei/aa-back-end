import { MigrationInterface, QueryRunner, Connection } from 'typeorm';
import { Database } from '../lib/database';
import { AdmissionSeed } from './seed/admission.seed';

export class SeedVisits1624869821082 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const connectionName = 'default';
    const database = new Database();
    const dbConn: Connection = await database.getConnection(connectionName);
    await dbConn.getRepository('admission').save(AdmissionSeed);
    await queryRunner.isTransactionActive;
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // drop migrations
    await queryRunner.isTransactionActive;
  }
}
