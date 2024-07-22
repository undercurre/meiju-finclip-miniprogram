/**
 * UDP相关的服务
 * 设备的udp有两种情况，一种是设备自启udp广播，可以直接监听广播消息，另外一种是通过发送udp信息到设备(指定端口），设备会有回播
 */
const app = getApp()
import {
  hexStringToArrayBuffer,
  ab2hex,
  isEmptyObject,
  hexCharCodeToStr
} from 'm-utilsdk/index'
import {
  commonUtils
} from './commonUtils'
import {
  addDeviceService
} from '../../../../pages/common/sdk/common/addDeviceService'
import {
  apUtils
} from '../ap_core/apUtils'
let udpCycTimer
const WX_LOG = require('m-miniCommonSDK/utils/log')
const udpService = {
  /**
   * 获取udp广播包消息
   * @param {*} udp 
   */
  async openbroadcast(udp) {
    console.log('调用openbroadcast++++')
    // var msg = '5A5A01114800920000000000992C3B130806151400000000000000000000000000000000000000007F75BD6B3E4F8B762E849C6E578D6590AB77CD526E688D5C3DBD16E5AA3495B6'
    let udpBroadcastAddress = '255.255.255.255' //默认
    let udpAdData = {}
    try {
      let res = await commonUtils.getLocalIPAddress()
      console.log('udp时本机当前ip====', res)

      if (res.localip && res.localip != 'unknown' && res.netmask) {
        //有ip和子网掩码 则根据两者计算广播地址
        udpBroadcastAddress = addDeviceService.getBroadcastAddress(res.localip, res.netmask)
      }
      WX_LOG.info('获取当前ip成功', 'getLocalIPAddress', res)
    } catch (error) {
      console.log('获取当前ip失败error', error)
      WX_LOG.error('获取当前ip失败', 'getLocalIPAddress', error)
    }
    return new Promise((resolve, reject) => {
      let parmas = {
        type: '0092',
        body: 'ff00',
      }
      let msg = apUtils.construOrder(parmas) //根据协议封装消息包
      console.log('msg==', msg)

      if (udp === null) {
        console.log('暂不支持udp')
        return
      }
      udp.bind()
      udp.onListening(function (res) {
        console.log('监听中...')
      })
      udp.onMessage((res) => {
        console.log('onMessage:', res)
        if (res) {
          //udp广播信息
          let hexMsg = ab2hex(res.message).toLocaleLowerCase()
          console.log('udp message', hexMsg)
          if (apUtils.decode2body(hexMsg).type == '807a') {
            let udpMsgBody = apUtils.decode2body(hexMsg).body //解密模组消息
            let adData = apUtils.parseUdpBody(udpMsgBody) //解析UDP消息体
            console.log('获取udp返回', adData)
            if (hexCharCodeToStr(adData.ssid).toLocaleLowerCase() == app.addDeviceInfo.ssid
              .toLocaleLowerCase()) { //校验响应包
              udpAdData = adData
              WX_LOG.info('获取udp返回信息', 'udp.onMessage', adData)
              resolve(adData)
            }
          }
        }
      })
      udp.onError((res) => {
        console.log('udp error', res)
        WX_LOG.error('获取udp错误', res)
        reject(res)
      })
      console.log('发送udp时的地址====', udpBroadcastAddress)
      if (udp) {
        udp.send({
          setBroadcast: true, //允许广播
          address: udpBroadcastAddress,
          port: 6445,
          message: hexStringToArrayBuffer(msg),
        })
      }
      udpCycTimer = setInterval(() => {
        if (!isEmptyObject(udpAdData)) {
          clearInterval(udpCycTimer)
        } else {
          let msg = apUtils.construOrder(parmas)
          console.log('发送udp时的地址====', udpBroadcastAddress)
          if (udp) {
            udp.send({
              setBroadcast: true, //允许广播
              address: udpBroadcastAddress,
              port: 6445,
              message: hexStringToArrayBuffer(msg),
            })
          }
          console.log('再次发送udp======')
        }
      }, 2000)
      console.log('发送成功')
    })
  },
  /**
   * 监听设备自启广播
   * @param {*} udp 
   */
  onDeviceAutoUdp(udp) {
    console.log('调用onDeviceAutoUdp++++')
    return new Promise((resolve, reject) => {
      if (udp === null) {
        console.log('暂不支持')
        return
      } else {
        console.log('onDeviceAutoUdp udp===', udp)
        udp.bind(15000)
        udp.onListening(function (res) {
          console.log('监听中...', res)
        })
        udp.onMessage((res) => {
          console.log("onMessage", res)
          if (res) {
            //udp2广播信息
            let hexMsg = ab2hex(res.message).toLocaleLowerCase()
            console.log('udp2 message', hexMsg)
            console.log('udp2 message decode2body',apUtils.decode2body(hexMsg))
            if (apUtils.decode2body(hexMsg).type == '007a') {
              let udpMsgBody = apUtils.decode2body(hexMsg).body
              let adData = apUtils.parseUdpBody(udpMsgBody)
              console.log("=======success return=========",adData,app.addDeviceInfo)
              if (hexCharCodeToStr(adData.ssid).toLocaleLowerCase() == app.addDeviceInfo.ssid
                .toLocaleLowerCase()) {
                //过滤偶现没有版本信息的包
                WX_LOG.info('设备自启udp成功', 'udp.onMessage')
                console.log("=======success return=====resolve====",adData)
                resolve(adData)
              }
            }
          }
        })
        udp.onError((res) => {
          console.log('udp2 error', res)
          WX_LOG.error('设备自启udp错误', 'udp.onMessage', res)
          reject(res)
        })
      }
    })
  },
  /**
   * 获取udp设备信息
   * @param {*} udp 
   * @param {*} udp2 
   */
  getUdpInfo(udp, udp2) {
    let openbroadcast = this.openbroadcast(udp)
    let onDeviceAutoUdp = this.onDeviceAutoUdp(udp2)
    return Promise.race([onDeviceAutoUdp, openbroadcast])
  },

  /**
   * 关闭udp实例的监听
   * @param {*} udp 
   */
  closeUdp(udp, udp2) {
    udp.offMessage()
    udp.close()
    udp2.offMessage()
    udp2.close()
  },

  // 解决linkDevice页面获取不到udpCycTimer 从而清除不了定时器问题
  stopInterval(){
    clearInterval(udpCycTimer)
  }
}

module.exports = {
  udpService
}
