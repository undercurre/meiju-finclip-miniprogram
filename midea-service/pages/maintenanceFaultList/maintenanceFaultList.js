const app = getApp()
import { service } from '../../assets/js/http.js'
import { imgBaseUrl } from '../../../api'
Page({
  data: {
    imgBaseUrl: imgBaseUrl.url,
    userInfo: app.globalData.userInfo,
    styleList: [], //当前的数据数组
    common: '/mideaServices/images/icon.png',
  },
  onLoad: function (options) {
    if (options.selectedProductObj) {
      let obj = JSON.parse(options.selectedProductObj)
      this.getList(obj)
    }
  },
  // 选择一款故障类型
  toCheckItem(e) {
    let { styleList } = this.data
    let checkItem = e.currentTarget.dataset.item
    let index0 = e.currentTarget.dataset.index
    app.globalData.maintenanceItem = checkItem
    app.globalData.maintenanceItemIndex = index0
    let newArr = styleList.map((item, index) => {
      if (index0 == index) {
        item.checked = true
      } else {
        item.checked = false
      }
      return item
    })
    this.setData({
      styleList: newArr,
    })
    wx.navigateBack({
      delta: 0,
    })
  },
  getList(selectedProductObj) {
    service
      .getTrobule(selectedProductObj)
      .then((res) => {
        if (res && res.length > 0) {
          let newArr = res.map((item, index) => {
            if (index == app.globalData.maintenanceItemIndex) {
              item.checked = true
            } else {
              item.checked = false
            }
            return item
          })
          this.setData({
            styleList: newArr,
          })
        } else {
          this.setData({
            styleList: [],
          })
        }
      })
      .catch(() => {})
  },

  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  // onShareAppMessage: function () {

  // }
})
