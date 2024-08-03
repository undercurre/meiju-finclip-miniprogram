// pages/about/about.js
const app = getApp() //获取应用实例
import { urlParamsJoin, formatTime } from 'm-utilsdk/index'
import { showToast, getFullPageUrl } from 'm-miniCommonSDK/index'
import { privacyApi } from '../../../../api'
import { clickEventTracking } from '../../../../track/track.js'
import { requestService, rangersBurialPoint } from '../../../../utils/requestService'
import { setIsAutoLogin, clearStorageSync } from '../../../../utils/redis.js'
// import { showToast } from '../../../../utils/util.js'
import { baseImgApi } from '../../../../api'

import Dialog from 'm-ui/mx-dialog/dialog'
import config from '../../../../config.js'
import loginMethods from '../../../../globalCommon/js/loginRegister.js'
const domain = config.privacyDomain.prod
Page({
  /**
   * 页面的初始数据
   */
  data: {
    agreementList: [
      {
        id: 'collected_userinfo_weixin_lite',
        name: '已收集个人信息清单',
        url: {
          dev: `${domain}/mobile/agreement/?system=meiju_lite_app&agreement_type=collected_userinfo_app`,
          sit: `${domain}/mobile/agreement/?system=meiju_lite_app&agreement_type=collected_userinfo_app`,
          prod: `${domain}/mobile/agreement/?system=meiju_lite_app&agreement_type=collected_userinfo_app`,
        },
        trackData: {
          widget_id: 'click_collectpion_list',
          widget_name: '已收集个人信息清单',
        },
      },
      {
        id: 'shared_userinfo_weixin_lite',
        name: '与第三方共享个人信息清单',
        url: {
          dev: `${domain}/mobile/agreement/?system=meiju_lite_app&agreement_type=shared_userinfo_app`,
          sit: `${domain}/mobile/agreement/?system=meiju_lite_app&agreement_type=shared_userinfo_app`,
          prod: `${domain}/mobile/agreement/?system=meiju_lite_app&agreement_type=shared_userinfo_app`,
        },
        trackData: {
          widget_id: 'click_share_list',
          widget_name: '与第三方共享个人信息清单',
        },
      },
      {
        id: 'per_list_weixin_lite',
        name: '美的美居权限列表',
        url: {
          dev: `${domain}/mobile/agreement/?system=meijuapp&agreement_type=per_list`,
          sit: `${domain}/mobile/agreement/?system=meijuapp&agreement_type=per_list`,
          prod: `${domain}/mobile/agreement/?system=meiju_lite_app&agreement_type=per_list_weixin_lite`,
        },
        trackData: {
          widget_id: 'click_rights_list',
          widget_name: '美的美居权限列表',
        },
      },
    ],
    isLogon: app.globalData.isLogon,
    baseImgUrl: baseImgApi.url,
  },
  backPage() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack()
    } else {
      wx.switchTab({
        url: '/pages/mytab/mytab',
      })
    }
  },
  //注销账号
  goToLoginOut() {
    this.userBehaviorEventTrack('click_account_cancellation', '注销帐号')
    this.getJwtToken()
  },
  //埋点
  userBehaviorEventTrack(widget_id, widget_name) {
    rangersBurialPoint('user_behavior_event', {
      module: '个人中心',
      page_id: 'page_personal', //参考接口请求参数“pageId”
      page_name: '设置', //当前页面的标题，顶部的title
      page_path: getFullPageUrl(), //当前页面的URL
      widget_id: widget_id,
      widget_name: widget_name,
      page_module: '设置',
    })
  },
  getJwtToken() {
    const wxAccessToken = app.globalData.wxAccessToken
    requestService
      .request('getJwtToken', { wxAccessToken })
      .then((res) => {
        const data = res.data
        if (+data.code === 0) {
          const host = `${config.privacyDomain[config.environment]}`
          const url = `${host}/mobile/cancellation/?system=midea_app_lite&jwt_token=${data.data}&redirect_uri=&is_switch_tab=true`
          wx.navigateTo({
            url: `/pages/webView/webView?webViewUrl=${encodeURIComponent(url)}&needCheckLogStatus=true`,
          })
        } else {
          showToast('程序员小哥哥植发去了，请稍后重试')
        }
      })
      .catch((e) => {
        console.log(e, 'logout')
      })
  },
  jumpAccountSafe() {
    if (!this.data.isLogon) {
      this.goLogin()
    } else {
      wx.navigateTo({
        url: '../../../../pages/accountSafe/accountSafe',
      })
    }
  },
  jumpPersonInfoList() {
    this.jumpWebView(0)
  },
  jumpThridPaList() {
    this.jumpWebView(1)
  },
  jumpWebView(type) {
    let agreementData = this.data.agreementList[type]
    const trackData = {
      module: '个人中心',
      page_id: 'page_about_meiju',
      page_name: '设置',
    }
    clickEventTracking('user_behavior_event', null, Object.assign({}, trackData, agreementData.trackData))
    if (!agreementData.id) return
    let currLink = agreementData.url[privacyApi.environment]
    let encodeLink = encodeURIComponent(currLink)
    let currUrl = urlParamsJoin('/pages/webView/webView', {
      webViewUrl: encodeLink,
      pageTitle: agreementData.name,
    })
    console.log('新C4A隐私条款链接===', currUrl)
    wx.navigateTo({
      url: currUrl,
    })
    if (type == 0) {
    } else {
    }
  },
  // 退出登录
  switchAccount: function () {
    clickEventTracking('user_behavior_event', 'switchAccount')
    let that = this
    Dialog.confirm({
      zIndex: 10001,
      context: this,
      title: '确定要退出登录吗？',
    }).then((res) => {
      if (res.action == 'confirm') {
        loginMethods.logout()
        that.setData({
          isLogon: false,
        })
        wx.switchTab({
          url: '../../../../pages/index/index',
        })
      }
    })
    this.clickBurdPoint('switch_account_mytab')
  },
  /**
   * 点击事件埋点
   */
  clickBurdPoint(clickType) {
    // wx.reportAnalytics('count_click_list', {
    // click_type: clickType,
    // click_time: formatTime(new Date()),
    // })
  },
  goPrivacy(e) {
    let agreementData = e.currentTarget.dataset.agreementdata
    const trackData = {
      module: '个人中心',
      page_id: 'page_about_meiju',
      page_name: '设置',
    }
    clickEventTracking('user_behavior_event', null, Object.assign({}, trackData, agreementData.trackData))
    if (!agreementData.id) return
    let currLink = agreementData.url[privacyApi.environment]
    let encodeLink = encodeURIComponent(currLink)
    let currUrl = urlParamsJoin('/pages/webView/webView', {
      webViewUrl: encodeLink,
      pageTitle: agreementData.name,
    })
    console.log('新C4A隐私条款链接===', currUrl)
    wx.navigateTo({
      url: currUrl,
    })
  },
  checkLoginStatus() {
    app
      .checkGlobalExpiration()
      .then(() => {
        this.setData({
          isLogin: app.globalData.isLogon,
        })
      })
      .catch((err) => {
        console.log(err)
        app.globalData.isLogon = false
        this.setData({
          isLogin: app.globalData.isLogon,
        })
      })
  },
  withdrawPrivacyAuth() {
    const context = this
    Dialog.confirm({
      zIndex: 10001,
      context: this,
      message: '撤回隐私协议授权将自动退出登录，确定要撤回吗？',
    })
      .then((res) => {
        context.changeWithdrowModal(res)
      })
      .catch((error) => {
        context.changeWithdrowModal(error)
      })
    clickEventTracking('user_page_view', null, {
      module: '个人中心',
      page_id: 'popups_recall_privacy',
      page_name: '撤回隐私协议确认弹窗',
    })
    clickEventTracking('user_behavior_event', null, {
      module: '个人中心',
      page_id: 'page_about_meiju',
      page_name: '设置',
      widget_name: '撤回隐私协议',
      widget_id: 'click_recall_privacy',
    })
  },
  // 撤销授权协议
  changeWithdrowModal(e) {
    const action = e.action
    if (action === 'confirm') {
      clickEventTracking('user_behavior_event', null, {
        module: '个人中心',
        page_id: 'popups_recall_privacy',
        page_name: '撤回隐私协议确认弹窗',
        widget_name: '确定',
        widget_id: 'click_confirm',
      })
      wx.showLoading({
        mask: true,
        title: '加载中',
      })
      setTimeout(() => {
        this.cancelAgreeAgreement()
      }, 1000)
    }
    if (action === 'cancel') {
      clickEventTracking('user_behavior_event', null, {
        module: '个人中心',
        page_id: 'popups_recall_privacy',
        page_name: '撤回隐私协议确认弹窗',
        widget_name: '取消',
        widget_id: 'click_cancel',
      })
    }
  },
  // 撤回授权协议接口请求
  cancelAgreeAgreement() {
    requestService
      .request('cancelAgreeAgreement', {
        mobile: app.globalData.phoneNumber,
      })
      .then((res) => {
        const data = res && res.data
        if (data && +data.code === 0) {
          this.logout()
          wx.hideLoading()
          wx.navigateTo({
            url: '/pages/login/login',
          })
        } else {
          showToast('撤回失败，请稍后重试')
        }
      })
      .catch((e) => {
        console.log(e, 'cancelAgreeAgreement')
        wx.hideLoading()
        this.getNetworkType().then((res) => {
          const networkType = res.networkType
          if (networkType === 'none') {
            showToast('网络异常，请稍后再试')
          } else {
            showToast('撤回失败，请稍后重试')
          }
        })
      })
  },
  // 退出登录
  logout() {
    getApp().globalData.isLogon = false
    clearStorageSync()
    setIsAutoLogin(false)
  },
  getNetworkType() {
    return new Promise((resolve, reject) => {
      wx.getNetworkType({
        success(res) {
          resolve(res)
        },
        fail(res) {
          reject(res)
        },
      })
    })
  },
  goLogin: function () {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      isLogon: app.globalData.isLogon,
    })
    //this.checkLoginStatus()
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
  onShareAppMessage: function () {},
})
