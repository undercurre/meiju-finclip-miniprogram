/*
 * @desc: 初始化websocket
 * @author: zhucc22
 * @Date: 2023-08-15 10:14:17
 */
import { webSocket } from 'm-miniCommonSDK/index'
import { getReqId, urlParamsJoin, getSSESign, getStamp } from 'm-utilsdk/index'
import { api } from '../api'
const requestUrl = '/v1/ws/access'
let gloabalWebSocket = ''
/**
 * @type 设备类型
 * @return {String} 映射后的设备参数
 */
function deviceTypeName(type) {
  let types = {
    android: 1,
    windows: 1,
    mac: 2,
    ios: 2,
    'Android pad': 4,
    ipad: 5,
    Linux: 6,
    devtools: 2,
  }
  return types[type] || ''
}
//解析连接url
function getSeeUrl(reqId) {
  let deviceId = wx.getSystemInfoSync().platform == 'devtools' ? getStamp() : getApp().globalData.openId
  let accessToken
  if (getApp() && getApp().globalData && getApp().globalData.userData) {
    accessToken = getApp().globalData.userData.mdata.accessToken
  }
  let params = {
    src_token: 1000,
    token: accessToken,
    appId: api.iotAppId,
    // req: getReqId(),
    req: reqId,
    //device_id: getApp().globalData.openId,
    device_id: deviceId,
    reset: 0,
    offset: 0,
    client_type: deviceTypeName(wx.getSystemInfoSync().platform),
  }
  const signUrl = urlParamsJoin(requestUrl, params)
  let signStr = `${signUrl}&${api.appKey}`
  let sign = getSSESign(signStr)
  const url = `${api.websocketDomain}${signUrl}&sign=${sign}`
  return url
}

//建立连接,连接websocket
function initWebsocket() {
  let reqId = getReqId()
  return new Promise((resolve, reject) => {
    getApp().globalData.gloabalWebSocket = new webSocket({
      heartCheck: true,
      isReconnection: true,
      initWebSocketObj: {
        url: getSeeUrl(reqId),
        success(res) {
          //console.log(res, 'initWebSocket res success')
          resolve(res)
        },
        fail(err) {
          reject(err)
          //console.log(err, 'initWebSocket res fail')
        },
      },
    })
  })
}
//获取设备推送信息,监听服务器返回
function receiveSocketMessage(applianceCode, callback) {
  return new Promise((resolve) => {
    getApp().globalData.gloabalWebSocket &&
      getApp().globalData.gloabalWebSocket.onReceivedMsg((result) => {
        let message, messageData
        if (typeof result.data !== 'object') {
          message = JSON.parse(result.data)
        }
        if (message.data && typeof message.data !== 'object') {
          if (message.event_type == 2 && message.data) {
            messageData = JSON.parse(message.data)
            // console.log('zhucc websoket推送===>', messageData)
            let array = messageData.message.split(';')
            if (array[0] !== 'appliance/status/report') {
              let pushMessage = JSON.parse(array[2])
              if (applianceCode == pushMessage.applianceCode || !applianceCode) {
                callback(pushMessage)
                resolve(pushMessage)
              }
            }
          }
        }
      })
  })
}
//关闭后重连
function closeReConnect() {
  let reqId = getReqId()
  const { isLogin } = getApp().globalData
  return new Promise((resolve, reject) => {
    isLogin &&
      getApp().globalData.gloabalWebSocket &&
      getApp().globalData.gloabalWebSocket.onSocketClosed({
        url: getSeeUrl(reqId),
        success(res) {
          console.log(res, 'initWebSocket res success')
          resolve(res)
        },
        fail(err) {
          reject(err)
          console.log(err, 'initWebSocket res fail')
        },
      })
  })
}
// 监听网络变化
function networkChange() {
  let reqId = getReqId()
  const { isLogin } = getApp().globalData
  return new Promise((resolve, reject) => {
    isLogin &&
      getApp().globalData.gloabalWebSocket &&
      getApp().globalData.gloabalWebSocket.onNetworkChange({
        url: getSeeUrl(reqId),
        success(res) {
          console.log(res, 'initWebSocket res success')
          resolve(res)
        },
        fail(err) {
          reject(err)
          console.log(err, 'initWebSocket res fail')
        },
      })
  })
}
//关闭websoket连接
function closeWebsocket() {
  getApp().globalData.gloabalWebSocket && getApp().globalData.gloabalWebSocket.closeWebSocket()
}

module.exports = { initWebsocket, receiveSocketMessage, closeWebsocket, closeReConnect, networkChange }
