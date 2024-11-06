const app = getApp()
const imgBaseUrl = app.getGlobalConfig().imgBaseUrl
import paths from '../../../assets/sdk/common/paths'
import { checkPermission } from '../../../../pages/common/js/permissionAbout/checkPermissionTip'
import { commonDialog } from '../../../assets/js/commonDialog'
import { actionScanResult} from '../../../../utils/scanCodeApi'
import { burialPoint } from './assets/burialPoint'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgBaseUrl: imgBaseUrl.url,
	brandConfig: app.globalData.brandConfig[app.globalData.brand],
    images: {
      failIcon: '/dynamicQrcode/net_ic_fail_red@3x.png',
      failLittleIcon: '/dynamicQrcode/net_ic_fail@3x.png',
      leftArrow: ''
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let brand = getApp().globalData.brand
    this.setData({
      brand: brand,
    })
    console.log('multiAddsuccess  app.addDeviceInfo', app.addDeviceInfo)
    console.log('multiAddsuccess subDeviceInfo', app.addDeviceInfo.subDeviceInfo)
    console.log('app.globalData.roomList', app.globalData.roomList)
    let devicesList = []
    let mainDevice = {}
    mainDevice.deviceName = app.addDeviceInfo.deviceName
    mainDevice.deviceImg = app.addDeviceInfo.deviceImg
    mainDevice.room = app.addDeviceInfo.room
    devicesList.push(mainDevice)
    if (app.addDeviceInfo.subDeviceInfo) {
      console.log('app.globalData.dcpDeviceImgList', app.globalData.dcpDeviceImgList)
      let subDevice = {}
      subDevice.deviceName = app.addDeviceInfo.subDeviceInfo.name
      subDevice.room = app.addDeviceInfo.subDeviceInfo.room
      subDevice.deviceImg = app.addDeviceInfo.subDeviceInfo.deviceImg
      devicesList.push(subDevice)
    }
    console.log('devicesList', devicesList)
    this.setData({
      devicesList:devicesList
    })
    burialPoint.multiSnFailView({
      deviceSessionId: app.globalData.deviceSessionId,
      type: app.addDeviceInfo.type,
      sn8: app.addDeviceInfo.sn8,
      tsn: app.addDeviceInfo?.hostDevice.sn,
      link_type: 'Multi_SN_dynamic_QR_code'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },
  handleSetting(e) {
    console.log('adddevice', app.addDeviceInfo)
    console.log('e.currentTarget.dataset.device', )
    let c = e.currentTarget.dataset.item.deviceName
    // let deviceInformation = app.addDeviceInfo.homeBindSuccessList.filter(item => item.name == c)
    // app.addDeviceInfo.applianceCode = deviceInformation[0].applianceCode
    if (c == app.addDeviceInfo.deviceName) {
      app.addDeviceInfo.isMainDevice = true
    } else {
      app.addDeviceInfo.isMainDevice = false
    }
    app.addDeviceInfo.multiSnFlag = true
    console.log('最终addDeviceInfo', app.addDeviceInfo)
    wx.reLaunch({
      url: `${paths.addSuccess}?fromMultiSn=true`,
    })
  },
  clickBack() {
    wx.reLaunch({
      url: '/pages/index/index?tabPageId=1'
    })
  },
  handleFinish() {
    this.actionScan()
  },
  async actionScan() {
    if (this.data.actionScanClickFlag) {
      console.log('[防重阻止]')
      return
    }
    this.data.actionScanClickFlag = true
    //检查蓝牙和位置权限以及是否打开
    // if (!(await this.checkLocationAndBluetooth(true, true, true, true))) {
    //   return
    // }
    let locationRes
    let blueRes
    try {
      locationRes = await checkPermission.loaction(false)
      blueRes = await checkPermission.blue(false)
    } catch (error) {
      this.data.actionScanClickFlag = false
      Dialog.confirm({
        title: '微信系统出错，请尝试点击右上角“...” - “重新进入小程序”',
        confirmButtonText: '好的',
        confirmButtonColor: this.data.dialogStyle.confirmButtonColor2,
        showCancelButton: false,
      }).then((res) => {
        if (res.action == 'confirm') {
        }
      })
      // wx.showModal({
      //   showCancel: false,
      //   content: '微信系统出错，请尝试点击右上角“...” - “重新进入小程序”',
      // })
      console.log(error, '[loactionRes blueRes]err checkPermission')
    }
    console.log('[loactionRes] checkPermission', locationRes)
    if (!locationRes.isCanLocation) {
      const obj = {
        title: '请开启位置权限',
        message: locationRes.permissionTextAll,
        confirmButtonText: '查看指引',
        type: 'location',
        permissionTypeList: locationRes.permissionTypeList,
        confirmButtonColor: this.data.dialogStyle.confirmButtonColor2,
        cancelButtonColor: this.data.dialogStyle.cancelButtonColor3,
      }
      //调用通用弹框组件
      commonDialog.showCommonDialog(obj)
      setTimeout(() => {
        this.data.actionScanClickFlag = false
      }, 1500)
      return
    }
    console.log('[blueRes] checkPermission', blueRes)
    if (!blueRes.isCanBlue) {
      const obj = {
        title: '请开启蓝牙权限',
        message: blueRes.permissionTextAll,
        confirmButtonText: '查看指引',
        type: 'blue',
        permissionTypeList: blueRes.permissionTypeList,
        confirmButtonColor: this.data.dialogStyle.confirmButtonColor2,
        cancelButtonColor: this.data.dialogStyle.cancelButtonColor3,
      }
      //调用通用弹框组件
      commonDialog.showCommonDialog(obj)
      setTimeout(() => {
        this.data.actionScanClickFlag = false
      }, 1500)
      return
    }
    setTimeout(() => {
      this.data.actionScanClickFlag = false
    }, 1500)
    //扫描设备二维码进入配网
    actionScanResult(
      this.showNotSupport,
      this.justAppSupport,
      this.actionGoNetwork,
      this.getDeviceApImgAndName,
      this.data.id,
      this.data.homeName
    )
  },
})
