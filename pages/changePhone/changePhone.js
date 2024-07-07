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
    oldMobile: '',
    inputValue: '',
    hasFixlength: false,
    classForButton: 'changePhoneBtn haveSomeOpacity'
  },
  inputPhone(event) {
    let inputValue = event.detail.value
    this.setData({
        inputValue: inputValue,
        hasFixlength: inputValue.length == 11,
        classForButton: `changePhoneBtn ${inputValue.length != 11 ? 'haveSomeOpacity' : ''}`
    })
  },
  checkPhone() {
    // let checkPhoneNum = `${this.data.mobileLeft}${this.data.inputValue}${this.data.mobileRight}`
    if(this.data.inputValue == this.data.oldMobile){
        showToast('与原手机号相同，无需重复绑定')
        return
    }
    // 请求后台，更换账号

    wx.navigateTo({
        url: `../checkValidecode/checkValidecode?mobile=${this.data.inputValue}&oldMobile=${this.data.oldMobile}`,
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
        this.setData({
            mobile: res.data.data.mobile
        })
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
        oldMobile: option.oldMobile
    })
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
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},
})
