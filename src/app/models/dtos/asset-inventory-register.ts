import { Organization } from './organization';
import { AssetInventory } from './asset-inventory';

/**资产盘点参与机构，表示一个资产盘点的机构注册 */
export interface AssetInventoryRegister {
    id: string;
    createDateTime: string;
    progress: string;
    participation: Organization;
    assetInventory: AssetInventory;


}
