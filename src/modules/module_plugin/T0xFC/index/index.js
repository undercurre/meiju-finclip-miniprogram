// T0xAC//index/index.js
import { DeviceData } from '../assets/scripts/device-data'
import { ui8List, ui8A0List } from '../assets/scripts/ui8List'

import pluginMixin from 'm-miniCommonSDK/utils/plugin-mixin'
Page({
  behaviors: [pluginMixin],
  /**
   * 页面的初始数据
   */
  data: {
    isInit: true,
    isShowTitle: true,
    title: '空气净化器',
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
  onPageScroll: function (event) {
    if (this.data.isCard1) {
      let bgColor = this.data.bgColor
      if (event.scrollTop > 20) {
        bgColor = '#F9F9F9'
      } else {
        bgColor = '#d5e2f5'
      }

      this.setData({
        bgColor,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let isCard0 = this.data.isCard0
    let isCard1 = this.data.isCard1
    let bgColor = this.data.bgColor
    do {
      if (DeviceData.isDebug) {
        this.setData({
          isInit: true,
        })
        break
      }
      let deviceInfo = JSON.parse(decodeURIComponent(options.deviceInfo))
      if (ui8List.includes(deviceInfo.sn8) || ui8A0List.includes(deviceInfo.modelNumber)) {
        isCard1 = true
        bgColor = '#d5e2f5'
      } else {
        isCard0 = true
        bgColor = '#f9f9f9'
      }
      wx.setBackgroundColor({
        backgroundColorTop: bgColor,
      })
      this.setData({
        isCard0,
        isCard1,
        bgColor,
      })
      this.getUrlparams(options)
    } while (false)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let deviceInfo = this.data.deviceInfo
    if (deviceInfo) {
      let title = deviceInfo.name
      this.setData({ title })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      fromApp: false,
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.destoriedPlugin()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return this.commonShareSetting()
  },
})
