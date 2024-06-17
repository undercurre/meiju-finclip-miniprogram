const app = getApp()
import {
  locationdevice,
  ab2hex,
  hex2bin,
  hexCharCodeToStr,
} from '../../js/bluetoothUtils.js'
import {
  requestService
} from '../../../../utils/requestService'
import {
  isSupportPlugin
} from '../../../../utils/pluginFilter'
import {
  isEmptyObject,
  hasKey
} from 'm-utilsdk/index'
import {
  deviceImgApi,
  baseImgApi
} from '../../../../api'
//根据广播包 获取设备品类和sn8
function getBlueSn8(advertisData) {
  let len = advertisData.length
  const blueVersion = getBluetoothType(advertisData)
  const sn8 =
    blueVersion == 2 ?
    hexCharCodeToStr(advertisData.slice(6, 22)) :
    hexCharCodeToStr(advertisData.substr(len - 16, len))
  return sn8
}
//获取设备的品类
function getDeviceCategory(device) {
  const advertisData = ab2hex(device.advertisData)
  const name = device.localName
  const blueVersion = getBluetoothType(advertisData)
  let category = blueVersion == 2 ? hexCharCodeToStr(advertisData.substring(22, 26)) : getApCategory(name)
  return category
}
//根据品类 获取设备名字和图片
function getNameAndImg(category) {
  let deviceImg
  let deviceName
  if (locationdevice[category]) {
    deviceImg = locationdevice[category].onlineIcon
    deviceName = locationdevice[category].title
  } else {
    deviceImg = locationdevice[category].onlineIcon
    deviceName = locationdevice[category].title
  }
  return {
    deviceImg: deviceImg,
    deviceName: deviceName,
  }
}
//获取蓝牙设备的ssid
function getBluetoothSSID(advertisData, blueVersion, category, name) {
  if (blueVersion == 1) return name
  if (blueVersion == 2) {
    if (!advertisData.substring(26, 34)) return ''
    const serial = hexCharCodeToStr(advertisData.substring(26, 34))
    const result = `${name}_${category.toLowerCase()}_${serial}`
    return result
  }
  return ''
}

function getBlueSn8Img(category, sn8) {
  console.log('获取图片')
  return new Promise((resolve) => {
    let data = {
      iotDeviceList: [{
        sn8: sn8,
        category: category,
      }, ],
    }
    requestService.request('getIotDeviceByCode', data).then((res) => {
      console.log('getIotDeviceByCode', res.data.data[0])
      if (res.data.code == 0) {
        let obj = {
          deviceImg: res.data.data[0].deviceImgUrl,
          deviceName: res.data.data[0].deviceName,
          category: category,
        }
        resolve(obj)
      }
    })
  })
}

function getIosMac(advertisData) {
  let a = advertisData.substr(42, 12).toUpperCase()
  let b
  let arr = []
  for (let i = 0; i < a.length; i += 2) {
    arr.push(a.substr(i, 2))
  }
  b = arr.reverse().join(':')
  return b
}
//获取蓝牙类型
function getBluetoothType(advertisData) {
  const str = advertisData.slice(4, 6)
  return str == '00' ? 1 : 2
}

function getScanRespPackInfo(advertisData) {
  const blueVersion = getBluetoothType(advertisData)
  let hex = blueVersion == 2 ? advertisData.substr(36, 2) : advertisData.substr(6, 2)
  let binArray = hex2bin(hex)

  return {
    moduleType: binArray[0] ? 'wifiAndBle' : 'ble',
    isLinkWifi: binArray[1] ? true : false,
    isBindble: binArray[2] ? true : false,
    isBleCheck: binArray[3] ? true : false,
    // "isWifiCheck": binArray[4] ? true : false,
    // "isBleCanBind": binArray[5] ? true : false,
    // "isSupportBle": binArray[6] ? true : false,
    // "isSupportOTA": binArray[7] ? true : false,
    // "isSupportMesh": binArray[8] ? true : false,
  }
}
//获取蓝牙参考rssi
function getReferenceRSSI(advertisData) {
  return parseInt(advertisData.substr(40, 2), 16)
}

function getDeviceMode(moduleType, category, sn8) {
  //todo:yoram暂时不考虑空调直连后配网的情况
  //   if (addDeviceSDK.isBlueAfterLinlNetAc(category, sn8)) {
  //     //走直连后配网
  //     return 20
  //   }
  return moduleType == '1' ? 3 : 5
}

function getDeviceModuleType(scanRespPackInfo) {
  return scanRespPackInfo.moduleType == 'wifiAndBle' ? '1' : '0'
}

function getEnterPrise(SSID) {
  const arr = SSID.split('_')
  return arr[0] == 'bugu' ? '0010' : '0000'
}

