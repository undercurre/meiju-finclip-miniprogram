// midea-replace-repair/pages/E-InvoiceList/E-InvoiceList.js
import { service } from 'assets/js/service'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    invoiceList: [],
    noInvoice: false,
    isShowDialog: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getInvoiceList()
  },

  // 发票列表
  getInvoiceList() {
    wx.showLoading({
      title: '加载中...',
    })
    let params = { pageSize: 100 }
    service
      .getInvoiceList(params)
      .then((data) => {
        wx.hideLoading()
        console.log('data...invoiceList', data)
        if (data.data.content.list && data.data.content.list.length > 0) {
          this.setData({
            invoiceList: data.data.content.list,
          })
        } else {
          this.setData({
            noInvoice: true,
          })
        }
        console.log('invoiceList...', this.data.invoiceList)
      })
      .catch((err) => {
        console.log('err', err.data)
        wx.hideLoading()
        this.setData({
          noInvoice: true,
        })
      })
  },

  selectInvoiceItem(e) {
    console.log('e', e)
    let item = e.currentTarget.dataset.item
    let baseTime = '2021-01-01 00:00:00'
    // let invoiceDate = item.invoiceDate.substr(0, 10)
    let invoiceDate = item.invoiceDate
    console.log('invoiceDate', invoiceDate)

    var baseTimeObj = new Date(Date.parse(baseTime.replace(/-/g, '/')))
    var invoiceTimeObj = new Date(Date.parse(invoiceDate.replace(/-/g, '/')))
    console.log('baseTimeObj 2021-01-01 00:00:00', baseTimeObj)
    console.log(`invoiceTimeObj ${invoiceTimeObj}`, invoiceTimeObj)
    console.log('baseTimeObj-invoiceTimeObj', baseTimeObj - invoiceTimeObj)
    if (baseTimeObj > invoiceTimeObj) {
      this.setData({
        isShowDialog: true,
      })
      return
    }

    // backTo完善信息页面
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    //将数值信息赋值给上一页面evidenceData变量
    prevPage.setData({
      eInvoiceInfo: item,
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
