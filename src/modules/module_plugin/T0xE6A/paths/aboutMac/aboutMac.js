// plugin/T0xAC/aboutMac/aboutMac.js
// import {
//   api
// } from '../../../api.js'
// 上传NPM包指令
// npm login --registry=https://npm.midea.com/repository/U-MeijuApp/

// npm publish --registry=https://npm.midea.com/repository/U-MeijuApp/

// runze.tan@midea.com
let app = getApp()
let key = app.globalData.userData.key
const appKey = app.getGlobalConfig().appKey
import {
  cloudDecrypt
} from 'm-utilsdk/index'
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
      title: "本机条码",
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
    console.log(JSON.stringify(infos), "infos")

    // infos.sn = app.globalData.currentSn.slice(6,28);
    console.log("new infos", infos);
    this.setData({
      deviceInfo: infos,
      sn: cloudDecrypt(infos.sn, key, appKey)
    })


    this.setData({
      'arr[0].text': this.data.sn,     
      'arr[1].text': '2.0.3'
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
