// pages/mytab/mytab.js
const app = getApp() //获取应用实例
const service = require('./assets/js/service')
const imgBaseUrlMixins = require('../common/mixins/base-img-mixins.js')
import { formatTime, getReqId, getStamp, hasKey } from 'm-utilsdk/index'
import { showToast, getFullPageUrl, judgeWayToMiniProgram } from '../../utils/util'
import { requestService, rangersBurialPoint } from '../../utils/requestService'
import { logonStatusApi, mvipApi, baseImgApi } from '../../api'
import { clickEventTracking } from '../../track/track.js'
import { deviceToWxSetting } from '../../utils/paths.js'
import { vipRightsBurialPoint } from './assets/js/burialPoint.js'
import computedBehavior from '../../utils/miniprogram-computed'
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
    id: 'vip',
    isShow: true,
    listItemLeftImg: baseImgApi.url + 'my/me_list_ic_huiyuan.png',
    name: '会员权益',
    funName: 'gotoVipMiniProgram',
    ostyle:
      'background:url(' +
      baseImgApi.url +
      'my/me_list_ic_huiyuan.png?timestamp=' +
      getStamp() +
      ')' +
      'no-repeat; background-size: cover;',
  },
  {
    id: 'invite',
    isShow: true,
    listItemLeftImg: baseImgApi.url + 'me_ic_yaoqing@2x.png',
    name: '邀请成员',
    funName: '',
    openType: '',
    ostyle:
      'background:url(' +
      baseImgApi.url +
      'centerIcon.png?timestamp=' +
      getStamp() +
      ')' +
      'no-repeat  -152rpx -10rpx; background-size:660rpx auto;',
  },
  {
    id: 'download',
    isShow: true,
    listItemLeftImg: baseImgApi.url + 'me_ic_xiazai@2x.png',
    name: '下载美居App',
    funName: 'gotoDownload',
    openType: '',
    ostyle:
      'background:url(' +
      baseImgApi.url +
      'centerIcon.png?timestamp=' +
      getStamp() +
      ')' +
      'no-repeat  -84rpx -10rpx; background-size:660rpx auto;',
  },
  {
    id: 'feedback',
    isShow: true,
    listItemLeftImg: baseImgApi.url + 'me_ic_jianyi@2x.png',
    name: '建议反馈',
    funName: 'burdpointFeedback',
    openType: 'feedback',
    ostyle:
      'background:url(' +
      baseImgApi.url +
      'centerIcon.png?timestamp=' +
      getStamp() +
      ')' +
      'no-repeat  -12rpx -10rpx; background-size:660rpx auto;',
  },
  {
    id: 'about',
    isShow: false,
    listItemLeftImg: baseImgApi.url + 'me_ic_about@2x.png',
    name: '关于美的美居',
    funName: 'goToSetting',
    openType: '',
    ostyle:
      'background:url(' +
      baseImgApi.url +
      'centerIcon.png?timestamp=' +
      getStamp() +
      ')' +
      'no-repeat  -292rpx -10rpx; background-size:660rpx auto;',
  },
  {
    id: 'withdraw',
    isShow: false,
    listItemLeftImg: baseImgApi.url + 'me_ic_zhuxiao.png',
    name: '注销帐号',
    funName: 'goToLoginOut',
    openType: '',
    ostyle:
      'background:url(' +
      baseImgApi.url +
      'centerIcon.png?timestamp=' +
      getStamp() +
      ')' +
      'no-repeat  -362rpx -10rpx; background-size:660rpx auto;',
  },
]

const bindDeviceToWxData = {
  id: 'bindDeviceToWx',
  isShow: true,
  // listItemLeftImg: baseImgApi.url + 'me_ic_zhuxiao.png',
  listItemLeftImg: baseImgApi.url + 'me_ic_bangding@1x.png',
  name: '绑定设备至微信',
  funName: 'goTobindDeviceList',
  openType: '',
  ostyle:
    'background:url(' +
    baseImgApi.url +
    'centerIcon.png?timestamp=' +
    getStamp() +
    ')' +
    'no-repeat  -432rpx -10rpx; background-size:660rpx auto;',
}

