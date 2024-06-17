// T0x40//index/index.js
//const app = getApp()
const pluginMixin = require('../../../utils/plugin-mixin')
Page({
  behaviors: [pluginMixin],
  /**
   * 页面的初始数据
   */
  data: {
    isInit: true,
    miniHeight: 1800, // 页面最小尺寸
    isIos: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '',
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#f9f9f9',
    })

    //最小尺寸适配不同屏幕
    let that = this
    wx.getSystemInfo({
      success(res) {
        let screenWidth = res.screenWidth
        let screenHeight = res.screenHeight
        let height = (750 / screenWidth) * screenHeight
        that.setData({
          miniHeight: height,
        })
      },
    })
    wx.getSystemInfo({
      success(res) {
        let isIos = res.platform == 'ios'
        that.setData({
          isIos: isIos,
        })
      },
    })
    this.getUrlparams(options)
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
    //this.getDestoried()
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
    return this.commonShareSetting()
  },
})
