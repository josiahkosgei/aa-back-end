import { Maybe } from 'graphql-tools';
import {
  BooleanOperators,
  DateOperators,
  HospitalListOptions,
  NumberOperators,
  StringOperators,
} from '../graphql-types';
import { BaseEntity } from '../entities/base.entity';
import {
  PaymentListOptions,
  UpdatePaymentInput,
  CreatePaymentInput,
} from '../graphql-types';
import {
  AssignComplaintToUserInput,
  AdmissionListOptions,
  CreateAdmissionInput,
  UpdateAdmissionInput,
} from '../graphql-types';
import {
  ComplaintListOptions,
  UserListOptions,
  CreateUserInput,
  UpdateUserInput,
} from '../graphql-types';
import {
  CreateHospitalInput,
  ReportComplaintInput,
  UpdateHospitalInput,
  UpdateComplaintInput,
} from '../graphql-types';

export type PaginatedList<T> = {
  items: T[];
  totalItems: number;
};

export type DeepPartial<T> = {
  [P in keyof T]?:
    | null
    | (T[P] extends Array<infer U>
        ? Array<DeepPartial<U>>
        : T[P] extends ReadonlyArray<infer U>
        ? ReadonlyArray<DeepPartial<U>>
        : DeepPartial<T[P]>);
};

export interface ListQueryOptions<T extends BaseEntity> {
  take?: number | null;
  skip?: number | null;
  sort?: NullOptionals<SortParameter<T>> | null;
  filter?: NullOptionals<FilterParameter<T>> | null;
}
export type NullOptionals<T> = {
  [K in keyof T]: undefined extends T[K]
    ? NullOptionals<T[K]> | null
    : NullOptionals<T[K]>;
};

export type SortOrder = 'ASC' | 'DESC';

// prettier-ignore
export type PrimitiveFields<T extends BaseEntity> = {
  [K in keyof T]: T[K] extends  number | string | boolean | Date ? K : never
}[keyof T];

// prettier-ignore
export type SortParameter<T extends BaseEntity> = {
  [K in PrimitiveFields<T>]?: SortOrder
};
// prettier-ignore
export type FilterParameter<T extends BaseEntity> = {
    [K in PrimitiveFields<T>]?: T[K] extends string  ? StringOperators
        : T[K] extends number ? NumberOperators
            : T[K] extends boolean ? BooleanOperators
                : T[K] extends Date ? DateOperators : StringOperators;
};

export type QueryHospitalsArgs = {
  options?: Maybe<HospitalListOptions>;
};
export type MutationCreateHospitalArgs = {
  input: CreateHospitalInput;
};

export type MutationUpdateHospitalArgs = {
  input: UpdateHospitalInput;
};

export type MutationDeleteHospitalArgs = {
  input: number;
};

export type QueryComplaintsArgs = {
  options?: Maybe<ComplaintListOptions>;
};
export type MutationCreateComplaintArgs = {
  input: ReportComplaintInput;
};
export type MutationAssignComplaintToUserArgs = {
  input: AssignComplaintToUserInput;
};

export type MutationUpdateComplaintArgs = {
  input: UpdateComplaintInput;
};

export type MutationDeleteComplaintArgs = {
  input: number;
};

export type QueryUsersArgs = {
  options?: Maybe<UserListOptions>;
};
export type MutationCreateUserArgs = {
  input: CreateUserInput;
};

export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

export type MutationDeleteUserArgs = {
  input: number;
};

export type QueryAdmissionsArgs = {
  options?: Maybe<AdmissionListOptions>;
};
export type MutationCreateAdmissionArgs = {
  input: CreateAdmissionInput;
};

export type MutationUpdateAdmissionArgs = {
  input: UpdateAdmissionInput;
};

export type MutationDeleteAdmissionArgs = {
  input: number;
};

export type QueryPaymentsArgs = {
  options?: Maybe<PaymentListOptions>;
};
export type MutationCreatePaymentArgs = {
  input: CreatePaymentInput;
};

export type MutationUpdatePaymentArgs = {
  input: UpdatePaymentInput;
};

export type MutationDeletePaymentArgs = {
  input: number;
};
