import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { Admission, Payment } from '../../entities';
import { Connection } from 'typeorm';

@Resolver('Payment')
export class PaymentEntityResolver {
  constructor(private connection: Connection) {}

  @ResolveField()
  async admission(@Parent() paymentEntity: Payment) {
    let admission: Admission | null = paymentEntity.admission;
    if (!admission) {
      const paymentWithAssignedPayment = await this.connection
        .getRepository(Payment)
        .findOne(paymentEntity.id, {
          relations: ['admission'],
        });
      if (paymentWithAssignedPayment) {
        admission = paymentWithAssignedPayment.admission;
      }
    }
    if (admission) {
      return admission;
    }
  }
}
