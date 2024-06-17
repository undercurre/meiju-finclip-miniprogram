// "navigationStyle": "custom", 其他与defaultWebview一致
import { hasKey } from 'm-utilsdk/index'
import { aesEncryptUrl, getFullPageUrl } from '../../utils/util.js'
const app = getApp()
import loginMethods from '../../globalCommon/js/loginRegister.js'
import { getWxSystemInfo } from '../../utils/wx/index.js'
Page({
  behaviors: [],
  /**
   * 页面的初始数据
   */
  data: {
    pageUrl: '',
    options: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.setData({
      options: options,
    })
    const webViewUrl = decodeURIComponent(this.getWebViewUrl())
    console.log(webViewUrl, 'webViewUrl')
    if (webViewUrl.indexOf('loginState') > -1 || options.loginState) {
      aesEncryptUrl('Y', webViewUrl).then((data) => {
        if (data) {
          console.log('webViewUrl', data)
          this.setData({
            pageUrl: data,
          })
          console.log('新webViewUrl-last-pageUrl', this.data.pageUrl)
        }
      })
    } else {
      this.setData({
        pageUrl: webViewUrl,
      })
      console.log('新webViewUrl-else-pageUrl', this.data.pageUrl, typeof this.data.pageUrl)
    }
    const pageTitle = options && options.pageTitle
    const res = await this.checkSystem()
    if (res) {
      pageTitle && this.setNavBarTitle(pageTitle)
    }  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('新webViewUrl---onshow---webViewFlag', app.globalData.webViewFlag)
    if (app.globalData.webViewFlag) {
      let page = getCurrentPages()
      app.globalData.webViewFlag = false
      if (page.length > 1) {
        let lastPath = '/' + getFullPageUrl('prev')
        wx.reLaunch({
          url: lastPath,
        })
      } else {
        wx.reLaunch({
          url: '/pages/index/index',
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (this.options && this.options.needCheckLogStatus) {
      loginMethods.getLogoutStatus().then((res) => {
        if (res && +res.code === 0) {
          loginMethods.logout()
        }
      })
    }
  },

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
  // onShareAppMessage: function () {

  // },
  getWebViewUrl() {
    const { options } = this.data
    const webViewUrl = hasKey(options, 'webViewUrl') ? options.webViewUrl : ''
    return webViewUrl
  },
  setNavBarTitle(title) {
    wx.setNavigationBarTitle({
      title,
    })
  },
  checkSystem() {
    return new Promise(async (resolve) => {
      const systemInfo = await getWxSystemInfo()
      const platform = systemInfo && systemInfo.platform
      const result = platform.indexOf('ios') > -1 ? true : false
      resolve(result)
    })
  },
})
