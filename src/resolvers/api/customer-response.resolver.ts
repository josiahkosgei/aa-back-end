import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CustomerResponse } from '../../entities/customer-response.entity';
import { CustomerResponseService } from '../../services/customer-response.service';
import { PaginatedList } from '../../lib/common-types';
import { MutationCreateCustomerResponseArgs } from '../../lib/common-types';
import { UserStats } from '../dto/user-stats';

@Resolver('CustomerResponse')
export class CustomerResponseResolver {
  constructor(private customerResponseService: CustomerResponseService) {}

  @Query()
  customerResponses(): Promise<PaginatedList<CustomerResponse>> {
    return this.customerResponseService.findAll();
  }

  @Query()
  async customerResponse(
    @Args('id') id: number,
  ): Promise<CustomerResponse | undefined> {
    return this.customerResponseService.findOne(id);
  }

  @Query()
  async userStats(): Promise<Array<UserStats>> {
    return await this.customerResponseService.getUserStats();
  }

  @Mutation()
  async createCustomerResponse(
    @Args() args: MutationCreateCustomerResponseArgs,
  ): Promise<CustomerResponse> {
    console.log('createCustomerResponse', args.input);
    return this.customerResponseService.create(args.input);
  }
}
