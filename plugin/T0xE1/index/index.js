// T0xAC//index/index.js
const app = getApp()
const pluginMixin = require('../assets/js/plugin-mixin')
import computedBehavior from '../../../utils/miniprogram-computed'

Page({
  behaviors: [pluginMixin, computedBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    activeNum: 0,
    deviceStatus: -2,
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'] + 36 + 'px', //顶部状态栏的高度
  },

  computed: {
    hasDrawerDevice() {
      const { deviceInfo } = this.data
      if (!deviceInfo || !deviceInfo.sn8) return
      console.log({ deviceInfo: deviceInfo.sn8 })
      return this.data.deviceInfo.sn8 === '00W9501B'
    },
  },

  modeChange({ detail }) {
    this.setData({ deviceStatus: detail.deviceStatus })
  },

  onTabsChange({ detail: { index } }) {
    this.setData({ activeNum: index })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUrlparams(options)
    this.setData({
      deviceInfo: {
        ...this.data.deviceInfo,
        applianceCode: '' + this.data.deviceInfo.applianceCode || '',
      },
    })
    console.log('checkout get deviceinfo ' + JSON.stringify(this.data.deviceInfo))
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      fromApp: false,
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.destoriedPlugin()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var tempTitle = '欢迎使用美的美居Lite'
    var tempPath = '/pages/index/index'
    var tempImageUrl = '/assets/img/img_wechat_chat01@3x.png'
    return {
      title: tempTitle, // 默认是小程序的名称(可以写slogan等)
      path: tempPath, // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: tempImageUrl, //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      success: function (res) {
        // 转发成功之后的回调
        // eslint-disable-next-line prettier/prettier
        // eslint-disable-next-line no-empty
        if (res.errMsg == 'shareAppMessage:ok') {
        }
      },
      fail: function () {
        // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息
        }
      },
    }
  },
  clickToDownload: function () {
    wx.navigateTo({
      url: '/pages/download/download',
    })
  },
})
