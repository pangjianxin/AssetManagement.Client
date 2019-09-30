/**对应AssetInventoryDto,表示一个资产盘点任务 */
export interface AssetInventory {
    id: string;
    publisherId: string;
    publisherName: string;
    publisherIdentifier: string;
    publisherOrg2: string;
    taskName: string;
    taskComment: string;
    createDateTime: string;
    expiryDateTime: string;
    timeProgress: string;
}
