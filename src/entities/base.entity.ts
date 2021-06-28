import { DeepPartial } from '../lib/common-types';
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
  //  @Column({ nullable: true })
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
