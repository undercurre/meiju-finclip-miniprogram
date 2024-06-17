import { requestService } from '../../../utils/requestService'
import { mideaServiceImgApi, imgBaseUrl, api } from '../../../api'
import orderBase from '../../assets/js/orderBase.js'
import computedBehavior from '../../../utils/miniprogram-computed.js'
import { orderDetail, orderSupplyInfo, installation, maintenance, upkeep } from '../../../utils/paths.js'
import { orderListData } from './assets/js/mock.js'
import { clickEventTracking } from '../../../track/track.js'
import { judgeWayToMiniProgram } from '../../../utils/util'
const app = getApp()
Page({
  behaviors: [computedBehavior, orderBase],
  /**
   * 页面的初始数据
   */
  data: {
    imgBaseUrl: imgBaseUrl.url,
    imgNoBook: mideaServiceImgApi.url + 'img_no_book@1x.png',
    ImgServiceFinish: mideaServiceImgApi.url + 'service_ic_finish@1x.png',
    ImgMideaLogonIcon: mideaServiceImgApi.url + 'service_midea_logon_icon.png',
    pageNum: 1,
    isLoaded: false,
    orderList: [],
    hasNext: false, //是否有下一页
    phoneNumber: app.globalData.phoneNumber,
    showCalendarPickerFlag: false,
    calendarConf: {
      confirmText: '确定',
      cancelText: '取消',
      title: '更改服务时间',
      cannotServiceTimeObj: {},
    },
    fromPage: '',
    surplusAppointNumber: 2, //剩余改约时间次数
    common: '/mideaServices/images/icon.png',
    formattedOrderList: [],
    toServiceIndex: -1, //打开美的服务的以换待修工单index
  },
  computed: {
    restTimeOfSubTitle() {
      let { surplusAppointNumber } = this.data
      return `服务时间最多只能更改${surplusAppointNumber}次`
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let pages = getCurrentPages()
    if (pages.length != 1) {
      let prevPage = pages[pages.length - 2]
      let route = prevPage.route
      clickEventTracking('user_page_view', '', {
        refer_page_name: route,
      })
    }
    this.setData({
      fromPage: options.fromPage,
    })
    app.globalData.currOrderServiceOrderNo = ''
    app.globalData.currOrderServiceCancelFlag = false
    app.globalData.currOrderServiceChangeTime = ''
    app.globalData.currOrderServiceChangeTwice = false
    app.globalData.currOrderSurplusAppointNumber = 2
    this.initData('init')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let currOrderServiceOrderNo = app.globalData.currOrderServiceOrderNo
    //取消订单时列表更新
    this.updateOrderInfoByServiceOrderNo(currOrderServiceOrderNo)
    //以换代修工单半屏打开美的服务小程序，返回美居lite小程序重新请求工单
    let { toServiceIndex } = this.data
    if (toServiceIndex != -1) {
      let reqPage = Math.ceil((toServiceIndex + 1) / 10)
      let updateOneOrder = {
        reqPage: reqPage,
        updateIndex: toServiceIndex - (reqPage - 1) * 10,
      }
      this.initData('backFromService', updateOneOrder)
    }
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
  onPullDownRefresh: function () {
    this.refreshData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getNextPage()
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {},
  goLogin() {
    wx.navigateTo({
      url: '../../../pages/login/login',
    })
  },
  refreshData() {
    let { isLoaded } = this.data
    if (!isLoaded) {
      return
    }
    this.setData({
      pageNum: 1,
    })
    this.initData('refresh')
  },
  getNextPage() {
    let { pageNum, hasNext } = this.data
    if (!hasNext) {
      return
    }
    this.setData({
      pageNum: pageNum + 1,
    })
    this.initData('next')
  },
  //获取订单列表
  initData(str, updateOneOrder) {
    let self = this
    let { pageNum } = self.data
    wx.showLoading({
      title: '加载中...',
    })
    let param = {
      body: {
        //取消接口要写死 interfaceSource：SMART  不然无法识别
        interfaceSource: 'SMART',
        page: updateOneOrder ? updateOneOrder.reqPage : pageNum,
        resultNum: 10,
        appVersion: 'SMART_V3',
        webUserPhone: app.globalData.userData.userInfo.mobile,
        webSystemCode: app.globalData.userData.uid,
      },
    }
    requestService
      .request('queryServiceOrder', param)
      .then((res) => {
        console.log('queryServiceOrder========', res)
        let data = res.data
        let currList = res.data.list
        currList.forEach((value) => {
          if (value.serviceUserDemandVOs) {
            value.serviceUserDemandVOs.forEach((item, index) => {
              let img = `${
                value.serviceUserDemandVOs[index].prodCode +
                value.serviceUserDemandVOs[index].brandName +
                value.serviceUserDemandVOs[index].prodName
              }`
              item.productImgUrl = `https://fcmms.midea.com/ccrm-sit/productImg/${img}.jpg`
            })
          }
        })
        wx.hideLoading()
        console.log('orderlist==currList===', currList)
        console.log('hasNext====', data.pageIndex < data.pageCount)
        let { orderList, toServiceIndex } = self.data
        // 如果是以换代修工单半屏打开美的小程序重新查询工单，则只更新打开美的服务以换代修工单的数据
        if (str == 'backFromService') {
          let update = `orderList[${toServiceIndex}]`
          let target = []
          target.push(currList[updateOneOrder.updateIndex])
          console.log('修改目标', update)
          console.log('更新的数据', target)
          self.setData({
            [update]: target[0],
          })
          self.setData({
            isLoaded: true,
          })
          let formatList = target.map((order) => {
            return self.formatOrder(order)
          })
          console.log('更新的数据formatList', formatList)
          let updateFormat = `formattedOrderList[${toServiceIndex}]`
          self.setData({
            [updateFormat]: formatList[0],
            toServiceIndex: -1,
          })
          wx.stopPullDownRefresh()
          return
        }
        if (str != 'next') {
          self.setData({
            orderList: currList,
          })
        } else {
          self.setData({
            orderList: [...orderList, ...currList],
          })
        }
        self.setData({
          isLoaded: true,
        })
        self.data.hasNext = data.pageIndex * data.pageSize >= data.total ? false : true
        //不可改变订单顺序
        let formatList = self.data.orderList.map((order) => {
          return self.formatOrder(order)
        })
        self.setData({
          formattedOrderList: formatList,
        })
        wx.stopPullDownRefresh()
      })
      .catch(() => {
        wx.hideLoading()
        self.setData({
          isLoaded: true,
        })
        self.data.hasNext = false
      })
  },
  getMockData() {
    let self = this
    console.log(orderListData)
    let currList = orderListData.list
    currList.forEach((value) => {
      let img = `${
        value.serviceUserDemandVOs[0].prodCode +
        value.serviceUserDemandVOs[0].brandName +
        value.serviceUserDemandVOs[0].prodName
      }`
      value.productImgUrl = `https://fcmms.midea.com/ccrm-sit/productImg/${img}.jpg`
    })
    console.log('orderlist==currList===', currList)
    self.setData({
      isLoaded: true,
      orderList: currList,
    })
    self.data.hasNext = orderListData.pageIndex * orderListData.pageSize >= orderListData.total ? false : true
  },
  goDetail(e) {
    let { id, index, code, serviceorderno, interfacesource, orgcode } = e.currentTarget.dataset
    if (code == '2020') {
      let data = {
        serviceOrderNo: serviceorderno,
        interfaceSource: interfacesource,
        orgCode: orgcode,
        index: index,
      }
      this.goReplaceRepair(data)
      return
    }
    app.globalData.currOrderServiceOrderNo = ''
    app.globalData.currOrderServiceCancelFlag = false
    app.globalData.currOrderServiceChangeTime = ''
    app.globalData.currOrderServiceChangeTwice = false
    app.globalData.currOrderSurplusAppointNumber = 2
    let { orderList } = this.data
    console.log(orderList[index])
    wx.setStorageSync('CURRENT_ORDER_DETAIL', JSON.stringify(orderList[index]))
    wx.navigateTo({
      url: `${orderDetail}?serviceOrderNo=${id}`,
    })
  },
  goToOrderSupplyInfo(e) {
    let { name, code, index, serviceorderno, interfacesource, orgcode } = e.currentTarget.dataset
    if (code == '2020') {
      let data = {
        serviceOrderNo: serviceorderno,
        interfaceSource: interfacesource,
        orgCode: orgcode,
        index: index,
      }
      this.goReplaceRepair(data)
      return
    }
    clickEventTracking('user_behavior_event', 'clickEdit', {
      ext_info: {
        order_type: name,
      },
    })
    let { orderList } = this.data
    wx.setStorageSync('CURRENT_ORDER_DETAIL', JSON.stringify(orderList[index]))
    wx.navigateTo({
      url: orderSupplyInfo + `?serviceSubTypeCode=${code}`,
    })
  },
  cancelOrderAction(e) {
    let { name, index, code, serviceorderno, interfacesource, orgcode } = e.currentTarget.dataset
    if (code == '2020') {
      let data = {
        serviceOrderNo: serviceorderno,
        interfaceSource: interfacesource,
        orgCode: orgcode,
        index: index,
      }
      this.goReplaceRepair(data)
      return
    }
    clickEventTracking('user_behavior_event', 'clickCancel', {
      ext_info: {
        order_type: name,
      },
    })
    let self = this
    wx.showModal({
      content: '确定要取消此服务订单吗？',
      showCancel: true,
      cancelText: '否',
      confirmText: '是',
      cancelColor: '#267aff',
      confirmColor: '#267aff',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          self.cancelOrder(index)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      },
    })
  },
  cancelOrder(index) {
    let self = this
    let { orderList, phoneNumber } = self.data
    let orderInfo = orderList[index]
    let param = {
      body: {
        //取消接口要写死 interfaceSource：SMART  不然无法识别
        interfaceSource: 'SMART',
        orgCode: orderInfo.orgCode,
        serviceOrderNo: orderInfo.serviceOrderNo,
        operator: phoneNumber,
      },
    }
    console.log('cancel=====', param)
    requestService
      .request('cancelServiceOrder', param)
      .then(() => {
        self.refreshData()
      })
      .catch(() => {})
  },
  //改约时间
  showCalendarPicker(e) {
    let name = e.currentTarget.dataset.name
    clickEventTracking('user_behavior_event', 'clickChangeTime', {
      ext_info: {
        order_type: name,
      },
    })
    let index = e.currentTarget.dataset.index
    let { orderList } = this.data
    let orderInfo = orderList[index]
    console.log('orderInfo.surplusAppointNumber====', orderInfo.surplusAppointNumber)
    this.setData({
      surplusAppointNumber: orderInfo.surplusAppointNumber,
    })
    this.setData({
      currIndex: index,
      showCalendarPickerFlag: true,
    })
  },
  selectDate(e) {
    let self = this
    let timeEvent = e.detail
    let { orderList, currIndex, surplusAppointNumber } = self.data
    let orderInfo = orderList[currIndex]
    let previousAppiontTime = orderInfo.requireServiceDate
    //"2021-06-30 17:00-18:00"
    let currentAppiontTime = timeEvent.date + ' ' + timeEvent.serviceTime
    console.log('timeEvent=====', previousAppiontTime, currentAppiontTime)
    let timeStr = timeEvent.year + '年' + timeEvent.month + '月' + timeEvent.day + '日 ' + timeEvent.serviceTime
    if (previousAppiontTime == currentAppiontTime) {
      wx.showToast({
        title: '与原服务时间一致',
        icon: 'none',
      })
      return
    }
    wx.showModal({
      title: '是否将服务时间更改为',
      content: surplusAppointNumber == 1 ? timeStr + '\r\n\r\n确认后不能再次修改' : timeStr,
      showCancel: true,
      cancelColor: '#267aff',
      confirmColor: '#267aff',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          self.changeServiceTime(currentAppiontTime)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      },
    })
  },
  changeServiceTime(currentAppiontTime) {
    let self = this
    let { orderList, currIndex } = self.data
    let orderInfo = orderList[currIndex]
    let param = {
      operator: orderInfo.servCustomerCode || '',
      currentAppiontTime: currentAppiontTime,
      previousAppiontTime: orderInfo.requireServiceDate, //2021-06-24 13:00-14:00
      serviceOrderNo: orderInfo.serviceOrderNo,
    }
    console.log('changeServiceTime=====', param)
    requestService
      .request('doChangeAppoint', param)
      .then(() => {
        self.refreshData()
      })
      .catch(() => {})
  },
  renewOrder(e) {
    let { name, code, serviceorderno, interfacesource, orgcode, index } = e.currentTarget.dataset
    if (code == '2020') {
      let data = {
        serviceOrderNo: serviceorderno,
        interfaceSource: interfacesource,
        orgCode: orgcode,
        index: index,
      }
      this.goReplaceRepair(data)
      return
    }
    let canRenewCode = ['1910', '1010', '1111'] //支持安装，维修，保养工单重新报单
    if (!canRenewCode.includes(code)) {
      wx.showToast({
        title: `美居Lite尚未支持${name}工单的重新报单`,
        icon: 'none',
      })
      return
    }
    clickEventTracking('user_behavior_event', 'clickResubmit', {
      ext_info: {
        order_type: name,
      },
    })
    let orderInfo = this.data.orderList[index]
    console.log(orderInfo)
    //如果是保养订单
    // if(orderInfo.serviceMainTypeName == '保养' || orderInfo.serviceSubTypeName == '保养'){
    //   wx.showToast({
    //     title: '小程序暂不支持保养服务',
    //     icon: 'none'
    //   })
    //   return
    // }
    let param = {
      result: 'success',
      data: JSON.stringify(orderInfo),
    }
    app.globalData.currentOrder = param
    if (orderInfo.serviceSubTypeCode && orderInfo.serviceSubTypeCode == 1111) {
      wx.navigateTo({
        url: `${maintenance}?isRenew=true`,
      })
    } else if (orderInfo.serviceSubTypeCode && orderInfo.serviceSubTypeCode == 1010) {
      wx.navigateTo({
        url: `${installation}?isRenew=true`,
      })
    } else if (orderInfo.serviceSubTypeCode && orderInfo.serviceSubTypeCode == 1910) {
      wx.navigateTo({
        url: `${upkeep}?isRenew=true`,
      })
    } //保养
    console.log('param====', param)
  },
  goToCallback() {
    wx.showToast({
      title: '小程序暂不支持，您可以下载美居App评价哦',
      icon: 'none',
    })
  },
  bindImgError(e) {
    let index = e.currentTarget.dataset.index
    let imgFailFlag = 'orderList[' + index + '].imgFailFlag'
    let showImgFailFlag = 'formattedOrderList[' + index + '].imgFailFlag'
    this.setData({
      [imgFailFlag]: true,
      [showImgFailFlag]: true,
    })
    console.log('bindImgError======', e)
  },
  imgError(e) {
    let { index } = e.currentTarget.dataset
    let imgFailFlag = 'orderList[' + index + '].interfaceSourceIcon'
    let showImgFailFlag = 'formattedOrderList[' + index + '].interfaceSourceIcon'
    this.setData({
      [imgFailFlag]: mideaServiceImgApi.url + 'logo/WCP.png',
      [showImgFailFlag]: mideaServiceImgApi.url + 'logo/WCP.png',
    })
  },
  updateOrderInfoByServiceOrderNo(serviceOrderNo) {
    let self = this
    if (!serviceOrderNo) {
      return
    }
    let currOrderServiceChangeTime = app.globalData.currOrderServiceChangeTime
    let currOrderServiceCancelFlag = app.globalData.currOrderServiceCancelFlag
    let currOrderServiceChangeTwice = app.globalData.currOrderServiceChangeTwice
    let currOrderSurplusAppointNumber = app.globalData.currOrderSurplusAppointNumber
    let { orderList } = self.data
    let orderIndex = 0
    orderList.forEach((item, index) => {
      if (item.serviceOrderNo == serviceOrderNo) {
        orderIndex = index
      }
    })
    //更改时间
    if (currOrderServiceChangeTime) {
      let requireServiceDate = 'orderList[' + orderIndex + '].requireServiceDate'
      let isChangeFlag = 'orderList[' + orderIndex + '].isChangeFlag'
      let surplusAppointNumber = 'orderList[' + orderIndex + '].surplusAppointNumber'
      self.setData({
        [requireServiceDate]: currOrderServiceChangeTime,
        [isChangeFlag]: currOrderServiceChangeTwice ? 'N' : 'Y',
        [surplusAppointNumber]: currOrderSurplusAppointNumber,
      })
    }
    //取消订单
    if (currOrderServiceCancelFlag) {
      let serviceOrderStatus = 'orderList[' + orderIndex + '].serviceOrderStatus'
      let isChangeFlag = 'orderList[' + orderIndex + '].isChangeFlag'
      self.setData({
        [serviceOrderStatus]: '22',
        [isChangeFlag]: 'N',
      })
    }
  },
  //联系网点
  callService(e) {
    let name = e.currentTarget.dataset.name
    clickEventTracking('user_behavior_event', 'clickServicePoint', {
      ext_info: {
        order_type: name,
      },
    })
    let self = this
    let index = e.currentTarget.dataset.index
    let { orderList } = self.data
    let orderInfo = orderList[index]
    let param = {
      body: {
        interfaceSource: orderInfo.interfaceSource,
        serviceOrderNo: orderInfo.serviceOrderNo,
        orgCode: orderInfo.orgCode,
        customerPhone: orderInfo.webUserPhone ? orderInfo.webUserPhone : orderInfo.customerMobilephone1,
        appVersion: 'SMART_V3',
      },
    }
    requestService
      .request('getUserDemandDispatch', param)
      .then((res) => {
        let currData = res.data
        if (currData.unitTel) {
          wx.showModal({
            title: '网点客户服务',
            content: '拨打网点热线电话：' + currData.unitTel,
            showCancel: true,
            cancelText: '取消',
            confirmText: '呼叫',
            cancelColor: '#267aff',
            confirmColor: '#267aff',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.makePhoneCall({
                  phoneNumber: currData.unitTel,
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            },
          })
        }
      })
      .catch(() => {})
  },
  //以换代修工单打开美的服务对应工单详情页
  goReplaceRepair(data) {
    let { serviceOrderNo, interfaceSource, orgCode, index } = data
    this.setData({
      toServiceIndex: index,
    })
    let path = `pages/authorize/authorize?pathName=/pages/progress/progressDetail/progressDetail&serviceOrderNo=${serviceOrderNo}&interfaceSource=${interfaceSource}&orgCode=${orgCode}`
    let extra = {
      jp_source: 'midea-meiju-lite',
      jp_c4a_uid: app.globalData.userData.uid,
    }
    console.log('打开美的服务小程序路径', path)
    console.log('打开美的服务小程序参数', extra)
    judgeWayToMiniProgram(api.serviceAppid, path, extra)
  },
})
