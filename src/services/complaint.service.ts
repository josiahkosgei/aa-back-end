import { Injectable } from '@nestjs/common';
import { Connection, EntityNotFoundError } from 'typeorm';
import { Complaint } from '../entities/complaint.entity';
import { PaginatedList } from '../lib/common-types';
import {
  ReportComplaintInput,
  DeletionResponse,
  DeletionResult,
  UpdateComplaintInput,
} from '../graphql-types';

import { patchEntity } from '../lib/patch-entity';
import { ComplaintCategory } from '../entities/complaint-category';
import { AssignComplaintToUserInput } from '../graphql-types';

@Injectable()
export class ComplaintService {
  constructor(private connection: Connection) {}

  findAll(): Promise<PaginatedList<Complaint>> {
    return this.connection
      .getRepository(Complaint)
      .findAndCount({
        relations: ['assignedUser', 'hospital'],
      })
      .then(([items, totalItems]) => ({
        items,
        totalItems,
      }));
  }

  findOne(complaintId: number): Promise<Complaint | undefined> {
    return this.connection.getRepository(Complaint).findOne(complaintId, {
      relations: ['assignedUser', 'hospital'],
    });
  }

  async create(input: ReportComplaintInput): Promise<Complaint> {
    const complaint = new Complaint({
      createdAt: `${new Date()}`,
      updatedAt: `${new Date()}`,
      description: input.description,
      category: input.category as ComplaintCategory,
    });

    complaint.state = 'new';
    const newComplaint = await this.connection
      .getRepository(Complaint)
      .save(complaint);
    return this.findOne(newComplaint.id);
  }

  async assignComplaintToUser(
    input: AssignComplaintToUserInput,
  ): Promise<Complaint> {
    const complaint = await this.findOne(input.id);
    if (!complaint) {
      throw new EntityNotFoundError('Complaint', input.id);
    }
    const updatedComplaint = patchEntity(complaint, {
      assignedUser: complaint.assignedUser,
    });
    await this.connection
      .getRepository(Complaint)
      .save(updatedComplaint, { reload: false });
    return this.findOne(complaint.id);
  }

  async update(input: UpdateComplaintInput): Promise<Complaint> {
    const complaint = await this.findOne(input.id);
    complaint.updatedAt = new Date();

    if (!complaint) {
      throw new EntityNotFoundError('Complaint', input.id);
    }
    const updatedComplaint = patchEntity(complaint, {
      description: input.description,
      category: input.category as ComplaintCategory,
    });
    await this.connection
      .getRepository(Complaint)
      .save(updatedComplaint, { reload: false });
    return this.findOne(complaint.id);
  }
  async delete(id: number): Promise<DeletionResponse> {
    const complaint = await this.connection
      .getRepository(Complaint)
      .findOneOrFail(id);
    if (!complaint) {
      throw new EntityNotFoundError('Complaint', id);
    }
    try {
      await this.connection.getRepository(Complaint).remove(complaint);
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
