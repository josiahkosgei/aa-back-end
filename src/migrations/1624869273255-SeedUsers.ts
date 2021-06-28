import { MigrationInterface, QueryRunner, Connection } from 'typeorm';
import { Database } from '../lib/database';
import { UserSeed } from './seed/user.seed';

export class SeedUsers1624869273255 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const connectionName = 'default';
    const database = new Database();
    const dbConn: Connection = await database.getConnection(connectionName);
    await dbConn.getRepository('user').save(UserSeed);
    await queryRunner.isTransactionActive;
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // drop migrations
    await queryRunner.isTransactionActive;
  }
}
