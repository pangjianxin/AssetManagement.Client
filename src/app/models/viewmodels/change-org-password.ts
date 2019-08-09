export interface ChangeOrgPassword {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
    orgIdentifier: string;
    orgShortNam: string;
}
