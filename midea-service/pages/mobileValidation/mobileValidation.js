const app = getApp()
let timer = null
import { service } from '../../assets/js/http.js'
// import { imgBaseUrl } from '../../../api'
import computedBehavior from '../../../utils/miniprogram-computed.js'
Page({
  behaviors: [computedBehavior],
  data: {
    isShow: true,
    modifyPhoneUrl: '',
    hideCom: true,
    phoneNum:
      app.globalData.userData && app.globalData.userData.userInfo.mobile ? app.globalData.userData.userInfo.mobile : '',
    msgCode: '',
    timeLeave: 60,
    timer: null,
    tipsText: '',
    isRenew: '', //是不是重新下单
    tipsContent: '发送验证码',
    isClick: false,
    longToastContent: '',
    isLongToast: false,
  },
  computed: {
    disabled() {
      let result = true
      if (this.data.msgCode) {
        result = false
      }
      return result
    },
  },
  onLoad: function (options) {
    // 进入立马执行
    this.sendCodeHandler()
    if (options.isRenew) {
      this.setData({
        isRenew: options.isRenew,
      })
    }
    if (options.from) {
      this.setData({
        from: options.from,
      })
    }
  },
  clearTipsHandler() {
    this.setData({
      tipsText: '',
    })
  },
  bindInputHandler(e) {
    let key = e.currentTarget.dataset.key,
      value = e.detail.value
    this.setData({
      [key]: value,
    })
  },
  cancelHandler() {
    this.triggerEvent('cancel', {
      type: 'btn',
    })
  },
  // 发送验证码
  sendCodeHandler() {
    if (!this.data.phoneNum) {
      app.showToast('请输入手机号')
      return
    }
    this.setData({
      isClick: true,
      // tipsContent:'重新获取(59s)'
    })
    let params = this.data.phoneNum

    service
      .sendMobileCode(params)
      .then((res) => {
        console.log(res)
        console.log('验证码发过来了')
        if (res.code == 0) {
          this.timerAction() //开始倒计时
        }
      })
      .catch((error) => {
        console.log(error)
        this.setData({
          longToastContent: error.data.msg,
          isLongToast: true,
        })
        setTimeout(() => {
          this.setData({
            isLongToast: false,
          })
        }, 2000)
      })
  },
  /**
   * 倒计时
   */
  timerAction() {
    console.log('')
    timer = setInterval(() => {
      if (this.data.timeLeave < 1) {
        clearInterval(timer)
        this.setData({
          timeLeave: 60,
          tipsContent: '重新获取',
        })
      }
      this.setData({
        timeLeave: --this.data.timeLeave,
      })
    }, 1000)
  },
  // 提交按钮
  confirmHandler() {
    if (this.data.phoneNum) {
      this.validatePhone()
    }
  },
  // 校验接口
  validatePhone() {
    if (!this.data.msgCode) {
      app.showToast('请输入验证码')
      return
    }
    //   "code":"123456",
    // "plugin_version":"7.7.0.2_2021061710",
    // "sourceSys":"APP",
    // "mobile":"19972083481",
    // "tm":1624274815
    // let params = {
    //   mobile: this.data.phoneNum,
    //   code: this.data.msgCode,
    //   sourceSys: 'APP',
    //   plugin_version: '7.7.0.2_2021061710',
    //   tm: Math.round(new Date().getTime() / 1000), //时间戳
    // }
    let params = {
      restParams:{
        mobile: this.data.phoneNum,
        code: this.data.msgCode,
        sourceSys: 'APP'
      }
    }
    wx.showLoading({
      title: '验证中',
      mask: true,
    })
    service
      .commitMobileCode(params)
      .then((res) => {
        wx.hideLoading({
          success: () => {},
        })
        if (res.code == "000000") {
          wx.showToast({
            title: '验证成功',
            icon: 'none',
            duration: 1500,
          })
          // 静默使用下单接口
          let param = app.globalData.submittingOrderData
          service
            .sendOrderForm(param)
            .then(() => {
              setTimeout(() => {
                if (this.data.isRenew) {
                  //重新报单
                  // this.back({ viewTag: 'orderList' })
                  // wx.navigateBack({
                  //   delta: 0,
                  // })
                  // setTimeout(() => {
                  wx.redirectTo({
                    url: '/midea-service/pages/orderList/orderList',
                  })
                  // }, 2500);
                } else {
                  //安装，维修(先返回，再触发跳转)
                  // this.back()

                  // setTimeout(() => {
                  wx.redirectTo({
                    url: '/midea-service/pages/orderList/orderList',
                  })
                  // }, 2500);

                  // let pages = getCurrentPages();
                  // let prevPage = pages[pages.length - 2];
                  // prevPage.setData({
                  //   isEnter: true, //是否立刻跳转
                  // })
                  // wx.navigateBack({
                  //   delta: 1 // 返回上一级页面。
                  // })
                }
              }, 1600)
            })
            .catch((error) => {
              // let pages = getCurrentPages();
              // let prevPage = pages[pages.length - 2];
              // prevPage.setData({
              //   isEnter: false, //是否立刻跳转  false不跳
              // })
              // wx.navigateBack({
              //   delta: 1 // 返回上一级页面。
              // })
              console.log(error)
              this.setData({
                longToastContent: error.data.msg,
                isLongToast: true,
              })
              setTimeout(() => {
                this.setData({
                  isLongToast: false,
                })
              }, 2000)
            })
        }
      })
      .catch((error) => {
        wx.hideLoading({
          success: () => {},
        })
        console.log(error)
        this.setData({
          longToastContent: error.data.msg,
          isLongToast: true,
        })
        setTimeout(() => {
          this.setData({
            isLongToast: false,
          })
        }, 2000)
      })
  },
  // 完成未完成的下单

  onReady: function () {},
  onShow: function () {},
  onHide: function () {
    // app.globalData.selectedProductList = [];
    // app.globalData.maintenanceItem=''
    // if(this.data.from == 'install'){
    //   var pages = getCurrentPages();
    //   var prevPage = pages[pages.length - 2];
    //   prevPage.setData({
    //     placeStatu:{},
    //     displayServiceDate:'',
    //     logisticStatu:{},
    //     actionList:[],
    //     memoValue:[]
    //   })
    // }
    // if(this.data.from == 'maintenance'){
    //   var pages = getCurrentPages();
    //   var prevPage = pages[pages.length - 2];
    //   prevPage.setData({
    //     placeStatu:{},
    //     fault:'',
    //     displayServiceDate:'',
    //     memoValue:[],
    //     code:'',
    //     showPhotoList:[]
    //   })
    // }
  },
  onUnload: function () {
    app.globalData.selectedProductList = []
  },
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  // onShareAppMessage: function () {

  // }
})
