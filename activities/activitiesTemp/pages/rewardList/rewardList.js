// activities/activitiesTemplates/pages/InviteToFamily/InviteToFamily.js
// import {
//   mockData
// } from "../mockData.js"
import '../homePage/store.js'
import { actTemplateImgApi, actTemplateH5Addr } from '../../../../api.js'
import { getPageUrl } from '../../../../utils/util.js'
const actTempmetMethodsMixins = require('../actTempmetMethodsMixins.js')
const commonMixin = require('../commonMixin.js')
const app = getApp()
import { download } from '../path.js'
import { actEventClickTracking, actEventViewPageTracking } from '../../track/track.js'
//import { dialogText } from '../containerCommon.js'
Page({
  behaviors: [actTempmetMethodsMixins, commonMixin],
  /**
   * 页面的初始数据
   */
  data: {
    isLogon: false, // 是否登录标识
    imgUrl: actTemplateImgApi.url,
    moneySelectItem: {},
    cardSelectItem: {},
    containerList: [],
    pageSetting: {},
    cardPageSetting: {},
    cardContainerInfo: {},
    isShowCardDialog: false,
    isShowMoneyDialog: false,
    isShowLaunchAppDialog: false,
    isShowLogisticsDialog: false,
    logisticsData: {},
    slidingValidation: '',
    clickFlag: false, //防爆点击，
    captchaShow: false,
    captchaReload: false,
    verifyCode: '', //滑块验证校验uid，从mixin的captchaStatus方法获取
    isSliderValidation: '',
    actionGoAddressE: '',
    launchAppSelectData: {
      name: '页面标题', // 页面标题
      status: 1, // 活动状态，0未发布，1未开始，2进行中，3已结束，4已关闭，5待审核，6审核中
      type: 1, //页面类型(1、首页；2、普通页面；3、toast弹窗;4、按钮弹窗；5、图片或文案弹窗)
      popups: {
        closeButtonPosition: 0, //关闭按钮位置
        content: '', //弹窗文案
        height: 320, //弹窗高度
        imgUrl: '', //弹窗上传图片地址
        rollFlag: true, //滚动标识
        title: '', //弹窗标题
        width: 600, //弹窗宽度
        basicList: {
          //按钮组件列表
          content: '', // 按钮文案
          target: '', // 跳转类型
          targetUrl: '', // 跳转地址
        },
      },
    },
    // custom 1、领取，2、查看，3、重新领取
    //status rewardStatusList列表请查看containerMixins
    statusMap: {
      0: '1',
      1: '2',
    },
    options: {},
    gameId: '',
    appParameter: '',
    mockData: {
      res: {
        code: 0, //  0:返回成功；50：返回异常
        msg: '',
        data: {
          containerList: [],
          pageSetting: {},
          shareSetting: {
            shareForm: 1, //分享方式：1、H5链接；2、美居小程序
            title: '', //分享H5标题
            description: '', //分享H5内容
            imgUrl: '', //分享H5图片
            appletsTitle: '小程序标题', //小程序标题
            appletsImg:
              'http://fcmms.midea.com/cmimp_beta/file/newPrize/20200426/9fd469f8-4c12-4b4e-adfe-7e4e0f875acd.png', //小程序图片
          },
        },
      },
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInitOptions(options)
    console.log('rewardlist====', options)
    const { gameId, channelId, fromSite } = options
    const encodeWeexUrl = encodeURIComponent(
      actTemplateH5Addr.actHome.url + `?gameId=${gameId}&channelId=${channelId}&fromSite=${fromSite}`
    )
    const appHomePage = `midea-meiju://com.midea.meiju/main?type=jumpWebView&url=${encodeWeexUrl}&needNavi=1`
    console.log('app-param==========', appHomePage)
    this.setData({
      options: options,
      appParameter: appHomePage,
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
    this.initData()
  },

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
  actionViewCard(e) {
    const item = e.detail
    let { clickFlag } = this.data
    if (clickFlag) {
      return
    }
    this.setData({
      clickFlag: true,
    })
    const { basicItem } = item
    this.activityTrack(basicItem)
    console.log('card=====', item)
    //状态 0 未领取 1已领取 2已发放,3发放失败
    // 奖品类型：  类型列表请查看containerMixins
    if (item.type == '3' || item.type == '4') {
      //出现虚拟券弹窗
      this.getViewCardData(item['targetUrl'])
        .then((res) => {
          this.setData({
            cardPageSetting: res,
            cardContainerInfo: res.containerList.length ? res.containerList[0] : {},
            cardSelectItem: item,
            isShowCardDialog: true,
          })
          this.setData({
            clickFlag: false,
          })
        })
        .catch(() => {
          this.setData({
            clickFlag: false,
          })
        })
    } else if (item.type == '1') {
      this.setData({
        moneySelectItem: item,
        isShowMoneyDialog: true,
        clickFlag: false,
      })
    }
  },
  actionViewHelp(e) {
    const item = e.detail
    console.log('help-money=====', item)
    // 奖品类型： 0 实物奖品，1现金红包，2虚拟券 ？？？未知
    if (item.type == '2') {
      this.setData({
        cardSelectItem: item,
        isShowCardDialog: true,
      })
    } else if (item.type == '1') {
      this.setData({
        moneySelectItem: item,
        isShowMoneyDialog: true,
      })
    }
  },
  actionCardDialogClose() {
    console.log('actionCardDialogClose')
    this.setData({
      isShowCardDialog: false,
    })
  },
  actionMoneyDialogClose() {
    this.setData({
      isShowMoneyDialog: false,
    })
  },
  actionLaunchAppDialogError() {
    this.actionLaunchAppDialogClose()
    wx.navigateTo({
      url: download,
    })
  },
  actionLaunchAppDialogSuccess() {
    this.actionLaunchAppDialogClose()
  },
  getViewCardData(pageId) {
    return new Promise((resolve, reject) => {
      this.getGamePage_token(pageId, false)
        .then((res) => {
          let currData = res.data.data.pageSetting
          resolve(currData)
        })
        .catch((e) => {
          console.log('rewardlist---view-card-dialog========', e)
          reject(e)
        })
    })
  },
  //打开app弹框
  actionLaunchAppDialogClose() {
    this.setData({
      isShowLaunchAppDialog: false,
    })
  },
  actionLaunchAppDialog(e) {
    const { content, nameList, basicItem } = e.detail
    this.activityTrack(basicItem)
    this.data.launchAppSelectData.type = 4
    const basicList = [
      {
        target: 1, // 跳转类型
        targetUrl: '', // 跳转地址
        name: nameList[0],
      },
      {
        target: 4, // 跳转类型
        targetUrl: '', // 跳转地址
        name: nameList[1],
      },
    ]
    this.data.launchAppSelectData.popups.content = content
    this.data.launchAppSelectData.popups.basicList = basicList
    this.gameStatus().then((res) => {
      let game_finish = res.data.data.game_finish
      if (game_finish) {
        this.checkGameOver(true)
      } else {
        console.log('打开app-弹框传参', content, nameList)
        this.setData({
          isShowLaunchAppDialog: true,
          launchAppSelectData: this.data.launchAppSelectData,
        })
      }
    })
  },
  //活动按钮字节埋点
  activityTrack(basicItem) {
    const { options, pageSetting } = this.data
    options['path'] = getPageUrl()
    let selectContainer = pageSetting['containerList'][0]
    actEventClickTracking('activity_widget_event', options, pageSetting, selectContainer, basicItem)
  },
  actionLogisticsDialogClose() {
    this.setData({
      isShowLogisticsDialog: false,
    })
  },
  actionGoLogistics(e) {
    console.log(e)
    this.setData({
      logisticsData: e.detail,
      isShowLogisticsDialog: true,
    })
  },
  initData() {
    app
      .checkGlobalExpiration()
      .then((res) => {
        console.log('微信token未过期', res)
        this.setData({
          isLogon: app.globalData.isLogon,
        })
        if (!this.data.isLogon) {
          reject(false)
          return
        }
        this.getGamePage_token(this.data.options.pageId).then((res) => {
          let currData = res.data.data
          actEventViewPageTracking('page_view', this.data.options, res.data.data.pageSetting)
          this.setData({
            pageSetting: currData.pageSetting || {},
            containerList: currData.pageSetting.containerList || [],
          })
          this.getStatusUser()
          this.getValidation()
          this.getRiskUser()
          this.getIsLogoutUser()
          this.checkActStatus()
        })
      })
      .catch((e) => {
        console.warn('微信token已过期', e)
        this.setData({
          isLogon: app.globalData.isLogon,
        })
      })
  },
  // 自定义静态数据弹框使用
  setStaticDialog(type, content, basicList) {
    this.data.launchAppSelectData.isStatic = true
    this.data.launchAppSelectData.type = type
    this.data.launchAppSelectData.popups.content = content
    this.data.launchAppSelectData.popups.basicList = basicList
    this.setData({
      isShowLaunchAppDialog: true,
      launchAppSelectData: this.data.launchAppSelectData,
    })
  },
})
