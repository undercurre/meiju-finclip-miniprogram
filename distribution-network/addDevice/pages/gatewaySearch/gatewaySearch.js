// distribution-network/addDevice/pages/gatewaySearch/gatewaySearch.js
const app = getApp()
const imgBaseUrl = getApp().getGlobalConfig().imgBaseUrl
const baseImgApi = getApp().getGlobalConfig().baseImgApi
const requestService = getApp().getGlobalConfig().requestService
const rangersBurialPoint = getApp().getGlobalConfig().rangersBurialPoint
const receiveSocketMessage = getApp().getGlobalConfig().receiveSocketMessage
const bluetooth = require('../../../../pages/common/mixins/bluetooth.js')
const paths = require('../../../../utils/paths')
const getFamilyPermissionMixin = require('../../../assets/js/getFamilyPermissionMixin.js')
const brandStyle = require('../../../assets/js/brand.js')
const imgUrl = imgBaseUrl.url + '/shareImg/' + app.globalData.brand
import config from '../../../../config'
import { imgesList } from '../../../assets/js/shareImg.js'
import { getStamp, getReqId, getRandomString } from 'm-utilsdk/index'
import { getFullPageUrl } from 'm-miniCommonSDK/index'
import { clickEventTracking } from '../../../../track/track.js'
import { burialPoint } from './assets/js/burialPoint.js'
import { addDeviceSDK } from '../../../../utils/addDeviceSDK'
import { checkPermission } from '../../../../pages/common/js/permissionAbout/checkPermissionTip'
import sceneUtil from '../../../common/js/scene/sceneUtil.js'
const backUpApUtil = require('../../../assets/asyncSubpackages/apUtils.js')

// 30秒无响应倒计时
let showDelayTipsTimer = null
// 3秒轮询网关搜索子设备
let searchSubDeviceTimer = null
// 61秒轮询下发指令
let issueInstructionTimer = null

