import { Injectable } from '@nestjs/common';
import { Connection, EntityNotFoundError } from 'typeorm';
import { Admission } from '../entities/admission.entity';
import {
  CreateAdmissionInput,
  DeletionResponse,
  DeletionResult,
  UpdateAdmissionInput,
} from '../graphql-types';
import { PaginatedList, ListQueryOptions } from '../lib/common-types';
import { patchEntity } from '../lib/patch-entity';

@Injectable()
export class AdmissionService {
  constructor(private connection: Connection) {}

  findAll(
    options?: ListQueryOptions<Admission>,
  ): Promise<PaginatedList<Admission>> {
    return this.connection
      .getRepository(Admission)
      .findAndCount({
        relations: ['hospital', 'payments'],
      })
      .then(([items, totalItems]) => ({
        items,
        totalItems,
      }));
  }

  findOne(admissionId: number): Promise<Admission | undefined> {
    return this.connection.getRepository(Admission).findOne(admissionId, {
      relations: ['hospital', 'payments'],
    });
  }

  async create(input: CreateAdmissionInput): Promise<Admission> {
    const admission = new Admission(input);
    const newAdmission = await this.connection
      .getRepository(Admission)
      .save(admission);
    return this.findOne(newAdmission.id);
  }

  async update(input: UpdateAdmissionInput): Promise<Admission> {
    const admission = await this.findOne(input.id);
    if (!admission) {
      throw new EntityNotFoundError('Admission', input.id);
    }
    const updatedAdmission = patchEntity(admission, input);
    await this.connection
      .getRepository(Admission)
      .save(updatedAdmission, { reload: false });
    return this.findOne(admission.id);
  }
  async delete(id: number): Promise<DeletionResponse> {
    const admission = await this.connection
      .getRepository(Admission)
      .findOneOrFail(id);
    try {
      await this.connection.getRepository(Admission).remove(admission);
      return {
        result: DeletionResult.DELETED,
      };
    } catch (e) {
      return {
        result: DeletionResult.NOT_DELETED,
        message: e.toString(),
      };
    }
  }
}
