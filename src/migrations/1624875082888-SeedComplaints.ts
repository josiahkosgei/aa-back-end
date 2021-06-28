import { MigrationInterface, QueryRunner, Connection } from 'typeorm';
import { ComplaintSeed } from './seed/complaints.seed';
import { Database } from '../lib/database';

export class SeedComplaints1624875082888 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const connectionName = 'default';
    const database = new Database();
    const dbConn: Connection = await database.getConnection(connectionName);
    await dbConn.getRepository('complaint').save(ComplaintSeed);
    await queryRunner.isTransactionActive;
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // drop migrations
    await queryRunner.isTransactionActive;
  }
}
