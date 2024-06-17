// const app = getApp()
Page({
  behaviors: [],
  /**
   * 页面的初始数据
   */
  data: {
    latitude: '',
    longitude: '',
    markers: [],
  },
  computed: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let latitude = options.latitude || '23.099994'
    let longitude = options.longitude || '113.324520'
    latitude *= 1
    longitude *= 1
    let markers = []
    markers.push({
      id: 1,
      latitude,
      longitude,
    })
    this.setData({
      latitude,
      longitude,
      markers,
    })
    this.mapCtx = wx.createMapContext('myMap')
  },
  navigate() {
    ////使用微信内置地图查看标记点位置，并进行导航
    wx.openLocation({
      latitude: this.data.latitude, //要去的纬度-地址
      longitude: this.data.longitude, //要去的经度-地址
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

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
  onShareAppMessage: function () {},
})
