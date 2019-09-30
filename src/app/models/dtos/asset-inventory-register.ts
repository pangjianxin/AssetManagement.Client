
/**对应AssetInventoryResgiterDto，表示一个资产盘点的机构注册 */
export interface AssetInventoryRegister {
    id: string;
    orgId: string;
    assetInventoryId: string;
    orgIdentifier: string;
    orgNam: string;
    org2: string;
    taskName: string;
    taskComment: string;
    progress: string;
}
