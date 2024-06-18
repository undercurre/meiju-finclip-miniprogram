const app = getApp()
import {
  getFullPageUrl,
  creatDeviceSessionId
} from '../../../../utils/util.js'
import {
  ab2hex,
  inArray,
} from '../../js/bluetoothUtils.js'
import {
  blueUtil
} from './blueUtil'
import {
  requestService,
  rangersBurialPoint
} from '../../../../utils/requestService'
import {
  clickEventTracking
} from '../../../../track/track.js'
import {
  wxGetSystemInfo
} from '../../js/commonWxApi.js'
import {
  commonIndex
} from '../common/commonIndex'
import {
  inputWifiInfo,
  addGuide,
  linkDevice,
  selectDevice
} from '../../../../utils/paths.js'
import {
  addDeviceService
} from '../common/addDeviceService'
const searchTime = 30000
let timer = ''
let timer1 = ''
let enterTime = 0
const blueWifi = 'wifiAndBle'
module.exports = Behavior({
  behaviors: [],
  properties: {},
  data: {
    dcpDeviceImgList: [], //自发现设备图标
    devices: [], //自发现列表
    isDeviceLength: false, //是否有自发现的设备
  },
  methods: {
    openBluetoothAdapter(isClose = 1) {
      this.closeBluetoothAdapter()
      wx.openBluetoothAdapter({
        success: (res) => {
          console.log('openBluetoothAdapter success', res)
          this.startBluetoothDevicesDiscovery()
          //自定义搜索30S以后关闭
          if (isClose == 1) {
						console.log("开始扫描蓝牙：",new Date)
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
    closeBluetoothAdapter() {
      wx.closeBluetoothAdapter()
      clearTimeout(timer)
      console.log('关闭定时器', timer)
      this._discoveryStarted = false
    },
    startBluetoothDevicesDiscovery() {
      if (this._discoveryStarted) {
        return
      }
      this._discoveryStarted = true
      wx.startBluetoothDevicesDiscovery({
        allowDuplicatesKey: true,
        interval: 2000,
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
    setMixinsBluetoothClose() {
      timer = setTimeout(() => {
        this.closeBluetoothAdapter()
        this.stopBluetoothDevicesDiscovery()
        console.log('扫描到的设备', this.data.devices)
        console.log('关闭发现蓝牙',new Date)
      }, searchTime)
    },
    onBluetoothDeviceFound() {
      let self = this;
      wx.onBluetoothDeviceFound((res) => {
        console.log("发现的设备=======Yoram", res)
        res.devices.forEach((device) => {
          if (!device.name && !device.localName) {
            return
          }
          const foundDevices = this.data.devices
          const idx = inArray(foundDevices, 'deviceId', device.deviceId)
          //mode=0为AP配网搜出来，蓝牙搜出来的设备优先级比AP配网高，需要原地覆盖原来搜到到AP设备
          if (idx === -1 || (idx !== -1 && foundDevices[idx].mode === 0)) { //新发现：idx == -1；已发现：idx != -1
            //校验美的设备
            if (!blueUtil.filterMideaDevice(device)) return

            //校验二代蓝牙广播包长度对不对
            if (!blueUtil.checkAdsData(device)) return
            //校验已连接设备
            if (this.filterHasConnectDevice(ab2hex(device.advertisData), device)) return
            const deviceParam = blueUtil.getDeviceParam(device)
            //校验指定品牌设备（toshiba)
            if (!blueUtil.filterEnterPriseSSID(deviceParam.SSID, 'toshiba')) return
            // 校验蓝牙阈值\
            // if (device.RSSI > 0) { //待定 iphone 12 会出现RSSI=127 这种RSSI为正值的异常情况 统一不处理
            //   console.log('蓝牙异常强度', deviceParam.category, device.RSSI)
            //   return
            // }

            //todo:yoram 暂时注釋掉空调特定过滤逻辑
            //屏蔽配网 只有空调白名单内的允许发现
            // if (
            //   !addDeviceSDK.isBlueAfterLinlNetAc(deviceParam.category, deviceParam.sn8)
            // ) {
            //   console.log('无权限配网 且不在空调白名单内')
            //   return
            // }

            //todo:yoram 暂时注釋掉空调特定过滤逻辑
            //特殊空调sn8蓝牙发现不显示
            // if (addDeviceSDK.isShiledAcAdata(deviceParam.category, deviceParam.sn8)) return

            //过滤设备信号强度
            if (device.RSSI < -58) {
              console.log('设备蓝牙强度不满足', deviceParam.category, device.RSSI)
              return
            } else {
              console.log('设备蓝牙强度满足设备', deviceParam.category, device.RSSI)
            }
            //校验是否是已配网的设备 且 是在首页 处理缓存
            if (blueUtil.checkIsAddedApDevice(deviceParam.SSID) && getFullPageUrl().includes(
                '/index/index')) {
              console.log('已配网的设备====', app.globalData.curAddedApDeviceList, deviceParam.SSID)
              return
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
            console.log('朋友设备信息', app.globalData.friendDevices)
            let friendDevices = app.globalData.friendDevices ? app.globalData.friendDevices : []
            let ssids = friendDevices.map((item) => {
              return item.ssid
            })
            sortData = sortData.filter((item) => {
              return !ssids.includes(item.SSID)
            })
            // 自发现埋点
            if (this.data.devices.length === 0 && sortData.length > 0) {
              app.globalData.deviceSessionId = creatDeviceSessionId(app.globalData.userData.uid)
              clickEventTracking('user_page_view', 'onBluetoothDeviceFound', {
                device_info: {
                  device_session_id: app.globalData.deviceSessionId, //一次配网事件标识
                  sn: '', //sn码
                  sn8: '', //sn8码
                  a0: '', //a0码
                  widget_cate: '', //设备品类
                  wifi_model_version: '', //模组wifi版本
                  link_type: 'bluetooth', //连接方式 bluetooth/ap/...
                  iot_device_id: '', //设备id
                },
              })
            }
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
      let deviceParam = blueUtil.getDeviceParam(device)
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
    //有自发现设备，显示弹框
    setMixinsDialogShow() {
      if (this.data.devices.length == 0) return
      this.setData({
        isDeviceLength: true,
      })
    },

    filterHasConnectDevice(advertisData, device) {
      const blueVersion = blueUtil.getBluetoothType(advertisData)
      const scanRespPackInfo = blueUtil.getScanRespPackInfo(advertisData)
      const category = '0x' + blueUtil.getDeviceCategory(device).toUpperCase()
      const mac = blueUtil.getIosMac(advertisData).replace(/:/g, '').toUpperCase()
      const sn8 = blueUtil.getBlueSn8(advertisData)
      //华凌空调特殊处理
      //todo:yoram 暂时注釋空调特殊处理逻辑
      //   if (category == '0xAC' && blueUtil.isBlueAfterLinlNetAc(category, sn8)) {
      //     let item
      //     let item2
      //     let item3
      //     let {
      //       curUserAcDevices,
      //       remoteBindDeviceList
      //     } = app.globalData
      //     if (curUserAcDevices.length) {
      //       console.log('curUserAcDevices==========', curUserAcDevices)
      //       for (var i = 0; i <= curUserAcDevices.length; i++) {
      //         item = curUserAcDevices[i]
      //         console.log('curUserAcDevices==========', item, mac)
      //         if (item && item.btMac.replace(/:/g, '').toUpperCase() == mac) {
      //           //无论是否被绑定 只要当前用户下没该设备都允许发现显示
      //           console.log('当前用户有wifi绑定该设备1')
      //           return true
      //         }
      //         if (item && item.btMac.replace(/:/g, '').toUpperCase().slice(0, 10) == mac.slice(0, 10)) {
      //           //无论是否被绑定 只要当前用户下没该设备都允许发现显示
      //           console.log('当前用户有wifi绑定该设备2')
      //           return true
      //         }
      //       }
      //     }
      //     if (wx.getStorageSync('remoteDeviceList')) {
      //       let remoteDeviceList = wx.getStorageSync('remoteDeviceList')
      //       console.log('remoteBindDeviceList==========', remoteDeviceList, mac)
      //       for (let i = 0; i <= remoteDeviceList.length; i++) {
      //         item2 = remoteDeviceList[i]
      //         console.log('remoteBindDeviceList==========', item2, mac)
      //         if (item2 && item2.btMac.replace(/:/g, '') == mac) {
      //           //无论是否被绑定 只要当前用户下没该设备都允许发现显示
      //           console.log('当前用户有蓝牙绑定该设备')
      //           return true
      //         }
      //       }
      //     }
      //     if (remoteBindDeviceList.length) {
      //       console.log('remoteBindDeviceList==========', curUserAcDevices)
      //       for (let i = 0; i <= remoteBindDeviceList.length; i++) {
      //         item3 = remoteBindDeviceList[i]
      //         console.log('remoteBindDeviceList==========', item3, mac)
      //         if (item3 && item3.btMac.replace(/:/g, '').toUpperCase() == mac) {
      //           //无论是否被绑定 只要当前用户下没该设备都允许发现显示
      //           console.log('当前用户有wifi绑定该设备3')
      //           return true
      //         }
      //       }
      //     }
      //     console.log('当前用户没有绑定该设备')
      //     return false
      //   }
      // 二代单BLE模组
      if (blueVersion == 2) {
        return scanRespPackInfo.isLinkWifi || scanRespPackInfo.isBindble ? true : false
      } else if (scanRespPackInfo.moduleType === blueWifi) {
        return scanRespPackInfo.isLinkWifi ? true : false
      }
      return false
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
    sortScanDevice(foundDevices, deviceData, str) {
      return this.getSortDataByFindTime(foundDevices, deviceData, str)
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
    clearMixinsTime() {
      clearTimeout(timer)
      clearTimeout(timer1)
    },
    //判断用户是否已授权小程序使用位置权限
    /**
     * @param {*} isGetWifiList //是否获取附近wifi列表
     */
    locationAuthorize(isGetWifiList) {
      let _this = this
      if (!app.globalData.hasAuthLocation) {
        wx.authorize({
          scope: 'scope.userLocation',
          async success() {
            app.globalData.hasAuthLocation = true
            if (!app.globalData.isBluetoothMixinNotOpenWxLocation) {
              //   await _this.checkSystemInfo()
            }
            if (isGetWifiList) {
              // _this.getWifiList()
            }
          },
          fail(res) {
            if (res.errMsg.includes('deny')) {
              app.globalData.hasAuthLocation = true
            }
          },
        })
      } else if (isGetWifiList) {
        //   this.getWifiList()
      }
    },
    //判断用户是否已授权小程序使用蓝牙权限
    /**
     * @param {*} isActionBluetooth //是否触发蓝牙设备发现
     */
    bluetoothAuthorize(isActionBluetooth) {
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
            app.globalData.hasAuthBluetooth = true
            app.globalData.noBluetoothSetting = false
            if (!app.globalData.isBluetoothMixinHasAuthBluetooth) {
              //   await _this.checkSystemInfo()
            }
            if (isActionBluetooth) {
              try {
                // _this.actionBlue() //触发蓝牙设备发现
              } catch (error) {
                console.log('不执行actionBlue')
              }
            }
          },
          fail(error) {
            if (!app.globalData.noBluetoothSetting) {
              return
            }
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
            if (!error.errMsg.includes('cancel')) {
              app.globalData.noBluetoothSetting = false
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
    checkSystemInfo() {
      this.clearMixinInitData()
      return new Promise((resolve) => {
        Promise.all([wxGetSystemInfo(), this.getAuthSetting()]).then((res) => {
          if (!res[0].locationEnabled || !res[0].locationAuthorized || !res[1]['scope.userLocation']) {
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
          if (res[1]['scope.bluetooth']) {
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
            app.globalData.hasAuthLocation
          )
        })
      })
    },
    getAuthSetting() {
      let self = this
      return new Promise((resolve) => {
        wx.getSetting({
          success(res) {
            getApp().setMethodCheckingLog('wx.getSetting()')
            console.log("====yoram res===", res)
            if (res.authSetting['scope.userLocation']) {
              //   self.getWifiList()
            }
            resolve(res.authSetting)
          },
          fail(error) {
            getApp().setMethodFailedCheckingLog('wx.getSetting()', `获取授权信息异常${JSON.stringify(error)}`)
          },
        })
      })
    },
    clearMixinInitData() {
      this.setData({
        isBluetoothMixinGoSetting: false,
        isBluetoothMixinOpenLocation: false,
      })
    },
    /**
     * 点击跳转配网下一步
     * @param {*} item 
     */
    async actionGoNetwork(item) {
      console.log('item===========', item)
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
      }
      app.addDeviceInfo = addDeviceInfo
      console.log('addDeviceInfo数据', addDeviceInfo)
      this.stopBluetoothDevicesDiscovery()
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
          let netWorking = guideInfo?.data?.data?.cableNetWorking ? 'cableNetWorking' : 'wifiNetWorking'
          if (!addDeviceInfo.guideInfo) {
            guideInfo = await commonIndex.commonService.getAddDeviceGuide(item.fm, addDeviceInfo)
            netWorking = guideInfo.data.data.cableNetWorking ? 'cableNetWorking' : 'wifiNetWorking'
          }
          if (item.fm == 'scanCode') {
            //扫码去后台配置的配网方式
            app.addDeviceInfo.mode = guideInfo.data.data[netWorking].mainConnectinfoList[0].mode //重置配网方式
          }
          app.addDeviceInfo.mode = commonIndex.commonUtil.getMode(app.addDeviceInfo.mode)
          app.addDeviceInfo.linkType = commonIndex.commonUtil.getLinkType(app.addDeviceInfo.mode) //重置连接方式
          console.log('后台配置的配网方式=====', guideInfo.data.data[netWorking].mainConnectinfoList[0].mode)
          app.addDeviceInfo.guideInfo = guideInfo.data.data[netWorking].mainConnectinfoList //暂存指引
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
              code: guideInfo.data.code + '' || '',
              cate: guideInfo.data.data[netWorking].category || '',
              sn8: guideInfo.data.data[netWorking].mainConnectinfoList[0].code || '',
            },
          })
        } catch (error) {
          getApp().setMethodFailedCheckingLog('actionGoNetwork', `获取配网指引失败:${JSON.stringify(error)}`)
          console.log('[get add device guide error]', error)
          // if (error.errMsg) {
          //   showToast('网络不佳，请检查网络')
          //   return
          // }
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
      //todo:yoram 暂时屏蔽掉该功能
      // if (addDeviceSDK.isCanWb01BindBLeAfterWifi(addDeviceInfo.type, addDeviceInfo.sn8)) {
      //   //需要wb01直连后配网判断
      //   app.addDeviceInfo.mode = 'WB01_bluetooth_connection'
      //   wx.navigateTo({
      //     url: addGuide,
      //   })
      // }
      //todo:yoram 暂时屏蔽掉该功能
      // // 校验小程序支持的配网方式
      // if (!addDeviceSDK.isSupportAddDeviceMode(app.addDeviceInfo.mode)) {
      //   if (this.setDialogMixinsData) {
      //     this.setDialogMixinsData(true, '该设备仅支持在美的美居App添加', '', false, [{
      //       btnText: '我知道了',
      //       flag: 'confirm',
      //     }, ])
      //   } else {
      //     wx.showModal({
      //       content: '该设备仅支持在美的美居App添加',
      //       confirmText: '我知道了',
      //       confirmColor: '#267aff',
      //       showCancel: false,
      //     })
      //   }
      // }
      let mode = app.addDeviceInfo.mode
      //todo:yoram 暂时只支持蓝牙配网
      // if (mode != 3) {
      //   wx.showModal({
      //     title: '提示',
      //     showCancel: false,
      //     content: '该设备暂不支持添加，相关功能正在建设中，敬请期待',
      //     success(res) {
      //       if (res.confirm) {
      //         console.log("暂不支持该方式配网")
      //       }
      //     }
      //   })
      //   return
      // }
      if (mode == 0 || mode == 3) {
        wx.navigateTo({
          url: inputWifiInfo,
        })
      } else if (mode == 5 || mode == 9 || mode == 10 || mode == 'air_conditioning_bluetooth_connection' || mode == 100) {
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
    //指引获取失败处理
    getGuideFail(fm) {
      let self = this
      let cancelText = fm == 'scanCode' ? '此二维码获取配网指引失败，请使用选择型号添加' : '配网指引获取失败'
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
    },
    goSelectDevice() {
      wx.navigateTo({
        url: selectDevice,
      })
    },
    actionScan() {
      addDeviceService.goToScanCodeAddDevice()
    },
    clearDevices() {
      this.setData({
        devices: [],
        isDeviceLength: false,
      })
    },
    //位置和蓝牙弹窗提示点击埋点
    locationAndBluetoothClickTrack(flag, deviceInfo) {
      let sn8 = deviceInfo && deviceInfo.sn8 ? deviceInfo.sn8 : ''
      let type = deviceInfo && deviceInfo.type ? deviceInfo.type : ''
      // this.setData({
      //   isSureDialog: false,
      //   showOpenBluetooth: false,
      //   showOpenLocation: false,
      // })
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
    //判断位置和蓝牙权限
    /**
     * @param {*} isGetSystemInfo //是否获取用户系统信息以及用户小程序授权信息
     * @param {*} isCheckVersion //是否检查微信版本
     * @param {*} isCheckLocation //是否检查位置权限以及位置是否打开
     * @param {*} isCheckBluetooth //是否检查蓝牙权限以及蓝牙是否打开
     * @param {*} deviceInfo //设备信息 埋点有需要使用
     * @returns
     */
    async checkLocationAndBluetooth(isGetSystemInfo, isCheckVersion, isCheckLocation, isCheckBluetooth,
      deviceInfo) {
      let sn8 = deviceInfo && deviceInfo.sn8 ? deviceInfo.sn8 : ''
      let type = deviceInfo && deviceInfo.type ? deviceInfo.type : ''
      if (isGetSystemInfo) {
        await this.checkSystemInfo()
      }

      if (!commonIndex.commonUtil.checkWxVersion() && isCheckVersion) {
        this.setData({
          isSureDialog: true,
          dialogMixinsTitle: '你的微信版本过低，请升级至最新版本后再试',
          dialogMixinsContent: '',
          isShowDialogMixinsBlueDesc: false,
          dialogMixinsBtns: [{
            btnText: '我知道了',
            flag: 'confirm',
          }, ],
          showOpenLocation: true,
        })
        return false
      }

      if (!app.globalData.hasAuthLocation && isCheckLocation) {
        //没有授权过位置权限则调出，位置授权弹框
        this.locationAuthorize()
        return false
      }

      if (this.data.isBluetoothMixinNotOpenWxLocation && isCheckLocation) {
        //提示开启定位服务预览埋点
        rangersBurialPoint('user_page_view', {
          page_path: getFullPageUrl(),
          module: 'appliance',
          page_id: 'popus_page_locate_service',
          page_name: '提示开启定位服务弹窗',
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
        this.setData({
          isSureDialog: true,
          dialogMixinsTitle: '请开启位置权限',
          dialogMixinsContent: '',
          isShowDialogMixinsBlueDesc: false,
          dialogMixinsBtns: [{
            btnText: '我知道了',
            flag: 'openLocation',
          }, ],
          showOpenLocation: true,
        })
        return false
      }

      if (this.data.isBluetoothMixinNotOpen && isCheckBluetooth) {
        let params = {
          page_path: getFullPageUrl(),
          module: 'appliance',
          page_id: 'popus_page_open_bluetooth',
          page_name: '提示开启蓝牙弹窗',
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
          ext_info: {},
          sn: '',
          tsn: '',
          dsn: '',
          type: '',
        }
        //提示开启蓝牙预览埋点
        rangersBurialPoint('user_page_view', params)
        this.setData({
          isSureDialog: true,
          dialogMixinsTitle: '请开启蓝牙后再试',
          dialogMixinsContent: '',
          isShowDialogMixinsBlueDesc: false,
          dialogMixinsBtns: [{
            btnText: '我知道了',
            flag: 'openBluetooth',
          }, ],
          showOpenBluetooth: true,
        })
        return false
      }

      //提示用户授予小程序使用蓝牙权限
      if (app.globalData.noBluetoothSetting && isCheckBluetooth) {
        this.bluetoothAuthorize()
        return false
      }

      if (!this.data.isBluetoothMixinHasAuthBluetooth && isCheckBluetooth) {
        let params = {
          page_path: getFullPageUrl(),
          module: 'appliance',
          page_id: 'popus_page_auth_msg',
          page_name: '提示授权允许信息弹窗',
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
          ext_info: {},
          sn: '',
          tsn: '',
          dsn: '',
          type: '',
        }
        //用户授权小程序使用蓝牙权限提示框弹出预览埋点
        rangersBurialPoint('user_page_view', params)
        this.setData({
          isSureDialog: true,
          dialogMixinsTitle: '请点击右上角“...”按钮，选择“设置”，允许本程序使用蓝牙权限',
          dialogMixinsContent: '',
          isShowDialogMixinsBlueDesc: false,
          dialogMixinsBtns: [{
            btnText: '我知道了',
            flag: 'bluetoothAuth',
          }, ],
        })
        return false
      }

      return true
    },
  }
})
