const app = getApp() //获取应用实例
import { requestService, uploadFileTask } from '../../utils/requestService'
import {webView} from '../../utils/paths'
import { getReqId, getStamp } from 'm-utilsdk/index'
import { showToast } from '../../utils/util'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    antiMobile: '',
    timeCount: 60,
    resendFlag: 'input-wrapper-again disabledResend',
    inputValue: '',
    hasFixlength: false,
    classForButton: 'changePhoneBtn haveSomeOpacity',
    _timer: null
  },
  resendCode() {
    if(this.data.timeCount > 0){
        return
    }
    this.setData({
        timeCount: 60,
        resendFlag: 'input-wrapper-again disabledResend',
        inputValue: '',
        hasFixlength: false
    })
    this.countSum()
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
  checkPhone() {
    wx.navigateBack({
        delta: 4
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
