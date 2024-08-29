import { getTimeStamp, getReqId, getUID, getStamp, hasKey } from 'm-utilsdk/index'
import { showToast } from '../../utils/util.js'
import { closeWebsocket } from '../../utils/initWebsocket.js'
import { requestService, rangersBurialPoint } from '../../utils/requestService'
import {
  setTokenStorage,
  setIsAutoLogin,
  setUserInfo,
  removeUserInfo,
  removeStorageSync,
  setTokenPwdStorge,
} from '../../utils/redis.js'
import { getPrivateKeys } from '../../utils/getPrivateKeys'
import { api } from '../../api'
import Toast from 'm-ui/mx-toast/toast'
let that = this
const loginMethods = {
  //获取设备相关信息
  getSystemInfo() {
    return new Promise((resolve, reject) => {
      wx.getSystemInfo({
        success(res) {
          resolve(res)
        },
        fail: (err) => {
          reject(err)
        },
      })
    })
  },
  //绑定帐号
  bindAccountApi() {
    return new Promise((resolve, reject) => {
      // this.updateCode().then(res => {
      let data = {
        timestamp: getStamp(),
        data: {
          appKey: '46579c15',
          appVersion: '1.0.0',
          osVersion: '',
          platform: 110,
        },
        iotData: {
          iotAppId: api.iotAppId,
          nickname: (getApp().globalData.userInfo && getApp().globalData.userInfo.nickName) || '',
          // "wxLoginCode": res.code,
          wxAccessToken: getApp().globalData.wxAccessToken || '',
          mobile: getApp().globalData.phoneNumber,
          prebind: true,
          invitationCode: '',
          reqId: getReqId(),
          stamp: getTimeStamp(new Date()),
        },
      }
      console.log('绑定接口传参', data)
      requestService
        .request('bindMuc', data)
        .then((res) => {
          if (res.data.code === 0) {
            console.log('绑定帐号成功res', res)
            getApp().globalData.userData = res.data.data
            getApp().globalData.phoneNumber = res.data.data.userInfo.mobile
            getApp().globalData.isLogon = true
            getPrivateKeys.getPrivateKeyAfterLogin()
            resolve(res)
          } else {
            console.log('绑定帐号失败res', res)
            showToast(res.data.msg || requestService.getErrorMessage(res.data.code))
            reject(res)
          }
        })
        .catch((err) => {
          if (!hasKey(err, 'data')) reject(err)
          if (!hasKey(err.data, 'code')) reject(err)
          reject(err)
        })
    })
  },
  //发送网络请求登陆小程序(自动登陆)
  async loginAPi() {
    // this.getSystemInfo().then((system) => {
    let system
    await wx.getSystemInfo({
      success(res) {
        system = res
      },
    })
    let userInfo = wx.getStorageSync('userInfo')
    let app = getApp() || this
    if (userInfo) {
      const noPromptCode = [1000, 1110, 1105, 1217, 1219, 1403, 1404, 1407, 1406, 65012]
      return new Promise((resolve, reject) => {
        let timestamp = getStamp()
        let reqId = getReqId()
        let reqData = {
          appKey: '46579c15',
          appVersion: app.globalData.appVersion || '1.0.0',
          osVersion: '',
          platform: 110,
          iotAppId: api.iotAppId,
          rule: 1,
          deviceId: system.deviceId || userInfo.userInfo.mobile || '',
          tokenPwd: userInfo.mdata.tokenPwdInfo.tokenPwd || '',
          uid: userInfo.uid || '',
          nickname: (userInfo.userInfo && userInfo.userInfo.nickName) || '',
        }
        let data = {
          timestamp: timestamp,
          stamp: getTimeStamp(new Date()),
          data: reqData,
          reqId: reqId,
        }
        //发起网络请求
        requestService
          .request('autoLogin', data)
          .then((res) => {
            if (res.data.code === 0 && res.data.data.accessToken) {
              console.log('autoLogin sucess res：', res)
              userInfo.mdata.accessToken = res.data.data.accessToken
              app.globalData.userData = userInfo
              app.globalData.phoneNumber = userInfo.userInfo.mobile
              app.globalData.isLogon = true
              app.globalData.wxExpiration = true
              removeUserInfo()
              setUserInfo(userInfo)
              setTokenStorage(res.data.data.accessToken, res.data.data.expired)
              setIsAutoLogin(true)
              if (userInfo.region || String(userInfo.region) == '0') {
                app.globalData.userRegion = userInfo.region
                wx.setStorageSync('userRegion', userInfo.region) //存储
              }
              getPrivateKeys.getPrivateKeyAfterLogin()
              resolve(userInfo)
            } else {
              console.log('login fail res :', res.data)
              app.globalData.isLogon = false
              reject(res)
            }
          })
          .catch((err) => {
            console.log('login catch res :', err)
            app.globalData.isLogon = false
            if (!hasKey(err, 'data')) {
              reject(err)
              return
            }
            if (!hasKey(err.data, 'code')) {
              reject(err)
              return
            }
            if (noPromptCode.indexOf(err.data.code) === -1) {
              showToast('程序员小哥哥植发去了，请稍后重试')
            }
            reject(err)
            return
          })
      })
    } else {
      app.globalData.isLogon = false
    }
    // })
  },
  //获取缓存信息
  getUserInfo(userInfo) {
    let app = getApp() || this
    app.globalData.userData = userInfo
    app.globalData.phoneNumber = userInfo.userInfo.mobile
    app.globalData.isLogon = true
    app.globalData.wxExpiration = true
    setUserInfo(userInfo)
    //setTokenStorage(userInfo.mdata.accessToken)
    setIsAutoLogin(true)
    if (userInfo.region || String(userInfo.region) == '0') {
      app.globalData.userRegion = userInfo.region
      wx.setStorageSync('userRegion', userInfo.region) //存储
    }
  },
  // //获取验证码
  loginSmCode(params) {
    return new Promise((resolve, reject) => {
      let app = getApp() || this
      let data = {
        data: {
          appKey: '46579c15',
          imgCode: params.imgCode,
          randomToken: params.randomToken,
          deviceId: app.globalData.appSystemInfo.deviceId || params.phoneNumber,
        },
        iotData: {
          iotAppId: api.iotAppId,
          type: '9',
          mobile: params.phoneNumber,
        },
      }
      requestService
        .request('gitSmsCode', data)
        .then((res) => {
          if (res.data.code === 0) {
            resolve(res)
          } else {
            reject(res)
          }
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  //验证码和手机号请求注册登陆小程序
  loginTempAPi(params) {
    // let systemInfo = wx.getSystemInfo()
    console.log('获取设备ID------.', getApp().globalData.appSystemInfo)
    const noPromptCode = [1000, 1110, 1105, 1217, 1219, 1403, 1404, 1407, 1406]
    return new Promise((resolve, reject) => {
      let app = getApp() || this
      let timestamp = getStamp()
      let reqId = getReqId()
      let reqData = {
        clientType: 6,
        appKey: '46579c15',
        appVersion: app.globalData.appVersion || '9.0,',
        osVersion: '',
        platform: 110,
        deviceId: app.globalData.appSystemInfo.deviceId || params.phoneNumber,
        smsCode: params.vercode,
      }
      let data = {
        timestamp: timestamp,
        data: reqData,
        iotData: {
          clientType: 6,
          iotAppId: api.iotAppId,
          mobile: params.phoneNumber,
          smsCode: params.vercode,
          deviceId: app.globalData.appSystemInfo.deviceId || params.phoneNumber,
          nickname: (app.globalData.userInfo && app.globalData.userInfo.nickName) || '',
          reqId: reqId,
          stamp: getTimeStamp(new Date()),
          appVersion: app.globalData.appVersion || '9.0,',
          loginType: params.loginType, //0：正常登录流程 （不传默认0） 1:  跳过过判断三天内不能重新注册流程
        },
      }
      // 发起网络请求
      requestService
        .request('register', data)
        .then((res) => {
          if (res.data.code === 0) {
            console.log('loginMuc sucess res：', res)
            app.globalData.userData = res.data.data
            app.globalData.phoneNumber = res.data.data.userInfo.mobile
            app.globalData.isLogon = true
            app.globalData.wxExpiration = true
            console.log('储存用户信息', res.data.data)
            setUserInfo(res.data.data)
            setTokenStorage(res.data.data.mdata.accessToken, res.data.data.mdata.expired)
            setTokenPwdStorge(res.data.data.mdata.tokenPwdInfo.expiredDate, res.data.data.mdata.tokenPwdInfo.tokenPwd)
            setIsAutoLogin(true)
            if (res.data.data.region || String(res.data.data.region) == '0') {
              app.globalData.userRegion = res.data.data.region
              wx.setStorageSync('userRegion', res.data.data.region) //存储
            }
            getPrivateKeys.getPrivateKeyAfterLogin()
            resolve(res.data.data)
          } else {
            console.log('login fail res :', res.data)
            app.globalData.isLogon = false
            reject(res)
          }
        })
        .catch((err) => {
          console.log('login catch res :', err)
          getApp().globalData.isLogon = false
          if (!hasKey(err, 'data')) {
            reject(err)
            return
          }
          if (!hasKey(err.data, 'code')) {
            reject(err)
            return
          }
          if (noPromptCode.indexOf(err.data.code) === -1) {
            let msg = this.scodeResonse(err.data)
            //showToast(msg)
            Toast({ context: that, position: 'bottom', message: '系统异常，请稍后重试' })
          }
          reject(err)
        })
    })
  },

  //解析登录错误结果
  scodeResonse(data) {
    const { code, msg } = data
    let label = '未知系统错误'
    switch (code) {
      case 1100:
        label = '验证码已过期'
        break
      case 1104:
        label = '手机号不正确'
        break
      case 1106:
        label = '手机号格式不正确'
        break
      case 1101:
        label = '请输入正确的验证码'
        break
      case 1129:
        label = '获取频繁，请稍后再试'
        break
      case 40429:
        label = '获取频繁，请稍后再试'
        break
      case 65009:
        label = '验证码错误，请重新输入'
        break
      default:
        label = msg
        break
    }
    return label
  },

  getPhoneNumber(e) {
    console.log('隐私测试', e)
    return new Promise((resolve, reject) => {
      this.decryptPhoneNumberApi(e)
        .then(() => {
          this.bindAccountApi().then(
            (res) => {
              wx.hideLoading()

              resolve(res)
            },
            (resData) => {
              wx.hideLoading()
              //绑定不成功，设置未登录状态
              console.log('bind err', resData)
              if (resData.data.code == 1105) {
                //帐户不存在
                resolve(resData)
              } else {
                wx.showToast({
                  icon: 'none',
                  title: resData.data.msg || requestService.getErrorMessage(resData.data.code),
                })
                reject()
              }
            }
          )
        })
        .catch((err) => {
          wx.hideLoading()
          //解密手机号失败
          reject(err)
        })
    })
  },
  //页面浏览
  pageViewTrack(page_name) {
    // if (this.data.gdt_vid || this.data.channel || this.data.subchannel) {
    this.getOpendId().then(() => {
      this.eventTracking('splash_page_view', {
        page_name: page_name,
      })
    })
    // }
  },
  phoneNumberTrack() {
    this.eventTracking('splash_button_click', {
      page_name: '帐号授权弹窗',
      element_content: '允许',
    })
  },
  buttonClickTrack(params) {
    this.eventTracking('splash_button_click', {
      ...params,
    })
  },
  setTackParams(params) {
    this.setData({
      ...params,
    })
  },
  eventTracking(event, params) {
    console.log(
      '埋点参数',
      this.data.channel,
      this.data.shareSpreadId,
      this.data.gdt_vid,
      getApp().globalData.openId,
      this.data.activity_name,
      params['page_name'],
      params['element_content']
    )
    // if (this.data.gdt_vid || this.data.channel || this.data.subchannel) {
    if (event.indexOf('page_view') !== -1) {
      rangersBurialPoint('splash_page_view', {
        module: '活动',
        activity_name: this.data.activity_name || '美的美居',
        page_name: params['page_name'],
        spreadid: this.data.shareSpreadId || '',
        channel: this.data.channel || '', //渠道
        subchannel: this.data.subchannel || '', //渠道子类
        activity_id: '',
        click_id: this.data.gdt_vid,
        openId: getApp().globalData.openId || '',
      })
    } else if (event.indexOf('button_click') !== -1) {
      rangersBurialPoint('splash_button_click', {
        module: '活动',
        activity_name: this.data.activity_name || '美的美居',
        page_name: params['page_name'],
        activity_id: '',
        spreadid: this.data.shareSpreadId || '',
        channel: this.data.channel || '', //渠道
        subchannel: this.data.subchannel || '', //渠道子类
        click_id: this.data.gdt_vid,
        openId: getApp().globalData.openId || '',
        element_content: params['element_content'],
      })
    } else if (event.indexOf('user_authorized') !== -1) {
      rangersBurialPoint('user_authorized', {
        module: '活动',
        activity_name: this.data.activity_name || '美的美居',
        page_name: '帐号授权弹窗',
        activity_id: '',
        spreadid: this.data.shareSpreadId || '',
        channel: this.data.channel || '', //渠道
        subchannel: this.data.subchannel || '', //渠道子类
        // uid: this.data.uid || app.globalData.uid || '',
        click_id: this.data.gdt_vid || '',
        openId: getApp().globalData.openId || '',
        mobile: getApp().globalData.phoneNumber || '',
        code: params['code'],
        login_result: params['login_result'],
      })
    } else if (event.indexOf('device_view') !== -1) {
      rangersBurialPoint('device_view', {
        module: '活动',
        page_name: '首页',
        tab_name: params['tab_name'],
        apptype_name: params['apptype_name'],
        widget_cate: params['widget_cate'],
        spreadid: this.data.shareSpreadId || '',
        channel: this.data.channel || '', //渠道
        subchannel: this.data.subchannel || '', //渠道子类
        click_id: this.data.gdt_vid || '',
        openId: getApp().globalData.openId || '',
      })
    }
    // }
  },
  // 退出登录
  logout() {
    getApp().globalData.isLogon = false
    wx.removeStorageSync('batchAuthList')
    getApp().globalData.applianceAuthList = null
    removeStorageSync()
    closeWebsocket()
    // clearStorageSync()
    setIsAutoLogin(false)
    removeUserInfo()
  },
  // 获取是否在c4a提交注销
  getLogoutStatus() {
    return new Promise((resolve, reject) => {
      requestService
        .request('getLogOutStatus', {})
        .then((res) => {
          const data = res.data
          resolve(data)
        })
        .catch((e) => {
          console.log(e, 'logout')
          reject()
        })
    })
  },
  getDcpDeviceImgs() {
    let reqData = {
      reqId: getReqId(),
      stamp: getStamp(),
    }
    let that = this
    return new Promise((resolve, reject) => {
      requestService
        .request('getIotDeviceV3', reqData)
        .then((res) => {
          console.log('列表查询', res)
          if (res.data.code == 0) {
            resolve(res.data.data.iconList)
            // wx.setStorageSync('dcpDeviceImgList', res.data.data.iconList)
            // that.globalData.dcpDeviceImgList = res.data.data.iconList
          }
          // resolve(res.data.data.iconList)
        })
        .catch((error) => {
          console.log(error)
          reject()
        })
    })
  },
  // 校验是否需要强制更新
  checkIsUpdate(version) {
    let reqData = {
      iotAppId: api.iotAppId,
      clientType: 5,
      version: version,
    }
    let that = this
    return new Promise((resolve, reject) => {
      requestService
        .request('checkIsUpdate', reqData)
        .then((res) => {
          console.log('校验登录', res)
          if (res.data.code == 0) {
            resolve(res.data.data)
          }
        })
        .catch((error) => {
          console.log(error)
          reject()
        })
    })
  },
}
export default loginMethods
