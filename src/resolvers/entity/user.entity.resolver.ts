import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { User } from '../../entities/user.entity';
import { Connection } from 'typeorm';
import { Complaint } from '../../entities/complaint.entity';

@Resolver('User')
export class UserEntityResolver {
  constructor(private connection: Connection) {}

  @ResolveField()
  async userComplaints(@Parent() userEntity: User) {
    let userComplaints: Complaint[] | null = userEntity.userComplaints;
    if (!userComplaints) {
      const userWithAssignedUser = await this.connection
        .getRepository(User)
        .findOne(userEntity.id, {
          relations: ['userComplaints'],
        });
      if (userWithAssignedUser) {
        userComplaints = userWithAssignedUser.userComplaints;
      }
    }
    if (userComplaints) {
      return userComplaints;
    }
  }
}
