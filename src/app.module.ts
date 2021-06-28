import { Module } from '@nestjs/common';
import { ComplaintService, HospitalService, UserService } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admission, Complaint, Hospital, Payment, User } from './entities';
import {
  ComplaintResolver,
  HospitalResolver,
  UserResolver,
} from './resolvers/api';
import { configureGraphQLModule } from './lib/graphql.utility';
import { UserEntityResolver } from './resolvers/entity/user.entity.resolver';
import { AdmissionEntityResolver } from './resolvers/entity/admission.entity.resolver';
import { PaymentResolver } from './resolvers/api/payment.resolver';
import { AdmissionResolver } from './resolvers/api/admission.resolver';
import { PaymentEntityResolver } from './resolvers/entity/payment.entity.resolver';
import { AdmissionService } from './services/admission.service';
import { PaymentService } from './services/payment.service';
import {
  HospitalEntityResolver,
  ComplaintEntityResolver,
} from './resolvers/entity';

const apiResolvers = [
  ComplaintResolver,
  HospitalResolver,
  UserResolver,
  AdmissionResolver,
  PaymentResolver,
];

const entitiesResolvers = [
  ComplaintEntityResolver,
  HospitalEntityResolver,
  AdmissionEntityResolver,
  UserEntityResolver,
  PaymentEntityResolver,
];

const services = [
  ComplaintService,
  HospitalService,
  UserService,
  AdmissionService,
  PaymentService,
];
const entities = [Complaint, Hospital, User, Payment, Admission];

@Module({
  imports: [
    configureGraphQLModule(() => ({
      apiType: 'api',
      apiPath: 'api',
      playground: true,
      debug: false,
      typePaths: ['./**/*.graphql'],
    })),
    TypeOrmModule.forRoot({
      name: 'default',
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
      entities: [...entities],
      synchronize: true,
      migrations: [__dirname + '/migrations/**/*.ts'],
      migrationsTableName: 'migrations_typeorm',
      migrationsRun: true,
    }),
  ],
  providers: [...services, ...apiResolvers, ...entitiesResolvers],
})
export class AppModule {}
