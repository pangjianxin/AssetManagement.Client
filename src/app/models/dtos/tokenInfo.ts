import { Organization } from './organization';
/**从jwt token中解析出来的用户信息 */
export interface TokenInfo {
    aud: string;
    exp: string;
    iat: string;
    iss: string;
    jti: string;
    nbf: string;
    org2: string;
    orgId: string;
    orgIdentifier: string;
    orgName: string;
    orgRole: number;
    roleId: string;
}
