//环境及域名基地址配置
const app = getApp()
// const host = app.getGlobalConfig().host
// const getEnv = app.getGlobalConfig().getEnv

// const baseHost = host[getEnv()];

module.exports = {

  // 静态图片域名
  // imgBaseUrl: baseHost.imgPrefix,

  getOfflineSn: '/v1/appliance/offline/sn'
}
