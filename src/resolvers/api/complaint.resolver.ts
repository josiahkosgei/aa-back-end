import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Complaint } from '../../entities/complaint.entity';
import { ComplaintService } from '../../services/complaint.service';
import {
  PaginatedList,
  MutationCreateComplaintArgs,
  MutationUpdateComplaintArgs,
  MutationDeleteComplaintArgs,
} from '../../lib/common-types';
import { DeletionResponse } from '../../graphql-types';
import { MutationAssignComplaintToUserArgs } from '../../lib/common-types';
import { KeyComplaintsStats } from '../dto/compliants-stats';

@Resolver('Complaint')
export class ComplaintResolver {
  constructor(private complaintService: ComplaintService) {}

  @Query()
  complaints(): Promise<PaginatedList<Complaint>> {
    return this.complaintService.findAll();
  }

  @Query()
  keyComplaintsStats(): Promise<Array<KeyComplaintsStats>> {
    return this.complaintService.getKeyComplaintsStats();
  }

  @Query()
  async complaint(@Args('id') id: number): Promise<Complaint | undefined> {
    return this.complaintService.findOne(id);
  }

  @Mutation()
  async reportComplaint(
    @Args() args: MutationCreateComplaintArgs,
  ): Promise<Complaint> {
    console.log('reportComplaint', args.input);
    return this.complaintService.create(args.input);
  }

  @Mutation()
  async assignComplaintToUser(
    @Args() args: MutationAssignComplaintToUserArgs,
  ): Promise<Complaint> {
    return this.complaintService.assignComplaintToUser(args.input);
  }
  @Mutation()
  async updateComplaint(
    @Args() args: MutationUpdateComplaintArgs,
  ): Promise<Complaint> {
    return this.complaintService.update(args.input);
  }

  @Mutation()
  async deleteComplaint(
    @Args() args: MutationDeleteComplaintArgs,
  ): Promise<DeletionResponse> {
    return this.complaintService.delete(args.input);
  }
}