//通知管理菜单
const openSettingMenu = {
  id: 'notice',
  isShow: true,
  listItemLeftImg: baseImgApi.url + 'me_ic_tongzhi@2x.png',
  name: '通知管理',
  funName: 'goSetting',
  openType: '',
  ostyle:
    'background:url(' +
    baseImgApi.url +
    'centerIcon.png?timestamp=' +
    getStamp() +
    ')' +
    'no-repeat  -12rpx -10rpx; background-size:660rpx auto;',
}

Page({
  behaviors: [service, imgBaseUrlMixins, computedBehavior],
  onShow() {
    app
      .checkGlobalExpiration()
      .then(() => {
        const mobile = app.globalData.phoneNumber || ''
        this.isShowNoticeMenu()
        this.setBindDeviceToWxData(mobile)
        // this.setWithDrawDataIsShow(app.globalData.isLogon)
        this.setBindDeviceToWxDataIsShow(app.globalData.isLogon)
        this.setData(
          {
            isLogon: app.globalData.isLogon,
          },
          () => {
            this.inviteFun()
          }
        )
        if (app.globalData.isLogon) {
          //获取用户信息
          this.getVipUserInfo()
          this.getSignInfo()
        }
        // this.getAdvertisement() // 新广告接口 v2.6去掉广告位
      })
      .catch(() => {
        this.getVipUserInfo()
        this.getSignInfo()
        app.globalData.isLogon = false
        // this.setWithDrawDataIsShow(app.globalData.isLogon)
        this.setData(
          {
            isLogon: app.globalData.isLogon,
          },
          () => {
            this.inviteFun()
          }
        )
        // this.deletePerson()
        // this.getAdvertisement() // 新广告接口 未登录 v2.6去掉广告位
      })

    app.watchLogin(this.watchBack, this) //kkk add 非刷新页面监听登录态
    //当前tab页面检查协议是否已更新，已更新则关闭已渲染的协议更新弹窗（由于自定义遮罩层不能覆盖原生的tabbar，所以协议新弹窗出现时，可以点击tabbar，以至于tab页面都会渲染协议更新的弹窗）
    this.setData({
      isUpdatedAgreement: app.globalData.isUpdateAgreement,
    })
    clickEventTracking('user_page_view')
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      // this.trackTab()
      this.getTabBar().setData({
        selected: 1,
      })
    }

    //更新头部样式
    let repeat = 3
    let timer = setInterval(() => {
      if (repeat == 0) {
        clearInterval(timer)
      } else {
        var pages = getCurrentPages() //获取加载的页面
        var currentPage = pages[pages.length - 1] //获取当前页面的对象
        var url = currentPage.route //当前页面url
        if (url == 'pages/mytab/mytab') {
          //避免头部颜色闪动
          wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#ffffff',
          })
        }
        repeat--
      }
    }, 1000)

    //this.pointsEntranceAbtest()
  },
  //是否显示通知管理菜单
  isShowNoticeMenu() {
    //判断是否有授权过订阅信息，是否显示通知管理菜单
    console.log('授权过的订阅模板id', app.globalData.subscriptionsSetting)
    if (app.globalData.subscriptionsSetting.length != 1) {
      const index = this.data.pageListData.findIndex((item) => item.id === 'notice')
      if (index === -1) {
        this.data.pageListData.splice(3, 0, openSettingMenu)
        this.setData({
          pageListData: this.data.pageListData,
        })
      }
    }
  },
  trackTab() {
    clickEventTracking('user_behavior_event', 'trackTab')
  },
  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    currentHomeGroupId: '',
    currentHomeInfo: {},
    homeList: null,
    headImgUrl: baseImgApi.url + 'me_img_touxiang@2x.png',
    nickName: '',
    showTips: false,
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
    signData: {
      // "ContRegisterNum":5,//连续签到天数
      // "IsRegister":1,//0：未签到；1：已签到
      // "ResetDay":15,
      // "callback":"",
      // "reward_0":10,
      // "reward_7":20,//连续签到7天得额外积分
      // "reward_15":30,//连续签到15天得额外积分
      // "text": "已签到"
    },
    loginOut: baseImgApi.url + 'me_ic_zhuxiao.png',
    isUpdatedAgreement: app.globalData.isUpdatedAgreement,
    advertiseBarData: [],
    initDataObj: {},
    isIpx: false,
    statusBarHeight: app.globalData.statusNavBarHeight,
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
  // 跳转积分说明h5页面
  gotoAccountDetail() {
    let url = 'https://m.midea.cn/act/help_center/detail?id=547&hideTitle=true'
    wx.navigateTo({
      url: `../webView/webView?webViewUrl=${encodeURIComponent(url)}`,
    })
  },
  // 邀请成员根据不同情况出相关提示
  async inviteFun() {
    try {
      const shareIndex = this.data.pageListData.findIndex((item) => item.id === 'invite')
      const itemOpenTypeData = `pageListData[${shareIndex}].openType`
      const itemfunNameData = `pageListData[${shareIndex}].funName`
      if (!this.data.isLogon) {
        this.setData({
          [itemOpenTypeData]: '',
          [itemfunNameData]: 'goLogin',
        })
      } else {
        const roleId = await this.getRoleId()
        const currentHomeInfo = await this.getCurrentHomeInfo()
        console.log(
          this.data.isLogon,
          this.checkHasFamilyPermission(roleId),
          roleId,
          currentHomeInfo,
          this.checkFamilyMemberCount(currentHomeInfo),
          'inviteFun'
        )
        if (this.checkHasFamilyPermission(roleId) && this.checkFamilyMemberCount(currentHomeInfo)) {
          this.setData({
            [itemOpenTypeData]: 'share',
            [itemfunNameData]: 'burdpointInvitation',
          })
        } else {
          this.setData({
            [itemOpenTypeData]: '',
            [itemfunNameData]: 'showMessage',
          })
        }
      }
      // if (this.data.isLogon && this.checkHasFamilyPermission(roleId) && !this.checkFamilyMemberCount(currentHomeInfo)) {
      //   this.setData({
      //     [itemOpenTypeData]: 'share',
      //     [itemfunNameData]: 'burdpointInvitation',
      //   })
      // } else if (!this.data.isLogon) {
      //   this.setData({
      //     [itemOpenTypeData]: '',
      //     [itemfunNameData]: 'goLogin',
      //   })
      // } else {
      //   this.setData({
      //     [itemOpenTypeData]: '',
      //     [itemfunNameData]: 'showMessage',
      //   })
      // }
    } catch (error) {
      console.log(error, 'inviteFun')
    }
  },
  goToRedpacketPage() {
    wx.navigateTo({
      url: '/activity/pages/redpacketPage/redpacket/redpacket',
    })
  },
  tapDialogButton() {
    this.setData({
      dialogShow: false,
      showOneButtonDialog: false,
    })
  },
  openConfirm: function () {
    this.setData({
      dialogShow: true,
    })
  },
  setBindDeviceToWxData(mobile) {
    if (phoneList.includes(mobile.toString())) {
      const index = this.data.pageListData.findIndex((item) => item.id === 'bindDeviceToWx')
      if (index === -1) {
        this.data.pageListData.splice(4, 0, bindDeviceToWxData)
        this.setData({
          pageListData: this.data.pageListData,
        })
      }
    }
  },
  setBindDeviceToWxDataIsShow(isShow) {
    const bindDeviceToWxIndex = this.data.pageListData.findIndex((item) => item.id === 'bindDeviceToWx')
    if (bindDeviceToWxIndex !== -1) {
      this.setData({
        ['pageListData[' + bindDeviceToWxIndex + '].isShow']: isShow,
      })
    }
    const index = this.data.pageListData.findIndex((item) => item.id === 'notice')
    if (index !== -1) {
      this.setData({
        ['pageListData[' + index + '].isShow']: isShow,
      })
    }
  },
  setWithDrawDataIsShow(isShow) {
    const withdrawIndex = this.data.pageListData.findIndex((item) => item.id === 'withdraw')
    if (withdrawIndex !== -1) {
      this.setData({
        ['pageListData[' + withdrawIndex + '].isShow']: isShow,
      })
    }
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

    //切换显示红点
    this.setData({
      isRegister: false,
    })
  },
  /**
   * 跳转到商城小程序（首页）
   */
  gotoShopping: function () {
    const currentUid =
      app.globalData.userData && app.globalData.userData.uid && app.globalData.isLogon
        ? app.globalData.userData.uid
        : ''
    const randam = getStamp()
    let appId = 'wx255b67a1403adbc2'
    let path = 'page/index/index'
    let extra = {
      jp_source: 3,
      jp_c4a_uid: currentUid,
      jp_rand: randam,
    }
    judgeWayToMiniProgram(appId, path, extra, this.data.shangchen__envVersion)
    this.clickBurdPoint('shopping_mytab')
  },
  /**
   * 跳转到美书小程序（电子说明书）
   */
  gotoICSpecification: function () {
    const currentUid =
      app.globalData.userData && app.globalData.userData.uid && app.globalData.isLogon
        ? app.globalData.userData.uid
        : ''
    const randam = getStamp()
    wx.navigateToMiniProgram({
      appId: 'wxd0e673a1e4dfb3c8',
      path: 'pages/index/index',
      extraData: {
        jp_source: 3,
        jp_c4a_uid: currentUid,
        jp_rand: randam,
      },
      envVersion: 'release', //develop/trial/release
      success() {},
    })
    this.clickBurdPoint('notebook_mytab')
  },
  /**
   * 跳转到会员小程序
   */
  gotoVipMiniProgram(miniProgramPath) {
    // const currentUid =
    //   app.globalData.userData && app.globalData.userData.uid && app.globalData.isLogon
    //     ? app.globalData.userData.uid
    //     : ''
    // const randam = getStamp()
    const miniProgramData = {
      appId: 'wx03925a39ca94b161',
      path: 'pages/user_right/user_right_centre/right_centre_index/right_centre_index',
      extraData: {},
      // extraData: {
      //   jp_source: 3,
      //   jp_c4a_uid: currentUid,
      //   jp_rand: randam,
      // },
      envVersion: this.data.huiyuan_envVersion, //develop/trial/release
    }
    judgeWayToMiniProgram(
      miniProgramData.appId,
      miniProgramData.path,
      miniProgramData.extraData,
      miniProgramData.envVersion
    )
    vipRightsBurialPoint(this.data.vipLevel, this.data.levelName)
    this.clickBurdPoint('midea_vip_mytab')
  },
  /**
   * 跳转到美的会员小程序（签到）
   */
  gotoSignMiniprogram: function () {
    this.setData({
      isRegister: true,
    })
    const currentUid =
      app.globalData.userData && app.globalData.userData.uid && app.globalData.isLogon
        ? app.globalData.userData.uid
        : ''
    const randam = getStamp()
    const self = this
    wx.navigateToMiniProgram({
      appId: 'wx03925a39ca94b161',
      path: 'pages/act/sign/sign',
      extraData: {
        jp_source: 3,
        jp_c4a_uid: currentUid,
        jp_rand: randam,
      },
      envVersion: self.data.huiyuan_envVersion, //develop/trial/release
      success() {},
    })
    this.clickBurdPoint('midea_vip_mytab')
    clickEventTracking('user_behavior_event', 'gotoSign')
  },

  /**
   * 跳转到商城小程序（pro会员页）
   */
  gotoProVipMiniprogram: function () {
    const currentUid =
      app.globalData.userData && app.globalData.userData.uid && app.globalData.isLogon
        ? app.globalData.userData.uid
        : ''
    const randam = getStamp()
    let appId = 'wx255b67a1403adbc2'
    let path = 'subpackage/page/user/pro/detail/detail'
    let extra = {
      jp_source: 3,
      jp_c4a_uid: currentUid,
      jp_rand: randam,
    }
    judgeWayToMiniProgram(appId, path, extra, this.data.shangchen__envVersion)
    this.clickBurdPoint('midea_pro_mytab')
  },

  onGetUserInfo: function (e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo,
      })
    }
  },

  gotoDownload: function () {
    wx.navigateTo({
      url: '../download/download',
    })
    this.clickBurdPoint('download_mytab')
    clickEventTracking('user_behavior_event', 'gotoDownload')
  },

  getVipUserInfo: function () {
    if (!app.globalData.isLogon) return
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

  //查询连续签到活动信息
  checkisresetquery: function () {
    return new Promise((resolve, reject) => {
      wx.request({
        url: mvipApi.getRegisterStatus.url,
        data: {},
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          cookie: wx.getStorageSync('sessionid'),
        },
        method: 'GET',
        success(resData) {
          wx.hideNavigationBarLoading()
          if (resData.code == 0 || resData.data.code == 0 || resData.data.errcode == 0) {
            resolve(resData.data.data)
          } else {
            reject(resData.data.data)
          }
        },
        fail(error) {
          wx.hideNavigationBarLoading()
          reject(error)
        },
      })
    })
  },
  //个人中心签到，同步签到信息到连续签到
  modifyuserregisterquery: function () {
    return new Promise((resolve, reject) => {
      wx.request({
        url: mvipApi.updateRegisterStatus.url,
        data: {},
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          cookie: wx.getStorageSync('sessionid'),
        },
        method: 'GET',
        success(resData) {
          wx.hideNavigationBarLoading()
          if (resData.code == 0 || resData.data.code == 0 || resData.data.errcode == 0) {
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
  //个人中心签到，签到接口
  createDailyScore: function () {
    return new Promise((resolve, reject) => {
      wx.request({
        url: mvipApi.createDailyScore.url,
        data: {},
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          cookie: wx.getStorageSync('sessionid'),
        },
        method: 'GET',
        success(resData) {
          wx.hideNavigationBarLoading()
          if (resData.code == 0 || resData.data.code == 0 || resData.data.errcode == 0) {
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
   * 邀请成员埋点
   */
  burdpointInvitation() {
    this.clickBurdPoint('invitabtion_mytab')
    clickEventTracking('user_behavior_event', 'burdpointInvitation')
    const wxExptInfoSync = this.data.wxExptInfoSync
    console.log(wxExptInfoSync, 'setabtest wxExptInfoSync')
    wx.reportEvent('my_invite_click', {
      uid: (getApp().globalData.userData && getApp().globalData.userData.uid) || '',
      time: new Date().getTime(),
      my_invite_click: wxExptInfoSync?.expt_1656577723,
    })
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

  // 我的tab页面 banner轮循广告位数据 v2.6去掉广告位
  // getAdvertisement() {
  //   let { isLogon } = app.globalData
  //   let reqData = {
  //     headParams: {},
  //     restParams: {
  //       applicationCode: 'APP202105250001EXT', //新api	应用编码
  //       adPositionCode: 'LITEWDGGW', //新api 广告位编码列表
  //       // "adPositionCodes":["LITEWDGGW"],      //新api 广告位编码列表
  //     },
  //   }
  //   // 区分是否登录
  //   const advertimeTemp = isLogon ? 'getAdvertisement_Token' : 'getAdvertisement'
  //   return new Promise((resolve, reject) => {
  //     requestService.request(advertimeTemp, reqData).then(
  //       (res) => {
  //         console.log('mytab 我的广告位 新接口 res', res)
  //         if (res.data.code == '000000') {
  //           console.log('mytab 我的广告位 新接口', res.data.data.ads)
  //           this.setData({
  //             advertiseBarData: res.data.data.ads || [],
  //           })
  //         } else {
  //           reject(res)
  //         }
  //       },
  //       (error) => {
  //         reject(error)
  //       }
  //     )
  //   })
  // },
  //跳转个人中心页面
  goPersonalCenter() {
    wx.navigateTo({
        url: '../accountSafe/accountSafe',
      })
      return
    wx.navigateTo({
      url: '../../sub-package/personal-center/personalCenter/personalCenter',
    })
  },
  //登录状态回调
  watchBack(isLogon, that) {
    if (isLogon) {
      // that.getAdvertisement() // 新广告接口 v2.6去掉广告位
      that.setBindDeviceToWxData(app.globalData.phoneNumber)
    }
    this.setData({
      isLogon: app.globalData.isLogon,
    })
    // this.setWithDrawDataIsShow(app.globalData.isLogon)
    this.setBindDeviceToWxDataIsShow(app.globalData.isLogon)
  },

  goLogin: function () {
    wx.navigateTo({
      url: '../login/login',
    })
  },
  //点击跳转关于/设置页面
  goToSetting: function () {
    clickEventTracking('user_behavior_event', 'goToSetting')
    if (!this.data.isLogon) {
      this.goLogin()
    } else {
      wx.navigateTo({
        url: '/sub-package/mytab/pages/about/about',
      })
    }
  },
  // 判断签到是否弹框
  checkIfSign() {
    const { IsRegister } = this.data.signData
    if (IsRegister == 1) {
      this.setData({
        isShowSignDialog: true,
      })
      return true
    }
    return false
  },
  sendStr(e) {
    console.log(e.detail)
    this.data.initDataObj = e.detail
  },
  // 点击签到按钮
  gotoSign() {
    // clickEventTracking('user_behavior_event', 'gotoSign')
    // 浏览弹框埋点
    let self = this
    setTimeout(() => {
      rangersBurialPoint('user_page_view', {
        page_path: getFullPageUrl(),
        page_title: '',
        module: '个人中心',
        page_id: 'popups_sign_in',
        page_name: '今日已签到弹窗',
        object_type: '',
        object_id: '',
        object_name: '',
        ext_info: {
          day_counts: self.data.initDataObj.ContRegisterNum ? self.data.initDataObj.ContRegisterNum : '',
          score: self.data.initDataObj.hasGetPoint,
        },
        device_info: {},
      })
    }, 2000)
    // 前端拦截重复签到
    if (this.checkIfSign()) return
    // // 同步签到信息
    // this.modifyuserregisterquery()
    // // 查询签到数据
    // this.checkisresetquery().then((resp) => {
    //   this.formatSignData(resp, 'click')
    //   this.getVipUserInfo()
    // })

    this.createDailyScore().then(() => {
      this.modifyuserregisterquery().then(() => {
        this.checkisresetquery().then((resp) => {
          this.formatSignData(resp, 'click')
          this.setData({
            isShowSignDialog: true,
          })
          this.getVipUserInfo()
        })
      })
    })
  },
  goTobindDeviceList() {
    wx.navigateTo({
      url: deviceToWxSetting,
    })
  },
  getSignData(obj) {
    if (obj.IsRegister == 0) {
      obj.text = '签到'
    } else if (obj.IsRegister == 1) {
      obj.text = `已签到${obj.ContRegisterNum}天`
    }
    return obj
  },
  formatSignData(resp, from) {
    const signData = this.getSignData(resp)
    this.setData({
      signData: signData,
    })
    if (from == 'click') {
      if (signData.IsRegister == 1) {
        this.setData({
          isShowSignDialog: true,
        })
      }
    }
  },
  // 进入就调用签到状态跟文字判断
  getSignInfo() {
    if (!app.globalData.isLogon) return
    //获取登录态
    this.mucuserlogin()
      .then(() => {
        // 获得连续签到数据
        this.checkisresetquery()
          .then((resp) => {
            let check = 'load'
            this.formatSignData(resp, check)
          })
          .catch((e) => {
            console.log('checkisresetquery error', e)
          })
      })
      .catch((e) => {
        console.log('get mucuserlogin fail', e)
      })
  },
  closeSignDialog() {
    this.setData({
      isShowSignDialog: false,
    })
    // 点击关闭按钮的埋点
    this.toSign('click_btn_close', '关闭')
  },
  // 点击关闭签到埋点
  toSign(widget_id, widget_name) {
    rangersBurialPoint('user_behavior_event', {
      module: '个人中心',
      page_id: 'popups_sign_in', //参考接口请求参数“pageId”
      page_name: '今日已签到弹窗', //当前页面的标题，顶部的title
      page_path: getFullPageUrl(), //当前页面的URL
      widget_id: widget_id,
      widget_name: widget_name,
      page_module: '',
    })
  },
  goPoint() {
    showToast('下载美的美居App体验更多功能！')
  },
  userBehaviorEventTrack(widget_id, widget_name) {
    rangersBurialPoint('user_behavior_event', {
      module: '个人中心', //写死 “活动”
      page_id: 'page_personal', //参考接口请求参数“pageId”
      page_name: '个人中心', //当前页面的标题，顶部的title
      page_path: getFullPageUrl(), //当前页面的URL
      widget_id: widget_id,
      widget_name: widget_name,
      page_module: '个人中心',
    })
  },
  //积分商城入口abTest
  pointsEntranceAbtest() {
    const res = wx.getExptInfoSync(['expt_1672210866'])
    console.log('积分商城跳转入口样式ABtest', res)
    if (res.expt_1672210866 === undefined) {
      /* 返回空对象；未命中实验、实验待发布（白名单除外）或者实验结束后会命中该分支 */
      /* 业务逻辑，可对齐线上 */
    } else if (res.expt_1672210866 == '0') {
      /* 对照组业务逻辑 */
      this.setData({
        isShowB: false,
      })
    } else if (res.expt_1672210866 == '1') {
      /* 实验组1业务逻辑 */
      this.setData({
        isShowB: true,
      })
    } else {
      /* 异常分支逻辑 */
    }
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
          this.inviteFun()
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
