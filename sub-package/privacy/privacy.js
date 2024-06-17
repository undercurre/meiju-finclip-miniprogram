/*
 * @desc: 隐私协议同意跳转处理页面
 * @author: zhucc22
 * @Date: 2023-09-06 15:24:41
 */
// pages/privacy/privacy.js
import { getFullPageUrl } from '../../utils/util'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showPrivacy: true,
    fromPrivacy: true,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // 拒绝隐私协议
  exitPrePage() {
    const fullPageUr = getFullPageUrl('prev')
    let prevPage = '/' + fullPageUr
    setTimeout(() => {
      wx.reLaunch({
        url: prevPage,
      })
    }, 100)
  },
  // 同意隐私协议
  handleAgree() {
    this.exitPrePage()
  },
  handleDisagree() {
    //this.exitPrePage()
    wx.navigateBack({
      delta: 2,
    })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
})
