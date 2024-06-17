import { requestService } from '../../../utils/requestService'
import { mideaServiceImgApi } from '../../../api'
import computedBehavior from '../../../utils/miniprogram-computed.js'
import orderBase from '../../assets/js/orderBase.js'
import { dateFormat } from 'm-utilsdk/index'
// const app = getApp()
Page({
  behaviors: [computedBehavior, orderBase],
  /**
   * 页面的初始数据
   */
  data: {
    spritePicture: mideaServiceImgApi.url + 'icon.png',
    progressList: [], //进度列表
    orderInfo: null, //订单详情
    showUrgeAction: false,
    reminderOptions: [], //催单原因列表
  },
  computed: {
    formattedOrder() {
      let { orderInfo } = this.data
      let result
      if (orderInfo) {
        result = this.formatOrder(orderInfo)
      }
      return result
    },
    formatProgressList() {
      let { progressList } = this.data
      progressList.forEach((item) => {
        item['processTimeFormatDay'] = dateFormat(new Date(item.processTime), 'yyyy-MM-dd')
        item['processTimeFormatSecond'] = dateFormat(new Date(item.processTime), 'hh:mm:ss')
      })
      return progressList
    },
    urgeOrderItems() {
      let result = []
      let { reminderOptions } = this.data
      if (reminderOptions) {
        result = reminderOptions.map((item, index) => {
          return {
            name: item.customerDesc,
            index,
          }
        })
      }
      return result
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.initData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // let self = this
  },

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
  initData() {
    let self = this
    self.getDataList()
  },
  //获取订单列表
  getDataList() {
    let progressList = wx.getStorageSync('CURRENT_ORDER_PROGRESS')
      ? JSON.parse(wx.getStorageSync('CURRENT_ORDER_PROGRESS'))
      : []
    let orderInfo = wx.getStorageSync('CURRENT_ORDER_DETAIL')
      ? JSON.parse(wx.getStorageSync('CURRENT_ORDER_DETAIL'))
      : {}
    this.setData({
      progressList,
      orderInfo,
    })
  },
  //获取订单列表
  urgeOrder() {
    let self = this
    let { orderInfo, reminderOptions } = self.data
    if (reminderOptions.length) {
      self.setData({
        showUrgeAction: true,
      })
    } else {
      let param = {
        body: {
          interfaceSource: orderInfo.interfaceSource,
          orgCode: orderInfo.orgCode,
          serviceOrderNo: orderInfo.serviceOrderNo,
          prodCode: orderInfo.serviceUserDemandVOs[0].prodCode,
        },
      }
      requestService
        .request('getQueryServiceReqsrvprod', param)
        .then((res) => {
          console.log('getQueryServiceReqsrvprod========', res)
          self.setData({
            showUrgeAction: true,
            reminderOptions: res.data.data || [],
          })
        })
        .catch(() => {})
    }
  },
  urgeActioClose() {
    this.setData({
      showUrgeAction: false,
    })
  },
  urgeActioSelect(e) {
    let self = this
    let { reminderOptions, orderInfo } = self.data
    let currIndex = e.detail.index
    let reminderOption = reminderOptions[currIndex]
    let param = {
      body: {
        interfaceSource: orderInfo.interfaceSource,
        orgCode: orderInfo.orgCode,
        serviceOrderNo: orderInfo.serviceOrderNo,
        reminderReason: reminderOption.serviceRequireItemName,
        serviceRequireItem2Code: reminderOption.serviceRequireItemCode,
      },
    }
    requestService
      .request('createServiceUserDemand', param)
      .then(() => {
        self.setData({
          showUrgeAction: false,
        })
        wx.showToast({
          title: '已帮您催办',
          icon: 'none',
        })
      })
      .catch((err) => {
        wx.showToast({
          title: err.data.errorMsg,
          icon: 'none',
        })
      })
  },
})
