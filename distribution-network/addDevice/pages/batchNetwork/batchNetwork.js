const app = getApp()
const rangersBurialPoint =  app.getGlobalConfig().rangersBurialPoint
const requestService = app.getGlobalConfig().requestService
const baseImgApi = app.getGlobalConfig().baseImgApi
const imgBaseUrl = app.getGlobalConfig().imgBaseUrl
import paths from '../../../assets/sdk/common/paths'
import { getStamp, getReqId } from 'm-utilsdk/index'
import { getDeviceSn, getDeviceSn8 } from '../../../../pages/common/js/device'
import { isSupportPlugin } from '../../../../utils/pluginFilter'
import { getFullPageUrl } from 'm-miniCommonSDK/index'
import { clickEventTracking } from '../../../../track/track.js'
const dialogCommonData = require('../../../../pages/common/mixins/dialog-common-data.js')
const getFamilyPermissionMixin = require('../../../assets/js/getFamilyPermissionMixin.js')
import { commonDialog } from '../../../assets/js/commonDialog'
let timer, timer2 //定时查询
Page({
  behaviors: [dialogCommonData, getFamilyPermissionMixin],
  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'], //顶部状态栏的高度
    imgBaseUrl: imgBaseUrl.url,
    baseImgUrl: baseImgApi.url,
    masterDevices: [], //找朋友主设备
    devices: [], //批量配网的设备信息
    time: 70, //轮询查询70秒
    finishNetwork: [], //有配网结果的设置信息
    showFinishBtn: false, //是否显示完成按钮
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    getApp().onLoadCheckingLog()
    this.getLoginStatus().then(() => {
      if (app.globalData.isLogon) {
        this.checkFamilyPermission()
      } else {
        this.navToLogin()
      }
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
    this.getBatchNetworkDevices()
  },
  getLoginStatus() {
    return app
      .checkGlobalExpiration()
      .then(() => {
        this.setData({
          isLogon: app.globalData.isLogon,
        })
      })
      .catch(() => {
        app.globalData.isLogon = false
        this.setData({
          isLogin: app.globalData.isLogon,
        })
      })
  },
  //朋友设备批量配网进度页预览埋点
  batchNetworkViewTrack(category) {
    rangersBurialPoint('user_page_view', {
      page_path: getFullPageUrl(),
      module: 'appliance',
      page_id: 'page_batch_connet',
      page_name: '批量联网进度页',
      object_type: '',
      object_id: '',
      object_name: '',
      device_info: {
        device_session_id: app.globalData.deviceSessionId, //一次配网事件标识
        wifi_model_version: '', //模组wifi版本
        link_type: '家电找朋友', //新增配网方式 :家电找朋友
      },
      ext_info: {
        apptype: [...category], //设备品类
        sn8: [], //sn8码
        sn: [], //sn码
      },
    })
  },

  getBatchNetworkDevices() {
    let masterDevices = wx.getStorageSync('masterDevices')
    let batchNetwork = wx.getStorageSync('batchNetwork')
    let finishedNetwork = []
    let category = []
    batchNetwork.forEach((item) => {
      category.push(item.category)
      if (item.network == 'success' || item.network == 'fail') {
        finishedNetwork.push(item)
      } else {
        item.network = 'loading'
      }
    })
    this.batchNetworkViewTrack(category)
    this.setData({
      devices: batchNetwork,
      masterDevices: masterDevices,
      finishNetwork: finishedNetwork,
      showFinishBtn: finishedNetwork.length == batchNetwork.length,
      time: 70,
    })
    this.goNetwork()
  },

  //发送给设备配网指令
  goNetwork() {
    timer = setInterval(() => {
      this.getNetworkResult()
    }, 3000)
    timer2 = setInterval(() => {
      if (this.data.time >= 0) {
        this.setData({
          time: this.data.time - 1,
        })
      }
    }, 1000)
  },

  //显示批量配网完成u
  showFinish() {
    this.setData({
      isSureDialog: false,
    })
    this.clearTime()
    let show = this.data.devices
    show.forEach((item) => {
      if (item.network == 'loading') {
        item.network = 'fail'
        item.fail = '联网失败，请尝试扫码等其他添加方式'
      }
    })
    this.setData({
      devices: show,
      showFinishBtn: true,
    })
  },

  //获取设备配网结果
  getNetworkResult() {
    if (this.data.time <= 0) {
      this.showFinish()
    } else {
      if (this.data.finishNetwork.length == this.data.devices.length) {
        this.showFinish()
        return
      }
      let reqData = {
        reqId: getReqId(),
        stamp: getStamp(),
      }
      requestService
        .request('friendNetworkResult', reqData)
        .then((resp) => {
          console.log('主设备给朋友设备配网结果', resp.data.data)
          if (!resp.data.data) {
            return
          }
          this.dealData(resp.data.data)
        })
        .catch((error) => {
          console.log('获取设备配网结果失败', error)
        })
    }
  },

  dealData(resp) {
    for (let i = 0; i < resp.length; i++) {
      for (let j = 0; j < resp[i]['friends'].length; j++) {
        for (let z = 0; z < this.data.devices.length; z++) {
          let had = this.data.finishNetwork.find((item) => {
            return item.mac == this.data.devices[z].mac
          })
          if (!had && resp[i]['friends'][j]['mac'] == this.data.devices[z].mac) {
            let { mac, modelNumber, sn, result, randomCode, useRandom } = resp[i]['friends'][j]
            let device = {
              ssid: this.data.devices[z].ssid,
              signal: this.data.devices[z].signal,
              mac: mac,
              modelNumber: modelNumber,
              sn: sn,
              result: result,
              randomCode: randomCode,
              useRandom: useRandom,
              deviceImg: this.data.devices[z].deviceImg,
              deviceName: this.data.devices[z].deviceName,
              category: this.data.devices[z].category,
              masterApplianceCode: this.data.devices[z].masterApplianceCode,
              sn8: getDeviceSn8(getDeviceSn(sn)),
              fail: '',
              roomId: '',
              room: '',
              homegroupId: '',
              applianceCode: '',
              network: this.data.devices[z].network,
              isSupport: true,
            }
            device.isSupport = isSupportPlugin('0x' + device.category, device.sn8, device.modelNumber, '0') //判断小程序里是否支持绑定设备
            let finish = this.data.finishNetwork
            finish.push(device)
            this.setData({
              finishNetwork: finish,
            })
            let change = `devices[${z}]`
            let bindFunc = async () => {
              if (result == 0 && device.isSupport) {
                let modeResult = await this.getMode(device)
                console.log('获取设备配网指引结果', modeResult)
                let bindType = ''
                let netWorking = 'wifiNetWorking'
                if(modeResult.data.data.cableNetWorking){
                  netWorking = 'cableNetWorking'
                }
                if (modeResult.data.code == 0 && modeResult.data.data[netWorking].mainConnectinfoList.length != 0) {
                  let { mode } = modeResult.data.data[netWorking].mainConnectinfoList[0].mode
                  let moduleType = this.getModuleType(mode)
                  bindType = this.mode2bindType(mode, moduleType)
                }
                let bindResult = await this.bindDeviceToHome(device, bindType)
                console.log('绑定设备结果', bindResult)
                if (bindResult.data.code == 0) {
                  let { roomId, applianceCode, homegroupId } = bindResult.data.data
                  device.network = 'success'
                  let bindRoom = app.globalData.applianceHomeData.roomList.find((item) => {
                    return item.roomId == roomId
                  })
                  device.room = bindRoom.name
                  device.roomId = bindRoom.roomId
                  device.applianceCode = applianceCode
                  device.homegroupId = homegroupId
                  device.isBound = true
                } else {
                  device.network = 'fail'
                  device.fail = '联网失败，请尝试扫码等其他添加方式'
                }
              } else {
                device.network = 'fail'
                device.fail = '联网失败，请尝试扫码等其他添加方式'
              }
            }
            bindFunc()
            if (!device.isSupport) {
              device.network = 'fail'
              device.fail = '该设备仅支持在美的美居App添加'
            }
            this.setData({
              [change]: device,
            })
          }
        }
      }
    }
  },

  getMode(device) {
    let param = {
      ssid: device.ssid,
      category: device.category,
      code: device.sn8,
      sn: getDeviceSn(device.sn),
      queryType: 2,
      stamp: getStamp(),
      reqId: getReqId(),
    }
    return new Promise((resolve) => {
      requestService
        .request('multiNetworkGuide', param)
        .then((resp) => {
          console.log('获取设备配网指引成功', resp)
          resolve(resp)
        })
        .catch((error) => {
          console.log('获取设备配网指引失败', error)
          resolve(error)
        })
    })
  },

  getModuleType(mode) {
    if (mode == 3 || mode == '003') return '1'
    if (mode == 5 || mode == '005') return '0'
  },

  mode2bindType(mode, moduleType) {
    //moduleType 0:ble 1:combo
    if (mode == 0) {
      return 0 //配网
    }
    if (mode == 3) {
      return 2 //配网
    }
    if (mode == 5) {
      return moduleType ? 3 : 1
    }
    if (mode == 'air_conditioning_bluetooth_connection') {
      return 3 //combo 蓝牙
    }
    if (mode == 'air_conditioning_bluetooth_connection_network') {
      return 2 //遥控器 后配网
    }
  },

  //绑定设备
  bindDeviceToHome(device, bindType) {
    let reqData = {
      applianceName: device.deviceName,
      homegroupId: app.globalData.currentHomeGroupId,
      sn: device.sn,
      applianceType: '0x' + device.category,
      btMac: device.mac.replace(/:/g, ''),
      reqId: getReqId(),
      stamp: getStamp(),
      bindType: bindType != '' ? bindType : 0, //绑定方式，0是AP配网，1是单蓝牙模组的蓝牙绑定, 2是combo的蓝牙配网,3是combo模组的蓝牙绑定, 不传默认都是AP配网
    }
    return new Promise((reslove) => {
      requestService
        .request('bindDeviceToHome', reqData)
        .then((resp) => {
          console.log('绑定设备成功', resp)
          reslove(resp)
        })
        .catch((error) => {
          console.log('绑定设备失败', error)
          reslove(error)
        })
    })
  },

  //已绑定设备信息编辑
  goEdit(e) {
    try {
      wx.setStorageSync('batchNetwork', this.data.devices)
    } catch (e) {
      console.log(e)
    }
    let target = this.data.devices[e.currentTarget.dataset.index]
    this.batchNetworkSettingClickTrack(target)
    wx.navigateTo({
      url: paths.editBoundDevice + `?device=${JSON.stringify(target)}`,
    })
  },

  //批量朋友设备配网设置点击埋点
  batchNetworkSettingClickTrack(device) {
    clickEventTracking('user_behavior_event', 'batchNetworkSettingClickTrack', {
      page_path: getFullPageUrl(),
      module: 'appliance',
      page_id: 'page_batch_connet',
      page_name: '批量联网进度页',
      page_module: '',
      widget_name: '设置',
      widget_id: '',
      rank: '',
      object_type: '',
      object_id: '',
      object_name: '',
      device_info: {
        device_session_id: app.globalData.deviceSessionId, //一次配网事件标识
        sn8: device.sn8, //sn8码
        widget_cate: device.category, //设备品类
        wifi_model_version: '', //模组wifi版本
        link_type: '家电找朋友', //新增配网方式 :家电找朋友
        iot_device_id: device.applianceCode, //设备id
      },
      ext_info: {
        apptype: [device.category], //设备品类
        sn8: [device.sn8], //sn8码
      },
    })
  },

  backToIndex() {
    wx.reLaunch({
      url: paths.index,
    })
  },

  //取消配网
  cancelNetwork() {
    let category = this.data.devices.map((item) => {
      return item.category
    })
    let sn8 = this.data.devices.map((item) => {
      return item.sn8 ? item.sn8 : ''
    })
    this.batchNetworkCancelClickTrack(category, sn8)
    const btns = [
      {
        btnText: '放弃',
        flag: 'quit',
      },
      {
        btnText: '再等等',
        flag: 'cancel',
      },
    ]
    this.setDialogMixinsData(true, '要放弃为设备配网吗?', '未联网成功的设备还不能用小程序进行控制哦~', false, btns)
  },

  //取消配网弹窗操作
  makeSure(e) {
    this.setData({
      isSureDialog: false,
    })
    if (e.detail.flag == 'quit') {
      this.clearTime()
      wx.reLaunch({
        url: paths.index,
      })
    }
  },

  //批量朋友设备配网取消点击埋点
  batchNetworkCancelClickTrack(category, sn8) {
    clickEventTracking('user_behavior_event', 'batchNetworkCancelClickTrack', {
      page_path: getFullPageUrl(),
      module: 'appliance',
      page_id: 'page_batch_connet',
      page_name: '批量联网进度页',
      page_module: '',
      widget_name: '取消',
      widget_id: '',
      rank: '',
      object_type: '',
      object_id: '',
      object_name: '',
      device_info: {
        device_session_id: app.globalData.deviceSessionId, //一次配网事件标识
        wifi_model_version: '', //模组wifi版本
        link_type: '家电找朋友', //新增配网方式 :家电找朋友
      },
      ext_info: {
        apptype: [...category], //设备品类
        sn8: [...sn8], //sn8码
      },
    })
  },

  goBackIndex() {
    if (!this.data.showFinishBtn) {
      return
    }
    this.clearTime()
    let category = []
    let sn8 = []
    let sn = []
    let applianceCode = []
    let failCategory = []
    let failSn8 = []
    let failSn = []
    let failApplianceCode = []
    this.data.devices.forEach((item) => {
      if (item.isBound) {
        category.push(item.category)
        sn8.push(item.sn8)
        sn.push(item.sn)
        applianceCode.push(item.applianceCode)
      } else {
        failCategory.push(item.category)
        failSn8.push(item.sn8)
        failSn.push(item.sn)
        failApplianceCode.push(item.applianceCode)
      }
    })
    this.batchNetworkFinishClickTrack(
      category,
      sn8,
      sn,
      applianceCode,
      failCategory,
      failSn8,
      failSn,
      failApplianceCode
    )
    wx.reLaunch({
      url: paths.index,
    })
  },

  //批量朋友设备配网完成点击埋点
  batchNetworkFinishClickTrack(category, sn8, sn, applianceCode, failCategory, failSn8, failSn, failApplianceCode) {
    clickEventTracking('user_behavior_event', 'batchNetworkFinishClickTrack', {
      page_path: getFullPageUrl(),
      module: 'appliance',
      page_id: 'page_batch_connet',
      page_name: '批量联网进度页',
      page_module: '',
      widget_name: '完成',
      widget_id: '',
      rank: '',
      object_type: '',
      object_id: '',
      object_name: '',
      device_info: {
        device_session_id: app.globalData.deviceSessionId, //一次配网事件标识
        wifi_model_version: '', //模组wifi版本
        link_type: '家电找朋友', //新增配网方式 :家电找朋友
      },
      ext_info: {
        success_apptype: [...category], //联网成功设备品类
        success_sn8: [...sn8], //联网成功sn8码
        success_sn: [...sn], //联网成功sn码
        success_iot_device_id: [...applianceCode], //联网成功设备ID
        fail_apptype: [...failCategory], //联网失败设备品类
        fail_success_sn8: [...failSn8], //联网失败sn8码
        fail_sn: [...failSn], //联网失败sn8码
        fail_iot_device_id: [...failApplianceCode], //联网失败设备ID
      },
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    try {
      wx.setStorageSync('batchNetwork', this.data.devices)
    } catch (e) {
      console.log(e)
    }
    this.clearTime()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    getApp().onUnloadCheckingLog()

    this.clearTime()
  },

  clearTime() {
    clearInterval(timer)
    clearInterval(timer2)
    this.setData({
      time: 0,
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
})
