import { rangersInit } from './utils/rangersInit'
import config from './config'
import { globalCommonConfig } from './utils/inintConfigSdk'
const $$Rangers = rangersInit()
import Tracker from './track/oneKeyTrack/libs/index'
import trackConfig from './track/oneKeyTrack/config/index'
import { deviceInfoReport } from './track/track.js'
import { requestService, rangersBurialPoint } from './utils/requestService'
import { hasKey, dateFormat, getReqId, getStamp } from 'm-utilsdk/index'
import weixinApi from './utils/weixin/weixin.api'
import cloudMethods from '/globalCommon/js/cloud.js'
import getBrand from './utils/getBrand'
import { index as homeIndex } from './utils/paths'
import { removeCloudSync, setPluginFilter } from './utils/redis'
import { initWebsocket, closeWebsocket } from './utils/initWebsocket.js'
import { api } from './api'
new Tracker({
  tracks: trackConfig,
})

// 配网埋点日志
import CheckingLog from './miniprogram_npm/m-track/m-track'
const CKECKING_LOG = new CheckingLog({
  moduleName: 'appliance_log',
  checkingPath: 'distribution-network',
  rangersBurialPoint: rangersBurialPoint,
})

// 配网品牌配置
import brandConfig from './distribution-network/assets/js/brand.js'

import { onNetworkStatusChange, appRoutefun } from './utils/util.js'
import loginMethods from '/globalCommon/js/loginRegister'
import { checkTokenExpir, checkTokenExpired, setDcpDeviceImg } from './utils/redis.js'
import Dialog from './miniprogram_npm/m-ui/mx-dialog/dialog'

