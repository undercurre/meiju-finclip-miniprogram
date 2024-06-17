const app = getApp()
import {
  deviceImgApi,
  baseImgApi
} from '../../../../api'
import {
  isEmptyObject,
  hasKey
} from 'm-utilsdk/index'
//配网方式list
const modeList = {
  0: 'ap',
  1: '快连',
  2: '声波配网',
  3: '蓝牙配网',
  4: '零配',
  5: '单蓝牙',
  6: 'zebee网关',
  7: '网线',
  8: 'NB - IOT',
  9: 'Msmart - lite协议',
  10: '本地蓝牙直连',
  20: '家用协议直连',
  21: '家用协议配网',
  30: 'msmart 直连', //小程序自定义
  31: 'msmart 直连后做wifi绑定', //小程序自定义
  100: '动态二维码(触屏配网)',
  101: 'zebee网关 + 手机蓝牙',
  102: '蓝牙网关 + 手机蓝牙',
  103: '大屏账号绑定',
  104: '蓝牙网关 + zebee网关 + 手机蓝牙',
  998: '客方配网',
  999: '非智能设备',
}
//获取设备mode
function getMode(mode) {
  if (mode == '003') {
    return 3
  } else if (mode == '005') {
    return 5
  } else if (mode == '000' || mode == '001' || mode == '1') {
    //001 1 的mode临时转为ap配网
    return 0
  } else if (mode == '' || !Object.keys(modeList).includes(mode.toString())) {
    //mode为空 或者不规则都转为ap配网
    return 0
  }
  return mode
}
//获得连接方式
function getLinkType(mode) {
  let linkType = ''
  if (mode == 0) {
    linkType = 'ap'
  }
  if (mode == 3 || mode == 5) {
    linkType = 'bluetooth'
  }
  if (mode == 9 || mode == 10) {
    linkType = '本地蓝牙直连'
  }
  return linkType
}
/**
 * 判断微信版本号
 */
function checkWxVersion() {
  const version = app.globalData.systemInfo.version
  const arr = version.split('.')
  console.log('version11', parseInt(arr[0]) < 8)
  if (parseInt(arr[0]) < 8) return false
  if (parseInt(arr[0]) >= 8 && parseInt(arr[1]) === 0 && parseInt(arr[2]) < 7) return false
  return true
}
/**
 * 检查数组中是否包含指定数据
 * @param {*} arr 
 * @param {*} key 
 * @param {*} val 
 */
const inArray = (arr, key, val) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) {
      return i
    }
  }
  return -1
}
// ArrayBuffer转16进度字符串示例
const ab2hex = (buffer) => {
  var hexArr = Array.prototype.map.call(new Uint8Array(buffer), function (bit) {
    return ('00' + bit.toString(16)).slice(-2)
  })
  return hexArr.join('')
}
/**
 * 根据发现时间排序
 * @param {*} currArr 
 * @param {*} info 
 * @param {*} str 
 */
function getSortDataByFindTime(currArr, info, str) {
  let supportArr = currArr.filter((item) => {
    return item.isSupport
  })
  let unsupportArr = currArr.filter((item) => {
    return !item.isSupport
  })
  //str - 'set'时只排序，不增加
  if (str != 'set') {
    if (!info.isSupport) {
      unsupportArr.push(info)
    } else {
      supportArr.push(info)
    }
  }
  currArr = [...supportArr, ...unsupportArr]
  return currArr
}
/**
 * 过虑指定品牌设备，默认为美的设备
 * 美的，布谷
 * @param {*} SSID 
 */
function filterEnterPrise(SSID, enterPrise) {
  let reg = ""
  if (!enterPrise || (enterPrise && enterPrise == 'midea')) {
    reg = /(midea_|bugu_)[0-9a-fA-F]{2}_[0-9a-zA-Z]{4}/
  } else {
    let str1 = "("
    let str2 = enterPrise
    let str3 = "_"
    let str4 = ")[0-9a-fA-F]{2}_[0-9a-zA-Z]{4}"
    reg = str1 + str2 + str3 + str4
    return new RegExp(reg).test(SSID);
  }
  return reg.test(SSID)
}
/**
 * 更新 获取设备图片名称
 * @param {*} category 
 * @param {*} sn8 
 */
function getDeviceImgAndName(category, sn8) {
  //获取设备品类对应的图片
  let dcpDeviceImgList = isEmptyObject(app.globalData.dcpDeviceImgList) ?
    wx.getStorageSync('dcpDeviceImgList') :
    app.globalData.dcpDeviceImgList
  let applianceType = category
  let list = dcpDeviceImgList[applianceType] || ''
  let keyName = sn8
  let item = new Object()
  console.log('获取对应图片名称===', list, keyName)
  if (!list) {
    item.deviceImg = baseImgApi.url + 'scene/sence_img_lack.png'
    item.deviceName = ''
  } else {
    if (Object.keys(list).includes(keyName) && list[keyName]['icon']) {
      item.deviceImg = list[keyName]['icon']
    } else if (list.common.icon) {
      item.deviceImg = list.common.icon
    } else if (hasKey(deviceImgMap, applianceType.toLocaleUpperCase())) {
      //品类图
      item.deviceImg = deviceImgApi.url + 'blue_' + applianceType.toLocaleLowerCase() + '.png'
    } else {
      //缺省图
      item.deviceImg = deviceImgApi.url + 'blue_default_type.png'
    }
    // item.deviceImg = Object.keys(list).includes(keyName) ? list[keyName]['icon'] : list.common.icon
    item.deviceName = (Object.keys(list).includes(keyName) && list[keyName]['name']) ? list[keyName]['name'] :
      list.common.name
  }
  return item
}
/**
 * 根据条件排序
 * @param {*} currArr 
 * @param {*} info 
 * @param {*} str 
 */
function sortScanDevice(currArr, info, str) {
  let supportArr = currArr.filter((item) => {
    return item.isSupport
  })
  let unsupportArr = currArr.filter((item) => {
    return !item.isSupport
  })
  //str - 'set'时只排序，不增加
  if (str != 'set') {
    if (!info.isSupport) {
      unsupportArr.push(info)
    } else {
      supportArr.push(info)
    }
  }
  currArr = [...supportArr, ...unsupportArr]
  return currArr
}
/**
 * 判断系统，只有android支持AP自发现
 */
function checkSystem() {
  return new Promise((resolve) => {
    const systemInfo = app.globalData.systemInfo
    if (!isEmptyObject(systemInfo)) {
      const platform = app.globalData.systemInfo.platform
      console.log('校验系统是不是IOS', platform == 'ios', platform.indexOf('ios') > -1)
      const result = platform.indexOf('ios') > -1 ? true : false
      resolve(result)
    } else {
      service.getWxApiPromise(wx.getSystemInfo).then((res) => {
        app.globalData.systemInfo = res
        const platform = app.globalData.systemInfo.platform
        const result = platform.indexOf('ios') > -1 ? true : false
        resolve(result)
      })
    }
  })
}

const commonUtil = {
  modeList,
  getMode,
  getLinkType,
  checkWxVersion,
  inArray,
  ab2hex,
  getSortDataByFindTime,
  filterEnterPrise,
  getDeviceImgAndName,
  sortScanDevice,
  checkSystem
}
module.exports = {
  commonUtil
}
