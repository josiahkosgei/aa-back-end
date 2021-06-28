import { Entity, Column, OneToMany } from 'typeorm';
import { Admission } from '.';
import { BaseEntity } from './base.entity';
import { Complaint } from './complaint.entity';
import { DeepPartial } from '../lib/common-types';

/**
 * @description
 * A Hospital represents a single hospital and complaints reported at the hospital
 * defined by the {@link Complaint} type.
 *
 */
@Entity()
export class Hospital extends BaseEntity {
  constructor(input?: DeepPartial<Hospital>) {
    super(input);
  }

  @Column()
  name: string;

  @OneToMany(() => Complaint, (complaintEntity) => complaintEntity.assignedUser)
  hospitalComplaints: Complaint[];

  @OneToMany(() => Admission, (complaintEntity) => complaintEntity.hospital)
  admissions: Admission[];
}
