import { addGuide, inputWifiInfo, wireding } from '../../../../utils/paths'
import { imgesList } from '../../../assets/js/shareImg.js'
import { getLinkType } from '../../../assets/js/utils'
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
    isFromAutoFound: false,
    sub_icon_wifi: imgUrl + imgesList['sub_icon_wifi'],
    sub_icon_wlan: imgUrl + imgesList['sub_icon_wlan'],
    right_icon: imgUrl + '/addDeviceAboutImg/right.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.isFromAutoFound = options.isFromAutoFound ? true : false
    this.pageBurialPoint()
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
  goToInputWifiInfo() {
    console.log('goToInputWifiInfo-----', app.addDeviceInfo)
    app.addDeviceInfo.mode = app.addDeviceInfo.guideInfoAll.wifiNetWorking?.mainConnectinfoList[0].mode
    app.addDeviceInfo.enterprise = app.addDeviceInfo.guideInfoAll.wifiNetWorking?.enterpriseCode
    app.addDeviceInfo.linkType = getLinkType(app.addDeviceInfo.mode)
    app.addDeviceInfo.guideInfo = app.addDeviceInfo.guideInfoAll.wifiNetWorking?.mainConnectinfoList
    app.addDeviceInfo.dataSource = app.addDeviceInfo.guideInfoAll.wifiNetWorking?.dataSource
    app.addDeviceInfo.brandTypeInfo = app.addDeviceInfo.guideInfoAll.wifiNetWorking?.brand
    app.addDeviceInfo.ifNearby = false
    this.wifiNetWorkingBurialPoint()
    wx.navigateTo({
      url: `${inputWifiInfo}?isFromConnectType=true`,
    })
  },
  goToAddGuide() {
    app.addDeviceInfo.mode = app.addDeviceInfo.guideInfoAll.cableNetWorking?.mainConnectinfoList[0].mode
    app.addDeviceInfo.enterprise = app.addDeviceInfo.guideInfoAll.cableNetWorking?.enterpriseCode
    app.addDeviceInfo.linkType = getLinkType(app.addDeviceInfo.mode)
    app.addDeviceInfo.guideInfo = app.addDeviceInfo.guideInfoAll.cableNetWorking?.mainConnectinfoList
    app.addDeviceInfo.dataSource = app.addDeviceInfo.guideInfoAll.cableNetWorking?.dataSource
    app.addDeviceInfo.brandTypeInfo = app.addDeviceInfo.guideInfoAll.cableNetWorking?.brand
    app.addDeviceInfo.ifNearby = false
    this.cableNetWorkingBurialPoint()
    if (this.data.isFromAutoFound) {
      wx.navigateTo({
        url: wireding,
      })
    } else {
      wx.navigateTo({
        url: addGuide,
      })
    }
  },
  pageBurialPoint() {
    rangersBurialPoint('user_page_view', {
      module: 'appliance',
      page_id: 'choose_networking_method_page',
      page_name: '选择配网方式页面',
      device_session_id: app.globalData.deviceSessionId,
      sn8: app.addDeviceInfo.sn8,
      widget_cate: app.addDeviceInfo.type,
      link_type: app.addDeviceInfo.linkType,
    })
  },
  cableNetWorkingBurialPoint() {
    rangersBurialPoint('user_behavior_event', {
      module: 'appliance',
      page_id: 'choose_networking_method_page',
      page_name: '选择配网方式页面',
      widget_id: 'network_cable_buttom',
      widget_name: '使用网线配网按钮',
      device_session_id: app.globalData.deviceSessionId,
      sn8: app.addDeviceInfo.sn8,
      widget_cate: app.addDeviceInfo.type,
      link_type: app.addDeviceInfo.linkType,
    })
  },
  wifiNetWorkingBurialPoint() {
    rangersBurialPoint('user_behavior_event', {
      module: 'appliance',
      page_id: 'choose_networking_method_page',
      page_name: '选择配网方式页面',
      widget_id: 'network_wifi_buttom',
      widget_name: '使用无线网络配网按钮',
      device_session_id: app.globalData.deviceSessionId,
      sn8: app.addDeviceInfo.sn8,
      widget_cate: app.addDeviceInfo.type,
      link_type: app.addDeviceInfo.linkType,
    })
  }
})
