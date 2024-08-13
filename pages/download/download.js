// pages/download/download.js
const app = getApp() //获取应用实例
import { rangersBurialPoint } from '../../utils/requestService'
import { burialPoint } from './assets/js/burialPoint'
import config from '../../config.js'
import Dialog from '../../miniprogram_npm/m-ui/mx-dialog/dialog'
const environment = config.environment

import { getFullPageUrl } from '../../utils/util'
import { addDeviceSDK } from '../../utils/addDeviceSDK'
import { clickEventTracking } from '../../track/track.js'
import { wxGetSystemInfo } from '../common/js/commonWxApi.js'
const bluetooth = require('../common/mixins/bluetooth.js')
const dialogCommonData = require('../common/mixins/dialog-common-data.js')
let checkIsCanBlueFoundTimer = null

const imageList = {
  dev: {
    appIcon: 'https://www.smartmidea.net/projects/sit/meiju-finclip-assets/download/download_img_logo.png',
    iconCopy: 'https://www.smartmidea.net/projects/sit/meiju-finclip-assets/download/icon_copy.png',
    iconDownload: 'https://www.smartmidea.net/projects/sit/meiju-finclip-assets/download/icon_download.png',
  },
  sit: {
    appIcon: 'https://www.smartmidea.net/projects/sit/meiju-finclip-assets/download/download_img_logo.png',
    iconCopy: 'https://www.smartmidea.net/projects/sit/meiju-finclip-assets/download/icon_copy.png',
    iconDownload: 'https://www.smartmidea.net/projects/sit/meiju-finclip-assets/download/icon_download.png',
  },
  prod: {
    appIcon: 'https://www.smartmidea.net/projects/meiju-finclip-assets/download/download_img_logo.png',
    iconCopy: 'https://www.smartmidea.net/projects/meiju-finclip-assets/download/icon_copy.png',
    iconDownload: 'https://www.smartmidea.net/projects/meiju-finclip-assets/download/icon_download.png',
  },
}
Page({
  behaviors: [bluetooth, dialogCommonData],

  /**
   * 页面的初始数据
   */
  data: {
    fm: '',
    appName: '美的美居',
    appDownloadLink: 'http://iot4.midea.com.cn/downloads/app/',
    images: {
      appIcon: '',
      iconCopy: '',
      iconDownload: '',
    },
    isLogon: app.globalData.isLogon,
    isHasBlueFoundPermission: false, //是否有蓝牙扫描权限
    supportAutoFoundACModel: addDeviceSDK.supportAutoFoundACModel, //支持空调自发现
    clickFLag: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options========', options)
    const imageData = imageList[environment]
    this.setData({
      images: imageData,
    })
    if (options.fm) {
      this.setData({
        fm: options.fm,
      })
    }
    if (options.fm && options.fm === 'redpacket') {
      rangersBurialPoint('splash_page_view', {
        module: '活动',
        activity_name: '电费补贴',
        activity_id: 'HD20201127DFBT',
        page_name: '下载页',
        spreadid: app.globalData.activeInfo.spreadId,
      })
    } else if (options.fm && (options.fm === 'index' || options.fm === 'addDevice')) {
      burialPoint.fmIndexDowmPageView()
    } else {
      rangersBurialPoint('splash_page_view', {
        module: '活动',
        activity_name: '智联家电瓜分百万红包',
        page_name: '下载页',
        activity_id: 'HD20201113ZLJDGFBWHB',
        spreadid: app.globalData.activeInfo.spreadId,
      })
    }
  },

  //添加设备页 自发现空调
  addDeviceAc() {
    Promise.all([wxGetSystemInfo(), this.getAuthSetting()])
      .then(async (res) => {
        console.log('addDeviceAc=======', res)
        this.bluetoothAuthorize() //是否有获取过蓝牙授权 有则不在弹获取授权弹窗
        let permissionText = []
        let permisionList = []
        //蓝牙开关未开
        if (!res[0].bluetoothEnabled) {
          permissionText.push('开启手机蓝牙')
          permisionList.push(false)
          //提示开启蓝牙预览埋点
          rangersBurialPoint('user_page_view', {
            page_path: getFullPageUrl(),
            module: 'appliance',
            page_id: 'popus_page_open_auth_bluetooth',
            page_name: '提示开启并授权使用蓝牙弹窗',
            object_type: '',
            object_id: '',
            object_name: '',
            device_info: {},
            ext_info: {},
          })
        } else {
          permisionList.push(true)
        }
        //需要授权蓝牙但未授权
        if (res[0].bluetoothAuthorized != undefined && !res[0].bluetoothAuthorized) {
          permissionText.push('授予微信使用蓝牙的权限')
          permisionList.push(false)
        } else {
          permisionList.push(true)
        }

        //小程序蓝牙但未授权
        if (!res[1]['scope.bluetooth']) {
          permissionText.push('请点击右上角“...”按钮，选择“设置”，允许本程序使用蓝牙权限')
          permisionList.push(false)
          //用户授权小程序使用蓝牙权限提示框弹出预览埋点
          rangersBurialPoint('user_page_view', {
            page_path: getFullPageUrl(),
            module: 'appliance',
            page_id: 'popus_page_auth_msg',
            page_name: '提示授权允许信息弹窗',
            object_type: '',
            object_id: '',
            object_name: '',
            device_info: {},
            ext_info: {},
          })
        } else {
          permisionList.push(true)
        }

        if (res[0].system.includes('iOS')) {
          //未开 系统位置开关 未授权给微信
          if (!res[0].locationEnabled) {
            permissionText.push('开启手机定位服务')
            permisionList.push(false)
          } else {
            permisionList.push(true)
          }
        } else {
          //安卓
          if (!res[0].locationEnabled || !res[0].locationAuthorized) {
            //未开 系统位置开关 未授权给微信
            permissionText.push('开启手机定位服务，并允许微信获取位置信息')
            permisionList.push(false)
          } else {
            permisionList.push(true)
          }
        }
        console.log('permissionText========', permissionText)
        if (permissionText.length) {
          let permissionTextAll = ''
          permissionText.forEach((item, index) => {
            permissionTextAll += `${index + 1}.${item}${index + 1 != permissionText.length ? '\n' : ''}`
          })
          Dialog.alert({
            zIndex: 10001,
            context: this,
            title: '请允许使用蓝牙相关权限',
            message: permissionTextAll,
            confirmButtonText: '我知道了',
            messageAlign: 'left',
          })
        }
        return
        // return permisionList.includes(false) ? false : true
      })
      .catch((error) => {
        console.log('error========', error)
      })
  },

  //定时判断蓝牙授权
  timerCheckBluePermission() {
    checkIsCanBlueFoundTimer = setInterval(() => {
      this.isCanBlueAutoFound().then((res) => {
        console.log('有权限可以 蓝牙自发现', res)
        clearInterval(checkIsCanBlueFoundTimer)
        // this.stopBluetoothDevicesDiscovery()
        this.openBluetoothAdapter() // 蓝牙自发现
      })
    }, 3000)
  },

  //移除蓝牙授权判断
  clearTimerCheckBluePermission() {
    if (checkIsCanBlueFoundTimer) {
      clearInterval(checkIsCanBlueFoundTimer)
      checkIsCanBlueFoundTimer = null
    }
  },
  //是否可以蓝牙自发现了
  isCanBlueAutoFound() {
    return new Promise((resolve, reject) => {
      Promise.all([wxGetSystemInfo(), this.getAuthSetting()]).then((res) => {
        // const isCheckBluetoothAuthorized = res[0].bluetoothAuthorized == undefined ? false : true
        if (res[0].system.includes('iOS')) {
          if (
            res[0].bluetoothEnabled &&
            res[0].bluetoothAuthorized &&
            res[1]['scope.bluetooth'] &&
            res[0].locationEnabled
          ) {
            resolve()
          } else {
            reject()
          }
        } else {
          if (
            res[0].bluetoothEnabled &&
            res[1]['scope.bluetooth'] &&
            res[0].locationEnabled &&
            res[0].locationAuthorized
          ) {
            resolve()
          } else {
            reject()
          }
        }
        // if (isCheckBluetoothAuthorized) {
        //   if (res[0].bluetoothEnabled && res[0].bluetoothAuthorized && res[1]['scope.bluetooth'] && res[0].locationEnabled) {
        //     resolve()
        //   } else {
        //     reject()
        //   }
        // } else {
        //   if (res[0].bluetoothEnabled && res[1]['scope.bluetooth'] && res[0].locationEnabled) {
        //     resolve()
        //   } else {
        //     reject()
        //   }
        // }
      })
    })
  },

  //自发先弹窗 点击发现设备
  goNetwork(e) {
    let self = this
    this.setData({
      clickFLag: true,
    })
    setTimeout(() => {
      self.setData({
        clickFLag: false,
      })
    }, 1500)
    const item = e.detail
    console.log('CCCCCCCCCCCCCCCCCCCCCCCCCCCC', e, item)
    clickEventTracking('user_page_view', 'goNetwork', {
      page_name: '首页自发现弹窗',
      page_id: 'popups_home_found',
      module: 'appliance',
      device_info: {
        device_session_id: app.globalData.deviceSessionId, //一次配网事件标识
        sn: '', //sn码
        sn8: item.sn8, //sn8码
        a0: '', //a0码
        widget_cate: item.type, //设备品类
        wifi_model_version: item.moduleVersion, //模组wifi版本
        link_type: '', //连接方式 bluetooth/ap/...
        iot_device_id: '', //设备id
      },
      ext_info: {
        is_near: item.isSameSn8Nearest ? 1 : 0,
        refer_page_path: getFullPageUrl('prev'),
      },
    })
    console.log('首页addDeviceInfo', item)

    // if (!this.checkIfGoNetwork(item)) {
    //   getApp().setMethodFailedCheckingLog('goNetwork', '选取的是不支持配网设备')
    //   return
    // }
    this.setData({
      isShowProductDialog: false,
    })
    this.actionGoNetwork(item)
  },

  closeDeviceDialog() {
    this.stopBluetoothDevicesDiscovery()
    this.setData({
      isShowProductDialog: false,
    })
  },

  // 复制APP名称
  copyName() {
    wx.setClipboardData({
      data: this.data.appName,
      success: function (res) {
        console.log(res, 'setClipboardData')
      },
    })
  },
  // 复制下载链接
  copyLink() {
    wx.setClipboardData({
      data: this.data.appDownloadLink,
      success: function (res) {
        console.log(res, 'setClipboardData')
      },
    })
  },
  /**
   * 授权保存图片
   */
  authPhotoAlbum() {
    if (this.data.fm === 'redpacket') {
      rangersBurialPoint('splash_button_click', {
        module: '活动',
        activity_name: '电费补贴',
        page_name: '下载页',
        activity_id: 'HD20201127DFBT',
        spreadid: app.globalData.activeInfo.spreadId,
        uid: app.globalData.uid || '',
        element_content: '保存到相册',
      })
    } else if (this.data.fm === 'index') {
      burialPoint.fmIndexSaveQcode()
    } else {
      rangersBurialPoint('splash_button_click', {
        module: '活动',
        activity_name: '智联家电瓜分百万红包',
        page_name: '下载页',
        activity_id: 'HD20201113ZLJDGFBWHB',
        spreadid: app.globalData.activeInfo.spreadId,
        element_content: '保存到相册',
      })
    }
    let that = this
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log('授权成功')
              that.saveImg()
            },
            fail() {
              Dialog.confirm({
                zIndex: 10001,
                context: this,
                title: '提示',
                message: '若点击不授权，将无法使用保存图片功能',
                confirmButtonText: '授权',
                cancelButtonText: '不授权',
                confirmButtonColor: '#f94218',
                cancelButtonColor: '#999',
                confirmButtonOpenType: 'openSetting',
              })
            },
          })
        } else {
          that.saveImg()
        }
      },
    })
  },

  /**
   * 保存图片到相册
   */
  saveImg() {
    wx.showNavigationBarLoading()
    wx.getImageInfo({
      src: 'assets/img/appstore@3x.png',
      success: function (res) {
        console.log(res.path)
        wx.saveImageToPhotosAlbum({
          filePath: res.path,
          fail() {
            Dialog.confirm({
              zIndex: 10001,
              context: this,
              title: '无法保存',
              message: '请在iPhone的“设置-隐私-照片”选项中，允许微信访问你的照片',
              confirmButtonText: '好',
              showCancelButton: false,
            })
          },
          success(result) {
            console.log(result)
            wx.hideNavigationBarLoading()
            wx.showToast({
              title: '保存图片成功',
            })
          },
        })
      },
      fail: function () {
        wx.hideNavigationBarLoading()
        console.log('fail getImageInfo')
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
    if (this.data.fm == 'addDevice') {
      console.log('来自添加设备')
      this.addDeviceAc()
      this.timerCheckBluePermission()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    if (this.data.fm == 'addDevice') {
      this.stopBluetoothDevicesDiscovery()
    }
    this.clearTimerCheckBluePermission()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (this.data.fm == 'addDevice') {
      this.stopBluetoothDevicesDiscovery()
    }
    this.clearTimerCheckBluePermission()
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
  onShareAppMessage: function () {
    let currentPath = '/pages/index/index'
    let currentTitle = '欢迎使用美的美居Lite'
    let currentImageUrl = '/assets/img/img_wechat_chat01@3x.png'
    return {
      title: currentTitle, // 默认是小程序的名称(可以写slogan等)
      path: currentPath, // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: currentImageUrl, //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
    }
  },
})
