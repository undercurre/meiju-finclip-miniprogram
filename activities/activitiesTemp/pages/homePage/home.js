// activities/activitiesTemplates/pages/InviteToFamily/InviteToFamily.js
import { mockData } from '../mockData.js'
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
    isSliderValidation: '',
    pageSetting: {},
    shareSetting: {},
    actionItem: {},
    fromShare: false,
    beforeOnload: true,
    isFirstInit: false,
    isAcceptButton: false, //是否是接受按钮
    isRegister: false,
    slider: 'n',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (JSON.stringify === '{}') {
      try {
        let value = wx.getStorageSync('options')
        if (value) {
          // Do something with return value
          options = JSON.parse(value)
        }
      } catch (e) {
        // Do something when catch error
      }
    } else {
      wx.setStorage({
        key: 'options',
        data: JSON.stringify(options),
      })
    }
    console.log('字节埋点ssid')
    console.log('$$ranges---------', app.$$Rangers._envInfo.user)
    // 跳转app页面的活动首页地址
    const appHomePage = this.getAppH5ActUrl()
    this.data.beforeOnload = false
    // console.log("活动主页onLoad",options)
    this.setData({
      appParameterH5Home: appHomePage,
      statusNavBarHeight: app.globalData.statusNavBarHeight,
    })
    this.getInitOptions(options)
    if (this.data.isMock) {
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
          this.setData({
            options: options,
            pageSetting: mockData.res.data.pageSetting || {},
            containerList: mockData.res.data.pageSetting.containerList || [],
            shareSetting: mockData.res.data.shareSetting || {},
            basicSetting: mockData.res.data.basicSetting || {},
            selectData: mockData.res.data.pageSetting || {},
          })
          this.checkActStatus()
        })
        .catch((e) => {
          console.warn('微信token已过期', e)
          this.setData({
            isLogon: app.globalData.isLogon,
          })
          this.setData({
            options: options,
            pageSetting: mockData.res.data.pageSetting || {},
            containerList: mockData.res.data.pageSetting.containerList || [],
            shareSetting: mockData.res.data.shareSetting || [],
            basicSetting: mockData.res.data.basicSetting || [],
            selectData: mockData.res.data.pageSetting || {},
          })
          this.checkActStatus()
        })
    } else {
      // 10197 10304
      const { options } = this.data
      const gameId = hasKey(options, 'gameId') ? this.data.options.gameId : '10304'
      console.log('活动主页onLoad1')
      app
        .checkGlobalExpiration()
        .then((res) => {
          console.log('活动主页onLoad login success')
          console.log('微信token未过期', res)
          this.setData({
            isLogon: app.globalData.isLogon,
          })
          if (!this.data.isLogon) {
            reject(false)
            return
          }
          this.data.beforeOnload = true
          this.getGamePageInit_token(gameId).then((res) => {
            //隐藏分享按钮
            const { shareFlag } = this.data.shareSetting
            if (!shareFlag) {
              wx.hideShareMenu({
                menus: ['shareAppMessage', 'shareTimeline'],
              })
            }
            this.getStatusUser()
            this.getValidation()
            this.getRiskUser()
            this.getIsLogoutUser()
            this.checkActStatus()
            actEventViewPageTracking('page_view', options, res.data.data.pageSetting)
          })
        })
        .catch((e) => {
          console.log('活动主页onLoad login fail')
          console.warn('微信token已过期', e)
          this.setData({
            isLogon: app.globalData.isLogon,
          })
          this.data.beforeOnload = true
          this.getGamePageInit(gameId).then((res) => {
            //隐藏分享按钮
            const { shareFlag } = this.data.shareSetting
            if (!shareFlag) {
              wx.hideShareMenu({
                menus: ['shareAppMessage', 'shareTimeline'],
              })
            }
            this.getValidation()
            this.checkActStatus()
            actEventViewPageTracking('page_view', options, res.data.data.pageSetting)
          })
        })
    }
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
    console.log(
      '活动主页onshow:',
      this.data.fromShare,
      this.data.beforeOnload,
      this.data.isFirstInit,
      this.data.isLogon,
      app.globalData.isLogon
    )
    if (!this.data.fromShare) {
      // if(this.data.beforeOnload) {
      //   if(this.data.isLogon) {
      //     console.log("onShow1")
      //     this.init()
      //   }
      // } else {
      //   this.data.beforeOnload = true
      // }
      if (this.data.beforeOnload && !this.data.dialogShow) {
        console.log('onShow2')
        this.init()
        this.data.isFirstInit = true
      }
      this.data.fromShare = false
      //其他页面登录后初始化
      // if (!this.data.isFirstInit && this.data.beforeOnload) {
      //   console.log("onShow2")
      //   this.init()
      //   this.data.isFirstInit = true
      // }
      //获取全局登录状态
      // this.setData({
      //   isLogon: app.globalData.isLogon
      // })
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
  onShareAppMessage: function (e) {
    this.activityShareTrack(e)
    //任务盒子-分享当前活动
    if (
      e.from == 'button' &&
      e.target.dataset.selectcontainer.containerType == 20 &&
      e.target.dataset.item.custom == 1
    ) {
      // let currentPage = getFullPageUrl()
      //let currentPath = currentPage.route
      let currentTitle = this.data.pageSetting.name
      if (this.data.isLogon) this.actionFinishTask(20)
      this.data.fromShare = false
      return {
        title: currentTitle, // 默认是小程序的名称(可以写slogan等)
      }
    }

    //邀请家庭
    if (e.from == 'button' && e.target.dataset.item.target == 9) {
      let currentPath = '/pages/index/index'
      let currentTitle = '欢迎使用美的美居Lite'
      let currentImageUrl
      if (e.from == 'button') {
        currentPath = e.target.dataset.path
        currentTitle = '邀请您使用美的美居小程序控制设备'
        currentImageUrl = '../../../../assets/img/img_wechat_chat02@3x.png'
      }
      return {
        title: currentTitle, // 默认是小程序的名称(可以写slogan等)
        path: currentPath, // 默认是当前页面，必须是以‘/’开头的完整路径
        imageUrl: currentImageUrl, //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      }
    }
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
  init() {
    const { options } = this.data
    // const gameId = hasKey(options,"gameId") ? options:'10131'
    if (this.data.isMock) {
      return
    }
    if (app.globalData.isLogon) {
      console.warn('init已登录')
      this.getGamePageInit_token()
        .then((res) => {
          //隐藏分享按钮
          const { shareFlag } = this.data.shareSetting
          if (!shareFlag) {
            wx.hideShareMenu({
              menus: ['shareAppMessage', 'shareTimeline'],
            })
          }
          // 浏览事件埋点
          this.getStatusUser()
          this.getValidation()
          this.getRiskUser()
          this.getIsLogoutUser()
          actEventViewPageTracking('page_view', options, res.data.data.pageSetting)
          this.checkActStatus()
        })
        .catch(() => {
          // 浏览事件埋点
          //actEventViewPageTracking("page_view",options,res.data.data.pageSetting)
          // this.checkActStatus()
        })
    } else {
      console.warn('init未登录')
      this.getGamePageInit()
        .then((res) => {
          //隐藏分享按钮
          const { shareFlag } = this.data.shareSetting
          if (!shareFlag) {
            wx.hideShareMenu({
              menus: ['shareAppMessage', 'shareTimeline'],
            })
          }
          this.getValidation()
          this.checkActStatus()
          // 浏览事件埋点
          actEventViewPageTracking('page_view', options, res.data.data.pageSetting)
        })
        .catch(() => {
          this.checkActStatus()
          // 浏览事件埋点
          //actEventViewPageTracking("page_view",options,res.data.data.pageSetting)
        })
    }
  },
  // --新用户注册相关start--
  actionGetphonenumber(props) {
    console.log('要登录按钮埋点', props)
    const e = props.detail
    this.activityTrack(e)
    wx.navigateTo({
      url: '../../../../pages/login/login',
    })
  },
  // --新用户注册相关end--
})