function checkIfSupport(mode, moduleType, category, sn8) {
  //校验是否支持控制的设备
  let formatType = '0x' + category.toLocaleUpperCase()
  if (!isSupportPlugin(formatType, sn8)) return false
  // if (mode !== 0 && moduleType === '0' && (category !== 'C0')) {
  //   return false
  // }
  //todo:yoram 暂时注釋“未测试不支持”名单
  //   if (!isAddDevice(category.toLocaleUpperCase(), sn8)) {
  //     console.log('自发现 未测试不支持')
  //     return false
  //   }
  return true
}
//更新 获取设备图片名称
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
    item.deviceName = (Object.keys(list).includes(keyName) && list[keyName]['name']) ? list[keyName]['name'] : list
      .common.name
  }
  return item
}
/**
 * 过滤美的设备
 * @param {*} obj 
 */
function filterMideaDevice(obj) {
  if (obj.advertisData != null) {
    const hexStr = ab2hex(obj.advertisData)
    const brand = hexStr.slice(0, 4)
    return brand == 'a806' ? true : false
  }
}
/**
 * 过虑指定品牌设备，默认为美的设备
 * 美的，布谷
 * @param {*} SSID 
 */
function filterEnterPriseSSID(SSID, enterPrise) {
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
 * 拼装设备参数
 * @param {*} device 
 */
function getDeviceParam(device) {
  const advertisData = ab2hex(device.advertisData)
  const blueVersion = getBluetoothType(advertisData)
  const scanRespPackInfo = getScanRespPackInfo(advertisData)
  const mac = getIosMac(advertisData)
  const sn8 = getBlueSn8(advertisData)
  const moduleType = getDeviceModuleType(scanRespPackInfo)
  const category = getDeviceCategory(device).toUpperCase()
  const mode = getDeviceMode(moduleType, category, sn8)
  const SSID = getBluetoothSSID(ab2hex(device.advertisData), blueVersion, category, device.localName)
  const enterprise = getEnterPrise(SSID)
  const isSupport = checkIfSupport(mode, moduleType, category, sn8)
  const typeAndName = getDeviceImgAndName(category, sn8)
  const referenceRSSI = getReferenceRSSI(advertisData)
  const obj = new Object()
  obj.sn8 = sn8
  obj.category = category
  obj.mac = mac
  obj.moduleType = moduleType
  obj.blueVersion = blueVersion
  obj.adData = advertisData
  obj.RSSI = device.RSSI
  obj.mode = mode
  obj.tsn = ''
  obj.SSID = SSID
  obj.deviceImg = typeAndName.deviceImg
  obj.deviceName = typeAndName.deviceName
  obj.isSupport = isSupport
  obj.deviceId = device.deviceId
  obj.enterprise = enterprise
  obj.referenceRSSI = referenceRSSI
  obj.fm = 'autoFound'
  return obj
}

function checkAdsData(device) {
  const sourceAds = device.advertisData
  const advertisData = ab2hex(device.advertisData)
  const blueVersion = getBluetoothType(advertisData)
  return blueVersion == 2 && sourceAds.byteLength < 27 ? false : true
}

function getApCategory(SSID) {
  const arr = SSID.split('_')
  return arr[1]
}

/**
 * 判断ap自发现设备是否是已ap配网的设备  解决wx.getWifiList 有缓存问题
 * @param {*} ssid wifi ssid
 */
function checkIsAddedApDevice(ssid) {
  return app.globalData.curAddedApDeviceList.includes(ssid)
}

function checkWxVersion() {
  const version = app.globalData.systemInfo.version
  const arr = version.split('.')
  console.log('version11', parseInt(arr[0]) < 8)
  if (parseInt(arr[0]) < 8) return false
  if (parseInt(arr[0]) >= 8 && parseInt(arr[1]) === 0 && parseInt(arr[2]) < 7) return false
  return true
}
/**
 * 校验已连接设备
 * @param {*} advertisData 
 */
function filterHasConnectDevice(advertisData) {
	const blueVersion = getBluetoothType(advertisData)
	const scanRespPackInfo = getScanRespPackInfo(advertisData)
	const blueWifi = 'wifiAndBle'
	// 二代单BLE模组
	if (blueVersion == 2) {
		return scanRespPackInfo.isLinkWifi || scanRespPackInfo.isBindble ? true : false
	} else if (scanRespPackInfo.moduleType === blueWifi) {
		return scanRespPackInfo.isLinkWifi ? true : false
	}
	return false
}

const blueUtil = {
  getBlueSn8,
  getDeviceCategory,
  getNameAndImg,
  getBluetoothSSID,
  getBlueSn8Img,
  getIosMac,
  getBluetoothType,
  getScanRespPackInfo,
  getReferenceRSSI,
  getDeviceMode,
  getDeviceModuleType,
  getEnterPrise,
  checkIfSupport,
  getDeviceImgAndName,
  getDeviceParam,
  filterMideaDevice,
  checkAdsData,
  getApCategory,
  checkIsAddedApDevice,
  checkWxVersion,
  filterEnterPriseSSID,
	filterHasConnectDevice
}
module.exports = {
  blueUtil
}
