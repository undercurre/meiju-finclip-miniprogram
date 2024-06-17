// activities/activitiesTemplates/pages/beInvite.js

import { hasKey } from 'm-utilsdk/index'
import { actEventViewPageTracking } from '../../track/track.js'
import { dialogText } from '../containerCommon.js'
const actTempmetMethodsMixins = require('../actTempmetMethodsMixins.js')
const commonMixin = require('../commonMixin.js')
const app = getApp()
Page({
  behaviors: [actTempmetMethodsMixins, commonMixin],
  /**
   * 页面的初始数据
   */
  data: {
    isMock: false, // 用作假数据调试
    isLogon: false, // 是否登录标识
    isOldUser: false,
    // isOldUser:false,   // 登录接口失败 测试未登录状态
    joinBtnClicked: false, // 邀请接口点击与否
    beforeOnload: true,
    containerTypeMap: {
      1: 'normal', // "通用容器"
      2: 'my-reward', //"我的奖励卡片"
      3: 'invite-register', // "邀请注册"
      4: 'invite-register', //"邀请绑定设备"
      // "5":"INVITE_JOIN_FAMILY" //"邀请加入家庭)",
    },
    containerList: [],
    pageSetting: {},
    shareSetting: {},
    basicSetting: {},
    selectData: {
      type: 3, //页面类型(1、首页；2、普通页面；3、toast弹窗;4、按钮弹窗；5、图片或文案弹窗)
      popUps: {
        closeButtonPosition: 0, //关闭按钮位置
        content: '', //弹窗文案
        height: 1, //弹窗高度
        imgUrl: '', //弹窗上传图片地址
        rollFlag: true, //滚动标识
        title: '', //弹窗标题
        width: 1, //弹窗宽度
        basicList: {
          //按钮组件列表
          content: dialogText.iKnow, // 按钮文案
          target: '', // 跳转类型
          targetUrl: '', // 跳转地址
        },
      },
    },
    isAcceptButton: false, //是否是接受按钮
    isRegister: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let testData = [
      // 容器数组
      {
        id: '', // 容器id
        background: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3599393542,1756458357&fm=26&gp=0.jpg', // 背景图
        type: 1, //玩法类型；1、邀请注册；2、邀请绑定设备；3、邀请加入家庭
        containerType: 1, // 容器类型(1、通用容器；2、我的奖励卡片；3、邀请注册；4、邀请绑定设备；5、邀请加入家庭)
        height: 640,
        basicList: [
          // 需要渲染的图片
          {
            imgUrl: 'https://www.smartmidea.net/activity/202003/spring-mask/img/rule.ce552ec1.png', // 图片地址
            type: '3', // 组件类型；1、按钮；2、热区；3、图片；4、占位区
            width: 128, // 宽高
            height: 128,
            positionX: 300, // 坐标
            positionY: 260,
            positionZ: 3, // 层级
            target: '7', // 跳转类型
            targetUrl: '', // 跳转地址
            name: '', //组件名称
            custom: 5, //其他：特殊处理
          },
          {
            imgUrl: 'https://www.smartmidea.net/activity/202003/spring-mask/img/rule.ce552ec1.png', // 图片地址
            type: '3', // 组件类型；1、按钮；2、热区；3、图片；4、占位区
            width: 132, // 宽高
            height: 60,
            positionX: 270, // 坐标
            positionY: 400,
            positionZ: 3, // 层级
            target: '7', // 跳转类型
            targetUrl: '', // 跳转地址
            name: '', //组件名称
            custom: 6, //其他：特殊处理
          },
        ],
        data: {
          // 特殊容器的数据
          inviteUrl: '', //邀请好友助力跳转地址（邀请注册或绑定设备）
          awardsList: [], //奖品列表（我的奖励卡片和我的奖励列表）
          inviteRecord: [], //邀请记录（邀请记录）
          userInfo: {
            invitederUrl:
              'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsc01.alicdn.com%2Fkf%2FHTB1EL2NaOCYBuNkSnaVq6AMsVXai.jpg&refer=http%3A%2F%2Fsc01.alicdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1616656374&t=149d8e4e706a663cc7f419279678017b', // 受邀人头像
            invitederNickName: 'jakieeeeee', // 受邀人昵称
          }, //邀请人信息（受邀主助力页）
          shareSetting: {}, //分享信息
        },
      },
      {
        id: '', // 容器id
        background: '', // 背景图
        type: 1, //玩法类型；1、邀请注册；2、邀请绑定设备；3、邀请加入家庭
        containerType: 2, // 容器类型(1、通用容器；2、我的奖励卡片；3、邀请注册；4、邀请绑定设备；5、邀请加入家庭)
        height: 240,
        basicList: [
          // 需要渲染的图片
        ],
        data: {
          // 特殊容器的数据
          inviteUrl: '', //邀请好友助力跳转地址（邀请注册或绑定设备）
          awardsList: [], //奖品列表（我的奖励卡片和我的奖励列表）
          inviteRecord: [], //邀请记录（邀请记录）
          userInfo: {}, //邀请人信息（受邀主助力页）
          shareSetting: {}, //分享信息
        },
      },
      {
        id: '', // 容器id
        background: '', // 背景图
        type: 1, //玩法类型；1、邀请注册；2、邀请绑定设备；3、邀请加入家庭
        containerType: 3, // 容器类型(1、通用容器；2、我的奖励卡片；3、邀请注册；4、邀请绑定设备；5、邀请加入家庭)
        height: 240,
        basicList: [
          // 需要渲染的图片
          {
            imgUrl: 'https://www.smartmidea.net/activity/202003/spring-mask/img/rule.ce552ec1.png', // 图片地址
            type: '3', // 组件类型；1、按钮；2、热区；3、图片；4、占位区
            width: 600, // 宽高
            height: 88,
            positionX: 60, // 坐标
            positionY: 120,
            positionZ: 3, // 层级
            target: '7', // 跳转类型
            targetUrl: '', // 跳转地址
            name: '', //组件名称
            custom: 4, //其他：特殊处理
          },
        ],
        data: {
          // 特殊容器的数据
          inviteUrl: '', //邀请好友助力跳转地址（邀请注册或绑定设备）
          awardsList: [], //奖品列表（我的奖励卡片和我的奖励列表）
          inviteRecord: [], //邀请记录（邀请记录）
          userInfo: {}, //邀请人信息（受邀主助力页）
          shareSetting: {}, //分享信息
        },
      },
    ]
    if (this.data.isMock) {
      this.setData({
        options: options,
        containerList: testData,
      })
    }
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
          this.getValidation()
          this.getRiskUser() //获取是否是黑产
          this.getIsLogoutUser() //获取是否活动中注销过
          // this.checkIsReachDayLimit()
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
  refreshPage_token() {
    const { options } = this.data
    const pageId = hasKey(options, 'pageId') ? options.pageId : ''
    console.log('pageId return', pageId)
    this.getGamePage_token(pageId).then((res) => {
      // this.checkIsReachDayLimit()
      this.getValidation()
      this.getIsLogoutUser()
      console.log('beinvite res', res)
      actEventViewPageTracking('page_view', options, res.data.data.pageSetting)
    })
  },
  refreshPageReward_token(isUpdata = true) {
    const { options } = this.data
    const pageId = hasKey(options, 'pageId') ? options.pageId : ''
    console.log('pageId return', pageId)
    this.getGamePage_token(pageId, isUpdata).then((res) => {
      // this.checkIsReachDayLimit()
      this.getValidation()
      this.getIsLogoutUser()
      this.setData({
        shareSetting: res.data.data.shareSetting || {},
        pageSetting: res.data.data.pageSetting || {},
        basicSetting: res.data.data.basicSetting || {},
        userInfo: res.data.data.userInfo || {},
        containerList: res.data.data.pageSetting.containerList || [],
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

  // }
})
