import { MigrationInterface, QueryRunner, Connection } from 'typeorm';
import { Database } from '../lib/database';
import { HospitalSeed } from './seed/hospital.seed';

export class SeedHospitals1624869473255 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const connectionName = 'default';
    const database = new Database();
    const dbConn: Connection = await database.getConnection(connectionName);
    await dbConn.getRepository('hospital').save(HospitalSeed);
    await queryRunner.isTransactionActive;
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // drop migrations
    await queryRunner.isTransactionActive;
  }
}
