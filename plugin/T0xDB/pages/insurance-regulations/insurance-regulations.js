/* eslint-disable no-unused-vars */
// plugin/T0xDB/pages/insurance-regulations/insurance-regulations.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    insuranceRegulations: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try {
      var value = wx.getStorageSync('washer_activity_insurance')
      if (value) {
        // Do something with return value
        this.setData(
          {
            insuranceRegulations: value.insuranceRegulations,
          },
          () => {}
        )
      }
    } catch (e) {
      // Do something when catch error
      wx.showToast({
        title: '未取得相关规则',
        icon: 'error',
        duration: 3000,
      })
      setTimeout((item) => {
        wx.navigateBack({
          delta: 1, //返回上一级页面
        })
      }, 3000)
    }
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
  onShareAppMessage: function () {},
})
