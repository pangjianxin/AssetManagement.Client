export enum OrganizationRoleEnum {
    '普通用户' = 1,
    '二级行管理员' = 2,
    '系统管理员' = 3
}
export class OrganizationRole {
    id: string;
    roleNam: string;
    description: string;
    roleEnum: OrganizationRoleEnum;
}
