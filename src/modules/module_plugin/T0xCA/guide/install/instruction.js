// plugin/T0xCA/guide/install/instruction.js
import netService from '../../service/NetService'
const app = getApp()
const pluginEventTrack = app.getGlobalConfig().pluginEventTrack
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTitle: "",
    pageNo: 0 ,//决定展示内容
    imageUrl:"",
    pageTop: 0,
    devWidth: 0,
    iconServiceUrl: netService.getIconServiceUrl(),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.pageNo == 1){
      //位置找平
      this.setData({navTitle: "位置找平", imageUrl: netService.getIconServiceUrl()+"xjzy_position.gif", pageNo: options.pageNo});
      //页面浏览埋点: 开箱安装说明详情页浏览统计
      pluginEventTrack('user_page_view', null, {
        page_id: 'page_xjzy_guide_install_instruction',
        page_name: '开箱安装说明详情页',
        bd_name: '冰箱'
      }, {index:'位置找平'});
    }else if(options.pageNo == 2){
      //新冰箱清理
      this.setData({navTitle: "新机清理", imageUrl: netService.getIconServiceUrl()+"xjzy_clean.gif", pageNo: options.pageNo});
      //页面浏览埋点: 开箱安装说明详情页浏览统计
      pluginTrack.pluginEventTrack('user_page_view', null, {
        page_id: 'page_xjzy_guide_install_instruction',
        page_name: '开箱安装说明详情页',
        bd_name: '冰箱'
      }, {index:'新冰箱清理'});
    }else if(options.pageNo == 3){
      //缓冲放置时间
      this.setData({navTitle: "静置", imageUrl: netService.getIconServiceUrl()+"xjzy_static.gif", pageNo: options.pageNo});
      //页面浏览埋点: 开箱安装说明详情页浏览统计
      pluginTrack.pluginEventTrack('user_page_view', null, {
        page_id: 'page_xjzy_guide_install_instruction',
        page_name: '开箱安装说明详情页',
        bd_name: '冰箱'
      }, {index:'缓冲放置时间'});
    }
    this.setData({pageTop: app.globalData.statusNavBarHeight, devWidth: wx.getSystemInfoSync().windowWidth});
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
  finishAction: function(){
    wx.navigateBack();
  }
})