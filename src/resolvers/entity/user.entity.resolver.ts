import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { User } from '../../entities/user.entity';
import { Connection } from 'typeorm';
import { Complaint } from '../../entities/complaint.entity';

@Resolver('User')
export class UserEntityResolver {
  constructor(private connection: Connection) {}

  @ResolveField()
  async assignedComplaints(@Parent() userEntity: User) {
    let assignedComplaints: Complaint[] | null = userEntity.assignedComplaints;
    if (!assignedComplaints) {
      const userWithAssignedUser = await this.connection
        .getRepository(User)
        .findOne(userEntity.id, {
          relations: ['assignedComplaints'],
        });
      if (userWithAssignedUser) {
        assignedComplaints = userWithAssignedUser.assignedComplaints;
      }
    }
    if (assignedComplaints) {
      return assignedComplaints;
    }
  }
}
