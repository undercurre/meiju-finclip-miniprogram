import {
  inputMboblieViewBurialPoint,
  clickBthVerifyBurialPoint,
  getCodeBurialPoint,
  clickBtnDisAgreeBurialPoint,
  clickBtnAgreeBurialPoint,
  loginCheckResultBurialPoint,
  photoCodeEventBurialPoint,
  userPageViewTrack,
} from 'assets/burialPoint'
import { baseImgApi, privacyApi } from '../../api'
import { requestService } from '../../utils/requestService'
import { getFullPageUrl, showToast } from '../../utils/util'
import { index, virtualPlugin, wetChatMiddlePage } from '../../utils/paths.js'
import config from '../../config.js' //环境及域名基地址配置
const loginBtnOff = baseImgApi.url + 'denglu_btn_off.png'
const loginBtnOn = baseImgApi.url + 'denglu_btn_on.png'
const loginLogoSrc = '/assets/img/login/login.png'
const verCodeSrc = '/assets/img/login/vercode.png'
const imgCodeSrc = '/assets/img/login/imgcode.png'
const phoneSrc = '/assets/img/login/phone.png'
import loginMethods from '../../globalCommon/js/loginRegister.js'
import { clickEventTracking } from '../../track/track.js'
import Toast from 'm-ui/mx-toast/toast'
const WX_LOG = require('../../utils/log')
const app = getApp()
// 用户状态, 1：未注销   2：注销成功三天后  3：注销成功3天内   4：注销中  5：注销失败
const loginStatusMap = {
  1: '未注销',
  2: '注销成功3天后',
  3: '注销成功3天内',
  4: '注销中 ',
}
Page({
  behaviors: [],
  data: {
    statusBarHeight: app.globalData.statusNavBarHeight,
    loginLogoSrc,
    verCodeSrc,
    imgCodeSrc,
    phoneSrc,
    loginBtnOff,
    loginBtnOn,
    agreeFlag: false,
    titleResult: [],
    topBacImg: baseImgApi.url + 'denglu_img_bk@2x.png',
    loginBtnDes: '获取验证码',
    loadingIco: baseImgApi.url + 'loading.png',
    logoTop: '',
    registerDialogShow: false,
    fms: 2,
    phoneNumber: '',
    vercode: '',
    imgcode: '',
    verImgcode: '',
    randomToken: '',
    showVercode: false,
    verCodeDisabled: true,
    loginDisabled: true,
    verCodeDes: '获取验证码',
    privacyShow: false, //用户协议和隐私协议
    verCodeInputshow: false, //验证码输入框
    imgCodeInputshow: false, //图形验证码输入框
    privacyTitle: '服务协议和隐私保护',
    confirmButtonText: '同意',
    cancelButtonText: '不同意',
    isLogin: false,
    duration: 500,
    transitionName: 'fade-up',
    timer: null,
    isButtonClicked: false,
    accountAbnorDialogShow: false,
    registeringDialogShow: false,
    confirmReButtonText: '重新注册',
    confirmAuButtonText: '联系客服',
    confirmReingButtonText: '前往撤销',
    jwtToken: '',
    agreeVersions: [],
  },
  setLoginLogoTop() {
    let marginHeight = (app.globalData.systemInfo.screenHeight * 2 * 140) / 1624
    this.setData({
      logoTop: marginHeight ? marginHeight : 140,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //页面暴露埋点
    userPageViewTrack()
    //this.getAgreementTitles()
    if (options && options.fms) {
      this.setData({
        fms: options.fms,
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //this.getAgreementTitles()
    this.setLoginLogoTop()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //  虚拟插件页进入登录页面 返回时去首页
    let pages = getCurrentPages() //页面对象
    let prevpage = pages[pages.length - 2] //上一个页面对象
    let lastPath = prevpage.route
    if (`/${lastPath}` == virtualPlugin) {
      if (!app.globalData.isLogon) {
        wx.reLaunch({
          url: index,
        })
      }
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  //不同意隐私协议
  onClose() {
    clickBtnDisAgreeBurialPoint()
  },
  //同意服务和隐私协议
  onConfirm() {
    this.setData({
      agreeFlag: true,
    })
    if (this.data.isLogin) {
      this.loginTemp(0)
    } else {
      this.getSmsCode()
    }
    //同意隐私协议
    clickBtnAgreeBurialPoint()
  },
  changeAgree() {
    this.setData({
      agreeFlag: !this.data.agreeFlag,
    })
  },
  //
  //原有移植代码，遗弃
  agreeToast() {
    //this.userBehaviorEventTrack('toast_login_notice', '请先阅读条款toast')
    wx.showToast({
      title: '请先阅读并同意相关协议',
      icon: 'none',
      duration: 1000,
    })
  },
  //隐私条件跳转
  goPrivacy(e) {
    let type = e.currentTarget.dataset.type
    let currLink = `${privacyApi.url}/mobile/agreement/?system=meijuApp&agreement_type=${type}`
    let encodeLink = encodeURIComponent(currLink)
    let currUrl = `/pages/webView/webView?webViewUrl=${encodeLink}`
    console.log('新C4A隐私条款链接===', encodeLink)
    wx.navigateTo({
      url: currUrl,
    })
  },
  //获取隐私协议版本
  async getAgreementTitles() {
    await requestService
      .request('agreementTitleApi', {})
      .then((res) => {
        if (res.data.code == '0') {
          let titleResult = res.data.result
          this.getAgreeVersions(titleResult)
          this.data.titleResult = titleResult
        }
      })
      .catch(() => {})
  },
  //解析隐私协议版本参数
  getAgreeVersions(titleResult) {
    let agreeVersions = []
    titleResult.forEach((item) => {
      let currInfo = {
        type: item['type'],
        version: item['agreementVersion'],
      }
      agreeVersions.push(currInfo)
    })
    this.data.agreeVersions = agreeVersions
  },
  //重置按钮
  resetLoginBtnDes() {
    setTimeout(() => {
      this.setData({
        loginBtnDes: '登录',
      })
    }, 1000)
  },
  // 跳转到c4a注销页面
  getJwtToken() {
    const accesstoken = this.data.jwtToken
    const host = `${config.privacyDomain[config.environment]}`
    const url = `${host}/mobile/cancellation/?system=meijuApp&jwt_token=${accesstoken}`
    console.log(url, 'logouturl')
    wx.navigateTo({
      url: `/sub-package/webview/defaultWebview/defaultWebview?webViewUrl=${encodeURIComponent(
        url
      )}&needCheckLogStatus=true`,
    })
  },

  // 更新phoneNumber变量的值
  handlePhoneNumberInput(val) {
    if (val.detail.length == 11) {
      //手机号输入埋点
      inputMboblieViewBurialPoint()
      this.setData({
        phoneNumber: val.detail,
        verCodeDisabled: false,
      })
    } else {
      this.setData({
        verCodeDisabled: true,
      })
    }
  },
  //更新图形验证码输入框
  handleImgcodeInput(val) {
    if (val.detail.length > 1) {
      this.setData({
        verImgcode: val.detail,
        verCodeDisabled: false,
      })
    } else {
      this.setData({
        verCodeDisabled: true,
      })
    }
  },
  // 更新验证码变量的值
  handleVercodeInput(val) {
    let vallen = []
    if (val.detail.length > 1) {
      vallen.push(val.timeStamp)
      if (vallen.length > 1) {
        return
      }
      this.setData({
        vercode: val.detail,
        loginDisabled: false,
        isLogin: true,
      })
      if (val.detail.length > 6) {
        this.onClickLogin()
      }
    } else {
      this.setData({
        loginDisabled: true,
        isLogin: false,
      })
    }
  },
  //获取验证码
  getSmsCode() {
    this.requestSmsCode()
  },
  //发送验证码请求
  requestSmsCode() {
    //点击获取验证码埋点
    clickBthVerifyBurialPoint()
    loginMethods
      .loginSmCode({
        phoneNumber: this.data.phoneNumber,
        imgCode: this.data.verImgcode,
        randomToken: this.data.randomToken,
      })
      .then(() => {
        //短信验证码获取成功埋点
        getCodeBurialPoint({ mobile: this.data.phoneNumber })
        let time = 60
        this.setTime(time)
        this.setData({
          vercode: '',
          randomToken: '',
          verCodeInputshow: true, //显示验证码输入框
          verCodeDisabled: true,
          isLogin: true,
          loginBtnDes: '登录',
        })
      })
      .catch((error) => {
        console.log(error)
        if (error.data.code == 65011) {
          //获取图形验证码
          photoCodeEventBurialPoint()
          this.setData({
            imgCodeInputshow: true, //显示图形验证码输入框
            verCodeDisabled: true,
            imgcode: error.data.data.imgCode,
            randomToken: error.data.data.randomToken,
          })
          return
        }
        if (error.data.code == 1105) {
          let time = 60
          this.setTime(time)
          this.setData({
            vercode: '',
            randomToken: '',
            verCodeInputshow: true,
            verCodeDisabled: true,
            isLogin: true,
            loginBtnDes: '注册',
          })
          return
        }
        showToast(error.data.msg)
      })
  },
  //刷新图形验证码
  getImgCode() {
    this.data.imgcode = ''
    this.data.randomToken = ''
    this.setData({
      verImgcode: '',
    })
    this.requestSmsCode()
  },
  //验证码倒计时
  setTime(time) {
    //let that = this
    if (this.data.timer) clearInterval(this.data.timer)
    this.data.timer = setTimeout(() => {
      if (time > 1) {
        time--
        // 返回文案
        let tips = '重新获取（' + time + '）'
        this.setData({
          verCodeDes: tips,
        })
        // 迭代调用
        this.setTime(time)
      } else {
        // 倒计时最后一秒，解除禁用状态，可重新发送验证码
        this.setData({
          verCodeDes: '重新获取',
          verCodeDisabled: false,
        })
      }
    }, 1000)
  },
  //登陆交互逻辑
  onClickLogin() {
    //防止暴击
    if (this.data.isButtonClicked) {
      return
    }
    this.data.isButtonClicked = true
    // 执行按钮点击事件的操作
    setTimeout(() => {
      this.data.isButtonClicked = false
    }, 1000)
    //判断手机号
    var reg_tel = /^(1[3|4|5|6|7|8|9][0-9])\d{8}$/ //11位手机号码正则
    if (!reg_tel.test(this.data.phoneNumber)) {
      Toast({ context: this, position: 'bottom', message: '请输入正确的手机号码' })
      return
    }
    if (!this.data.agreeFlag) {
      this.setData({
        privacyShow: true,
      })
      return
    }
    if (this.data.isLogin) {
      this.loginTemp(0)
    } else {
      this.getSmsCode()
    }
  },
  //手机号验证码登陆
  loginTemp(loginType) {
    console.log('点击登陆')
    this.setData({
      loginBtnDes: '加载中',
    })
    this.setData({ isLoading: false })
    this.miniAppLogin(loginType)
      .then((res) => {
        if (res && res.status) {
          this.logoutTracking({
            ext_info: {
              logoutStatus: loginStatusMap[res.status],
            },
          })
        }
      })
      .catch((err) => {
        this.resetLoginBtnDes()
        const data = err && err.data
        if (data && data.code === 1403) {
          this.setData({
            accountAbnorDialogShow: true,
          })
        }
        // if (data && data.code == 1405) {
        //注销超过3天
        // clickEventTracking('user_page_view', null, {
        // module: '账号',
        // page_id: 'popups_page_deleted',
        // page_name: '账号注销成功后弹窗',
        // })
        // this.logoutTracking({
        // ext_info: {
        // logoutStatus: '注销成功3天后',
        // },
        // })
        // this.setData({
        // registerDialogShow: true,
        // })
        // }
        if (data && data.code === 1404) {
          //注销中
          this.setData({
            jwtToken: data.jwtToken || data.data.jwtToken,
            registeringDialogShow: true,
          })
          // 账号注销中
          this.logoutTracking({
            ext_info: {
              logoutStatus: '注销中',
            },
          })
        }
        if (data && data.code === 1407) {
          this.logoutTracking({
            ext_info: {
              logoutStatus: '注销成功3天内',
            },
          })
          this.setData({
            registerDialogShow: true,
          })
        }
      })
  },

  //登录注册
  miniAppLogin(loginType) {
    return new Promise((resolve, reject) => {
      const fullPageUr = getFullPageUrl('prev')
      console.log('跳转 fullPageUr', fullPageUr)
      let prevPage =
        fullPageUr === 'sub-package/mytab/pages/about/about' || undefined ? '/pages/index/index' : '/' + fullPageUr
      loginMethods
        .loginTempAPi({ phoneNumber: this.data.phoneNumber, vercode: this.data.vercode, loginType: loginType })
        .then((resp) => {
          //登录成功
          loginCheckResultBurialPoint({ mobile: this.data.phoneNumber })
          this.resetLoginBtnDes()
          //登录成功-进行初始化，同意隐私协议
          this.makeAgreeLatest(this.data.phoneNumber)
          resolve(resp)
          if (this.data.fms == 1) {
            wx.reLaunch({
              url: wetChatMiddlePage,
            })
            wx.removeStorageSync('fromWetChat')
          } else {
            setTimeout(() => {
              wx.reLaunch({
                url: prevPage,
              })
            }, 100)
          }
        })
        .catch((err) => {
          this.resetLoginBtnDes()
          console.log(err, 'actionGetphonenumber')
          WX_LOG.warn('login loginAPi catch', err)
          reject(err)
        })
    })
  },
  logoutTracking(extInfo) {
    const defaultData = {
      page_id: 'page_login',
      page_name: '登录页',
      module: '帐号',
      widget_id: 'logout_status',
      widget_name: '注销状态',
      ext_info: {},
    }
    const data = Object.assign({}, defaultData, extInfo)
    data.ext_info['if_sys'] = 1
    clickEventTracking('user_behavior_event', null, data)
  },
  //同意隐私协议
  async makeAgreeLatest(phoneNumber) {
    await this.getAgreementTitles()
    let self = this
    let data = {
      mobile: phoneNumber,
      agreeVersions: self.data.agreeVersions,
    }
    requestService
      .request('agreeLatestApi', data)
      .then(() => {})
      .catch(() => {})
  },
  // 通过弹窗重新注册登录
  reristerLogin(e) {
    this.setData({
      loginBtnDes: '重新注册',
    })
    const { type } = e
    if (type && type === 'confirm') {
      clickEventTracking('user_behavior_event', null, {
        module: '账号',
        page_id: 'popups_page_deleted',
        page_name: '账号注销成功后弹窗',
        widget_name: '重新注册',
        widget_id: 'click_register',
      })
      this.loginTemp(1)
    }
    if (type && type === 'cancel') {
      clickEventTracking('user_behavior_event', null, {
        module: '账号',
        page_id: 'popups_page_deleted',
        page_name: '账号注销成功后弹窗',
        widget_name: '再想想',
        widget_id: 'click_wait',
      })
    }
  },
  // 拨打电话
  makePhone() {
    wx.makePhoneCall({
      phoneNumber: '4008899315',
    })
  },
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },
})
