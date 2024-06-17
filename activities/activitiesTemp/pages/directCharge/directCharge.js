// activities/activitiesTemplates/pages/beInvite.js

import { actTemplateImgApi } from '../../../../api.js'
import { hasKey, Base64 } from 'm-utilsdk/index'
import { getPageUrl } from '../../../../utils/util.js'
import { actEventClickTracking, actEventViewPageTracking } from '../../track/track.js'
import { dialogText, errorMsg } from '../containerCommon.js'
const actTempmetMethodsMixins = require('../actTempmetMethodsMixins.js')
const commonMixin = require('../commonMixin.js')
const app = getApp()
Page({
  behaviors: [actTempmetMethodsMixins, commonMixin],
  /**
   * 页面的初始数据
   */
  data: {
    isLogon: false, // 是否登录标识
    isOldUser: false,
    // isOldUser:false,   // 登录接口失败 测试未登录状态
    joinBtnClicked: false, // 邀请接口点击与否
    beforeOnload: true,
    containerTypeMap: {
      1: 'normal', // "通用容器"
    },
    basicItemStatusMap: {
      0: '25', //确认领取
      2: '27', //领取成功
      3: '23', //重新领取
      5: '26', //发放中
    },
    containerList: [],
    pageSetting: {},
    shareSetting: {},
    basicSetting: {},
    currAwardsInfo: {},
    imgUrl: actTemplateImgApi.url,
    mobile: '17620739013',
    regExp: {},
    errorCharge: errorMsg.errorCharge,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options: options,
    })
    this.data.beforeOnload = false
    this.setData({
      statusNavBarHeight: app.globalData.statusNavBarHeight,
    })
    // 处理options
    this.getInitOptions(options)
    this.initpage()
  },

  initpage() {
    console.info('2.14.7,登录改造，最后一版')
    const { options } = this.data
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
        console.log('options...', options)
        this.data.beforeOnload = true
        const pageId = hasKey(options, 'pageId') ? options.pageId : ''
        this.getGamePage_token(pageId).then((res) => {
          this.getCurrAwardsInfo()
          this.setData({
            mobile: this.data.currAwardsInfo.userMobile
              ? Base64.decode(this.data.currAwardsInfo.userMobile)
              : app.globalData.userData.mdata.userInfo.mobile,
          })
          console.log('beinvite res', res)
          this.getRiskUser()
          this.getValidation()
          this.getIsLogoutUser()
          actEventViewPageTracking('page_view', options, res.data.data.pageSetting)
        })
      })
      .catch((err) => {
        console.warn('微信token已过期', err)
        this.setData({
          isLogon: app.globalData.isLogon,
        })
        this.data.beforeOnload = true
        const pageId = hasKey(options, 'pageId') ? options.pageId : ''
        this.getGamePage(pageId)
          .then((res) => {
            console.log('beinvite fail res', res)
            actEventViewPageTracking('page_view', options, res.data.data.pageSetting)
          })
          .catch({})
        wx.hideLoading()
      })
  },
  getCurrAwardsInfo() {
    let { prizeId } = this.data.options
    let { awardsList } = this.data.containerList[0].data
    let arr = awardsList.filter((item) => {
      return item.prizeId == prizeId
    })
    if (arr.length == 0) return
    this.setData({
      currAwardsInfo: arr[0],
    })
  },
  refreshPage_token() {
    const { options } = this.data
    const pageId = hasKey(options, 'pageId') ? options.pageId : ''
    console.log('pageId return', pageId)
    this.getGamePage_token(pageId).then((res) => {
      this.getCurrAwardsInfo()
      this.getValidation()
      this.setData({
        mobile: this.data.currAwardsInfo.userMobile
          ? Base64.decode(this.data.currAwardsInfo.userMobile)
          : app.globalData.userData.mdata.userInfo.mobile,
      })
      actEventViewPageTracking('page_view', options, res.data.data.pageSetting)
    })
  },
  refreshPageReward_token(isUpdata = true) {
    const { options } = this.data
    const pageId = hasKey(options, 'pageId') ? options.pageId : ''
    console.log('pageId return', pageId)
    this.getGamePage_token(pageId, isUpdata).then((res) => {
      this.setData({
        shareSetting: res.data.data.shareSetting || {},
        pageSetting: res.data.data.pageSetting || {},
        basicSetting: res.data.data.basicSetting || {},
        userInfo: res.data.data.userInfo || {},
        containerList: res.data.data.pageSetting.containerList || [],
      })
      this.getCurrAwardsInfo()
      this.getValidation()
      this.setData({
        mobile: this.data.currAwardsInfo.userMobile
          ? Base64.decode(this.data.currAwardsInfo.userMobile)
          : app.globalData.userData.mdata.userInfo.mobile,
      })
      actEventViewPageTracking('page_view', options, res.data.data.pageSetting)
    })
  },
  refreshPage() {
    const { options } = this.data
    const pageId = hasKey(options, 'pageId') ? options.pageId : ''
    this.getGamePage(pageId)
      .then((res) => {
        console.log('beinvite fail res', res)
        actEventViewPageTracking('page_view', options, res.data.data.pageSetting)
      })
      .catch({})
  },

  // --新用户注册相关start--
  actionGetphonenumber() {
    wx.navigateTo({
      url: '../../../../pages/login/login',
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
    if (this.data.beforeOnload && !this.data.dialogShow) {
      if (app.globalData.isLogon) {
        this.refreshPage_token()
      } else {
        this.refreshPage()
      }
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},
  //活动按钮字节埋点
  activityTrack(basicItem) {
    const { options, pageSetting } = this.data
    options['path'] = getPageUrl()
    let selectContainer = pageSetting['containerList'][0]
    actEventClickTracking('activity_widget_event', options, pageSetting, selectContainer, basicItem)
  },
  //输入手机号回调
  inputMobile(e) {
    this.setData({
      mobile: e.detail.value,
    })
  },
  //验证手机号是否正确
  mobileTest(mobile) {
    return new RegExp(/(^((13|14|15|16|17|18|19)[0-9]{1}\d{8})|((166|199|198)[0-9]{1}\d{7})$)/).test(mobile)
  },
  submit(e) {
    let item = e.currentTarget.dataset.item
    let selectContainer = e.currentTarget.dataset.selectcontainer
    let { currAwardsInfo } = this.data
    //发放中和发放成功不能点击
    if (!(currAwardsInfo.status == 0 || currAwardsInfo.status == 3)) return
    let mobile = this.data.mobile
    if (!this.mobileTest(mobile)) {
      //手机号码不正确
      this.setToast(errorMsg.errorMobile)
      return
    } else {
      this.activityTrack(item)
      this.actionLaunchApp(item, selectContainer)
    }
  },
  //确认弹窗
  actionLaunchApp(basicItem, selectContainer) {
    let content = '请确认手机号是否填写正确，一旦充值成功不予退还哦~',
      contentTitle = `你将为手机号：${this.data.mobile}充值权益`,
      nameList = [dialogText.cancel, dialogText.confirm]
    this.data.selectPageObj.isStatic = true
    this.data.selectPageObj.type = 6
    const basicList = [
      {
        target: 1, // 跳转类型 详细类型请看actTempmetMethodsMixins的actionDialogBtn方法
        targetUrl: '', // 跳转地址
        name: nameList[0],
      },
      {
        target: 'customizeCallBack', // 跳转类型 详细类型请看actTempmetMethodsMixins的actionDialogBtn方法
        targetUrl: '', // 跳转地址
        name: nameList[1],
      },
    ]
    let detail = {
      prizeId: this.data.options.prizeId,
      mobile: Base64.encode(this.data.mobile),
      awardsInfo: this.data.currAwardsInfo,
      from: 'charge',
      basicItem: basicItem,
      selectContainer: selectContainer,
    }
    console.log('打开app-弹框传参', content, nameList)
    this.data.selectPageObj.popups.content = content
    this.data.selectPageObj.popups.contentTitle = contentTitle
    this.data.selectPageObj.popups.basicList = basicList
    this.data.selectPageObj.popups.confirmFunc = () => {
      this.actionReceive({ detail })
    }
    this.setData({
      'dialogComponentInitData.isShowDialog': true,
      selectData: this.data.selectPageObj,
    })
  },
})
