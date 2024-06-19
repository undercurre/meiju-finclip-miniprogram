// plugin/T0xB8/cards/X9/paths/video/video.js
let app = getApp()
const environment = app.getGlobalConfig().environment
const IMAGE_SERVER = environment == 'prod' ? 'https://www.smartmidea.net/projects/meiju-lite-assets/plugin/0x38/' : 'https://www.smartmidea.net/projects/sit/meiju-lite-assets/plugin/0x38/'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0,
    applianceData:{},
    navBarName: "视频指南",
    videoList: [
      // {
      //   videoSnapshotUrl: '',// 视频封面
      //   videoTitle: '',//视频标题
      //   videoUrl:'https://devstaticvcs.midea.com/admin-upload-files/%E6%89%8B%E6%9F%84%E5%AE%89%E8%A3%85%E5%8F%8A%E6%8B%86%E5%8D%B820220318.mp4#devtools_no_referrer',
      //   id: 0
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
    currentVideo: {},//当前视频
    sliderValue: 0,
    updateState: true,
    duration: 0,
    showIcon: true,//展示图标
    play: false,//是否播放中
    playIcon: `${IMAGE_SERVER}play.png`,
    pauseIcon: `${IMAGE_SERVER}pause.png`,
  },
  tabSlider() {
    //阻止冒泡
    // console.log('tabSlider');
  },
  tab(e) {
    console.log('tabVideo');
    if(this.data.showIcon) {//显示时直接隐藏
      this.setData({showIcon: false})
      return
    }
    //隐藏时先显示然后隐藏
    this.setData({showIcon: true})
    if(this.timer) clearInterval(this.timer)
    this.timer = setTimeout(() => {
      this.setData({
        showIcon: false
      })
    }, 5000)
  },
  //播放视频
  playVideo(e) {
    this.data.play?this.VideoContext.pause():this.VideoContext.play()
    this.setData({play: !this.data.play})
    // if(this.timer) clearInterval(this.timer)
    // this.timer = setTimeout(() => {
    //   this.setData({
    //     showIcon: !this.data.showIcon
    //   })
    // }, 5000)
  },
  //播放状态
  videoPlay(e) {
    console.log(e);
    this.setData({play: true})
  },
  //暂停播放状态
  videoPause(e) {
    // console.log(e);
    this.setData({play: false})
  },
  //控制栏状态
  videoControls(e) {
    console.log(e);
    this.setData({showIcon: e.detail.show})
  },
  //视频元数据加载完成时触发
  loadedmetadata(e) {
    console.log(e);
    this.setData({duration: e.detail.duration})
  },
  seekcomplete() {
    console.log('seekcomplete');
  },
  // 完成一次拖动后触发的事件
  sliderChange(e) {
    this.setData({updateState:false})
    console.log('拖动结束',e.detail.value,Date.now());
    if (this.data.duration) { //不能除0
      // 视频跳转到指定位置
      this.VideoContext.seek(e.detail.value);
      console.log('seek结束',Date.now());
      setTimeout(() => {
        this.setData({updateState:true})
      },500)
      // this.setData({updateState:true})
      if(this.timer) clearInterval(this.timer)
      this.timer = setTimeout(() => {
        this.setData({
          showIcon: false
        })
      }, 5000)
    }
  },

  // 拖动过程中触发的事件
  sliderChanging(e) {
    if(this.timer) clearInterval(this.timer)
    console.log('拖动中',e.detail.value);
    if(this.data.updateState) this.setData({updateState:false})// 拖动过程中不允许更新进度条
    if(!this.data.showIcon) this.setData({showIcon: true})
  },
  // 播放进度
  bindtimeupdateFun(e) {
    if (this.data.updateState) {
      console.log('播放中',e.detail.currentTime,Date.now());
      this.setData({sliderValue: e.detail.currentTime})
      console.log('进度条',this.data.sliderValue,Date.now());

    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let height = wx.getSystemInfoSync().statusBarHeight
    this.setData({height})
    let applianceData = null
    let currentVideo = null
    const eventChannel = this.getOpenerEventChannel()
    let that = this
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      applianceData = data.applianceData
      currentVideo = data.item
      console.log(applianceData);
      console.log(currentVideo);
      that.setData({
        applianceData,
        currentVideo
      })
    })
    this.VideoContext = wx.createVideoContext('video')
    wx.getNetworkType({
      success: function(res) {
        if (['2g','3g','4g','5g'].includes(res.networkType)) {
          wx.showToast({
            title: '当前非无线网络环境，请注意流量消耗',
            icon: 'none'
          })
        }
      }
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