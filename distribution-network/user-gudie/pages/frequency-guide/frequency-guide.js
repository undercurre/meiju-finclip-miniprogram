// distribution-network/addDevice/pages/frequencyGuide/frequencyGuide.js
const app = getApp()
const imgBaseUrl = getApp().getGlobalConfig().imgBaseUrl
const imgUrl = imgBaseUrl.url + '/shareImg/' + app.globalData.brand
import { imgesList } from '../../../assets/js/shareImg.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgBaseUrl: imgBaseUrl.url,
    //frequencyGuide
    frequencyGuide: imgUrl+ imgesList['wifi_help_content'],
    brand:app.globalData.brand
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {},

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
  onShareAppMessage: function () {},
})
