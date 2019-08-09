export interface CreateAssetStockTaking {
    publisherId: string;
    taskName: string;
    taskComment: string;
    expiryDateTime: string;
    excludedOrganizations: string[];
}
