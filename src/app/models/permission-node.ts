/**用于权限的扁平树模型 */
export interface PermissionNode {
    item: string;
    children: PermissionNode[];
}
export interface PermissionFlatNode {
    item: string;
    level: number;
    expandable: boolean;
}
