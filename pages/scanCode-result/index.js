/*
 * @desc:  扫码显示链接
 * @author: zhucc22
 * @Date: 2024-06-26 11:52:37
 */
import Toast from 'm-ui/mx-toast/toast'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    result: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let result = decodeURIComponent(options.result)
    this.setData({
      result: result,
    })
  },
  //返回
  onClickLeft() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack({
        delta: 1,
      })
    } else {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  },
  //复制链接
  clickCopyBtn() {
    wx.setClipboardData({
      data: this.data.result,
      success: function (res) {
        //Toast({ context: this, position: 'bottom', message: '复制成功' })
      },
      fail: function (err) {
        Toast({ context: this, position: 'bottom', message: '复制失败' })
      },
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
