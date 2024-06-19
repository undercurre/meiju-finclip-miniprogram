// addDevice/pages/linkCombinedDevice/linkCombinedDevice.js
const app = getApp()
const imgBaseUrl = app.getGlobalConfig().imgBaseUrl
const addDeviceMixin = require('../../../assets/sdk/common/addDeviceMixin')
const paths = require('../../../assets/sdk/common/paths')
const log = require('m-miniCommonSDK/utils/log')
const timeNum = 80 //页面倒计时80秒
let timer3
import { getRandomString } from 'm-utilsdk/index'
import { burialPoint } from './assets/js/burialPoint'
import Dialog from '../../../../miniprogram_npm/m-ui/mx-dialog/dialog'
import { imgesList } from '../../../assets/js/shareImg.js'
const imgUrl = imgBaseUrl.url + '/shareImg/' + app.globalData.brand
const bluetooth = require('../../../../pages/common/mixins/bluetooth')
const brandStyle = require('../../../assets/js/brand.js')
Page({
  behaviors: [addDeviceMixin, bluetooth],
  /**
   * 页面的初始数据
   */
  data: {
    isIpx: app.globalData.isPx,
    deviceName: '',
    slaveName: '',
    deviceImg: '',
    slaveImg: '',
    addDeviceInfo: {},
    time: timeNum,
    brand: '',
    brandConfig: app.globalData.brandConfig[app.globalData.brand],
    dialogStyle: brandStyle.config[app.globalData.brand].dialogStyle, //弹窗样式
    iconStyle: brandStyle.config[app.globalData.brand].iconStyle, //图标样式
    ishowDialog: false, //是否显示组件库弹窗
    titleContent: '',
    messageContent: '',
    curStep: 0, //组合进度
    progressList: [
      {
        name: '设备联网中'
      },
      {
        name: '设备绑定中'
      }
    ],
    combinedLoading: imgUrl + imgesList['combinedLoading'],
  },
  /**
   * 不用于页面渲染的数据
   */
  randomCode: '',
  offlineReLink: '',
  /**
   * 初始化方法
   */
  async init() {
    const {
      apUtils
    } = app.addDeviceInfo
    const {
      sn,
      a0,
      type,
      deviceName,
      deviceImg
    } = app.combinedDeviceInfo[0]
    this.data.slaveName = deviceName
    this.data.slaveImg = deviceImg
    this.setData({
      slaveName: this.data.slaveName,
      slaveImg: this.data.slaveImg,
    })
    this.apUtils = apUtils //分包异步加载
    app.addDeviceInfo.linkStatus = 1 // 主设备联网状态设置为成功
    console.log('主设备参数 =====', app.addDeviceInfo)
    // this.logAddDivceInfo('主设备参数', app.addDeviceInfo)
    console.log('辅设备参数 =====', app.combinedDeviceInfo[0])
    // this.logAddDivceInfo('辅设备参数', app.combinedDeviceInfo[0])
    let timeout = 5000 // 轮询接口间隔 毫秒
    let singleHomeBindReqs = [
      {
        applianceType: '0x' + type,
        sn: sn,
        homegroupId: app.globalData.currentHomeGroupId,
        randomCode: this.randomCode
      }
    ]
    let activeMap = [
      {
        sn: app.addDeviceInfo.sn,
        a0: app.addDeviceInfo.a0,
        activeStatus: 1
      },
      {
        sn: sn,
        a0: a0,
        activeStatus: 1 // todo update 1
      }
    ]
    // v2.39新增 离线重连(Lite,Colmo)
    if (this.data.brandConfig.reCombinedFlag) {
      try {
        if (this.offlineReLink) {
          // 重新生成随机数
          let randomCodeNew = getRandomString(32).toLocaleLowerCase()
          await this.distributeRandomCode(app.addDeviceInfo.applianceCode, randomCodeNew)
          this.randomCode = randomCodeNew // 下发成功再更新随机数，用于接口请求
          app.addDeviceInfo.isDistribute = true
          console.log('下发随机数成功！');
        }
      } catch (error) {
        app.addDeviceInfo.isDistribute = false
        console.error('[下发随机数失败]', error);
      }
    }
    // step1：开始80s计时
    this.timing()
    this.setData({
      curStep: 0
    })
    console.log('---当前步骤---', this.data.curStep)
    app.combinedDeviceInfo[0].combinedStatus = -1 //辅设备组合状态 0-失败，1-成功，2-取消
    app.combinedDeviceInfo[0].bindStatus = 0 //辅设备绑定状态 0-失败，1-成功
    // step2：请求接口1-查询绑定状态
    this.againBatchGetAPExists([sn], true, this.randomCode, timeout,
      () => {
        if (this.data.time == 0) {
          return
        } //页面计时已结束
        this.setData({
          curStep: 1
        })
        console.log('---当前步骤---', this.data.curStep)
        // step3：请求接口2-绑定辅设备
        this.batchBindDeviceToHome(singleHomeBindReqs).then(resp => {
          app.combinedDeviceInfo[0].bindStatus = 1 //辅设备绑定状态 0-失败，1-成功
          app.combinedDeviceInfo[0].cloudBackDeviceInfo = resp.data.data.successList[0]
          // step4：请求接口3-生成组合
          this.generateCombinedDevice(activeMap).then(res => {
            if (timer3) {
              clearInterval(timer3)
              timer3 = null
            }
            console.warn('倒计时停在: ', this.data.time)
            app.combinedDeviceCode = res.data.applianceCode
            app.combinedDeviceName = res.data.applianceName
            app.combinedDeviceType = res.data.applianceType
            app.combinedDeviceInfo[0].combinedStatus = 1 //0-失败，1-成功，2-取消
            app.composeApplianceList.push(app.combinedDeviceInfo[0].cloudBackDeviceInfo)
            // setTimeout(() => {
            wx.reLaunch({
              url: paths.addSuccess
            })
            // }, 2000)
          }).catch(err => {
            app.combinedDeviceInfo[0].combinedStatus = 0 //辅设备绑定状态 0-失败，1-成功
            // 记录当前倒计时数值
            this.setData({
              time: this.data.time,
              ishowReDialog: true, // 组合失败弹窗
              titleContent: '创建组合设备失败，请确认手机网络通畅，并重试',
              messageContent: '',
            })
            if (timer3) {
              clearInterval(timer3)
              timer3 = null
            }
            console.error('当前倒计时: ', this.data.time)
            burialPoint.combinedFailDialogView({})
          })
        }).catch(err => {
          this.goLinkDeviceFailPage(3002)
        })
      },
      (error) => {
        console.warn('调用@method againBatchGetAPExists\nisStopGetExists2=', this.data.isStopGetExists2)
        if (this.data.time == 0) {
          clearInterval(timer3)
          timer3 = null
          this.setData({
            isStopGetExists2: true// 停止轮询查询设备联网
          })
        } //页面计时已结束
      })
  },

  /**
   * 创建错误码并跳转失败页
   * @param {number} [errorCode] 错误码
   * @param {boolean} [isCustom] 是否定制
   */
  goLinkDeviceFailPage(errorCode, isCustom = true) {
    const this_ = this
    // step1: 清空计时器
    if (timer3) {
      clearInterval(timer3)
      timer3 = null
    }
    this_.setData({
      isStopGetExists2: true// 停止轮询查询设备联网
    })
    // step2: 创建错误码
    if (errorCode) {
      app.addDeviceInfo.errorCode = this.creatErrorCode({
        errorCode: errorCode,
        isCustom: isCustom,
      })
    }
    // step3: 跳转页面
    app.combinedDeviceInfo[0].combinedStatus = 0 //0-失败，1-成功，2-取消
    wx.reLaunch({
      url: `${paths.linkCombinedFail}?errorCode=${errorCode}`
    })
  },
  /**
   * 点击左上角按钮
   */
  clickCancel() {
    const { deviceName } = app.combinedDeviceInfo[0]
    this.setData({
      ishowCancleDialog: true,
      titleContent: `${deviceName}正在努力联网了，确定要放弃么？`,
      messageContent: '',
    })
    burialPoint.abandonAddDialogView({})
  },
  /**
   * 弹窗按钮-再等等
   */
  clickWaitAminute() {
    this.setData({
      ishowCancleDialog: false,
    })
    burialPoint.clickWaitAminuteDialog({})
  },
  /**
   * 弹窗按钮-放弃添加
   */
  discardAdd() {
    console.warn('点击 [放弃添加]')
    if (timer3) {
      clearInterval(timer3)
      timer3 = null
    }
    this.setData({
      time: 0,
      isStopGetExists2: true, // 停止轮询查询设备联网
      ishowCancleDialog: false
    })
    if (app.combinedDeviceInfo[0].combinedStatus == 1) return
    app.combinedDeviceInfo[0].combinedStatus = 2
    burialPoint.clickCancelAbandonDialog({})
    wx.reLaunch({
      url: paths.linkCombinedFail,
    })
  },
  /**
   * 弹窗按钮-重试
   */
  reCombine() {
    burialPoint.clickRetryFailDialog()
    this.init()
  },
  /**
   * 弹窗按钮-取消重试
   */
  cancelCombined() {
    burialPoint.clickCancelFailDialog({})
    wx.reLaunch({
      url: paths.linkCombinedFail
    })
  },
  /**
   * 页面倒计时
   */
  timing() {
    const this_ = this
    if (timer3) {
      clearInterval(timer3)
      timer3 = null
      this.setData({
        time: this_.data.time,
      })
    }
    timer3 = setInterval(() => {
      if (this_.data.time > 0) {
        this_.setData({
          time: this_.data.time - 1,
        })
      }
      if (this_.data.time == 0) {
        this_.goLinkDeviceFailPage(3001)
      }
    }, 1000)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option) {
    console.info('-------组合进度页 onLoad-------', option)
    getApp().onLoadCheckingLog()
    if (option.randomCode) {
      app.addDeviceInfo.randomCode = option.randomCode
    }
    this.randomCode = option.randomCode || app.addDeviceInfo.randomCode || ''
    if (option.offlineReLink) { //离线重连
      this.offlineReLink = option.offlineReLink
    }
    this.data.brand = app.globalData.brand
    let {
      type,
      sn8,
    } = app.combinedDeviceInfo[0] // todo upadta
    // 获取辅设备名称和图片
    let typeAndName = app.globalData.linkupSDK.commonIndex.commonUtils.getDeviceImgAndName(type, sn8)
    app.combinedDeviceInfo[0].deviceName = typeAndName.deviceName
    app.combinedDeviceInfo[0].deviceImg = typeAndName.deviceImg
    // 更新数据
    this.setData({
      time: timeNum,
      brand: this.data.brand,
      addDeviceInfo: app.addDeviceInfo,
      deviceName: app.addDeviceInfo.deviceName,
      deviceImg: app.addDeviceInfo.deviceImg
    })
    // 页面曝光埋点
    burialPoint.combinedDeviceView({})
    // 初始化
    this.init()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      isStopGetExists2: true// 停止轮询查询设备联网
    })
    if (timer3) {
      clearInterval(timer3)
      timer3 = null
    }
    app.onUnloadCheckingLog()
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
