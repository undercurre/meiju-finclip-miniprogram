// plugin/T0xCA/guide/install/InstallStep2.js
import netService from '../../service/NetService'
const app = getApp()
const pluginEventTrack = app.getGlobalConfig().pluginEventTrack
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconServiceUrl: netService.getIconServiceUrl(),
    pageTop: 0, 
    devWidth: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({pageTop: app.globalData.statusNavBarHeight, devWidth: wx.getSystemInfoSync().windowWidth});
      //记录用户操作步骤处理
      this.recordStep();
      //页面浏览埋点: 开箱安装说明详情页浏览统计
      pluginEventTrack('user_page_view', null, {
        page_id: 'page_xjzy_guide_install_installstep2',
        page_name: '首次通电说明页',
        bd_name: '冰箱'
      }, {});
  },
  recordStep: function(){
    let phoneNumber = app.globalData.phoneNumber;
    let uid = app.globalData.userData.uid;
    netService.recordStep(uid, phoneNumber, 2).then((res) => {}).catch(err => {})
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