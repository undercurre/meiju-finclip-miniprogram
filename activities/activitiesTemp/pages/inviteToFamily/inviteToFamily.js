// activities/activitiesTemplates/pages/InviteToFamily/InviteToFamily.js
import '../homePage/store.js'
import { mockData } from './mockData.js'

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
    beforeOnload: true,
    containerTypeMap: {
      1: 'normal', // "通用容器"
      2: 'my-reward', //"我的奖励卡片"
      3: 'invite-register', // "邀请注册"
      4: 'invite-register', //"邀请绑定设备"
      5: 'join-family', //"邀请加入家庭",
    },
    inviteResultDescripMap: {
      0: '您已成功加入',
      2001: '成功加入，本次活动已加入过家庭，不获得奖励',
      2002: '加入失败，该家庭成员数已达到上限～',
      2003: '加入失败，该家庭不存在或已被删除！',
      2004: '抱歉，加入家庭失败！',
      2005: '您已是该家庭成员，不能重复加入',
      2006: '加入失败，您的家庭数量已达到上限～',
    },
    invitationCodeMap: {
      0: '加入成功',
      9999: '加入失败',
      2019: '家庭数超标',
      2024: '人数数超标',
      1205: '家庭不存在',
      1201: '重复加入',
      1217: '抱歉，邀请已失效！',
    },
    containerList: [],
    pageSetting: {},
    shareSetting: {},
    basicSetting: {},
    isSliderValidation: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      statusNavBarHeight: app.globalData.statusNavBarHeight,
    })
    app.globalData.invitationCode = hasKey(options, 'invitationCode') ? options.invitationCode : ''
    console.log('mockData:', mockData)
    // this.setData({
    //   options: options,
    //   pageSetting: mockData.res.data.pageSetting || {},
    //   containerList: mockData.res.data.pageSetting.containerList || [],
    //   shareSetting: mockData.res.data.shareSetting || {},
    //   basicSetting: mockData.res.data.basicSetting || {},
    //   selectData: mockData.res.data.pageSetting || {}
    // })
    this.data.beforeOnload = false
    // 处理options
    this.getInitOptions(options)
    this.initpage()
  },

  initpage() {
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
          this.checkIfActNotStart() //校验活动是否开始
          this.getRiskUser()
          this.getValidation()
          this.getIsLogoutUser()
          actEventViewPageTracking('page_view', options, res.data.data.pageSetting)
        })
      })
      .catch((e) => {
        console.warn('微信token已过期', e)
        this.setData({
          isLogon: app.globalData.isLogon,
        })
        this.data.beforeOnload = true
        const pageId = hasKey(options, 'pageId') ? options.pageId : ''
        this.getGamePage(pageId)
          .then((res) => {
            console.log('inviteToFamily fail res', res)

            this.checkIfActNotStart() //校验活动是否开始
            actEventViewPageTracking('page_view', options, res.data.data.pageSetting)
          })
          .catch({})
        wx.hideLoading()
      })
  },
  refreshPage_token() {
    const { options } = this.data
    const pageId = hasKey(options, 'pageId') ? options.pageId : ''
    console.log('pageId return', pageId)
    this.getGamePage_token(pageId).then((res) => {
      this.checkIfActNotStart()
      this.getRiskUser()
      this.getValidation()
      this.getIsLogoutUser()
      actEventViewPageTracking('page_view', options, res.data.data.pageSetting)
    })
  },
  refreshPageReward_token(isUpdata = true) {
    const { options } = this.data
    const pageId = hasKey(options, 'pageId') ? options.pageId : ''
    console.log('pageId return', pageId)
    this.getGamePage_token(pageId, isUpdata).then((res) => {
      this.checkIfActNotStart()
      this.getRiskUser()
      this.getValidation()
      this.getIsLogoutUser()
      actEventViewPageTracking('page_view', options, res.data.data.pageSetting)
      this.setData({
        shareSetting: res.data.data.shareSetting || {},
        pageSetting: res.data.data.pageSetting || {},
        basicSetting: res.data.data.basicSetting || {},
        userInfo: res.data.data.userInfo || {},
        containerList: res.data.data.pageSetting.containerList || [],
      })
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
  // --新用户注册相关end--

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
})
