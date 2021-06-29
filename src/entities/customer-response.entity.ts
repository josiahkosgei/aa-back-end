import { JoinColumn, OneToOne } from 'typeorm';
import { Entity, Column } from 'typeorm';
import { Complaint } from './complaint.entity';
import { BaseEntity } from './base.entity';
import { DeepPartial } from '../lib/common-types';

/**
 * @description
 * A CustomerResponse represents a single complaint and exists in a well-defined type
 * defined by the {@link CustomerResponseType} type,
 * assigned user defined by the {@link User} type and hopsital complaint reported at defined by the {@link Complaint} type
 *
 */
@Entity()
export class CustomerResponse extends BaseEntity {
  constructor(input?: DeepPartial<CustomerResponse>) {
    super(input);
  }

  @Column()
  answer: number;

  @Column({ unique: false })
  complaintId: number;

  @OneToOne(() => Complaint, (c) => c.customerResponse)
  @JoinColumn({ name: 'complaintId' })
  complaint: Complaint;
}
