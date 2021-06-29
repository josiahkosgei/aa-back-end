import { Injectable } from '@nestjs/common';
import {
  CreateUserInput,
  UpdateUserInput,
  DeletionResponse,
  DeletionResult,
} from '../graphql-types';
import { patchEntity } from 'src/lib/patch-entity';
import { Connection, EntityNotFoundError } from 'typeorm';
import { User } from '../entities/user.entity';
import { PaginatedList } from '../lib/common-types';

@Injectable()
export class UserService {
  constructor(private connection: Connection) {}

  findAll(): Promise<PaginatedList<User>> {
    return this.connection
      .getRepository(User)
      .findAndCount({
        relations: ['userComplaints'],
      })
      .then(([items, totalItems]) => ({
        items,
        totalItems,
      }));
  }

  findOne(userId: number): Promise<User | undefined> {
    return this.connection.getRepository(User).findOne(userId, {
      relations: ['userComplaints'],
    });
  }

  async create(input: CreateUserInput): Promise<User> {
    const user = new User(input);
    user.createdAt = new Date();
    user.updatedAt = new Date();
    const newUser = await this.connection.getRepository(User).save(user);
    return this.findOne(newUser.id);
  }

  async update(input: UpdateUserInput): Promise<User> {
    const user = await this.findOne(input.id);
    user.updatedAt = new Date();
    if (!user) {
      throw new EntityNotFoundError('User', input.id);
    }
    const updatedUser = patchEntity(user, input);
    await this.connection
      .getRepository(User)
      .save(updatedUser, { reload: false });
    return this.findOne(user.id);
  }
  async delete(id: number): Promise<DeletionResponse> {
    const user = await this.connection.getRepository(User).findOneOrFail(id);
    try {
      await this.connection.getRepository(User).remove(user);
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
