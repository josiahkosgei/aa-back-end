import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PaymentService } from '../../services/payment.service';
import { DeletionResponse } from '../../graphql-types';
import {
  MutationCreatePaymentArgs,
  MutationDeletePaymentArgs,
  PaginatedList,
} from '../../lib/common-types';
import { Payment } from '../../entities';
import { RevenueStats } from '../dto/revenue-stats';
import {
  MutationUpdatePaymentArgs,
  QueryPaymentsArgs,
} from '../../lib/common-types';

@Resolver('Payment')
export class PaymentResolver {
  constructor(private paymentService: PaymentService) {}

  @Query()
  payments(@Args() args: QueryPaymentsArgs): Promise<PaginatedList<Payment>> {
    return this.paymentService.findAll(args.options || undefined);
  }

  @Query()
  async payment(@Args('id') id: number): Promise<Payment | undefined> {
    return this.paymentService.findOne(id);
  }

  @Query()
  async revenueStats(): Promise<Array<RevenueStats>> {
    return await this.paymentService.getRevenueStats();
  }
  @Mutation()
  async createPayment(
    @Args() args: MutationCreatePaymentArgs,
  ): Promise<Payment> {
    return this.paymentService.create(args.input);
  }

  @Mutation()
  async updatePayment(
    @Args() args: MutationUpdatePaymentArgs,
  ): Promise<Payment> {
    return this.paymentService.update(args.input);
  }

  @Mutation()
  async deletePayment(
    @Args() args: MutationDeletePaymentArgs,
  ): Promise<DeletionResponse> {
    return this.paymentService.delete(args.input);
  }
}
