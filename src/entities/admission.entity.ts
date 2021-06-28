import { Entity, OneToMany, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Hospital } from '.';
import { BaseEntity } from './base.entity';
import { Payment } from './payment.entity';
import { DeepPartial } from '../lib/common-types';

/**
 * @description
 * A Admission represents a single hospital visit by a patient
 *
 */
@Entity()
export class Admission extends BaseEntity {
  constructor(input?: DeepPartial<Admission>) {
    super(input);
  }
  @Column()
  hospitalId: number;

  @ManyToOne(() => Hospital, (hospitalEntity) => hospitalEntity.admissions)
  @JoinColumn({ name: 'hospitalId' })
  hospital: Hospital;

  @OneToMany(() => Payment, (complaintPayment) => complaintPayment.admission)
  payments: Payment[];
}
