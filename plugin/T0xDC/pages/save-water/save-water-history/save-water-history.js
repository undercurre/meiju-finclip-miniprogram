// plugin/T0xDB/pages/save-water/save-water-history/save-water-history.js
import { formatTime } from 'm-utilsdk/index'
import deviceUtils from '../../../utils/deviceUtils'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    exchangeList: [],
    deviceId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      deviceId: options.deviceId,
    })
    this.getExchangeList(options.deviceId)
  },

  async getExchangeList(deviceId) {
    let res = await deviceUtils.getSaveWaterExchangeList({
      idDeviceBase: deviceId,
    })
    console.log('exchange list', res)
    if (!res || !res.data) {
      return
    }
    res = res.data
    if (res.code === 401) {
      // todo dialog
    } else if (res.code === 200) {
      let exchangeList = res.data.exchangeInfoList
      exchangeList.map((item) => {
        return Object.assign(item, {
          exchangeTime: formatTime(new Date(item.exchangeTime)),
        })
      })
      this.setData({
        exchangeList,
      })
    } else {
      wx.showToast({
        title: res.msg,
        icon: 'none',
      })
    }
  },
  clickUse(e) {
    let item = e.currentTarget.dataset.item
    console.log('click item', item)
    deviceUtils.navigateToMall(item.idMallItem)
  },
})