Page({
  behaviors: [bluetooth, getFamilyPermissionMixin],
  /**
   * 页面的初始数据
   */
  data: {
    devices: [],
    sub_icon_success: imgUrl + imgesList['sub_icon_success'],
    sub_icon_fail: imgUrl + imgesList['sub_icon_fail'],
    navTop: app.globalData.statusNavBarHeight,
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'], // 顶部状态栏高度brand: '',
    brand: '',
    brandConfig: app.globalData.brandConfig[app.globalData.brand],
    baseImgUrl: baseImgApi.url,
    imgBaseUrl: imgBaseUrl.url,
    id: null, //家庭id
    homeName: '',
    sceneIconList: [], //设备图片和名字
    isCanAddDevice: true, //是否有权限添加设备
    homeList: [], // 家庭列表
    checkPermissionRes: {
      isCanBlue: true,
      isCanLocation: true,
      type: '', //权限类型
      permissionTextAll: null, //权限提示文案
      permissionTypeList: {},
    },
    scanImg: '', //扫描动图
    permissionImg: '', //权限图片
    reSearchIcon: '', //重新搜索图标
    dialogStyle: brandStyle.config[app.globalData.brand].dialogStyle, //弹窗样式
    brandConfig: app.globalData.brandConfig[app.globalData.brand],
    guideFalg: false,
    retryFlag: false,
    showDelayTips: false, // 是否开启 30秒内无绑定结果，展示指定文案
    buzz: 1, // 默认为1，下发指令成功后修改为0
    applianceCode: '', // 网关id
    transId: '', // 一个随机数，保持在一个配网过程中是一样的
    ishowDialogFlag: false,
    dialogCommonData: {
      messageContent: '',
      titleContent: '',
      confirmText: '',
      cancelText: '',
      dialogType: 1
    },
    successNum: 0, // 绑定子设备成功数量
    failNum: 0, // 绑定子设备失败数量
    gatewayName: '', // 网关名称
    subDeviceName: '', // 子设备名称
    isFromPlugin: false, // 是否来自插件内子设备配网
    pushSubDevices: [], // 推送的子设备数据(包含 失败/成功 绑定状态)
    listSubDevices: [], // 轮询的子设备数据(只有成功状态)
    gateWayStartTime: 0, // 进入页面首次下发网关信息时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    getApp().onLoadCheckingLog()
    console.log('品牌:', app.globalData.brand)
    console.log('当前网关信息:', app.addDeviceInfo.currentGatewayInfo)
    this.data.brand = app.globalData.brand
    this.setData({
      isFromPlugin: options.isFromPlugin ? true : false,
      currentGatewayInfo: app.addDeviceInfo.currentGatewayInfo,
      gatewayName: app.addDeviceInfo.currentGatewayInfo.name,
      subDeviceName: app.addDeviceInfo.deviceName,
      applianceCode: app.addDeviceInfo.currentGatewayInfo.applianceCode,
      transId: getRandomString(32),
      brand: this.data.brand,
      reSearchIcon: imgUrl + imgesList['reSearchIcon'],
      scanImg: imgUrl + imgesList['scanImg'],
      scanAdd: imgUrl + imgesList['scanAdd'],
      modelCategory: imgUrl + imgesList['modelCategory'],
      dms_img_lack: imgUrl + imgesList['dms_img_lack'],
    })

    // TODO DELETE
    try {
      if (!getApp().globalData.linkupSDK) {
        getApp().globalData.linkupSDK = await require.async('../../../assets/sdk/index')
      }
      this.wifiService = getApp().globalData.linkupSDK.commonIndex.wifiService
      this.udpService = getApp().globalData.linkupSDK.commonIndex.udpService
      getApp().addDeviceInfo.apUtils = backUpApUtil
    } catch (error) {
      console.error('linkupSDK fail', error)
    }
    this.getLoginStatus().then(async () => {
      if (app.globalData.isLogon) {
        this.receiveSocketData()
        let { isCheckGray } = app.addDeviceInfo
        //获取添加设备灰度名单判断是否是灰度用户
        try {
          if (!app.globalData.linkupSDK) {
            app.globalData.linkupSDK = await require.async('../../../assets/sdk/index')
          }
          let isCan = await addDeviceSDK.isGrayUser(isCheckGray)
          this.setData({
            isCanAddDevice: isCan,
          })
          if (!this.data.isCanAddDevice) {
            console.log('屏蔽了配网入口')
            burialPoint.viewNoSupportPage({
              deviceSessionId: app.globalData.deviceSessionId,
            })
            return
          }
        } catch (error) {
          console.log('[isGrayUser error]', error)
        }
        this.locationAuthorize() //判断用户是否授权小程序使用位置权限
        this.bluetoothAuthorize() //判断用户是否授权小程序使用蓝牙权限
      } else {
        this.navToLogin()
      }
    })
    this.pageBurialPoint()
  },

  /**
   * 请求云端下发指令给网关，进入可配网状态
   * 61秒下发一次
   */
  handleGatewayAccepting() {
    const reqData = {
      buzz: this.data.buzz, // 是否蜂鸣 1:是,0:否	
      reqId: getReqId(),
      stamp: getStamp(),
      gatewayId: this.data.applianceCode, // 网关id
      transId: this.data.transId, // 事务id
      expire: 60, // 有效时间
      modelId: this.data.isFromPlugin ? app.addDeviceInfo.productId : '',  // 指定添加的型号
      // iotAppId: config.iotAppId[config.environment]
    }
    // 记录下发时间
    if (!this.data.gateWayStartTime) {
      this.data.gateWayStartTime = new Date().getTime()
    }
    console.log('下发指令给网关请求数据', reqData)
    requestService.request('subDeviceAddOn', reqData).then(
      (resp) => {
        console.log('下发指令给网关响应数据', resp.data)
        const { code } = resp.data
        if (code === 0) {
          this.data.buzz = 0
          this._clearTimeout(3)
          issueInstructionTimer = setTimeout(() => {
            this.handleGatewayAccepting()
          }, 61000)
        } else {
          this.setData({
            ishowDialogFlag: true,
            dialogCommonData: {
              messageContent: `1、请确保${this.data.currentGatewayInfo.name}可正常通电，且正常连接网络；\n 2、请确保手机网络通畅，或稍后重试`,
              titleContent: `${this.data.currentGatewayInfo.name}无响应`,
              confirmText: '重试',
              cancelText: '好的',
              dialogType: 1
            }
          })
        }
      },
      (error) => {
        console.error(error)
        this.setData({
          ishowDialogFlag: true,
          dialogCommonData: {
            messageContent: `1、请确保${this.data.currentGatewayInfo.name}可正常通电，且正常连接网络；\n 2、请确保手机网络通畅，或稍后重试`,
            titleContent: `${this.data.currentGatewayInfo.name}无响应`,
            confirmText: '重试',
            cancelText: '好的',
            dialogType: 1
          }
        })
      }
    )
  },

  /**
   * 网关：若网关查找到子设备（查找到任一设备均可，不要求是当前添加的设备），则请求云端，与子设备进行绑定。 云端：云端若有绑定结果（失败或成功），需推送至小程序。 小程序：该页面无超时，每3秒轮询一次接口。
   * 3秒触发一次
   */
  fetchAnySubDevice() {
    this._clearTimeout(2)
    searchSubDeviceTimer = setTimeout(() => {
      const reqData = {
        reqId: getReqId(),
        stamp: getStamp(),
        applianceCode: this.data.applianceCode
      }

      // 前提 - 下发网关指令成功
      if (this.data.buzz === 1) {
        console.log('网关下发不成功呀咋整~')
        this.fetchAnySubDevice()
        return false;
      }

      requestService.request('subDeviceAddList', reqData).then(
        (resp) => {
          console.log('网关查找到子设备数据', resp)
          const { code, data } = resp.data
          // 有返回子设备数据
          if (code === 0 && data.list && data.list.length) {
            // 需 过滤 lastActiveTime < gateWayStartTime 时间的数据
            let subDevices = data.list.filter(e => {
              return new Date(e.lastActiveTime || e.lastActiveTimeNum).getTime() > this.data.gateWayStartTime
            })
            if (subDevices.length) {
              subDevices.forEach(item => {
                item.errorCode = 0
                item.spid = item.smartProductId
                item.deviceName = item.name
                item.modelNumber = item.modelNum
                let subIds = this.data.listSubDevices.map(e => e.applianceCode)
                let index = subIds.indexOf(item.applianceCode)
                if (index > -1) {
                  this.data.listSubDevices[index] = item
                } else {
                  this.data.listSubDevices.unshift(item)
                }
              })
              this.handleDillSubDevice(this.data.listSubDevices)
            }
          }
          this.fetchAnySubDevice()
        },
        (error) => {
          console.error('网关查找到子设备接口失败', error)
          this.fetchAnySubDevice()
        }
      )
    }, 3000)
  },

  /**
   * 检查是否有数据更新
   */
  hasListUpdate() {
    if (app.addDeviceInfo.isBackFromSubDeviceSuccess) {
      app.addDeviceInfo.isBackFromSubDeviceSuccess = false
      const { applianceCode, deviceName, roomName, roomId } = app.addDeviceInfo.currentSubDeviceInfo
      this.data.devices.forEach(e => {
        if (e.applianceCode === applianceCode) {
          e.deviceName = deviceName
          e.deviceNameStr = this.handleSubstring(deviceName)
          e.roomId = roomId
          e.roomName = roomName
          e.roomNameStr = this.handleSubstring(roomName)
        }
      })
      this.setData({ devices: this.data.devices })
    }
  },

  /**
   * 30秒内无数据 展示提示文案
   */
  handleTipsTimer() {
    if (this.data.devices.length > 0 || showDelayTipsTimer || this.data.showDelayTips) return
    showDelayTipsTimer = setTimeout(() => {
      this.noDataBurialPoint()
      this.setData({
        showDelayTips: true,
      })
    }, 30000)
  },

  /**
   * 关闭网关搜索子设备能力
   */
  handleCloseGatewaySearch(buzz) {
    const reqData = {
      buzz, // 是否蜂鸣 1:是,0:否	
      reqId: getReqId(),
      stamp: getStamp(),
      gatewayId: this.data.applianceCode, // 网关id
      transId: this.data.transId, // 事务id
      expire: 60, // 有效时间
      modelId: this.data.isFromPlugin ? app.addDeviceInfo.productId : ''  // 指定添加的型号
    }
    requestService.request('subDeviceAddOff', reqData).then(
      (resp) => {
        console.log(resp)
      },
      (error) => {
        console.error('关闭网关搜索子设备能力失败', error)
      }
    )
  },

  /**
   * 弹窗确认回调
   */
  handleConfirmDialog() {
    console.log(this.data.dialogCommonData)
    const type = this.data.dialogCommonData.dialogType
    switch (type) {
      case 1:
        this._clearTimeout(3)
        // 1秒后重新请求，避免立马出现错误弹窗
        setTimeout(() => {
          this.handleGatewayAccepting()
        }, 1000)
        break;
      default:
        console.log('确认default')
        break;
    }
  },

  /**
   * 弹窗取消回调
   */
  handleCancelDialog() {
    console.log(this.data.dialogCommonData)
    const type = this.data.dialogCommonData.dialogType
    switch (type) {
      case 1:
        this._clearTimeout(3)
        // 61秒后重新请求网关
        issueInstructionTimer = setTimeout(() => {
          this.handleGatewayAccepting()
        }, 61000)
        break;
      default:
        console.log('取消default')
        break;
    }
  },

  /**
   * 清除定时器
   * @params type 1-30秒定时器 2-搜索子设备定时器 3-下发网关指令定时器
   */
  _clearTimeout(type) {
    if (type === 1 || type === undefined) {
      showDelayTipsTimer && clearTimeout(showDelayTipsTimer)
      showDelayTipsTimer = null
    }
    if (type === 2 || type === undefined) {
      searchSubDeviceTimer && clearTimeout(searchSubDeviceTimer)
      searchSubDeviceTimer = null
    }
    if (type === 3 || type === undefined) {
      issueInstructionTimer && clearTimeout(issueInstructionTimer)
      issueInstructionTimer = null
    }
  },

  /**
   * 截取字符长度
   */
  handleSubstring(str = '', num = 4) {
    if (!str) return ''
    return str && str.length > num ? str.substring(0, num) + '..' : str
  },

  /**
   * 整理子设备数据
   * 展示顺序：按照添加时间由新到旧展示，新添加成功的排序最前
   */
  handleDillSubDevice(list = []) {
    list.forEach(item => {
      // 获取子设备icon
      try {
        let smartProductIdListObj = getApp().globalData.smartProductIdList[item.spid]
        if (smartProductIdListObj) {
          item.deviceImg = smartProductIdListObj.icon
        } else {
          item.deviceImg = sceneUtil.getIcon(item, [], list)
        }
      } catch(e) {
        console.error('获取子设备icon失败', e)
      }
      item.deviceNameStr = this.handleSubstring(item.deviceName)
      item.roomNameStr = this.handleSubstring(item.roomName)

      // 新旧数据过滤去重
      let applianceCodeArr = this.data.devices.map(e => e.applianceCode)
      let index = applianceCodeArr.indexOf(item.applianceCode)
      if (index > -1) {
        this.data.devices[index] = item
      } else {
        this.data.devices.unshift(item)
      }
    })
    const successArr = this.data.devices.filter(e => e.errorCode == 0)
    const failArr = this.data.devices.filter(e => e.errorCode != 0)
    this.setData({
      devices: [...successArr, ...failArr], // 成功的排前面，失败排后
      successNum: successArr.length,
      failNum: failArr.length
    })
    console.log('subIds devices', this.data.devices)
    this.hasListUpdateBurialPoint()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  async getpermissionTextAll(type) {
    let object_name = []
    if (type == 'location') {
      let locationRes = await checkPermission.loaction()
      let permissionTypeList = locationRes.permissionTypeList
      let { locationEnabled, locationAuthorized, scopeUserLocation } = permissionTypeList
      if (!locationEnabled) {
        object_name.push('开启定位服务')
      }
      if (!locationAuthorized) {
        object_name.push('允许微信获取位置权限')
      }
      if (!scopeUserLocation) {
        object_name.push('允许小程序使用位置权限')
      }
      object_name = object_name.join('/')
    } else if (type == 'blue') {
      let blueRes = await checkPermission.blue()
      let permissionTypeList = blueRes.permissionTypeList
      let { bluetoothEnabled, bluetoothAuthorized, scopeBluetooth } = permissionTypeList
      if (!bluetoothEnabled) {
        object_name.push('开启蓝牙服务')
      }
      if (!bluetoothAuthorized) {
        object_name.push('允许微信获取蓝牙权限')
      }
      if (!scopeBluetooth) {
        object_name.push('允许小程序使用蓝牙权限')
      }
      object_name = object_name.join('/')
    }
    return object_name
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    // 30秒延时提示
    this.handleTipsTimer()
    // 下发指令给网关
    this.handleGatewayAccepting()
    // 开始查找子设备
    this.fetchAnySubDevice()
    // 检查是否有数据更新
    this.hasListUpdate()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this._clearTimeout()
    // this.handleCloseGatewaySearch(0)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    getApp().onUnloadCheckingLog()
    this._clearTimeout()
    this.handleCloseGatewaySearch(1)
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

  navToLogin() {
    app.globalData.isLogon = false
    this.setData({
      isLogin: app.globalData.isLogon,
    })
    wx.navigateTo({
      url: paths.login,
    })
  },
  
  //权限提示
  async permissionCheckTip() {
    let loactionPermission = await checkPermission.loaction()
    if (!loactionPermission.isCanLocation) {
      this.setData({
        checkPermissionRes: loactionPermission,
        permissionImg: imgUrl + imgesList['img_dakaidingwei'],
      })
      return false
    }
    let bluePermission = await checkPermission.blue()
    console.log('[bluePermission]', bluePermission)
    if (!bluePermission.isCanBlue) {
      this.setData({
        checkPermissionRes: bluePermission,
        permissionImg: imgUrl + imgesList['img_dakailanya'],
      })
      rangersBurialPoint('user_page_view', {
        page_id: 'page_open_bluetooth_new',
        page_name: '提示需开启蓝牙权限页面',
        page_path: getCurrentPages()[0].route,
        module: 'appliance',
        widget_id: '',
        widget_name: '查看指引',
        object_type: '弹窗类型',
        object_id: '',
        object_name: (await this.getpermissionTextAll('blue')) || '',
        device_info: {
          device_session_id: getApp().globalData.deviceSessionId || '',
        },
      })
      return false
    }
    this.setData({
      checkPermissionRes: {
        isCanBlue: true,
        isCanLocation: true,
      },
    })
    return true
  },

  async goToGuide() {
    if (this.data.guideFalg) return
    this.data.guideFalg = true
    let { type, permissionTypeList } = this.data.checkPermissionRes
    if (type == 'location') {
      clickEventTracking('user_behavior_event', 'LookLocationGuide', {
        page_path: getFullPageUrl(),
        module: 'appliance',
        page_id: 'page_open_locate_new',
        page_name: '提示需开启位置权限页面',
        page_module: '',
        widget_name: '查看指引',
        widget_id: 'click_check_guide',
        rank: '',
        object_type: '弹窗类型',
        object_id: '',
        object_name: (await this.getpermissionTextAll('location')) || '',
        device_info: {
          device_session_id: app.globalData.deviceSessionId || '', //一次配网事件标识
          sn8: '', //sn8码
          a0: '', //a0码
          widget_cate: '', //设备品类"
          iot_device_id: '', //设备id
          wifi_model_version: '', //模组wifi版本
          link_type: '', //新增配网方式
        },
      })
      wx.navigateTo({
        url: paths.locationGuide + `?permissionTypeList=${JSON.stringify(permissionTypeList)}`,
      })
    }
    if (type == 'blue') {
      clickEventTracking('user_behavior_event', 'LookLocationGuide', {
        page_path: getFullPageUrl(),
        module: 'appliance',
        page_id: 'page_open_bluetooth_new',
        page_name: '提示需开启蓝牙权限页面',
        page_module: '',
        widget_name: '查看指引',
        widget_id: 'click_check_guide',
        rank: '',
        object_type: '弹窗类型',
        object_id: '',
        object_name: (await this.getpermissionTextAll('blue')) || '',
        device_info: {
          device_session_id: app.globalData.deviceSessionId || '', //一次配网事件标识
          sn8: '', //sn8码
          a0: '', //a0码
          widget_cate: '', //设备品类"
          iot_device_id: '', //设备id
          wifi_model_version: '', //模组wifi版本
          link_type: '', //新增配网方式
        },
      })
      wx.navigateTo({
        url: paths.blueGuide + `?permissionTypeList=${JSON.stringify(permissionTypeList)}`,
      })
    }
    setTimeout(() => {
      this.data.guideFalg = false
    }, 1000)
  },

  async retry() {
    if (this.data.retryFlag) {
      return
    }
    this.data.retryFlag = true
    let { type } = this.data.checkPermissionRes
    if (type == 'location') {
      clickEventTracking('user_behavior_event', 'researchDevice', {
        page_id: 'page_open_locate_new',
        page_name: '提示需开启位置权限页面',
        page_path: getFullPageUrl(),
        module: 'appliance',
        widget_id: 'click_research device',
        widget_name: '重新搜索设备',
        object_type: '弹窗类型',
        object_id: '',
        object_name: (await this.getpermissionTextAll('location')) || '',
        device_info: {
          device_session_id: getApp().globalData.deviceSessionId || '',
        },
      })
    }
    if (type == 'blue') {
      clickEventTracking('user_behavior_event', 'researchDevice', {
        page_id: 'page_page_open_bluetooth_new',
        page_name: '提示需开启蓝牙权限页面',
        page_path: getFullPageUrl(),
        module: 'appliance',
        widget_id: 'click_research device',
        widget_name: '重新搜索设备',
        object_type: '弹窗类型',
        object_id: '',
        object_name: (await this.getpermissionTextAll('blue')) || '',
        device_info: {
          device_session_id: getApp().globalData.deviceSessionId || '',
        },
      })
    }
    let permission = await this.permissionCheckTip()
    console.log('[retry permission]', permission)
    if (!permission) {
      wx.showToast({
        title: '请按照指引开启权限',
        icon: 'none',
      })
    }
    setTimeout(() => {
      this.data.retryFlag = false
    }, 1500)
  },

  /**
   * 返回上一页
   */
  handleGoBack() {
    this.handleGoBackBurialPoint()
    wx.navigateBack({
      delta: 1
    })
  },

  handleSuccess() {
    this.handleSuccessBurialPoint()
    wx.reLaunch({ url: '/pages/authorize/authorize' })
  },

  /**
   * 联网成功 - 设置家庭设备信息
   */
  handleSetting(e) {
    const { item } = e.currentTarget.dataset
    app.addDeviceInfo.currentSubDeviceInfo = item
    this.handleSettingBurialPoint()
    wx.navigateTo({
      url: `${paths.addSuccess}?fromSubDeviceNetwork=true`
    })
  },

  /**
   * 查看联网失败原因
   */
  handleReason(e) {
    const { item } = e.currentTarget.dataset
    app.addDeviceInfo.currentSubDeviceInfo = item
    app.addDeviceInfo.errorCode = item.errorCode
    app.addDeviceInfo.errorMsg = item.errorMsg
    this.handleReasonBurialPoint()
    wx.navigateTo({
      url: `${paths.linkNetFail}?fromSubDeviceNetwork=true`
    })
  },
  pageBurialPoint() {
    rangersBurialPoint('user_page_view', {
      module: 'appliance',
      page_id: 'sub_device_search',
      page_name: '子设备搜索页面',
      device_session_id: '',
      a0: '',
      widget_cate: '',
      link_type: '',
      smartProductID: ''
    })
  },
  noDataBurialPoint() {
    rangersBurialPoint('user_page_view', {
      module: 'appliance',
      page_id: 'sub_device_search_no_device prompts_found',
      page_name: '子设备搜索页面30s未搜索到提示文案',
      device_session_id: '',
      a0: '',
      widget_cate: '',
      link_type: '',
      smartProductID: ''
    })
  },
  handleGoBackBurialPoint() {
    rangersBurialPoint('user_behavior_event', {
      module: 'appliance',
      page_id: 'sub_device_search_no_device prompts_found',
      page_name: '子设备搜索页面30s未搜索到提示文案',
      widget_id: 'reoperate_device_buttom',
      widget_name: '重新操作设备',
      device_session_id: '',
      a0: '',
      widget_cate: '',
      link_type: '',
      smartProductID: ''
    })
  },
  hasListUpdateBurialPoint() {
    let list = this.data.devices.map((item) => {
      var tempObj = {}
      tempObj['smartProductId']= item.spid
      tempObj['status'] = item.status 
      return tempObj
    })
    rangersBurialPoint('user_page_view', {
      module: 'appliance',
      page_id: 'sub_device_binding_results',
      page_name: '子设备绑定设备',
      ext_info: {
        list
      },
      device_session_id: '',
      a0: '',
      widget_cate: '',
      link_type: '',
      smartProductID: ''
    })
  },
  handleSettingBurialPoint() {
    let list = this.data.devices.map((item) => {
      var tempObj = {}
      tempObj['smartProductId']= item.spid
      tempObj['status'] = item.status 
      return tempObj
    })
    rangersBurialPoint('user_behavior_event', {
      module: 'appliance',
      page_id: 'sub_device_binding_results',
      page_name: '子设备绑定设备',
      widget_id: 'set_up_buttom',
      widget_name: '设置按钮',
      ext_info: {
        list
      },
      device_session_id: '',
      a0: '',
      widget_cate: '',
      link_type: '',
      smartProductID: ''
    })
  },
  handleReasonBurialPoint() {
    let list = this.data.devices.map((item) => {
      var tempObj = {}
      tempObj['smartProductId']= item.spid
      tempObj['status'] = item.status 
      return tempObj
    })
    rangersBurialPoint('user_behavior_event', {
      module: 'appliance',
      page_id: 'sub_device_binding_results',
      page_name: '子设备绑定设备',
      widget_id: 'view_reason_buttom',
      widget_name: '查看原因按钮',
      ext_info: {
        list
      },
      device_session_id: '',
      a0: '',
      widget_cate: '',
      link_type: '',
      smartProductID: ''
    })
  },
  handleSuccessBurialPoint() {
    rangersBurialPoint('user_behavior_event', {
      module: 'appliance',
      page_id: 'sub_device_binding_results',
      page_name: '子设备绑定设备',
      widget_id: 'finish_buttom',
      widget_name: '完成按钮',
      device_session_id: '',
      a0: '',
      widget_cate: '',
      link_type: '',
      smartProductID: ''
    })
  },
  
  /**
   * 解析网关推送数据
   */
  receiveSocketData(){
    receiveSocketMessage('', (message) => {
      console.log('接收网关推送子设备消息---------', message, this.data.applianceCode)
      // 判断是否属于当前网关推送的消息
      if (message.gatewayId === this.data.applianceCode && message.subDevices) {
        let subDevices = JSON.parse(message.subDevices)
        console.log('subDevices==>', subDevices)
        subDevices.forEach(item => {
          item.applianceCode = String(item.deviceId)
          let subIds = this.data.pushSubDevices.map(e => e.applianceCode)
          let index = subIds.indexOf(item.applianceCode)
          if (index > -1) {
            this.data.pushSubDevices[index] = item
          } else {
            this.data.pushSubDevices.unshift(item)
          }
        })
        this.handleDillSubDevice(this.data.pushSubDevices)
      }
    })
  },

})