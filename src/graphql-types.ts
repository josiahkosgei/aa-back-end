/*
 * ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum DeletionResult {
    DELETED = "DELETED",
    NOT_DELETED = "NOT_DELETED"
}

export enum SortOrder {
    ASC = "ASC",
    DESC = "DESC"
}

export enum LogicalOperator {
    AND = "AND",
    OR = "OR"
}

export enum ErrorCode {
    UNKNOWN_ERROR = "UNKNOWN_ERROR"
}

export class AdmissionListOptions {
}

export class CreateAdmissionInput {
    hospitalId: number;
}

export class UpdateAdmissionInput {
    id: number;
    hospitalId: number;
}

export class ComplaintListOptions {
}

export class ReportComplaintInput {
    description: string;
    category: string;
    hospitalId: number;
}

export class AssignComplaintToUserInput {
    id: number;
    assignedUserId: number;
}

export class UpdateComplaintInput {
    id: number;
    description: string;
    category: string;
    assignedUserId: number;
    hospitalId: number;
}

export class CustomerResponseListOptions {
}

export class CreateCustomerResponseInput {
    answer: number;
    complaintId: number;
}

export class HospitalListOptions {
}

export class CreateHospitalInput {
    name: string;
}

export class UpdateHospitalInput {
    id: number;
    name?: string;
}

export class PaymentListOptions {
}

export class CreatePaymentInput {
    amount: number;
    method: string;
}

export class UpdatePaymentInput {
    id: number;
    amount: number;
    method: string;
}

export class UserListOptions {
}

export class CreateUserInput {
    name: string;
}

export class UpdateUserInput {
    id: number;
    name?: string;
}

export class StringOperators {
    eq?: string;
    notEq?: string;
    contains?: string;
    notContains?: string;
    in?: string[];
    notIn?: string[];
    regex?: string;
}

export class BooleanOperators {
    eq?: boolean;
}

export class NumberRange {
    start: number;
    end: number;
}

export class NumberOperators {
    eq?: number;
    lt?: number;
    lte?: number;
    gt?: number;
    gte?: number;
    between?: NumberRange;
}

export class DateRange {
    start: DateTime;
    end: DateTime;
}

export class DateOperators {
    eq?: DateTime;
    before?: DateTime;
    after?: DateTime;
    between?: DateRange;
}

export interface PaginatedList {
    items: Node[];
    totalItems: number;
}

export interface Node {
    id: number;
}

export interface ErrorResult {
    errorCode: ErrorCode;
    message: string;
}

export abstract class IQuery {
    abstract admissions(options?: AdmissionListOptions): AdmissionList | Promise<AdmissionList>;

    abstract admission(id: number): Admission | Promise<Admission>;

    abstract complaints(options?: ComplaintListOptions): ComplaintList | Promise<ComplaintList>;

    abstract keyComplaintsStats(options?: ComplaintListOptions): KeyComplaintsStats[] | Promise<KeyComplaintsStats[]>;

    abstract complaint(id: number): Complaint | Promise<Complaint>;

    abstract customerResponses(options?: CustomerResponseListOptions): CustomerResponseList | Promise<CustomerResponseList>;

    abstract userStats(options?: CustomerResponseListOptions): UserStats[] | Promise<UserStats[]>;

    abstract customerResponse(id: number): CustomerResponse | Promise<CustomerResponse>;

    abstract hospitals(options?: HospitalListOptions): HospitalList | Promise<HospitalList>;

    abstract hospitalsWithStats(options?: HospitalListOptions): HospitalStats[] | Promise<HospitalStats[]>;

    abstract hospital(id: number): Hospital | Promise<Hospital>;

    abstract payments(options?: PaymentListOptions): PaymentList | Promise<PaymentList>;

    abstract payment(id: number): Payment | Promise<Payment>;

    abstract users(options?: UserListOptions): UserList | Promise<UserList>;

    abstract user(id: number): User | Promise<User>;
}

export abstract class IMutation {
    abstract createAdmission(input: CreateAdmissionInput): Admission | Promise<Admission>;

    abstract updateAdmission(input: UpdateAdmissionInput): Admission | Promise<Admission>;

    abstract deleteAdmission(id: number): DeletionResponse | Promise<DeletionResponse>;

    abstract reportComplaint(input: ReportComplaintInput): Complaint | Promise<Complaint>;

    abstract updateComplaint(input: UpdateComplaintInput): Complaint | Promise<Complaint>;

    abstract assignComplaintToUser(input: AssignComplaintToUserInput): Complaint | Promise<Complaint>;

    abstract deleteComplaint(id: number): DeletionResponse | Promise<DeletionResponse>;

    abstract createCustomerResponse(input: CreateCustomerResponseInput): CustomerResponse | Promise<CustomerResponse>;

    abstract createHospital(input: CreateHospitalInput): Hospital | Promise<Hospital>;

    abstract updateHospital(input: UpdateHospitalInput): Hospital | Promise<Hospital>;

    abstract deleteHospital(id: number): DeletionResponse | Promise<DeletionResponse>;

    abstract createPayment(input: CreatePaymentInput): Payment | Promise<Payment>;

    abstract updatePayment(input: UpdatePaymentInput): Payment | Promise<Payment>;

    abstract deletePayment(id: number): DeletionResponse | Promise<DeletionResponse>;

    abstract createUser(input: CreateUserInput): User | Promise<User>;

    abstract updateUser(input: UpdateUserInput): User | Promise<User>;

    abstract deleteUser(id: number): DeletionResponse | Promise<DeletionResponse>;
}

export class Admission implements Node {
    id: number;
    name: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    hospital: Hospital;
    payments: Payment;
}

export class AdmissionList implements PaginatedList {
    items: Admission[];
    totalItems: number;
}

export class DeletionResponse {
    result: DeletionResult;
    message?: string;
}

export class Success {
    success: boolean;
}

export class Complaint implements Node {
    id: number;
    description: string;
    category: string;
    state: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    assignedUser: User;
    hospital: Hospital;
    customerResponse?: CustomerResponse;
}

export class KeyComplaintsStats {
    hospitalId: number;
    categorycount: number;
    name: string;
    category: string;
}

export class ComplaintList implements PaginatedList {
    items: Complaint[];
    totalItems: number;
}

export class CustomerResponse implements Node {
    id: number;
    answer: number;
    createdAt: DateTime;
    updatedAt: DateTime;
    complaint: Complaint;
}

export class UserStats {
    name: string;
    nps: number;
    reportedissues: number;
    efficiency: number;
    completed: number;
}

export class CustomerResponseList implements PaginatedList {
    items: CustomerResponse[];
    totalItems: number;
}

export class Hospital implements Node {
    id: number;
    name: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    hospitalComplaints: Complaint[];
    admissions: Admission[];
}

export class HospitalStats implements Node {
    id: number;
    name: string;
    admissionscount: number;
}

export class HospitalList implements PaginatedList {
    items: Hospital[];
    totalItems: number;
}

export class Payment implements Node {
    id: number;
    amount: number;
    method: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    admission: Admission;
}

export class PaymentList implements PaginatedList {
    items: Payment[];
    totalItems: number;
}

export class User implements Node {
    id: number;
    name: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    assignedComplaints: Complaint[];
}

export class UserList implements PaginatedList {
    items: User[];
    totalItems: number;
}

export type JSON = any;
export type DateTime = any;
export type Upload = any;
