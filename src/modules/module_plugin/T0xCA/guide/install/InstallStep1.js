// plugin/T0xCA/guide/install/InstallStep1.js
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
    devWidth: 750,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({pageTop: app.globalData.statusNavBarHeight, devWidth: wx.getSystemInfoSync().windowWidth});
    //记录用户操作步骤处理
    this.recordStep();
    //页面浏览埋点: 开箱安装说明首页浏览次数
    pluginEventTrack('user_page_view', null, {
      page_id: 'page_xjzy_guide_install_installstep1',
      page_name: '开箱安装说明首页',
      bd_name: '冰箱'
    }, {});
  },
  recordStep: function(){
    let phoneNumber = app.globalData.phoneNumber;
    let uid = app.globalData.userData.uid;
    netService.recordStep(uid, phoneNumber, 1).then((res) => {}).catch(err => {})
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

  finishAction: function(){
    wx.navigateBack();
  },
  toStepView: function(e){
    let pageId = e.currentTarget.dataset.id;
    //进去不同的内容
    wx.navigateTo({
      url: './instruction?pageNo='+pageId,
    })
  }
})