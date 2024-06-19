import config from '../common/script/config'
import { GlobalData } from '../common/script/global-data'
import pluginMixin from 'm-miniCommonSDK/utils/plugin-mixin'
let isDebug = config.isDebug
Page({
  behaviors: [pluginMixin],
  /**
   * 页面的初始数据
   */
  data: {
    isShowCard: false,
    isShowTitle: true,
    title: '电饭煲',
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
    GlobalData.setApiHeaders()
    if (!isDebug) {
      this.getUrlparams(options)
      // 过滤不支持型号
      // wx.nextTick(()=>{
      //     let deviceInfo = this.data.deviceInfo;
      //     let redirectUnSupportDevice = ()=>{
      //         wx.redirectTo({
      //             url: `/pages/unSupportDevice/unSupportDevice?backTo=/pages/index/index&deviceInfo=` + encodeURIComponent(JSON.stringify(deviceInfo)),
      //         });
      //     }
      //     if(filterList['0xEA'].unSupport){
      //         let unSupportSN8 = filterList['0xEA'].unSupport.SN8;
      //         if(unSupportSN8&&unSupportSN8.indexOf(deviceInfo.sn8)>-1){
      //             redirectUnSupportDevice();
      //             this.destoriedPlugin();
      //         }
      //         // let unSupportAO = filterList['0xEA'].unSupport.AO;
      //         // let productModelNumber = DeviceFunctionConfig.getAO(deviceInfo.modelNumber);
      //         // if(unSupportAO&&unSupportAO.indexOf(productModelNumber)>-1){
      //         //     redirectUnSupportDevice();
      //         // }
      //     }
      // });
    } else {
      this.setData({
        isInit: true,
      })
    }
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
    let scrollTop = event.scrollTop
    let isShowTitle = true
    if (scrollTop !== 0) {
      isShowTitle = false
    } else {
      isShowTitle = true
    }
    this.setData({
      isShowTitle: isShowTitle,
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
})
