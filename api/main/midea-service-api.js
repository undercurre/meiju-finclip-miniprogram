import config from '../../config.js'
const environment = config.environment
const masPrefix = config.masPrefix
const domain = config.domain
const api = {
  // 故障列表
  getTrobuleList: {
    url: `${domain[`${environment}`] + masPrefix}/c-css-ipms/oi/api/wom/order/queryservicerequireproduct_lite`,
    masUrl: `${domain[`${environment}`] + masPrefix}/c-css-ipms/oi/api/wom/order/queryservicerequireproduct_lite`,
    api: '/c-css-ipms/oi/api/wom/order/queryservicerequireproduct_lite',
  },
  // 安装服务跟维修服务  手机号码验证
  // sendMobileCode: {
  //   url: `${domain[`${environment}`] + masPrefix}/ccrm2-core/activity/send_code`,
  //   masUrl: `${domain[`${environment}`] + masPrefix}/ccrm2-core/activity/send_code`,
  //   api: '/ccrm2-core/activity/send_code',
  // },
  sendMobileCode: {
    url: `${domain[`${environment}`] + masPrefix}/api/mcsp_uc/mcsp-uc-member/member/validate/sendCode.do`,
    masUrl: `${domain[`${environment}`] + masPrefix}/api/mcsp_uc/mcsp-uc-member/member/validate/sendCode.do`,
    api: '/api/mcsp_uc/mcsp-uc-member/member/validate/sendCode.do',
  },
  // 安装服务跟维修服务  手机号码验证  提交
  // commitMobileCode: {
  //   url: `${domain[`${environment}`] + masPrefix}/ccrm2-core/serviceOrderApi/saveValidateRecord`,
  //   masUrl: `${domain[`${environment}`] + masPrefix}/ccrm2-core/serviceOrderApi/saveValidateRecord`,
  //   api: '/ccrm2-core/serviceOrderApi/saveValidateRecord',
  // },
  commitMobileCode: {
    url: `${domain[`${environment}`] + masPrefix}/api/mcsp_uc/mcsp-uc-member/member/validate/saveValidateRecord.do`,
    masUrl: `${domain[`${environment}`] + masPrefix}/api/mcsp_uc/mcsp-uc-member/member/validate/saveValidateRecord.do`,
    api: '/api/mcsp_uc/mcsp-uc-member/member/validate/saveValidateRecord.do',
  },
  // 客户-css-查询品牌品类相关信息  判断维修时间是不是显示
  checkTimeShow: {
    url: `${domain[`${environment}`] + masPrefix}/c-css-ipms/cssmobile/api/mmp/wx/getBrandProdForCcrm`,
    masUrl: `${domain[`${environment}`] + masPrefix}/c-css-ipms/cssmobile/api/mmp/wx/getBrandProdForCcrm_lite`,
    api: '/c-css-ipms/cssmobile/api/mmp/wx/getBrandProdForCcrm_lite',
  },
  //客服-CSS-条码解析接口
  barcodeAnalysis: {
    url: `${domain[`${environment}`] + masPrefix}/c-css-ipms/oi/api/wom/queryproductinfobysn`,
    masUrl: `${domain[`${environment}`] + masPrefix}/c-css-ipms/oi/api/wom/queryproductinfobysn`,
    api: '/c-css-ipms/oi/api/wom/queryproductinfobysn',
  },
  //客服-CSS-条码解析接口
  hasHelpOrNot: {
    url: `${domain[`${environment}`] + masPrefix}/c-css-ipms/oi/api/wom/appexcludedfaulttraces`,
    masUrl: `${domain[`${environment}`] + masPrefix}/c-css-ipms/oi/api/wom/appexcludedfaulttraces`,
    api: '/c-css-ipms/oi/api/womappexcludedfaulttraces',
  },
  //中控-sn码查询用户产品 (一键报修/插件页跳转)新接口--v6.3.1
  getProductBySerialNoNew: {
    url: `${domain[`${environment}`] + masPrefix}/dcp-web/api-product/message/getProductBySerialNoNew`,
    masUrl: `${domain[`${environment}`] + masPrefix}/dcp-web/api-product/message/getProductBySerialNoNew`,
    api: '/dcp-web/api-product/message/getProductBySerialNoNew',
  },
  // 我的默认地址
  getDefaultAddress: {
    url: `${domain[`${environment}`] + masPrefix}/api/mcsp_uc/mcsp-uc-member/member/address/getDefault.do`,
    masUrl: `${domain[`${environment}`] + masPrefix}/api/mcsp_uc/mcsp-uc-member/member/address/getDefault.do`,
    api: '/api/mcsp_uc/mcsp-uc-member/member/address/getDefault.do',
    // url: `${domain[`${environment}`] + masPrefix}/ccrm2-core/userAddr/getDefaultAddr`,
    // masUrl: `${domain[`${environment}`] + masPrefix}/ccrm2-core/userAddr/getDefaultAddr`,
    // api: '/ccrm2-core/userAddr/getDefaultAddr'
  },
  // 提交安装服务工单  维修服务工单
  sendOrderForm: {
    url: `${domain[`${environment}`] + masPrefix}/c-css-ipms/oi/api/wom/order/createserviceorder`,
    masUrl: `${domain[`${environment}`] + masPrefix}/c-css-ipms/oi/api/wom/order/createserviceorder`,
    api: '/c-css-ipms/oi/api/wom/order/createserviceorder',
  },
  // 上传视频至mas  oss阿里云
  upLoadVideo: {
    url: `${domain[`${environment}`] + masPrefix}/c-css-ipms/oss/v2/signature/get_lite`,
    masUrl: `${domain[`${environment}`] + masPrefix}/c-css-ipms/oss/v2/signature/get_lite`,
    api: '/c-css-ipms/oss/v2/signature/get_lite',
  },

  // 故障自查
  queryservicerequireproduct: {
    url: `${domain[`${environment}`] + masPrefix}/c-css-ipms/oi/api/wom/order/queryservicerequireproduct_lite`,
    masUrl: `${domain[`${environment}`] + masPrefix}/c-css-ipms/oi/api/wom/order/queryservicerequireproduct_lite`,
    api: '/c-css-ipms/oi/api/wom/order/queryservicerequireproduct_lite',
  },

  // 故障自查 故障可能原因查询
  getexcludedfaultlist: {
    url: `${domain[`${environment}`] + masPrefix}/c-css-ipms/oi/api/wom/wx/getexcludedfaultlist`,
    masUrl: `${domain[`${environment}`] + masPrefix}/c-css-ipms/oi/api/wom/wx/getexcludedfaultlist`,
    api: '/c-css-ipms/oi/api/wom/wx/getexcludedfaultlist',
  },

  // 美居Lite 地址维护
  // 获取省市区
  getAreaList: {
    url: `${
      domain[`${environment}`] + masPrefix
    }/api/mcsp_bc/mcsp-base-innerapp/mcsp/base-inner/RegionCommon/queryAddress.do_lite`,
    masUrl: `${
      domain[`${environment}`] + masPrefix
    }/api/mcsp_bc/mcsp-base-innerapp/mcsp/base-inner/RegionCommon/queryAddress.do_lite`,
    api: '/api/mcsp_bc/mcsp-base-innerapp/mcsp/base-inner/RegionCommon/queryAddress.do_lite',
  },
  // getAreaList: {
  //   url: `${domain[`${environment}`] + masPrefix}/cmms/area/list`,
  //   masUrl: `${domain[`${environment}`] + masPrefix}/cmms/area/list`,
  //   api: '/cmms/area/list'
  // },

  // 我的地址列表
  // getAddressList: {
  //   url: `${domain[`${environment}`] + masPrefix}/ccrm2-core/userAddr/list`,
  //   masUrl: `${domain[`${environment}`] + masPrefix}/ccrm2-core/userAddr/list`,
  //   api: '/ccrm2-core/userAddr/list'
  // },
  // 分页地址列表
  getAddressPageList: {
    url: `${domain[`${environment}`] + masPrefix}/api/mcsp_uc/mcsp-uc-member/member/address/listAddr.do`,
    masUrl: `${domain[`${environment}`] + masPrefix}/api/mcsp_uc/mcsp-uc-member/member/address/listAddr.do`,
    api: '/api/mcsp_uc/mcsp-uc-member/member/address/listAddr.do',
    // url: `${domain[`${environment}`] + masPrefix}/ccrm2-core/userAddr/getUserAddrPageList`,
    // masUrl: `${domain[`${environment}`] + masPrefix}/ccrm2-core/userAddr/getUserAddrPageList`,
    // api: '/ccrm2-core/userAddr/getUserAddrPageList'
  },
  // 添加地址
  addAddress: {
    url: `${domain[`${environment}`] + masPrefix}/api/mcsp_uc/mcsp-uc-member/member/address/add.do`,
    masUrl: `${domain[`${environment}`] + masPrefix}/api/mcsp_uc/mcsp-uc-member/member/address/add.do`,
    api: '/api/mcsp_uc/mcsp-uc-member/member/address/add.do',
    // url: `${domain[`${environment}`] + masPrefix}/ccrm2-core/userAddr/add`,
    // masUrl: `${domain[`${environment}`] + masPrefix}/ccrm2-core/userAddr/add`,
    // api: '/ccrm2-core/userAddr/add'
  },
  // 设为默认地址
  setDefautAddress: {
    url: `${domain[`${environment}`] + masPrefix}/ccrm2-core/userAddr/defaultAddr`,
    masUrl: `${domain[`${environment}`] + masPrefix}/ccrm2-core/userAddr/defaultAddr`,
    api: '/ccrm2-core/userAddr/defaultAddr',
  },

  // 修改地址
  modifyAddr: {
    url: `${domain[`${environment}`] + masPrefix}/api/mcsp_uc/mcsp-uc-member/member/address/modify.do_lite`,
    masUrl: `${domain[`${environment}`] + masPrefix}/api/mcsp_uc/mcsp-uc-member/member/address/modify.do_lite`,
    api: '/api/mcsp_uc/mcsp-uc-member/member/address/modify.do_lite',
    // url: `${domain[`${environment}`] + masPrefix}/ccrm2-core/userAddr/update`,
    // masUrl: `${domain[`${environment}`] + masPrefix}/ccrm2-core/userAddr/update`,
    // api: '/ccrm2-core/userAddr/update'
  },
  // 删除地址
  delAddress: {
    url: `${domain[`${environment}`] + masPrefix}/api/mcsp_uc/mcsp-uc-member/member/address/delete.do`,
    masUrl: `${domain[`${environment}`] + masPrefix}/api/mcsp_uc/mcsp-uc-member/member/address/delete.do`,
    api: '/api/mcsp_uc/mcsp-uc-member/member/address/delete.do',
    // url: `${domain[`${environment}`] + masPrefix}/ccrm2-core/userAddr/delete`,
    // masUrl: `${domain[`${environment}`] + masPrefix}/ccrm2-core/userAddr/delete`,
    // api: '/ccrm2-core/userAddr/delete'
  },
  //客服-CSS-用户服务工单列表查询
  queryServiceOrder: {
    url: `${domain[`${environment}`] + masPrefix}/c-css-ipms/oi/api/wom/order/queryserviceorder`,
    masUrl: `${domain[`${environment}`] + masPrefix}/c-css-ipms/oi/api/wom/order/queryserviceorder`,
    api: '/c-css-ipms/oi/api/wom/order/queryserviceorder',
  },
  // 客服-CSS-收费标准业务类型查询
  getChargeServiceTypeData: {
    url: `${domain[`${environment}`] + masPrefix}/c-css-ipms/api/insp/getChargeServiceTypeData`,
    masUrl: `${domain[`${environment}`] + masPrefix}/c-css-ipms/api/insp/getChargeServiceTypeData`,
    api: '/c-css-ipms/api/insp/getChargeServiceTypeData',
  },
  // 客服-CSS-收费标准查询
  getChargeStandardList: {
    url: `${domain[`${environment}`] + masPrefix}/c-css-ipms/api/insp/getChargeStandardList`,
    masUrl: `${domain[`${environment}`] + masPrefix}/c-css-ipms/api/insp/getChargeStandardList`,
    api: '/c-css-ipms/api/insp/getChargeStandardList',
  },
  // 客服-CSS-网点查询
  getUnitArchivesData: {
    url: `${domain[`${environment}`] + masPrefix}/c-css-ipms/oi/api/wom/order/queryunitarchives`,
    masUrl: `${domain[`${environment}`] + masPrefix}/c-css-ipms/oi/api/wom/order/queryunitarchives`,
    api: '/c-css-ipms/oi/api/wom/order/queryunitarchives',
  },
  // 客服-CSS-服务过程列表
  getOrderProgressData: {
    url: `${domain[`${environment}`] + masPrefix}/c-css-ipms/oi/api/wom/order/queryconsumerorderprogress`,
    masUrl: `${domain[`${environment}`] + masPrefix}/c-css-ipms/oi/api/wom/order/queryconsumerorderprogress`,
    api: '/c-css-ipms/oi/api/wom/order/queryconsumerorderprogress',
  },
  // 客服-CSS-用户服务工单详情进度查询
  getUserDemandDispatch: {
    url: `${domain[`${environment}`] + masPrefix}/c-css-ipms/oi/api/wom/order/queryserviceuserdemanddispatch`,
    masUrl: `${domain[`${environment}`] + masPrefix}/c-css-ipms/oi/api/wom/order/queryserviceuserdemanddispatch`,
    api: '/c-css-ipms/oi/api/wom/order/queryserviceuserdemanddispatch',
  },
  // 客服-CSS-条码解析接口
  queryproductinfobysn: {
    url: `${domain[`${environment}`] + masPrefix}/c-css-ipms/oi/api/wom/queryproductinfobysn`,
    masUrl: `${domain[`${environment}`] + masPrefix}/c-css-ipms/oi/api/wom/queryproductinfobysn`,
    api: '/c-css-ipms/oi/api/wom/queryproductinfobysn',
  },
  // 客服-CSS-包修政策查询接口
  querywarrantydescbycodeorsn: {
    url: `${domain[`${environment}`] + masPrefix}/c-css-ipms/oi/api/wom/order/querywarrantydescbycodeorsn`,
    masUrl: `${domain[`${environment}`] + masPrefix}/c-css-ipms/oi/api/wom/order/querywarrantydescbycodeorsn`,
    api: '/c-css-ipms/oi/api/wom/order/querywarrantydescbycodeorsn',
  },
  // 客服-中控-获取售后产品资料对外服务接口 (产品型号模糊查询)
  getProdMessageForMJ: {
    url: `${domain[`${environment}`] + masPrefix}/dcp-web/api-product/message/getProdMessageForMJ`,
    masUrl: `${domain[`${environment}`] + masPrefix}/dcp-web/api-product/message/getProdMessageForMJ`,
    api: '/dcp-web/api-product/message/getProdMessageForMJ',
  },
  // CSS-查询产品信息
  getProductsForModelMj: {
    url: `${domain[`${environment}`] + masPrefix}/c-css-ipms/css/api/mmp/insp/getProductsForModelMj`,
    masUrl: `${domain[`${environment}`] + masPrefix}/c-css-ipms/css/api/mmp/insp/getProductsForModelMj`,
    api: '/c-css-ipms/css/api/mmp/insp/getProductsForModelMj',
  },
  // 客服-CSS-催单原因列表接口
  getQueryServiceReqsrvprod: {
    url: `${domain[`${environment}`] + masPrefix}/c-css-ipms/oi/api/wom/order/queryservicereqsrvprod`,
    masUrl: `${domain[`${environment}`] + masPrefix}/c-css-ipms/oi/api/wom/order/queryservicereqsrvprod`,
    api: '/c-css-ipms/oi/api/wom/order/queryservicereqsrvprod',
  },
  // 客服-CSS-催单CSS信息单
  createServiceUserDemand: {
    url: `${domain[`${environment}`] + masPrefix}/c-css-ipms/oi/api/wom/order/createserviceuserdemand`,
    masUrl: `${domain[`${environment}`] + masPrefix}/c-css-ipms/oi/api/wom/order/createserviceuserdemand`,
    api: '/c-css-ipms/oi/api/wom/order/createserviceuserdemand',
  },
  // 客服-CSS-催单CSS信息单
  cancelServiceOrder: {
    url: `${domain[`${environment}`] + masPrefix}/c-css-ipms/oi/api/wom/order/cancelserviceorder`,
    masUrl: `${domain[`${environment}`] + masPrefix}/c-css-ipms/oi/api/wom/order/cancelserviceorder`,
    api: '/c-css-ipms/oi/api/wom/order/cancelserviceorder',
  },
  // 客服-CSS-用户改约
  doChangeAppoint: {
    url: `${domain[`${environment}`] + masPrefix}/c-css-ipms/oi/api/wom/order/dochangeappoint`,
    masUrl: `${domain[`${environment}`] + masPrefix}/c-css-ipms/oi/api/wom/order/dochangeappoint`,
    api: '/c-css-ipms/oi/api/wom/order/dochangeappoint',
  },
  // 客服-中控-获取家电列表
  getUserProductPageList: {
    url: `${domain[`${environment}`] + masPrefix}/api/mcsp_uc/mcsp-uc-member/member/behavior/appliance/list.do`,
    masUrl: `${domain[`${environment}`] + masPrefix}/api/mcsp_uc/mcsp-uc-member/member/behavior/appliance/list.do`,
    api: '/api/mcsp_uc/mcsp-uc-member/member/behavior/appliance/list.do',
    // url: `${domain[`${environment}`] + masPrefix}/ccrm2-core/userProduct/getUserProductPageList`,
    // masUrl: `${domain[`${environment}`] + masPrefix}/ccrm2-core/userProduct/getUserProductPageList`,
    // api: '/ccrm2-core/userProduct/getUserProductPageList'
  },
  //美的服务接口结束
}
export default api
