import { Entity, ManyToOne, Column, JoinColumn } from 'typeorm';
import { Admission } from '.';
import { BaseEntity } from './base.entity';
import { DeepPartial } from '../lib/common-types';

/**
 * @description
 * A Payment represents a single payment by a patient
 *
 */
@Entity()
export class Payment extends BaseEntity {
  constructor(input?: DeepPartial<Payment>) {
    super(input);
  }
  @Column()
  admissionId: number;

  @ManyToOne(() => Admission, (admissionEntity) => admissionEntity.payments)
  @JoinColumn({ name: 'admissionId' })
  admission: Admission;

  @Column()
  amount: number;

  @Column()
  method: string;
}
