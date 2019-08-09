import { OrganizationRoleEnum } from './organization-role';

export interface Organization {
    orgId: string;
    orgIdentifier: string;
    orgNam: string;
    orgShortNam: string;
    upOrg: string;
    orgLvl: number;
    org1: string;
    orgNam1: string;
    org2: string;
    orgNam2: string;
    org3: string;
    orgNam3: string;
    role: OrganizationRoleEnum;
    roleDescription: string;
}
