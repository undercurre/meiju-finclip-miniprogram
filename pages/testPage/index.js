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
    sdkTitle: '小程序SDK版本',
    frameworkVersionTitle: '小程序基础库版本',
    miniProgramTitle: '小程序迭代版本',
    miniProgramEnvTitle: '小程序环境',
    openMiniProgramTitle: '打开其他专用小程序',
    showSystemInfoTitle: '获取系统信息',
    runtimeSDKVersion: '',
    frameworkVersion: '',
    version: '',
    miniProgramenv: '',
    show: false,
    enableDebug: true,
    actions: [{ name: 'sit' }, { name: 'uat' }, { name: 'prod' }],
    selectMiniProgramShow: false,
    miniProgramList: [
      { appId: 'fc2316279645914437', name: 'AIRC测试小程序' },
      { appId: 'fc2330714995934981', name: '家用测试小程序' },
      { appId: 'fc2330715168212741', name: '冰箱测试小程序' },
      { appId: 'fc2336533899872005', name: '洗衣机测试小程序' },
      { appId: 'fc2336533704263429', name: '生电测试小程序' },
      { appId: 'fc2336534944827141', name: '厨热测试小程序' },
      { appId: 'fc2330714814252805', name: '微清测试小程序' },
      { appId: 'fc2336573280585477', name: '美智测试小程序' },
      { appId: 'scanCode', name: '扫码录入小程序ID' },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    let self = this
    ft.getAppInfo({
      success: function (res) {
        console.log('getAppInfo success ------------' + JSON.stringify(res))
        self.setData({
          environment: res.data.data.ENV,
        })
      },
    })
  },
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
  //取消/关闭环境选择
  closeActionSheet() {
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
            frameworkVersion: res.frameworkVersion,
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
  showSystemInfo() {
    let self = this
    ft.getSystemInfo({
      success(res) {
        ft.showModal({
          title: '系统信息',
          content: JSON.stringify(res, null, 4),
        })
      },
    })
  },

  closeMiniProgramActionSheet() {
    this.setData({
      selectMiniProgramShow: false,
    })
  },
  openMiniProgramActionSheet() {
    this.setData({
      selectMiniProgramShow: true,
    })
  },
  selectMiniProgramItems(e) {
    let that = this
    let appId = e.detail.appId
    if (appId == 'scanCode') {
      ft.scanCode({
        success(res) {
          console.log(res)
          let scanAppId = res.result
          ft.navigateToMiniProgram({
            appId: scanAppId,
            success(res) {
              // 跳转成功后，在最后面新增且最多新增一条最新记录
              let tempList = that.data.miniProgramList
              let lastItem = tempList[tempList.length - 1]
              if (lastItem.appId !== scanAppId) {
                tempList.push({ appId: scanAppId, name: scanAppId })
                that.setData({
                  miniProgramList: tempList,
                })
              }
              console.log('成功：' + JSON.stringify(res))
            },
            fail(res) {
              console.log('失败' + JSON.stringify(res))
            },
          })
        },
      })
    } else {
      ft.navigateToMiniProgram({
        appId: appId,
        success(res) {
          Toast({ context: that, position: 'bottom', message: '成功打开：' + e.detail.name })
          console.log('成功：' + JSON.stringify(res))
        },
        fail(res) {
          console.log('失败' + JSON.stringify(res))
        },
      })
    }
  },
})
