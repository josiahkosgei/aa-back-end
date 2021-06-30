import { Injectable } from '@nestjs/common';
import { Connection, EntityNotFoundError } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import {
  CreatePaymentInput,
  DeletionResponse,
  DeletionResult,
  UpdatePaymentInput,
} from '../graphql-types';
import { PaginatedList, ListQueryOptions } from '../lib/common-types';
import { patchEntity } from '../lib/patch-entity';
import { RevenueStats } from '../resolvers/dto/revenue-stats';

@Injectable()
export class PaymentService {
  constructor(private connection: Connection) {}

  findAll(
    options?: ListQueryOptions<Payment>,
  ): Promise<PaginatedList<Payment>> {
    return this.connection
      .getRepository(Payment)
      .findAndCount({
        relations: ['hospital', 'payments'],
      })
      .then(([items, totalItems]) => ({
        items,
        totalItems,
      }));
  }

  findOne(paymentId: number): Promise<Payment | undefined> {
    return this.connection.getRepository(Payment).findOne(paymentId, {
      relations: ['hospital', 'payments'],
    });
  }

  async create(input: CreatePaymentInput): Promise<Payment> {
    const payment = new Payment(input);
    payment.createdAt = new Date();
    payment.updatedAt = new Date();
    const newPayment = await this.connection
      .getRepository(Payment)
      .save(payment);
    return this.findOne(newPayment.id);
  }

  async update(input: UpdatePaymentInput): Promise<Payment> {
    const payment = await this.findOne(input.id);
    payment.updatedAt = new Date();
    if (!payment) {
      throw new EntityNotFoundError('Payment', input.id);
    }
    const updatedPayment = patchEntity(payment, input);
    await this.connection
      .getRepository(Payment)
      .save(updatedPayment, { reload: false });
    return this.findOne(payment.id);
  }
  async delete(id: number): Promise<DeletionResponse> {
    const payment = await this.connection
      .getRepository(Payment)
      .findOneOrFail(id);
    try {
      await this.connection.getRepository(Payment).remove(payment);
      return {
        result: DeletionResult.DELETED,
      };
    } catch (e) {
      return {
        result: DeletionResult.NOT_DELETED,
        message: e.toString(),
      };
    }
  }
  async getRevenueStats(): Promise<Array<RevenueStats>> {
    const result: RevenueStats[] = await this.connection.getRepository(Payment)
      .query(`select 
      ROW_NUMBER () OVER (ORDER BY t.month) as a,
      t.year,
      t.month,
      t.revenue as b,
      sum(t.revenue) OVER (PARTITION BY t.year
                               ORDER BY t.year) AS totalrevenue
      from (
      SELECT (to_char("createdAt", 'YYYY')) as year,(to_char("createdAt", 'YYYY-MM')) as month,SUM(amount) as revenue
      FROM payment
      GROUP BY (to_char("createdAt", 'YYYY-MM')),(to_char("createdAt", 'YYYY'))
      Order by max("createdAt")
      ) as t`);
    return result;
  }
}
