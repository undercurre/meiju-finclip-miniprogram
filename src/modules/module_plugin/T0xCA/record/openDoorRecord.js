// plugin/T0xCA/record/openDoorRecord.js
const app = getApp()
const pluginMixin = require('m-miniCommonSDK/utils/plugin-mixin')
import netService from '../service/NetService'
const pluginEventTrack = app.getGlobalConfig().pluginEventTrack

Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconServiceUrl: netService.getIconServiceUrl(),
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'], //顶部状态栏的高度
    closeTips: true,
    fridgeId: null,
    dataList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({fridgeId: options.fridgeId});
    let that = this;
    //加载数据记录
    netService.getOpenDoorRecords(that.data.fridgeId).then((res)=>{
      if(res.data == null){
        that.setData({dataList: []});
      }else{
        that.setData({dataList: res.data});
      }
    });
    //页面浏览埋点: 开关门记录页浏览统计
    pluginEventTrack('user_page_view', null, {
    page_id: 'page_record_opendoorrecord',
    page_name: '开关门记录页',
    bd_name: '冰箱'
    }, {});
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
  closeTipsAction: function() {
    this.setData({closeTips: false});
  }

})