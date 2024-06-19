import netService from '../service/NetService'
const app = getApp()
const pluginEventTrack = app.getGlobalConfig().pluginEventTrack
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //页面浏览埋点: 月度报告首页浏览统计
    pluginEventTrack('user_page_view', null, {
      page_id: 'page_report_monthreport',
      page_name: '月度报告首页',
      bd_name: '冰箱'
    }, {});

    let webUrl = netService.getCloudServiceUrl("monthReport") + options.fridgeId + "&brand=" + options.brand +
      "&source=mini&channel=3";
    const webViewUrl = decodeURIComponent(webUrl);
    console.log("webUrl===" + webUrl)
    this.setData({
      pageUrl: webViewUrl
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

  }
})
