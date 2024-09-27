const app = getApp() //获取应用实例
import { requestService } from '../../utils/requestService'
import { preventDoubleClick } from '../../utils/util'
import config from '../../config.js' //环境及域名基地址配置
import { showToast } from 'm-miniCommonSDK/index'
// import loginMethods from '../../globalCommon/js/loginRegister.js

Page({
  handleClick: preventDoubleClick(),
  /**
   * 页面的初始数据
   */
  data: {
    targetMobile: '',
  },
  backPage() {
    wx.navigateBack()
  },
  //   注销账号
  cancelAccount() {
    if (this.handleClick()) {
      this.getJwtToken()
    }
  },
  getJwtToken() {
    const wxAccessToken = app.globalData.wxAccessToken
    requestService
      .request('getJwtToken', { wxAccessToken })
      .then((res) => {
        const data = res.data
        if (+data.code === 0) {
          const host = `${config.privacyDomain[config.environment]}`
          const url = `${host}/mobile/cancellation/?system=meijuapp&jwt_token=${data.result}&redirect_uri=&is_switch_tab=true`
          wx.navigateTo({
            url: `/pages/webView/webView?webViewUrl=${encodeURIComponent(url)}&needCheckLogStatus=true`,
          })
        } else {
          showToast('程序员小哥哥植发去了，请稍后重试')
        }
      })
      .catch((e) => {
        console.log(e, 'logout')
      })
  },
  changeMobile() {
    if (this.handleClick()) {
      wx.navigateTo({
        url: '../bindPhone/bindPhone',
      })
    }
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
          targetMobile: res.data.data.mobile.substring(0, 3) + '****' + res.data.data.mobile.substring(7), //手机号脱敏，暂时先简单处理
        })
      })
      .catch((err) => {
        wx.hideLoading()
        console.log(err, 'err')
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getVipUserInfo()
  },

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
