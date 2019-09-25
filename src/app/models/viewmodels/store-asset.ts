import { AssetCategory } from '../dtos/asset-category';

export interface StoreAsset {
    assetName: string;
    brand: string;
    assetDescription: string;
    assetType: string;
    assetLocation: string;
    assetCategoryId: string;
    createDateTime: Date;
    startTagNumber: string;
    endTagNumber: string;
    count(): number;
}
