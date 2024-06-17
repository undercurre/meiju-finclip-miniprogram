// midea-replace-repair/pages/orderList/orderList.js
// const app = getApp() //获取应用实例
// import { login } from '../../../utils/paths.js'
import { service } from 'assets/js/service'
Page({
  behaviors: [],
  /**
   * 页面的初始数据
   */
  data: {
    // orderList:[{name:1}],
    orderList: [],
    noOrder: false, //无订单缺省图
    isShowDialog: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getOrderList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  getOrderList() {
    wx.showLoading({
      title: '加载中...',
    })
    let params = { pageSize: 100 }
    service
      .getUserOrderList(params)
      .then((data) => {
        wx.hideLoading()
        console.log('data...orderlist', data)
        if (data.data.data.list && data.data.data.list.length > 0) {
          this.setData({
            orderList: data.data.data.list,
          })
        } else {
          this.setData({
            noOrder: true,
          })
        }
      })
      .catch((err) => {
        console.log('err', err.data)
        wx.hideLoading()
        this.setData({
          noOrder: true,
        })
      })
  },

  selcetOrder(e) {
    console.log('selcetOrder', e)
    let baseTime = '2021-01-01 00:00:00'
    let item = e.currentTarget.dataset.item
    let { outerCreateTime } = item
    var baseTimeObj = new Date(Date.parse(baseTime.replace(/-/g, '/')))
    var buyTimeObj = new Date(Date.parse(outerCreateTime.replace(/-/g, '/')))
    console.log('baseTimeObj 2021-01-01 00:00:00', baseTimeObj)
    console.log(`buyTimeObj ${outerCreateTime}`, buyTimeObj)
    console.log('baseTimeObj-outerCreateTime', baseTimeObj - buyTimeObj)

    if (baseTimeObj - buyTimeObj > 0) {
      this.setData({
        isShowDialog: true,
      })
      return
    }
    // backTo完善信息页面
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    //将数值信息赋值给上一页面orderInfo变量
    prevPage.setData({
      orderInfo: item,
    })
    wx.navigateBack({
      delta: 1,
    })
  },

  makeSure() {},

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
