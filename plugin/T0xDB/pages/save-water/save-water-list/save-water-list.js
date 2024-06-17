// plugin/T0xDB/pages/save-water/save-water-list/save-water-list.js
import deviceUtils from '../../../utils/deviceUtils'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    productInfoList: [],
    deviceId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      deviceId: options.deviceId,
    })
    this.getProductList(options.deviceId)
  },

  async getProductList(deviceId) {
    let res = await deviceUtils.getSaveWaterProductList({
      idDeviceBase: deviceId,
    })
    console.log('product list', res)
    if (!res || !res.data) {
      return
    }
    res = res.data
    if (res.code === 401) {
      // todo dialog
    } else if (res.code === 200) {
      this.setData({
        productInfoList: res.data.productInfoList,
      })
    } else {
      wx.showToast({
        title: res.msg,
        icon: 'none',
      })
    }
  },
  clickHistory() {
    wx.navigateTo({
      url: '../save-water-history/save-water-history?deviceId=' + this.data.deviceId,
    })
  },
  clickGoodsItem(e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url:
        '../save-water-detail/save-water-detail?id=' + e.currentTarget.dataset.id + '&deviceId=' + this.data.deviceId,
    })
  },
})
