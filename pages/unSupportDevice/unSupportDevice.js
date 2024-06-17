// pages/unSupportDevice/unSupportDevice.js
const app = getApp()
import { baseImgApi, deviceImgApi } from '../../api'
import { deviceImgMap } from '../../utils/deviceImgMap'
import paths from '../../utils/paths'
import { rangersBurialPoint } from '../../utils/requestService'
const pluginMixin = require('../../utils/plugin-mixin')
import { bleAfterWifiDevices } from '../common/js/bleAfterWifiDevices'
import { hasKey } from 'm-utilsdk/index'
Page({
  behaviors: [pluginMixin],
  /**
   * 页面的初始数据
   */
  data: {
    deviceInfo: {},
    fromApp: '',
    images: {
      unSupport: baseImgApi.url + 'img_buzhichikongzhi@3x.png',
    },
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'], //顶部状态栏的高度
    backTo: '',
    fm: '', //inputWifi
    sn8: ['22040025', '22040043'],
    isCanTryLink: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options====', options)
    if (options.fm) {
      this.setData({
        fm: options.fm,
      })
    }
    if (options.backTo) {
      this.setData({
        backTo: options.backTo,
      })
    }
    if (options.deviceInfo) {
      let deviceInfo = JSON.parse(decodeURIComponent(options.deviceInfo))
      this.setData({
        deviceInfo: deviceInfo,
      })
      let type = deviceInfo.type
      let formatType = type.includes('0x') ? type.substr(2, 2) : type
      if (
        hasKey(bleAfterWifiDevices, formatType) &&
        bleAfterWifiDevices[formatType].sn8.includes(deviceInfo.sn8) &&
        this.data.fm != 'inputWifi'
      ) {
        //遥控设备
        this.setData({
          isCanTryLink: true,
        })
        app.addDeviceInfo = {
          moduleType: 1,
          deviceName: deviceInfo.name,
          type: deviceInfo.type.includes('0x') ? deviceInfo.type.substr(2, 2) : deviceInfo.type,
          sn8: deviceInfo.sn8,
          // deviceId,
          blueVersion: 2,
          deviceImg: deviceInfo.deviceImg,
          mode: 20,
        }
      }
      if (!this.data.deviceInfo.deviceImg) {
        this.setData({
          ['deviceInfo.deviceImg']: this.getDeviceImg(this.data.deviceInfo.type, this.data.deviceInfo.sn8),
        })
      }
    }
  },
  //返回app错误回调
  launchAppError() {
    wx.showToast({
      title: '未找到美居App，\r\n请确认您的手机是否安装。',
      icon: 'none',
      duration: 2000,
    })
    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/download/download',
      })
    }, 2000)
  },
  //获取设备图片
  getDeviceImg(type, sn8) {
    type = type = type.includes('0x') ? type.substr(2, 2) : type
    let dcpDeviceImgList = app.globalData.dcpDeviceImgList ? app.globalData.dcpDeviceImgList : {}
    console.log('dcpDeviceImgList===', dcpDeviceImgList)
    if (dcpDeviceImgList[type]) {
      console.log('找到了这个品类')
      if (dcpDeviceImgList[type][sn8]) {
        console.log('找到对应的sn8')
        return dcpDeviceImgList[type][sn8]
      } else {
        return dcpDeviceImgList[type].common
      }
    } else {
      console.log('没找到', deviceImgMap)
      if (deviceImgMap[type] && deviceImgMap[type].onlineIcon) {
        return deviceImgApi.url + deviceImgMap[type].onlineIcon + '.png'
      } else {
        return deviceImgApi.url + 'blue_default_type.png'
      }
    }
  },
  backToWifiInput() {
    if (this.data.fm == 'inputWifi') {
      wx.navigateTo({
        url: paths.inputWifiInfo,
      })
    } else {
      wx.reLaunch({
        //清空路由栈
        url: paths.addGuide,
      })
    }
  },
  //左上角返回
  clickBack() {
    if (this.data.fm == 'inputWifi') {
      wx.closeBLEConnection({
        deviceId: app.addDeviceInfo.deviceId,
      })
      console.log('断开蓝牙连接')
    }
  },
  //延时调用设备暂不支持小程序控制页埋点
  delayPluginUnsupportPoint() {
    let that = this
    setTimeout(function () {
      console.log('delayPluginUnsupportPoint,that.data.deviceInfo===', that.data.deviceInfo)
      that.pluginUnsupportPoint(that.data.deviceInfo)
    }, 300)
  },
  // 设备暂不支持小程序控制页埋点
  pluginUnsupportPoint(params) {
    console.log('设备暂不支持小程序控制页埋点', params)
    rangersBurialPoint('user_page_view', {
      page_path: getCurrentPages()[0].route,
      page_title: '',
      module: '插件',
      page_id: 'page_not_support_control',
      page_name: '该设备暂不支持小程序控制页',
      object_type: 'appliance',
      object_id: params.applianceCode,
      object_name: params.name,
      ext_info: {
        sn: params.sn,
        sn8: params.sn8,
      },
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
    this.delayPluginUnsupportPoint()
    this.setData({
      fromApp: app.globalData.share,
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
  onShareAppMessage: function () {
    let tempTitle = '欢迎使用美的美居Lite'
    let tempPath = '/pages/index/index'
    let tempImageUrl = '../../assets/img/img_wechat_chat01@3x.png'
    return {
      title: tempTitle,
      path: tempPath,
      imageUrl: tempImageUrl,
    }
  },
})
