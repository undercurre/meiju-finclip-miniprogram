/*
 * 接口地址配置
 */
const app = getApp()
module.exports = {
  applianceList: '/mjl/v1/appliance/home/list/get',
  firmwareList: '/v1/appliance/invalid/firmware/list',
  getApplianceAuthType: '/v1/appliance/auth/get',
  checkApExists: '/v1/appliance/sn/apExists',
  batchCheckApExists: '/v1/appliance/sns/apExists_lite',
  batchBindDeviceToHome: '/v1/appliance/batch/home/bind_lite',
  generateCombinedDevice: '/v1/appliance/compose/generate_lite',
  distributeRandomCode: '/v1/appliance/distribute/randomCode',
  getQueryIotProductV4: '/mjl/app/queryIotProductV4' //用ES获取IOT产品信息V4-产品二级页面（搜索、选型二级页面）
}
