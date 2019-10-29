export const environment = {
  production: true,
  host_base_url: 'http://21.33.129.180:5003',
  jwt_whiteLists: ['21.33.129.180:5003'],
  jwt_blackLists: ['21.33.129.180:5003/api/auth/login'],
  apiUrls: {
    // auth
    login: '/api/auth/login',
    changeOrgShortName: '/api/auth/changeOrgShortName',
    resetOrgPassword: '/api/auth/resetPassword',
    changeOrgPassword: '/api/auth/changeOrgPassword',
  },
  apiBaseUrls: {
    odata: {
      // 查询机构Url，目前不分角色
      organization: '/odata/organization',
      assetCategory: '/odata/assetCategory/getCurrent',
      assetCategory_manage: '/odata/assetCategory/getManage',
      // 资产分类页面中申请资产查询管理机构的url
      assetCategory_orgs: '/odata/CategoryManagerRegister/GetOrgByCategory',
      asset_current: '/odata/asset/getCurrent',
      asset_current_assetWithoutInventory: '/odata/asset/GetAssetsWithoutInventory',
      asset_manage: '/odata/asset/getManage',
      asset_sumarry_current_byCategory: '/odata/getCurrentSumarryByCategory',
      asset_sumarry_manage_byCategory: '/odata/getManageSumarryByCategory',
      asset_sumarry_manage_byCount: '/odata/getManageSumarryByCount',
      orgSpace: '/odata/orgSpace',
      employee: '/odata/employee',
      assetApply_current: '/odata/assetApply/getCurrent',
      assetApply_manage: '/odata/assetApply/getManage',
      assetReturn_current: '/odata/assetReturn/getCurrent',
      assetReturn_manage: '/odata/assetReturn/getManage',
      assetExchange_current: '/odata/assetExchange/getCurrent',
      assetExchange_manage: '/odata/assetExchange/getManage',
      maintainer_current: '/odata/maintainer/getCurrent',
      maintainer_manage: '/odata/maintainer/getManage',
      maintainer_manage_getByCategory: '/odata/maintainer',
      assetInventory_manage: '/odata/assetInventory/getManage',
      assetInventoryRegister_current: '/odata/assetInventoryRegister/getCurrent',
      assetInventoryRegister_manage: '/odata/assetInventoryRegister/getManage',
      assetInventoryDetail_current: '/odata/assetInventoryDetail/getCurrent',
      assetDeploy: '/odata/assetDeploy',
      assetDeploy_download: '/odata/assetDeploy/download'
    },
    api: {
      // asset
      asset_put: '/api/assets',
      asset_post: '/api/assets',
      // maintainer
      maintainer: '/api/maintainer',
      // orgSpace
      orgSpace: '/api/orgSpace',
      // assetCategory
      assetCategory_put: '/api/assetCategory',
      // asset apply
      asseApply_delete: '/api/assetApply',
      assetApply_post: '/api/assetApply',
      assetApply_put_handle: '/api/assetApply/handle',
      assetApply_put_revoke: '/api/assetApply/revoke',
      // asset return
      assetReturn_post: '/api/assetReturn',
      assetReturn_put_handle: '/api/assetReturn/handle',
      assetReturn_put_revoke: '/api/assetReturn/revoke',
      assetReturn_delete: '/api/assetReturn',
      // asset exchange
      assetExchange_post: '/api/assetExchange',
      assetExchange_put_handle: '/api/assetExchange/handle',
      assetExchange_put_revoke: '/api/assetExchange/revoke',
      assetExchange_delete: 'api/assetExchange',
      // inventory
      inventory_post: '/api/inventory',
      // inventory detail
      inventoryDetail_post: '/api/assetInventoryDetail',
      // asset deploy
      assetDeploy_download: '/api/assetDeploy/download'
    }
  }
};
