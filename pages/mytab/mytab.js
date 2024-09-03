// pages/mytab/mytab.js
const app = getApp() //获取应用实例
const service = require('./assets/js/service')
const imgBaseUrlMixins = require('../common/mixins/base-img-mixins.js')
import { getReqId, getStamp, hasKey } from 'm-utilsdk/index'
import { getFullPageUrl, debounce } from '../../utils/util'
import { requestService } from '../../utils/requestService'
import { logonStatusApi, baseImgApi, imgBaseUrl } from '../../api'
import { clickEventTracking } from '../../track/track.js'
import {
  clickLoginBurialPoint,
  clickPersonalBurialPoint,
  clickSeetingMenuPrivcyBurialPoint,
  clickSeetingMenuAboutBurialPoint,
  clickSeetingMenuSettingBurialPoint,
  myPageViewBurialPoint,
} from './assets/js/burialPoint.js'
import { setVipUserInfo } from '../../utils/redis.js'
import computedBehavior from '../../utils/miniprogram-computed'
const indexSrc = imgBaseUrl.url + '/harmonyos/index/index.png'
const headerImg = '/assets/img/about/header.png'
const aboutImg = '/assets/img/about/about.png'
const privacyImg = '/assets/img/about/privacy.png'
const settinfImg = '/assets/img/about/setting.png'
const phoneList = [
  '15298380419',
  '13724277075',
  '13790028623',
  '13724881864',
  '17017510821',
  '19129572834',
  '13127506861',
  '18682060259',
  '13510421123',
]

