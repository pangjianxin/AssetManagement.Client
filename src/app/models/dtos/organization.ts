import { OrganizationRoleEnum } from './organization-role';

export interface Organization {
    id: string;
    org1: string;
    org2: string;
    org3: string;
    orgIdentifier: string;
    orgNam: string;
    orgShortNam: string;
    upOrg: string;
    orgLvl: number;
    orgNam1: string;
    orgNam2: string;
    orgNam3: string;
    role: OrganizationRoleEnum;
    roleDescription: string;
}
