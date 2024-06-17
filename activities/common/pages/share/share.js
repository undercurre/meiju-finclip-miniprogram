// activities/common/pages/share/share.js
import { imgBaseUrl } from '../../../../api.js'
import { getTimeStamp, getUID } from 'm-utilsdk/index'
import { requestService } from '../../../../utils/requestService'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: `${imgBaseUrl.url}/common/`,
    url: '',
    title: '',
    image: '',
    isAnnual: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    this.data.url = options['url']
    this.data.title = options['title']
    this.data.image = options['image']
    this.data.isAnnual = options['isAnnual']
  },

  cancel() {
    wx.navigateBack({
      delta: -1,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

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
  onShareAppMessage: function (res) {
    if (res.from === 'button' && this.data.isAnnual) {
      let params = {
        reqId: getUID(),
        stamp: getTimeStamp(new Date()),
        uid: app.globalData.userData.uid,
        activityId: 'HD20211223WDZHSH',
      }
      requestService
        .request('annualShare', params)
        .then((res) => {
          console.log('分享成功', res)
        })
        .catch((err) => {
          console.log('分享失败', err)
        })
    }
    setTimeout(() => {
      this.cancel()
    }, 1000)
    return {
      title: this.data.title,
      imageUrl: `${this.data.image}`,
      path: `/pages/webView/webView?webViewUrl=${this.data.url}&loginState=true`,
    }
  },
})
