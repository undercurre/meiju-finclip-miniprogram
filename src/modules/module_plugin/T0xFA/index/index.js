import pluginMixin from 'm-miniCommonSDK/utils/plugin-mixin'

import { ui8List, ui8A0List } from '../assets/scripts/ui8List'

Page({
  behaviors: [pluginMixin],
  /**
   * 页面的初始数据
   */
  data: {
    title: '风扇',
    isCard0: false,
    isCard1: false,
    bgColor: '#d5e2f5',
  },
  onClickLeft() {
    wx.navigateBack({
      delta: 1,
      fail: (err) => {
        wx.switchTab({
          url: '/pages/index/index',
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onPageScroll: function (event) {
    if (this.data.isCard1) {
      let bgColor = this.data.bgColor
      bgColor = event.scrollTop > 20 ? '#F9F9F9' : '#d5e2f5'
      this.setData({
        bgColor,
      })
    }
  },
  onLoad: async function (options) {
    let isCard0 = this.data.isCard0
    let isCard1 = this.data.isCard1
    let bgColor = this.data.bgColor
    let deviceInfo = JSON.parse(decodeURIComponent(options.deviceInfo))
    if (ui8List.includes(deviceInfo.sn8) || ui8A0List.includes(deviceInfo.modelNumber)) {
      isCard1 = true
      bgColor = '#d5e2f5'
    } else {
      isCard0 = true
      bgColor = '#f9f9f9'
    }
    console.log('bgColor:', bgColor)
    wx.setBackgroundColor({
      backgroundColorTop: bgColor,
    })

    this.setData({
      isCard0,
      isCard1,
      bgColor,
    })
    this.getUrlparams(options)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let title = this.data?.deviceInfo?.name
    this.setData({ title })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    this.setData({
      fromApp: false,
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.destoriedPlugin()
  },

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
  onShareAppMessage: function () {
    return this.commonShareSetting()
  },
})
