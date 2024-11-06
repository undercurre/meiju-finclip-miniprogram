const app = getApp()
const imgBaseUrl = app.getGlobalConfig().imgBaseUrl
import paths from '../../../assets/sdk/common/paths'
import { burialPoint } from './assets/burialPoint'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgBaseUrl: imgBaseUrl.url,
    images: {
      successIcon: '/dynamicQrcode/net_ic_success_green@3x.png',
      successLittleIcon: '/dynamicQrcode/net_success_little@3x.png',
      leftArrow: '/dynamicQrcode/right.png',
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let brand = getApp().globalData.brand
    this.setData({
      brand: brand,
    })
    console.log('multiAddsuccess  app.addDeviceInfo', app.addDeviceInfo)
    console.log('multiAddsuccess subDeviceInfo', app.addDeviceInfo.subDeviceInfo)
    console.log('app.globalData.roomList', app.globalData.roomList)
    let devicesList = []
    let mainDevice = {}
    mainDevice.deviceName = app.addDeviceInfo.deviceName
    mainDevice.deviceImg = app.addDeviceInfo.deviceImg
    mainDevice.room = app.addDeviceInfo.room
    devicesList.push(mainDevice)
    if (app.addDeviceInfo.subDeviceInfo) {
      console.log('app.globalData.dcpDeviceImgList', app.globalData.dcpDeviceImgList)
      let subDevice = {}
      subDevice.deviceName = app.addDeviceInfo.subDeviceInfo.name
      subDevice.room = app.addDeviceInfo.subDeviceInfo.room
      subDevice.deviceImg = app.addDeviceInfo.subDeviceInfo.deviceImg
      devicesList.push(subDevice)
    }
    console.log('devicesList', devicesList)
    this.setData({
      devicesList:devicesList
    })
    burialPoint.multipleSnConnectedSuccessful({
      deviceSessionId: app.globalData.deviceSessionId,
      type: app.addDeviceInfo.type,
      sn8: app.addDeviceInfo.sn8,
      tsn: app.addDeviceInfo?.hostDevice.sn,
      link_type: 'Multi_SN_dynamic_QR_code'
    })
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
  onPullDownRefresh: function () {
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },
  handleSetting(e) {
    console.log('adddevice', app.addDeviceInfo)
    console.log('e.currentTarget.dataset.device', )
    burialPoint.multipleSnSet({
      deviceSessionId: app.globalData.deviceSessionId,
      type: app.addDeviceInfo.type,
      sn8: app.addDeviceInfo.sn8,
      tsn: app.addDeviceInfo?.hostDevice.sn,
      link_type: 'Multi_SN_dynamic_QR_code'
    })
    let c = e.currentTarget.dataset.item.deviceName
    // let deviceInformation = app.addDeviceInfo.homeBindSuccessList.filter(item => item.name == c)
    // app.addDeviceInfo.applianceCode = deviceInformation[0].applianceCode
    if (c == app.addDeviceInfo.deviceName) {
      app.addDeviceInfo.isMainDevice = true
    } else {
      app.addDeviceInfo.isMainDevice = false
    }
    app.addDeviceInfo.multiSnFlag = true
    console.log('最终addDeviceInfo', app.addDeviceInfo)
    wx.reLaunch({
      url: `${paths.addSuccess}?fromMultiSn=true`,
    })
  },
  handleFinish() {
    wx.reLaunch({
      url: '/pages/index/index?tabPageId=1'
    })
  }
})
