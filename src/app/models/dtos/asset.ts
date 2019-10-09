import { AssetCategory } from './asset-category';
import { Organization } from './organization';

export interface Asset {
    // 资产id
    assetId: string;
    // 资产名称
    assetName: string;
    // 资产序列号
    serialNumber: string;
    // 资产品牌
    brand: string;
    // 资产描述
    assetDescription: string;
    // 资产型号
    assetType: string;
    // 资产标签号
    assetTagNumber: string;
    // 资产编号
    assetNo: string;
    // 资产状态
    assetStatus: string;
    // 最后修改内容
    LastDeployRecord: string;
    // 资产分类dto
    assetCategoryDto: AssetCategory;
    // 资产责任机构
    organizationInChargeId: string;
    // 在用机构Id
    organizationInUseId: string;
    // 资产存放机构
    orgInUseIdentifier: string;
    // 资产存放机构名称
    orgInUseName: string;
    // 资产位置
    assetLocation: string;

}
