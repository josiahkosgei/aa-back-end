import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CustomerResponse } from '../entities/customer-response.entity';
import { PaginatedList } from '../lib/common-types';
import { CreateCustomerResponseInput } from '../graphql-types';

@Injectable()
export class CustomerResponseService {
  constructor(private connection: Connection) {}

  findAll(): Promise<PaginatedList<CustomerResponse>> {
    return this.connection
      .getRepository(CustomerResponse)
      .findAndCount({
        relations: ['complaint'],
      })
      .then(([items, totalItems]) => ({
        items,
        totalItems,
      }));
  }

  findOne(customerResponseId: number): Promise<CustomerResponse | undefined> {
    return this.connection
      .getRepository(CustomerResponse)
      .findOne(customerResponseId, {
        relations: ['complaint'],
      });
  }

  async create(input: CreateCustomerResponseInput): Promise<CustomerResponse> {
    const customerResponse = new CustomerResponse(input);
    customerResponse.createdAt = new Date();
    customerResponse.updatedAt = new Date();
    const newCustomerResponse = await this.connection
      .getRepository(CustomerResponse)
      .save(customerResponse);
    return this.findOne(newCustomerResponse.id);
  }
}
