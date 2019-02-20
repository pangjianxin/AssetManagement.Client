import { AssetCategory } from '../asset-category';

export interface AssetStorageViewmodel {
    assetName: string;
    brand: string;
    assetDescription: string;
    assetType: string;
    assetCategoryId: string;
    assetInStoreLocation: string;
    createDateTime: Date;
    count: number;
}
