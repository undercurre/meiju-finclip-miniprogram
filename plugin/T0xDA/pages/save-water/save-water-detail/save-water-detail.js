// plugin/T0xDB/pages/save-water/save-water-detail.js
import deviceUtils from '../../../utils/deviceUtils'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    couponCardInfo: {
      denomination: '10元优惠券',
      waterNums: '（需1000水滴）',
      isChecked: true,
    },
    params: {},
    productInfo: {
      dripCount: 0,
      idProductInfo: 0,
      productName: '',
      bigProductImg: '',
      couponInfoList: [],
      idMallItem: '',
    },
    selectedCoupon: {},
    couponCode: '',
    btnText: '立即兑换',
    emptyTip: '暂无商品详情信息',
    deviceId: '',
    showSuccess: false,
    exchangeDialogShow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      deviceId: options.deviceId,
    })
    this.getProductInfo(options.id, options.deviceId)
  },
  onShow() {
    wx.setNavigationBarTitle({
      title: this.data.productInfo?.productName,
    })
  },
  async getProductInfo(id, deviceId) {
    let res = await deviceUtils.getSaveWaterProductInfo({
      idDeviceBase: deviceId,
      idProductInfo: id,
    })
    if (!res || !res.data) {
      return
    }
    res = res.data
    if (res.code === 401) {
      // todo dialog
    } else if (res.code === 200) {
      res.data.exchangeDescription = res.data.exchangeDescription.split('br')
      this.setData({
        productInfo: res.data,
      })
      wx.setNavigationBarTitle({
        title: this.data.productInfo.productName,
      })
    } else {
      wx.showToast({
        title: res.msg,
        icon: 'none',
      })
    }
    console.log('product info', res)
  },
  clickHistory() {
    wx.navigateTo({
      url: '../save-water-history/save-water-history?deviceId=' + this.data.deviceId,
    })
  },
  clickCoupon(e) {
    let coupon = e.currentTarget.dataset.item
    console.log('click coupon', coupon)
    if (this.data.productInfo.dripCount < coupon.requiredDrip) {
      wx.showToast({
        title: '水滴数量不足',
        icon: 'none',
      })
      return
    }
    let btnText = '优惠券已抢完'
    if (coupon.couponCurrentStock > 0) {
      btnText = '立即兑换'
    }
    this.setData({
      selectedCoupon: coupon,
      btnText,
    })
  },
  clickExchange() {
    this.closeExchangeDialog()
    if (this.data.selectedCoupon.idCouponInfo && this.data.selectedCoupon.couponCurrentStock > 0) {
      deviceUtils
        .exchangeSaveWaterCoupon({
          idDeviceBase: this.data.deviceId,
          idCouponInfo: this.data.selectedCoupon.idCouponInfo,
        })
        .then((res) => {
          if (res.data.code === 401) {
            this.setData({
              selectedCoupon: {},
            })
          } else if (res.data.code === 200) {
            this.setData({
              'productInfo.dripCount': res.data.data.dripCount || 0,
              'selectedCoupon.couponCurrentStock': this.data.selectedCoupon.couponCurrentStock - 1,
              showSuccess: true,
            })
          } else {
            if (res.data.code === 4005) {
              // 优惠券不足
            }
            if (res.data.code === 4006) {
              //  4006, "您的水滴余额不足，参与活动获取更多"
              this.setData({
                'productInfo.dripCount': res.data.data.dripCount || 0,
              })
            }
            this.setData({
              selectedCoupon: {},
            })
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
            })
          }
        })
    }
  },
  cancelDialog() {
    this.setData({
      showSuccess: false,
    })
  },
  confirmDialog() {
    this.setData({
      showSuccess: false,
    })
    deviceUtils.navigateToMall(this.data.productInfo.idMallItem);
  },
  showExchangeDialog() {
    this.setData({
      exchangeDialogShow: true,
    })
  },
  closeExchangeDialog() {
    this.setData({
      exchangeDialogShow: false,
    })
  },
  clickDetail() {
    deviceUtils.navigateToMall(this.data.productInfo.idMallItem)
  }
})
