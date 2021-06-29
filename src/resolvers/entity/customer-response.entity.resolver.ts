import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { CustomerResponse } from '../../entities/customer-response.entity';
import { Connection } from 'typeorm';
import { Complaint } from '../../entities/complaint.entity';

@Resolver('CustomerResponse')
export class CustomerResponseEntityResolver {
  constructor(private connection: Connection) {}

  @ResolveField()
  async complaint(@Parent() customerResponseEntity: CustomerResponse) {
    let complaint: Complaint | null = customerResponseEntity.complaint;
    if (!complaint) {
      const customerResponseWithAssignedCustomerResponse = await this.connection
        .getRepository(CustomerResponse)
        .findOne(customerResponseEntity.id, {
          relations: ['complaint'],
        });
      if (customerResponseWithAssignedCustomerResponse) {
        complaint = customerResponseWithAssignedCustomerResponse.complaint;
      }
    }
    if (complaint) {
      return complaint;
    }
  }
}
