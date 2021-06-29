import { ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Entity, Column } from 'typeorm';
import { ComplaintCategory } from './complaint-category';
import { User } from './user.entity';
import { Hospital } from './hospital.entity';
import { BaseEntity } from './base.entity';
import { DeepPartial } from '../lib/common-types';
import { ComplaintState } from './complaint-state';
import { CustomerResponse } from './customer-response.entity';

/**
 * @description
 * A Complaint represents a single complaint and exists in a well-defined type
 * defined by the {@link ComplaintType} type,
 * assigned user defined by the {@link User} type and hopsital complaint reported at defined by the {@link Hospital} type
 *
 */
@Entity()
export class Complaint extends BaseEntity {
  constructor(input?: DeepPartial<Complaint>) {
    super(input);
  }
  @Column('varchar')
  description: string;

  @Column('varchar') category: ComplaintCategory;

  @Column('varchar') state: ComplaintState;

  @Column()
  assignedUserId: number;

  @ManyToOne(() => User, (userEntity) => userEntity.userComplaints)
  @JoinColumn({ name: 'assignedUserId' })
  assignedUser: User;

  @Column()
  hospitalId: number;

  @ManyToOne(
    () => Hospital,
    (hospitalEntity) => hospitalEntity.hospitalComplaints,
  )
  @JoinColumn({ name: 'hospitalId' })
  hospital: Hospital;

  @OneToOne(() => CustomerResponse, (c) => c.complaint)
  customerResponse: CustomerResponse;
}
