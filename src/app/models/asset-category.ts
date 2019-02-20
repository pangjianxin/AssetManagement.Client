import { ManagementLine } from './management-line';

export interface AssetCategory {
    assetCategoryId: string;
    assetFirstLevelCategory: string;
    assetSecondLevelCategory: string;
    assetThirdLevelCategory: string;
    assetMeteringUnit: string;
    managementLineDto: ManagementLine;
}
