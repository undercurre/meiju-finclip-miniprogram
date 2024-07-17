/**
 * AP自发现方法，方法使用mixin的方式调用
 * 由于首页也需要调用，所以放在主包中
 * 方法调用方式为：
 * getAPAutoFoundList(obj = {
      enterPrise: "midea",
      signalStrength: 99
    })
 * 方法有一个对象参数，包含品牌以及信号强度，默认为美的品牌，强度为99
 * 扫描过虑后的设备信息会放在变量：devices中(支持页面读取)
 * 如果扫描后有符合要求的设备，会把标志位isDeviceLength置为true(支持页面读取)，关闭窗口及打开页面需重置
 * 方法中过虑了已经扫描的，已添加的，找朋友发现的朋友设备
 */
const app = getApp()
import { service } from '../common/getApiPromise.js'
import { getFullPageUrl } from '../../../../utils/util.js'
import { commonIndex } from '../common/commonIndex'
import { index } from '../index'
const searchTime = 30000
let timer1 = ''
module.exports = Behavior({
  behaviors: [],
  properties: {},
  data: {
    dcpDeviceImgList: [], //ap自发现设备图标
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
    ], //ap自发现列表
    isDeviceLength: false, //是否有ap自发现的设备
  },
  methods: {
    /**
     * ap自发现调用方法
     * 以下为默认值
     * obj: {
     *      enterPrise : "midea",
     *      signalStrength: 99
     * }
     * @param {*} obj
     */
    async getAPAutoFoundList(
      obj = {
        enterPrise: 'toshiba',
        signalStrength: 99,
        isClose: 1,
      }
    ) {
      console.log('========Yoram:start ap auto found logic=======')
      //判断系统，只支持Android AP自发现，ios系统则直接返回
      const res = await commonIndex.commonUtil.checkSystem()
      if (res) return
      service.getWxApiPromise(wx.startWifi).then((res1) => {
        console.log('获取WiFi列表1', res1)
        service.getWxApiPromise(wx.getWifiList).then(() => {
          wx.onGetWifiList((res3) => {
            console.log('获取WiFi列表3', res3)
            res3.wifiList.forEach((device) => {
              //校验品牌设备，默认为美的设备
              if (!commonIndex.commonUtil.filterEnterPrise(device.SSID, obj && obj.enterPrise)) return
              console.log('美的设备AP发现', device)

              //wifi强度校验
              console.log('发现设备ap强度', device.signalStrength)
              if (device.signalStrength < obj.signalStrength) return
              //校验是否设备已经发现
              if (!this.filterDuplicateScan(device.SSID)) return

              //校验是否是已配网的设备 且 是在首页 (处理wx.getWifiList缓存问题)
              console.log('已配网的设备====', app.globalData.curAddedApDeviceList, device.SSID)
              if (this.checkIsAddedApDevice(device.SSID) && getFullPageUrl().includes('/index/index')) {
                console.log('已配网的设备1====', app.globalData.curAddedApDeviceList, device.SSID)
                return
              }

              //获取已发现设备的需要字段
              const deviceData = index.accessPointIndex.accessPointUtil.getDeviceData(device)
              //获取已发现列表
              const foundDevices = this.data.devices
              let sortDevice = commonIndex.commonUtil.sortScanDevice(foundDevices, deviceData)

              //AP自发现设备里去掉找朋友发现的朋友设备信息
              console.log('朋友设备信息', app.globalData.friendDevices)
              let friendDevices = app.globalData.friendDevices ? app.globalData.friendDevices : []
              let ssids = friendDevices.map((item) => {
                return item.ssid
              })
              sortDevice = sortDevice.filter((item) => {
                return !ssids.includes(item.SSID)
              })
              this.setData({
                devices: sortDevice,
              })
              //console.log('添加的AP自发现设备', this.data.devices)
              this.setMixinsDialogShow()
            })
            setTimeout(() => {
              wx.getWifiList({
                fail: () => {},
              })
            }, 2000)
          })
          if (obj && obj.isClose == 1) {
            console.log('开始扫描蓝牙：', new Date())
            this.setMixinsWifiClose()
          }
        })
      })
    },
    /**
     * 扫描到设备是，将显示设备的标志位设置为true
     */
    setMixinsDialogShow() {
      if (this.data.devices.length == 0) return
      this.setData({
        isDeviceLength: true,
      })
    },
    /**
     * 过虑重复扫描的设备
     * @param {*} SSID
     */
    filterDuplicateScan(SSID) {
      const fonudDevices = this.data.devices
      const idx = commonIndex.commonUtil.inArray(fonudDevices, 'SSID', SSID)
      console.log('SSID 筛查', fonudDevices, idx)
      return idx === -1 ? true : false
    },
    /**
     * 判断ap自发现设备是否是已ap配网的设备  解决wx.getWifiList 有缓存问题
     * @param {*} ssid wifi ssid
     */
    checkIsAddedApDevice(ssid) {
      return app.globalData.curAddedApDeviceList && app.globalData.curAddedApDeviceList.includes(ssid)
    },
    setMixinsWifiClose() {
      timer1 = setTimeout(() => {
        console.log('关闭wifi')
        wx.offGetWifiList()
      }, searchTime)
    },
  },
})
