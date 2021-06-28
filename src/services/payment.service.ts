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
    const newPayment = await this.connection
      .getRepository(Payment)
      .save(payment);
    return this.findOne(newPayment.id);
  }

  async update(input: UpdatePaymentInput): Promise<Payment> {
    const payment = await this.findOne(input.id);
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
}
