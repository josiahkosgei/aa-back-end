import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Complaint } from '../../entities/complaint.entity';
import { User } from '../../entities/user.entity';
import { Connection } from 'typeorm';
import { Hospital } from '../../entities/hospital.entity';
import { CustomerResponse } from '../../entities/customer-response.entity';

@Resolver('Complaint')
export class ComplaintEntityResolver {
  constructor(private connection: Connection) {}

  @ResolveField()
  async assignedUser(@Parent() complaintEntity: Complaint) {
    let assignedUser: User | null = complaintEntity.assignedUser;
    if (!assignedUser) {
      const complaintWithAssignedUser = await this.connection
        .getRepository(Complaint)
        .findOne(complaintEntity.id, {
          relations: ['assignedUser'],
        });
      if (complaintWithAssignedUser) {
        assignedUser = complaintWithAssignedUser.assignedUser;
      }
    }
    if (assignedUser) {
      return assignedUser;
    }
  }

  @ResolveField()
  async hospital(@Parent() complaintEntity: Complaint) {
    let hospital: Hospital | null = complaintEntity.hospital;
    if (!hospital) {
      const complaintWithHospital = await this.connection
        .getRepository(Complaint)
        .findOne(complaintEntity.id, {
          relations: ['complaintHistory'],
        });
      if (complaintWithHospital) {
        hospital = complaintWithHospital.hospital;
      }
    }
    if (hospital) {
      return hospital;
    }
  }
  @ResolveField()
  async customerResponse(@Parent() complaintEntity: Complaint) {
    let customerResponse: CustomerResponse | null =
      complaintEntity.customerResponse;
    if (!customerResponse) {
      const customerResponseWithAssignedCustomerResponse = await this.connection
        .getRepository(Complaint)
        .findOne(complaintEntity.id, {
          relations: ['customerResponse'],
        });
      if (customerResponseWithAssignedCustomerResponse) {
        customerResponse =
          customerResponseWithAssignedCustomerResponse.customerResponse;
      }
    }
    if (customerResponse) {
      return customerResponse;
    }
  }
}
