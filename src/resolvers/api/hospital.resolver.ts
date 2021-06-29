import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { HospitalService } from '../../services/hospital.service';
import { DeletionResponse } from '../../graphql-types';
import {
  MutationCreateHospitalArgs,
  MutationDeleteHospitalArgs,
  PaginatedList,
} from '../../lib/common-types';
import { Hospital } from '../../entities';
import {
  MutationUpdateHospitalArgs,
  QueryHospitalsArgs,
} from '../../lib/common-types';

@Resolver('Hospital')
export class HospitalResolver {
  constructor(private hospitalService: HospitalService) {}

  @Query()
  hospitals(
    @Args() args: QueryHospitalsArgs,
  ): Promise<PaginatedList<Hospital>> {
    return this.hospitalService.findAll(args.options || undefined);
  }

  @Query()
  hospitalsWithStats(
    @Args() args: QueryHospitalsArgs,
  ): Promise<PaginatedList<Hospital>> {
    return this.hospitalService.findAllWithStats(args.options || undefined);
  }

  @Query()
  async hospital(@Args('id') id: number): Promise<Hospital | undefined> {
    return this.hospitalService.findOne(id);
  }

  @Mutation()
  async createHospital(
    @Args() args: MutationCreateHospitalArgs,
  ): Promise<Hospital> {
    return this.hospitalService.create(args.input);
  }

  @Mutation()
  async updateHospital(
    @Args() args: MutationUpdateHospitalArgs,
  ): Promise<Hospital> {
    return this.hospitalService.update(args.input);
  }

  @Mutation()
  async deleteHospital(
    @Args() args: MutationDeleteHospitalArgs,
  ): Promise<DeletionResponse> {
    return this.hospitalService.delete(args.input);
  }
}
