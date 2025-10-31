import type { Role } from "./Role.interface";

export interface Petugas {
    petugasId: number;
    petugasFullName: string;
    petugasEmail: string;
    petugasUsername: string;
    petugasRole: Role;
}


export interface PetugasReq {
    petugasFullName: string;
    petugasEmail: string;
    petugasUsername: string;
    petugasPassword: string;
    petugasRoleId: string;
}

export interface PetugasRes {
    petugasId: number;
    petugasFullName: string;
    petugasEmail: string;
    petugasUsername: string;
    petugasPassword: string;
    petugasRole: Role;
}