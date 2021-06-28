import { MigrationInterface, QueryRunner, Connection } from 'typeorm';
import { Database } from '../lib/database';
import { PaymentSeed } from './seed/payment.seed';

export class SeedPayments1624870077101 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const connectionName = 'default';
    const database = new Database();
    const dbConn: Connection = await database.getConnection(connectionName);
    await dbConn.getRepository('payment').save(PaymentSeed);
    await queryRunner.isTransactionActive;
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // drop migrations
    await queryRunner.isTransactionActive;
  }
}
