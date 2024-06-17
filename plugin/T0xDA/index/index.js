/* eslint-disable no-unused-vars */
// T0xAC//index/index.js
const app = getApp()
const pluginMixin = require('../../../utils/plugin-mixin')
Page({
  behaviors: [pluginMixin],
  /**
   * 页面的初始数据
   */
  data: {
    displayName: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUrlparams(options)

    if (this.data.deviceInfo && this.data.deviceInfo.name) {
      if (this.data.deviceInfo.name.length > 13) {
        this.data.displayName = this.data.deviceInfo.name.substring(0, 12) + '..';
      } else {
        this.data.displayName = this.data.deviceInfo.name;
      }
      this.setData({
        displayName: this.data.displayName
      });
    }    
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
    return this.commonShareSetting()
  },
})
