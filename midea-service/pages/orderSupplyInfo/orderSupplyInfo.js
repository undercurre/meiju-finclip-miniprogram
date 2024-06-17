import { requestService } from '../../../utils/requestService'
import computedBehavior from '../../../utils/miniprogram-computed.js'
import TextList from './assets/js/device-fast-select-text'
// const app = getApp()
Page({
  behaviors: [computedBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    orderInfo: null,
    fastSelectList: [],
    inputValue: '',
    disableDefaultPadding: true,
    serviceSubTypeCode: '', //进度查询页传递过来的工单类型code 1010 安装 1111维修等
  },
  computed: {
    btnActive() {
      let { fastSelectList, inputValue } = this.data
      let selectedFlag = false
      fastSelectList.forEach((item) => {
        if (item.selected) {
          selectedFlag = true
        }
      })
      let currInputValue = inputValue.replace(/\s+/g, '')
      return selectedFlag || currInputValue
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.serviceSubTypeCode) {
     this.setData({
      serviceSubTypeCode: options.serviceSubTypeCode
     })
    }
    this.initData()
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
  initData() {
    let orderInfo = wx.getStorageSync('CURRENT_ORDER_DETAIL')
      ? JSON.parse(wx.getStorageSync('CURRENT_ORDER_DETAIL'))
      : {}
    this.setData({
      orderInfo,
    })
    console.log('orderInfo====', orderInfo)
    this.generateFastSelectList()
  },
  generateFastSelectList() {
    let self = this
    let { orderInfo } = self.data
    let prodName = orderInfo.serviceUserDemandVOs[0].prodName
    let key = Object.keys(TextList).find((item) => {
      if (prodName.indexOf(item) > -1) {
        return true
      }
    })
    if (key) {
      let textList = TextList[key]
      let fastSelectList = textList.map((item) => {
        return {
          text: item,
          selected: false,
        }
      })
      console.log('fastSelectList====', fastSelectList)
      self.setData({
        fastSelectList,
      })
    }
  },
  selectReasonItem(e) {
    let { fastSelectList } = this.data
    let index = e.currentTarget.dataset.index
    let currSelected = fastSelectList[index]['selected']
    let selected = 'fastSelectList[' + index + '].selected'
    this.setData({
      [selected]: !currSelected,
    })
  },
  inputAction(e) {
    this.setData({
      inputValue: e.detail.value,
    })
  },
  submitSupplyInfo() {
    let self = this
    let { fastSelectList, orderInfo, inputValue, btnActive } = self.data
    if (!btnActive) {
      return
    }
    let fastSelectReason = ''
    fastSelectList.forEach((item) => {
      if (item.selected) {
        fastSelectReason += '(' + item.text + ')'
      }
    })
    let param = {
      body: {
        interfaceSource: orderInfo.interfaceSource,
        serviceOrderNo: orderInfo.serviceOrderNo,
        serviceRequireItem2Code: 'BC01007',
        reminderReason: inputValue + fastSelectReason,
      },
    }
    console.log('param=====', param)
    requestService
      .request('createServiceUserDemand', param)
      .then(() => {
        wx.showToast({
          title: '您补充的信息已提交',
          icon: 'none',
        })
        setTimeout(() => {
          wx.navigateBack({})
        }, 1000)
      })
      .catch(() => {})
  },
})
