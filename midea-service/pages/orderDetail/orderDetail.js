import { requestService } from '../../../utils/requestService'
import { mideaServiceImgApi } from '../../../api'
import computedBehavior from '../../../utils/miniprogram-computed.js'
import {
  orderProgress,
  map,
  orderSupplyInfo,
  // serviceChargeTypes,
  installation,
  maintenance,
  upkeep,
} from '../../../utils/paths.js'
import orderBase from '../../assets/js/orderBase.js'
import { orderListData } from '../orderList/assets/js/mock.js'
import { dateFormat } from 'm-utilsdk/index'
import { clickEventTracking } from '../../../track/track.js'
const app = getApp()
Page({
  behaviors: [computedBehavior, orderBase],
  /**
   * 页面的初始数据
   */
  data: {
    spritePicture: mideaServiceImgApi.url + 'icon.png',
    aImg: mideaServiceImgApi.url + 'install_img_cancel@2x.png',
    phoneNumber: app.globalData.phoneNumber,
    netShowFlag: true,
    isIphoneX: false,
    showCalendarPickerFlag: false,
    calendarConf: {
      confirmText: '确定',
      cancelText: '取消',
      title: '更改服务时间',
      cannotServiceTimeObj: {},
    },
    orderInfo: null,
    serviceOrderNo: '', //服务单号
    netBranch: null, //网点信息
    progressList: [], //进度列表
    lastProgress: null, //最新进度
    surplusAppointNumber: 2, //剩余改约时间次数
    isAbleChangeFlag: false, //是否能改时间
    ifChangeTwice: false,
    serviceTime: '',
    engineerInfo: null, //工程师信息
    aContent: '',
    conT: '您的服务订单已取消！为方便后续跟进您的服务，请您在24小时内点击服务通知反馈取消原因，我们将竭诚为您服务，谢谢！',
  },
  computed: {
    formattedOrder() {
      let self = this
      let { orderInfo } = self.data
      let result
      if (orderInfo) {
        result = self.formatOrder(orderInfo)
      }
      console.log(result)
      return result
    },
    servCustomerAddressAndPhone() {
      let { formattedOrder } = this.data
      let addInfo
      if (formattedOrder) {
        addInfo =
          formattedOrder.servCustomerName +
          ' ' +
          formattedOrder.servCustomerMobilephone1.replace(/(\w*)(\d{4})(\d{4})/, this.replaceMobileNumber)
      }
      return addInfo
    },
    //其他渠道报单不需必选择服务时间时，在订单详情不显示这个字段
    serviceTimeShow() {
      let { serviceTime } = this.data
      return serviceTime != '' && serviceTime != '暂无'
    },
    //选择时间时-显示剩余次数
    restTimeOfSubTitle() {
      let { surplusAppointNumber } = this.data
      return `服务时间最多只能更改${surplusAppointNumber}次`
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData()
    let self = this
    self.setData({
      serviceOrderNo: options.serviceOrderNo || '',
    })
    // this.getMockData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.globalData.selectedProductList = []
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
  // onShareAppMessage: function () {},
  goLogin() {
    wx.navigateTo({
      url: '../../../pages/login/login',
    })
  },
  initData() {
    let self = this
    self.getSystemInfo()
    self.getDataList()
    console.log('app.globalData.phoneNumber=====', app.globalData.phoneNumber)
  },
  //获取订单列表详情
  getDataList() {
    let self = this
    let orderInfo = wx.getStorageSync('CURRENT_ORDER_DETAIL')
      ? JSON.parse(wx.getStorageSync('CURRENT_ORDER_DETAIL'))
      : {}
    this.setData({
      orderInfo,
    })
    //网点
    if (orderInfo.unitCode) {
      self.getUnitArchivesData()
    }
    //进度
    self.getOrderProgress()
    //工单详情进度
    self.getUserDemandDispatch()
  },
  actionNetShow() {
    this.setData({
      netShowFlag: !this.data.netShowFlag,
    })
  },
  getSystemInfo() {
    let self = this
    wx.getSystemInfo({
      success: function (res) {
        console.log('getSystemInfo=====', res)
        if (res.safeArea.top > 20 && res.platform != 'android') {
          self.setData({
            isIphoneX: true,
          })
        } else {
          self.setData({
            isIphoneX: false,
          })
        }
      },
    })
  },
  makePhoneCall() {
    let { netBranch } = this.data
    let phoneNumber = netBranch.deliverTel
    wx.makePhoneCall({
      phoneNumber,
    })
  },
  setClipboardData() {
    let { serviceOrderNo } = this.data
    wx.setClipboardData({
      data: serviceOrderNo || '',
    })
  },
  //改约时间
  showCalendarPicker() {
    clickEventTracking('user_behavior_event', 'clickChangeTime')
    this.setData({
      showCalendarPickerFlag: true,
    })
  },
  selectDate(e) {
    let self = this
    let timeEvent = e.detail
    let { orderInfo, ifChangeTwice } = self.data
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
      content: ifChangeTwice ? timeStr + '\r\n\r\n确认后不能再次修改' : timeStr,
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
    let { orderInfo, ifChangeTwice, surplusAppointNumber } = self.data
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
        wx.showToast({
          title: '改约成功',
          icon: 'none',
        })
        self.getOrderProgress()
        self.setData({
          surplusAppointNumber: surplusAppointNumber - 1,
          serviceTime: currentAppiontTime,
        })
        if (ifChangeTwice) {
          self.setData({
            isAbleChangeFlag: false,
          })
        } else {
          self.setData({
            ifChangeTwice: true,
          })
        }
        //同步到订单列表
        app.globalData.currOrderServiceOrderNo = orderInfo.serviceOrderNo
        app.globalData.currOrderServiceChangeTime = currentAppiontTime
        app.globalData.currOrderServiceChangeTwice = ifChangeTwice
        app.globalData.currOrderSurplusAppointNumber = surplusAppointNumber - 1
      })
      .catch(() => {
        wx.showToast({
          title: '改约失败',
          icon: 'none',
        })
      })
  },
  //跳到进度
  goProgress() {
    clickEventTracking('user_behavior_event', 'clikcLatestProgress')
    let { progressList } = this.data
    wx.setStorageSync('CURRENT_ORDER_PROGRESS', JSON.stringify(progressList))
    wx.navigateTo({
      url: orderProgress,
    })
  },
  //跳到地图
  goMap() {
    let { netBranch } = this.data
    let latitude = netBranch.unitLatitude || ''
    let longitude = netBranch.nuitLongitude || ''
    wx.navigateTo({
      url: `${map}?latitude=${latitude}&longitude=${longitude}`,
    })
  },
  getMockData() {
    let self = this
    let { serviceOrderNo } = self.data
    let currList = orderListData.list
    let currInfo
    currList.forEach((item) => {
      if (item.serviceOrderNo == serviceOrderNo) {
        currInfo = item
      }
    })
    self.setData({
      orderInfo: currInfo,
    })
    //网点
    if (currInfo.unitCode) {
      self.getUnitArchivesData()
    }
    //进度
    self.getOrderProgress()
    //工单详情进度
    self.getUserDemandDispatch()
  },
  //获取服务网点
  getUnitArchivesData() {
    let self = this
    let { orderInfo } = self.data
    let param = {
      body: {
        prodCode: orderInfo.serviceUserDemandVOs[0].prodCode,
        brandCode: orderInfo.serviceUserDemandVOs[0].brandCode,
        unitCode: orderInfo.unitCode,
        unitName: orderInfo.unitName,
      },
    }
    requestService
      .request('getUnitArchivesData', param)
      .then((res) => {
        let result = res.data.list || []
        self.setData({
          netBranch: result.length ? result[0] : null,
        })
      })
      .catch(() => {})
  },
  //获取进度
  getOrderProgress() {
    let self = this
    let { orderInfo } = self.data
    let param = {
      body: {
        interfaceSource: orderInfo.interfaceSource,
        serviceOrderCode: orderInfo.serviceOrderNo,
      },
    }
    requestService
      .request('getOrderProgressData', param)
      .then((res) => {
        let progressList = res.data.oiqueryConsumerOrderProgressVOList
        let lastProgress = progressList.length ? progressList[0] : null
        let progressProcessTime = dateFormat(new Date(lastProgress.processTime), 'yyyy-MM-dd hh:mm:ss')
        self.setData({
          progressList,
          lastProgress,
          progressProcessTime,
        })
      })
      .catch(() => {})
  },
  getUserDemandDispatch() {
    let self = this
    let { orderInfo } = self.data
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
        self.handleDetailData(currData)
        self.setData({
          surplusAppointNumber: currData.surplusAppointNumber,
        })
      })
      .catch(() => {})
  },
  replaceMobileNumber(...args) {
    if (args[0].length != 11) {
      return args[0]
    } else {
      return args[1] + '****' + args[3]
    }
  },
  handleDetailData(data) {
    let { serviceTime } = this.data
    if (data.userDemandDispatchVOList.length) {
      let name = data.userDemandDispatchVOList[0].engineerName1
      name = name ? name[0] + '*'.repeat(name.length - 1) : null
      this.setData({
        engineerInfo: {
          name,
          id: data.userDemandDispatchVOList[0].engineerCode1,
        },
      })
    }
    let isAbleChangeFlag = data.isChangeFlag == 'N' ? false : true
    let ifChangeTwice = data.changeDate ? true : false
    let time = data.requireDateStr == '暂无' || !data.requireDateStr ? data.requireServiceDate : data.requireDateStr
    if (time) {
      serviceTime = time.replace(/^(\d+)(-)(\d+)(-)(\d+)/, (...args) => {
        return args[1] + '年' + +args[3] + '月' + +args[5] + '日'
      })
    }
    this.setData({
      isAbleChangeFlag,
      ifChangeTwice,
      serviceTime,
    })
  },
  goToOrderSupplyInfo() {
    clickEventTracking('user_behavior_event', 'clickEdit')
    wx.navigateTo({
      url: orderSupplyInfo,
    })
  },
  cancelOrderAction() {
    clickEventTracking('user_behavior_event', 'clickCancelOrder')
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
          self.cancelOrder()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      },
    })
  },
  cancelOrder() {
    let self = this
    let { orderInfo, phoneNumber } = self.data
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
        //状态设为已取消
        wx.showToast({
          title: '订单取消成功',
          icon: 'none',
        })
        self.getOrderProgress()
        self.getUserDemandDispatch()
        let serviceOrderStatus = 'orderInfo.serviceOrderStatus'
        self.setData({
          [serviceOrderStatus]: '22',
        })
        app.globalData.currOrderServiceOrderNo = orderInfo.serviceOrderNo
        app.globalData.currOrderServiceCancelFlag = true
      })
      .catch(() => {})
  },
  goServiceChargeTypes() {
    clickEventTracking('user_behavior_event', 'clickCharges')
    let { orderInfo } = this.data
    let currSelected = []
    currSelected = [...orderInfo.serviceUserDemandVOs]
    currSelected.reverse()
    app.globalData.selectedProductList = currSelected

    let selectedProduct = orderInfo.serviceUserDemandVOs
    if (selectedProduct.length == 1) {
      wx.navigateTo({
        url: `/midea-service/pages/serviceChargeTypes/serviceChargeTypes?location=${this.data.formattedOrder.servCustomerAddress}`,
      })
    } else {
      let brandCode = selectedProduct[0].brandCode
      let prodCode = selectedProduct[0].prodCode
      let newArr = selectedProduct.filter((item) => item.brandCode == brandCode && item.prodCode == prodCode)
      console.log(newArr)
      let installation = 'serviceChargeChange' //跳转来自安装页面改版后的收费逻辑
      if (newArr.length == selectedProduct.length) {
        wx.navigateTo({
          url: `/midea-service/pages/serviceChargeTypes/serviceChargeTypes?location=${this.data.formattedOrder.servCustomerAddress}`,
        })
      } else {
        wx.navigateTo({
          url: `/midea-service/pages/productSelection/productSelection?fromPage=${installation}`,
        })
      }
    }
  },
  renewOrder() {
    clickEventTracking('user_behavior_event', 'clickReportAgain')
    let { orderInfo } = this.data
    let canRenewCode = ['1910', '1010', '1111'] //支持安装，维修，保养工单重新报单
    if (!canRenewCode.includes(orderInfo.serviceSubTypeCode)) {
      wx.showToast({
        title: `美居Lite尚未支持${orderInfo.serviceSubTypeName}工单的重新报单`,
        icon: 'none',
      })
      return
    }
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
    console.log('param====', orderInfo)
  },
  goToCallback() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none',
    })
  },
})
