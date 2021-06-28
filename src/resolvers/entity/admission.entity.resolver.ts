import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Hospital } from '../../entities/hospital.entity';
import { Connection } from 'typeorm';
import { Admission } from '../../entities/admission.entity';
import { Payment } from '../../entities/payment.entity';

@Resolver('Admission')
export class AdmissionEntityResolver {
  constructor(private connection: Connection) {}

  @ResolveField()
  async hospital(@Parent() admissionEntity: Admission) {
    let hospital: Hospital | null = admissionEntity.hospital;
    if (!hospital) {
      const complaintWithAssignedUser = await this.connection
        .getRepository(Admission)
        .findOne(admissionEntity.id, {
          relations: ['hospital'],
        });
      if (complaintWithAssignedUser) {
        hospital = complaintWithAssignedUser.hospital;
      }
    }
    if (hospital) {
      return hospital;
    }
  }

  @ResolveField()
  async payments(@Parent() admissionEntity: Admission) {
    let payments: Payment[] | null = admissionEntity.payments;
    if (!payments) {
      const complaintWithAdmissionHistory = await this.connection
        .getRepository(Admission)
        .findOne(admissionEntity.id, {
          relations: ['payments'],
        });
      if (complaintWithAdmissionHistory) {
        payments = complaintWithAdmissionHistory.payments;
      }
    }
    if (payments) {
      return payments;
    }
  }
}
