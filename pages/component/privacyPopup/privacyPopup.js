let privacyHandler
let privacyResolves = new Set()
let closeOtherPagePopUpHooks = new Set()
const app = getApp() //获取应用实例
import { getFullPageUrl } from '../../../utils/util'
import {
  index,
  login,
  inputWifiInfo,
  scanDevice,
  privacy,
  wetChatMiddlePage,
  serviceChargeTypes,
  addGuide,
  homeDetail,
  mytab,
  memberManage,
} from '../../../utils/paths'
const pages = [
  index,
  login,
  inputWifiInfo,
  scanDevice,
  wetChatMiddlePage,
  serviceChargeTypes,
  addGuide,
  homeDetail,
  mytab,
  memberManage,
]

Component({
  properties: {
    innerShow: {
      type: Boolean,
      value: false,
    },
    fromPrivacy: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    title: '用户隐私保护提示',
    confirmButtonText: '同意',
    cancelButtonText: '拒绝',
    desc1: '在你使用【美的美居Lite】服务之前，请仔细阅读',
    privacyContractName: '《用户隐私保护指引》',
    desc2: '，请点击“同意”开始使用【美的美居Lite】。',
    addDeviceClickFlag: false,
  },
  lifetimes: {
    attached: function () {
      if (!this.data.fromPrivacy) {
        const closePopUp = () => {
          this.disPopUp()
        }
        privacyHandler = (resolve) => {
          privacyResolves.add(resolve)
          this.popUp()
          // 额外逻辑：当前页面的隐私弹窗弹起的时候，关掉其他页面的隐私弹窗
          // eslint-disable-next-line no-undef
          closeOtherPagePopUp(closePopUp)
        }
        this.closePopUp = closePopUp
        closeOtherPagePopUpHooks.add(this.closePopUp)
      }
      const _ = this
      if (wx.getPrivacySetting) {
        wx.getPrivacySetting({
          success(res) {
            if (res.errMsg == 'getPrivacySetting:ok') {
              if (res.needAuthorization && _.data.fromPrivacy) {
                _.popUp()
              }
              _.setData({
                privacyContractName: res.privacyContractName,
              })
            }
          },
        })
      }
    },
    detached: function () {
      if (!this.data.fromPrivacy) {
        closeOtherPagePopUpHooks.delete(this.closePopUp)
      }
    },
  },
  pageLifetimes: {
    show() {
      if (wx.onNeedPrivacyAuthorization) {
        wx.onNeedPrivacyAuthorization((resolve) => {
          console.log('触发 onNeedPrivacyAuthorization')
          if (this.data.addDeviceClickFlag) {
            console.log('[触发防重终止]')
            return
          }
          this.data.addDeviceClickFlag = true
          const fullPageUr = '/' + getFullPageUrl()
          //首页未登录，不弹隐私协议
          if (!app.globalData.isLogon && fullPageUr == index) {
            this.data.addDeviceClickFlag = false
            return
          }
          //组件内的监听器可能会覆盖全局的监听器
          if (!this.getUrl(fullPageUr, pages)) {
            if (fullPageUr.indexOf('privacy') != -1) {
              this.data.addDeviceClickFlag = false
              return
            }
            let _this = this
            wx.navigateTo({
              url: privacy,
              success: function (res) {
                _this.data.addDeviceClickFlag = false
              },
            })
            return
          }
          if (typeof privacyHandler === 'function') {
            privacyHandler(resolve)
          }
        })
      }
      const closeOtherPagePopUp = (closePopUp) => {
        closeOtherPagePopUpHooks.forEach((hook) => {
          if (closePopUp !== hook) {
            hook()
          }
        })
      }
      if (this.closePopUp) {
        privacyHandler = (resolve) => {
          privacyResolves.add(resolve)
          this.popUp()
          // 额外逻辑：当前页面的隐私弹窗弹起的时候，关掉其他页面的隐私弹窗
          closeOtherPagePopUp(this.closePopUp)
        }
      }
      this.data.addDeviceClickFlag = false
    },
  },
  methods: {
    handleAgree() {
      this.data.addDeviceClickFlag = false
      this.disPopUp()
      // 同时调用多个wx隐私接口时要如何处理：让隐私弹窗保持单例，点击一次同意按钮即可让所有pending中的wx隐私接口继续执行
      privacyResolves.forEach((resolve) => {
        resolve({
          event: 'agree',
          buttonId: 'agree-btn',
        })
      })
      privacyResolves.clear()
      this.triggerEvent('handleAgree')
    },
    handleDisagree() {
      this.data.addDeviceClickFlag = false
      this.disPopUp()
      privacyResolves.forEach((resolve) => {
        resolve({
          event: 'disagree',
        })
      })
      privacyResolves.clear()
      if (!this.data.fromPrivacy) {
        const fullPageUr = '/' + getFullPageUrl()
        //首页不跳转
        if (fullPageUr.indexOf(index) != -1 || fullPageUr.indexOf(login) != -1) {
          return
        }
        // 扫码进入wifi输入页,或者进入中间页，跳回首页
        if (app.globalData.from_download_page && fullPageUr.indexOf(inputWifiInfo) != -1) {
          wx.switchTab({
            url: index,
          })
        } else if (app.globalData.from_download_page && fullPageUr.indexOf(wetChatMiddlePage) != -1) {
          wx.switchTab({
            url: index,
          })
        } else {
          //回退前一页
          wx.navigateBack({
            delta: 1,
          })
        }
      }
      this.triggerEvent('handleDisagree')
    },
    popUp() {
      if (this.data.innerShow === false) {
        this.setData({
          innerShow: true,
        })
      }
    },
    disPopUp() {
      if (this.data.innerShow === true) {
        this.setData({
          innerShow: false,
        })
      }
    },
    openPrivacyContract() {
      wx.openPrivacyContract({
        success: (res) => {
          console.log('openPrivacyContract success', res)
        },
        fail: (res) => {
          console.error('openPrivacyContract fail', res)
        },
      })
    },
    //判断路径
    getUrl(fullPageUr, pages) {
      return pages.some((item) => fullPageUr.indexOf(item) != -1)
    },
  },
})
