import { imageApi, environment } from '../../../api'
import { getReqId, getStamp } from 'm-utilsdk/index'
import { judgeWayToMiniProgram } from '../../../utils/util'

const app = getApp()

export default {
  createSaveWaterReq(url, opt = {}) {
    return new Promise((resolve, reject) => {
      let env = 'prod'
      if (environment === 'sit' || environment === 'dev') {
        env = 'sit'
      }
      let host = `https://mp-${env}.smartmidea.net/mas/v5/app/proxy?alias=`
      url = host + url
      let header = {}
      header['Content-Type'] = 'application/json'
      header['access-token'] = app.globalData.userData.mdata.accessToken
      wx.request({
        url,
        header,
        method: 'POST',
        data: Object.assign(
          {
            idUserInfo: app.globalData.userData.iotUserId,
            idActivityInfo: 1,
            stamp: getStamp(),
            reqId: getReqId(),
            requestId: getReqId(),
            src: 2,
          },
          opt
        ),
        success: (res) => {
          resolve(res)
        },
        fail: (err) => {
          reject(err)
        },
      })
    })
  },
  getSaveWaterImage(opt) {
    return this.createSaveWaterReq('/xyj/h5/activity/drip/v2/queryEntrance', opt)
  },
  getSaveWaterHomeData(opt) {
    return this.createSaveWaterReq('/xyj/h5/activity/drip/v2/queryHomepage', opt)
  },
  signInSaveWater(opt) {
    return this.createSaveWaterReq('/xyj/h5/activity/drip/v1/signIn', opt)
  },
  getSaveWaterProductList(opt) {
    return this.createSaveWaterReq('/xyj/h5/activity/drip/v1/queryProductList', opt)
  },
  drawSaveWaterDrip(opt) {
    return this.createSaveWaterReq('/xyj/h5/activity/drip/v1/drawDrip', opt)
  },
  getSaveWaterProductInfo(opt) {
    return this.createSaveWaterReq('/xyj/h5/activity/drip/v1/queryProductInfo', opt)
  },
  exchangeSaveWaterCoupon(opt) {
    return this.createSaveWaterReq('/xyj/h5/activity/drip/v2/exchangeCoupon', opt)
  },
  getSaveWaterExchangeList(opt) {
    return this.createSaveWaterReq('/xyj/h5/activity/drip/v1/queryExchangeList', opt)
  },
  navigateToMall(itemId) {
    let appId = 'wx255b67a1403adbc2'
    let path = '/page/detail/detail?itemid=' + itemId
    judgeWayToMiniProgram(appId, path)
  }
}
