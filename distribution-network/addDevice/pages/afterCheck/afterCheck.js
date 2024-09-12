// addDevice/pages/afterCheck/afterCheck.js
const app = getApp()
const log = require('m-miniCommonSDK/utils/log')
const netWordMixin = require('../../../assets/js/netWordMixin')
const addDeviceMixin = require('../../../assets/sdk/common/addDeviceMixin')
const getFamilyPermissionMixin = require('../../../assets/js/getFamilyPermissionMixin.js')
const requestService = app.getGlobalConfig().requestService
const brandStyle = require('../../../assets/js/brand.js')
import { getReqId, getStamp } from 'm-utilsdk/index'
import { getPluginUrl } from '../../../../utils/getPluginUrl'
import { getFullPageUrl } from 'm-miniCommonSDK/index'
import { isSupportPlugin, goTopluginPage } from '../../../../utils/pluginFilter'
import { burialPoint } from './assets/js/burialPoint'
import paths from '../../../assets/sdk/common/paths'
import { setPluginDeviceInfo } from '../../../../track/pluginTrack.js'
import { typesPreserveAfterCheckGuideByA0 } from '../../config/index'
import Dialog from 'm-ui/mx-dialog/dialog'
let timer

Page({
  behaviors: [addDeviceMixin, netWordMixin, getFamilyPermissionMixin],
  /**
   * 页面的初始数据
   */
  data: {
    deviceName: '',
    time: 60,
    deviceInfo: '',
    isStopCheck: false,
    backTo: '',
    checkGuideInfo: {
      mainConnectTypeUrl: '',
      mainConnectTypeDesc: '',
    },
    dialogStyle: brandStyle.config[app.globalData.brand].dialogStyle, //弹窗样式
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'], //顶部状态栏的高度
    randomCode: '', // 组合配网携带参数
    stopTemporarily: false, //暂不设置标识符
    isFromSubDeviceNetWork: false, // 是否来自子设备配网
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    getApp().onLoadCheckingLog()
    try {
      if (!app.globalData.linkupSDK) {
        app.globalData.linkupSDK = await require.async('../../../assets/sdk/index')
      }
      this.linkDeviceService = app.globalData.linkupSDK.commonIndex.linkDeviceService
    } catch (error) {
      console.error('linkupSDK fail', error)
    }
    this.data.brand = app.globalData.brand
    this.setData({
      brand: this.data.brand,
      isFromSubDeviceNetWork: options.fromSubDeviceNetwork ? true : false
    })
    burialPoint.afterCheckoutView()
    if (options.backTo) {
      this.setData({
        backTo: options.backTo,
      })
    }
    if (options.randomCode) { //组合配网
      this.setData({
        randomCode: options.randomCode // 组合配网新增
      })
    }

    if (options.identifierPage && options.identifierPage == 'linkDevice'||options.identifierPage && options.identifierPage == 'authTimeout' ) { //从联网进度页进入后确权页,或从联网进度页进入后确权页超时重试返回后确权页
      this.setData({
        stopTemporarily: true
      })
    }

    this.data.randomCode = options.randomCode || app.addDeviceInfo.randomCode || ''
    console.warn('afterCheck randomCode---', this.data.randomCode);
    let sn8 = app.addDeviceInfo.sn8 ? app.addDeviceInfo.sn8 : app.addDeviceInfo.cloudBackDeviceInfo.sn8
    // 组合配网新增逻辑
    let applianceCode, deviceInfo, type, deviceName, A0
    if (!!app.addDeviceInfo.cloudBackDeviceInfo) {
      deviceInfo = app && app.addDeviceInfo.cloudBackDeviceInfo
      applianceCode = app.addDeviceInfo.cloudBackDeviceInfo.applianceCode
      deviceName = app.addDeviceInfo.cloudBackDeviceInfo.deviceName ? app.addDeviceInfo.cloudBackDeviceInfo.deviceName
        : app.addDeviceInfo.cloudBackDeviceInfo.name
      type = app.addDeviceInfo.cloudBackDeviceInfo.type
      A0 = app.addDeviceInfo.cloudBackDeviceInfo.modelNumber ? app.addDeviceInfo.cloudBackDeviceInfo.modelNumber : ''
      app.addDeviceInfo.enterprise = app.addDeviceInfo.cloudBackDeviceInfo.enterpriseCode ? app.addDeviceInfo.cloudBackDeviceInfo.enterpriseCode : app.addDeviceInfo.enterprise
    } else if (this.data.isFromSubDeviceNetWork) { // 子设备配网新增逻辑
      deviceInfo = app.addDeviceInfo.currentGatewayInfo
      applianceCode = app.addDeviceInfo.currentGatewayInfo.applianceCode
      deviceName = app.addDeviceInfo.currentGatewayInfo.deviceName
      type = app.addDeviceInfo.currentGatewayInfo.type
      sn8 = app.addDeviceInfo.currentGatewayInfo.sn8
      A0 = ''
      app.addDeviceInfo.enterprise = app.addDeviceInfo.currentGatewayInfo.enterpriseCode
    } else { // 原有逻辑
      deviceInfo = app.addDeviceInfo
      applianceCode = app.addDeviceInfo.applianceCode
      deviceName = app.addDeviceInfo.deviceName
      type = app.addDeviceInfo.type
      A0 = ''
    }

    console.log('options---', options)
    console.log('后确权addDeviceinfo====', deviceInfo)
    this.logAddDivceInfo('添加设备参数', deviceInfo)
    this.data.deviceInfo = deviceInfo

    this.getLoginStatus().then(() => {
      if (app.globalData.isLogon) {
        this.checkFamilyPermission()
        this.timing()
        this.getGuideInfo(type, sn8, A0, app.addDeviceInfo.enterprise)
      } else {
        this.navToLogin()
      }
    })
    this.setData({
      deviceName: deviceName
    })

    if (applianceCode) {
      let ApplianceAuthTypeResp = await this.linkDeviceService.getApplianceAuthType(applianceCode)
      console.log('ApplianceAuthTypeResp', ApplianceAuthTypeResp)
      log.info('查询设备确权情况', ApplianceAuthTypeResp)
      const status = ApplianceAuthTypeResp.data.data.status
      if (status == 0) {
        console.log('后确权成功')
        log.info('后确权成功')
        clearInterval(timer)
        // 组合配网新增跳转
        app.addDeviceInfo.status = status // 组合设备更新确权状态
        let { combinedDeviceFlag } = app.addDeviceInfo // combinedDeviceFlag在首页会置为false
        if (combinedDeviceFlag) {
          wx.reLaunch({
            url: `${paths.linkCombinedDevice}?randomCode=${this.data.randomCode}`,
          })
        } else if (this.data.isFromSubDeviceNetWork) { // 子设备配网新增
          app.addDeviceInfo.currentGatewayInfo.status = status
          app.addDeviceInfo.isBackFromSubDeviceAfterCheck = true
          wx.navigateBack({
            delta: 1
          })
        } else if(this.data.stopTemporarily){
          wx.reLaunch({
            url:paths.addSuccess,
          })
        } else {
          setPluginDeviceInfo(deviceInfo)
          wx.navigateTo({
            url: getPluginUrl(type) + '?backTo=/pages/index/index&deviceInfo=' +
              deviceInfo,
            fail(error) {
              burialPoint.afterCheckJumpFail(app.addDeviceInfo)
              getApp().setMethodFailedCheckingLog('wx.navigateTo()', `跳转插件页异常。error=${JSON.stringify(error)}`)
              let page = getFullPageUrl()
              if (!page.includes('addDevice/pages/afterCheck/afterCheck')) {
                return
              }
              Dialog.confirm({
                title: '无法跳转设备控制页面',
                message: '未获取到控制页面，请检查网络后重试，若仍无法获取，请联系客服',
                confirmButtonText: '返回首页',
                confirmButtonColor: brandConfig.dialogStyle.confirmButtonColor,
                cancelButtonColor: brandConfig.dialogStyle.cancelButtonColor3,
                showCancelButton: false,
              }).then((res) => {
                if (res.action == 'confirm') {
                  burialPoint.afterCheckCancel(app.addDeviceInfo)
                  wx.reLaunch({
                    url: paths.index,
                  })
                }
              })
            },
          })
        }
      }
      if (status > 0) { // 兼容status=1,2,3的情况，等于3当做未确权处理(组合配网新增)
        //未确权
        console.log(`${status == 3 ? '不支持确权' : '未确权'}`)
        log.info(`${status == 3 ? '不支持确权' : '未确权'}`)
        await this.applianceAuthConfirm(applianceCode) //进入待确权
        this.sleep(10000).then((end) => {
          //新增10秒后在开始查询
          this.checkApplianceAuth(applianceCode, type, sn8, deviceInfo)
        })
      }
    }
  },

  getGuideInfo(type, sn8, A0, enterprise = '0000') {
    type = type.includes('0x') ? type.substr(2, 2) : type
    let code = sn8
    console.log('@module afterCheck.js\n@method getGuideInfo\n@desc 设备品类信息\n', { type, sn8, A0 })
    // 部分品类使用A0获取后确权指引
    if (typesPreserveAfterCheckGuideByA0.includes(type) && A0) {
      console.log('@module afterCheck.js\n@method getGuideInfo\n@desc 使用A0获取后确权指引\n', { type, A0 })
      code = A0
    }
    let reqData = {
      category: type,
      code: code,
      enterprise: enterprise,
    }
    console.log('reqDasta====', reqData)
    log.info('请求后确权指引参数', reqData)
    requestService
      .request('getIotConfirmInfoV2', reqData)
      .then((resp) => {
        console.log('确权指引信息', resp.data.data)
        log.info('后确权指引信息', reqData)
        if (!resp.data.data.confirmDesc && !resp.data.data.confirmImgUrl) {
          //未配置确权指引
          this.noGuide()
          return
        }
        this.setData({
          ['checkGuideInfo.mainConnectTypeDesc']: app.globalData.linkupSDK.commonIndex.commonUtils.guideDescFomat(resp.data.data.confirmDesc),
          ['checkGuideInfo.mainConnectTypeUrl']: resp.data.data.confirmImgUrl,
        })
      })
      .catch((error) => {
        console.log(error)
        log.info('请求后确权指引信息错误', error)
        if (error.data.code == 1) {
          this.noGuide()
        }
      })
  },

  timing() {
    this.data.time = 60
    timer = setInterval(() => {
      if (this.data.time > 0) {
        this.setData({
          time: this.data.time - 1,
        })
      }
      if (this.data.time == 0) {
        clearInterval(timer)
        console.log('后确权页面倒计时为0')
        // 子设备新增逻辑
        if (this.data.isFromSubDeviceNetWork) {
          this.subDevicehandleTimeOutFn()
          return;
        }
        let page = getFullPageUrl()
        if(page.includes('addDevice/pages/afterCheck/afterCheck')){
          let url = `/distribution-network/addDevice/pages/authTimeout/authTimeout`
          if(this.data.stopTemporarily){
            url = `/distribution-network/addDevice/pages/authTimeout/authTimeout?&identifierPage=linkDevice`
          }
          wx.redirectTo({
            url: url,
            fail:(error)=>{
              console.error('后确权页面倒计时为0跳转失败：',error)

            }
          })
        }
      }
    }, 1000)
  },

  // 子设备超时打开弹窗
  subDevicehandleTimeOutFn() {
    Dialog.confirm({
      title: '未在限定时间内完成设置，你还不能控制设备',
      confirmButtonText: '重新设置',
      cancelButtonText: '暂不设置',
      confirmButtonColor: this.data.dialogStyle.cancelButtonColor5,
      cancelButtonColor: this.data.dialogStyle.cancelButtonColor,
    })
      .then(async (res) => {
        if (res.action == 'confirm') {
          const { applianceCode, type, sn8 } = this.data.deviceInfo || {}
          this.timing()
          await this.applianceAuthConfirm(applianceCode) //进入待确权
          this.checkApplianceAuth(applianceCode, type, sn8, this.data.deviceInfo)
        }
      })
      .catch((error) => {
        if (error.action == 'cancel') {
          wx.navigateBack()
        }
      })
  },

  // getApplianceAuthType(applianceCode) {
  //   let reqData = {
  //     applianceCode: applianceCode,
  //     reqId: getReqId(),
  //     stamp: getStamp(),
  //   }
  //   return new Promise((resolve, reject) => {
  //     requestService
  //       .request('getApplianceAuthType', reqData)
  //       .then((resp) => {
  //         console.log('查询确权状态')
  //         getApp().setMethodCheckingLog('getApplianceAuthType')
  //         resolve(resp)
  //       })
  //       .catch((error) => {
  //         log.info('查询确权状态error', error)
  //         getApp().setMethodFailedCheckingLog(
  //           'getApplianceAuthType',
  //           `查询设备确权状态异常。error=${JSON.stringify(error)}`
  //         )
  //         reject(error)
  //       })
  //   })
  // },

  //进入待确权
  applianceAuthConfirm(applianceCode) {
    let reqData = {
      applianceCode: applianceCode,
      reqId: getReqId(),
      stamp: getStamp(),
    }
    return new Promise((resolve, reject) => {
      requestService
        .request('applianceAuthConfirm', reqData)
        .then((resp) => {
          console.log('进入待确权')
          log.info('成功进入待确权')
          getApp().setMethodCheckingLog('applianceAuthConfirm')
          resolve(resp)
        })
        .catch((error) => {
          log.info('成功进入待确权error', error)
          getApp().setMethodFailedCheckingLog(
            'applianceAuthConfirm',
            `进入确权状态异常异常。error=${JSON.stringify(error)}`
          )
          reject(error)
        })
    })
  },
  //校验是否完成后确权
  checkApplianceAuth(applianceCode, type, sn8, deviceInfo) {
    this.linkDeviceService.getApplianceAuthType(applianceCode)
      .then((resp2) => {
        if (resp2.data.data.status == 0) {
          console.log('后确权成功：', resp2)
          clearInterval(timer)
          // 组合配网新增跳转
          app.addDeviceInfo.status = resp2.data.data.status // 组合设备更新确权状态
          let { combinedDeviceFlag } = app.addDeviceInfo // combinedDeviceFlag在首页会置为false
          if (combinedDeviceFlag) {
            wx.reLaunch({
              url: `${paths.linkCombinedDevice}?randomCode=${this.data.randomCode}`,
            })
          } else if (this.data.isFromSubDeviceNetWork) { // 子设备配网新增
            app.addDeviceInfo.currentGatewayInfo.status = resp2.data.data.status
            app.addDeviceInfo.isBackFromSubDeviceAfterCheck = true
            wx.navigateBack({
              delta: 1
            })
          } else if(this.data.stopTemporarily){
            wx.reLaunch({
              url:paths.addSuccess,
            })
          } else {
            let type = app.addDeviceInfo.cloudBackDeviceInfo.type
            let A0 = app.addDeviceInfo.cloudBackDeviceInfo.modelNumber
              ? app.addDeviceInfo.cloudBackDeviceInfo.modelNumber
              : ''
            if (!isSupportPlugin(type, sn8, A0)) {
              //不支持
              wx.reLaunch({
                url: '/pages/unSupportDevice/unSupportDevice?deviceInfo=' + encodeURIComponent(deviceInfo),
              })
              getApp().setMethodCheckingLog('checkApplianceAuth')
              return
            }
            goTopluginPage(app.addDeviceInfo.cloudBackDeviceInfo, '/pages/index/index', true, 'afterCheck')
            getApp().setMethodCheckingLog('checkApplianceAuth')
          }
        } else {
          if (this.data.time != 0 && !this.data.isStopCheck) {
            this.sleep(5000).then((end) => {
              this.checkApplianceAuth(applianceCode, type, sn8, deviceInfo)
            })
          }
        }
      })
      .catch((error) => {
        getApp().setMethodFailedCheckingLog(
          'checkApplianceAuth',
          `校验是否完成后确权异常。error=${JSON.stringify(error)}`
        )
      })
  },
  sleep(milSec) {
    return new Promise((resolve) => {
      setTimeout(resolve, milSec)
    })
  },

  getLoginStatus() {
    console.log(app.globalData.isLogon, 'afterCheck getLoginStatus')
    return app
      .checkGlobalExpiration()
      .then((res) => {
        this.setData({
          isLogon: app.globalData.isLogon,
        })
      })
      .catch((err) => {
        app.globalData.isLogon = false
        this.setData({
          isLogin: app.globalData.isLogon,
        })
      })
  },
  navToLogin() {
    app.globalData.isLogon = false
    this.setData({
      isLogin: app.globalData.isLogon,
    })
    wx.navigateTo({
      url: paths.login,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { 
    app.globalData.ifRefreshDeviceList = true
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    getApp().onUnloadCheckingLog()

    clearInterval(timer)
    this.data.isStopCheck = true
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },
})
