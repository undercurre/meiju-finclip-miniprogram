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
    mobileLeft: '',
    mobileRight: '',
    inputValue: '',
    inputList: ['', '', '', ''],
    hasFixlength: false,
    classForButton: 'changePhoneBtn haveSomeOpacity'
  },
  inputPhone(event) {
    let inputValue = event.detail.value
    let inputList = inputValue.split('')
    let preFixLength = 4 - inputValue.length
    for(var i = 0; i < preFixLength; i++){
        inputList.push('')
    }
    this.setData({
        inputValue: inputValue,
        inputList: inputList,
        hasFixlength: preFixLength == 0,
        classForButton: `changePhoneBtn ${preFixLength != 0 ? 'haveSomeOpacity' : ''}`
    })
  },
  checkPhone() {
    let checkPhoneNum = `${this.data.mobileLeft}${this.data.inputValue}${this.data.mobileRight}`
    if(this.data.mobile != checkPhoneNum){
        showToast('手机号验证失败，请重新输入')
    }else{
        wx.navigateTo({
            url: `../changePhone/changePhone?oldMobile=${checkPhoneNum}`,
        })
    }
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
            mobile: res.data.data.mobile,
            mobileLeft: res.data.data.mobile.substring(0, 3),
            mobileRight: res.data.data.mobile.substring(7)
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
  onLoad() {
    this.getVipUserInfo()
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
