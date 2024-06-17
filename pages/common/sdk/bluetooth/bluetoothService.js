/**
 * 蓝牙相关的接口封装
 */
import {
  blueUtil
} from './blueUtil'
import {
  commonUtil
} from '../common/commonUtil'
import {
  ab2hex,
  inArray
} from '../../js/bluetoothUtils.js'
/**
 * 获取蓝牙列表，通过callback返回调用方
 * @param {*} params 
 * @param {*} cb 
 * 
 * params = {EnterPrise: 'toshiba'}
 * EnterPrise:品牌名（toshiba/midea)
 */
function getBlueList(params, cb) {
  wx.closeBluetoothAdapter()
  wx.openBluetoothAdapter({
    success: (res) => {
      startBluetoothDevicesDiscovery(params, cb)
    },
    fail: (res) => {
      if (res.errCode === 10001) {
        wx.onBluetoothAdapterStateChange((res) => {
          console.log('onBluetoothAdapterStateChange', res)
          if (res.available) {
            //监听一次成功后关闭监听，一直监听会很卡
            wx.offBluetoothAdapterStateChange()
            startBluetoothDevicesDiscovery(params, cb)
          }
        })
      }
    },
  })
}

function startBluetoothDevicesDiscovery(params, cb) {
  wx.startBluetoothDevicesDiscovery({
    allowDuplicatesKey: true,
    interval: 2000,
    powerLevel: 'low',
    success: (res) => {
      console.log('startBluetoothDevicesDiscovery success', res)
      setTimeout(() => {
        onBluetoothDeviceFound(params, cb)
      }, 1000)
    },
  })
}

function onBluetoothDeviceFound(params, cb) {
  let targetList = []
  wx.onBluetoothDeviceFound((res) => {
    console.log("发现的设备=======Yoram", res)
    res.devices.forEach((device) => {
      if (!device.name && !device.localName) {
        return
      }
      const foundDevices = targetList
      const idx = inArray(foundDevices, 'deviceId', device.deviceId)
      //mode=0为AP配网搜出来，蓝牙搜出来的设备优先级比AP配网高，需要原地覆盖原来搜到到AP设备
      if (idx === -1) { //新发现：idx == -1；已发现：idx != -1
        //校验美的设备
        if (!blueUtil.filterMideaDevice(device)) return

        //校验二代蓝牙广播包长度对不对
        if (!blueUtil.checkAdsData(device)) return
        //校验已连接设备
        if (blueUtil.filterHasConnectDevice(ab2hex(device.advertisData))) return
        const deviceParam = blueUtil.getDeviceParam(device)
        //校验指定品牌设备（toshiba)
        if (!blueUtil.filterEnterPriseSSID(deviceParam.SSID, params.EnterPrise || 'toshiba')) return
        // 校验蓝牙阈值\
        if (device.RSSI > 0) { //待定 iphone 12 会出现RSSI=127 这种RSSI为正值的异常情况 统一不处理
          console.log('蓝牙异常强度', deviceParam.category, device.RSSI)
          return
        }
        //过滤设备信号强度
        if (device.RSSI < -58) {
          console.log('设备蓝牙强度不满足', deviceParam.category, device.RSSI)
          return
        } else {
          console.log('设备蓝牙强度满足设备', deviceParam.category, device.RSSI)
        }
        let sortData = sortDevice(foundDevices, deviceParam, idx)
        targetList = sortData
      } else {
        //已发现设备
        targetList[idx] = blueUtil.getDeviceParam(device)
      }
    })
    cb(targetList)
  })
}

function sortDevice(foundDevices, item) {
  let device = foundDevices
  const idx2 = inArray(device, 'SSID', item.SSID)
  if (idx2 !== -1) {
    // console.log("已搜到的用户",foundDevices, item)
    // device[idx2] = item
    return sortScanDevice(foundDevices, item, 'set')
  } else {
    // console.log("新增加的用户",foundDevices, item)
    return sortScanDevice(foundDevices, item)
  }
}

function sortScanDevice(foundDevices, deviceData, str) {
  return commonUtil.getSortDataByFindTime(foundDevices, deviceData, str)
}

function destroyInstance() {
  wx.stopBluetoothDevicesDiscovery()
  wx.offBluetoothDeviceFound()
  wx.closeBluetoothAdapter()
}
const bluetoothService = {
  getBlueList,
  destroyInstance,
}
module.exports = {
  bluetoothService
}
