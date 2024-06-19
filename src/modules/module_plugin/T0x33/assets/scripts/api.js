import { Format } from './format'
const app = getApp()
const requestService = app.getGlobalConfig().requestService
// 图片地址
const imgBaseUrl = app.getGlobalConfig().imgBaseUrl
const imageDomain = imgBaseUrl.url + '/plugin'
// 生电透传接口
const commonApi = {
  sdaTransmit: '/sda/control/transmit',
}
// 获取推荐食谱
let recipeApi = {
  getRecipeList: function ({ deviceInfo, pageIndex, pageSize }) {
    let uriParams = {
      applianceType: deviceInfo.type,
      modelNo: deviceInfo.sn8,
      page: pageIndex,
      pageSize: pageSize,
    }
    let sendParams = {
      serviceName: 'recipe-service',
      uri: '/v2/modelNumber/recipes' + Format.jsonToParam(uriParams),
      method: 'GET',
      contentType: 'application/json',
      // userId: '6876490357',
      userId: getApp().globalData.userData.iotUserId,
    }
    return new Promise((resolve, reject) => {
      requestService
        .request(commonApi.sdaTransmit, sendParams, 'POST')
        .then((res) => {
          console.log('获取推荐食谱 传参: ', sendParams)
          console.log('获取推荐食谱 返回参: ', res)
          resolve(res)
        })
        .catch((err) => {
          console.error('获取推荐食谱 错误: ', err)
          reject(err)
        })
    })
  },
}

export { imageDomain, recipeApi, commonApi }
