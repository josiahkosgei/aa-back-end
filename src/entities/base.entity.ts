import { DeepPartial } from '../lib/common-types';
import { Column } from 'typeorm';
import {
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * @description
 * This is the base class from which all entities inherit
 *
 *  */
export abstract class BaseEntity {
  protected constructor(input?: DeepPartial<BaseEntity>) {
    if (input) {
      for (const [key, value] of Object.entries(input)) {
        (this as any)[key] = value;
      }
    }
  }
  @PrimaryGeneratedColumn() id: number;
  @Column({ nullable: true })
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;
}
