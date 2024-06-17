import { hasKey } from 'm-utilsdk/index'
const actTempmetMethodsMixins = require('../actTempmetMethodsMixins.js')
const commonMixin = require('../commonMixin.js')
Page({
  behaviors: [actTempmetMethodsMixins, commonMixin],
  /**
   * 页面的初始数据
   */
  data: {
    pageUrl: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInitOptions(options)
    const webViewUrl = decodeURIComponent(this.getWebViewUrl())
    this.setData({
      pageUrl: webViewUrl,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

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
  // onShareAppMessage: function () {

  // },
  getWebViewUrl() {
    const { options } = this.data
    const webViewUrl = hasKey(options, 'webViewUrl') ? options.webViewUrl : ''
    return webViewUrl
  },
})
