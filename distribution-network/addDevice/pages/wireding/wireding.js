import { imgesList } from '../../../assets/js/shareImg.js'
import { ab2hex } from 'm-utilsdk/index'
import { notWired, addGuide, linkDevice } from '../../../../utils/paths'

const bluetooth = require('../../../../pages/common/mixins/bluetooth.js')
const app = getApp()
const imgBaseUrl = getApp().getGlobalConfig().imgBaseUrl
const imgUrl = imgBaseUrl.url + '/shareImg/' + app.globalData.brand
const rangersBurialPoint = getApp().getGlobalConfig().rangersBurialPoint
let timer

Page({
  behaviors: [bluetooth],
  /**
   * 页面的初始数据
   */
  data: {
    brandConfig: app.globalData.brandConfig[app.globalData.brand],
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'], //顶部状态栏的高度
    sub_icon_guide_link: imgUrl + imgesList['sub_icon_guide_link'],
    sub_icon_link_ing: imgUrl + imgesList['sub_icon_link_ing'],
    sub_icon_link_success: imgUrl + imgesList['sub_icon_link_success'],
    isNetworkCable: false, // 是否插入网线
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.pageBurialPoint()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.startAutoDiscover()
    this.actionTimer()
  },

  /**
   * 定时器 60秒超时处理
   */
  actionTimer() {
    timer = setTimeout(() => {
      wx.navigateTo({ url: notWired })
    }, 60*1000)
  },

  /**
   * 开始搜索蓝牙信号
   */
  startAutoDiscover() {
    wx.openBluetoothAdapter({
      success: (res) => {
        console.log('openBluetoothAdapter success', res)
        this.startBluetoothDevicesDiscovery()
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

  startBluetoothDevicesDiscovery() {
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

  /**
   * 监听蓝牙信号
   */
  onBluetoothDeviceFound() {
    const rssiThreshold = -70 // 信号强度过滤阈值为-70
    wx.onBluetoothDeviceFound((res) => {
      res.devices.forEach((device) => {
        // 品牌名校验
        const brandConfig = app.globalData.brandConfig[app.globalData.brand]
        let localName = device.localName || device.name || ''
        if(localName.length >0){
          localName = localName.toLocaleLowerCase()
        }
        if (!brandConfig.apNameHeader.some((value) => localName.includes(value))) {
          return
        }
        // RSSI为正值的异常情况均舍弃 或者信号强度小于-70也过滤掉
        if (device.RSSI > 0 || device.RSSI < rssiThreshold) {
          return
        }
        //校验广播包开头公司标识
        if (!this.filterMideaDevice(device)) return

        const adData = ab2hex(device.advertisData) // ArrayBuffer转16进度字符串
        device.adData = adData
        // 校验二代蓝牙广播包长度对不对
        if (!this.checkAdsData(device)) {
          console.log('二代蓝牙广播包长度异常', adData)
          return
        }
        //校验已连接设备
        const deviceParam = this.getDeviceParam(device)
        if (deviceParam.mac === app.addDeviceInfo.mac) {
          this.onMatchingMacDevice(deviceParam)
        }
      })
    })
  },

  /**
   * 对蓝牙信息进行mac匹配 判断是否插入网线
   */
  async onMatchingMacDevice(device) {
    console.log('### 匹配成功&&是否已插入网线', device.isNetworkCable)
    console.log('### 匹配设备信息&&addDeviceInfo', device, app.addDeviceInfo)
    if (device.isNetworkCable) {
      this.setData({ isNetworkCable: true })
      app.addDeviceInfo.isNetworkCable = true
      app.addDeviceInfo.isCheck = device.isCheck
      if (!app.addDeviceInfo.referenceRSSI) {
        app.addDeviceInfo.referenceRSSI = device.referenceRSSI
      }
      this.closeAndStopAll()
      // 0.5秒后自动跳转
      setTimeout(() => {
        console.log('### 是否已确权: ', device.isCheck)
        if (device.isCheck) { // 已确权
          wx.navigateTo({
            url: linkDevice
          })
        } else {
          // 跳转靠近确权
          app.addDeviceInfo.ifNearby = true
          wx.navigateTo({
            url: addGuide
          })
        }
      }, 500);
    }
  },

  closeAndStopAll() {
    console.log('####已关闭搜索蓝牙信号')
    wx.offBluetoothDeviceFound()
    wx.stopBluetoothDevicesDiscovery()
    wx.closeBluetoothAdapter()
    if (timer) {
      clearTimeout(timer)
    }
  },

  pageBurialPoint() {
    rangersBurialPoint('user_page_view', {
      module: 'appliance',
      page_id: 'insert_network_cable_guide_page',
      page_name: '插入网线指引页',
      device_session_id: app.globalData.deviceSessionId,
      sn8: app.addDeviceInfo.sn8,
      widget_cate: app.addDeviceInfo.type,
      link_type: app.addDeviceInfo.linkType,
    })
  },

  /**
   * 返回上一页
   */
  handleBack() {
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2]
    
    // 如果是配网指引页 触发重试
    console.log("### prevPage", prevPage)
    if (prevPage && prevPage.route === 'distribution-network/addDevice/pages/addGuide/addGuide') {
      prevPage.retry()
    }

    wx.navigateBack()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.closeAndStopAll()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.closeAndStopAll()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },
})
