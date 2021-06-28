import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Complaint } from './complaint.entity';
import { DeepPartial } from '../lib/common-types';

/**
 * @description
 * A User represents a single user and complaints assigned to the user
 * defined by the {@link Complaint} type.
 *
 */
@Entity()
export class User extends BaseEntity {
  constructor(input?: DeepPartial<User>) {
    super(input);
  }
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  email: string;

  @OneToMany(() => Complaint, (complaintEntity) => complaintEntity.assignedUser)
  userComplaints: Complaint[];
}
