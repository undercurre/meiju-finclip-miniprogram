// plugin/T0xB8/cards/X9/paths/video/video.js
import api from "../../api/api"
let app = getApp()
const environment = app.getGlobalConfig().environment
const IMAGE_SERVER = environment == 'prod' ? 'https://www.smartmidea.net/projects/meiju-lite-assets/plugin/0x38/' : 'https://www.smartmidea.net/projects/sit/meiju-lite-assets/plugin/0x38/'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    applianceData:{},
    navBarName: "视频指南",
    tabsList: [
      {
        category: '全部',
        categoryId: 0
      }
    ],//tab页面标题
    currentCategoryId: 0,//当前tab页
    videoList: [
      // {
      //   videoSnapshotUrl: '',// 视频封面
      //   videoTitle: '',//视频标题
      //   videoUrl:'https://devstaticvcs.midea.com/admin-upload-files/%E6%89%8B%E6%9F%84%E5%AE%89%E8%A3%85%E5%8F%8A%E6%8B%86%E5%8D%B820220318.mp4#devtools_no_referrer',
      //   id: 0,
      //   categoryId: 2
      // },
      // {
      //   videoSnapshotUrl: '',// 视频封面
      //   videoTitle: '',//视频标题
      //   videoUrl:'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400',
      //   id: 1
      //   categoryId: 2
      // },
    ],//全部视频
    currentTabVideo: [],//当前tab页的视频
    playIcon: `${IMAGE_SERVER}play.png`,//播放图标
  },
  //切换tab页
  changeTab(e) {
    // console.log(e);
    if(e.currentTarget.dataset.item.categoryId == this.data.currentCategoryId) return
    this.setData({currentCategoryId: e.currentTarget.dataset.item.categoryId})
    this.getCurrentTabVideo()
  },
  //获取当前tab页的视频
  getCurrentTabVideo() {
    let currentTabVideo = this.data.videoList.filter((i) => i.categoryId == this.data.currentCategoryId)
    // console.log(currentTabVideo);
    //tab为全部时，展示全部的视频列表
    if(this.data.currentCategoryId == 0) {
      currentTabVideo = this.data.videoList
    }
    this.setData({currentTabVideo})
  },
  //跳转至播放页
  toPlayVideo(e) {
    console.log(e);
    wx:wx.navigateTo({
      url: '../playVideo/playVideo',
      success: (res) => {
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          item: e.currentTarget.dataset.item,
          applianceData: this.data.applianceData
        })
      },
      fail: (res) => {console.log(res);},
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let applianceData
    if(options.applianceData) {
      applianceData = JSON.parse(decodeURIComponent(options.applianceData))
    }
    // console.log(applianceData);
    //获取tab标题
    api.queryVideoCategories({sn8: applianceData.sn8}).then(res => {
      console.log('queryVideoCategories',res);
      let tabsList = [...this.data.tabsList,...res.result]
      this.setData({tabsList: tabsList})
    })
    // 获取视频列表
    api.queryVideo({sn8: applianceData.sn8}).then(res => {
      console.log(res);
      console.log(res.result.items[0].videoSnapshotUrl);
      this.setData({
        videoList: res.result.items,
        applianceData: applianceData,//获取设备数据
      })
      this.getCurrentTabVideo()
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

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
})