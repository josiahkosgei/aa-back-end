import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AdmissionService } from '../../services/admission.service';
import { DeletionResponse } from '../../graphql-types';
import {
  MutationCreateAdmissionArgs,
  MutationDeleteAdmissionArgs,
  PaginatedList,
} from '../../lib/common-types';
import { Admission } from '../../entities';
import {
  MutationUpdateAdmissionArgs,
  QueryAdmissionsArgs,
} from '../../lib/common-types';

@Resolver('Admission')
export class AdmissionResolver {
  constructor(private admissionService: AdmissionService) {}

  @Query()
  admissions(
    @Args() args: QueryAdmissionsArgs,
  ): Promise<PaginatedList<Admission>> {
    return this.admissionService.findAll(args.options || undefined);
  }

  @Query()
  async admission(@Args('id') id: number): Promise<Admission | undefined> {
    return this.admissionService.findOne(id);
  }

  @Mutation()
  async createAdmission(
    @Args() args: MutationCreateAdmissionArgs,
  ): Promise<Admission> {
    return this.admissionService.create(args.input);
  }

  @Mutation()
  async updateAdmission(
    @Args() args: MutationUpdateAdmissionArgs,
  ): Promise<Admission> {
    return this.admissionService.update(args.input);
  }

  @Mutation()
  async deleteAdmission(
    @Args() args: MutationDeleteAdmissionArgs,
  ): Promise<DeletionResponse> {
    return this.admissionService.delete(args.input);
  }
}
