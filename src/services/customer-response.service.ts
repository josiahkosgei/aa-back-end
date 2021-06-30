import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CustomerResponse } from '../entities/customer-response.entity';
import { PaginatedList } from '../lib/common-types';
import { CreateCustomerResponseInput } from '../graphql-types';
import { UserStats } from '../resolvers/dto/user-stats';

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

  async getUserStats(): Promise<Array<UserStats>> {
    const result: UserStats[] = await this.connection
      .getRepository(CustomerResponse)
      .query(
        `select 
        us.name,
        t.nps,
        t.reportedissues,
        t.completed, 
        round(((cast(t.completed as float) / cast(t.reportedissues as float)) * 100)) as efficiency 
        from (
                select 
            co."assignedUserId"
            ,SUM(cr.answer-1) / COUNT(cr.answer) as nps
                ,sum(case co."state" when 'resolved' then 1 else 0 end) as completed
            ,count(co.*) as reportedissues
                from complaint co
            left join customer_response cr on cr."complaintId" = co.id
            group by "assignedUserId"
        ) as t
        inner join "user" us on us.id = t."assignedUserId";`,
      );
    return result;
  }
}
