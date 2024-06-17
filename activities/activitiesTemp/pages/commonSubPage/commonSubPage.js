// activities/activitiesTemplates/pages/InviteToFamily/InviteToFamily.js

import { actTemplateHome, actTemplateBeinvite } from '../path.js'
import { hasKey } from 'm-utilsdk/index'
import { actEventViewPageTracking } from '../../track/track.js'

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
    // navTitle: "活动模板页面",
    statusMap: {
      0: '您当前帐号存在异常，详情请查看活动规则或咨询客服，谢谢～',
      1: '来晚啦！活动已结束～',
      2: '弹窗内容，默认最多可显示两行文字。运营需控制说明字数。',
      3: '请将App升级至最新版本后才可参与活动～',
    },
    containerList: [],
    pageSetting: {},
    shareSetting: {},
    actionItem: {},
    fromShare: false,
    beforeOnload: true,
    isFirstInit: false,
    isAcceptButton: false, //是否是接受按钮
    isRegister: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 跳转app页面的活动首页地址
    const appHomePage = this.getAppH5ActUrl()
    this.data.beforeOnload = false
    // console.log("活动主页onLoad",options)
    this.setData({
      appParameterH5Home: appHomePage,
      statusNavBarHeight: app.globalData.statusNavBarHeight,
    })
    this.getInitOptions(options)
    // this.data.beforeOnload = false
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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
        this.getGamePage_token(this.data.options.pageId, false).then((res) => {
          actEventViewPageTracking('page_view', options, res.data.data.pageSetting)
          this.setData({
            shareSetting: res.data.data.shareSetting || {},
            pageSetting: res.data.data.pageSetting || {},
            basicSetting: res.data.data.basicSetting || {},
            userInfo: res.data.data.userInfo || {},
            containerList: res.data.data.pageSetting.containerList || [],
          })
        })
      })
      .catch((err) => {
        console.warn('微信token已过期', err)
        this.setData({
          isLogon: app.globalData.isLogon,
        })
      })
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
  onShareAppMessage: function (e) {
    this.activityShareTrack(e)
    const { appletsTitle, appletsImg } = this.data.shareSetting
    const { id } = this.data.userInfo
    const { gameId, channelId } = this.data.options
    const hotzoonTitle =
      e.from == 'button' && e.target.dataset.item.appletsTitle ? e.target.dataset.item.appletsTitle : appletsTitle
    const hotzoonImg =
      e.from == 'button' && e.target.dataset.item.appletsImg ? e.target.dataset.item.appletsImg : appletsImg

    const pageId = e.from == 'button' && !hasKey(e.target.dataset, 'normalshare') ? e.target.dataset.item.targetUrl : ''
    const buttonTypePath = `${actTemplateBeinvite}?pageId=${pageId}&inviteUserId=${id}&gameId=${gameId}&channelId=${channelId}&fromSite=1&os=1`
    const rightSharePath = `${actTemplateHome}?gameId=${gameId}&channelId=${channelId}&fromSite=1&os=1`

    const path = e.from == 'button' && !hasKey(e.target.dataset, 'normalshare') ? buttonTypePath : rightSharePath
    // const sharePath = this.getSharePath(e.target.dataset.selectContainer)

    console.log('分享地址1', e, gameId, channelId, pageId, appletsTitle, appletsImg, path)
    this.data.fromShare = true
    this.actionDialogClose()

    return {
      title: e.from == 'button' ? hotzoonTitle : appletsTitle,
      imageUrl: e.from == 'button' ? hotzoonImg : appletsImg,
      path: path,
    }
  },
  getSharePath(selectContainer) {
    if (selectContainer.type == 1 || selectContainer.type == 2) {
      return actTemplateBeinvite
    }
  },
  init() {
    const { options } = this.data
    // const gameId = hasKey(options,"gameId") ? options:'10131'
    if (this.data.isMock) return
    if (app.globalData.isLogon) {
      this.getGamePageInit_token()
        .then((res) => {
          // 浏览事件埋点
          this.getRiskUser()
          actEventViewPageTracking('page_view', options, res.data.data.pageSetting)
          this.checkActStatus()
        })
        .catch(() => {
          // 浏览事件埋点
          //actEventViewPageTracking('page_view', options, res.data.data.pageSetting)
          // this.checkActStatus()
        })
    } else {
      this.getGamePageInit()
        .then((res) => {
          this.checkActStatus()
          // 浏览事件埋点
          actEventViewPageTracking('page_view', options, res.data.data.pageSetting)
        })
        .catch(() => {
          this.checkActStatus()
          // 浏览事件埋点
          //actEventViewPageTracking('page_view', options, res.data.data.pageSetting)
        })
    }
  },
  refreshData() {},
  // --新用户注册相关start--
  actionGetphonenumber() {
    wx.navigateTo({
      url: '../../../../pages/login/login',
    })
  },
  // --新用户注册相关end--
})
