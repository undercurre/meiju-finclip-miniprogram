import { isEmptyObject } from 'm-utilsdk/index'
/**
 * 获取系统信息 同 wx.getSystemInfo
 * @param {Object} params 非必填
 * @return Promise
 */
const getWxSystemInfo = (params = {}) => {
  const defaultOptions = {
    success: null,
    fail: null,
    complete: null,
  }
  const options = Object.assign(
    {
      forceUpdate: false,
    },
    defaultOptions,
    params
  )
  // forceUpdate 是否强制更新  success, fail, complete 与微信wx.getSystemInfo传参一致
  const { forceUpdate, success, fail, complete } = options
  return new Promise((resolve, reject) => {
    const app = getApp()
    let systemInfo = app && app.globalData.systemInfo
    if (forceUpdate) {
      let system = wx.getSystemSetting(),
        appAuthorize = wx.getAppAuthorizeSetting(),
        deviceInfo = wx.getDeviceInfo(),
        windowInfo = wx.getWindowInfo(),
        appBaseInfo = wx.getAppBaseInfo()
      let res = {
        ...system,
        ...appAuthorize,
        ...deviceInfo,
        ...windowInfo,
        ...appBaseInfo,
      }
      console.log('zhucc 获取appAuthorize---------->', appAuthorize)
      getApp().globalData.systemInfo = res
      resolve(res)
    } else {
      if (systemInfo && !isEmptyObject(systemInfo)) {
        console.log('getWxSystemInfo, 缓存数据', systemInfo)
        resolve(systemInfo)
        try {
          let system = wx.getSystemSetting(),
            appAuthorize = wx.getAppAuthorizeSetting(),
            deviceInfo = wx.getDeviceInfo(),
            windowInfo = wx.getWindowInfo(),
            appBaseInfo = wx.getAppBaseInfo()
          let res = {
            ...system,
            ...appAuthorize,
            ...deviceInfo,
            ...windowInfo,
            ...appBaseInfo,
          }
          getApp().globalData.systemInfo = res
          console.log('zhucc 获取appAuthorize---------->', appAuthorize)
        } catch (error) {
          console.log(error, 'getSystemInfoAsync error')
        }
      } else {
        let system = wx.getSystemSetting(),
          appAuthorize = wx.getAppAuthorizeSetting(),
          deviceInfo = wx.getDeviceInfo(),
          windowInfo = wx.getWindowInfo(),
          appBaseInfo = wx.getAppBaseInfo()
        let res = {
          ...system,
          ...appAuthorize,
          ...deviceInfo,
          ...windowInfo,
          ...appBaseInfo,
        }
        getApp().globalData.systemInfo = res
        console.log('zhucc 获取appAuthorize---------->', appAuthorize)
        resolve(res)
      }
    }
  })
}

/**
 * 获取wx.getSetting
 * @param {Object} params 非必填
 * @returns Promise
 */
const getWxGetSetting = (params = {}) => {
  const defaultOptions = {
    withSubscriptions: false,
    success: null,
    fail: null,
    complete: null,
  }
  const options = Object.assign(
    {
      forceUpdate: false,
    },
    defaultOptions,
    params
  )
  // forceUpdate 是否强制更新  success, fail, complete 与微信wx.getSetting传参一致
  const { forceUpdate, withSubscriptions, success, fail, complete } = options
  return new Promise((resolve, reject) => {
    const app = getApp()
    let wxSettingInfo = app && app.globalData.wxSettingInfo
    if (forceUpdate) {
      wx.getSetting({
        withSubscriptions,
        success: (res) => {
          wx.nextTick(() => {
            getApp().globalData.wxSettingInfo = res
          })
          console.log('getWxGetSetting, success, forceUpdate', res)
          success && success(res)
          resolve(res)
        },
        fail: (e) => {
          console.log('getWxGetSetting, fail, forceUpdate', e)
          fail && fail(e)
          reject(e)
        },
        complete: (e) => {
          complete && complete(e)
        },
      })
    } else {
      if (wxSettingInfo && !isEmptyObject(wxSettingInfo)) {
        console.log('getSetting, 缓存数据', wxSettingInfo)
        success && success(wxSettingInfo)
        resolve(wxSettingInfo)
      } else {
        wx.getSetting({
          withSubscriptions,
          success: (res) => {
            wx.nextTick(() => {
              getApp().globalData.wxSettingInfo = res
            })
            console.log('getSetting, 请求微信接口获取setting success', res)
            success && success(res)
            resolve(res)
          },
          fail: (e) => {
            console.log('getSetting, 请求微信接口获取setting e', e)
            fail && fail(e)
            reject(e)
          },
          complete: (e) => {
            complete && complete(e)
          },
        })
      }
    }
  })
}

module.exports = {
  getWxSystemInfo,
  getWxGetSetting,
}
