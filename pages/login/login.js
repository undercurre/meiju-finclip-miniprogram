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
//const WX_LOG = require('../../utils/log')
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
    logoTop: app.globalData.systemInfo.statusNavBarHeight + 228,
    registerDialogShow: false,
    fms: 2,
    phoneNumber: '',
    verCode: '',
    imgCode: '',
    verImgCode: '',
    randomToken: '',
    showVerCode: false,
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
    autoVerImgCodeFocus: false,
    autoVerCodeFocus: false,
    userStatue: 'login',
    autoFocus: 'false',
    animationLogin1: {},
    animationLogin2: {},
    loading: false,
  },
  setLoginLogoTop() {
    //let marginHeight = (app.globalData.systemInfo.screenHeight * 2 * 140) / 1624
    let marginHeight = app.globalData.systemInfo.statusNavBarHeight + 228
    this.setData({
      logoTop: marginHeight ? marginHeight : 140,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setLoginLogoTop()
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
  onReady: function () {
    this.handleActionAnimation(false)
  },

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
  onHide: function () {
    //if (this.data.timer) clearTimeout(this.data.timer)
  },

  /**
   * 进出场动画
   * @param flag true/入场 false/出场
   */
  handleActionAnimation(flag) {
    const animation1 = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease',
    })
    const animation2 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    animation1.translateY(flag ? 0 : -30).step()
    animation2.translateY(flag ? 0 : -40).step()
    setTimeout(() => {
      this.setData({
        animationLogin1: animation1.export(),
        animationLogin2: animation2.export(),
      })
    }, 100)
  },
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
        loginBtnDes: this.data.userStatue == 'login' ? '登录' : '注册',
      })
    }, 1000)
  },
  //重置按钮
  resetLoginStatusBtnDes() {
    this.setData({
      loginBtnDes: this.data.userStatue == 'login' ? '登录中' : '注册并登录中',
    })
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
  onClear() {
    console.log('111')
  },
  // 更新phoneNumber变量的值
  handlePhoneNumberInput(val) {
    let value = val.detail.replace(/[^\d]/g, '')
    // 只允许输入数字
    // if (!/^[0-9]*$/.test(value)) {
    // value = value.substring(0, value.length - 1)
    // }
    this.setData({
      phoneNumber: value,
    })
    if (value.length == 0) {
      this.setData({
        //verCodeDisabled: false,
        autoFocus: true,
      })
    }
    if (value.length == 11) {
      //手机号输入埋点
      inputMboblieViewBurialPoint()
      this.setData({
        //verCodeDisabled: false,
        loginDisabled: false,
      })
    } else {
      if (this.data.timer) clearTimeout(this.data.timer)
      this.setData({
        loginBtnDes: '获取验证码',
        verCode: '',
        verImgCode: '',
        verCodeInputshow: false,
        imgCodeInputshow: false,
        loginDisabled: true,
        verCodeDisabled: true,
        isLogin: false,
      })
    }
  },
  //更新图形验证码输入框
  handleImgCodeInput(val) {
    if (val.detail.length > 1) {
      this.setData({
        //verCodeDisabled: false,
        loginDisabled: false,
        verImgCode: val.detail,
      })
      if (this.data.verCode.length > 1) {
        this.data.isLogin = true
      }
    } else {
      if (!this.data.timer) {
        this.setData({
          verCodeDisabled: false,
        })
      }
      this.setData({
        verImgCode: val.detail,
        loginDisabled: true,
      })
    }
  },
  handlePhoneFocus() {},
  // 更新验证码变量的值
  handleVerCodeInput(val) {
    let vallen = []
    let value = val.detail.replace(/[^\d]/g, '')
    this.setData({
      verCode: value,
    })
    if (value.length > 1) {
      vallen.push(val.timeStamp)
      if (vallen.length > 1) {
        return
      }
      if (!this.data.imgCodeInputshow || this.data.verImgCode.length > 1) {
        this.setData({
          loginDisabled: false,
          isLogin: true,
        })
      }

      if (val.detail.length == 6) {
        if (!this.data.loginDisabled) {
          this.onClickLogin()
        }
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
    this.setData({
      loginDisabled: true,
      loading: true,
    })
    //点击获取验证码埋点
    clickBthVerifyBurialPoint()
    loginMethods
      .loginSmCode({
        phoneNumber: this.data.phoneNumber,
        imgCode: this.data.verImgCode,
        randomToken: this.data.randomToken,
      })
      .then(() => {
        Toast({ context: this, position: 'bottom', message: '获取成功' })
        //短信验证码获取成功埋点
        getCodeBurialPoint({ mobile: this.data.phoneNumber })
        let time = 60
        this.setTime(time)
        this.setData({
          loginDisabled: false,
          loading: false,
          verCode: '',
          randomToken: '',
          verCodeInputshow: true, //显示验证码输入框
          loginDisabled: true,
          verCodeDisabled: true,
          isLogin: true,
          userStatue: 'login',
          loginBtnDes: '登录',
        })
        setTimeout(() => {
          this.setData({
            autoVerCodeFocus: true,
          })
        }, 200)
      })
      .catch((error) => {
        this.setData({
          loginDisabled: false,
          loading: false,
        })
        console.log(error)
        if (error.data.code == 65011) {
          //获取图形验证码
          photoCodeEventBurialPoint()
          this.setData({
            imgCodeInputshow: true, //显示图形验证码输入框
            loginDisabled: true,
            //verCodeDisabled: true,
            imgCode: error.data.data.imgCode,
            randomToken: error.data.data.randomToken,
          })
          setTimeout(() => {
            this.setData({
              autoVerImgCodeFocus: true,
            })
          }, 200)
          return
        }
        if (error.data.code == 1105) {
          let time = 60
          this.setTime(time)
          this.setData({
            verCode: '',
            randomToken: '',
            verCodeInputshow: true,
            verCodeDisabled: true,
            isLogin: true,
            userStatue: 'register',
            loginBtnDes: '注册',
          })
          setTimeout(() => {
            this.setData({
              autoVerCodeFocus: true,
            })
          }, 200)
          return
        }

        Toast({ context: this, position: 'bottom', message: error.data.msg })
        //showToast(error.data.msg)
      })
  },
  //刷新图形验证码
  getImgCode() {
    this.data.imgCode = ''
    this.data.randomToken = ''
    this.setData({
      verImgCode: '',
    })
    this.requestSmsCode()
  },
  //验证码倒计时
  setTime(time) {
    //let that = this
    if (this.data.timer) clearTimeout(this.data.timer)
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
        if (this.data.verCode.length < 2) {
          this.setData({
            loginDisabled: true,
          })
        }
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
      loginDisabled: true,
    })
    this.resetLoginStatusBtnDes()
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
    this.setData({
      loginDisabled: true,
      loading: true,
    })
    return new Promise((resolve, reject) => {
      const fullPageUr = getFullPageUrl('prev')
      console.log('跳转 fullPageUr', fullPageUr)
      let prevPage = fullPageUr === undefined ? '/pages/index/index' : '/' + fullPageUr
      // let prevPage =
      // fullPageUr === 'sub-package/mytab/pages/about/about' || undefined ? '/pages/index/index' : '/' + fullPageUr
      loginMethods
        .loginTempAPi({ phoneNumber: this.data.phoneNumber, vercode: this.data.verCode, loginType: loginType })
        .then((resp) => {
          this.setData({
            loginDisabled: false,
            loading: false,
          })
          //登录成功
          loginCheckResultBurialPoint({ mobile: this.data.phoneNumber })
          this.resetLoginBtnDes()
          //登录成功-进行初始化，同意隐私协议
          this.makeAgreeLatest(this.data.phoneNumber)
          resolve(resp)
          setTimeout(() => {
            wx.reLaunch({
              url: prevPage,
            })
          }, 100)
          if (this.data.timer) clearTimeout(this.data.timer)
        })
        .catch((err) => {
          this.resetLoginBtnDes()
          console.log(err, 'actionGetphonenumber')
          //WX_LOG.warn('login loginAPi catch', err)
          setTimeout(() => {
            this.setData({
              loading: false,
              loginDisabled: false,
            })
          }, 1000)
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
  clickBack() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack()
    } else {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
    console.log('回退页面清理定时器')
    if (this.data.timer) clearTimeout(this.data.timer)
  },
})