//const linkupSDK = require('./distribution-network/assets/sdk/index.js')
const pkg = '' //require('./miniprogram_npm/m-ble-crypto/bluetooth-crypto.js')
const cardSDK = require('./moudle-card/index.js')
let getBlackWhiteListTime = 0 //获取插件黑白名单次数
// let resolveCallBack, rejectCallBack = null;
// console.debug = () => {}
// console.log = () => {}
App({
  ...weixinApi,
  //获取多云协议数据
  initCloudData() {
    // let cloudRegion = await this.getGlobalRegion()
    let cloudGlobalModule = wx.getStorageSync('cloudGlobalModule')
    if (cloudGlobalModule) {
      cloudGlobalModule = JSON.parse(cloudGlobalModule)
      let environment = cloudGlobalModule?.environment
      if (!environment || environment !== config.environment) {
        removeCloudSync()
        cloudGlobalModule = ''
      }
    }
    let routeVersion = cloudGlobalModule?.version
    cloudMethods
      .getGlobalRegion()
      .then((res) => {
        let cloudRegion = res.data.data
        this.globalData.cloudRegion = cloudRegion
        wx.setStorageSync('cloudRegion', cloudRegion) //存储
      })
      .catch((err) => {
        console.log('err region', err)
      })
    cloudMethods.getGlobalModule
      .call(this, routeVersion)
      .then((res) => {
        let cloudGlobalModule = {
          ...res.data.data,
          ...{
            environment: config.environment,
          },
        }
        this.globalData.cloudGlobalModule = JSON.stringify(cloudGlobalModule)
        wx.setStorageSync('cloudGlobalModule', JSON.stringify(cloudGlobalModule)) //存储
      })
      .catch((err) => {
        //接口异常，取本地配置
        if (!cloudGlobalModule) {
          cloudMethods.getLocalModule.apply(this)
        }
        console.log('err module', err)
      })
  },
  initData() {
    this.globalData.wxExpiration = null
    this.globalData.phoneNumber = ''
    this.globalData.isLogon = false
  },
  // 请求iot的设备icon
  getDcpDeviceImg() {
    let that = this
    let sceneIconList = wx.getStorageSync('dcpDeviceImgList')
    let spidDeviceImgList = wx.getStorageSync('spidDeviceImgList')
    console.log('获取设备图标缓存----》wx.getStorageSync', wx.getStorageSync('dcpDeviceImgList'))
    this.globalData.dcpDeviceImgList = sceneIconList
    this.globalData.spidDeviceImgList = spidDeviceImgList
    loginMethods
      .getDcpDeviceImgs()
      .then((res) => {
        console.log('获取设备图标 app内', res)
        try {
          //部分手机会因为长度超限制设置失败
          wx.nextTick(() => {
            setDcpDeviceImg(res.iconList, res.smartProductIdList)
          })
        } catch (error) {
          console.log('setStorage error', error)
        }
        that.globalData.dcpDeviceImgList = res.iconList
        that.globalData.spidDeviceImgList = res.smartProductIdList
      })
      .catch((err) => {
        console.log(err)
      })
  },
  onLaunch: async function (options) {
    console.log(`performance onLaunch start ${new Date().getTime() - this.globalData.performanceStartTime}`)
    console.log('launch options', options)
    //监听网络变化
    onNetworkStatusChange.call(this)
    //全局路由监听
    wx.onAppRoute(appRoutefun)
    // 取消全局路由监听
    // wx.offAppRoute(appRoutefun)
    this.initCloudData() //多云协议
    //获取设备图标
    this.getDcpDeviceImg()
    // 分包异步加载
    //this.globalData.linkupSDK = linkupSDK // 存入全局变量，其他包可以直接引用
    // 全局加载蓝牙
    this.globalData.ble = pkg
    //全局加载物模型数据
    this.globalData.cardSDK = cardSDK.moduleCard // 存入全局变量，其他包可以直接引用
    this.globalData.brand = getBrand() // 存入全局变量，其他包可以直接引用
    this.globalData.brandConfig = brandConfig.config // 存入全局变量，其他包可以直接引用
    let env = 'sit'
    try {
      let self = this
      ft.getAppInfo({
        success: function (res) {
          console.log('Yoram getAppInfo success ------------>', res)
          env = res.data.data.ENV
          self.globalData.appEnv = res.data.data.ENV
          self.globalData.appVersion = res.data.data.VERSION_NAME
          self.getBlackWhiteList(options, env)
        },
        fail: function (res) {
          console.log('Yoram getAppInfo fail--------->', res)
          self.getBlackWhiteList(options, env)
        },
      })
      const accountInfo = ft.getAccountInfoSync()
      const deviceId = ft.getDeviceIdSync().data.id
      console.log('当前小程序版本信息-------->', accountInfo.miniProgram)
      this.globalData.deviceId = deviceId
      this.globalData.miniProgram = accountInfo.miniProgram
      // 网络请求返回日志标识
      wx.getStorage({
        key: 'isEnableHttpResponseLog',
        success(res) {
          self.globalData.isEnableHttpResponseLog = res.data
        },
      })
    } catch (error) {
      this.getBlackWhiteList(options, env)
      console.log(error)
    }
    this.$$Rangers = $$Rangers
    CKECKING_LOG.uploadOfflineCheckingLog() // 上传配网无网阶段埋点日
    //小程序跳转
    this.globalData.isActionAppLaunch = true
    try {
      this.initData()
      let MPTOKEN_EXPIRATION = 0
      let MPTOKEN_USERINFO
      MPTOKEN_EXPIRATION = wx.getStorageSync('MPTOKEN_EXPIRATION')
      MPTOKEN_USERINFO = wx.getStorageSync('userInfo')
      //冷启动登录逻辑校验
      //60天内不需要重新登录，和云端确认 60天逻辑无需校验
      // if (checkTokenPwdExpired(MPTOKEN_USERINFO, MPTOKEN_AUTOLOGIN_EXPIRATION)) {
      //4小时不操作需要刷新用户token
      if (!checkTokenExpired(MPTOKEN_USERINFO, MPTOKEN_EXPIRATION)) {
        loginMethods.loginAPi
          .call(this)
          .then((res2) => {
            console.log('app onLaunch resfreshToken sucesss', res2)
            console.log('app onLaunch resfreshToken sucesss 优化', dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss.S'))
            this.globalData.isActionAppLaunch = false
            this.globalData.wxExpiration = true
            if (this.callbackFn) {
              this.callbackFn()
            }
          })
          .catch((err) => {
            console.log('app loginAPi catch', err)
            //无网络先保持登录状态
            // if (this.globalData.noNetwork) {
            this.globalData.isActionAppLaunch = false
            loginMethods.getUserInfo.call(this, MPTOKEN_USERINFO)
            // } else {
            //否则直接退出
            // this.setLoginFalse()
            // }
            if (this.callbackFn) {
              this.callbackFn()
            }
          })
      } else if (checkTokenExpired(MPTOKEN_USERINFO, MPTOKEN_EXPIRATION)) {
        //有效期内直接登录
        this.globalData.isActionAppLaunch = false
        loginMethods.getUserInfo.call(this, MPTOKEN_USERINFO)
        if (this.callbackFn) {
          this.callbackFn()
        }
      }
      // } else {
      // this.setLoginFalse()
      // }
    } catch (error) {
      let MPTOKEN_USERINFO = wx.getStorageSync('userInfo')
      this.globalData.isActionAppLaunch = false
      loginMethods.getUserInfo.call(this, MPTOKEN_USERINFO)
      console.log(error, 'app onLaunch try cache', error)
      //this.setLoginFalse()
      if (this.callbackFn) {
        this.callbackFn()
      }
    }

    console.log(`performance onLaunch end ${new Date().getTime() - this.globalData.performanceStartTime}`)
  },

  onShow: async function (options) {
    console.log(`performance onShow start ${new Date().getTime() - this.globalData.performanceStartTime}`)
    //息屏后重连
    if (this.globalData.gloabalWebSocket && this.globalData.gloabalWebSocket._isClosed && this.globalData.isLogin) {
      initWebsocket()
    }
    console.log('优化 onShow start', dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss.S'))
    this.globalData.options = options
    console.log('scene', options.scene)
    console.log('options:', options)
    try {
      let MPTOKEN_EXPIRATION = 0
      let MPTOKEN_USERINFO
      MPTOKEN_EXPIRATION = wx.getStorageSync('MPTOKEN_EXPIRATION')
      MPTOKEN_USERINFO = wx.getStorageSync('userInfo')
      //热启动阶段，热启动和热启动逻辑和小程序存在较大差异
      //热启动如果超过60天，无需特殊处理
      //if (checkTokenPwdExpired(MPTOKEN_USERINFO, MPTOKEN_AUTOLOGIN_EXPIRATION) && !this.globalData.isActionAppLaunch) {
      //4小时需要刷新token
      if (!this.globalData.isActionAppLaunch && !checkTokenExpired(MPTOKEN_USERINFO, MPTOKEN_EXPIRATION)) {
        this.globalData.isActionAppLaunch = false
        this.globalData.wxExpiration = null
        loginMethods.loginAPi
          .call(this)
          .then(() => {
            console.log('app onshow resfreshToken sucesss')
            console.log('app onshow resfreshToken sucesss 优化', dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss.S'))
            this.globalData.wxExpiration = true
            if (this.callbackFn) {
              this.callbackFn()
            }
          })
          .catch(() => {
            //无网络先保持登录状态
            this.globalData.isActionAppLaunch = false
            loginMethods.getUserInfo.call(this, MPTOKEN_USERINFO)
            if (this.callbackFn) {
              this.callbackFn()
            }
          })
      }
      //有效期内不需要特殊处理
      //}
    } catch (error) {
      let MPTOKEN_USERINFO = wx.getStorageSync('userInfo')
      this.globalData.isActionAppLaunch = false
      loginMethods.getUserInfo.call(this, MPTOKEN_USERINFO)
      if (this.callbackFn) {
        this.callbackFn()
      }
      console.log(error, 'onshow try cache')
    }
    this.setMiniProgramData()
    //启动app不需要弹蓝牙和位置授权信息
    //this.triggerWxAuth()
    //获取设备信息
    this.getSystemInfo()

    console.log(`performance onShow end ${new Date().getTime() - this.globalData.performanceStartTime}`)
  },
  //获取设备相关信息
  getSystemInfo() {
    let that = this
    wx.getSystemInfo({
      success(res) {
        that.globalData.appSystemInfo = res
      },
    })
  },
  // 未授权情况下调起系统授权弹窗
  triggerWxAuth() {
    let system = wx.getSystemSetting(),
      appAuthorize = wx.getAppAuthorizeSetting(),
      deviceInfo = wx.getDeviceInfo(),
      windowInfo = wx.getWindowInfo(),
      appBaseInfo = wx.getAppBaseInfo()
    let res = {
      ...system,
      ...appAuthorize,
      ...deviceInfo,
      ...windowInfo,
      ...appBaseInfo,
    }
    wx.openBluetoothAdapter({
      success: (res) => {
        console.log('app >>> 初始化蓝牙模块成功', res)
      },
      fail: (err) => {
        console.log('app >>> 初始化蓝牙模块失败', err)
      },
    })
    wx.getLocation({
      type: 'wgs84', //返回可以用于wx.openLocation的经纬度
      success(res) {
        console.log('app >>> 初始化地址模块成功', res)
        wx.openLocation()
      },
      fail: (err) => {
        console.log('app >>> 初始化地址模块失败', err)
      },
    })
  },
  onError(error) {
    console.log('发生脚本错误或者接口调用错误', error)
    CKECKING_LOG.uploadCheckingLog('App.onError', { event_result: error })
  },
  async setIpx(wxSystemInfo) {
    let modelmes = (wxSystemInfo && wxSystemInfo.model) || ''
    let safeArea = (wxSystemInfo && wxSystemInfo.safeArea) || {}
    if (modelmes.search('iPhone X') != -1) {
      this.globalData.isIphoneX = true
    }
    // 安全区域大于20的手机
    if (safeArea.top > 20 && modelmes.indexOf('iPhone') > -1) {
      this.globalData.isPx = true
    }
  },
  setLoginFalse() {
    this.globalData.isLogon = false
    this.globalData.isActionAppLaunch = false
    this.globalData.wxExpiration = false
    if (this.callbackFn) {
      this.callbackFn()
    }
  },
  setMiniProgramData() {
    const res = wx.getSystemInfoSync()
    this.getNavHeight(res)
    this.setIpx(res)
  },
  // 计算状态栏与导航栏的总高度
  async getNavHeight(res) {
    // 获取状态栏高度
    // 判断是否是安卓操作系统 （标题栏苹果为44px,安卓为48px）
    let titleH
    if (res && res['system']) {
      titleH = res['system'].indexOf('Android') > 0 ? 48 : 44
    }
    this.globalData.statusNavBarHeight = titleH + res['statusBarHeight']
    this.globalData.statusBarHeight = res['statusBarHeight']
    this.globalData.navBarHeight = titleH
    this.globalData.screenHeight = res['windowHeight']
  },
  onHide: function () {
    //关闭websocket
    closeWebsocket()
    if (this.globalData.deviceSessionId) {
      CKECKING_LOG.uploadCheckingLog('terminate', CKECKING_LOG.getUnloadParam())
      CKECKING_LOG.uploadOfflineCheckingLog() // 上传配网无网阶段埋点日志
    }
    //清除后确权相关的数据
    if (this.globalData.bathAuthTimer) clearInterval(this.globalData.bathAuthTimer)
    if (wx.getStorageSync('batchAuthList')) wx.removeStorageSync('batchAuthList')
    this.globalData.applianceAuthList = null
    this.globalData.share = ''
    deviceInfoReport('user_behavior_event', null, {
      page_id: 'terminate',
      module: 'data',
      ext_info: {
        if_sys: 1,
      },
    })
  },

  //  使用数据劫持模式去监听登录状态
  watchLogin(callback, that) {
    console.log('this.globalData', this.globalData)
    const obj = this.globalData
    //未使用协议通知的组件跳到首页会出现登录态丢失，Object.defineProperty 的初始值为underfine会覆盖原来的this.globalData.isLogon 值
    const isLogin = this.globalData.isLogon
    Object.defineProperty(obj, 'isLogon', {
      configurable: true,
      enumerable: true,
      set: function (value) {
        this._isLogon = value
        if (!this._isLogon) {
          this.isGetGrayList = false //退出登录后 需重新获取灰度名单
        }
        if (isLogin === value) return
        callback(value, that)
      },
      get: function () {
        return this._isLogon == undefined ? isLogin : this._isLogon
      },
    })
  },
  //新登录流程校验调用
  checkGlobalExpiration() {
    let app = this
    return new Promise((resolve, reject) => {
      if (app.globalData.wxExpiration != null) {
        app.globalData.wxExpiration ? resolve(true) : reject(false)
      } else {
        app.callbackFn = (data) => {
          if (data != '') {
            app.globalData.wxExpiration ? resolve(true) : reject(false)
          }
        }
      }
    })
  },

  checkActionAppShow(mptoken, MPTOKEN_EXPIRATION) {
    if (hasKey(this.globalData.userData, 'mdata')) {
      return this.globalData.userData.mdata.accessToken && checkTokenExpir(mptoken, MPTOKEN_EXPIRATION)
    }
    return false
  },

  getShutDownNoticeData() {
    return requestService.request('shutdownNotice', { appId: api.iotAppId })
  },

  checkNetLocal() {
    let that = this
    wx.getNetworkType({
      success(res) {
        console.log('当前网络情况1', res)
        let { networkType } = res
        if (['none'].includes(networkType)) {
          wx.showToast({
            title: '网络未连接，请检查您的网络设置',
            icon: 'none',
            duration: 3000,
          })
        } else if (['2g', '3g'].includes(networkType)) {
          wx.showToast({
            title: '当前网络信号不佳，请检查网络设置',
            icon: 'none',
            duration: 3000,
          })
        } else {
          that
            .checkNetwork()
            .then(() => {
              console.log('网络检查接口未超时')
            })
            .catch(() => {
              console.log('当前网络信号不佳111')
              wx.showToast({
                title: '当前网络信号不佳，请检查网络设置',
                icon: 'none',
                duration: 3000,
              })
            })
        }
      },
      fail(err) {
        console.log('初始化获取网络状态API调用失败', err)
      },
    })
  },
  checkNetwork(timeout) {
    // 检查网络是否通畅
    return new Promise((resolve, reject) => {
      wx.request({
        url:
          'https://www.smartmidea.net/projects/meiju-finclip-assets/checkingLog/result.json?t=' + new Date().getTime(),
        data: {},
        header: {
          'content-type': 'application/json',
        },
        method: 'GET',
        timeout: timeout || 3000,
        dataType: 'json',
        responseType: 'text',
        success: (result) => {
          resolve()
        },
        fail: (error) => {
          console.log('err哈哈哈:', error)
          reject()
        },
      })
    })
  },
  //通用方法和数据传递
  getGlobalConfig() {
    return globalCommonConfig
  },

  //黑白名单获取.appId
  getBlackWhiteList(options, env) {
    let verType = 'release'
    if (env != 'prod') {
      verType = 'trial'
    }
    console.log('插件黑白名单参数：verType:', verType)
    //先去缓存读取数据
    let pluginFilter_SN8 = wx.getStorageSync('pluginFilterS_N8'),
      pluginFilter_type = wx.getStorageSync('pluginFilter_type')
    if (pluginFilter_SN8 && pluginFilter_type) {
      this.globalData.getBlackWhiteListError = false
      this.globalData.brandConfig[this.globalData.brand].pluginFilter_SN8 = pluginFilter_SN8
      this.globalData.brandConfig[this.globalData.brand].pluginFilter_type = pluginFilter_type
    }
    getBlackWhiteListTime = getBlackWhiteListTime + 1
    return new Promise((resolve, reject) => {
      requestService
        .request(
          'getBlackWhiteListApi',
          {
            reqId: getReqId(),
            stamp: getStamp(),
            appId: config.iotTerminalIid,
            //verType: __wxConfig.envVersion,
            verType: verType,
            ifGrayData: '1',
          },
          'POST'
        )
        .then((res) => {
          if (res.data.code == 0) {
            console.log('插件黑白名单：', res)
            this.globalData.brandConfig[this.globalData.brand].pluginFilter_SN8 = res.data.data.pluginFilter_SN8
            this.globalData.brandConfig[this.globalData.brand].pluginFilter_type = res.data.data.pluginFilter_type
            this.globalData.getBlackWhiteListError = false
            //存入本地缓存
            setPluginFilter(res.data.data.pluginFilter_SN8, res.data.data.pluginFilter_type)
            resolve(res.data)
          }
        })
        .catch((error) => {
          this.globalData.getBlackWhiteListError = true
          if (options.path != 'pages/index/index') {
            Dialog.confirm({
              zIndex: 10001,
              title: '系统繁忙，请稍后再试',
              showCancelButton: false,
            }).then((res) => {
              console.log(res)
              if (res.action == 'confirm') {
                wx.reLaunch({
                  url: homeIndex,
                })
              }
            })
          }
          reject(error)
        })
    })
  },

  globalData: {
    cssToken: '',
    isGetOpenId: false,
    isActionAppLaunch: false,
    wxExpiration: null,
    appSystemInfo: {},
    systemInfo: {}, // wx.getSystemInfo()数据
    wxSettingInfo: {}, // wx.getSetting()数据
    userInfo: null,
    userData: null,
    invitationCode: null,
    options: '',
    phoneNumber: '',
    currentHomeGroupId: '',
    currentRoomId: '', //默认房间
    currentRoomName: '', //默认房间名
    curFamilyInfo: '', //当前家庭信息
    remoteBindDeviceList: [], //数字遥控设备
    isCreateFamily: false, //是否是当前家庭主人
    applianceHomeData: {},
    isLogon: null,
    uid: '',
    ip: '',
    isIphoneX: false,
    isPx: false,
    isGetGrayList: false, //是否获取了灰度接口
    isCanAddDevice: true, //是否有权限添加设备
    share: '',
    inviteActiveEnter: false,
    activeInfo: {},
    fromMiniProgramData: {},
    hasAuthWritePhotosAlbum: false,
    ifAutoDiscover: false, // 是否启动首页自发现
    hasAuthLocation: false, //小程序未设置授权过位置权限 默认是无
    hasAuthBluetooth: false, //小程序未设置授权过蓝牙权限 默认是无
    statusBarHeight: '', //状态栏高
    navBarHeight: '', //标题栏高
    statusNavBarHeight: '', //状态栏高 + 标题栏高
    screenHeight: '', //屏幕高度
    openId: '',
    bleSessionSecret: '',
    deviceSessionId: '',
    dcpDeviceImgList: {},
    spidDeviceImgList: {},
    isUpdateAgreement: false, //是否已经更新协议
    wahinDecorator: {}, //华凌serve
    selectedProductCurrIndex: 1,
    selectedProductList: [], //选中回显到安排-维修等页面
    selectedInstall: [],
    tempProductSelectedList: [], //选择页面临时选中
    submittingOrderData: '', // 提交订单暂存的params数据
    currentOrder: '', //进度页面当前的工单数据
    maintenanceItem: {}, //故障类型所选的项
    maintenanceItemIndex: null, //故障类型所选的项下标
    machineList: [], //扫码之后的机器列表
    currOrderServiceOrderNo: '', //当前取消-更改时间订单信息
    currOrderServiceCancelFlag: false, //当前取消订单信息
    currOrderServiceChangeTime: '', //当前订单更改时间
    currOrderServiceChangeTwice: false, //当前订单可更改时间flag
    currOrderSurplusAppointNumber: 2, //当前订单可更改时间次数
    selectedAddrId: '', //我的地址 当前选定的地址id
    homeGrounpList: '', //家庭管理列表
    fromWxMiniProgramData: {}, //微信iot返回的数据
    checkHomeGrounpredDot: false, //是否需要查询家庭管理列表红点展示
    curUserMatchNetAcDevices: [], //当前用户下的配网绑定空调设备
    curUserBluetoothAcDevices: [], //当前用户下的蓝牙直连空调设备
    aesKey: '4567123489CDEFAB', //AES key
    aesIv: 'ABCD6789EF123412', //AES iv
    roomList: [], // 当前家庭的设备房间信息
    applianceItem: null, // 长按选中的设备信息
    applianceItemSupport: null, //小程序是否支持该设备
    webViewFlag: false, // 控制webview页面返回路径
    currentFamilyDeviceList: [], // 当前家庭设备列表
    subscriptionsSetting: [], //订阅信息授权的结果
    launch_source: '', //启动小程序的来源字段
    cid: '', //投放渠道cid参数
    curAddedApDeviceList: [], //当前已添加的ap配网设备
    noAuthApplianceCodeList: [], //不需要确权的设备applanceCode list
    unionid: '', //用户unionid
    globalDatascanObj: {}, //扫码下载页信息
    from_download_page: false, //是否从下载页过来
    canIUseDevicePanel: null, // 微信设备卡片灰度使用
    ifRefreshDeviceList: false, //是否需要同步刷新首页列表数据
    brand: '', //品牌标识
    brandConfig: '', //品牌配置文件
    worker: null, // 多线程 Worker
    privateKey: '', // msmart密钥
    privateKeyIntervalNum: '', //获取密钥定时
    ifRefreshHomeList: false, //是否需要同步刷新首页家庭数据
    cloudRegion: 0, //多云就近接入区域码
    cloudGlobalModule: '', //多云路由映射表
    userRegion: 0, //多云用户就近接入区域码
    linkupSDK: null, //配网SDK
    ifBackFromSuccess: false, // 从保存家庭信息页返回标识
    ifBackFromNetfail: false, // 从联网失败页返回标识
    gloabalWebSocket: null, //socket挂载
    cardSDK: '', //物模型模板
    applianceAuthList: [], //确权状态列表
    bathAuthTimer: null, //轮询确权状态标识
    selectTab: 0,
    noNetwork: false, //判断是否有网络
    appEnv: '', //宿主的环境
    appVersion: '', //宿主的版本号
    miniProgram: {}, //小程序信息
    isEnableHttpResponseLog: false, //开启hilog记录网络接口返回
    deviceId: '',
    performanceStartTime: new Date().getTime(),
    lastLinkupDevice: {},
  },
  scanDeviceMap: {},
  addDeviceInfo: {
    plainSn: '', //设备原始sn
    isWashingMachine: false, //是否是洗衣机
    msmartBleWrite: null, //蓝牙写入
    isCheckGray: false, //默认校验添加设备灰度权限
    combinedDeviceFlag: false, // 存在辅设备标识
  },
  apNoNetBurialPoint: {
    //ap无网埋点
    connectWifiDeviceHotspot: {},
  },
  combinedDeviceInfo: [
    // 组合设备的辅设备信息
    {
      sn: '',
      a0: '',
      combinedStatus: -1, // 组合状态：-1 -未组合，0-组合失败，1-成功，2-取消
    },
  ],
  combinedDeviceName: '', // 组合后新设备的名称
  combinedDeviceType: '', // 组合后新设备的品类
  combinedDeviceCode: '',
  composeApplianceList: [], // 存组合设备的信息，用来跳转插件页
  websocket: null,
  reqGetOpenIdChannel: 'app',
  setActionCheckingLog: CKECKING_LOG.setActionCheckingLog, // 设置配网日志
  setMethodCheckingLog: CKECKING_LOG.setMethodCheckingLog, // 上传配网事件日志
  setMethodFailedCheckingLog: CKECKING_LOG.setMethodFailedCheckingLog, // 上传配网事件失败日志
  uploadCheckingLog: CKECKING_LOG.uploadCheckingLog, // 上传配网页面动作日志
  onLoadCheckingLog: CKECKING_LOG.onLoadCheckingLog, // 配网页面进入埋点日志
  onUnloadCheckingLog: CKECKING_LOG.onUnloadCheckingLog, // 配网页面离开埋点日志
  checkNet: CKECKING_LOG.checkNetworkCheckingLog, //校验网络是否畅通
})