// 我的页面列表默认数据
let defaultPageListData = [
  {
    id: 'privacy',
    isShow: true,
    listItemLeftImg: privacyImg,
    name: '隐私安全与保护',
    funName: 'gotoPrivcayPage',
  },
  {
    id: 'about',
    isShow: true,
    listItemLeftImg: aboutImg,
    name: '关于美的美居',
    funName: 'gotoAoutPage',
    openType: '',
  },
  {
    id: 'setting',
    isShow: true,
    listItemLeftImg: settinfImg,
    name: '设置',
    funName: 'goToSettingPage',
    openType: '',
  },
]
let jumpSettingDebounce = null
let jumpAboutDebounce = null
let jumpSafeDebounce = null
Page({
  behaviors: [service, imgBaseUrlMixins, computedBehavior],
  onShow() {
    myPageViewBurialPoint()
    app
      .checkGlobalExpiration()
      .then(() => {
        const mobile = app.globalData.phoneNumber || ''
        this.setData({
          isLogon: app.globalData.isLogon,
        })
        this.getVipUserInfo()
      })
      .catch(() => {
        this.getVipUserInfo()
        app.globalData.isLogon = false
        this.setData(
          {
            isLogon: app.globalData.isLogon,
          },
          () => {}
        )
      })
    app.watchLogin(this.watchBack, this) //kkk add 非刷新页面监听登录态
    //当前tab页面检查协议是否已更新，已更新则关闭已渲染的协议更新弹窗（由于自定义遮罩层不能覆盖原生的tabbar，所以协议新弹窗出现时，可以点击tabbar，以至于tab页面都会渲染协议更新的弹窗）
    this.setData({
      isUpdatedAgreement: app.globalData.isUpdateAgreement,
    })
    //clickEventTracking('user_page_view')
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      app.globalData.selectTab = 1
      //this.trackTab()
      this.getTabBar().setData({
        selected: 1,
      })
    }
  },
  trackTab() {
    clickEventTracking('user_behavior_event', 'trackTab')
  },
  /**
   * 页面的初始数据
   */
  data: {
    indexSrc,
    headerImg,
    aboutImg,
    privacyImg,
    settinfImg,
    bgClor: '#267AFF',
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    currentHomeGroupId: '',
    currentHomeInfo: {},
    homeList: null,
    headImgUrl: '',
    nickName: '',
    vipGrow: '',
    isRegister: false,
    mucuserloginCookie: '',
    isLogon: app.globalData.isLogon,
    code: '',
    uid: '',
    dialogShow: false,
    phoneNumber: '',
    huiyuan_envVersion: 'release', //develop/trial/release
    shangchen__envVersion: 'release', //develop/trial/release
    showSubsidyEntrance: new Date().getTime() < new Date('2021/3/1 00:00:00').getTime(),
    isShowSignDialog: false,
    signData: {},
    loginOut: baseImgApi.url + 'me_ic_zhuxiao.png',
    isUpdatedAgreement: app.globalData.isUpdatedAgreement,
    advertiseBarData: [],
    initDataObj: {},
    isIpx: false,
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
    jifenIco: baseImgApi.url + 'me_ic_remind@2x.png',
    signIco: baseImgApi.url + 'me_ic_qiandao@2x.png',
    topBac: baseImgApi.url + 'me_img_bk@2x.png',
    setIco: baseImgApi.url + 'me_list_ic_shezhi@3x.png',
    pageListData: defaultPageListData, // 我的页面列表数据
    wxExptInfoSync: null, // 我的页ABtest实验数据
    baseImgUrl: baseImgApi.url,
    vipLevel: '', // 会员等级
    levelName: '', // 会员名称
    paymentMember: false,
    isShowB: false, //积分商城入口显示A样式 还是B样式 默认是A样式
    clickNum: 0,
  },
  computed: {
    pageListShowData() {
      return this.data.pageListData.filter((item) => item.isShow)
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // let self = this
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          isIpx: res.safeArea.top > 20 ? true : false,
        })
      },
    })
  },

  //点击跳转设置页面
  goToSettingPage() {
    if(!jumpSettingDebounce){
        jumpSettingDebounce = debounce(() => {
             //埋点
            clickSeetingMenuSettingBurialPoint()
            wx.navigateTo({
                url: '/sub-package/mytab/pages/about/about',
            })
        }, 300, 300)
    }
    jumpSettingDebounce()
  },
  /**
   * 跳转到隐私协议页面
   */
  gotoPrivcayPage() {
    if(!jumpSafeDebounce){
        jumpSafeDebounce = debounce(() => {
            clickSeetingMenuPrivcyBurialPoint()
            wx.navigateTo({
                url: '/pages/privacyAndSafa/privacyAndSafa',
            })
        }, 300, 300)
    }
    jumpSafeDebounce()
  },
  //点击跳转关于页面
  gotoAoutPage() {
    if(!jumpAboutDebounce){
        jumpAboutDebounce = debounce(() => {
            //埋点
            clickSeetingMenuAboutBurialPoint()
            wx.navigateTo({
                url: '/pages/aboutApp/aboutApp',
            })
        }, 300, 300)
    }
    jumpAboutDebounce()
  },

  getVipUserInfo: function () {
    if (!app.globalData.isLogon) return
    //先从缓存拿
    if (wx.getStorageSync('vipUserInfo')) {
      const vipData = wx.getStorageSync('vipUserInfo')
      this.setData({
        headImgUrl: vipData?.userCustomize?.headImgUrl,
        nickName: vipData?.userCustomize?.nickName,
      })
    }
    let data = {
      // brand: 1,
      // sourceSys: 'IOT'
      headParams: {},
      restParams: {
        sourceSys: 'IOT',
        userId: app.globalData.userData.userInfo.userId,
        brand: 1,
        mobile: app.globalData.userData.userInfo.mobile,
      },
    }
    requestService.request('getVipUserInfo', data).then((resp) => {
      const vipData = resp?.data?.data
      app.globalData.userData.grade = vipData?.grade
      setVipUserInfo(vipData)
      this.setData({
        headImgUrl: vipData?.userCustomize?.headImgUrl,
        nickName: vipData?.userCustomize?.nickName,
        vipLevel: vipData?.grade,
        paymentMember: vipData?.paymentMember,
        levelName: vipData?.levelName,
      })
    })
  },

  //获取登录态信息
  mucuserlogin: function () {
    let self = this
    let muctoken = app.globalData.userData && app.globalData.userData.mdata && app.globalData.userData.mdata.accessToken
    if (!muctoken) return
    return new Promise((resolve, reject) => {
      wx.request({
        url: logonStatusApi.mucuserlogin.url + '?muctoken=' + muctoken,
        data: {},
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        method: 'GET',
        success(resData) {
          wx.hideNavigationBarLoading()
          if (resData.code == 0 || resData.data.code == 0 || resData.data.errcode == 0) {
            self.data.mucuserloginCookie = resData.data
            const LoginRsp = resData.data.data.LoginRsp
            const cookieData = `sukey=${LoginRsp.CurSession};uid=${LoginRsp.Uid}`
            self.data.mucuserloginCookie = cookieData
            wx.setStorageSync('sessionid', cookieData)
            // wx.setStorageSync("sessionid", resData.header["Set-Cookie"]); // + ";CurSession=" + resData.data.data.LoginRsp.CurSession
            resolve(resData.data)
          } else {
            reject(resData.data)
          }
        },
        fail(error) {
          wx.hideNavigationBarLoading()
          reject(error)
        },
      })
    })
  },

  /**
   * 获取邀请码
   */
  getInvitationCode() {
    return new Promise((resolve, reject) => {
      let reqData = {
        reqId: getReqId(),
        stamp: getStamp(),
        homegroupId: app?.globalData?.currentHomeGroupId || this?.data?.currentHomeInfo?.homegroupId || '',
      }
      requestService.request('share', reqData).then(
        (resp) => {
          resolve(resp.data.data || {})
        },
        (error) => {
          reject(error)
        }
      )
    })
  },
  // 校验是否有当前家庭邀请权限
  checkHasFamilyPermission(roleId) {
    const hasPermissionList = ['1001', '1002'] // 1001 - 创建者 1002 - 管理员
    return hasPermissionList.indexOf(roleId) >= 0
  },
  checkFamilyMemberCount(currentHomeInfo) {
    return currentHomeInfo?.memberCount < 20
  },

  // 获取家庭列表及权限
  getHomeList() {
    let homeList = app?.globalData?.homeGrounpList || this.data.homeList
    return new Promise((resolve, reject) => {
      let reqData = {
        reqId: getReqId(),
        stamp: getStamp(),
      }
      if (!homeList) {
        requestService
          .request('homeList', reqData)
          .then((resp) => {
            if (resp.data.code == 0) {
              this.data.homeList = resp.data.data.homeList
              resolve(resp.data.data.homeList)
            } else {
              reject(resp)
            }
          })
          .catch((error) => {
            reject(error)
          })
      } else {
        resolve(homeList)
      }
    })
  },

  getCurrentHomeInfo() {
    const currentHomeGroupId = app?.globalData?.currentHomeGroupId
    return new Promise((resolve, reject) => {
      this.getHomeList()
        .then((homeList) => {
          const currentHomeInfo =
            homeList &&
            homeList.find((item, index) => {
              if (currentHomeGroupId) {
                return item.homegroupId === currentHomeGroupId
              }
              if (item.isDefault == 1) {
                return item.isDefault == 1
              } else {
                return index === 0
              }
            })
          this.data.currentHomeInfo = currentHomeInfo
          resolve(currentHomeInfo)
        })
        .catch((e) => {
          console.log(e, 'getCurrentHomeInfo')
          reject(e)
        })
    })
  },

  // 获取当前家庭roleId
  getRoleId() {
    return new Promise((resolve) => {
      this.getCurrentHomeInfo().then((currentHomeInfo) => {
        const roleId = currentHomeInfo?.roleId
        resolve(roleId)
      })
    })
  },

  async showMessage() {
    clickEventTracking('user_behavior_event', 'showMessage')
    try {
      const roleId = await this.getRoleId()
      const currentHomeInfo = await this.getCurrentHomeInfo()
      if (!this.checkFamilyMemberCount(currentHomeInfo)) {
        wx.showToast({
          title: '当前家庭成员数量已达上限',
          icon: 'none',
          duration: 3000,
        })
      }
      if (!this.checkHasFamilyPermission(roleId)) {
        wx.showToast({
          title: '你为当前家庭的普通成员，暂不能添加成员',
          icon: 'none',
          duration: 3000,
        })
      }
    } catch (error) {
      console.log(error, 'showMessage')
    }
  },

  //打开小程序设置
  goSetting() {
    clickEventTracking('user_behavior_event', 'goSetting', {
      module: '我的',
      page_id: 'page_personal',
      page_name: '个人中心',
      page_path: getFullPageUrl(),
      widget_name: '通知管理',
      widget_id: 'click_btn_message_manage',
      object_name: '',
      device_info: {},
      ext_info: {},
    })
    wx.openSetting({
      success(res) {
        console.log(res.authSetting)
      },
    })
  },

  /**
   * 建议反馈埋点
   */
  burdpointFeedback() {
    this.clickBurdPoint('feedback_mytab')
    clickEventTracking('user_behavior_event', 'burdpointFeedback')
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

  //跳转个人中心页面
  goPersonalCenter() {
    //埋点
    clickPersonalBurialPoint()
    wx.navigateTo({
      url: '../../sub-package/personal-center/personalCenter/personalCenter',
    })
  },
  //登录状态回调
  watchBack(isLogon, that) {
    this.setData({
      isLogon: app.globalData.isLogon,
    })
  },

  goLogin: function () {
    //埋点
    clickLoginBurialPoint()
    wx.navigateTo({
      url: '../login/login',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  onAddToFavorites() {
    // webview 页面返回 webViewUrl
    return {
      title: '我的',
      imageUrl: '',
      query: '',
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      isShowSignDialog: false,
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      isShowSignDialog: false,
    })
  },

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
  onShareAppMessage: async function (res) {
    let currentPath = '/pages/index/index'
    let currentTitle = '欢迎使用美的美居Lite'
    let currentImageUrl = `${this.data.imgUrl}/mainContent/images/img_wechat_chat01@3x.png`
    if (res.from == 'button') {
      try {
        const roleId = await this.getRoleId()
        if (this.checkHasFamilyPermission(roleId)) {
          const invitationCodeData = await this.getInvitationCode()
          console.log(invitationCodeData, 'invitationCodeData')
          currentPath = '/' + invitationCodeData.path
          currentTitle = '邀请你加入我的家庭控制设备'
          currentImageUrl = `${this.data.imgUrl}/mainContent/images/img_wechat_chat02@3x.png`
        }
      } catch (e) {
        console.log(e, 'onShareAppMessage')
        if (!hasKey(e, 'data')) return
        if (!hasKey(e.data, 'code')) return
        if (e.data.code == 2020) {
          //this.inviteFun()
        }
      }
    }
    console.log('分享的路径:', currentPath)
    return {
      title: currentTitle, // 默认是小程序的名称(可以写slogan等)
      path: currentPath, // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: currentImageUrl, //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
    }
  },

  /**
   * 扫码调试小程序
   */
  startAppletByQrCode() {
    console.log('hmn123mn-o', this.data.clickNum, this.data.clickNum >= 6)
    if (this.data.clickNum >= 6) {
      ft.changeIsStartAppletByQrCode()
    }
    this.setData({ clickNum: ++this.data.clickNum })
  },
})
