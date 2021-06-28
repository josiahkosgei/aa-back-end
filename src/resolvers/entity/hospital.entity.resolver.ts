import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Connection } from 'typeorm';
import { Hospital } from '../../entities/hospital.entity';
import { Complaint } from '../../entities/complaint.entity';
import { Admission } from '../../entities/admission.entity';

@Resolver('Hospital')
export class HospitalEntityResolver {
  constructor(private connection: Connection) {}

  @ResolveField()
  async hospitalComplaints(@Parent() hospitalEntity: Hospital) {
    let hospitalComplaints: Complaint[] | null =
      hospitalEntity.hospitalComplaints;
    if (!hospitalComplaints) {
      const complaintWithAssignedUser = await this.connection
        .getRepository(Hospital)
        .findOne(hospitalEntity.id, {
          relations: ['hospitalComplaints'],
        });
      if (complaintWithAssignedUser) {
        hospitalComplaints = complaintWithAssignedUser.hospitalComplaints;
      }
    }
    if (hospitalComplaints) {
      return hospitalComplaints;
    }
  }

  @ResolveField()
  async admissions(@Parent() hospitalEntity: Hospital) {
    let admissions: Admission[] | null = hospitalEntity.admissions;
    if (!admissions) {
      const complaintWithHospitalHistory = await this.connection
        .getRepository(Hospital)
        .findOne(hospitalEntity.id, {
          relations: ['admissions'],
        });
      if (complaintWithHospitalHistory) {
        admissions = complaintWithHospitalHistory.admissions;
      }
    }
    if (admissions) {
      return admissions;
    }
  }
}
