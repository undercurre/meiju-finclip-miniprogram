const useLocalData = false
const isProd = true
const useMas = isProd

const PLUGIN_DATA_SIT_HOSTNAME = 'http://47.96.114.255:9000'

const CLIENT_TYPE_LITE_PLUGIN = 2

const requestParams = {
  pluginData: {
    url: `${ isProd ? '' : PLUGIN_DATA_SIT_HOSTNAME }/cloud-api/plugin-config/config_load_v2_iot`,
    method: 'post',
    sn8Required: true,
    clentTypeRequired: true
  },
  newestRecipes: {
    url: '/cloud-menu/home/midea/menu/new',
    method: 'post',
    sn8Required: true,
    userRequired: true
  },
  searchRecipes: {
    url: '/cloud-menu/home/midea/menu/listall/tab',
    method: 'post',
    sn8Required: true
  },
  recipeDetail: {
    url: '/cloud-menu/home/midea/menu/detail/id',
    method: 'post',
    userRequired: true
  },
  oneButtonCookingJson2017: {
    url: '/cloud-menu/midea/menu/mine/commend/:menuId',
    method: 'post',
    replacements: ['menuId']
  },
  oneButtonCookingJson2019: {
    url: '/cloud-menu/midea/menu/mine/commend2019/:menuId',
    method: 'post',
    replacements: ['menuId'],
    sn8Needed: true,
  },
  getRecipeFromBarcode: {
    url: '/cloud-menu/home/midea/menu/detail/barcode',
    method: 'post',
    sn8Needed: true,
  }
};

export {
  requestParams,
  useLocalData,
  useMas,
  isProd,
  CLIENT_TYPE_LITE_PLUGIN
}
