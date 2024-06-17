const app = getApp()
let timer = ''
let timer1 = ''
import { baseImgApi, deviceImgApi } from '../../../api'
import { service } from '../js/getApiPromise.js'
import { hasKey, isEmptyObject } from 'm-utilsdk/index'
import { creatDeviceSessionId } from '../../../utils/util.js'
import { wxGetSystemInfo } from '../js/commonWxApi.js'
import { requestService } from '../../../utils/requestService'
import { locationdevice, ab2hex, hex2bin, inArray, hexCharCodeToStr } from '../js/bluetoothUtils.js'
import { deviceImgMap } from '../../../utils/deviceImgMap'
import { supportedApplianceTypes, isSupportPlugin } from '../../../utils/pluginFilter'
import { isAddDevice } from '../../../utils/temporaryNoSupDevices'
import { getStamp, getReqId } from 'm-utilsdk/index'
import { addDeviceSDK } from '../../../utils/addDeviceSDK.js'
import { isColmoDeviceBySn8 } from '../js/device'
import paths from '../../../utils/paths'
import { commonBuriedPoint } from '../js/buriedPoint'
import { oldColmoSn8List } from '../js/device'
import { getPrivateKeys } from '../../../utils/getPrivateKeys'
import { checkPermission } from '../../../pages/common/js/permissionAbout/checkPermissionTip'
const log = require('m-miniCommonSDK/utils/log')
const searchTime = 30000
const blueWifi = 'wifiAndBle'
let enterTime = 0

