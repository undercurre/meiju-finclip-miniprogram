const app = getApp() //获取应用实例
const requestService = app.getGlobalConfig().requestService
import { DeviceData } from '../../assets/script/device-data'
import { Format } from '../../assets/script/format'

// 获取消息配置
export function recommendGet(deviceInfo) {
  return new Promise((resolve) => {
    const app = getApp()
    let userId = app.globalData.userData.iotUserId
    let productModelNumber =
      Number(deviceInfo.modelNumber) !== 0 ? DeviceData.getAO(deviceInfo.modelNumber) : deviceInfo.sn8
    let queryParams = {
      applianceId: deviceInfo.applianceCode,
      applianceType: deviceInfo.type,
      modelNo: productModelNumber,
      platform: 2,
      infoType: 'circleBox',
    }
    let sendParams = {
      serviceName: 'recipe-community',
      uri: 'recommend/get' + Format.jsonToParam(queryParams),
      method: 'GET',
      contentType: 'application/json',
      userId: userId,
    }
    let method = 'POST'
    requestService.request(commonApi.sdaTransmit, sendParams, method).then((res) => {
      if (res.data && res.data.errorCode === 0) {
        let resData = JSON.parse(res.data.result.returnData)
        let messageList = resData.data
        if (messageList && messageList.length > 0) {
          let random = Math.floor(Math.random() * messageList.length)
          let jumpType = 1
          let jumpLinkUrl = messageList[random].h5Link
          if (jumpLinkUrl.startsWith('midea-meiju://com.midea.meiju/main?')) {
            jumpType = 3
          }
          resolve({
            advertiseBarData: [
              {
                contentUrl: messageList[random].iconUrl,
                jumpType: jumpType,
                jumpLinkUrl: jumpLinkUrl,
              },
            ],
          })
        }
      }
    })
  })
}

export function getTimeRange() {
  return {
    hour: [1, 24],
  }
}

export const modeDesc = {
  cold_air: '冷风',
  normal: '暖风',
  constant_temperature: '智能模式',
}

export const modeName = {
  warmAir: '暖风',
  coldAir: '冷风',
  gear: '挡位',
  shake: '摆风',
  humidityMode: '加湿',
  eco: '节能',
  timer: '定时',
}

export const pickerType = {
  timerOn: 'timerOn',
  timerOff: 'timerOff',
  gear: 'gear',
}
