const app = getApp()
const imgBaseUrl = app.getGlobalConfig().imgBaseUrl
const imageDomain = imgBaseUrl.url + '/plugin'

// 生电透传接口
const commonApi = {
    sdaTransmit: '/sda/control/transmit',
  }
  
export { imageDomain ,commonApi}
