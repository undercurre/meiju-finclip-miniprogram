/*
 * @desc: 扫码调试页面
 * @author: zhucc22
 * @Date: 2024-07-22 15:12:35
 */
import { setIsAutoLogin, removeUserInfo, clearStorageSync } from '../../utils/redis.js'
import { closeWebsocket } from '../../utils/initWebsocket.js'
import Toast from 'm-ui/mx-toast/toast'
import config from '../../config.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    appVibeTitle: '切换环境',
    vsConsoleTitle: 'vsconsole',
    environment: config.environment,
    scodeTitle: '切换扫码调试',
    clearCacheTitle: '清理缓存',
    sdkTitle: 'finClip sdk版本',
    miniProgramTitle: '小程序版本',
    miniProgramEnvTitle: '小程序环境',
    runtimeSDKVersion: '',
    version: '',
    miniProgramenv: '',
    show: false,
    enableDebug: true,
    actions: [
      {
        name: 'sit',
      },
      {
        name: 'uat',
      },
      {
        name: 'prod',
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getSdkVersion()
  },
  //页面回退
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
    ft.clearAppCache()
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  //切换环境
  switchEnvironment() {
    this.setData({
      show: true,
    })
  },
  //关闭环境选择
  toggleActionSheet() {
    this.setData({
      show: false,
    })
  },
  //取消
  toggleCloseActionSheet() {
    this.setData({
      show: false,
    })
  },
  //切换环境
  selectItems(e) {
    config.environment = e.detail.name
    ft.changeCustomEnv({ env: e.detail.name })
    let message = '已切换到' + e.detail.name
    Toast({ context: this, position: 'bottom', message: message })
    wx.switchTab({
      url: '/pages/index/index',
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
            enableDebug: res.enableDebug,
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
  switchVsconsole() {
    // ft.setEnableDebug({
    // enableDebug: !this.data.enableDebug,
    // })
    ft.changeIsShowVConsole()
    this.setData({
      enableDebug: !this.data.enableDebug,
    })
  },
})
