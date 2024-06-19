// addDevice/pages/reLinkCombined/reLinkCombined.js
const app = getApp()
const imgBaseUrl = app.getGlobalConfig().imgBaseUrl
const requestService = app.getGlobalConfig().requestService
const addDeviceMixin = require('../../../assets/sdk/common/addDeviceMixin.js')
const paths = require('../../../assets/sdk/common/paths')
const timeNum = 60 //页面倒计时60秒
let timer4
import { getRandomString } from 'm-utilsdk/index'
import { showToast } from 'm-miniCommonSDK/index'
import { creatDeviceSessionId } from '../../../../utils/util'
import { burialPoint } from './assets/js/burialPoint'
import { goTopluginPage } from '../../../../utils/pluginFilter'
import { setPluginDeviceInfo } from '../../../../track/pluginTrack.js'
import Dialog from '../../../../miniprogram_npm/m-ui/mx-dialog/dialog'
import { api } from '../../../../api'
import { imgesList } from '../../../assets/js/shareImg.js'
import { getPluginUrl } from '../../../../utils/getPluginUrl'
const imgUrl = imgBaseUrl.url + '/shareImg/' + app.globalData.brand
const brandStyle = require('../../../assets/js/brand.js')

Page({
  behaviors: [addDeviceMixin],
  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'], //顶部状态栏的高度
    isIpx: app.globalData.isPx,
    combinedLoading: imgUrl + imgesList['combinedLoading'],
    deviceName: '',
    deviceImg: '',
    brand: '',
    brandConfig: app.globalData.brandConfig[app.globalData.brand],
    iconStyle: brandStyle.config[app.globalData.brand].iconStyle, //图标样式
    dialogStyle: brandStyle.config[app.globalData.brand].dialogStyle, //弹窗样式
    ishowDialog: false, //是否显示组件库弹窗
    titleContent: '',
    messageContent: '',
    time: timeNum,
    curStep: 0, // 组合联网状态
    progressList: [ // todo update brand.js
      {
        name: '设备联网中',
        color: 'rgba(255,255,255,0.60)',
        isFinish: false,
      },
      {
        name: '设备绑定中',
        color: '#4ECB5A',
        isFinish: false,
      },
      {
        name: '联网成功',
        color: '#4ECB5A',
        isFinish: true,
      },
      {
        name: '未组合，已独立绑定',
        color: '#4ECB5A',
        isFinish: true,
      }
    ],
  },
  /**
   * 不用于页面渲染的数据
   */
  randomCode: '', // 前端生成32位随机数
  deviceInfo: {}, // 当前联网设备信息
  deviceSessionId: '',
  onlineDeviceApplianceCode: '', //插件页传入
  /**
   * 初始化方法
   */
  async init() {
    this.deviceSessionId = app.globalData.deviceSessionId
      ? app.globalData.deviceSessionId
      : creatDeviceSessionId(app.globalData.userData.uid)
    console.log('一次配网事件标识', this.deviceSessionId)
    // 页面显示“设备联网中”
    this.setData({
      curStep: 0
    })
    let timeout = 5000 // 轮询接口间隔 毫秒
    // 生成随机数
    this.randomCode = getRandomString(32).toLocaleLowerCase()
    let singleHomeBindReqs = [{ // 绑定接口入参
      applianceType: app.addDeviceInfo.type,
      homegroupId: app.globalData.currentHomeGroupId,
      randomCode: this.randomCode,
      sn: app.addDeviceInfo.sn
    }]
    let activeMap = [] // 组合接口入参
    app.composeApplianceList.map(i => {
      activeMap.push(Object.assign({}, { sn: i.sn, a0: i.modelNumber, activeStatus: i.activeStatus }))
    })
    // step1：请求接口1-下发随机数
    try {
      let { data } = await this.distributeRandomCode(this.onlineDeviceApplianceCode, this.randomCode)
      console.log('distributeRandomCode', data)
      if (data.data.status != 0) {
        throw "status wrong"
      }
      app.addDeviceInfo.isDistribute = true
    } catch (error) {
      console.error('distributeRandomCode', error)
      app.addDeviceInfo.isDistribute = false
      this.goLinkDeviceFailPage(3003)
    }
    if (!app.addDeviceInfo.isDistribute) return
    // step2：开始60s计时
    this.timing()
    // step3：请求接口2-查询绑定状态
    this.againBatchGetAPExists([singleHomeBindReqs[0].sn], true, this.randomCode, timeout,
      () => {
        //页面计时已结束
        if (this.data.time == 0) {
          return
        }
        // 页面显示“设备绑定中”
        this.setData({
          curStep: 1
        })
        // step4：请求接口3-绑定离线设备
        this.batchBindDeviceToHome(singleHomeBindReqs).then(resp => {
          // step5：请求接口4-生成组合
          this.generateCombinedDevice(activeMap).then(res => {
            // 页面显示“联网成功”
            this.setData({
              curStep: 2
            })
            // 组合成功曝光埋点
            burialPoint.combinedDeviceView({
              pageId: 'combined_device_success_page',
              pageName: '组合成功页',
              entrance: app.addDeviceInfo.entrance,
              plainSn: app.addDeviceInfo.sn,
              sn8: app.addDeviceInfo.sn8,
              a0: app.addDeviceInfo.modelNumber,
              type: app.addDeviceInfo.type,
              deviceSessionId: this.deviceSessionId
            })
            if (timer4) {
              clearInterval(timer4)
            }
            console.warn('倒计时停留在: ', this.data.time)
            this.deviceInfo.applianceCode = res.data.applianceCode
            this.deviceInfo.name = res.data.applianceName
            this.deviceInfo.type = res.data.applianceType
            this.deviceInfo.homegroupId = app.globalData.currentHomeGroupId
          }).catch(err => {
            if (timer4) {
              clearInterval(timer4)
            }
            // 组合失败弹窗
            this.setData({
              time: this.data.time,// 记录当前倒计时数值
              ishowReDialog: true,
              titleContent: '创建组合设备失败，请确认手机网络通畅，并重试',
              messageContent: '',
            })
            console.warn('倒计时停留在: ', this.data.time)
            // 组合失败弹窗曝光埋点
            burialPoint.combinedFailDialogView({
              entrance: app.addDeviceInfo.entrance,
              plainSn: app.addDeviceInfo.sn,
              sn8: app.addDeviceInfo.sn8,
              a0: app.addDeviceInfo.modelNumber,
              type: app.addDeviceInfo.type,
              deviceSessionId: this.deviceSessionId
            })
          })
        }).catch(err => {
          this.goLinkDeviceFailPage(3005)
        })
      },
      (error) => {
        console.warn('调用@method againBatchGetAPExists\nisStopGetExists2=', this.data.isStopGetExists2)
        if (this.data.time == 0) {
          clearInterval(timer4)
          timer4 = null
          this.setData({
            isStopGetExists2: true// 停止轮询查询设备联网
          })
        } //页面计时已结束 
      })
  },
  /**
   * 点击完成
   */
  clickFinish() {
    app.addDeviceInfo.ifReLinkCombined = false
    if (this.data.curStep == 3) {
      wx.reLaunch({
        url: '/pages/index/index'
      })
    } else {
      // 当前连接设备置为在线
      app.composeApplianceList.filter(item => {
        if (item.onlineStatus == '0') {
          item.onlineStatus = '1'
        }
      })
      this.deviceInfo.composeApplianceList = app.composeApplianceList
      setPluginDeviceInfo(this.deviceInfo)
      // 跳转插件页
      goTopluginPage(this.deviceInfo, '/pages/index/index', true)
    }
  },
  /**
   * 点击左上角按钮
   */
  clickCancel() {
    this.setData({
      ishowCancleDialog: true,
      titleContent: `${this.data.deviceName}正在努力联网了，确定要放弃么？`,
      messageContent: '',
    })
    burialPoint.abandonAddDialogView({
      entrance: app.addDeviceInfo.entrance,
      plainSn: app.addDeviceInfo.sn,
      sn8: app.addDeviceInfo.sn8,
      a0: app.addDeviceInfo.modelNumber,
      type: app.addDeviceInfo.type,
      deviceSessionId: this.deviceSessionId
    })
  },
  /**
   * 弹窗按钮-再等等
   */
  clickWaitAminute() {
    burialPoint.clickWaitAminuteDialog({
      entrance: app.addDeviceInfo.entrance,
      plainSn: app.addDeviceInfo.sn,
      sn8: app.addDeviceInfo.sn8,
      a0: app.addDeviceInfo.modelNumber,
      type: app.addDeviceInfo.type,
      deviceSessionId: this.deviceSessionId
    })
    this.setData({
      ishowCancleDialog: false,
    })
  },
  /**
   * 弹窗按钮-放弃添加
   */
  discardAdd() {
    console.warn('点击 [放弃添加]')
    burialPoint.clickCancelAbandonDialog({
      entrance: app.addDeviceInfo.entrance,
      plainSn: app.addDeviceInfo.sn,
      sn8: app.addDeviceInfo.sn8,
      a0: app.addDeviceInfo.modelNumber,
      type: app.addDeviceInfo.type,
      deviceSessionId: this.deviceSessionId
    })
    if (timer4) clearInterval(timer4)
    this.setData({
      time: 0,
      isStopGetExists2: true, // 停止轮询查询设备联网
      ishowCancleDialog: false
    })
    if (this.data.curStep == 2) return
    // let pages = getCurrentPages() pages.length>1
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      from: 'reLinkCombined'
    })
    wx.navigateBack({
      url: getPluginUrl('0x4E'),
    })
  },
  /**
   * 弹窗按钮-重试
   */
  reCombine() {
    burialPoint.clickRetryFailDialog({
      entrance: app.addDeviceInfo.entrance,
      plainSn: app.addDeviceInfo.sn,
      sn8: app.addDeviceInfo.sn8,
      a0: app.addDeviceInfo.modelNumber,
      type: app.addDeviceInfo.type,
      deviceSessionId: this.deviceSessionId
    })
    this.init()
  },
  /**
   * 弹窗按钮-取消重试
   */
  cancelCombined() {
    burialPoint.clickCancelFailDialog({
      entrance: app.addDeviceInfo.entrance,
      plainSn: app.addDeviceInfo.sn,
      sn8: app.addDeviceInfo.sn8,
      a0: app.addDeviceInfo.modelNumber,
      type: app.addDeviceInfo.type,
      deviceSessionId: this.deviceSessionId
    })
    this.setData({
      curStep: 3 // 页面显示“未组合，已独立绑定”
    })
    // 组合失败曝光埋点
    burialPoint.combinedDeviceView({
      pageId: 'combined_device_failed_page',
      pageName: '组合设备失败页-组合失败',
      entrance: app.addDeviceInfo.entrance,
      plainSn: app.addDeviceInfo.sn,
      sn8: app.addDeviceInfo.sn8,
      a0: app.addDeviceInfo.modelNumber,
      type: app.addDeviceInfo.type,
      deviceSessionId: this.deviceSessionId
    })
  },
  /**
   * 页面倒计时
   */
  timing() {
    const this_ = this
    if (timer4) {
      clearInterval(timer4)
      this.setData({
        time: this_.data.time,
      })
    }
    console.warn('初始化time=', this.data.time)
    timer4 = setInterval(() => {
      if (this_.data.time > 0) {
        this_.setData({
          time: this_.data.time - 1,
        })
      }
      if (this_.data.time == 0) {
        this_.goLinkDeviceFailPage(3004)
      }
    }, 1000)
  },
  /**
   * 创建错误码并跳转失败页
   * @param {number} [errorCode] 错误码
   * @param {boolean} [isCustom] 是否定制
   */
  goLinkDeviceFailPage(errorCode, isCustom = true) {
    const this_ = this
    // step1: 清空计时器
    if (timer4) clearInterval(timer4)
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
    app.addDeviceInfo.ifReLinkCombined = true
    wx.navigateTo({
      url: `${paths.linkNetFail}?errorCode=${errorCode}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (!options.sn) {
      showToast('获取sn失败!')
      return
    }
    if (!options.applianceCode) {
      showToast('获取applianceCode失败!')
      return
    }
    if (!options.a0) {
      showToast('获取a0失败!')
      return
    }
    console.info('-------离线重连页 onLoad-------', app.composeApplianceList)
    console.log('reLinkCombined this->', this)
    app.globalData.ifBackFromNetfail = false
    let offlineDevice = app.composeApplianceList.filter(item => {
      return item.onlineStatus == '0'
    })
    offlineDevice = offlineDevice[0]
    app.addDeviceInfo = offlineDevice
    app.addDeviceInfo.entrance = 'plugin_page'
    app.addDeviceInfo.isDistribute = false
    // 获取在线设备code
    this.onlineDeviceApplianceCode = options.applianceCode
    // 获取离线sn和a0
    app.addDeviceInfo.sn = options.sn
    app.addDeviceInfo.modelNumber = options.a0
    console.log('当前连接设备', app.addDeviceInfo)
    this.data.brand = app.globalData.brand
    // 更新页面数据
    this.setData({
      time: timeNum,
      brand: this.data.brand,
      deviceName: app.addDeviceInfo.name,
      deviceImg: app.addDeviceInfo.deviceImg
    })
    // 页面曝光埋点
    burialPoint.combinedDeviceView({
      entrance: app.addDeviceInfo.entrance,
      plainSn: app.addDeviceInfo.sn,
      sn8: app.addDeviceInfo.sn8,
      a0: app.addDeviceInfo.modelNumber,
      type: app.addDeviceInfo.type,
      deviceSessionId: this.deviceSessionId
    })
    // 初始化
    this.init()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (app.globalData.ifBackFromNetfail) {
      console.log('-------离线重连页 onShow-------')
      this.setData({
        time: timeNum,
        isStopGetExists2: false
      })
      this.init()
      app.globalData.ifBackFromNetfail = false
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.data.isStopGetExists2 = true // 停止轮询查询设备联网
    if (timer4) clearInterval(timer4)
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