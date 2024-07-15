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
    mobile: '', //手机号码
    headImgUrl: '', //用户头像
    targetMobile: ''
  },
  backPage() {
    wx.navigateBack()
  },
//   注销账号
  cancelAccount() {
    wx.navigateTo({
      url: `${webView}?webViewUrl=${encodeURIComponent('https://www.baidu.com')}`,
    })
  },
  changePhone(){
    wx.navigateTo({
        url: '../checkPhone/checkPhone',
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
            mobile: res.data.data.mobile,
            headImgUrl: res.data.data.userCustomize.headImgUrl,
            targetMobile: res.data.data.mobile.substring(0, 3) + '****' + res.data.data.mobile.substring(7), //手机号脱敏，暂时先简单处理
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
