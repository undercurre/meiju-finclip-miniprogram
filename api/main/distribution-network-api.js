import config from '../../config.js'
const environment = config.environment
const masPrefix = config.masPrefix
const domain = config.domain
const baseHost = {
  sit: {
    wcpBaseUrl: 'https://weixincs.midea.com/wcp/sic/api/',
  },
  prod: {
    wcpBaseUrl: 'https://weixin.midea.com/wcp/sic/api/',
  },
}
const baseUrlMap = {
  sit: '_SIT',
  prod: '',
}
const baseUrl = baseUrlMap[environment]
const commonConfig = {
  sit: {
    // colmo
    wcpGroupId: '49ce0f0d0c05416388570a03da8e24dd',
  },
  prod: {
    wcpGroupId: 'b9f6ee33d92644cbac43d09a2283e7c4',
  },
}
const wcpGroupId = commonConfig[environment].wcpGroupId
const isTestEnv = environment !== 'prod'
let dcpSecret
if (isTestEnv) {
  dcpSecret = 'secret=cbe8d0863d67e9d948f1ed4388fd6e19&appKey=3d67e9d948f1ed43&uid=pdgw-mdfw'
} else {
  dcpSecret = 'secret=95a2675304afa00091daf72d09f154b9&appKey=04afa00091daf72d&uid=pdgw-mdfw'
}
const api = {
  //美的配网接口开始
  //配网选择设备类型
  getQueryBrandCategory: {
    url: `${domain[`${environment}`] + masPrefix}/app/queryBrandCategory`,
    masUrl: `${domain[`${environment}`] + masPrefix}/app/queryBrandCategory`,
    api: '/app/queryBrandCategory',
  },
  //设备型号
  getQueryIotProductV2: {
    url: `${domain[`${environment}`] + masPrefix}/app/queryIotProductV2`,
    masUrl: `${domain[`${environment}`] + masPrefix}/app/queryIotProductV2`,
    api: '/app/queryIotProductV2',
  },
  //获取IOT产品信息
  getQueryConnectInfoV2: {
    url: `${domain[`${environment}`] + masPrefix}/app/queryConnectInfoV2`,
    masUrl: `${domain[`${environment}`] + masPrefix}/app/queryConnectInfoV2`,
    api: '/app/queryConnectInfoV2',
  },
  //扫码获取配网指引
  getConnectInfoScanV2: {
    url: `${domain[`${environment}`] + masPrefix}/app/getConnectInfoScanV2`,
    masUrl: `${domain[`${environment}`] + masPrefix}/app/getConnectInfoScanV2`,
    api: '/app/getConnectInfoScanV2',
  },
  //扫描能效二维码获取配网指引接口/扫描一维码获取配网指引接口
  getQrcodeConnectInfoScanV2: {
    url: `${domain[`${environment}`] + masPrefix}/app/getQrcodeConnectInfoScanV2`,
    masUrl: `${domain[`${environment}`] + masPrefix}/app/getQrcodeConnectInfoScanV2`,
    api: '/app/getQrcodeConnectInfoScanV2',
  },
  //解析 二维码(明文、密文)
  scancodeDecode: {
    url: `${domain[`${environment}`] + masPrefix}/sn/decode`,
    masUrl: `${domain[`${environment}`] + masPrefix}/sn/decode`,
    api: '/sn/decode',
  },
  //获取用户指定所有的设备(数字遥控直连设备和智能设备），如果不传，默认返回所有的设备
  deviceFilterList: {
    url: `${domain[`${environment}`] + masPrefix}/v1/appliance/device/filter/list`,
    masUrl: `${domain[`${environment}`] + masPrefix}/v1/appliance/device/filter/list`,
    api: '/v1/appliance/device/filter/list',
  },
  //获取自启热点 无后确权固件名单
  firmwareList: {
    url: `${domain[`${environment}`] + masPrefix}/v1/appliance/invalid/firmware/list`,
    masUrl: `${domain[`${environment}`] + masPrefix}/v1/appliance/invalid/firmware/list`,
    api: '/v1/appliance/invalid/firmware/list',
  },
  //遥控器设备绑定
  bindRemoteDevice: {
    url: `${domain[`${environment}`] + masPrefix}/v1/appliance/bluetoothDirect/bind`,
    masUrl: `${domain[`${environment}`] + masPrefix}/v1/appliance/bluetoothDirect/bind`,
    api: '/v1/appliance/bluetoothDirect/bind',
  },
  //小程序查询用户是否配网灰度
  addDeviceGray: {
    url: `${domain[`${environment}`] + masPrefix}/v1/apisix/wx/net/gray`,
    masUrl: `${domain[`${environment}`] + masPrefix}/v1/apisix/wx/net/gray`,
    api: '/v1/apisix/wx/net/gray',
  },
  //获取密钥接口
  privateKey: {
    url: `${domain[`${environment}`] + masPrefix}/v1/appliance/AKA/privateKey`,
    masUrl: `${domain[`${environment}`] + masPrefix}/v1/appliance/AKA/privateKey`,
    api: '/v1/appliance/AKA/privateKey',
  },
  //美的配网接口结束

  //getColmoProductList 获取COLMO产品列表
  getColmoProductList: {
    url: `${baseHost[`${environment}`].wcpBaseUrl}DCP_PROD_QUERY${baseUrl}/${wcpGroupId}/other?${dcpSecret}`,
  },
}
export default api
