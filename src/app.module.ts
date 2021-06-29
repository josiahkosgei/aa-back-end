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
import { CustomerResponseResolver } from './resolvers/api/customer-response.resolver';
import {
  HospitalEntityResolver,
  ComplaintEntityResolver,
} from './resolvers/entity';
import { CustomerResponseEntityResolver } from './resolvers/entity/customer-response.entity.resolver';
import { CustomerResponseService } from './services/customer-response.service';
import { CustomerResponse } from './entities/customer-response.entity';

const apiResolvers = [
  ComplaintResolver,
  HospitalResolver,
  UserResolver,
  AdmissionResolver,
  PaymentResolver,
  CustomerResponseResolver,
];

const entitiesResolvers = [
  ComplaintEntityResolver,
  HospitalEntityResolver,
  AdmissionEntityResolver,
  UserEntityResolver,
  PaymentEntityResolver,
  CustomerResponseEntityResolver,
];

const services = [
  ComplaintService,
  HospitalService,
  UserService,
  AdmissionService,
  PaymentService,
  CustomerResponseService,
];
const entities = [
  Complaint,
  Hospital,
  User,
  Payment,
  Admission,
  CustomerResponse,
];

@Module({
  imports: [
    configureGraphQLModule(() => ({
      apiType: 'api',
      apiPath: 'api',
      playground: true,
      introspection: true,
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