module.exports = Behavior({
  behaviors: [],
  properties: {},
  data: {
    devices: [
      // {
      //   SSID: "midea_ac_9155",
      //   bssid: "a8:40:7d:a4:07:74",
      //   category: "AC",
      //   deviceImg: "https://pic.mdcdn.cn/h5/img/colmomini/cate_pic/AC_1.png",
      //   deviceName: "空调",
      //   enterprise: "0000",
      //   fm: "autoFound",
      //   isSupport: true,
      //   mode: 0,
      //   signalStrength: 99
      // },
      // {
      //   deviceImg: 'https://midea-file.oss-cn-hangzhou.aliyuncs.com/2021/5/20/17/QdBzLyDRTgEkNZSDQNqg.png',
      //   deviceName: '测试测试测试1测试1测试1测试1',
      //   isSupport:true,
      //   mode: 3
      // },
      // {
      //   deviceImg: 'https://www.smartmidea.net/projects/sit/meiju-lite-assets/mainContent/images/img_wushebei.png',
      //   deviceName: '测测试测试测试测试试'
      // },
      // {
      //   deviceImg: 'https://www.smartmidea.net/projects/sit/meiju-lite-assets/mainContent/images/img_wushebei.png',
      //   deviceName: '测试3'
      // },
      // {
      //   deviceImg: 'https://www.smartmidea.net/projects/sit/meiju-lite-assets/mainContent/images/img_wushebei.png',
      //   deviceName: '测试3'
      // },
      // {
      //   deviceImg: 'https://www.smartmidea.net/projects/sit/meiju-lite-assets/mainContent/images/img_wushebei.png',
      //   deviceName: '测试1测试1测试1测试1测试1测试1'
      // },
      // {
      //   deviceImg: 'https://www.smartmidea.net/projects/sit/meiju-lite-assets/mainContent/images/img_wushebei.png',
      //   deviceName: '测试2'
      // },
      // {
      //   deviceImg: 'https://www.smartmidea.net/projects/sit/meiju-lite-assets/mainContent/images/img_wushebei.png',
      //   deviceName: '测试3'
      // },
      // {
      //   deviceImg: 'https://www.smartmidea.net/projects/sit/meiju-lite-assets/mainContent/images/img_wushebei.png',
      //   deviceName: '测试3'
      // },
      // {
      //   deviceImg: 'https://www.smartmidea.net/projects/sit/meiju-lite-assets/mainContent/images/img_wushebei22.png',
      //   deviceName: '测试1测试1测试1测试1测试1测试1'
      // },
      // {
      //   deviceImg: 'https://www.smartmidea.net/projects/sit/meiju-lite-assets/mainContent/images/img_wushebei11.png',
      //   deviceName: '测试2'
      // },
    ],
    isDeviceLength: false, //index页
    openLocation: true, // 打开定位
    authWxLocation: true, // 授权微信位置
    authAccurateLocation: true, // 授权微信精准位置（ios）
    authMpLocation: true, // 授权小程序位置
    openBluetooth: true, // 打开蓝牙
    authwxBluetooth: true, // 授权微信蓝牙
    authMpBluetooth: true, // 授权小程序蓝牙
    locationErrorText: '', // 位置错误文案
    bluetoothErrorText: '', // 蓝牙错误文案
    locationErrorTextLength: 0, // 位置错误文案数量
    bluetoothErrorTextLength: 0, // 蓝牙错误文案数量

    scanType: 'on', // on:进行中 、end：完成 、none：未发现设备
    noSupportDevices: [],
    connected: false,
    chs: [],
    deviceImg: locationdevice,
    tempIndex: 0,
    distance: '',
  },
  methods: {
    //根据广播包 获取设备品类和sn8
    getBlueSn8(advertisData) {
      let len = advertisData.length
      const blueVersion = this.getBluetoothType(advertisData)
      console.log('sn---------', hexCharCodeToStr(advertisData))
      const sn8 =
        blueVersion == 2
          ? hexCharCodeToStr(advertisData.slice(6, 22))
          : hexCharCodeToStr(advertisData.substr(len - 16, len))
      return sn8
    },
    //获取设备的品类
    getDeviceCategory(device) {
      const advertisData = ab2hex(device.advertisData)
      const name = device.localName
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
      }
    },
    //获取蓝牙参考rssi
    getReferenceRSSI(advertisData) {
      // return advertisData.substr(40, 2) * 1
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
    openBluetoothAdapter(isClose = 1) {
      this.closeBluetoothAdapter()
      // this.clearDevices()
      wx.openBluetoothAdapter({
        success: (res) => {
          console.log('openBluetoothAdapter success', res)
          this.startBluetoothDevicesDiscovery()
          //自定义搜索30S以后关闭
          if (isClose == 1) {
            this.setMixinsBluetoothClose()
          }
        },
        fail: (res) => {
          if (res.errCode === 10001) {
            wx.onBluetoothAdapterStateChange((res) => {
              console.log('onBluetoothAdapterStateChange', res)
              if (res.available) {
                this.startBluetoothDevicesDiscovery()
              }
            })
          }
        },
      })
    },
    getBluetoothAdapterState() {
      wx.getBluetoothAdapterState({
        success: (res) => {
          console.log('getBluetoothAdapterState', res)
          if (res.discovering) {
            this.onBluetoothDeviceFound()
          } else if (res.available) {
            this.startBluetoothDevicesDiscovery()
          }
        },
      })
    },
    startBluetoothDevicesDiscovery() {
      if (this._discoveryStarted) {
        return
      }
      this._discoveryStarted = true
      wx.startBluetoothDevicesDiscovery({
        allowDuplicatesKey: true,
        interval: 1000,
        powerLevel: 'low',
        success: (res) => {
          console.log('startBluetoothDevicesDiscovery success', res)
          setTimeout(() => {
            this.onBluetoothDeviceFound()
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
    onBluetoothDeviceFound() {
      let self = this
      wx.onBluetoothDeviceFound((res) => {
        // console.log("发现的设备", res.devices)
        //单蓝牙 BUG2022060134188
        // if(app.globalData.scanObj && app.globalData.scanObj.checkSetConfig && (app.globalData.scanObj.fm == 'scanCode' || app.globalData.scanObj.fm == 'selectType')) { //(app.globalData.scanObj.mode == '3' || app.globalData.scanObj.mode == '5' || app.globalData.scanObj.mode == '30')
        //   console.log("=============onBluetoothDeviceFound========Yoram===")
        //   console.log(app.globalData.scanObj);
        //   let type = app.globalData.scanObj.type;
        //   let sn8 = app.globalData.scanObj.sn8;
        //   res.devices.forEach((device) => {
        //     console.log('2222', device.name)
        //     if (!device.name && !device.localName && !device.name.includes('midea')) {
        //       return
        //     }
        //     if (this.data.curDeviceISCheck) {
        //       console.log('[已确权成功]')
        //       return
        //     }
        //     console.log('type and sn8', type, sn8)
        //     let typeAndsn8 = self.getDeviceCategoryAndSn81(device)
        //     if (!typeAndsn8) return
        //     if (typeAndsn8.type != type) return //品类不同
        //     let packInfo = self.getScanRespPackInfo1(ab2hex(device.advertisData))
        //     console.log('device=====111', device.deviceId, self.getDeviceCategoryAndSn81(device), packInfo)
        //     if (packInfo.isConfig || packInfo.isLinkWifi || packInfo.isBindble) return //已配网设备过滤
        //     if (typeAndsn8.type == type && (packInfo.isWifiCheck || packInfo.isBleCheck || packInfo.isCanSet)) {
        //       console.log('手动确权成功')
        //       // log.info('手动确权成功')
        //       this.data.curDeviceISCheck = true
        //       app.globalData.scanObj.checkSetConfig = false;
        //       wx.offBluetoothDeviceFound()
        //       wx.stopBluetoothDevicesDiscovery({
        //         success() {
        //           app.addDeviceInfo.blueVersion = self.getBleVersion1(device.advertisData)
        //           app.addDeviceInfo.adData = ab2hex(device.advertisData)
        //           app.addDeviceInfo.mac = self.getIosMac1(device.advertisData)
        //           app.addDeviceInfo.deviceId = device.deviceId
        //           console.log('蓝牙版本', app.addDeviceInfo.blueVersion)
        //           clearInterval(timer)
        //           app.addDeviceInfo.isCheck = true
        //           wx.navigateTo({
        //             url: '/distribution-network/addDevice/pages/linkDevice/linkDevice',
        //           })
        //         },
        //         fail(error) {
        //           getApp().setMethodFailedCheckingLog(
        //             'wx.stopBluetoothDevicesDiscovery()',
        //             `停止蓝牙发现失败。error=${JSON.stringify(error)}`
        //           )
        //         },
        //       })
        //     }
        //   })
        // }
        res.devices.forEach((device) => {
          if (!device.name && !device.localName) {
            return
          }
          console.log(device)
          const foundDevices = this.data.devices
          // console.log(' foundDevices=====', foundDevices)
          const idx = inArray(foundDevices, 'deviceId', device.deviceId)
          //mode=0为AP配网搜出来，蓝牙搜出来的设备优先级比AP配网高，需要原地覆盖原来搜到到AP设备
          if (idx === -1 || (idx !== -1 && foundDevices[idx].mode === 0)) {
            //校验美的设备
            if (!this.filterMideaDevice(device)) return

            //校验二代蓝牙广播包长度对不对
            if (!this.checkAdsData(device)) return
            //校验已连接设备
            if (this.filterHasConnectDevice(ab2hex(device.advertisData), device)) return
            const deviceParam = this.getDeviceParam(device)
            // 校验蓝牙阈值\
            // if (device.RSSI > 0) { //待定 iphone 12 会出现RSSI=127 这种RSSI为正值的异常情况 统一不处理
            //   console.log('蓝牙异常强度', deviceParam.category, device.RSSI)
            //   return
            // }
            //特殊空调sn8蓝牙发现不显示
            if (addDeviceSDK.isShiledAcAdata(deviceParam.category, deviceParam.sn8)) return
            if (device.RSSI < -58) {
              console.log('设备蓝牙强度不满足', deviceParam.category, device.RSSI)
              // console.log('当前强度', device.RSSI)
              return
            } else {
              if (!isColmoDeviceBySn8(deviceParam.sn8)) {
                // 校验是否colmo设备，通过colmo sn8全量白名单
                // commonBuriedPoint.isNotColmo({
                //   ...deviceParam,
                //   error_msg: '非COLMO品牌'
                // })
                console.log('非colmo设备', deviceParam)
                return
              }
              console.log('设备蓝牙强度满足设备', deviceParam.category, device.RSSI)
              commonBuriedPoint.clickfoundDeviceTrack({
                ...deviceParam,
                connectType: deviceParam.blueVersion == 1 ? 1 : 2,
                versionType: deviceParam.mode + deviceParam.blueVersion - 3,
              })
            }
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
            // let ssids = friendDevices.map(item => {
            //   return item.ssid
            // })
            // sortData = sortData.filter(item => {
            //   return !ssids.includes(item.SSID)
            // })
            this.setData({
              devices: sortData,
            })
          } else {
            //已发现设备
            this.reNewDeviceRSSI(device, 2000)
          }
          console.log('device--------', this.data.devices)
          this.setMixinsDialogShow()
        })
      })
    },
    //Yoram function start
    //根据广播包 获取设备品类和sn8
    getDeviceCategoryAndSn81(device) {
      let advertisData = ab2hex(device.advertisData)
      console.log('devices00000000000000000000000000', advertisData)
      if (advertisData.substr(0, 4) != 'a806') {
        return
      }
      if (advertisData.substr(4, 2) == '00') {
        //1代蓝牙
        if (device.localName.includes('midea') < -1) return
        let name = device.localName
        let info = name.split('_')
        let len = advertisData.length
        console.log('kkkk', info[1].toUpperCase(), hexCharCodeToStr(advertisData.substr(len - 16, len)))
        return {
          type: info[1].toUpperCase(),
          sn8: hexCharCodeToStr(advertisData.substr(len - 16, len)),
        }
      }
      if (advertisData.substr(4, 2) == '01') {
        //2代蓝牙
        let sn8 = hexCharCodeToStr(advertisData.slice(6, 22))
        let type = hexCharCodeToStr(advertisData.substring(22, 26)).toUpperCase()
        // console.log("hexCharCodeToStr", sn8, category)
        return {
          sn8: sn8,
          type: type,
        }
      }
    },
    getScanRespPackInfo1(advertisData) {
      if (advertisData.substr(0, 4) != 'a806') {
        return
      }
      let hex
      let binArray
      if (advertisData.substr(4, 2) == '00') {
        //1代蓝牙
        hex = advertisData.substr(6, 2)
        binArray = hex2bin(hex)
        console.log('binArray', binArray)
        return {
          moduleType: binArray[0] ? 1 : 0,
          isConfig: binArray[1] ? true : false, //是否配置
          isCanSet: binArray[2] ? true : false, //配置是否可用
          isCanDigital: binArray[3] ? true : false, //透传服务是否可用
        }
      }
      if (advertisData.substr(4, 2) == '01') {
        //2代蓝牙
        hex = advertisData.substr(36, 2)
        binArray = hex2bin(hex)
        console.log('binArray', binArray)
        return {
          moduleType: binArray[0] ? 1 : 0,
          isLinkWifi: binArray[1] ? true : false,
          isBindble: binArray[2] ? true : false,
          isBleCheck: binArray[3] ? true : false,
          isWifiCheck: binArray[4] ? true : false,
          isBleCanBind: binArray[5] ? true : false,
          isSupportBle: binArray[6] ? true : false,
          isSupportOTA: binArray[7] ? true : false,
          isSupportMesh: binArray[8] ? true : false,
        }
      }
    },
    getBleVersion1(advertisData) {
      let str = ab2hex(advertisData).substr(4, 2)
      return str == '00' ? 1 : 2
    },
    //根据广播包获取mac
    getIosMac1(advertisData) {
      advertisData = ab2hex(advertisData)
      console.log('getIosMacm advdata===', advertisData)
      let a = advertisData.substr(42, 12).toUpperCase()
      let b
      let arr = []
      for (let i = 0; i < a.length; i += 2) {
        arr.push(a.substr(i, 2))
      }
      b = arr.reverse().join(':')
      return b
    },
    //Yoram function end
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
    getDeviceParam(device) {
      const advertisData = ab2hex(device.advertisData)
      console.log('advertisData======Yoram', advertisData)
      const blueVersion = this.getBluetoothType(advertisData)
      const scanRespPackInfo = this.getScanRespPackInfo(advertisData)
      const mac = this.getIosMac(advertisData)
      const sn8 = this.getBlueSn8(advertisData)
      const moduleType = this.getDeviceModuleType(scanRespPackInfo)
      const category = this.getDeviceCategory(device)?.toUpperCase()
      const mode = this.getDeviceMode(moduleType, category, sn8)

      const SSID = this.getBluetoothSSID(ab2hex(device.advertisData), blueVersion, category, device.localName)
      // const category = this.getDeviceCategory(device)
      // const category = this.getApCategory(SSID).toUpperCase()
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
      obj.linkType = addDeviceSDK.getLinkType(mode)
      obj.fm = 'autoFound'
      console.log('obj===========Yoram', obj)
      return obj
    },
    getDeviceModuleType(scanRespPackInfo) {
      return scanRespPackInfo.moduleType == blueWifi ? '1' : '0'
    },
    getDeviceMode(moduleType, category, sn8) {
      console.log('getDeviceMode====', category, sn8)
      // if (addDeviceSDK.isBlueAfterLinlNetAc(category, sn8)) {
      //   //走直连后配网
      //   return 20
      // }
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
    //更新 获取设备图片名称
    getDeviceImgAndName(category, sn8) {
      let dcpDeviceImgList = {}
      try {
        //获取设备品类对应的图片
        dcpDeviceImgList = isEmptyObject(app.globalData.dcpDeviceImgList)
          ? wx.getStorageSync('dcpDeviceImgList')
          : app.globalData.dcpDeviceImgList
      } catch (err) {
        wx.showToast({
          title: '设备图片名称数据获取失败',
          icon: 'none',
        })
      }
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
          if (['C8', '46'].includes(applianceType.toLocaleUpperCase())) {
            item.deviceImg = oldColmoSn8List[`0x${applianceType.toLocaleUpperCase()}`].imgUrl
          } else {
            item.deviceImg = deviceImgApi.url + 'blue_' + applianceType.toLocaleLowerCase() + '.png'
          }
        } else {
          //缺省图
          item.deviceImg = deviceImgApi.url + 'blue_default_type.png'
        }
        // item.deviceImg = Object.keys(list).includes(keyName) ? list[keyName]['icon'] : list.common.icon
        item.deviceName =
          Object.keys(list).includes(keyName) && list[keyName]['name'] ? list[keyName]['name'] : list.common.name

        // if (Object.keys(list).includes(keyName)) {
        //   console.log("获取对应图片名称==2222=", list, list[keyName], list[keyName]['icon'])
        // } else {
        //   console.log("获取对应图片名称==333=", list.common.icon)
        // }
      }
      if (!keyName) {
        applianceType = `0x${applianceType.toLocaleUpperCase()}`
        if (oldColmoSn8List[applianceType] && oldColmoSn8List[applianceType].imgUrl) {
          item.deviceImg = oldColmoSn8List[applianceType].imgUrl
        }
      }
      return item
    },
    filterHasConnectDevice(advertisData, device) {
      const blueVersion = this.getBluetoothType(advertisData)
      const scanRespPackInfo = this.getScanRespPackInfo(advertisData)
      // const category = "0x" + this.getDeviceCategory(device).toUpperCase()
      // const mac = this.getIosMac(advertisData).replace(/:/g, '').toUpperCase()
      //空调特殊处理
      // if (category == "0xAC") {
      //   let item
      //   let item2
      //   let item3
      //   let {
      //     curUserAcDevices,
      //     remoteBindDeviceList
      //   } = app.globalData
      //   if (curUserAcDevices.length) {
      //     console.log('curUserAcDevices==========', curUserAcDevices)
      //     for (var i = 0; i <= curUserAcDevices.length; i++) {
      //       item = curUserAcDevices[i]
      //       console.log('curUserAcDevices==========', item, mac)
      //       if (item && item.btMac.replace(/:/g, '').toUpperCase() == mac) { //无论是否被绑定 只要当前用户下没该设备都允许发现显示
      //         console.log('当前用户有wifi绑定该设备')
      //         return true
      //       }
      //       if (item && item.btMac.replace(/:/g, '').toUpperCase().slice(0, 10) == mac.slice(0, 10)) { //无论是否被绑定 只要当前用户下没该设备都允许发现显示
      //         console.log('当前用户有wifi绑定该设备')
      //         return true
      //       }
      //     }
      //   }
      //   if (wx.getStorageSync('remoteDeviceList')) {
      //     let remoteDeviceList = wx.getStorageSync('remoteDeviceList')
      //     console.log('remoteBindDeviceList==========', remoteDeviceList, mac)
      //     for (var i = 0; i <= remoteDeviceList.length; i++) {
      //       item2 = remoteDeviceList[i]
      //       console.log('remoteBindDeviceList==========', item, mac)
      //       if (item2 && item2.btMac.replace(/:/g, '') == mac) { //无论是否被绑定 只要当前用户下没该设备都允许发现显示
      //         console.log('当前用户有蓝牙绑定该设备')
      //         return true
      //       }
      //     }
      //   }
      //   if (remoteBindDeviceList.length) {
      //     console.log('remoteBindDeviceList==========', curUserAcDevices)
      //     for (var i = 0; i <= remoteBindDeviceList.length; i++) {
      //       item3 = remoteBindDeviceList[i]
      //       console.log('remoteBindDeviceList==========', item, mac)
      //       if (item3 && item3.btMac.replace(/:/g, '').toUpperCase() == mac) { //无论是否被绑定 只要当前用户下没该设备都允许发现显示
      //         console.log('当前用户有wifi绑定该设备')
      //         return true
      //       }
      //     }
      //   }
      //   console.log('当前用户没有绑定该设备')
      //   return false
      // }
      // 二代单BLE模组
      if (blueVersion == 2) {
        return scanRespPackInfo.isLinkWifi || scanRespPackInfo.isBindble ? true : false
      } else if (scanRespPackInfo.moduleType === blueWifi) {
        return scanRespPackInfo.isLinkWifi ? true : false
      }
      return false
    },
    filterMideaDevice(obj) {
      if (obj.advertisData != null) {
        const hexStr = ab2hex(obj.advertisData)
        const brand = hexStr.slice(0, 4)
        // console.log("过滤品牌1", obj, brand, brand == 'a806')
        return brand == 'a806' ? true : false
      }
    },

    createBLEConnection(e) {
      const ds = e.currentTarget.dataset
      const deviceId = ds.deviceId
      const name = ds.name
      wx.createBLEConnection({
        deviceId,
        success: (res) => {
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
    // 校验蓝牙与位置
    checkSystemInfo() {
      return new Promise((resolve, reject) => {
        Promise.all([wxGetSystemInfo(), this.getAuthSetting()])
          .then((res) => {
            console.log('系统信息以及授权数据', res)
            // 系统位置是否开启校验
            let locationErrorTextArr = []
            let bluetoothErrorTextArr = []
            if (!res[0].locationEnabled) {
              this.setData({ openLocation: false })
              locationErrorTextArr.push('开启手机定位')
            } else {
              this.setData({ openLocation: true })
            }

            // 微信位置是否授权校验
            if (!res[0].locationAuthorized) {
              locationErrorTextArr.push('授予微信使用定位的权限')
              this.setData({ authWxLocation: false })
            } else {
              this.setData({ authWxLocation: true })
            }

            // 微信精准位置是否开启校验
            if (res[0].system.includes('iOS')) {
              if (!res[0].locationReducedAccuracy) {
                //精确定位 true 表示模糊定位，false 表示精确定位（仅 iOS 有效）
                this.setData({ authAccurateLocation: true })
              } else {
                locationErrorTextArr.push('开启微信获取“精确位置”的开关')
                this.setData({ authAccurateLocation: false })
              }
            }

            // 小程序位置是否授权校验
            if (!res[1]['scope.userLocation']) {
              locationErrorTextArr.push('点击右上角“...”按钮，选择“设置”，允许本程序使用位置信息')
              this.setData({ authMpLocation: false })
            } else {
              this.setData({ authMpLocation: true })
            }

            // 系统蓝牙是否开启校验
            if (!res[0].bluetoothEnabled) {
              bluetoothErrorTextArr.push('开启手机蓝牙')
              this.setData({ openBluetooth: false })
            } else {
              this.setData({ openBluetooth: true })
            }

            // 微信蓝牙是否授权校验
            if (res[0].bluetoothAuthorized != undefined && !res[0].bluetoothAuthorized) {
              bluetoothErrorTextArr.push('授予微信使用蓝牙的权限')
              this.setData({ authwxBluetooth: false })
            } else {
              this.setData({ authwxBluetooth: true })
            }

            // 小程序蓝牙是否授权校验
            if (!res[1]['scope.bluetooth']) {
              bluetoothErrorTextArr.push('点击右上角“...”按钮，选择“设置”，允许本程序使用蓝牙')
              this.setData({ authMpBluetooth: false })
            } else {
              this.setData({ authMpBluetooth: true })
            }

            this.data.locationErrorText = this.parseErrorText(locationErrorTextArr)
            this.data.bluetoothErrorText = this.parseErrorText(bluetoothErrorTextArr)
            this.data.locationErrorTextLength = locationErrorTextArr.length
            this.data.bluetoothErrorTextLength = bluetoothErrorTextArr.length
            resolve(res)
          })
          .catch((err) => {
            resolve(err)
          })
      })
    },
    parseErrorText(errorTextArr) {
      let errorText = ''
      if (errorTextArr.length) {
        if (errorTextArr.length > 1) {
          errorTextArr.forEach((item, index) => {
            errorText += `${index + 1}、${item}${index + 1 != errorTextArr.length ? '\n' : ''}`
          })
        } else {
          errorText = errorTextArr[0]
        }
      }
      return errorText
    },
    checkWxLocation() {
      return new Promise((resolve, reject) => {
        if (app.globalData.noAuthLocation) {
          wx.authorize({
            scope: 'scope.userLocation',
            success(res) {
              app.globalData.noAuthLocation = false
              console.log('位置授权成功', res)
              app.globalData.hasAuthLocation = true
              resolve()
            },
            fail(err) {
              if (!err.errMsg.includes('cancel')) {
                app.globalData.noAuthLocation = false
              } else {
                reject('stop')
              }
              console.log('位置授权失败', err)
              //拒绝授权
              resolve()
            },
          })
        } else {
          resolve()
        }
      })
    },
    checkBlueTooth() {
      return new Promise((resolve, reject) => {
        if (app.globalData.noAuthBluetooth) {
          app.fn('pageViewRecord', {
            module: '公共',
            page_id: 'popups_weixin_bluetooth',
            page_name: '微信申请使用蓝牙弹窗',
          })
          wx.authorize({
            scope: 'scope.bluetooth',
            success(res) {
              app.globalData.noAuthBluetooth = false
              console.log('蓝牙授权成功', res)
              resolve()
            },
            fail(err) {
              if (!err.errMsg.includes('cancel')) {
                app.globalData.noAuthBluetooth = false
              } else {
                reject('stop')
              }
              console.log('蓝牙授权失败', err)
              resolve()
            },
          })
        } else {
          resolve()
        }
      })
    },
    //检查微信版本以及是否打开位置和蓝牙权限
    async checkAuth(checkList = ['location', 'bluetooth'], deviceInfo, isPopup = true) {
      let sn8 = deviceInfo && deviceInfo.sn8 ? deviceInfo.sn8 : ''
      let type = deviceInfo && deviceInfo.type ? deviceInfo.type : ''
      if (checkList.includes('version') && !this.checkWxVersion()) {
        if (isPopup) {
          this.setData({
            customDialog: {
              isShow: true,
              subTitle: '你的微信版本过低，请升级至最新版本后再试',
              cancelTxt: '我知道了',
              confirmBtnType: 'none',
            },
          })
        }
        return {
          value: false,
          type: 'version',
          errorText: '你的微信版本过低，请升级至最新版本后再试',
        }
      }
      // 位置权限弹窗
      if (await checkList.includes('location')) {
        let locationRes = await checkPermission.loaction()
        let locationType = 'content'
        if (this.data.locationErrorTextLength === 1) {
          locationType = 'subTitle'
        }
        /** 定位弹窗埋点 S */
        if (!this.data.openLocation) {
          app.fn('pageViewRecord', {
            module: 'appliance',
            page_id: 'popus_page_locate_service',
            page_name: '提示开启定位服务弹窗',
            device_info: {
              device_session_id: app.globalData.deviceSessionId || '', //一次配网事件标识
              sn: '', //sn码
              sn8: sn8, //sn8码
              a0: '', //a0码
              widget_cate: type, //设备品类
              wifi_model_version: '', //模组wifi版本
              link_type: '', //配网方式 bluetooth/ap...
              iot_device_id: '', //设备id
            },
          })
        }
        if (!this.data.authWxLocation || !this.data.authAccurateLocation || !this.data.authMpLocation) {
          app.fn('pageViewRecord', {
            module: 'appliance',
            page_id: 'popus_page_auth_msg',
            page_name: '提示定位授权允许信息弹窗',
            device_info: {
              device_session_id: app.globalData.deviceSessionId || '', //一次配网事件标识
              sn: '', //sn码
              sn8: sn8, //sn8码
              a0: '', //a0码
              widget_cate: type, //设备品类
              wifi_model_version: '', //模组wifi版本
              link_type: '', //配网方式 bluetooth/ap...
              iot_device_id: '', //设备id
            },
          })
        }
        /** 埋点 E */
        if (!this.data.openLocation || !this.data.authWxLocation || !this.data.authAccurateLocation) {
          if (isPopup) {
            this.dialog_success = () => {
              this.setData({
                'customDialog.isShow': false,
              })
              wx.navigateTo({
                url: paths.locationGuide + `?permissionTypeList=${JSON.stringify(locationRes.permissionTypeList)}`,
              })
            }
            let customDialog = {
              isShow: true,
              mainTitle: '请开启位置权限',
              cancelTxt: '好的',
              confirmTxt: '查看指引',
            }
            customDialog[`${locationType}`] = locationRes.permissionTextAll
            this.setData({ customDialog })
          }
          return {
            value: false,
            type: 'location',
            errorText: locationRes.permissionTextAll,
            locationType,
          }
        } else if (!this.data.authMpLocation) {
          if (isPopup) {
            this.dialog_success = () => {
              this.setData({
                'customDialog.isShow': false,
              })
              // wx.openSetting({
              //   fail: (res) => {
              //     wx.showToast({
              //       title: '跳转小程序设置页失败，请尝试手动操作。',
              //       icon: 'none'
              //     })
              //   }
              // })
              wx.navigateTo({
                url: paths.locationGuide + `?permissionTypeList=${JSON.stringify(locationRes.permissionTypeList)}`,
              })
            }
            let customDialog = {
              isShow: true,
              mainTitle: '请开启位置权限',
              cancelTxt: '好的',
              confirmTxt: '查看指引',
            }
            customDialog[`${locationType}`] = locationRes.permissionTextAll
            this.setData({ customDialog })
          }
          return {
            value: false,
            type: 'location',
            errorText: locationRes.permissionTextAll,
            locationType,
          }
        }
      }

      // 蓝牙权限弹窗
      if (await checkList.includes('bluetooth')) {
        let blueRes = await checkPermission.blue()
        console.log('blueRes-----------:', blueRes)
        let blueToothType = 'content'
        if (blueRes.isCanBlue) {
          return {
            value: true,
          }
        }
        if (this.data.bluetoothErrorTextLength === 1) {
          blueToothType = 'subTitle'
        }
        /** 蓝牙弹窗埋点 S */
        if (!this.data.openBluetooth) {
          app.fn('pageViewRecord', {
            module: 'appliance',
            page_id: 'popus_page_open_bluetooth',
            page_name: '提示开启蓝牙弹窗',
            device_info: {
              device_session_id: app.globalData.deviceSessionId || '', //一次配网事件标识
              sn: '', //sn码
              sn8: sn8, //sn8码
              a0: '', //a0码
              widget_cate: type, //设备品类
              wifi_model_version: '', //模组wifi版本
              link_type: '', //配网方式 bluetooth/ap...
              iot_device_id: '', //设备id
            },
          })
        }
        if (!this.data.authwxBluetooth || !this.data.authMpBluetooth) {
          app.fn('pageViewRecord', {
            module: 'appliance',
            page_id: 'popus_page_auth_msg',
            page_name: '提示蓝牙授权允许信息弹窗',
            device_info: {
              device_session_id: app.globalData.deviceSessionId || '', //一次配网事件标识
              sn: '', //sn码
              sn8: sn8, //sn8码
              a0: '', //a0码
              widget_cate: type, //设备品类
              wifi_model_version: '', //模组wifi版本
              link_type: '', //配网方式 bluetooth/ap...
              iot_device_id: '', //设备id
            },
          })
        }
        /** 埋点 E */
        if (!this.data.openBluetooth || !this.data.authwxBluetooth) {
          if (isPopup) {
            this.dialog_success = () => {
              this.setData({
                'customDialog.isShow': false,
              })
              wx.navigateTo({
                url: paths.blueGuide + `?permissionTypeList=${JSON.stringify(blueRes.permissionTypeList)}`,
              })
            }
            let customDialog = {
              isShow: true,
              mainTitle: '请开启蓝牙权限',
              cancelTxt: '好的',
              confirmTxt: '查看指引',
            }
            customDialog[`${blueToothType}`] = blueRes.permissionTextAll
            this.setData({ customDialog })
          }
          return {
            value: false,
            type: 'bluetooth',
            errorText: blueRes.permissionTextAll,
            blueToothType,
          }
        } else if (!this.data.authMpBluetooth) {
          if (isPopup) {
            this.dialog_success = () => {
              this.setData({
                'customDialog.isShow': false,
              })
              wx.navigateTo({
                url: paths.blueGuide + `?permissionTypeList=${JSON.stringify(blueRes.permissionTypeList)}`,
              })
            }
            let customDialog = {
              isShow: true,
              mainTitle: '请开启蓝牙权限',
              cancelTxt: '好的',
              confirmTxt: '查看指引',
            }
            customDialog[`${blueToothType}`] = blueRes.permissionTextAll
            this.setData({ customDialog })
          }
          return {
            value: false,
            type: 'bluetooth',
            errorText: blueRes.permissionTextAll,
            blueToothType,
          }
        }
      }

      return {
        value: true,
      }
    },
    getAuthSetting() {
      return new Promise((resolve, reject) => {
        wx.getSetting({
          success(res) {
            resolve(res.authSetting)
          },
          fail(err) {
            reject(err)
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
      if (this.data.devices.length == 0) return
      this.setData({
        isDeviceLength: true,
      })
    },
    checkIfSupport(mode, moduleType, category, sn8) {
      //校验是否支持控制的设备
      let formatType = '0x' + category.toLocaleUpperCase()
      if (!isSupportPlugin(formatType, sn8)) return false
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
      return new Promise((resolve, reject) => {
        if (fm == 'autoFound') {
          let reqData = {
            mode: mode + '',
            category: type.includes('0x') ? type.substr(2, 2) : type,
            code: sn8,
            enterpriseCode: enterprise,
            ssid: ssid,
            reqId: getReqId(),
            stamp: getStamp(),
            queryType: 2,
          }
          console.log('自发现请求确权指引', reqData)
          requestService
            .request('multiNetworkGuide', reqData)
            .then((resp) => {
              let netWorking = resp.data.data.cableNetWorking ? 'cableNetWorking' : 'wifiNetWorking'
              console.log('自发现获得确权指引', resp)
              console.log('配网指引信息', resp.data.data[netWorking].mainConnectTypeDesc)
              resolve(resp)
            })
            .catch((error) => {
              console.log(error)
              reject(error)
            })
        }
        if (fm == 'selectType') {
          let reqData = {
            category: type.includes('0x') ? type.substr(2, 2) : type,
            code: sn8,
            enterpriseCode: enterprise,
            productId: productId,
            reqId: getReqId(),
            stamp: getStamp(),
            queryType: 1,
          }
          console.log('自发现请求确权指引', reqData)
          requestService
            .request('multiNetworkGuide', reqData)
            .then((resp) => {
              console.log('配网指引信息 选型', resp.data.data)
              resolve(resp)
            })
            .catch((error) => {
              console.log(error)
              reject(error)
            })
        }
        if (fm == 'scanCode') {
          let reqData = {
            mode: mode + '',
            category: type.includes('0x') ? type.substr(2, 2) : type,
            code: sn8,
            enterpriseCode: enterprise,
            tsn: tsn,
            ssid: ssid,
            sn: sn,
            reqId: getReqId(),
            stamp: getStamp(),
            queryType: 2,
          }
          console.log('扫码请求确权指引', reqData)
          requestService
            .request('multiNetworkGuide', reqData)
            .then((resp) => {
              console.log('配网指引信息 扫码', resp.data.data)
              resolve(resp)
            })
            .catch((error) => {
              console.log(error)
              reject(error)
            })
        }
      })
    },
    //指引获取失败处理
    getGuideFail(fm) {
      let cancelText = fm == 'scanCode' ? '此二维码获取配网指引失败，请使用选择型号添加' : '配网指引获取失败'
      this.dialog_success = () => {
        this.setData({
          'customDialog.isShow': false,
        })
        this.goSelectDevice()
      }
      this.dialog_fail = () => {
        this.setData({
          'customDialog.isShow': false,
        })
        this.actionScan()
      }
      this.setData({
        customDialog: {
          isShow: true,
          subTitle: cancelText,
          cancelTxt: '重新扫码',
          confirmTxt: '选型添加',
          defaultClose: false,
        },
      })
    },

    /**
     * 获取密钥错误处理及重试逻辑 （落地页）
     * @param {*} addDeviceInfo
     */
    privateKeyErrorHand(item) {
      let self = this
      let cancelText = '取消'
      let page_name = '添加设备'
      // if(item.fm == 'scanCode') {
      //   cancelText = '返回首页'
      //   page_name = '中间页'
      // }
      let obj = {
        page_name: page_name,
        widget_id: 'key_server_failed',
        widget_name: '密钥获取失败弹窗',
        sn8: app.addDeviceInfo.sn8 || '',
        widget_cate: app.addDeviceInfo.type || '',
      }
      getPrivateKeys.privateBurialPoint(obj)
      this.dialog_success = async () => {
        wx.hideLoading()
        self.setData({
          clickFLag: false,
          autoFoundCardClickFlag: false,
          'privateDialog.isShow': false,
        })
        obj.widget_id = 'click_retry'
        obj.widget_name = '密钥获取失败弹窗重试按钮'
        getPrivateKeys.privateBurialPoint(obj)
        try {
          wx.showLoading()
          await getPrivateKeys.getPrivateKey()
          wx.hideLoading()
          this.actionGoNetwork(item)
        } catch (err) {
          console.log('Yoram err is ->', err)
          wx.hideLoading()
          this.privateKeyErrorHand(item)
        }
      }
      this.dialog_fail = () => {
        self.setData({
          clickFLag: false,
          autoFoundCardClickFlag: false,
          privateDialog: {
            isShow: false,
          },
        })
        obj.widget_id = 'click_cancel'
        obj.widget_name = '密钥获取失败弹窗取消按钮'
        getPrivateKeys.privateBurialPoint(obj)
        // if(item.fm == 'scanCode') {
        //   wx.redirectTo({
        //     url: '/pages/index/index',
        //   })
        // }
      }
      this.setData({
        privateDialog: {
          isShow: true,
          mainTitle: '服务器连接失败',
          subTitle: '请检查网络或稍后再试',
          cancelTxt: cancelText,
          confirmTxt: '重试',
          confirmBtnType: 'button',
          defaultClose: false,
        },
      })
    },
    async actionGoNetwork(item) {
      app.checkNetLocal()
      console.log('item===========', item)
      const addDeviceInfo = {
        adData: item.adData || '',
        uuid: item.advertisServiceUUIDs || '',
        localName: item.localName || '',
        isFromScanCode: item.isFromScanCode || false,
        deviceName: item.deviceName || '',
        deviceId: item.deviceId || '', //设备蓝牙id
        mac: item.mac || '', //设备mac 'A0:68:1C:74:CC:4A'
        type: item.category || '', //设备品类 AC
        sn8: item.sn8 || '',
        deviceImg: item.deviceImg || '', //设备图片
        moduleType: item.moduleType || '', //模组类型 0：ble 1:ble+weifi
        blueVersion: item.blueVersion || '', //蓝牙版本 1:1代  2：2代
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
      }
      app.addDeviceInfo = addDeviceInfo
      console.log('addDeviceInfo数据', addDeviceInfo)
      // wx.setStorageSync('addDeviceInfo', addDeviceInfo)
      // wx.stopBluetoothDevicesDiscovery()
      this.stopBluetoothDevicesDiscovery()
      // this.closeWifiScan()
      clearTimeout(timer)
      clearTimeout(timer1)
      //获取后台配置对应的配网方式
      if (item.fm == 'scanCode' || item.fm == 'autoFound') {
        try {
          let guideInfo = addDeviceInfo.guideInfo
          let netWorking = guideInfo?.data?.data?.cableNetWorking ? 'cableNetWorking' : 'wifiNetWorking'
          if (!addDeviceInfo.guideInfo) {
            guideInfo = await this.getAddDeviceGuide(item.fm, addDeviceInfo)
            commonBuriedPoint.server_return_addGuide({
              ...item,
              ...(guideInfo?.data.data || {}),
              code: guideInfo?.data.code,
              cate: guideInfo?.data?.data[netWorking].category || item.type,
            })
          }
          if (item.fm == 'scanCode') {
            //扫码去后台配置的配网方式
            app.addDeviceInfo.mode = guideInfo.data.data[netWorking].mainConnectinfoList[0].mode //重置配网方式
          }
          app.addDeviceInfo.mode = addDeviceSDK.getMode(app.addDeviceInfo.mode)
          app.addDeviceInfo.linkType = addDeviceSDK.getLinkType(app.addDeviceInfo.mode) //重置连接方式
          console.log('后台配置的配网方式=====', guideInfo.data.data[netWorking].mainConnectinfoList[0].mode)
          app.addDeviceInfo.guideInfo = guideInfo.data.data[netWorking].mainConnectinfoList //暂存指引
        } catch (error) {
          console.log('[get add device guide error]', error)
          commonBuriedPoint.server_return_addGuide({
            ...item,
            code: error?.data.code,
            cate: item.type,
          })
          if (item.blueVersion != 2) {
            /**
             * 一代蓝牙需要配网指引，无指引的情况getGuideFail处理
             * 二代蓝牙不需要配网指引，直接放行
             */
            this.getGuideFail(item.fm)
            return
          }
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
      let mode = app.addDeviceInfo.mode
      if (mode == 0 || mode == 3) {
        wx.navigateTo({
          url: paths.inputWifiInfo,
        })
      } else if (mode == 100 || mode == 103) {
        wx.navigateTo({
          url: paths.addGuide,
        })
      } else {
        this.setData({
          customDialog: {
            isShow: true,
            subTitle: '暂不支持该配网模式',
            cancelTxt: '我知道了',
            confirmBtnType: 'none',
          },
        })
      }
    },
    clearDevices() {
      this.setData({
        devices: [],
        isDeviceLength: false,
      })
    },
    sortScanDevice(foundDevices, deviceData, str) {
      return this.getSortDataByFindTime(foundDevices, deviceData, str)
    },
    clearMixinsTime() {
      clearTimeout(timer)
      clearTimeout(timer1)
    },
    getApCategory(SSID) {
      const arr = SSID.split('_')
      console.log('SSSSSSSsSSS', arr[1])
      // return SSID.slice(6,8)
      return arr[1]
    },
    getEnterPrise(SSID) {
      const arr = SSID.split('_')
      return arr[0] == 'bugu' ? '0010' : '0000'
    },
    getDeviceApImgAndName(dcpDeviceImgList, category) {
      let item = new Object()
      console.log('获取图标命名称1', dcpDeviceImgList, category)
      if (dcpDeviceImgList[category]) {
        item.deviceImg = dcpDeviceImgList[category].common.icon
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
      const version = app.getSystemInfo.version
      const arr = version.split('.')
      console.log('version11', parseInt(arr[0]) < 8)
      if (parseInt(arr[0]) < 8) return false
      //TODO 方便调试改为true
      if (parseInt(arr[0]) >= 8 && parseInt(arr[1]) === 0 && parseInt(arr[2]) < 7) return false
      return true
    },
    checkSystem() {
      return new Promise((resolve, reject) => {
        const getSystemInfo = app.getSystemInfo
        if (getSystemInfo.system) {
          const platform = app.getSystemInfo.platform
          console.log('校验系统是不是IOS', platform == 'ios', platform.indexOf('ios') > -1)
          const result = platform.indexOf('ios') > -1 ? true : false
          resolve(result)
        } else {
          service.getWxApiPromise(wx.getSystemInfo).then((res) => {
            app.getSystemInfo = { ...app.getSystemInfo, ...res }
            const platform = app.getSystemInfo
            const result = platform.indexOf('ios') > -1 ? true : false
            resolve(result)
          })
        }
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
    /** ap start */
    async getWifiList(isClose = 1) {
      let that = this
      const res = await this.checkSystem()
      if (res) return
      service.getWxApiPromise(wx.startWifi).then((res1) => {
        // console.log("获取WiFi列表1", res1)
        if (isClose == 1) {
          this.setMixinsWifiClose()
        }
        service.getWxApiPromise(wx.getWifiList).then((res2) => {
          // console.log("获取WiFi列表2", res2)
          wx.onGetWifiList((res3) => {
            console.log('获取WiFi列表3', res3)
            res3.wifiList.forEach((device) => {
              //校验美的设备
              if (!this.filterMideaAP(device.SSID)) return
              // console.log("美的设备AP发现", device)

              //wifi强度校验
              // console.log('发现设备ap强度', device.signalStrength)
              if (device.signalStrength < 99) return
              //校验是否蓝牙已发现
              if (!this.filterBluetoothScan(device.SSID)) return

              //获取已发现设备的需要字段
              const deviceData = this.getDeviceData(device)
              console.log('发现可添加的AP设备', deviceData)
              commonBuriedPoint.clickfoundDeviceTrack({
                ...deviceData,
                connectType: 3,
                versionType: '',
              })
              //获取已发现列表
              const foundDevices = this.data.devices
              let sortDevice = this.sortScanDevice(foundDevices, deviceData)
              //AP自发现设备里去掉找朋友发现的朋友设备信息
              // console.log('朋友设备信息', app.globalData.friendDevices)
              // let friendDevices = app.globalData.friendDevices ? app.globalData.friendDevices : []
              // let ssids = friendDevices.map(item => {
              //   return item.ssid
              // })
              // sortDevice = sortDevice.filter(item => {
              //   return !ssids.includes(item.SSID)
              // })
              this.setData({
                devices: sortDevice,
              })
              console.log('添加的AP自发现设备', this.data.devices)
              this.setMixinsDialogShow()
            })
            setTimeout(() => {
              if (!that.data.isGetWifiList) return
              wx.getWifiList({
                fail: () => {},
              })
            }, 2000)
          })
        })
      })
    },
    setMixinsWifiClose() {
      timer1 = setTimeout(() => {
        console.log('关闭wifi')
        //wx.offGetWifiList()
      }, searchTime)
    },
    filterMideaAP(SSID) {
      const reg = /(midea_|bugu_)[0-9a-fA-F]{2}_[0-9a-zA-Z]{4}/
      return reg.test(SSID)
    },
    filterBluetoothScan(SSID) {
      const fonudDevices = this.data.devices
      const idx = inArray(fonudDevices, 'SSID', SSID)
      console.log('SSID 筛查', fonudDevices, idx)
      return idx === -1 ? true : false
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
      return result
    },
    /** ap end */
    gotoScanDevice(callback) {
      app.globalData.deviceSessionId = creatDeviceSessionId(app.globalData.iotUserInfoData.uid)
      console.log(app.globalData.deviceSessionId)
      app.checkNetLocal()
      this.authToJump(callback).catch((err) => {
        if (err === 'stop') return
        console.log(err)
        log.info('微信接口调用出错', err)
        // 重试一次
        this.authToJump(callback).catch((err) => {
          console.log(err)
          log.info('微信接口调用出错', err)
          wx.showToast({
            title: '系统接口调用出错，请重试',
            icon: 'none',
          })
        })
      })
    },
    authToJump(callback) {
      return new Promise((resolve, reject) => {
        this.checkWxLocation()
          .then((_) => {
            this.checkBlueTooth()
              .then(async (_) => {
                await this.checkSystemInfo()
                let checkAuthValue = await this.checkAuth()
                console.log('顺利打开放进口袋里：', checkAuthValue)
                this.data.isGoToScan = true
                if (!checkAuthValue.value) return
                wx.navigateTo({
                  url: paths.scanDevice,
                  success: () => {
                    app.addDeviceInfo = {
                      // 初始化addDeviceInfo，防止埋点上报错误
                      plainSn: '', //设备原始sn
                      isWashingMachine: false, //是否是洗衣机
                    }
                    if (callback && typeof callback === 'function') {
                      callback()
                    }
                  },
                })
              })
              .catch((err) => {
                reject(err)
              })
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
  },
})
