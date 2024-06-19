import { imgesList } from '../../../assets/js/shareImg.js'
import { getLinkType } from '../../../assets/js/utils'
import { inputWifiInfo } from '../../../../utils/paths'

const app = getApp()
const imgBaseUrl = getApp().getGlobalConfig().imgBaseUrl
const imgUrl = imgBaseUrl.url + '/shareImg/' + app.globalData.brand
const rangersBurialPoint = getApp().getGlobalConfig().rangersBurialPoint

Page({
  behaviors: [],
  /**
   * 页面的初始数据
   */
  data: {
    brandConfig: app.globalData.brandConfig[app.globalData.brand],
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'], //顶部状态栏的高度
    sub_icon_no_network: imgUrl + imgesList['sub_icon_no_network'],
    isShowWifiNetworking: false, // 是否支持无线配网
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    if (app.addDeviceInfo.guideInfoAll?.wifiNetWorking && Object.keys(app.addDeviceInfo.guideInfoAll.wifiNetWorking).length) {
      this.setData({
        isShowWifiNetworking: true
      })
    }
    this.pageBurialPoint()
  },

  /**
   * 重试
   */
  retryFn() {
    this.retryBurialPoint()
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 尝试无线网络连接
   */
  onChangeNetWorking() {
    const { guideInfoAll } = app.addDeviceInfo
    // 切换蓝牙配网方式
    if (guideInfoAll && guideInfoAll.wifiNetWorking) {
      app.addDeviceInfo.guideInfo = guideInfoAll.wifiNetWorking?.mainConnectinfoList
      app.addDeviceInfo.enterprise = guideInfoAll.wifiNetWorking?.enterpriseCode
      app.addDeviceInfo.mode = guideInfoAll.wifiNetWorking?.mainConnectinfoList[0].mode
      app.addDeviceInfo.dataSource = guideInfoAll.wifiNetWorking?.dataSource,
      app.addDeviceInfo.brandTypeInfo = guideInfoAll.wifiNetWorking?.brand,
      app.addDeviceInfo.linkType = getLinkType(app.addDeviceInfo.mode)
      this.tryWifiBurialPoint()
      wx.reLaunch({
        url: inputWifiInfo
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

  pageBurialPoint() {
    rangersBurialPoint('user_page_view', {
      module: 'appliance',
      page_id: 'no_network_cable_insertion_detected_page',
      page_name: '未检测到网线插入页',
      device_session_id: app.globalData.deviceSessionId,
      sn8: app.addDeviceInfo.sn8,
      widget_cate: app.addDeviceInfo.type,
      link_type: app.addDeviceInfo.linkType,
    })
  },
  tryWifiBurialPoint() {
    rangersBurialPoint('user_behavior_event', {
      module: 'appliance',
      page_id: 'no_network_cable_insertion_detected_page',
      page_name: '未检测到网线插入页',
      widget_id: 'try_wifi_mode_buttom',
      widget_name: '尝试无线网络连接按钮',
      device_session_id: app.globalData.deviceSessionId,
      sn8: app.addDeviceInfo.sn8,
      widget_cate: app.addDeviceInfo.type,
      link_type: 'bluetooth'
    })
  },
  retryBurialPoint() {
    rangersBurialPoint('user_behavior_event', {
      module: 'appliance',
      page_id: 'no_network_cable_insertion_detected_page',
      page_name: '未检测到网线插入页',
      widget_id: 'retry_buttom',
      widget_name: '重试按钮',
      device_session_id: app.globalData.deviceSessionId,
      sn8: app.addDeviceInfo.sn8,
      widget_cate: app.addDeviceInfo.type,
      link_type: app.addDeviceInfo.linkType,
    })
  }
})
