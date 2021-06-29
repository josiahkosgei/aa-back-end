import { MigrationInterface, QueryRunner, Connection } from 'typeorm';
import { Database } from '../lib/database';
import { CustomerResponseSeed } from './seed/responses.seed';

export class SeedResponses1624973883938 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const connectionName = 'default';
    const database = new Database();
    const dbConn: Connection = await database.getConnection(connectionName);
    await dbConn.getRepository('customer_response').save(CustomerResponseSeed);
    await queryRunner.isTransactionActive;
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // drop migrations
    await queryRunner.isTransactionActive;
  }
}
