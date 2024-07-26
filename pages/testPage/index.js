/*
 * @desc:
 * @author: zhucc22
 * @Date: 2024-07-22 15:12:35
 */
import { setIsAutoLogin, removeUserInfo, clearStorageSync } from '../../utils/redis.js'
import { closeWebsocket } from '../../utils/initWebsocket.js'
import Toast from 'm-ui/mx-toast/toast'
import config from '../../config.js'
// pages/testPage/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    appVibeTitle: '切换环境',
    vsConsoleTitle: '切换vsconsole',
    environment: config.environment,
    scodeTitle: '打开扫码调试',
    clearCacheTitle: '清理缓存',
    sdkTitle: 'finClip sdk版本',
    miniProgramTitle: '小程序版本',
    miniProgramEnvTitle: '小程序环境',
    runtimeSDKVersion: '',
    version: '',
    miniProgramenv: '',
    show: false,
    actions: [
      {
        name: 'sit',
      },
      {
        name: 'prod',
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},
  backPage() {
    wx.navigateBack()
  },
  /**
   * 扫码调试小程序
   */
  startAppletByQrCode() {
    ft.changeIsStartAppletByQrCode()
  },
  /**
   * 清理缓存
   */
  clearCache() {
    getApp().globalData.isLogon = false
    getApp().globalData.applianceAuthList = null
    closeWebsocket()
    setIsAutoLogin(false)
    removeUserInfo()
    clearStorageSync()
    Toast({ context: this, position: 'bottom', message: '缓存已经清除' })
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },
  //切换环境
  switchEnvironment() {
    this.setData({
      show: true,
    })
  },
  selectItems(e) {
    config.environment = e.detail.name
    let message = '已切换到' + e.detail.name
    wx.switchTab({
      url: '/pages/index/index',
    })
    Toast({ context: this, position: 'bottom', message: message })
  },
  toggleCloseActionSheet() {
    this.setData({
      show: false,
    })
  },

  //获取sdk版本号
  getSdkVersion() {
    let self = this
    wx.getSystemInfo({
      success(res) {
        if (res && res.runtimeSDKVersion) {
          self.setData({
            runtimeSDKVersion: res?.runtimeSDKVersion,
          })
        }
      },
    })
    const accountInfo = ft.getAccountInfoSync()
    this.setData({
      version: accountInfo.miniProgram.version,
      miniProgramenv: accountInfo.miniProgram.envVersion,
    })
    console.log('获取小程序信息', accountInfo.miniProgram) // 小程序信息
  },
  //切换vsconsole调试
  switchVsconsole() {},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getSdkVersion()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
})
