const app = getApp() //获取应用实例
import { requestService, uploadFileTask } from '../../utils/requestService'
import { api } from '../../api'
import { getReqId, getStamp } from 'm-utilsdk/index'
import { showToast } from '../../utils/util'
import loginMethods from '../../globalCommon/js/loginRegister'
const timeLimit = 60
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    oldMobile: '',
    antiMobile: '',
    timeCount: timeLimit,
    resendFlag: 'input-wrapper-again disabledResend',
    inputValue: '',
    hasFixlength: false,
    classForButton: 'changePhoneBtn haveSomeOpacity',
    _timer: null,
    showValideCodeDialog: false,
    valideCodeInfo: {
        randomToken: '',
        imgCode: '',
        imgDataCode: '',
    },
  },
  backPage() {
    wx.navigateBack()
  },
  recheckPhone() {
    if(this.data.valideCodeInfo.imgCode.length <= 0){
        return
    }
    this.checkPhone({
        randomToken: this.data.valideCodeInfo.randomToken,
        imgCode: this.data.valideCodeInfo.imgCode
    })
    this.toggleValideCode()
  },
  toggleValideCode() {
    this.setData({}, {
        showValideCodeDialog: false
    })
  },
  checkPhone(requestParam) {
    let params = {
        iotData: {
            type: '7',
            iotAppId: api.iotAppId,
            src: '2',
            mobile: this.data.mobile,
            reqId: getReqId(),
            stamp: getStamp(new Date()),
        },
        data: {
            deviceId: this.data.oldMobile,
            appKey: '46579c15',
            ...requestParam
        },
        reqId: getReqId(),
        stamp: getStamp(new Date()),
        timestamp: getStamp(new Date()),
    }
    this.setData({ isLoading: true })
    // 请求后台，更换手机号码
    requestService.request('gitSmsCode', params).then(res => {
        this.handleResult(res)
    }).catch(res => {
        this.handleResult(res)
    }).finally(() => {
        this.setData({ isLoading: false })
    })
  },
  handleResult(res){
    console.log(`请求返回结果：${JSON.stringify(res)}`)
    switch(Number(res.data.code)) {
        case 0: 
            this.setData({
                timeCount: timeLimit,
                resendFlag: 'input-wrapper-again disabledResend',
                inputValue: '',
                hasFixlength: false
            })
            this.countSum()
            break;
        case 65011: 
            this.setData({
                showValideCodeDialog: true,
                valideCodeInfo: {
                    randomToken: res.data.data.randomToken,
                    imgCode: '',
                    imgDataCode: res.data.data.imgCode,
                }
            })
            break;
        case 1006: 
            showToast('手机号输入有误，请重新输入')
            break;
        case 1104: 
            showToast(`${this.data.mobile}手机号已注册，请更换新手机号`)
            break;
        default:
            showToast(res.data.msg || '系统错误，请稍后重试')
            break;
    }
  },
  changeValideCode(event){
    let valideCodeInfo = this.data.valideCodeInfo
    valideCodeInfo.imgCode = event.detail
    this.setData({
        valideCodeInfo: valideCodeInfo
    })
  },
  reflashCode() {
    this.checkPhone()
  },
  resendCode() {
    if(this.data.timeCount > 0){
        return
    }
    this.checkPhone()
  },
  countSum() {
    let timeCount = this.data.timeCount
    if(timeCount > 0){
        --timeCount
        let _timer = setTimeout(this.countSum, 1000)
        this.setData({
            timeCount: timeCount,
            resendFlag: `input-wrapper-again ${timeCount > 0 ? 'disabledResend' : ''}`,
            _timer: _timer
        })
    }
  },
  checkSmsCode() {
    let params = {
        iotData: {
            iotAppId: api.iotAppId,
            mobile: this.data.mobile,
            smsCode: this.data.inputValue,
            reqId: getReqId(),
            stamp: getStamp(new Date()),
            type: '7',
        },
        data: {
            deviceId: this.data.oldMobile
        },
        reqId: getReqId(),
        stamp: getStamp(new Date()),
        timestamp: getStamp(new Date()),
    }
    requestService.request('verifyUserCode', params).then(res => {
        this.handleVerifyResult(res)
    }).catch(res => {
        this.handleVerifyResult(res)
    })
  },
  handleVerifyResult(res){
    let code = Number(res.data.code)
        switch(code){
            case 0:
                this.bindPhone(res.data.data.randomCode)
                break;
            case 1101:
                showToast('验证码错误，请重新输入')
                break;
            default:
                showToast(res.data.msg || '系统错误，请稍后重试')
                break;
        }
  },
  bindPhone(randomCodeNew) {
    let params = {
        uid: app.globalData.userData.uid,
            newMobile: this.data.mobile,
            randomCodeNew: randomCodeNew,
            reqId: getReqId(),
            stamp: getStamp(new Date()),
            appVersion: '9.1.0'
    }
    this.setData({ isLoading: true })
    requestService.request('setBindUserPhone', params).then(res => {
        if(res.data.code == 0){
            let userInfo = wx.getStorageSync('userInfo')
            userInfo.userInfo.mobile = this.data.mobile
            wx.setStorageSync('userInfo', userInfo)
            loginMethods.loginAPi().then(() => {
                wx.navigateBack({
                    delta: 4
                })
            })
        }else{
            showToast(res.data.msg || '系统错误，请稍后重试')
        }
    }).catch(res => {
        showToast(res.data.msg || '系统错误，稍后重试')
    }).finally(() => {
        this.setData({ isLoading: false })
    })
  },
  clearCode() {
    this.setData({
        inputValue: '',
        hasFixlength: false,
        classForButton: `changePhoneBtn haveSomeOpacity`
    })
  },
  inputPhone(event) {
    let inputValue = event.detail.value
    this.setData({
        inputValue: inputValue,
        hasFixlength: inputValue.length != 0,
        classForButton: `changePhoneBtn ${inputValue.length == 0 ? 'haveSomeOpacity' : ''}`
    })
  },
  getVipUserInfo() {
    let data = {
      headParams: {},
      restParams: {
        sourceSys: 'IOT',
        userId: app.globalData.userData.userInfo.userId,
        brand: 1,
        mobile: app.globalData.userData.userInfo.mobile,
      },
    }
    requestService
      .request('getVipUserInfo', data)
      .then((res) => {
        wx.hideLoading()
        console.log(res.data.data.mobile, 'targetres')
        
      })
      .catch((err) => {
        wx.hideLoading()
        console.log(err, 'err')
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option) {
      this.setData({
        mobile: option.mobile,
        oldMobile: option.oldMobile,
        antiMobile: option.mobile.substring(0, 3) + '****' + option.mobile.substring(7)
      })
      this.countSum()
    // this.getVipUserInfo()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    if(this.setData._timer){
        clearTimeout(this.setData._timer)
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},
})
