// T0xFB//index/index.js

let isDebug = false
import pluginMixin from 'm-miniCommonSDK/utils/plugin-mixin'
Page({
  behaviors: [pluginMixin],
  /**
   * 页面的初始数据
   */
  data: {
    isInit: true,
    isShowTitle: true,
    title: '取暖器',
    isShowBottom: false,
  },
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    do {
      if (!isDebug) {
        this.getUrlparams(options)
      } else {
        this.setData({
          isInit: true,
        })
      }
    } while (false)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let title = this.data.deviceInfo.name
    this.setData({ title })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      fromApp: false,
    })
  },

  // 监听页面滚动
  onPageScroll: function (event) {
    // let scrollTop = event.scrollTop;
    // let isShowTitle = true;
    // if(scrollTop!==0){
    //     isShowTitle = false;
    // } else {
    //     isShowTitle = true;
    // }
    // this.setData({
    //     isShowTitle: isShowTitle
    // });
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
})
