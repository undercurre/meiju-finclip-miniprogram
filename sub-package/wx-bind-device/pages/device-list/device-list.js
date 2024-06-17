// sub-package/bind-device/pages/device-list/device-list.js
import { baseImgApi } from '../../../../api'
import { getDeviceImgAndName } from '../../../../pages/common/js/device.js'
import { service } from '../assets/js/service.js'
import { mockData } from '../assets/js/mockData.js'
import { hasKey } from 'm-utilsdk/index'
import { getCommonType } from '../../../../utils/pluginFilter'
import { getPluginUrl } from '../../../../utils/getPluginUrl'
import { login } from '../../../../utils/paths'
import { setPluginDeviceInfo } from '../../../../track/pluginTrack.js'
const app = getApp()
//跳智联绑定页面
const bindDevice = '/pages/bind-device/bind-device'
//跳智联解绑设备页面
const deleteDevice = '/pages/delete-devices/delete-devices'
//智联小程序的appid
const zhilianAppId = 'wxd930c3b7cf7c92e6'

const isMock = false
Page({
  behaviors: [],
  /**
   * 页面的初始数据
   */
  data: {
    imgBaseUrl: baseImgApi.url,
    deviceList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // console.log("微信返回的", options)
    // this.getWxIotback(options)
    const from = wx.getStorageSync('wxFromLogin')
    console.log('微信返回from', from)
    if (from == '1') {
      const fromWxMiniProgramData = wx.getStorageSync('fromWxMiniProgramData')
      console.log('fromWxMiniProgramData', fromWxMiniProgramData)
      app.globalData.fromWxMiniProgramData = fromWxMiniProgramData
      this.getWxIotback()
      wx.removeStorageSync('wxFromLogin')
      wx.removeStorageSync('fromWxMiniProgramData')
    }
  },
  async getWxIotback() {
    const options = app.globalData.fromWxMiniProgramData
    console.log('微信固定入口 onshow', options)
    if (hasKey(options, 'referrerInfo')) {
      if (hasKey(options.referrerInfo, 'extraData')) {
        const extraData = options.referrerInfo.extraData
        if (!extraData) return
        if (hasKey(extraData, 'from')) {
          if (extraData.from == 'wx-iot') {
            const sdkid = extraData.sdkid
            // app.globalData.isLogon = false
            if (!sdkid) return

            const checkActionRes = await this.checkAction(options, sdkid)
            if (!checkActionRes) return

            // const sdkid = 'AAYAALPVmWJqtD42Adkg-lADDVdMK4gKSLH_IJHIj0w@ilink.im.sdk'
            if (!app.globalData.isLogon) return
            service.wxDeviceDetail(sdkid).then((res) => {
              console.log('微信固定入口获取指定插件的详情')
              const currDeviceInfo = JSON.stringify(res)
              app.globalData.fromWxMiniProgramData = {}
              wx.removeStorageSync('wxFromLogin')
              wx.removeStorageSync('fromWxMiniProgramData')
              setPluginDeviceInfo(res)
              wx.navigateTo({
                url: getPluginUrl(getCommonType(res.type), currDeviceInfo),
                // url: `/plugin/T${getCommonType(res.type)}/index/index?deviceInfo=` + currDeviceInfo,
              })
            })
          }
        }
      }
    }
  },
  getDetail(sdkid) {
    service.wxDeviceDetail(sdkid).then((res) => {
      console.log('微信固定入口获取指定插件的详情')
      const currDeviceInfo = JSON.stringify(res)
      app.globalData.fromWxMiniProgramData = {}
      wx.removeStorageSync('wxFromLogin')
      wx.removeStorageSync('fromWxMiniProgramData')
      setPluginDeviceInfo(res)
      wx.navigateTo({
        url: getPluginUrl(getCommonType(res.type), currDeviceInfo),
        // url: `/plugin/T${getCommonType(res.type)}/index/index?deviceInfo=` + currDeviceInfo,
      })
    })
  },
  checkAction(options) {
    return new Promise((resolve) => {
      if (!app.globalData.isLogon) {
        wx.setStorageSync('fromWxMiniProgramData', options)
        wx.setStorageSync('wxFromLogin', '1')
        wx.navigateTo({
          url: login,
        })
        resolve(false)
      }
      resolve(true)
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('微信返回的 onShow')
    app
      .checkGlobalExpiration()
      .then(() => {
        this.getWxIotback()
        if (!app.globalData.isLogon) {
          return
        }
        this.getInitData()
      })
      .catch(() => {
        app.globalData.isLogon = false
        // wx.setStorageSync('fromWxMiniProgramData', options)
        // wx.setStorageSync('wxFromLogin', '1')
        // wx.navigateTo({
        //   url: login,
        // })
      })
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
  onShareAppMessage: function () {},
  formatData(deviceList) {
    if (deviceList.length === 0) return []
    const list = app.globalData.dcpDeviceImgList
    deviceList.forEach((item) => {
      const type = item.type
      const typeAndName = getDeviceImgAndName(list, type.slice(2), item.sn8)
      const bindText = this.getBindText(item)
      const status = this.getBindStatus(item)
      item.icon = typeAndName.deviceImg
      item.bindText = bindText
      item.status = status
    })
    return deviceList
  },
  getBindText(item) {
    return item.wxBindStatus == 0 ? '绑定' : '解除绑定'
  },
  getBindStatus(item) {
    return item.wxBindStatus == 0 ? false : true
  },
  actionDevice(e) {
    console.log('eeeeeeeeeee', e)
    const options = app.globalData.fromWxMiniProgramData
    if (!app.globalData.isLogon) {
      wx.setStorageSync('fromWxMiniProgramData', options)
      wx.setStorageSync('wxFromLogin', '1')
      wx.navigateTo({
        url: login,
      })
      return
    }
    const item = e.currentTarget.dataset.item
    item.status ? this.actionUnbind(item) : this.actionBind(item)
  },
  actionBind(item) {
    // app.globalData.isLogon = false
    // const sdkid = 'AAYAALPVmWJqtD42Adkg-lADDVdMK4gKSLH_IJHIj0w@ilink.im.sdk'
    // if(!sdkid) return
    // if(!app.globalData.isLogon) {
    //   wx.setStorageSync('fromWxMiniProgramData')
    //   wx.setStorageSync('wxFromLogin', '1')
    //   wx.navigateTo({
    //     url: login,
    //   })
    //   return
    // }

    service
      .wxBind(item.ilinkImSdkId)
      .then((res) => {
        const deviceTicket = res.ilinkDeviceTicket
        const options = {
          ticket: deviceTicket,
        }
        this.goWxMini(options, bindDevice)
      })
      .catch((err) => {
        console.log('JJJJJJJJJJJJJJJJJ', err.data.data)
        if (hasKey(err, 'data')) {
          wx.showToast({
            title: err.data.msg,
            icon: 'none',
          })
        }
      })
  },
  actionUnbind(item) {
    const sdkId = item.ilinkImSdkId
    const options = {
      sdkIdList: [sdkId],
    }
    this.goWxMini(options, deleteDevice)
  },
  goWxMini(options, path) {
    const openId = app.globalData.openId || ''
    wx.navigateToMiniProgram({
      appId: zhilianAppId,
      path: path,
      extraData: {
        // ticket: deviceTicket || 'h1uXadnyXLsjkmrsIJVPqA',
        ...options,
        openid: openId,
      },
      envVersion: 'trial', //develop/trial/release
      success() {},
    })
  },
  getInitData() {
    if (isMock) {
      const deviceList = this.formatData(mockData.deviceList)
      this.setData({
        deviceList: deviceList,
      })
      return
    }
    service.wxbindList().then((res) => {
      const deviceList = this.formatData(res)
      this.setData({
        deviceList: deviceList,
      })
    })
  },
})
