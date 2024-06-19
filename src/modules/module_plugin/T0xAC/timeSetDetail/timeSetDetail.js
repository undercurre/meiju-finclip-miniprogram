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
import Helper from '../util/Helper'

let key = app.globalData?.userData?.key
let appKey = app.getGlobalConfig().appKey

const hour = [];
const minute = [];

for (let i = 0; i <= 23; i++) {
  hour.push(i)
}

for (let i = 0; i <= 59; i++) {
  minute.push(i)
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    setType: 'timerOn', // 标记是定时开还是定时关
    hour: hour,
    minute: minute,
    dayArr: [{
        text: "一",
        selected: false,
        val: 1
      },
      {
        text: "二",
        selected: false,
        val: 2
      },
      {
        text: "三",
        selected: false,
        val: 3
      },
      {
        text: "四",
        selected: false,
        val: 4
      },
      {
        text: "五",
        selected: false,
        val: 5
      },
      {
        text: "六",
        selected: false,
        val: 6
      },
      {
        text: "日",
        selected: false,
        val: 7
      },
    ],
    mark2: ['10°C', '15°C', '20°C', '25°C', '30°C', '35°C'],
    waterTemp:10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let acstatus = {}
    let that = this;
    let type = options.type;
    // this.initListener();
    this.setData({
      setType: type
    })
    this.initTitle(type);



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
  initListener() {
    app.globalData.DeviceComDecorator.event.on(
      'receiveMessageLan',
      (data) => {
        console.log(
          '定时设置',
          app.globalData.DeviceComDecorator.AcProcess.parser.sendingState,
          data
        )
      },
      'timeSetDetail'
    )
  },
  initTitle(type) {
    if (type == "timerOn") {
      wx.setNavigationBarTitle({
        title: "定时开机任务"
      })
    } else {
      wx.setNavigationBarTitle({
        title: "定时关机任务"
      })
    }
  },
  dayPick(e) {
    console.log(e);
    let selectItem = e.currentTarget.dataset.item;
    this.data.dayArr[selectItem.val - 1].selected = !this.data.dayArr[selectItem.val - 1].selected
    this.setData({
      dayArr: this.data.dayArr
    })
  },
  resetPick() {
    for (let index = 0; index < this.data.dayArr.length; index++) {
      this.data.dayArr[index].selected = false;
    }
    this.setData({
      dayArr: this.data.dayArr
    })
  }
})
