import { baseImgApi, privacyApi } from '../../api'
import { requestService, rangersBurialPoint } from '../../utils/requestService'
import { getFullPageUrl, showToast } from '../../utils/util'
import { index, virtualPlugin, wetChatMiddlePage } from '../../utils/paths.js'
import config from '../../config.js' //环境及域名基地址配置
const loginBtnOff = baseImgApi.url + 'denglu_btn_off.png'
const loginBtnOn = baseImgApi.url + 'denglu_btn_on.png'
const loginLogoSrc = baseImgApi.url + 'denglu_img_logo.png'
import loginMethods from '../../globalCommon/js/loginRegister.js'
import { clickEventTracking } from '../../track/track.js'
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
    duration: 300,
    transitionName: 'fade-up',
    timer: null,
  },
  setLoginLogoTop() {
    let marginHeight = (app.globalData.systemInfo.screenHeight * 2 * 290) / 1624
    this.setData({
      logoTop: marginHeight ? marginHeight : 290,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.userPageViewTrack()
    this.getAgreementTitles()
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
  //同意服务和隐私协议
  onConfirm() {
    this.setData({
      agreeFlag: true,
    })
    if (this.data.isLogin) {
      this.loginTemp()
    } else {
      this.getSmsCode()
    }
  },
  changeAgree() {
    this.setData({
      agreeFlag: !this.data.agreeFlag,
    })
  },
  userPageViewTrack() {
    rangersBurialPoint('user_page_view', {
      module: '公共', //写死 “活动”
      page_id: 'page_login', //参考接口请求参数“pageId”
      page_name: '登录页', //当前页面的标题，顶部的title
      page_path: getFullPageUrl(), //当前页面的URL
      page_module: '公共',
    })
  },
  userBehaviorEventTrack(widget_id, widget_name) {
    rangersBurialPoint('user_behavior_event', {
      module: '公共', //写死 “活动”
      page_id: 'page_login', //参考接口请求参数“pageId”
      page_name: '登录页', //当前页面的标题，顶部的title
      page_path: getFullPageUrl(), //当前页面的URL
      widget_id: widget_id,
      widget_name: widget_name,
      page_module: '公共',
    })
  },
  agreeToast() {
    this.userBehaviorEventTrack('toast_login_notice', '请先阅读条款toast')
    wx.showToast({
      title: '请先阅读并同意相关协议',
      icon: 'none',
      duration: 1000,
    })
  },
  goPrivacy(e) {
    let type = e.currentTarget.dataset.type
    let prodType = e.currentTarget.dataset.prodtype
    console.log('privacyApi.url', privacyApi.url)
    let currLink = `${privacyApi.url}/mobile/agreement/?system=midea_app_lite&agreement_type=${type}`
    if (prodType) {
      currLink = `${privacyApi.url}/mobile/agreement/?system=${
        config.environment == 'prod' ? 'meiju_lite_app' : 'meijuapp'
      }&agreement_type=${config.environment == 'prod' ? prodType : type}`
    }

    let encodeLink = encodeURIComponent(currLink)
    let currUrl = `/pages/webView/webView?webViewUrl=${encodeLink}`
    console.log('新C4A隐私条款链接===', encodeLink)
    wx.navigateTo({
      url: currUrl,
    })
  },
  getAgreementTitles() {
    let self = this
    requestService
      .request('agreementTitleApi', {})
      .then((res) => {
        if (res.data.code == '0') {
          let titleResult = res.data.result
          this.getAgreeVersions(titleResult)
          self.setData({
            titleResult,
          })
        }
      })
      .catch(() => {})
  },
  getAgreeVersions(titleResult) {
    let agreeVersions = []
    titleResult.forEach((item) => {
      let currInfo = {
        type: item['type'],
        version: item['agreementVersion'],
      }
      agreeVersions.push(currInfo)
    })
    this.setData({
      agreeVersions,
    })
  },
  resetLoginBtnDes() {
    setTimeout(() => {
      this.setData({
        loginBtnDes: '登录',
      })
    }, 1000)
  },
  // 跳转到c4a注销页面
  getJwtToken() {
    const wxAccessToken = app.globalData.wxAccessToken
    requestService
      .request('getJwtToken', { wxAccessToken })
      .then((res) => {
        const data = res.data
        if (+data.code === 0) {
          const host = `${config.privacyDomain[config.environment]}`
          const url = `${host}/mobile/cancellation/?system=midea_app_lite&jwt_token=${data.data}&redirect_uri=&is_switch_tab=true`
          console.log(url, 'logouturl')
          wx.navigateTo({
            url: `/sub-package/webview/defaultWebview/defaultWebview?webViewUrl=${encodeURIComponent(
              url
            )}&needCheckLogStatus=true`,
          })
        } else {
          showToast('程序员小哥哥植发去了，请稍后重试')
        }
      })
      .catch((e) => {
        console.log(e, 'logout')
      })
  },

  // 更新phoneNumber变量的值
  handlePhoneNumberInput(val) {
    if (val.detail.length == 11) {
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
        loginDisabled: false,
      })
      // this.loginTemp()
    } else {
      this.setData({
        loginDisabled: true,
      })
    }
  },
  // 更新验证码变量的值
  handleVercodeInput(val) {
    let vallen = []
    console.log('验证码--->', val)
    if (val.detail.length == 6) {
      vallen.push(val.timeStamp)
      if (val.length > 1) {
        return
      }
      this.setData({
        vercode: val.detail,
        loginDisabled: false,
        isLogin: true,
      })
      this.onClickLogin()
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
    loginMethods
      .loginSmCode({
        phoneNumber: this.data.phoneNumber,
        imgCode: this.data.verImgcode,
        randomToken: this.data.randomToken,
      })
      .then(() => {
        let time = 60
        this.setTime(time)
        this.setData({
          vercode: '',
          randomToken: '',
          verCodeInputshow: true, //显示验证码输入框
          verCodeDisabled: true,
          loginBtnDes: '登录',
        })
      })
      .catch((error) => {
        console.log(error)
        if (error.data.code == 65011) {
          this.setData({
            imgCodeInputshow: true, //显示图形验证码输入框
            imgcode: error.data.data.imgCode,
            randomToken: error.data.data.randomToken,
          })
          return
        }
        showToast(error.data.msg)
      })
  },
  //刷新图形验证码
  getImgCode() {
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
        let tips = time + 's'
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
    if (!this.data.agreeFlag) {
      this.setData({
        privacyShow: true,
      })
      return
    }
    if (this.data.isLogin) {
      this.loginTemp()
    } else {
      this.getSmsCode()
    }
  },
  // 检查openid情况
  checkAndGetOpenId() {
    return new Promise((resolve, reject) => {
      if (app.globalData.isGetOpenId && app.globalData.wxAccessToken) {
        resolve()
        return
      }
      loginMethods
        .getOpendId({ reqGetOpenIdChannel: 'login' })
        .then(() => {
          resolve()
        })
        .catch(() => {
          reject()
        })
    })
  },
  //手机号验证码登陆
  loginTemp() {
    console.log('点击登陆')
    this.setData({
      loginBtnDes: '加载中',
    })
    this.userBehaviorEventTrack('click_mobile_login', '微信手机号快速登录')
    this.setData({ isLoading: false })
    this.miniAppLogin()
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
        if (data && data.code === 1404) {
          // 账号注销中
          this.logoutTracking({
            ext_info: {
              logoutStatus: '注销中',
            },
          })
          this.getJwtToken()
        }
      })
  },

  actionGetphonenumber(props) {
    console.log('授权手机回调', props)
    WX_LOG.info('login actionGetphonenumber wxres', props)
    this.setData({
      showEditAppliancePop: true,
      loginBtnDes: '加载中',
    })
    this.userBehaviorEventTrack('click_mobile_login', '微信手机号快速登录')
    const e = props
    this.checkAndGetOpenId()
      .then(() => {
        loginMethods
          .getPhoneNumber(e)
          .then((res) => {
            console.log('bindRes:', res)
            this.setData({ isLoading: false })
            if (res.data.code === 1105) {
              this.miniAppRegister({ isFirstReq: true })
            } else {
              this.miniAppLogin()
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
                  WX_LOG.warn('login getPhoneNumber catch', err)
                  const data = err && err.data
                  if (data && data.code === 1404) {
                    // 账号注销中
                    this.logoutTracking({
                      ext_info: {
                        logoutStatus: '注销中',
                      },
                    })
                    this.getJwtToken()
                  }
                })
            }
          })
          .catch(() => {
            // showToast(globalErrText.errText)
            this.resetLoginBtnDes()
          })
      })
      .catch((e) => {
        WX_LOG.warn('login checkAndGetOpenId catch', e)
        this.resetLoginBtnDes()
      })
  },
  miniAppLogin() {
    return new Promise((resolve, reject) => {
      const fullPageUr = getFullPageUrl('prev')
      console.log('跳转 fullPageUr', fullPageUr)
      let prevPage =
        fullPageUr === 'sub-package/mytab/pages/about/about' || undefined ? '/pages/index/index' : '/' + fullPageUr
      loginMethods
        .loginTempAPi({ phoneNumber: this.data.phoneNumber, vercode: this.data.vercode })
        .then((resp) => {
          this.resetLoginBtnDes()
          //登录成功-进行初始化
          this.makeAgreeLatest()
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
          if (err.data.code === 1406) {
            this.showPopup()
          }
          reject(err)
          // showToast(globalErrText.errText)
        })
    })
  },
  /**
   * 小程序注册
   * @param {*} params { isFirstReq: false } 是否需要后端校验用户是否注销过
   * @return {*} Promise
   */
  miniAppRegister(params) {
    return new Promise((resolve) => {
      loginMethods
        .registerApi(params)
        .then((resp) => {
          console.log(resp, 'resp register')
          this.setData({
            uid: resp.uid,
            isLogon: true,
          })
          if (resp && resp.status) {
            this.logoutTracking({
              ext_info: {
                logoutStatus: loginStatusMap[resp.status],
              },
            })
          }
          this.miniAppLogin()
          resolve(resp)
        })
        .catch((err) => {
          console.log(err, 'err register')
          WX_LOG.warn('login registerApi catch', err)
          this.resetLoginBtnDes()
          const data = err && err.data
          if (data && data.code === 1405) {
            // 1405用户已注销，提示是否重新注册 1407账号已注销未超三天
            clickEventTracking('user_page_view', null, {
              module: '账号',
              page_id: 'popups_page_deleted',
              page_name: '账号注销成功后弹窗',
            })
            this.setData({
              registerDialogShow: true,
            })
          } else if (data && data.code === 1406) {
            this.showPopup()
          }
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
  makeAgreeLatest() {
    let self = this
    let data = {
      mobile: app.globalData.phoneNumber,
      agreeVersions: self.data.agreeVersions,
    }
    requestService
      .request('agreeLatestApi', data)
      .then(() => {})
      .catch(() => {})
  },
  // 通过弹窗重新注册登录
  reristerLogin(e) {
    console.log(e, 'register')
    const { type } = e.detail
    if (type && type === 'confirm') {
      clickEventTracking('user_behavior_event', null, {
        module: '账号',
        page_id: 'popups_page_deleted',
        page_name: '账号注销成功后弹窗',
        widget_name: '重新注册',
        widget_id: 'click_register',
      })
      this.miniAppRegister({ isFirstReq: false })
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
  // 展示黑产用户提示语弹框
  showPopup() {
    let that = this
    wx.showModal({
      content: '帐号存在异常，暂时无法登录，请联系客服解决~',
      cancelText: '取消',
      cancelColor: '#000',
      confirmText: '联系客服',
      confirmColor: '#267AFF',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.makePhone()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      },
    })
  },
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },
})
