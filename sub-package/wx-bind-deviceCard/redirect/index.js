import wxList from '../../../globalCommon/js/wxList.js'
import { getCommonType } from '../../../utils/pluginFilter'
import { addDeviceSDK } from '../../../utils/addDeviceSDK.js'
import { getPluginUrl } from '../../../utils/getPluginUrl'
const app = getApp()
Page({
  data: {
    isLoading: true, // 加载中
    isLogin: false, // 是否已登录
    isDeviceDisabled: false, // 设备是否是Disabled状态
  },
  // 获取设备数据
  getOptionsData() {
    return wxList.checkAndGetOptionsData()
  },
  // 跳转到插件页
  async redirectToPlugin() {
    try {
      const options = await this.getOptionsData()
      const deviceInfo = options?.deviceInfo
      const isSupported = options?.isSupported // 小程序不支持的设备
      const decodeDeviceInfo = deviceInfo && JSON.parse(decodeURIComponent(deviceInfo))
      const type = decodeDeviceInfo?.type
      const isAuth = await addDeviceSDK.checkDeviceAuth(decodeDeviceInfo?.applianceCode)
      if (isAuth) {
        app.addDeviceInfo.cloudBackDeviceInfo = decodeDeviceInfo
        wx.redirectTo({
          url: '/distribution-network/addDevice/pages/afterCheck/afterCheck',
        })
        return
      }
      if (type && isSupported) {
        wx.redirectTo({
          url: getPluginUrl(getCommonType(type), deviceInfo),
          // url: `/plugin/T${getCommonType(type)}/index/index?deviceInfo=${deviceInfo}`,
        })
      } else {
        wx.redirectTo({
          url: `/pages/unSupportDevice/unSupportDevice?deviceInfo=${deviceInfo}`,
        })
      }
    } catch (error) {
      console.log(error, 'redirectToPlugin')
    }
  },
  onLoad() {
    wx.showLoading({
      icon: 'none',
      title: '加载中',
    })
    app
      .checkGlobalExpiration()
      .then(async () => {
        try {
          const isLogin = app.globalData.isLogon
          console.log(isLogin, 'isLogin checkGlobalExpiration')
          wx.hideLoading()
          if (isLogin) {
            const isDeviceDisabled = await wxList.checkIsDeviceDisabled()
            if (!isDeviceDisabled) {
              this.redirectToPlugin()
            }
            console.log(isLogin, isDeviceDisabled, 'isLogin, isDeviceDisabled, redirect')
            this.setData({
              isLogin,
              isDeviceDisabled,
              isLoading: false,
            })
          } else {
            this.setData({
              isLogin,
              isLoading: false,
            })
          }
        } catch (error) {
          console.log(error, 'try catch')
        }
      })
      .catch((error) => {
        console.log(error, 'checkGlobalExpiration error')
        wx.hideLoading()
        this.setData({
          isLogin: false,
          isLoading: false,
        })
      })
  },
})
