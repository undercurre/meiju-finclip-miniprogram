const app = getApp() //获取应用实例
import { requestService, uploadFileTask } from '../../utils/requestService'
import { api } from '../../api'
import { getReqId, getStamp } from 'm-utilsdk/index'
import { showToast } from '../../utils/util'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    oldMobile: '',
    inputValue: '',
    hasFixlength: false,
    showValideCodeDialog: false,
    valideCodeInfo: {
      randomToken: '',
      imgCode: '',
      imgDataCode: '',
    },
    classForButton: 'changePhoneBtn haveSomeOpacity',
  },
  backPage() {
    wx.navigateBack()
  },
  reflashCode() {
    this.checkPhone({}, {})
  },
  inputPhone(event) {
    let inputValue = event.detail.value
    this.setData({
      inputValue: inputValue,
      hasFixlength: inputValue.length == 11,
      classForButton: `changePhoneBtn ${inputValue.length != 11 ? 'haveSomeOpacity' : ''}`,
    })
  },
  recheckPhone() {
    if (this.data.valideCodeInfo.imgCode.length <= 0 || !this.data.valideCodeInfo.imgCode) {
      return
    }
    this.checkPhone(
      {},
      {
        randomToken: this.data.valideCodeInfo.randomToken,
        imgCode: this.data.valideCodeInfo.imgCode,
      }
    )
    this.toggleValideCode()
  },
  toggleValideCode() {
    this.setData({
      showValideCodeDialog: false,
    })
  },
  changeValideCode(event) {
    let valideCodeInfo = this.data.valideCodeInfo
    valideCodeInfo.imgCode = event.detail
    this.setData({
      valideCodeInfo: valideCodeInfo,
    })
  },
  handleResult(res) {
    console.log(`请求返回结果：${JSON.stringify(res)}`)
    if (res.data && typeof res.data.code !== 'undefined') {
      switch (Number(res.data.code)) {
        case 0:
          wx.navigateTo({
            url: `../checkValidecode/checkValidecode?mobile=${this.data.inputValue}&oldMobile=${this.data.oldMobile}`,
          })
          break
        case 65011:
          this.setData({
            showValideCodeDialog: true,
            valideCodeInfo: {
              randomToken: res.data.data.randomToken,
              imgCode: '',
              imgDataCode: res.data.data.imgCode,
            },
          })
          break
        case 1006:
          showToast('手机号输入有误，请重新输入')
          break
        case 1104:
          showToast(`${this.data.inputValue}手机号已注册，请更换新手机号`)
          break
        case 1100:
          showToast('验证码已过期')
          break
        case 1129:
          showToast('获取频繁，请稍后再试！')
          break
        case 65009:
          showToast('验证码错误，请重新输！')
          break
        default:
          showToast('系统错误，请稍后重试')
          break
      }
    } else {
      showToast('系统错误，请稍后重试')
    }
  },
  checkPhone(event, requestParam) {
    // let checkPhoneNum = `${this.data.mobileLeft}${this.data.inputValue}${this.data.mobileRight}`
    if (!/^1[3-9]\d{9}$/.test(this.data.inputValue)) {
      showToast('手机号输入有误，请重新输入')
      return
    }
    if (this.data.inputValue == this.data.oldMobile) {
      showToast('与原手机号相同，无需重复绑定')
      return
    }
    let params = {
      iotData: {
        type: '7',
        iotAppId: api.iotAppId,
        src: '2',
        mobile: this.data.inputValue,
        reqId: getReqId(),
        stamp: getStamp(new Date()),
      },
      data: {
        deviceId: app.globalData.deviceId || app.globalData.appSystemInfo.deviceId || this.data.inputValue,
        appKey: '46579c15',
        ...requestParam,
      },
      reqId: getReqId(),
      stamp: getStamp(new Date()),
      timestamp: getStamp(new Date()),
    }
    wx.showLoading({
      title: '加载中',
    })
    // 请求后台，更换手机号码
    requestService
      .request('gitSmsCode', params)
      .then((res) => {
        wx.hideLoading()
        this.handleResult(res)
      })
      .catch((res) => {
        wx.hideLoading()
        this.handleResult(res)
      })
  },
  getVipUserInfo() {
    let data = {
      headParams: {},
      restParams: {
        sourceSys: 'IOT',
        userId: app.globalData.userData.userInfo.userId,
        brand: 1,
        mobile: app.globalData.userData.userInfo.mobile,
      },
    }
    requestService
      .request('getVipUserInfo', data)
      .then((res) => {
        wx.hideLoading()
        console.log(res.data.data.mobile, 'targetres')
        this.setData({
          mobile: res.data.data.mobile,
        })
      })
      .catch((err) => {
        wx.hideLoading()
        showToast('系统繁忙，请稍后再试')
        console.log(err, 'err')
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option) {
    this.setData({
      oldMobile: option.oldMobile,
    })
    // this.getVipUserInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},
})
