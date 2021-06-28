import { Injectable } from '@nestjs/common';
import { Connection, EntityNotFoundError } from 'typeorm';
import { Hospital } from '../entities/hospital.entity';
import {
  CreateHospitalInput,
  DeletionResponse,
  DeletionResult,
  UpdateHospitalInput,
} from '../graphql-types';
import { PaginatedList, ListQueryOptions } from '../lib/common-types';
import { patchEntity } from '../lib/patch-entity';

@Injectable()
export class HospitalService {
  constructor(private connection: Connection) {}

  findAll(
    options?: ListQueryOptions<Hospital>,
  ): Promise<PaginatedList<Hospital>> {
    return this.connection
      .getRepository(Hospital)
      .findAndCount({
        relations: ['hospitalComplaints', 'admissions'],
      })
      .then(([items, totalItems]) => ({
        items,
        totalItems,
      }));
  }

  findOne(hospitalId: number): Promise<Hospital | undefined> {
    return this.connection.getRepository(Hospital).findOne(hospitalId, {
      relations: ['hospitalComplaints', 'admissions'],
    });
  }

  async create(input: CreateHospitalInput): Promise<Hospital> {
    const hospital = new Hospital(input);
    console.log('hospital', hospital);
    const newHospital = await this.connection
      .getRepository(Hospital)
      .save(hospital);
    return this.findOne(newHospital.id);
  }

  async update(input: UpdateHospitalInput): Promise<Hospital> {
    const hospital = await this.findOne(input.id);
    if (!hospital) {
      throw new EntityNotFoundError('Hospital', input.id);
    }
    const updatedHospital = patchEntity(hospital, input);
    await this.connection
      .getRepository(Hospital)
      .save(updatedHospital, { reload: false });
    return this.findOne(hospital.id);
  }
  async delete(id: number): Promise<DeletionResponse> {
    const hospital = await this.connection
      .getRepository(Hospital)
      .findOneOrFail(id);
    try {
      await this.connection.getRepository(Hospital).remove(hospital);
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
