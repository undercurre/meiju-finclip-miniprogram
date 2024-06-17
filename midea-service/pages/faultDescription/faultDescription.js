// const app = getApp()
import { service } from 'assets/js/service'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('接收到的数据', JSON.parse(decodeURIComponent(options.faultListInfo)))
    let faultList = JSON.parse(decodeURIComponent(options.faultListInfo))
    // this.getExcludedFaultList(faultItemInfo)   //假性故障自查由当前页面获取变更为上个页面传值过来
    this.setData({
      list: faultList,
    })
    wx.setNavigationBarTitle({
      title: faultList && faultList[0].serviceRequireItemName,
    })
  },

  isShowPanel(e) {
    console.log('e', e)
    let index = e.currentTarget.dataset.index
    const { list } = this.data
    // list[index].showPanel = !list[index].showPanel
    this.setData({
      [`list[${index}].showPanel`]: !list[index].showPanel,
    })
  },

  openFaultGuide(e) {
    console.log('e', e)
    // let url = e.currentTarget.dataset.guidelineLink
    // wx.navigateTo({
    //   url: `../faultDescription/faultDescription`,
    // })
  },

  getExcludedFaultList(faultItem) {
    // console.log("page getExcludedFaultList in...faultItem", faultItem)
    let params = {
      interfaceSource: 'SMART',
      operator: 'operator',
      operatorUnit: 'operatorUnit',
      orgCode: faultItem.orgCode,
      depth: '3',
      serviceRequireItemCode: faultItem.serviceRequireItemCode,
      brandCode: faultItem.brandCode,
      prodCode: faultItem.prodCode,
      parentServiceRequireCode: 'BX',
    }
    service
      .getExcludedFault(params)
      .then((data) => {
        data.list.forEach((item) => {
          item.showPanel = false
          // item.showPanel = true
        })
        console.log('data.list', data.list)
        this.setData({
          list: data.list,
        })
      })
      .catch(() => {
        this.setData({
          list: [],
        })
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
