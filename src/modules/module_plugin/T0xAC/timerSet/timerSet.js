// plugin/T0xAC/electric/electric.js
let app = getApp()
var wxCharts = require('../util/wx-chart/wxcharts-min')
var lineChart = null
const requestService = app.getGlobalConfig().requestService
import moment from '../components/moment.min'
import {
  cloudDecrypt
} from 'm-utilsdk/index';
import selfApi from '../api/api'
import BleCommon from '../bluetooth/common'

let key = app.globalData?.userData?.key
let appKey = app.getGlobalConfig().appKey

Page({
  /**
   * 页面的初始数据
   */
  data: {
    timingArray: [{
      title: "定时开",
      type: "timerOn",
      detailTitle: "定时开机任务",
      selected: false
    },{
      title: "定时关",
      type: "timerOff",
      detailTitle: "定时关机任务",
      selected: false
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)    
    let that = this
    // let data = JSON.parse(decodeURIComponent(options.data))    
    // console.log(data.deviceInfo, '>>>>>>>')
    console.log(app.globalData.hasFuncs, "++++++++++++++++");

    if (options.ctrlType == 1) {      
      app.globalData.DeviceComDecorator._queryStatusNorthWarm()
      app.bluetoothConn.event.on('receiveMessagePlugin', (data) => {
        console.log(BleCommon.ab2hex(data), '>>>>>>>>>>>>>>>>接收到模组消息 timerSet')
        console.log(
          app.globalData.DeviceComDecorator.AcProcess.parser.sendingState,
          '>>>>>>>>>>接收到模组消息 timerSet'
        )        
      })
    } else if (options.ctrlType == 2) {
      console.log('wifi timerSet')      
      that.setData({
        
      })     
      app.globalData.DeviceComDecorator._queryTimerStatusNorthWarm()
      app.globalData.DeviceComDecorator.event.on(
        'receiveMessageLan',
        (data) => {           
          console.log('timerSet get wifi data', data, app.globalData.DeviceComDecorator.AcProcess.parser.sendingState);
          that.setData({
            'timingArray[0].selected': app.globalData.DeviceComDecorator.AcProcess.parser.sendingState.northWarmpowerOnTimer == 1,
            'timingArray[1].selected': app.globalData.DeviceComDecorator.AcProcess.parser.sendingState.northWarmpowerOffTimer == 1,
          })
        },
        'timerSet'
      )
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
  onUnload: function () {
    console.log('electric on unload')
    app.globalData.DeviceComDecorator.event.off('receiveMessageLan', (data) => {})
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
  onShareAppMessage: function () {},


  itemClick(e) {
    console.log(e);
    let type = e.currentTarget.dataset.item.type;

    wx.navigateTo({
      url: '../timeSetDetail/timeSetDetail?type=' + type,
    })
  },

  switchTimer(e) {
    console.log(e);
    let item = e.currentTarget.dataset.item;
    if (item.type == 'timerOn') {
      // 定时开
      if (!item.selected) {
        wx.showToast({
          title: '请在线控器上设置',
          icon: 'none'
        })
      } else {
        app.globalData.DeviceComDecorator.northWarmOnSwitchTimer(false)
      }
    } else if (item.type == 'timerOff') {
      // 定时关
      if (!item.selected) {
        wx.showToast({
          title: '请在线控器上设置',
          icon: 'none'
        })
      } else {
        app.globalData.DeviceComDecorator.northWarmOffSwitchTimer(false)
      }
    }
  }
})
