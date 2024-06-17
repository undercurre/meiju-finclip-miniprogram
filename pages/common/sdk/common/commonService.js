/**
 * 主包通用服务类
 */
import {
  requestService
} from '../../../../utils/requestService'
import {
  getReqId,
  getStamp
} from 'm-utilsdk/index'
const WX_LOG = require('../../../../utils/log')
/**
 * 获取配网指引
 * @param {*} fm 
 * @param {*} deviceInfo 
 */
function getAddDeviceGuide(fm = 'scanCode', deviceInfo = {}) {
  let {
    mode,
    type,
    sn8,
    enterprise,
    ssid,
    productId,
    tsn,
    sn
  } = deviceInfo
  return new Promise((resolve, reject) => {
    if (fm == 'autoFound') { //自发现
      let reqData = {
        reqId: getReqId(),
        stamp: getStamp(),
        ssid: ssid,
        enterpriseCode: enterprise,
        category: type.includes('0x') ? type.substr(2, 2) : type,
        code: sn8,
        mode: mode + '',
        queryType: 2,
      }
      requestService
        .request('multiNetworkGuide', reqData, 'POST', '', 2000)
        .then((resp) => {
          WX_LOG.info('自发现获取配网指引成功', 'multiNetworkGuide', resp)
          resolve(resp)
        })
        .catch((error) => {
          WX_LOG.error('自发现获取配网指引失败', 'multiNetworkGuide', error)
          reject(error)
        })
    }
    if (fm == 'selectType') { //选型
      let reqData = {
        code: sn8,
        reqId: getReqId(),
        stamp: getStamp(),
        enterpriseCode: enterprise,
        category: type.includes('0x') ? type.substr(2, 2) : type,
        productId: productId,
        queryType: 1,
      }
      requestService
        .request('multiNetworkGuide', reqData)
        .then((resp) => {
          WX_LOG.info('选型获取配网指引成功', 'multiNetworkGuide', resp)
          resolve(resp)
        })
        .catch((error) => {
          WX_LOG.error('选型获取配网指引失败', 'multiNetworkGuide', error)
          reject(error)
        })
    }
    if (fm == 'scanCode') { //扫码
      let reqData = {
        sn: sn,
        reqId: getReqId(),
        stamp: getStamp(),
        ssid: ssid,
        enterpriseCode: enterprise,
        category: type.includes('0x') ? type.substr(2, 2) : type,
        code: sn8,
        mode: mode + '',
        tsn: tsn,
        queryType: 2,
      }
      requestService
        .request('multiNetworkGuide', reqData)
        .then((resp) => {
          WX_LOG.info('扫码获取配网指引成功', 'multiNetworkGuide', resp)
          resolve(resp)
        })
        .catch((error) => {
          WX_LOG.error('扫码获取配网指引失败', 'multiNetworkGuide', error)
          reject(error)
        })
    }
  })
}

const commonService = {
  getAddDeviceGuide
}

module.exports = {
  commonService
}
