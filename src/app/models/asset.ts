import { AssetCategory } from './asset-category';

export interface Asset {
    assetId: string;
    assetName: string;
    serialNumber: string;
    brand: string;
    assetDescription: string;
    assetType: string;
    assetTagNumber: string;
    assetNo: string;
    assetStatus: string;
    lastModifyComment: string;
    assetCategoryDto: AssetCategory;
    orgIdentifier: string;
    orgNam: string;
    assetInStoreLocation: string;
}
