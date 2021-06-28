import { Complaint } from '../entities/complaint.entity';
import { Hospital } from '../entities/hospital.entity';
import { Payment } from '../entities/payment.entity';
import { Admission } from '../entities/admission.entity';
import { User } from '../entities/user.entity';
import {
  Connection,
  ConnectionManager,
  ConnectionOptions,
  createConnection,
  getConnectionManager,
} from 'typeorm';

const entities = [Complaint, Hospital, User, Payment, Admission];

export class Database {
  private connectionManager: ConnectionManager;

  constructor() {
    this.connectionManager = getConnectionManager();
  }

  public async getConnection(name: string): Promise<Connection> {
    const CONNECTION_NAME: string = name;
    let connection: Connection;
    const hasConnection = this.connectionManager.has(CONNECTION_NAME);
    if (hasConnection) {
      connection = this.connectionManager.get(CONNECTION_NAME);
      if (!connection.isConnected) {
        connection = await connection.connect();
      }
    } else {
      const connectionOptions: ConnectionOptions = {
        name: 'default',
        type: 'postgres',
        url: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
        entities: [...entities],
        synchronize: false,
        migrations: [__dirname + '/migrations/**/*.ts'],
        migrationsTableName: 'migrations_typeorm',
        // migrationsRun: buil,
      };
      connection = await createConnection(connectionOptions);
    }
    return connection;
  }
}
