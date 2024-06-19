// plugin/T0xAC/aboutMac/aboutMac.js
// import {
//   api
// } from '../../../api.js'
// 上传NPM包指令
// npm login --registry=https://npm.midea.com/repository/U-MeijuApp/

// npm publish --registry=https://npm.midea.com/repository/U-MeijuApp/

// runze.tan@midea.com

import selfApi from '../api/api'
let app = getApp()
// let key = app.globalData.userData.key
// let appKey = app.getGlobalConfig().appKey

Page({
  /**
   * 页面的初始数据
   */
  data: {
    originDeviceInfo:"",
    date: '',
    containerData: {},
    deviceInfo: '',
    arr: [{
      title: "功能说明",
      hasNextPage: true,
      text: ""
    }, {
      title: "本机条码",
      hasNextPage: false,
      text: ""
    }, {
      title: "生产日期",
      hasNextPage: false,
      text: ""
    }, {
      title: "插件版本",
      hasNextPage: false,
      text: ""
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.currDeviceInfo, '>>>>>>')
    let infos = JSON.parse(decodeURIComponent(options.currDeviceInfo))    
    let deviceSnBle = options.deviceSnBle
    let sn = ''
    console.log(JSON.stringify(infos), "infos")
    // if (options.ctrlType == 1) {
    //   if (infos.sn.length == 32) {
    //     sn = infos.sn
    //   } else {
    //     sn = deviceSnBle
    //   }
    // } else {      
    // }
    // if(cloudDecrypt(infos.sn, app.globalData.userData.key, appKey) != '' && cloudDecrypt(infos.sn, app.globalData.userData.key, appKey) != undefined) {
    //   console.log('默认使用解析sn', cloudDecrypt(infos.sn, app.globalData.userData.key, appKey))
    //   sn = cloudDecrypt(infos.sn, app.globalData.userData.key, appKey);
    // } else if(deviceSnBle && options.ctrlType == 1) {
    //   console.log('sn解析有误，且是蓝牙模式下，尝试获取查询到的sn',deviceSnBle)
    //   sn = deviceSnBle;      
    // } else {
    //   console.log('蓝牙和解析sn都失败',deviceSnBle,cloudDecrypt(infos.sn, app.globalData.userData.key, appKey));
    // }

    console.log('currentSn', app.globalData.currentSn)
    // infos.sn = app.globalData.currentSn.slice(6,28);
    console.log("new infos", infos);
    this.getDate(app.globalData.currentSn);
    this.setData({
      originDeviceInfo:options.currDeviceInfo,
      deviceInfo: infos,
      globalDataSn: app.globalData.currentSn
    })

    this.setData({
      'arr[1].text': this.data.containerData.snFormat,
      'arr[2].text': this.data.date,
      'arr[3].text': this.data.containerData.version
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
  onShareAppMessage: function () {},

  getDate(sn) {
    let deviceInfo = this.getDeviceSnInfo(sn)
    if (sn != undefined && sn != null && sn != '--') {
      this.setData({
        date: deviceInfo.year + '年' + deviceInfo.month + '月' + deviceInfo.day + '日',
        containerData: {
          snFormat: deviceInfo.snFormat,
          version: "v3.25",
        },
      })
    } else {
      this.setData({
        date: '--',
      })
    }
  },
  func() {
    wx.navigateTo({
      url: '../funSpace/funSpace?deviceInfo=' + encodeURIComponent(JSON.stringify(this.data.deviceInfo)),
    })
  },
  getDeviceSnInfo(sn) {
    let sn5 = ''
    let snFormat = ''

    //retrieve sn
    if (sn !== '') {
      if (sn.length === 32) {
        snFormat = sn.substring(6, 28)
        sn5 = sn.substring(12, 17)
      } else if (sn.length === 22) {
        snFormat = sn.substring(0, 22)
        sn5 = sn.substring(6, 11)
      }
    }
    //year code map by midea standard
    let barCodeYear = '5678901234ABCDFGHJKLMNPQRSTUVWXYZ'
    let yearCodeMap = {}
    barCodeYear.split('').map((item, index) => {
      yearCodeMap[item + ''] = index + 2015
    })

    return {
      sn5: sn5,
      snFormat: snFormat,
      version: parseInt(snFormat.substring(0, 1), 16) === 13 ? 0 : 1,
      year: yearCodeMap[snFormat.substring(11, 12) + ''],
      month: parseInt(snFormat.substring(12, 13), 16),
      day: parseInt(snFormat.substring(13, 15)),
    }
  },
  cellTap(data) {
    console.log(data);
    if(data.currentTarget.dataset.item.title == "功能说明") {
      this.func();
    } else if(data.currentTarget.dataset.item.title == "设备与服务") {
      console.log('跳转设备与服务');
    } else if (data.currentTarget.dataset.item.title == "本机条码" || data.currentTarget.dataset.item.title == "生产日期"){
      wx.setClipboardData({
        data: data.currentTarget.dataset.item.text,
        success(res) {
          console.log(res);
          let text = "本机条码已复制"
          if (data.currentTarget.dataset.item.title == "本机条码") {
            text = "本机条码已复制"
          } else {
            text = "生产日期已复制"
          }
          wx.showToast({
            title: text,
            icon: 'none'
          })          
        }
      })     
    }
  }
})
