import { AssetCategory } from './asset-category';
import { Organization } from './organization';

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
    orgDto: Organization;
    storedOrgIdentifier: string;
    storedOrgName: string;
    assetLocation: string;
}
