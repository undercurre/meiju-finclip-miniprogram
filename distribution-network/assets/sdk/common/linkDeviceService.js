/**
 * 设备连接页面通用方法
 */
const app = getApp()
const requestService = app.getGlobalConfig().requestService
import {
  getStamp,
  getReqId,
} from 'm-utilsdk/index'
import {
  creatErrorCode
} from './errorCode'
const WX_LOG = require('m-miniCommonSDK/utils/log')
const linkDeviceService = {
  /**
   * 获取家庭信息
   * @param {*} groupId 
   * @param {*} retryNum 
   * @param {*} timeout 
   */
  getFamilyInfo(groupId, retryNum = 3, timeout = 2000) {
    let reqData = {
      homegroupId: groupId,
      reqId: getReqId(),
      stamp: getStamp(),
    }
    return new Promise((resolve, reject) => {
      requestService
        .request('applianceList', reqData, 'POST', '', timeout)
        .then((resp) => {
          app.globalData.isCreateFamily =
            resp.data.data.homeList[0].roleId == '1001' || resp.data.data.homeList[0].roleId ==
            '1002' //是否是当前家庭的创建者
          WX_LOG.info('获取家庭信息成功', 'applianceList')
          resolve(resp)
        })
        .catch((error) => {
          if (retryNum > 0) {
            retryNum--
            setTimeout(() => {
              //继续重试
              this.getFamilyInfo(groupId, retryNum, timeout)
            }, 2000)
          } else {
            WX_LOG.error('获取家庭信息失败', 'applianceList', error)
            reject(error)
          }
        })
    })
  },
  /**
   * 查询确权情况
   * @param {*} applianceCode 
   */
  getApplianceAuthType(applianceCode) {
    return new Promise((resolve, reject) => {
      let reqData = {
        applianceCode: applianceCode,
        reqId: getReqId(),
        stamp: getStamp(),
      }
      requestService
        .request('getApplianceAuthType', reqData)
        .then((resp) => {
          WX_LOG.info('获取设备确权状态正常', 'getApplianceAuthType')
          resolve(resp)
        })
        .catch((error) => {
          WX_LOG.error('获取设备确权状态异常', 'getApplianceAuthType', error)
          reject(error)
        })
    })
  },
  /**
   * 遥控器设备绑定
   * @param {applianceName,sn,applianceType,mac,modelNumber,homegroupId} bindInfo
   */
  bindRemoteDevice(bindInfo) {
      return new Promise((resolve, reject) => {
          let defaultData = {
              "reqId": getReqId(),
              "stamp": getStamp(),
          }
          let reqData = Object.assign(defaultData, bindInfo)
          console.log("遥控设备绑定参数", reqData)
          requestService.request("bindRemoteDevice", reqData).then((resp) => {
              if (resp.data.code == 0) {
                  resolve(resp.data.data || {})
              } else {
                  reject(resp)
              }
          }, (error) => {
              reject(error)
          })
      })
  },
  //延迟函数
  delay(milSec) {
    return new Promise((resolve) => {
      setTimeout(resolve, milSec)
    })
  },
  //异步延迟函数
  async delayAwait(milSec) {
    await new Promise(resolve => setTimeout(resolve, milSec));
  },
  /**
   * 轮询查询设备是否连上云
   * @param {*} sn 
   * @param {*} forceValidRandomCode 
   * @param {*} randomCode 
   * @param {*} timeout 
   * @param {*} callBack 
   * @param {*} callFail 
   */
  newAgainGetAPExists(sn, forceValidRandomCode, randomCode = '', timeout, callBack, callFail) {
    let timeoutID
    const timeoutPromise = new Promise((resolve, reject) => {
      timeoutID = setTimeout(reject, 5000, 'WEB TIMEOUT')
    })
    Promise.race([timeoutPromise, this.checkApExists(sn, forceValidRandomCode, randomCode, timeout)])
      .then((resp) => {
        console.log('查询设备是否连上云', resp.data.code)
        if (resp.data.code == 0) {
          callBack && callBack(resp.data.data)
        }
      })
      .catch((error) => {
        console.log('查询设备是否连上云接口失败2', error)
        getApp().setMethodFailedCheckingLog('查询设备连云结果异常', `error=${JSON.stringify(error)}`)
        if (isStopGetExists) return
        if (error.data && error.data.code) {
          console.log('设备未连上云', error)
          setTimeout(() => {
            this.newAgainGetAPExists(sn, forceValidRandomCode, randomCode, timeout, callBack, callFail)
          }, 2000)
        } else {
          console.log('请求超时', error)
          let time = 2000
          if (
            (error.errMsg && error.errMsg.includes('ERR_NAME_NOT_RESOLVED')) ||
            (error.errMsg && error.errMsg.includes('ERR_CONNECTION_ABORTED'))
          ) {
            console.log('ERR_NAME_NOT_RESOLVED', error)
            time = 7000
          }
          setTimeout(() => {
            this.newAgainGetAPExists(sn, forceValidRandomCode, randomCode, timeout, callBack, callFail)
          }, time)
          callFail && callFail(error)
        }
      })
      .finally(() => clearTimeout(timeoutID))
  },
  /**
   * 查询设备是否连上云
   * @param {*} sn 
   * @param {*} randomCode 
   * @param {*} callBack 
   * @param {*} callFail 
   */
  checkApExists(sn, randomCode = '', timeout) {
    return new Promise((resolve, reject) => {
      let reqData = {
        sn: sn,
        forceValidRandomCode: randomCode ? true : false,
        randomCode: randomCode,
        reqId: getReqId(),
        stamp: getStamp(),
      }
      console.log(`查询设备是否连上云参数 reqData=${JSON.stringify(reqData)},plainSn=${app.addDeviceInfo.plainSn}`)
      requestService
        .request('checkApExists', reqData, 'POST', '', timeout)
        .then((resp) => {
          WX_LOG.info('查询设备是否连上云成功', 'checkApExists')
          resolve(resp)
        })
        .catch((error) => {
          console.log('查询设备是否连上云 error', error)
          if (error.data) {
            app.addDeviceInfo.errorCode = creatErrorCode({
              errorCode: error.data.code,
              isCustom: true,
            })
          }
          if (app.addDeviceInfo && app.addDeviceInfo.mode == 0) {
            //
            if (error.data && error.data.code == 1384) {
              //随机数校验不一致
              app.addDeviceInfo.errorCode = creatErrorCode({
                errorCode: 4169,
                isCustom: true,
              })
            }
          }
          WX_LOG.error('查询设备是否连上云失败', 'checkApExists', error)
          reject(error)
        })
    })
  },
  /**
   * 帐号绑定
   * 
   * 参数格式
   *  let reqData = {
      type,
      sn8,
      plainSn,
      moduleVersion,
      linkType,
      deviceName,
      currentHomeGroupId,
      currentRoomId,
      verificationCodeKey,
      verificationCode,
      btMac,
      bindType
    }
   * @param {*} reqData 
   */
  bindDeviceToHome(reqData) {
    return new Promise((reslove, reject) => {
      requestService
        .request('bindDeviceToHome', reqData, 'POST', '', 3000)
        .then((resp) => {
          if (resp.data.code == 0) {
            WX_LOG.info('帐号绑定到家庭成功', 'bindDeviceToHome')
            reslove(resp)
          }
        })
        .catch((error) => {
          WX_LOG.error('帐号绑定到家庭失败', 'bindDeviceToHome', error)
          reject(error)
        })
    })
  },
}

module.exports = {
  linkDeviceService
}
