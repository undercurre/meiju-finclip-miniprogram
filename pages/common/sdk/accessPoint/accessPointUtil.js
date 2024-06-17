/**
 * ap自发现工具类
 */
const app = getApp()
import {
  supportedApplianceTypes
} from '../../../../utils/pluginFilter'
import {
  commonIndex
} from '../common/commonIndex'

/**
 * 构造数据,获取AP自发现设备详情信息
 * @param {*} deviceData 
 */
function getDeviceData(deviceData) {
  console.log('deviceData=========', deviceData)
  const result = new Object()
  const category = getApCategory(deviceData.SSID).toUpperCase()
  const typeAndName = commonIndex.commonUtil.getDeviceImgAndName(category)
  let formatType = '0x' + category.toLocaleUpperCase()
  const isSupport = app.globalData.brandConfig[app.globalData.brand].pluginFilter_type.includes(formatType) //ap 自发现是否有插件只校验品类
  const enterprise = getEnterPrise(deviceData.SSID)
  result.category = category
  result.signalStrength = deviceData.signalStrength
  result.bssid = deviceData.BSSID
  result.deviceImg = typeAndName.deviceImg
  result.deviceName = typeAndName.deviceName
  result.SSID = deviceData.SSID
  result.mode = 0
  result.isSupport = isSupport
  result.enterprise = enterprise
  result.fm = 'autoFound'
  return result
}
/**
 * 构造category数据（设备品类）
 * eg. SSID：midea_ac_1234
 * @param {*} SSID 
 */
function getApCategory(SSID) {
  const arr = SSID.split('_')
  console.log('SSSSSSSsSSS', arr[1])
  return arr[1]
}
/**
 * 构造enterprise(品牌)
 * eg. SSID: midea_ac_1234
 * @param {*} SSID 
 */
function getEnterPrise(SSID) {
  const arr = SSID.split('_')
  return arr[0] == 'bugu' ? '0010' : '0000'
}

const accessPointUtil = {
  getDeviceData,
  getApCategory,
  getEnterPrise
}
module.exports = {
  accessPointUtil
}
