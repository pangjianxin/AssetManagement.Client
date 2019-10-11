/**对应AssetInventoryDetailDto，表示一个已盘点的结果*/
export interface AssetInventoryDetail {
    assetInventoryRegisterId: string;
    assetId: string;
    responsibilityIdentity: string;
    responsibilityName: string;
    responsibilityOrg2: string;
    assetInventoryLocation: string;
    assetName: string;
    assetDescription: string;
    assetTagNumber: string;
    inventoryStatus: string;
}

