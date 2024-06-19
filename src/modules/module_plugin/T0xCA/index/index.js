// T0xAC//index/index.js
const app = getApp()
const pluginMixin = require('m-miniCommonSDK/utils/plugin-mixin')
const openSubscribeModal= app.getGlobalConfig().openSubscribeModal
const pluginEventTrack = app.getGlobalConfig().pluginEventTrack
const modelIds= app.getGlobalConfig().modelIds
const templateIds= app.getGlobalConfig().templateIds
Page({
  behaviors: [pluginMixin],
  /**
   * 页面的初始数据
   */
  data: {
    onlineStatus: 0, //设备是否在线
    checkSubscribe: false,
    titleName: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUrlparams(options);
    this.setData({titleName: this.data.deviceInfo.name});
    //页面浏览埋点: 设备控制首页浏览统计
    pluginEventTrack(
      'user_page_view',
      null,
      {
        page_id: 'page_card0_card0',
        page_name: '设备控制首页',
        bd_name: '冰箱',
      },
      {}
    )
    //判断小程序的进入方式
    // let launchScene = wx.getLaunchOptionsSync().scene;

    // if (1014 == launchScene || 1107 == launchScene || 1017 == launchScene) {
    //   //小程序订阅消息
    //   this.setData({backTo: '/pages/index/index'});
    // }

    if (options.templateId) {
      console.log('消息模板ID: ',options.templateId);
      //小程序订阅消息
      this.setData({backTo: '/pages/index/index'});
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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
  modeChange: function (event) {
    if (event.detail.onlineStatus != null) {
      this.setData({ onlineStatus: event.detail.onlineStatus })
    }
  },
  pushMsgSubscribe: function () {
    if (!this.data.checkSubscribe) {
      //长期订阅  冰箱关门提醒 冰箱故障提醒
      openSubscribeModal(
        modelIds[10],
        this.data.deviceInfo.name,
        this.data.deviceInfo.sn,
        [templateIds[16][0], templateIds[17][0]],
        this.data.deviceInfo.sn8,
        this.data.deviceInfo.type,
        this.data.deviceInfo.applianceCode
      )
      this.data.checkSubscribe = true
    }
  },
})
