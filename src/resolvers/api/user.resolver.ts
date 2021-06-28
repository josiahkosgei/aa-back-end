import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '../../entities/user.entity';
import { UserService } from '../../services/user.service';
import { PaginatedList } from '../../lib/common-types';
import { DeletionResponse } from '../../graphql-types';
import {
  MutationCreateUserArgs,
  MutationUpdateUserArgs,
  MutationDeleteUserArgs,
} from '../../lib/common-types';

@Resolver('User')
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query()
  users(): Promise<PaginatedList<User>> {
    return this.userService.findAll();
  }

  @Query()
  async user(@Args('id') id: number): Promise<User | undefined> {
    return this.userService.findOne(id);
  }

  @Mutation()
  async createUser(@Args() args: MutationCreateUserArgs): Promise<User> {
    console.log('createUser', args.input);
    return this.userService.create(args.input);
  }

  @Mutation()
  async updateUser(@Args() args: MutationUpdateUserArgs): Promise<User> {
    return this.userService.update(args.input);
  }

  @Mutation()
  async deleteUser(
    @Args() args: MutationDeleteUserArgs,
  ): Promise<DeletionResponse> {
    return this.userService.delete(args.input);
  }
}
