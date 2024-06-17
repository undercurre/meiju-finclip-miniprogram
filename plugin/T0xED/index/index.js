/* eslint-disable indent */
// plugin/T0x9C/index/index.js
import { getAssistant } from '../assistant/platform/wechat/plugins/ED/index'
const app = getApp()
const pluginMixin = require('../../../utils/plugin-mixin')
import settingBehavior from '../assets/js/setting'
import computedBehavior from '../../../utils/miniprogram-computed'
import assistantBehavior from '../assistant/platform/wechat/ability/mixins/index'
let assistant = getAssistant()

Page({
  behaviors: [
    pluginMixin,
    settingBehavior,
    computedBehavior,
    ...assistantBehavior(assistant, ['statusNum', 'tipsStatusNum', 'tipsStatusTxt'], []),
  ],
  /**
   * 页面的初始数据
   */
  data: {
    statusNavBarHeight: app.globalData.statusNavBarHeight, //状态栏高 + 标题栏高
    deviceInfoStatus: '',
    deviceInfo: {},
  },

  computed: {
    navTitle() {
      const { setting } = this.data
      if (!setting || !Object.keys(setting).length) return
      return setting.deviceKind < 4
        ? '净水机'
        : setting.deviceKind === 4
        ? '净饮机'
        : setting.deviceKind === 5
        ? '饮水机'
        : setting.deviceKind === 6
        ? '茶吧机'
        : setting.deviceKind === 7
        ? '管线机'
        : setting.deviceKind === 8
        ? '前置过滤器'
        : setting.deviceKind === 9
        ? '软水机'
        : '中央净水机'
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let deviceInfo = JSON.parse(decodeURIComponent(options.deviceInfo))
    this.setData({
      deviceInfo: deviceInfo,
      deviceInfoStatus: deviceInfo.onlineStatus,
    })
    await this.getSetting(deviceInfo.sn8)
    assistant.getDeviceSetting(this.data.setting)
    assistant.deviceStatus = Object.assign({}, assistant.deviceStatus, {
      offline: deviceInfo.onlineStatus == '0' ? true : false,
    })
    assistant.getDeviceInfo(deviceInfo)
    assistant.setPageTrack({
      page_id: 'page_control',
      page_name: '插件首页',
    })
    this.getUrlparams(options)
  },

  clickToDownload: function () {
    wx.navigateTo({
      url: '/pages/download/download',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.setData({
    //   fromApp: false,
    // })
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
    assistant.destroyTimers() // 清掉定时器
    assistant.popPageTrack()
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
  onShareAppMessage: function () {},
})
