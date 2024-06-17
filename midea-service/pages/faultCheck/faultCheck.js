// midea-service/pages/faultCheck/faultCheck.js
const app = getApp()
import { service } from 'assets/js/service'
import { clickEventTracking } from '../../../track/track.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isMock: false,
    checkSelfList: [],
    needServiceList: [],
    toastTitle: '',
    showToast: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    let route = prevPage.route
    clickEventTracking('user_page_view', '', {
      refer_page_name: route,
    })
    console.log('app.globalData.selectedProductList', app.globalData.selectedProductList)
    let product = app.globalData.selectedProductList
    // this.getSelectedProduct()   //手动mock-data
    this.queryservicerequireproduct()
    wx.setNavigationBarTitle({
      title: (product && product[0].prodName) || '故障自查',
    })
  },

  getSelectedProduct() {
    const { isMock } = this.data
    if (isMock) {
      // 测试数据，提交时要注释掉
      app.globalData.selectedProductList.push({
        children: [],
        orgCode: 'CS009',
        prodCode: '1028',
        prodImg: 'http://filecmms.midea.com/PDGW-PROD-IMG/productImg/1028美的燃气壁挂炉.jpg',
        prodLevel: '2',
        prodName: '燃气壁挂炉',
        rowId: '1000000247',
        userTypeCode: 'U04',
        userTypeName: '热水器',
        userTypeSort: 0,
        brandCode: 'MIDEA',
      })
    }
    if (app.globalData.selectedProductList && app.globalData.selectedProductList.length > 0) {
      this.data.productItem = app.globalData.selectedProductList[0]
    }
  },

  toSelfCheckItem(e) {
    wx.showLoading()
    let checkItem = e.currentTarget.dataset.item,
      faultCheckList
    console.log('checkItem', checkItem)
    clickEventTracking('user_behavior_event', 'clickSelfCheckProb', {
      object_name: checkItem.serviceRequireItemName,
    })
    let params = {
      interfaceSource: 'SMART',
      operator: 'operator',
      operatorUnit: 'operatorUnit',
      orgCode: checkItem.orgCode,
      depth: '3',
      serviceRequireItemCode: checkItem.serviceRequireItemCode,
      brandCode: checkItem.brandCode,
      prodCode: checkItem.prodCode,
      parentServiceRequireCode: 'BX',
    }
    service
      .getExcludedFault(params)
      .then((data) => {
        wx.hideLoading()
        if (data.list && data.list.length > 0) {
          data.list.forEach((item) => {
            item.showPanel = data.list.length > 1 ? false : true
          })
          console.log('data.list', data.list)
          faultCheckList = data.list
          console.log('faultCheckList', faultCheckList)
          let faultListInfo = encodeURIComponent(JSON.stringify(faultCheckList))
          console.log('faultListInfo', faultListInfo)
          wx.navigateTo({
            url: `../faultDescription/faultDescription?faultListInfo=${faultListInfo}`,
          })
        } else {
          this.setData({
            toastTitle: '该服务请求没有故障描述列表',
            showToast: true,
          })
        }
      })
      .catch(() => {
        wx.hideLoading()
        wx.showToast({
          title: '接口服务异常',
        })
      })
  },

  registerRepair(e) {
    console.log(e)
    let checkItem = e.currentTarget.dataset.item
    clickEventTracking('user_behavior_event', 'clickProMaintain', {
      object_name: checkItem.serviceRequireItemName,
    })
    console.log(checkItem)
    let faultItemInfo = encodeURIComponent(JSON.stringify(checkItem))
    wx.navigateTo({
      url: `../maintenance/maintenance?faultItemInfo=${faultItemInfo}`,
    })
  },

  queryservicerequireproduct() {
    wx.showLoading()
    const selectProdItem = app.globalData.selectedProductList && app.globalData.selectedProductList[0]
    console.log('selectProdItem', selectProdItem)
    // let params = {
    //   brandCode: 'MIDEA',
    //   depth: '3',
    //   orgCode: '',
    //   interfaceSource: 'SMART', // 6.1发版后等后台发版启用
    //   parentServiceRequireCode: 'BX',
    //   prodCode: '1000'
    // }
    let params = {
      brandCode: selectProdItem.brandCode,
      depth: '3',
      orgCode: selectProdItem.orgCode,
      interfaceSource: 'SMART', // 6.1发版后等后台发版启用
      parentServiceRequireCode: 'BX',
      prodCode: selectProdItem.prodCode,
    }
    service
      .queryservicerequireproduct(params)
      .then((data) => {
        wx.hideLoading()
        let checkSelfList = data.list.filter((ele) => {
          return ele.isExcludedFault === 'Y'
        })
        let needServiceList = data.list.filter((ele) => {
          return ele.isExcludedFault === 'N'
        })
        this.setData({
          checkSelfList,
          needServiceList,
        })
      })
      .catch(() => {
        wx.hideLoading()
        this.setData({
          checkSelfList: [],
          needServiceList: [],
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
