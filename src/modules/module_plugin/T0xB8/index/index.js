// T0xAC//index/index.js
const app = getApp()
const pluginMixin=require('m-miniCommonSDK/utils/plugin-mixin') 
// import { openSubscribeModal } from '../../../globalCommon/js/deviceSubscribe.js'
// import { modelIds, templateIds } from '../../../globalCommon/js/templateIds.js'
const openSubscribeModal = app.getGlobalConfig().openSubscribeModal;
const templateIds = app.getGlobalConfig().templateIds;
const modelIds = app.getGlobalConfig().modelIds;
Page({
    behaviors: [pluginMixin],
    /**
     * 页面的初始数据
     */
    data: {
      viewHeight: app.globalData.screenHeight - app.globalData.statusNavBarHeight,
      navBarName: "机器人",
      deviceType: 'default',// default-默认  8b-8B系列  w11-v12/v13/w20等新型号
      sn8List: ['000VR950', '750Y0005', '750004CJ', '750Y000M'],//8B系列的sn8
      w11Sn8List: ['750004CD','750004AT','750004BZ', '750004C6', '750004CA', '750004CE', '750004CF', '750004D8','750004B3','750004DA','750004D2'],//w11-v12/v13/w20等新型号
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      if (options.deviceInfo) {
        let deviceInfo = JSON.parse(decodeURIComponent(options.deviceInfo))
        console.log("当前设备的基本信息:",deviceInfo);
        let tempDeviceType = 'default'
        if(this.data.sn8List.indexOf(deviceInfo.sn8) > -1) {
          tempDeviceType = '8b'
        }else if(this.data.w11Sn8List.indexOf(deviceInfo.sn8) > -1) {
          tempDeviceType = 'w11'
        }
        this.setData({
          deviceType: tempDeviceType,
        })
      }
        this.getUrlparams(options)
        this.setData({
          navBarName: this.data.deviceInfo.name,
        })
      

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.setData({
            fromApp: false
        })
        // wx.setNavigationBarTitle({
        //     title: this.data.deviceInfo.name
        //  })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        this.destoriedPlugin()
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return this.commonShareSetting()
    },
    // 返回
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
     // 消息订阅
     newsSub() {
      openSubscribeModal(
        modelIds[3],
        this.data.deviceInfo.name,
        this.data.deviceInfo.sn,
        [templateIds[6][0], templateIds[33][0]],
        this.data.deviceInfo.sn8,
        this.data.deviceInfo.type,
        this.data.deviceInfo.applianceCode
      )
    }
})