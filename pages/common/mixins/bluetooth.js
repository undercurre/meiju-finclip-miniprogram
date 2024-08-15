const app = getApp()
let timer = ''
let timer1 = ''

import { baseImgApi, deviceImgApi } from '../../../api'
import { service } from '../js/getApiPromise.js'
import { getStamp, getReqId, isEmptyObject, hasKey } from 'm-utilsdk/index'
import { creatDeviceSessionId, getFullPageUrl, showToast } from '../../../utils/util.js'
import { requestService, rangersBurialPoint } from '../../../utils/requestService'
import { locationdevice, ab2hex, hex2bin, inArray, hexCharCodeToStr } from '../js/bluetoothUtils.js'
import { deviceImgMap } from '../../../utils/deviceImgMap'
import { supportedApplianceTypes, isSupportPlugin } from '../../../utils/pluginFilter'
import { inputWifiInfo, addGuide, linkDevice, index as homePage } from '../../../utils/paths.js'
import { isAddDevice } from '../../../utils/temporaryNoSupDevices'
import { clickEventTracking } from '../../../track/track.js'
import { getWxSystemInfo, getWxGetSetting } from '../../../utils/wx/index.js'
import { addDeviceSDK } from '../../../utils/addDeviceSDK.js'
import { getPrivateKeys } from '../../../utils/getPrivateKeys'
import Dialog from '../../../miniprogram_npm/m-ui/mx-dialog/dialog'
// const brandStyle = require('../../../assets/js/brand.js')
const brandStyle = require('../../../distribution-network/assets/js/brand')
const log = require('../../../utils/log')
const searchTime = 30000
const blueWifi = 'wifiAndBle'
// const ble = 'ble'
let enterTime = 0
// ArrayBuffer转16进度字符串示例
// function ab2hex(buffer) {
//   var hexArr = Array.prototype.map.call(
//     new Uint8Array(buffer),
//     function (bit) {
//       return ('00' + bit.toString(16)).slice(-2)
//     }
//   )
//   return hexArr.join('');
// }
module.exports = Behavior({
  behaviors: [],
  properties: {},
  data: {
    dcpDeviceImgList: [],
    devices: [
      // {
      //   deviceImg: 'https://midea-file.oss-cn-hangzhou.aliyuncs.com/2021/12/10/14/RJQswpfADACBYOAKLcUQ.png',
      //   deviceName: '多开门冰箱',
      //   isSupport: true,
      //   category: 'CA',
      //   RSSI: -50,
      //   deviceId: "30:B2:37:91:7A:00",
      //   isSameSn8Nearest: false,
      // },
      // {
      //   deviceImg: 'https://midea-file.oss-cn-hangzhou.aliyuncs.com/2021/12/10/14/RJQswpfADACBYOAKLcUQ.png',
      //   deviceName: '多开门冰箱',
      //   category: 'CA',
      //   RSSI: -60,
      //   isSameSn8Nearest: false,
      // },
      // {
      //   deviceImg: 'https://www.smartmidea.net/projects/sit/meiju-finclip-assets/mainContent/images/img_wushebei.png',
      //   deviceName: '测试3'
      // },
      // {
      //   deviceImg: 'https://www.smartmidea.net/projects/sit/meiju-finclip-assets/mainContent/images/img_wushebei.png',
      //   deviceName: '测试3'
      // },
      // {
      //   deviceImg: 'https://www.smartmidea.net/projects/sit/meiju-finclip-assets/mainContent/images/img_wushebei.png',
      //   deviceName: '测试1测试1测试1测试1测试1测试1'
      // },
      // {
      //   deviceImg: 'https://www.smartmidea.net/projects/sit/meiju-finclip-assets/mainContent/images/img_wushebei.png',
      //   deviceName: '测试2'
      // },
      // {
      //   deviceImg: 'https://www.smartmidea.net/projects/sit/meiju-finclip-assets/mainContent/images/img_wushebei.png',
      //   deviceName: '测试3'
      // },
      // {
      //   deviceImg: 'https://www.smartmidea.net/projects/sit/meiju-finclip-assets/mainContent/images/img_wushebei.png',
      //   deviceName: '测试3'
      // },
      // {
      //   deviceImg: 'https://www.smartmidea.net/projects/sit/meiju-finclip-assets/mainContent/images/img_wushebei.png',
      //   deviceName: '测试1测试1测试1测试1测试1测试1'
      // },
      // {
      //   deviceImg: 'https://www.smartmidea.net/projects/sit/meiju-finclip-assets/mainContent/images/img_wushebei.png',
      //   deviceName: '测试2'
      // },
      // {
      //   deviceImg: 'https://www.smartmidea.net/projects/sit/meiju-finclip-assets/mainContent/images/img_wushebei.png',
      //   deviceName: '测试3'
      // },
      // {
      //   deviceImg: 'https://www.smartmidea.net/projects/sit/meiju-finclip-assets/mainContent/images/img_wushebei.png',
      //   deviceName: '测试3'
      // },
      // {
      //   deviceImg: 'https://www.smartmidea.net/projects/sit/meiju-finclip-assets/mainContent/images/img_wushebei.png',
      //   deviceName: '测试1测试1测试1测试1测试1测试1'
      // },
      // {
      //   deviceImg: 'https://www.smartmidea.net/projects/sit/meiju-finclip-assets/mainContent/images/img_wushebei.png',
      //   deviceName: '测试2'
      // },
      // {
      //   deviceImg: 'https://www.smartmidea.net/projects/sit/meiju-finclip-assets/mainContent/images/img_wushebei.png',
      //   deviceName: '测试3'
      // },
      // {
      //   deviceImg: 'https://www.smartmidea.net/projects/sit/meiju-finclip-assets/mainContent/images/img_wushebei.png',
      //   deviceName: '测试3'
      // },
      // {
      //   deviceImg: 'https://www.smartmidea.net/projects/sit/meiju-finclip-assets/mainContent/images/img_wushebei.png',
      //   deviceName: '测试1测试1测试1测试1测试1测试1'
      // },
      // {
      //   deviceImg: 'https://www.smartmidea.net/projects/sit/meiju-finclip-assets/mainContent/images/img_wushebei.png',
      //   deviceName: '测试2'
      // },
      // {
      //   deviceImg: 'https://www.smartmidea.net/projects/sit/meiju-finclip-assets/mainContent/images/img_wushebei.png',
      //   deviceName: '测试3'
      // },
      // {
      //   deviceImg: 'https://www.smartmidea.net/projects/sit/meiju-finclip-assets/mainContent/images/img_wushebei.png',
      //   deviceName: '测试3'
      // }
    ],
    isDeviceLength: false,
    isBluetoothMixinNotOpenWxLocation: false,
    isBluetoothMixinGoSetting: false,
    isBluetoothMixinNotOpen: false,
    isBluetoothMixinOpenLocation: false,
    isBluetoothMixinHasAuthBluetooth: true, //用户是否授权小程序使用蓝牙权限

    scanType: 'on', // on:进行中 、end：完成 、none：未发现设备
    noSupportDevices: [],
    connected: false,
    chs: [],
    deviceImg: locationdevice,
    tempIndex: 0,
    distance: '',
    showOpenLocation: false, //是否显示打开位置信息提示
    showOpenBluetooth: false, //是否显示打开蓝牙提示
    dialogStyle: brandStyle.config[app.globalData.brand].dialogStyle,
  },
  methods: {
    //根据广播包 获取设备品类和sn8
    getBlueSn8(advertisData) {
      let len = advertisData.length
      const blueVersion = this.getBluetoothType(advertisData)
      const sn8 =
        blueVersion == 2
          ? hexCharCodeToStr(advertisData.slice(6, 22))
          : hexCharCodeToStr(advertisData.substr(len - 16, len))
      return sn8
    },
    //获取设备的品类
    getDeviceCategory(device) {
      const advertisData = ab2hex(device.advertisData)
      const name = device.localName ? device.localName : device.name
      if (!device.localName) {
        console.log('device:', device)
        log.info('问题设备', device)
      }
      const blueVersion = this.getBluetoothType(advertisData)
      // console.log("blueVersion222------------", blueVersion, advertisData)
      let category = blueVersion == 2 ? hexCharCodeToStr(advertisData.substring(22, 26)) : this.getApCategory(name)
      return category
    },
    //根据品类 获取设备名字和图片
    getNameAndImg(category) {
      // console.log("图片+++++", locationdevice[category])
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
    },
    //获取蓝牙设备的ssid
    getBluetoothSSID(advertisData, blueVersion, category, name) {
      if (blueVersion == 1) return name
      if (blueVersion == 2) {
        if (!advertisData.substring(26, 34)) return ''
        const serial = hexCharCodeToStr(advertisData.substring(26, 34))
        const result = `${name}_${category.toLowerCase()}_${serial}`
        return result
      }
      return ''
    },
    getBlueSn8Img(category, sn8) {
      console.log('获取图片')
      return new Promise((resolve) => {
        let data = {
          iotDeviceList: [
            {
              sn8: sn8,
              category: category,
            },
          ],
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
    },
    getIosMac(advertisData) {
      let a = advertisData.substr(42, 12).toUpperCase()
      let b
      let arr = []
      for (let i = 0; i < a.length; i += 2) {
        arr.push(a.substr(i, 2))
      }
      b = arr.reverse().join(':')
      return b
    },
    //获取蓝牙类型
    getBluetoothType(advertisData) {
      // console.log("获取蓝牙类型", advertisData)
      const str = advertisData.slice(4, 6)
      return str == '00' ? 1 : 2
    },
    getScanRespPackInfo(advertisData) {
      const blueVersion = this.getBluetoothType(advertisData)
      // console.log('getScanRespPackInfo打印', advertisData, blueVersion)
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
        isFeature: blueVersion == 2 && binArray[7] == 1 ? true : false, // 是否支持扩展功能
      }
    },
    //获取蓝牙参考rssi
    getReferenceRSSI(advertisData) {
      return parseInt(advertisData.substr(40, 2), 16)
    },
    inArray(arr, key, val) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i][key] === val) {
          return i
        }
      }
      return -1
    },
    /**
     * 开始蓝牙自发现
     * @param {Number} isIndex 是否首页
     */
    openBluetoothAdapter(isIndex = 1) {
      const brandConfig = app.globalData.brandConfig[app.globalData.brand]
      if (!brandConfig.bluetooth) return
      app.globalData.bluetoothUnSupport = []
      // this.closeBluetoothAdapter()
      // this.clearDevices()
      wx.openBluetoothAdapter({
        success: (res) => {
          console.log('openBluetoothAdapter success', res)
          this.startBluetoothDevicesDiscovery(isIndex)
          //自定义搜索30S以后关闭
          if (isIndex == 1) {
            this.setMixinsBluetoothClose()
          }
        },
        fail: (res) => {
          if (res.errCode === 10001) {
            console.log('6666wx.openBluetoothAdapter失败', res)
            rangersBurialPoint('user_page_view', {
              page_path: getFullPageUrl(),
              page_id: 'wx.openBluetoothAdapter-fail',
              page_name: '蓝牙自发现wx.openBluetoothAdapter初始化蓝牙模块失败',
              ext_info: {
                error: JSON.stringify(res),
              },
            })
            wx.onBluetoothAdapterStateChange((res) => {
              console.log('onBluetoothAdapterStateChange', res)
              if (res.available) {
                this.startBluetoothDevicesDiscovery(isIndex)
                if (isIndex == 1) {
                  this.setMixinsBluetoothClose()
                }
              }
            })
          }
        },
      })
    },
    startBluetoothDevicesDiscovery(isIndex) {
      if (this._discoveryStarted) {
        return
      }
      this._discoveryStarted = true
      wx.startBluetoothDevicesDiscovery({
        allowDuplicatesKey: true,
        interval: 500,
        powerLevel: 'low',
        success: (res) => {
          console.log('startBluetoothDevicesDiscovery success', res)
          setTimeout(() => {
            this.onBluetoothDeviceFound(isIndex)
          }, 1000)
        },
      })
    },
    stopBluetoothDevicesDiscovery() {
      wx.stopBluetoothDevicesDiscovery()
      wx.offBluetoothDeviceFound()
      clearTimeout(timer)
      console.log('关闭定时器', timer)
      this._discoveryStarted = false
    },
    //蓝牙自发现 打上同名称图片设备 距离最近标签
    setBLueSameSn8DeviceTag(deviceParam) {
      let isHasSameTypeDevice = false
      let index = null //已发现的
      let curDevicesIsNearest = false //传入设备是否是最近的
      let maxRSSI = deviceParam.RSSI
      this.data.devices.forEach((item, ind) => {
        if (
          item.RSSI &&
          item.SSID != deviceParam.SSID &&
          item.deviceName == deviceParam.deviceName &&
          item.deviceImg == deviceParam.deviceImg
        ) {
          isHasSameTypeDevice = true
          if (item.RSSI > maxRSSI) {
            index = ind
            maxRSSI = item.RSSI
            curDevicesIsNearest = false
          }
        }
      })
      if (index == null) {
        curDevicesIsNearest = true
      }
      return {
        isHasSameTypeDevice,
        index,
        curDevicesIsNearest, //当前设备是否是最近的
      }
    },
    //更新已发现蓝牙设备的 设备信号强度
    reNewDeviceRSSI(device, interval) {
      let backTime = new Date()
      if (backTime - enterTime < interval) return //节流
      let deviceParam = this.getDeviceParam(device)
      let index = null
      this.data.devices.forEach((item, ind) => {
        if (item.deviceId == deviceParam.deviceId) {
          item.RSSI = device.RSSI
          index = ind
          console.log('更新了rssi======', device.RSSI)
        }
      })
      let nearestRes = this.setBLueSameSn8DeviceTag(deviceParam)
      console.log('=========nearestRes=====', nearestRes)
      if (nearestRes.isHasSameTypeDevice) {
        //有同sn8的设备
        if (nearestRes.curDevicesIsNearest) {
          //当前发现的距离最近
          this.data.devices[index].isSameSn8Nearest = true
          this.data.devices.forEach((item) => {
            if (
              item.RSSI &&
              item.deviceName == deviceParam.deviceName &&
              item.deviceImg == deviceParam.deviceImg &&
              item.deviceId != deviceParam.deviceId
            ) {
              //同设备名图片的其它设备
              console.log('同设备名图片的低强度其它设备==========', item)
              item.isSameSn8Nearest = false
            }
          })
        } else {
          this.data.devices[nearestRes.index].isSameSn8Nearest = true
          this.data.devices.forEach((item) => {
            if (
              item.RSSI &&
              item.deviceName == deviceParam.deviceName &&
              item.deviceImg == deviceParam.deviceImg &&
              item.deviceId != this.data.devices[nearestRes.index].deviceId
            ) {
              //同设备名图片的其它设备
              console.log('同设备名图片的低强度其它设备==========', item)
              item.isSameSn8Nearest = false
            }
          })
        }
      }
      enterTime = backTime
      this.setData({
        devices: this.data.devices,
      })
    },

    //校验SN8
    checkSN8(brandConfig, deviceParam) {
      let ifSN8Matching = false
      if (brandConfig.blueSN8Verify) {
        if (brandConfig.allSN8List && Object.keys(brandConfig.allSN8List).length > 0) {
          // 存在全量设备SN8名单配置
          if (Object.values(brandConfig.allSN8List).some((item) => item['sn8']?.includes(deviceParam.sn8))) {
            ifSN8Matching = true
          }
        }
        if (brandConfig.pluginFilter_SN8 && Object.keys(brandConfig.pluginFilter_SN8).length > 0) {
          // 存在插件SN8黑白名单，插件支持的SN8默认为该品牌设备（兼容新增机型）
          if (Object.values(brandConfig.pluginFilter_SN8).some((item) => item['SN8']?.includes(deviceParam.sn8))) {
            ifSN8Matching = true
          }
        }
        if (!ifSN8Matching) {
          console.log('@module bluetooth.js\n@method onBluetoothDeviceFound\n@desc 设备SN8校验失败\n', deviceParam)
          ifSN8Matching = false
        }
      } else {
        ifSN8Matching = true
      }
      return ifSN8Matching
    },
    onBluetoothDeviceFound(isIndex) {
      const self = this
      const rssiThreshold = isIndex == 0 ? -70 : -58 // 设备发现页信号强度过滤阈值为-70 首页或其他页面为-58
      wx.onBluetoothDeviceFound((res) => {
        res.devices.forEach((device) => {
          // 品牌名校验
          const brandConfig = app.globalData.brandConfig[app.globalData.brand]
          let localName = device.localName || device.name || ''
          if (localName.length > 0) {
            localName = localName.toLocaleLowerCase()
          }
          if (!brandConfig.apNameHeader.some((value) => localName.includes(value))) {
            return
          }

          // RSSI为正值的异常情况均舍弃 或者信号强度小于-58或-70也过滤掉
          if (device.RSSI > 0 || device.RSSI < rssiThreshold) {
            return
          }
          const foundDevices = this.data.devices
          const idx = inArray(foundDevices, 'deviceId', device.deviceId)
          //mode=0为AP配网搜出来，蓝牙搜出来的设备优先级比AP配网高，需要原地覆盖原来搜到到AP设备
          if (idx === -1 || foundDevices[idx].mode === 0) {
            //校验广播包开头公司标识
            if (!this.filterMideaDevice(device)) return
            const adData = ab2hex(device.advertisData) // ArrayBuffer转16进度字符串
            device.adData = adData
            getApp().setMethodCheckingLog('蓝牙信息', `device=${JSON.stringify(device)}`)
            // 校验二代蓝牙广播包长度对不对
            if (!this.checkAdsData(device)) {
              console.log('二代蓝牙广播包长度异常', adData)
              return
            }
            //校验已连接设备
            if (this.filterHasConnectDevice(ab2hex(device.advertisData), device, isIndex)) return
            const deviceParam = this.getDeviceParam(device)
            //首页不显示不支持控制或配网的蓝牙自发现设备
            if (!deviceParam.isSupport && !app.globalData.isShowUnSuppport) {
              console.log('蓝牙自发现不支持控制配网的设备信息', deviceParam)
              let index = inArray(foundDevices, 'SSID', deviceParam.SSID) //ap和蓝牙自发现同一个设备 以蓝牙不支持配网优先为准
              if (index != -1) {
                let update = `devices[${index}].isSupport`
                self.setData({
                  [update]: false,
                })
              }
              app.globalData.bluetoothUnSupport.push(deviceParam)
              return
            }
            // 若首页则需处理wx.getWifiList缓存，校验是否是已配网的设备
            if (isIndex == 1) {
              console.log(
                '@module bluetooth.js\n@method onBluetoothDeviceFound\n@desc 已配网缓存数据\n',
                app.globalData.curAddedApDeviceList
              )
              if (addDeviceSDK.checkIsAddedApDevice(deviceParam.SSID)) {
                console.log(
                  '@module bluetooth.js\n@method onBluetoothDeviceFound\n@desc 过滤已配网设备\n',
                  app.globalData.curAddedApDeviceList,
                  deviceParam.SSID
                )
                return
              }
            }
            // 校验SN8
            let ifSN8Matching = this.checkSN8(brandConfig, deviceParam)
            if (!ifSN8Matching) {
              return
            }
            // if (brandConfig.blueSN8Verify) {
            //   let ifSN8Matching = false
            //   if (brandConfig.allSN8List && Object.keys(brandConfig.allSN8List).length > 0) {
            //     // 存在全量设备SN8名单配置
            //     if (Object.values(brandConfig.allSN8List).some((item) => item['sn8']?.includes(deviceParam.sn8))) {
            //       ifSN8Matching = true
            //     }
            //   }
            //   if (brandConfig.pluginFilter_SN8 && Object.keys(brandConfig.pluginFilter_SN8).length > 0) {
            //     // 存在插件SN8黑白名单，插件支持的SN8默认为该品牌设备（兼容新增机型）
            //     if (
            //       Object.values(brandConfig.pluginFilter_SN8).some((item) => item['SN8']?.includes(deviceParam.sn8))
            //     ) {
            //       ifSN8Matching = true
            //     }
            //   }
            //   if (!ifSN8Matching) {
            //     console.log(
            //       '@module bluetooth.js\n@method onBluetoothDeviceFound\n@desc 设备SN8校验失败\n',
            //       deviceParam
            //     )
            //     return
            //   }
            // }
            let nearestRes = this.setBLueSameSn8DeviceTag(deviceParam)
            console.log('=========nearestRes=====', nearestRes)
            if (nearestRes.isHasSameTypeDevice) {
              //有同sn8的设备
              if (nearestRes.curDevicesIsNearest) {
                //当前发现的距离最近
                deviceParam.isSameSn8Nearest = true
                foundDevices.forEach((item) => {
                  if (
                    item.RSSI &&
                    item.deviceName == deviceParam.deviceName &&
                    item.deviceImg == deviceParam.deviceImg &&
                    item.SSID != deviceParam.SSID
                  ) {
                    //同设备名图片的其它非信号最强设备
                    item.isSameSn8Nearest = false
                  }
                })
              } else {
                foundDevices[nearestRes.index].isSameSn8Nearest = true
                foundDevices.forEach((item) => {
                  if (
                    item.RSSI &&
                    item.deviceName == deviceParam.deviceName &&
                    item.deviceImg == deviceParam.deviceImg &&
                    item.SSID != foundDevices[nearestRes.index].SSID
                  ) {
                    //同设备名图片的其它非信号最强设备
                    item.isSameSn8Nearest = false
                  }
                })
              }
            }
            let sortData = this.sortDevice(foundDevices, deviceParam, idx)
            //自发现设备里去掉找朋友发现的朋友设备信息
            // console.log('朋友设备信息', app.globalData.friendDevices)
            // let friendDevices = app.globalData.friendDevices ? app.globalData.friendDevices : []
            // let ssids = friendDevices.map((item) => {
            //   return item.ssid
            // })
            // sortData = sortData.filter((item) => {
            //   return !ssids.includes(item.SSID)
            // })
            this.setData({
              devices: sortData,
            })
          } else {
            //已发现设备
            this.reNewDeviceRSSI(device, 2000)
          }
          console.log('已发现设备=======', this.data.devices)
          this.setMixinsDialogShow()
        })
      })
    },
    getDeviceParam(device) {
      const advertisData = ab2hex(device.advertisData)
      const blueVersion = this.getBluetoothType(advertisData)
      const scanRespPackInfo = this.getScanRespPackInfo(advertisData)
      const mac = this.getIosMac(advertisData)
      const sn8 = this.getBlueSn8(advertisData)
      const moduleType = this.getDeviceModuleType(scanRespPackInfo)
      const category = this.getDeviceCategory(device)?.toUpperCase()
      const mode = this.getDeviceMode(moduleType, category, sn8)
      const SSID = this.getBluetoothSSID(ab2hex(device.advertisData), blueVersion, category, device.localName)
      const enterprise = this.getEnterPrise(SSID)
      const isSupport = this.checkIfSupport(mode, moduleType, category, sn8)
      const typeAndName = this.getDeviceImgAndName(category, sn8)
      const referenceRSSI = this.getReferenceRSSI(advertisData)
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
      obj.fmType = 'bluetooth' //添加是蓝牙自发现设备信息标识
      console.log('@module bluetooth.js\n@method getDeviceParam\n@desc 设备详细参数\n', obj)
      console.log('@module bluetooth.js\n@method getDeviceParam\n@desc 原始设备详细参数\n', device)
      return obj
    },

    // 微信自发现-设备信息》inputWifiInfo需要的设备信息
    wxgetDeviceInfo(advertisData, localName, name) {
      console.log('localName:', localName)
      const blueVersion = this.getBluetoothType(advertisData)
      const scanRespPackInfo = this.getScanRespPackInfo(advertisData)
      const mac = this.getIosMac(advertisData)
      const sn8 = this.getBlueSn8(advertisData)
      const moduleType = this.getDeviceModuleType(scanRespPackInfo)
      let infoObj = {
        advertisData,
        localName,
        name,
        blueVersion,
      }
      const category = this.wxgetDeviceCategory(infoObj)?.toUpperCase()
      const mode = this.getDeviceMode(moduleType, category, sn8)
      const deviceName = localName ? localName : name
      const SSID = this.getBluetoothSSID(ab2hex(advertisData), blueVersion, category, deviceName)
      const enterprise = this.getEnterPrise(SSID)
      const isSupport = this.checkIfSupport(mode, moduleType, category, sn8)
      const typeAndName = this.getDeviceImgAndName(category, sn8)
      const referenceRSSI = this.getReferenceRSSI(advertisData)
      const obj = new Object()
      obj.sn8 = sn8
      obj.category = category
      obj.mac = mac
      obj.moduleType = moduleType
      obj.blueVersion = blueVersion
      obj.adData = advertisData
      // obj.RSSI = device.RSSI
      obj.mode = mode
      obj.tsn = ''
      obj.SSID = SSID
      obj.deviceImg = typeAndName.deviceImg
      obj.deviceName = typeAndName.deviceName
      obj.isSupport = isSupport
      obj.enterprise = enterprise
      obj.referenceRSSI = referenceRSSI
      obj.fm = 'scanCode'
      obj.fmType = 'bluetooth' //添加是蓝牙自发现设备信息标识
      obj.type = category //设备品类 AC
      obj.wxAuto = true // 用于识别是否微信自发现
      console.log('@module bluetooth.js\n@method wxgetDeviceInfo\n@desc 设备详细参数\n', obj)
      return obj
    },

    //微信自发现-》获取设备的品类
    wxgetDeviceCategory(infoObj) {
      const advertisData = infoObj.advertisData
      const name = infoObj.localName ? infoObj.localName : infoObj.name
      if (!infoObj.localName) {
        console.log('device:', infoObj)
        log.info('问题设备', infoObj)
      }
      const blueVersion = infoObj.blueVersion
      // console.log("blueVersion222------------", blueVersion, advertisData)
      let category = blueVersion == 2 ? hexCharCodeToStr(advertisData.substring(22, 26)) : this.getApCategory(name)
      return category
    },
    getDeviceModuleType(scanRespPackInfo) {
      return scanRespPackInfo.moduleType == blueWifi ? '1' : '0'
    },
    getDeviceMode(moduleType, category, sn8) {
      console.log('getDeviceMode====', category, sn8)
      if (addDeviceSDK.isBlueAfterLinlNetAc(category, sn8)) {
        //走直连后配网
        return 'air_conditioning_bluetooth_connection'
      }
      return moduleType == '1' ? 3 : 5
    },
    checkAdsData(device) {
      const sourceAds = device.advertisData
      const advertisData = ab2hex(device.advertisData)
      // console.log("过滤广播包不规范设备", advertisData,sourceAds.byteLength, this.getBluetoothType(advertisData))
      const blueVersion = this.getBluetoothType(advertisData)
      return blueVersion == 2 && sourceAds.byteLength < 27 ? false : true
    },
    sortDevice(foundDevices, item) {
      let device = this.data.devices
      const idx2 = inArray(device, 'SSID', item.SSID)
      if (idx2 !== -1) {
        // console.log("已搜到的用户",foundDevices, item)
        device[idx2] = item
        return this.sortScanDevice(foundDevices, item, 'set')
      } else {
        // console.log("新增加的用户",foundDevices, item)
        return this.sortScanDevice(foundDevices, item)
      }
    },
    /**
     * 获取设备图片和名称
     * @param {string} category 品类
     * @param {string} sn8 sn8
     */
    getDeviceImgAndName(category, sn8) {
      const dcpDeviceImgList = isEmptyObject(app.globalData.dcpDeviceImgList)
        ? wx.getStorageSync('dcpDeviceImgList')
        : app.globalData.dcpDeviceImgList
      const list = dcpDeviceImgList[category] || ''
      let item = {
        deviceImg: '',
        deviceName: '',
      }
      // console.log('@module bluetooth.js\n@method getDeviceImgAndName\n@desc 获取设备图片和名称\n', list, category, sn8)
      // 获取设备图片
      if (!list) {
        item.deviceImg = baseImgApi.url + 'scene/sence_img_lack.png'
      } else {
        if (Object.keys(list).includes(sn8) && list[sn8]['icon']) {
          item.deviceImg = list[sn8]['icon']
        } else if (list.common.icon) {
          item.deviceImg = list.common.icon
        } else if (hasKey(deviceImgMap, category.toUpperCase())) {
          //品类图
          item.deviceImg = deviceImgApi.url + 'blue_' + category.toLowerCase() + '.png'
        } else {
          //缺省图
          item.deviceImg = deviceImgApi.url + 'blue_default_type.png'
        }
      }
      // 获取设备名称
      if (list) {
        if (Object.keys(list).includes(sn8) && list[sn8]['name']) {
          item.deviceName = list[sn8]['name']
        } else if (list.common.name) {
          item.deviceName = list.common.name
        }
      }
      if (!item.deviceName) {
        if (hasKey(deviceImgMap, category.toUpperCase())) {
          item.deviceName = deviceImgMap[category]['title']
        } else {
          item.deviceName = deviceImgMap['DEFAULT_ICON']['title']
        }
      }
      // console.log('@module bluetooth.js\n@method getDeviceImgAndName\n@desc 获取设备图片和名称结果\n', item)
      return item
    },
    //图片接口和自发现同时进行，有些自发现设备信息已发现显示，图片接口还没执行完，这个时候需要更新自发现设备图片为空的图片和名字
    updateFoundDeviceIcon() {
      this.data.devices.forEach((item, index) => {
        let { deviceImg, category, sn8 } = item
        if (deviceImg.includes('sence_img_lack')) {
          let nameAndIcon = this.getDeviceImgAndName(category, sn8)
          let updateName = `devices[${index}].deviceName`
          let updateIcon = `devices[${index}].deviceImg`
          this.setData({
            [updateName]: nameAndIcon.deviceName,
            [updateIcon]: nameAndIcon.deviceImg,
          })
        }
      })
    },
    dcpMixinsDeviceImgList() {
      return new Promise((resolve) => {
        let reqData = {
          version: '',
        }
        console.log('9999999999', !isEmptyObject(app.globalData.dcpDeviceImgList), app.globalData.dcpDeviceImgList)
        if (!isEmptyObject(app.globalData.dcpDeviceImgList)) {
          resolve(app.globalData.dcpDeviceImgList)
          return
        }
        requestService.request('getIotDeviceImg', reqData).then((res) => {
          // console.log("设备图片", res.data.data.iconList)
          this.setData({
            dcpDeviceImgList: res.data.data.iconList,
          })
          app.globalData.dcpDeviceImgList = res.data.data.iconList
          resolve(app.globalData.dcpDeviceImgList)
        })
      })
    },
    filterHasConnectDevice(advertisData, device, isIndex) {
      const blueVersion = this.getBluetoothType(advertisData)
      const scanRespPackInfo = this.getScanRespPackInfo(advertisData)
      const category = '0x' + this.getDeviceCategory(device).toUpperCase()
      const mac = this.getIosMac(advertisData).replace(/:/g, '').toUpperCase()
      const sn8 = this.getBlueSn8(advertisData)
      //1.0华凌空调特殊处理，添加设备发现页才处理逻辑
      //2.0华凌空调特殊处理，首页发现页、添加设备发现页都要处理处理逻辑 A用户已蓝牙直连，则首页、添加设备自发现没有，B用户只有在添加设备页才出现
      // && !isIndex
      if (category == '0xAC' && addDeviceSDK.isBlueAfterLinlNetAc(category, sn8)) {
        let item
        let { curUserMatchNetAcDevices, curUserBluetoothAcDevices } = app.globalData
        let curUserAcDevices = [...curUserMatchNetAcDevices, ...curUserBluetoothAcDevices]
        if (curUserAcDevices?.length) {
          console.log('curUserAcDevices==========', curUserAcDevices)
          for (let i = 0; i <= curUserAcDevices.length; i++) {
            item = curUserAcDevices[i]
            if (item && item.btMac.replace(/:/g, '').toUpperCase() == mac) {
              //无论是否被绑定 只要当前用户下没该设备都允许发现显示
              console.log('当前用户有wifi绑定该设备1', item, mac)
              return true
            }
            if (item && item.btMac.replace(/:/g, '').toUpperCase().slice(0, 10) == mac.slice(0, 10)) {
              //无论是否被绑定 只要当前用户下没该设备都允许发现显示
              console.log('当前用户有wifi绑定该设备2', item, mac)
              return true
            }
            if (!scanRespPackInfo.isBindble && isIndex == 1) {
              //判断设备是否在A用户已蓝牙直连，且B用户不能在首页自发现
              console.log('判断设备是否在A用户已蓝牙直连，且B用户不能在首页自发现')
              return true
            }
          }
        }
        console.log('当前用户没有绑定该设备', advertisData, device)
        return false
      }
      let { isLinkWifi, isBindble, moduleType } = scanRespPackInfo
      // 二代单BLE模组
      if (blueVersion == 2) {
        return isLinkWifi || isBindble
      } else if (moduleType === blueWifi) {
        return isLinkWifi
      }
      return false
    },
    getBluetooyhMixinDcpDeviceImg() {
      return new Promise((resolve) => {
        let reqData = {
          version: '',
        }

        const obj = app.globalData.dcpDeviceImgList
        console.log('设备图片', obj)
        if (JSON.stringify(obj) != '{}') {
          console.log('设备图片2', app.globalData.dcpDeviceImgList)
          resolve(app.globalData.dcpDeviceImgList)
          return
        }
        requestService.request('getIotDeviceImg', reqData).then((res) => {
          console.log('设备图片3', res.data.data.iconList)
          this.setData({
            dcpDeviceImgList: res.data.data.iconList,
          })
          app.globalData.dcpDeviceImgList = res.data.data.iconList
          resolve()
        })
      })
    },
    filterMideaDevice(obj) {
      if (obj.advertisData != null) {
        const hexStr = ab2hex(obj.advertisData)
        const brand = hexStr.slice(0, 4)
        return brand == 'a806' ? true : false
      }
    },

    createBLEConnection(e) {
      const ds = e.currentTarget.dataset
      const deviceId = ds.deviceId
      const name = ds.name
      wx.createBLEConnection({
        deviceId,
        success: () => {
          this.setData({
            connected: true,
            name,
            deviceId,
          })
          this.getBLEDeviceServices(deviceId)
        },
      })
      this.stopBluetoothDevicesDiscovery()
    },
    closeBLEConnection() {
      wx.closeBLEConnection({
        deviceId: this.data.deviceId,
      })
      this.setData({
        connected: false,
        chs: [],
        canWrite: false,
      })
    },
    getBLEDeviceServices(deviceId) {
      wx.getBLEDeviceServices({
        deviceId,
        success: (res) => {
          for (let i = 0; i < res.services.length; i++) {
            if (res.services[i].isPrimary) {
              this.getBLEDeviceCharacteristics(deviceId, res.services[i].uuid)
              return
            }
          }
        },
      })
    },
    getBLEDeviceCharacteristics(deviceId, serviceId) {
      wx.getBLEDeviceCharacteristics({
        deviceId,
        serviceId,
        success: (res) => {
          console.log('getBLEDeviceCharacteristics success', res.characteristics)
          for (let i = 0; i < res.characteristics.length; i++) {
            let item = res.characteristics[i]
            if (item.properties.read) {
              wx.readBLECharacteristicValue({
                deviceId,
                serviceId,
                characteristicId: item.uuid,
              })
            }
            if (item.properties.write) {
              this.setData({
                canWrite: true,
              })
              this._deviceId = deviceId
              this._serviceId = serviceId
              this._characteristicId = item.uuid
              this.writeBLECharacteristicValue()
            }
            if (item.properties.notify || item.properties.indicate) {
              wx.notifyBLECharacteristicValueChange({
                deviceId,
                serviceId,
                characteristicId: item.uuid,
                state: true,
              })
            }
          }
        },
        fail(res) {
          console.error('getBLEDeviceCharacteristics', res)
        },
      })
      // 操作之前先监听，保证第一时间获取数据
      wx.onBLECharacteristicValueChange((characteristic) => {
        const idx = inArray(this.data.chs, 'uuid', characteristic.characteristicId)
        const data = {}
        if (idx === -1) {
          data[`chs[${this.data.chs.length}]`] = {
            uuid: characteristic.characteristicId,
            value: ab2hex(characteristic.value),
          }
        } else {
          data[`chs[${idx}]`] = {
            uuid: characteristic.characteristicId,
            value: ab2hex(characteristic.value),
          }
        }
        // data[`chs[${this.data.chs.length}]`] = {
        //   uuid: characteristic.characteristicId,
        //   value: ab2hex(characteristic.value)
        // }
        this.setData(data)
      })
    },
    writeBLECharacteristicValue() {
      // 向蓝牙设备发送一个0x00的16进制数据
      let buffer = new ArrayBuffer(1)
      let dataView = new DataView(buffer)
      dataView.setUint8(0, (Math.random() * 255) | 0)
      wx.writeBLECharacteristicValue({
        deviceId: this._deviceId,
        serviceId: this._deviceId,
        characteristicId: this._characteristicId,
        value: buffer,
      })
    },
    closeBluetoothAdapter() {
      wx.closeBluetoothAdapter()
      clearTimeout(timer)
      console.log('关闭定时器', timer)
      this._discoveryStarted = false
    },
    setBlueStatus() {
      this.setData({
        isBluetoothMixinNotOpenWxLocation: true,
      })
    },
    /**
     *
     * @param {boolean} forceUpdate 是否强制更新systeminfo settinginfo
     * @returns
     */
    checkSystemInfo(forceUpdate = true) {
      this.clearMixinInitData()
      return new Promise((resolve) => {
        Promise.all([
          getWxSystemInfo({ forceUpdate }),
          getWxGetSetting({
            forceUpdate,
            success() {
              getApp().setMethodCheckingLog('wx.getSetting()')
            },
            fail(error) {
              getApp().setMethodFailedCheckingLog('wx.getSetting()', `获取授权信息异常${JSON.stringify(error)}`)
            },
          }),
        ]).then((res) => {
          if (!res[0].locationEnabled || !res[0].locationAuthorized || !res[1]['authSetting']['scope.userLocation']) {
            this.setData({
              isBluetoothMixinNotOpenWxLocation: true,
            })
          } else {
            this.setData({
              isBluetoothMixinNotOpenWxLocation: false,
            })
          }
          if (!res[0].bluetoothEnabled) {
            this.setData({
              isBluetoothMixinNotOpen: true,
            })
          } else {
            this.setData({
              isBluetoothMixinNotOpen: false,
            })
          }
          if (res[1]['authSetting']['scope.bluetooth']) {
            this.setData({
              isBluetoothMixinHasAuthBluetooth: true,
            })
          } else {
            this.setData({
              isBluetoothMixinHasAuthBluetooth: false,
            })
          }
          resolve(res)
          console.log(
            'getSystemInfo',
            res,
            this.data.isBluetoothMixinNotOpenWxLocation,
            this.data.isBluetoothMixinNotOpen,
            this.data.isBluetoothMixinHasAuthBluetooth,
            app.globalData.hasAuthLocation,
            app.globalData.hasAuthBluetooth
          )
        })
      })
    },
    getAuthSetting(forceUpdate = true) {
      return new Promise((resolve) => {
        getWxGetSetting({
          forceUpdate,
          success(res) {
            getApp().setMethodCheckingLog('wx.getSetting()')
            resolve(res.authSetting)
          },
          fail(error) {
            getApp().setMethodFailedCheckingLog('wx.getSetting()', `获取授权信息异常${JSON.stringify(error)}`)
          },
        })
      })
    },
    setMixinsBluetoothClose() {
      timer = setTimeout(() => {
        // this.closeBluetoothAdapter()
        this.stopBluetoothDevicesDiscovery()
        console.log('扫描到的设备', this.data.devices)
        console.log('关闭发现蓝牙')
      }, searchTime)
    },
    setMixinsDialogShow() {
      if (this.data.isDeviceLength) return // 避免重复赋值
      if (this.data.devices.length == 0) return
      this.setData({
        isDeviceLength: true,
      })
    },
    clearMixinInitData() {
      this.setData({
        isBluetoothMixinGoSetting: false,
        isBluetoothMixinOpenLocation: false,
      })
    },
    checkIfSupport(mode, moduleType, category, sn8) {
      //校验是否支持控制的设备
      let formatType = '0x' + category.toLocaleUpperCase()
      if (!isSupportPlugin(formatType, sn8)) {
        console.log('自发现 插件不支持')
        return false
      }
      // if (mode !== 0 && moduleType === '0' && (category !== 'C0')) {
      //   return false
      // }
      if (!isAddDevice(category.toLocaleUpperCase(), sn8)) {
        console.log('自发现 未测试不支持')
        return false
      }
      return true
    },
    //获取配网指引
    getAddDeviceGuide(fm = 'scanCode', deviceInfo = {}) {
      let { mode, type, sn8, enterprise, ssid, productId, tsn, sn } = deviceInfo
      let isModeType = false
      let modeType = ''
      if(mode == 'air_conditioning_bluetooth_connection'|| mode == 'air_conditioning_bluetooth_connection_network' || mode == 'WB01_bluetooth_connection_network'){
        modeType = 3
        isModeType = true
      }
      return new Promise((resolve, reject) => {
        if (fm == 'autoFound') {
          let reqData = {
            reqId: getReqId(),
            stamp: getStamp(),
            ssid: ssid,
            enterpriseCode: enterprise,
            category: type.includes('0x') ? type.substr(2, 2) : type,
            code: sn8,
            mode: isModeType?modeType + '':mode + '',
            queryType: 2,
          }
          console.log('自发现请求确权指引', reqData)
          requestService
            .request('multiNetworkGuide', reqData, 'POST', '', 2000)
            .then((resp) => {
              let netWorking = resp.data.data.cableNetWorking ? 'cableNetWorking' : 'wifiNetWorking'
              console.log('自发现获得确权指引', resp)
              console.log('配网指引信息', resp.data.data[netWorking].mainConnectinfoList[0].connectDesc)
              resolve(resp)
            })
            .catch((error) => {
              console.log(error)
              reject(error)
            })
        }
        if (fm == 'selectType') {
          let reqData = {
            code: sn8,
            reqId: getReqId(),
            stamp: getStamp(),
            enterpriseCode: enterprise,
            category: type.includes('0x') ? type.substr(2, 2) : type,
            productId: productId,
            queryType: 1,
          }
          console.log('自发现请求确权指引', reqData)
          requestService
            .request('multiNetworkGuide', reqData)
            .then((resp) => {
              let netWorking = resp.data.data.cableNetWorking ? 'cableNetWorking' : 'wifiNetWorking'
              console.log('配网指引信息 选型', resp.data.data[netWorking].mainConnectinfoList)
              resolve(resp)
            })
            .catch((error) => {
              console.log(error)
              reject(error)
            })
        }
        if (fm == 'scanCode') {
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
          console.log('扫码请求确权指引', reqData)
          requestService
            .request('multiNetworkGuide', reqData)
            .then((resp) => {
              let netWorking = resp.data.data.cableNetWorking ? 'cableNetWorking' : 'wifiNetWorking'
              console.log('配网指引信息 扫码', resp.data.data[netWorking].mainConnectinfoList)
              resolve(resp)
            })
            .catch((error) => {
              console.log(error)
              reject(error)
            })
        }
      })
    },
    //指引获取失败处理-微信自发现
    getGuideFailWX() {
      Dialog.confirm({
        title: '未获取到设备操作指引，请检查网络后重试，若仍失败请联系客服处理',
        confirmButtonText: '回到首页',
        confirmButtonColor: this.data.dialogStyle.confirmButtonColor2,
        showCancelButton: false,
        zIndex: 99999,
      }).then((res) => {
        wx.switchTab({
          url: '/pages/index/index',
        })
      })
    },
    //指引获取失败处理
    getGuideFail(fm) {
      let self = this
      let cancelText = '此二维码获取配网指引失败，请使用选择型号添加'
      if (fm !== 'scanCode') {
        // showToast('配网指引获取失败')
        Dialog.confirm({
          title: '未获取到该产品的操作指引，请检查网络后重试，若仍失败，请联系售后处理',
          confirmButtonText: '好的',
          confirmButtonColor: this.data.dialogStyle.confirmButtonColor2,
          showCancelButton: false,
          zIndex: 99999,
        }).then((res) => {})
        // wx.showModal({
        //   content: '未获取到该产品的操作指引，请检查网络后重试，若仍失败，请联系售后处理',
        //   confirmText: '好的',
        //   confirmColor: '#458BFF',
        //   showCancel: false,
        //   success(res) {},
        // })
      } else {
        // let cancelText = fm == 'scanCode' ? '此二维码获取配网指引失败，请使用选择型号添加' : '配网指引获取失败'
        wx.showModal({
          content: cancelText,
          cancelText: '重新扫码',
          confirmText: '选型添加',
          cancelColor: '#458BFF',
          confirmColor: '#458BFF',
          success(res) {
            if (res.confirm) {
              //选型
              self.goSelectDevice()
            } else if (res.cancel) {
              //扫码
              self.actionScan()
            }
          },
        })
      }
    },

    /**
     * 获取密钥错误处理及重试逻辑 （落地页）
     * @param {*} addDeviceInfo
     */
    privateKeyErrorHand(item) {
      let self = this
      let cancelText = '取消'
      if (item.fm == 'scanCode') {
        cancelText = '返回首页'
      }
      let obj = {
        page_name: '中间页',
        widget_id: 'key_server_failed',
        widget_name: '密钥获取失败弹窗',
        sn8: app.addDeviceInfo.sn8 || '',
        widget_cate: app.addDeviceInfo.type || '',
      }
      getPrivateKeys.privateBurialPoint(obj)
      Dialog.confirm({
        title: '服务器连接失败',
        message: '请检查网络或稍后再试',
        confirmButtonText: '重试',
        confirmButtonColor: this.data.dialogStyle.confirmButtonColor2,
        cancelButtonColor: this.data.dialogStyle.cancelButtonColor2,
        zIndex: 99999,
      })
        .then(async (res) => {
          if (res.action == 'confirm') {
            wx.hideLoading()
            self.setData({
              clickFLag: false,
            })
            obj.widget_id = 'click_retry'
            obj.widget_name = '密钥获取失败弹窗重试按钮'
            getPrivateKeys.privateBurialPoint(obj)
            try {
              await getPrivateKeys.getPrivateKey()
              this.actionGoNetwork(item)
            } catch (err) {
              console.log('Yoram err is ->', err)
              this.privateKeyErrorHand(item)
            }
          }
        })
        .catch((error) => {
          if (error.action == 'cancel') {
            wx.hideLoading()
            self.setData({
              clickFLag: false,
            })
            obj.widget_id = 'click_cancel'
            obj.widget_name = '密钥获取失败弹窗取消按钮'
            getPrivateKeys.privateBurialPoint(obj)
            if (item.fm == 'scanCode') {
              wx.switchTab({
                url: '/pages/index/index',
              })
            }
          }
        })
      // wx.showModal({
      //   title: '服务器连接失败',
      //   content: '请检查网络或稍后再试',
      //   confirmText: '重试',
      //   cancelText: cancelText,
      //   complete: async (res) => {
      //     if (res.cancel) {
      //       wx.hideLoading()
      //       self.setData({
      //         clickFLag: false,
      //       })
      //       obj.widget_id = 'click_cancel'
      //       obj.widget_name = '密钥获取失败弹窗取消按钮'
      //       getPrivateKeys.privateBurialPoint(obj)
      //       if (item.fm == 'scanCode') {
      //         wx.switchTab({
      //           url: '/pages/index/index',
      //         })
      //       }
      //     }

      //     if (res.confirm) {
      //       wx.hideLoading()
      //       self.setData({
      //         clickFLag: false,
      //       })
      //       obj.widget_id = 'click_retry'
      //       obj.widget_name = '密钥获取失败弹窗重试按钮'
      //       getPrivateKeys.privateBurialPoint(obj)
      //       try {
      //         await getPrivateKeys.getPrivateKey()
      //         this.actionGoNetwork(item)
      //       } catch (err) {
      //         console.log('Yoram err is ->', err)
      //         this.privateKeyErrorHand(item)
      //       }
      //     }
      //   },
      // })
    },

    async actionGoNetwork(item) {
      // 节流
      if (this.actionGoNetworkLock) return
      this.actionGoNetworkLock = setTimeout(() => {
        this.actionGoNetworkLock = null
      }, 1000)
      console.log('item===========111', item)

      const addDeviceInfo = {
        adData: item.adData || '',
        uuid: item.advertisServiceUUIDs || '',
        localName: item.localName || '',
        isFromScanCode: item.isFromScanCode || false,
        deviceName: item.deviceName || '',
        deviceId: item.deviceId || '', //设备蓝牙id
        mac: item.mac || '', //设备mac 'A0:68:1C:74:CC:4A'
        type: item.category || '', //设备品类 AC
        sn8: item.sn8 || '',
        deviceImg: item.deviceImg || '', //设备图片
        moduleType: item.moduleType || '', //模组类型0：ble  1:ble+weifi
        blueVersion: item.blueVersion || '', //蓝牙版本1:1代  2：2代
        mode: item.mode,
        tsn: item.tsn || '',
        bssid: item.bssid || '',
        ssid: item.SSID || '',
        enterprise: item.enterprise || '',
        fm: item.fm || 'autoFound',
        rssi: item.RSSI,
        referenceRSSI: item.referenceRSSI || '',
        guideInfo: item.guideInfo || null,
        plainSn: item.plainSn || '',
        sn: item.sn || '',
        fmType: item.fmType || '', //判断自发现设备信息是ap自发现还是蓝牙自发现
      }
      if (!addDeviceInfo.deviceImg || !addDeviceInfo.deviceName) {
        // 设备图片或名称缺失则补全
        const typeAndName = this.getDeviceImgAndName(addDeviceInfo.type, addDeviceInfo.sn8)
        if (!addDeviceInfo.deviceImg) addDeviceInfo.deviceImg = typeAndName.deviceImg
        if (!addDeviceInfo.deviceName) addDeviceInfo.deviceName = typeAndName.deviceName
      }
      app.addDeviceInfo = addDeviceInfo
      console.log('addDeviceInfo数据111', addDeviceInfo)
      // wx.setStorageSync('addDeviceInfo', addDeviceInfo)
      // wx.stopBluetoothDevicesDiscovery()
      this.stopBluetoothDevicesDiscovery()
      // this.closeWifiScan()
      clearTimeout(timer)
      clearTimeout(timer1)
      if (item.fm == 'scanCode') {
        //兼容扫码触发蓝牙自发现处理
        this.data.isScanCodeSuccess = true
      }
      //获取后台配置对应的配网方式
      if (item.fm == 'scanCode' || item.fm == 'autoFound') {
        try {
          let guideInfo = addDeviceInfo.guideInfo
          // ap自发现不请求配网指引
          if (addDeviceInfo.fmType != 'ap' && !addDeviceInfo.guideInfo) {
            guideInfo = await this.getAddDeviceGuide(item.fm, addDeviceInfo)
          }
          let netWorking = guideInfo?.data?.data?.cableNetWorking ? 'cableNetWorking' : 'wifiNetWorking'
          if (item.fm == 'scanCode') {
            //扫码去后台配置的配网方式
            app.addDeviceInfo.mode = guideInfo.data.data[netWorking].mainConnectinfoList[0].mode //重置配网方式
            app.addDeviceInfo.dataSource = guideInfo.data.data[netWorking].dataSource
            app.addDeviceInfo.brandTypeInfo = guideInfo.data.data[netWorking].brand // 保存设备的品牌
          }
          app.addDeviceInfo.mode = addDeviceSDK.getMode(app.addDeviceInfo.mode)
          app.addDeviceInfo.linkType = addDeviceSDK.getLinkType(app.addDeviceInfo.mode) //重置连接方式
          if (guideInfo?.data?.data[netWorking]?.mainConnectinfoList?.length) {
            console.log('后台配置的配网方式=====', guideInfo.data.data[netWorking].mainConnectinfoList[0].mode)
            app.addDeviceInfo.guideInfo = guideInfo.data.data[netWorking].mainConnectinfoList //暂存指引
          }
          let codeExtInfo = ''
          let cateExtInfo = ''
          let sn8ExtInfo = ''
          if (guideInfo?.data) {
            let { code, data } = guideInfo.data
            codeExtInfo = code ? code + '' : ''
            cateExtInfo = data[netWorking]?.category ? data[netWorking].category : ''
            sn8ExtInfo = data[netWorking]?.mainConnectinfoList?.length
              ? data[netWorking].mainConnectinfoList[0].code
              : ''
          }
          clickEventTracking('user_behavior_event', 'serverGuideResult', {
            device_info: {
              device_session_id: app.globalData.deviceSessionId, //一次配网事件标识
              sn: '', //sn码
              sn8: item.sn8, //sn8码
              a0: '', //a0码
              widget_cate: item.category, //设备品类
              wifi_model_version: '', //模组wifi版本
              link_type: app.addDeviceInfo.linkType, //连接方式 bluetooth/ap/...
              iot_device_id: '', //设备id
            },
            ext_info: {
              code: codeExtInfo,
              cate: cateExtInfo,
              sn8: sn8ExtInfo,
            },
          })
        } catch (error) {
          getApp().setMethodFailedCheckingLog('actionGoNetwork', `获取配网指引失败:${JSON.stringify(error)}`)
          console.log('[get add device guide error]', error)
          // if (error.errMsg) {
          //   showToast('网络不佳，请检查网络')
          //   return
          // }
          //微信扫一扫二维码进入配网，没获取到配网指引跳转到下载app页面
          if (app.globalData.fromWechatScan) {
            Dialog.confirm({
              title: '该设备暂不支持添加，功能正在迭代升级中，敬请期待',
              confirmButtonText: '我知道了',
              confirmButtonColor: this.data.dialogStyle.confirmButtonColor2,
              showCancelButton: false,
            }).then((res) => {
              if (res.action == 'confirm') {
                wx.switchTab({
                  url: homePage,
                })
              }
            })
            return
          }
          // if (item.blueVersion != 2) {
          //   /**
          //    * 一代蓝牙需要配网指引，无指引的情况getGuideFail处理
          //    * 二代蓝牙不需要配网指引，直接放行
          //    */
          //   this.getGuideFail(item.fm)
          //   return
          // }
          if (item.fm != 'autoFound') {
            if (item.wxAuto) {
              this.getGuideFailWX()
              return
            }
            this.getGuideFail(item.fm)
            return
          } else {
            if (item.blueVersion != 2) {
              this.getGuideFail(item.fm)
              return
            }
          }
        }
      }
      // 校验小程序支持的配网方式
      if (!addDeviceSDK.isSupportAddDeviceMode(app.addDeviceInfo.mode)) {
        if (this.setDialogMixinsData) {
          this.setDialogMixinsData(true, '该设备暂不支持添加，功能正在迭代升级中，敬请期待', '', false, [
            {
              btnText: '我知道了',
              flag: 'confirm',
            },
          ])
        } else {
          // wx.showModal({
          //   content: '该设备暂不支持添加，功能正在迭代升级中，敬请期待',
          //   confirmText: '我知道了',
          //   confirmColor: '#267aff',
          //   showCancel: false,
          // })
          Dialog.confirm({
            title: '该设备暂不支持添加，功能正在迭代升级中，敬请期待',
            confirmButtonText: '我知道了',
            confirmButtonColor: this.data.dialogStyle.confirmButtonColor2,
            showCancelButton: false,
          }).then((res) => {
            if (res.action == 'confirm') {
            }
          })
        }
      }
      // 判断全局的密钥有没有，有就跳过，没有就重新拉取
      if (!app.globalData.privateKey && app.addDeviceInfo.mode != '103' && app.addDeviceInfo.mode != '100') {
        if (app.globalData.privateKeyIntervalNum) {
          clearInterval(app.globalData.privateKeyIntervalNum)
        }
        try {
          await getPrivateKeys.getPrivateKey()
          this.actionGoNetwork(item)
        } catch (err) {
          this.privateKeyErrorHand(item)
        }
        return
      }
      // 结束判断全局的密钥有没有，有就跳过，没有就重新拉取
      if (addDeviceSDK.isCanWb01BindBLeAfterWifi(addDeviceInfo.type, addDeviceInfo.sn8)) {
        //需要wb01直连后配网判断
        app.addDeviceInfo.mode = 'WB01_bluetooth_connection'
        wx.navigateTo({
          url: addGuide,
        })
      }
      let mode = app.addDeviceInfo.mode
      if (mode == 0 || mode == 3) {
        wx.navigateTo({
          url: inputWifiInfo,
        })
      } else if (mode == 5 || mode == 9 || mode == 10 || mode == 'air_conditioning_bluetooth_connection' || mode == 100 || mode == 103) {
        wx.navigateTo({
          url: addGuide,
        })
      } else if (mode == 8) {
        app.addDeviceInfo.linkType = 'NB-IOT'
        app.globalData.deviceSessionId = creatDeviceSessionId(app.globalData.userData.uid) //创建一次配网标识
        clickEventTracking('user_behavior_event', 'nfc_NB', {
          device_info: {
            device_session_id: app.globalData.deviceSessionId, //一次配网事件标识
            sn: item.plainSn || '', //sn码
            sn8: item.sn8 || '', //sn8码
            a0: '', //a0码
            widget_cate: item.type, //设备品类
            wifi_model_version: '', //模组wifi版本
            link_type: 'NB-IOT', //连接方式 bluetooth/ap/
          },
        })
        wx.navigateTo({
          url: linkDevice,
        })
      }
    },
    clearDevices() {
      this.setData({
        devices: [],
        isDeviceLength: false,
      })
    },
    //ap 配网相关2021-08-01 新增
    /**
     * 开始AP自发现
     * @param {Number} isIndex 是否首页
     */
    async getWifiList(isIndex = 1) {
      const brandConfig = app.globalData.brandConfig[app.globalData.brand]
      if (!brandConfig.ap) return
      const res = await this.checkSystem()
      if (res) return
      service.getWxApiPromise(wx.startWifi).then((res1) => {
        console.log('@module bluetooth.js\n@method getWifiList\n@desc startWifi成功\n', res1)
        if (isIndex == 1) {
          this.setMixinsWifiClose()
        }
        setTimeout(() => {
          service.getWxApiPromise(wx.getWifiList)
        }, 1000)
        wx.onGetWifiList((res3) => {
        //   console.log('@module bluetooth.js\n@method getWifiList\n@desc 获取到WiFi列表\n', res3)
          res3.wifiList.forEach((device) => {
            // 校验设备热点名称
            if (!this.filterAPName(brandConfig.apNameHeader, device.SSID)) return
            // console.log('@module bluetooth.js\n@method getWifiList\n@desc 通过名称校验\n', device)
            // WiFi强度校验
            // todo:Yoram930 调试，暂时放开信号强度
            // console.log("=====device=======",device)
            if (device.signalStrength < 99) return
            // console.log('@module bluetooth.js\n@method getWifiList\n@desc 通过ap强度校验\n', device)
            //校验是否蓝牙已发现
            if (!this.filterBluetoothScan(device.SSID)) return
            // 若首页则需处理wx.getWifiList缓存，校验是否是已配网的设备
            if (isIndex == 1) {
              console.log(
                '@module bluetooth.js\n@method getWifiList\n@desc 已配网缓存数据\n',
                app.globalData.curAddedApDeviceList
              )
              if (addDeviceSDK.checkIsAddedApDevice(device.SSID)) {
                console.log(
                  '@module bluetooth.js\n@method getWifiList\n@desc 过滤已配网设备\n',
                  app.globalData.curAddedApDeviceList,
                  device.SSID
                )
                return
              }
            }
            //获取已发现设备的需要字段
            const deviceData = this.getDeviceData(device)
            //蓝牙和ap自发现到同一个SSID，以蓝牙不支持配网为准
            if (!this.filterBluetoothUnSupport(device.SSID)) {
              deviceData.isSupport = false
            }
            //获取已发现列表
            const foundDevices = this.data.devices
            let sortDevice = this.sortScanDevice(foundDevices, deviceData)
            //AP自发现设备里去掉找朋友发现的朋友设备信息
            // console.log('朋友设备信息', app.globalData.friendDevices)
            // let friendDevices = app.globalData.friendDevices ? app.globalData.friendDevices : []
            // let ssids = friendDevices.map((item) => {
            //   return item.ssid
            // })
            // sortDevice = sortDevice.filter((item) => {
            //   return !ssids.includes(item.SSID)
            // })
            this.setData({
              devices: sortDevice,
            })
            console.log('添加的AP自发现设备', this.data.devices)
            this.setMixinsDialogShow()
          })
          setTimeout(() => {
            wx.getWifiList({
              fail: () => {},
            })
          }, 2000)
        })
      })
    },
    sortScanDevice(foundDevices, deviceData, str) {
      return this.getSortDataByFindTime(foundDevices, deviceData, str)
    },
    closeWifiScan() {
      service.getWxApiPromise(wx.stopWifi)
    },
    clearMixinsTime() {
      clearTimeout(timer)
      clearTimeout(timer1)
    },
    setMixinsWifiClose() {
      timer1 = setTimeout(() => {
        console.log('关闭wifi')
        wx.offGetWifiList()
      }, searchTime)
    },
    /**
     * 校验设备热点名称
     * @param {string} header 设备热点名称开头
     * @param {string} SSID 设备热点名称
     */
    filterAPName(header, SSID) {
      SSID = SSID.toLocaleLowerCase()
      const headerReg = header
        .reduce((previous, current) => {
          previous.push(current + '_')
          return previous
        }, [])
        .join('|')
      const reg = new RegExp(`(${headerReg})[0-9a-fA-F]{2}_[0-9a-zA-Z]{4}`)

      return reg.test(SSID)
    },
    filterBluetoothScan(SSID) {
      const fonudDevices = this.data.devices
      const idx = inArray(fonudDevices, 'SSID', SSID)
    //   console.log('SSID 筛查', fonudDevices, idx)
      return idx === -1 ? true : false
    },
    //ap和蓝牙自发现到同一个SSID的设备，以蓝牙不支持配网结果为准，不显示在自发现弹窗
    filterBluetoothUnSupport(SSID) {
      let { bluetoothUnSupport } = app.globalData
      if (bluetoothUnSupport && bluetoothUnSupport.length != 0) {
        const idx = inArray(bluetoothUnSupport, 'SSID', SSID)
        return idx === -1 ? true : false
      } else {
        return true
      }
    },
    getApCategory(SSID) {
      const arr = SSID.split('_')
      console.log('SSSSSSSsSSS', arr[1])
      // return SSID.slice(6,8)
      return arr[1]
    },
    //构造数据
    getDeviceData(deviceData) {
      console.log('deviceData=========', deviceData)
      const result = new Object()
      const category = this.getApCategory(deviceData.SSID).toUpperCase()
      const typeAndName = this.getDeviceImgAndName(category)
      let formatType = '0x' + category.toLocaleUpperCase()
      const isSupport = app.globalData.brandConfig[app.globalData.brand].pluginFilter_type.includes(formatType) //ap 自发现是否有插件只校验品类
      const enterprise = this.getEnterPrise(deviceData.SSID)
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
      result.fmType = 'ap' //AP自发现设备信息添加标识
      return result
    },
    getEnterPrise(SSID) {
      const arr = SSID.split('_')
      return arr[0] == 'bugu' ? '0010' : '0000'
    },

    getDeviceApImgAndName(dcpDeviceImgList, category) {
      let item = new Object()
      console.log('获取图标命名称1', dcpDeviceImgList, category)
      if (dcpDeviceImgList[category]) {
        item.deviceImg = dcpDeviceImgList[category].common
      } else {
        console.log('没找到', deviceImgMap)
        if (deviceImgMap[category]) {
          item.deviceImg = deviceImgApi.url + 'blue_' + category.toLocaleLowerCase() + '.png'
        } else {
          item.deviceImg = deviceImgApi.url + 'blue_default_type.png'
        }
      }
      if (deviceImgMap[category]) {
        const filterObj = deviceImgMap[category]
        item.deviceName = filterObj.title
      } else {
        item.deviceName = ''
      }
      console.log('获取图标命名称2', item)
      return item
    },
    checkWxVersion() {
      const version = app.globalData.systemInfo.version
      const arr = version.split('.')
      console.log('version11', parseInt(arr[0]) < 8)
      if (parseInt(arr[0]) < 8) return false
      if (parseInt(arr[0]) >= 8 && parseInt(arr[1]) === 0 && parseInt(arr[2]) < 7) return false
      return true
    },
    checkSystem() {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve) => {
        const systemInfo = await getWxSystemInfo()
        const platform = systemInfo && systemInfo.platform
        const result = platform.indexOf('ios') > -1 ? true : false
        resolve(result)
      })
    },
    getSortDataByFindTime(currArr, info, str) {
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
    },
    /**
     * 请求授权小程序使用位置权限
     */
    locationAuthorize() {
      let _this = this
      if (!app.globalData.hasAuthLocation && !app.globalData.showLocationAuthCount) {
        app.globalData.showLocationAuthCount = 1
        wx.authorize({
          scope: 'scope.userLocation',
          async success() {
            _this.setData({
              showPopup:true
          })
            if (!app.globalData.isBluetoothMixinNotOpenWxLocation) {
              await _this.checkSystemInfo()
            }
            app.globalData.hasAuthLocation = true
          },
          fail(err) {
            if (err.errMsg.includes('deny')) {
              app.globalData.hasAuthLocation = true
            }
          },
          complete() {
            app.globalData.showLocationAuthCount = 0
          },
        })
      }
    },
    /**
     * 请求授权小程序使用蓝牙权限
     */
    bluetoothAuthorize() {
      let _this = this
      if (!app.globalData.hasAuthBluetooth && !app.globalData.showBluetoothAuthCount) {
        app.globalData.showBluetoothAuthCount = 1
        //用户授权小程序使用蓝牙权限预览埋点
        rangersBurialPoint('user_page_view', {
          page_path: getFullPageUrl(),
          module: '公共',
          page_id: 'popus_page_bluetooth_auth',
          page_name: '蓝牙授权弹窗',
          object_type: '',
          object_id: '',
          object_name: '',
          device_info: {},
          ext_info: {},
          sn: '',
          tsn: '',
          dsn: '',
          type: '',
        })
        wx.authorize({
          scope: 'scope.bluetooth',
          async success() {
            //用户授权小程序使用蓝牙权限允许点击埋点
            clickEventTracking('user_behavior_event', 'bluetoothAuthorize', {
              page_path: getFullPageUrl(),
              module: '公共',
              page_id: 'popus_page_bluetooth_auth',
              page_name: '蓝牙授权弹窗',
              page_module: '',
              widget_name: '允许',
              widget_id: 'click_allow',
              rank: '',
              object_type: '',
              object_id: '',
              object_name: '',
              device_info: {},
              ext_info: {},
              sn: '',
              tsn: '',
              dsn: '',
              type: '',
            })
            if (!app.globalData.isBluetoothMixinHasAuthBluetooth) {
              await _this.checkSystemInfo()
            }
            app.globalData.hasAuthBluetooth = true
          },
          fail(err) {
            if (err.errMsg.includes('deny')) {
              app.globalData.hasAuthBluetooth = true
              //用户授权小程序使用蓝牙权限拒绝点击埋点
              clickEventTracking('user_behavior_event', 'bluetoothAuthorize', {
                page_path: getFullPageUrl(),
                module: '公共',
                page_id: 'popus_page_bluetooth_auth',
                page_name: '蓝牙授权弹窗',
                page_module: '',
                widget_name: '拒绝',
                widget_id: 'click_cancel',
                rank: '',
                object_type: '',
                object_id: '',
                object_name: '',
                device_info: {},
                ext_info: {},
                sn: '',
                tsn: '',
                dsn: '',
                type: '',
              })
            }
          },
          complete() {
            app.globalData.showBluetoothAuthCount = 0
            try {
              _this.timing(_this.data.time)
            } catch (error) {
              console.log('不执行timing')
            }
          },
        })
      }
    },

    //位置和蓝牙弹窗提示点击埋点
    locationAndBluetoothClickTrack(flag, deviceInfo) {
      let sn8 = deviceInfo && deviceInfo.sn8 ? deviceInfo.sn8 : ''
      let type = deviceInfo && deviceInfo.type ? deviceInfo.type : ''
      this.setData({
        isSureDialog: false,
        showOpenBluetooth: false,
        showOpenLocation: false,
      })
      if (flag == 'bluetoothAuth') {
        let params = {
          page_path: getFullPageUrl(),
          module: 'appliance',
          page_id: 'popus_page_auth_msg',
          page_name: '提示授权允许信息弹窗',
          page_module: '',
          widget_name: '我知道了',
          widget_id: 'click_knew',
          rank: '',
          object_type: '',
          object_id: '',
          object_name: '',
          device_info: {
            device_session_id: app.globalData.deviceSessionId, //一次配网事件标识
            sn: '', //sn码
            sn8: sn8, //sn8码
            a0: '', //a0码
            widget_cate: type, //设备品类
            wifi_model_version: '', //模组wifi版本
            link_type: 'bluetooth', //连接方式 bluetooth/WiFi..
            iot_device_id: '', //设备id
          },
          ext_info: {
            refer_page_name: getFullPageUrl(),
          },
          sn: '',
          tsn: '',
          dsn: '',
          type: '',
        }
        //用户未授权小程序使用蓝牙权限弹窗"我知道了"点击埋点
        clickEventTracking('user_behavior_event', 'bluetoothAuthorize', params)
      } else if (flag == 'openBluetooth') {
        let params = {
          page_path: getFullPageUrl(),
          module: 'appliance',
          page_id: 'popus_page_open_bluetooth',
          page_name: '提示开启蓝牙弹窗',
          page_module: '',
          widget_name: '我知道了',
          widget_id: 'click_knew',
          rank: '',
          object_type: '',
          object_id: '',
          object_name: '',
          device_info: {
            device_session_id: app.globalData.deviceSessionId, //一次配网事件标识
            sn: '', //sn码
            sn8: sn8, //sn8码
            a0: '', //a0码
            widget_cate: type, //设备品类
            wifi_model_version: '', //模组wifi版本
            link_type: 'bluetooth', //连接方式 bluetooth/WiFi..
            iot_device_id: '', //设备id
          },
          ext_info: {
            refer_page_name: getFullPageUrl(),
          },
          sn: '',
          tsn: '',
          dsn: '',
          type: '',
        }
        //用户未开启蓝牙弹窗"我知道了"点击埋点
        clickEventTracking('user_behavior_event', 'bluetoothAuthorize', params)
      } else if (flag == 'openLocation') {
        //用户未开启位置信息弹窗"我知道了"点击埋点
        clickEventTracking('user_behavior_event', 'bluetoothAuthorize', {
          page_path: getFullPageUrl(),
          module: 'appliance',
          page_id: 'popus_page_locate_service',
          page_name: '提示开启定位服务弹窗',
          page_module: '',
          widget_name: '我知道了',
          widget_id: 'click_knew',
          rank: '',
          object_type: '',
          object_id: '',
          object_name: '',
          device_info: {},
          ext_info: {
            refer_page_name: getFullPageUrl(),
          },
          sn: '',
          tsn: '',
          dsn: '',
          type: '',
        })
      }
    },
    // 蓝牙和位置权限校验埋点
    checkLocationAndBluetoothBurialPoint(title, content) {
      if (title == '请开启位置权限') {
        let object_name = []
        if (content.includes('开启手机定位')) {
          object_name.push('开启定位服务')
        }
        if (content.includes('授予微信使用定位的权限')) {
          object_name.push('允许微信获取位置权限')
        }
        if (content.includes('允许本程序使用位置信息')) {
          object_name.push('允许小程序使用位置权限')
        }
        object_name = object_name.join('/')
        rangersBurialPoint('user_behavior_event', {
          page_id: 'popus_open_locate_new',
          page_name: '提示需开启位置权限弹窗',
          page_path: getFullPageUrl(),
          module: 'appliance',
          widget_id: 'click_check_guide',
          widget_name: '查看指引',
          object_type: '弹窗类型',
          object_id: '',
          object_name: object_name || '',
          device_info: {
            device_session_id: getApp().globalData.deviceSessionId || '',
          },
        })
      }
      if (title == '请开启蓝牙权限') {
        let object_name = []
        if (content.includes('开启手机蓝牙')) {
          object_name.push('开启蓝牙服务')
        }
        if (content.includes('授予微信使用蓝牙的权限')) {
          object_name.push('允许微信获取蓝牙权限')
        }
        if (content.includes('允许本程序使用蓝牙')) {
          object_name.push('允许小程序使用蓝牙权限')
        }
        object_name = object_name.join('/')
        rangersBurialPoint('user_behavior_event', {
          page_id: 'popus_open_bluetooth_new',
          page_name: '提示需开启蓝牙权限弹窗',
          page_path: getFullPageUrl(),
          module: 'appliance',
          widget_id: 'click_check_guide',
          widget_name: '查看指引',
          object_type: '弹窗类型',
          object_id: '',
          object_name: object_name || '',
          device_info: {
            device_session_id: getApp().globalData.deviceSessionId || '',
          },
        })
      }
    },
  },
})
