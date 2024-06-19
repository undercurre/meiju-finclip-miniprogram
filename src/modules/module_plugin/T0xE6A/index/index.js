// plugin/T0x38/index/index.js
const app = getApp() //获取应用实例
const environment = app.getGlobalConfig().environment
import pluginMixin from 'm-miniCommonSDK/utils/plugin-mixin'
import DeviceComDecorator from '../utils/DeviceComDecorator'

let key = app.globalData.userData.key
const appKey = app.getGlobalConfig().appKey
import {
  cloudDecrypt
} from 'm-utilsdk/index'
// const IMAGE_SERVER = environment == 'prod' ? 'https://www.smartmidea.net/projects/meiju-lite-assets/plugin/0x38/' : 'https://www.smartmidea.net/projects/sit/meiju-lite-assets/plugin/0x38/'

Page({
  behaviors: [pluginMixin],
  /**
   * 页面的初始数据
   */
  data: {
    navBarName: "壁挂炉",
    // backgroundImage: `${IMAGE_SERVER}background.png`
    backgroundImage: '',
    initEventFlag: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // console.log('options',options);
    if (options.deviceInfo) {
      let deviceInfo = JSON.parse(decodeURIComponent(options.deviceInfo))      
      if (deviceInfo.onlineStatus == 0) {
        this.setData({
          backgroundImage: ''
        })
      }

      let sn = cloudDecrypt(deviceInfo.sn, key, appKey);

      console.log("当前设备的基本信息:", deviceInfo, sn);
      app.globalData.DeviceComDecorator = new DeviceComDecorator(deviceInfo.applianceCode, sn, deviceInfo.sn8);
    }
    this.getUrlparams(options)
    this.setData({
      navBarName: this.data.deviceInfo.name,
    })




  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.queryStatus();
    // this.triggerEvent('ineexOnShow', { data: 'hello' })
    this.setData({
      initEventFlag: !this.data.initEventFlag
    })
    console.log("index onshow");
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    this.destoriedPlugin()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return this.commonShareSetting()
  },

  // 回到首页
  gotoBack() {
    wx.navigateBack({
      delta: 1,
      fail: (err) => {
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
    })
  },

  queryStatus() {
    app.globalData.DeviceComDecorator._queryStatus();
  },
})
