import config from '../../config.js'
const environment = config.environment
const masPrefix = config.masPrefix
const domain = config.domain
const api = {
  // 绑定非智能设备到家庭组和房间
  bindIntelligentDeviceVToHome: {
    url: 'https://iot-appliance-sit.smartmidea.net/v1/appliance/home/bind',
    masUrl: `${domain[`${environment}`] + masPrefix}/v1/appliance/normalDevice/bind`,
    api: '/v1/appliance/normalDevice/bind',
  },
  //虚拟插件页参数解析
  selectNewMsProduct: {
    url: `${domain[`${environment}`] + masPrefix}/mcsp/item/outer/ms/product/wechat/model.do`,
    masUrl: `${
      domain[`${environment}`] + masPrefix
    }/Meiju-Lite/api/mcsp_ic/item-application-service/mcsp/item/outer/ms/product/wechat/model.do`,
    api: '/mcsp/item/outer/ms/product/wechat/model.do',
  },
  //虚拟插件页参数解析 最新接口  替换selectNewMsProduct接口迁移后缺少数据
  newSelectNewMsProduct: {
    url: `${
      domain[`${environment}`] + masPrefix
    }/api/mcsp_ic/item-application-service/mcsp/item/outer/ms/product/wechat/model.do`,
    masUrl: `${
      domain[`${environment}`] + masPrefix
    }/api/mcsp_ic/item-application-service/mcsp/item/outer/ms/product/wechat/model.do`,
    api: '/api/mcsp_ic/item-application-service/mcsp/item/outer/ms/product/wechat/model.do',
  },
  //根据type获取产品说明书
  getFromType: {
    url: `${domain[`${environment}`] + masPrefix}/dcp-web/api-product/message/getInstructionsByType`,
    masUrl: `${domain[`${environment}`] + masPrefix}/dcp-web/api-product/message/getInstructionsByType`,
    api: '/dcp-web/api-product/message/getInstructionsByType',
  },
  // 虚拟插件页TSN/DSN 根据sn码获取相关信息
  getFromTsnDsn: {
    url: `${domain[`${environment}`] + masPrefix}/dcp-web/api-product/message/getInstructionsBySnOrTsn`,
    masUrl: `${domain[`${environment}`] + masPrefix}/dcp-web/api-product/message/getInstructionsBySnOrTsn`,
    api: '/dcp-web/api-product/message/getInstructionsBySnOrTsn',
  },
  // 产品编码，返回产品主图
  getImgFromTsnDsn: {
    url: `${domain[`${environment}`] + masPrefix}/api/mcsp_ic/item-application-service/mcsp/item/pProduct/getPProduct`,
    masUrl: `${
      domain[`${environment}`] + masPrefix
    }/api/mcsp_ic/item-application-service/mcsp/item/pProduct/getPProduct`,
    api: '/api/mcsp_ic/item-application-service/mcsp/item/pProduct/getPProduct',
  },
  // TSN/DSN，跳转一键报修
  getMaintenanceFromTsnDsn: {
    url: `${domain[`${environment}`] + masPrefix}/dcp-web/api-product/message/getProductBySerialNoNew`,
    masUrl: `${domain[`${environment}`] + masPrefix}/dcp-web/api-product/message/getProductBySerialNoNew`,
    api: '/dcp-web/api-product/message/getProductBySerialNoNew',
  },
  // TSN/DSN获取事业部通过内容中心配置的动态内容
  getDyContentFromTsnDsn: {
    url: `${
      domain[`${environment}`] + masPrefix
    }/api/mcsp_cc/cc-web/mcsp/content/external/page/new/getDetailByRelativeInfo.do`,
    masUrl: `${
      domain[`${environment}`] + masPrefix
    }/api/mcsp_cc/cc-web/mcsp/content/external/page/new/getDetailByRelativeInfo.do`,
    api: '/api/mcsp_cc/cc-web/mcsp/content/external/page/new/getDetailByRelativeInfo.do',
  },
  // 虚拟插件页美云销商品中心查询页面详情（页面ID）
  getDetailByPageId: {
    url: `${domain[`${environment}`] + masPrefix}/api/mcsp_cc/cc-web/mcsp/content/external/page/getDetailByPageId.do`,
    masUrl: `${
      domain[`${environment}`] + masPrefix
    }/api/mcsp_cc/cc-web/mcsp/content/external/page/getDetailByPageId.do`,
    api: '/api/mcsp_cc/cc-web/mcsp/content/external/page/getDetailByPageId.do',
  },
  // 美云销商品中心查询商品列表品型号、营销大小类（虚拟插件页用到）
  getTsnDsnProductList: {
    url: `${
      domain[`${environment}`] + masPrefix
    }/api/mcsp_ic/item-application-service/mcsp/item/outerweb/product/query.do`,
    masUrl: `${
      domain[`${environment}`] + masPrefix
    }/api/mcsp_ic/item-application-service/mcsp/item/outerweb/product/query.do`,
    api: '/api/mcsp_ic/item-application-service/mcsp/item/outerweb/product/query.do',
  },
  // 美云销商品中心查询营销分类（虚拟插件页用到）
  getQueryMarketCategory: {
    url: `${
      domain[`${environment}`] + masPrefix
    }/api/mcsp_ic/item-application-service/mcsp/item/outerweb/category/queryMarketCategory.do`,
    masUrl: `${
      domain[`${environment}`] + masPrefix
    }/api/mcsp_ic/item-application-service/mcsp/item/outerweb/category/queryMarketCategory.do`,
    api: '/api/mcsp_ic/item-application-service/mcsp/item/outerweb/category/queryMarketCategory.do',
  },
  // 美云销外部使用商品列表商品型号、营销大小类
  getOutProductList: {
    url: `${
      domain[`${environment}`] + masPrefix
    }/api/mcsp_ic/item-application-service/mcsp/item/outer/product/query.do`,
    masUrl: `${
      domain[`${environment}`] + masPrefix
    }/api/mcsp_ic/item-application-service/mcsp/item/outer/product/query.do`,
    api: '/api/mcsp_ic/item-application-service/mcsp/item/outer/product/query.do',
  },
  // 扫码领取365天换新机权益-权益登记信息
  scanToBenefits: {
    url: 'https://rmsuat.midea.com:10000/mmp/guest-access/queryOwnSaleInterface/queryOwnSaleFor365.do',
    // masUrl: 'http://10.16.25.155:8081/mmp/guest-access/queryOwnSaleInterface/queryOwnSaleFor365.do',
    masUrl: `${domain[`${environment}`] + masPrefix}/guest-access/queryOwnSaleInterface/queryOwnSaleFor365.do`,
    api: '/guest-access/queryOwnSaleInterface/queryOwnSaleFor365.do',
  },
  // 分页查家电列表
  checkMachineList: {
    url: `${domain[`${environment}`] + masPrefix}/api/mcsp_uc/mcsp-uc-member/member/behavior/appliance/list.do`,
    masUrl: `${domain[`${environment}`] + masPrefix}/api/mcsp_uc/mcsp-uc-member/member/behavior/appliance/list.do`,
    api: '/api/mcsp_uc/mcsp-uc-member/member/behavior/appliance/list.do',
  },
  // 批量添加我的家电
  addMyAppliances: {
    url: `${domain[`${environment}`] + masPrefix}/api/mcsp_uc/mcsp-uc-member/member/behavior/appliance/batchAdd.do`,
    masUrl: `${domain[`${environment}`] + masPrefix}/api/mcsp_uc/mcsp-uc-member/member/behavior/appliance/batchAdd.do`,
    api: '/api/mcsp_uc/mcsp-uc-member/member/behavior/appliance/batchAdd.do',
  },
  // 企业微信无参数限制请求活码 ;按成员号码请求随机成员二维码
  comPanyWetChat: {
    url: `${
      domain[`${environment}`] + masPrefix
    }/api/mcsp_wec/wec-backstage/wechat/channel/api/external/getContactInfo`,
    masUrl: `${
      domain[`${environment}`] + masPrefix
    }/api/mcsp_wec/wec-backstage/wechat/channel/api/external/getContactInfo`,
    api: '/api/mcsp_wec/wec-backstage/wechat/channel/api/external/getContactInfo',
    // url: `${domain[`${environment}`] + masPrefix}/api/mcsp_wec/wec-backstage/wechat/channel/api/getContactInfo`,
    // masUrl: `${domain[`${environment}`] + masPrefix}/api/mcsp_wec/wec-backstage/wechat/channel/api/getContactInfo`,
    // api: '/wechat/channel/api/getContactInfo',
  },
  // 365换新机  导购
  // /v1/wx/sd/get365Package
  mdtScanToBenefits: {
    url: 'http://iot-user-' + `${environment}` + '.smartmidea.net/v1/wx/sd/get365Package',
    masUrl: `${domain[`${environment}`] + masPrefix}/v1/wx/sd/get365Package`,
    api: '/v1/wx/sd/get365Package',
  },
  // 美云销上传图片
  commitImgToMscp: {
    url: `${domain[`${environment}`] + masPrefix}/api/mcsp_uc/mcsp-uc-member/member/uploadPic.do`,
    masUrl: `${domain[`${environment}`] + masPrefix}/api/mcsp_uc/mcsp-uc-member/member/uploadPic.do`,
    api: '/api/mcsp_uc/mcsp-uc-member/member/uploadPic.do',
  },
}
export default api
