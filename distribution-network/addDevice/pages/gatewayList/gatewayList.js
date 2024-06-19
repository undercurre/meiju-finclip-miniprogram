// addDevice/pages/gatewayList/gatewayList.js
const app = getApp()
const addDeviceMixin = require('../../../assets/sdk/common/addDeviceMixin.js')
const bleNeg = require('../../../../utils/ble/ble-negotiation')
const netWordMixin = require('../../../assets/js/netWordMixin.js')
const bluetooth = require('../../../../pages/common/mixins/bluetooth.js')
import { addGuide, afterCheck } from '../../../../utils/paths'
import computedBehavior from 'm-miniCommonSDK/utils/miniprogram-computed.js'
const getFamilyPermissionMixin = require('../../../assets/js/getFamilyPermissionMixin.js')
const brandStyle = require('../../../assets/js/brand.js')
const getBatchAuthListMixin = app.globalData.brand == 'colmo' ? require('../../../../components/home/my-home-appliances/behavior') : Behavior({})
const rangersBurialPoint = getApp().getGlobalConfig().rangersBurialPoint
const backUpApUtil = require('../../../assets/asyncSubpackages/apUtils.js')
Page({

  behaviors: [bluetooth, addDeviceMixin, bleNeg, netWordMixin, computedBehavior, getFamilyPermissionMixin, getBatchAuthListMixin],

  /**
   * 页面的初始数据
   */
  data: {
    navTop: app.globalData.statusNavBarHeight,
    brand: '',
    brandConfig: app.globalData.brandConfig[app.globalData.brand],
    dialogStyle: brandStyle.config[app.globalData.brand].dialogStyle, //弹窗样式
    familyInfo: {}, // 家庭信息
    currentRadio: -1, // 当前选中网关
    errorCode: '', // 配网错误码
    ishowLinkDialog: false, // 重新联网弹窗开关
    ishowCheckDialog: false, // 重新确权弹窗开关
    gatewayList: [], // 网关列表数据
    currentGatewayInfo: null, // 当前选中网关
    currentItem: {}, // 当前正在操作的网关
    throttleFlag: false, // 节流阀防重复点击
  },

  /**
   * 点击返回事件
   */
  onClickBack(){
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 底部按钮提交事件
   */
  onNextStep() {
    if (this.data.currentRadio === -1) return
    this.nextStepBurialPoint()
    app.addDeviceInfo.currentGatewayInfo = this.data.currentGatewayInfo
    wx.navigateTo({
      url: `${addGuide}?fromSubDeviceNetwork=true`
    })
  },

  /**
   * 点击选中网关Item事件
   */
  onHandleClickItem(event) {
    const { name, item } = event.currentTarget.dataset
    if (item.isLabelShow) return
    this.setData({
      currentGatewayInfo: this.data.currentRadio == name ? null : item,
      currentRadio: this.data.currentRadio == name ? -1 : name,
    })
  },

  /**
   * 点击不支持网关指引事件
   */
  onLabelClick(event){
    const { item, type } = event.currentTarget.dataset
    console.log('当前点击-->', item)
    this.setData({ currentItem: item })

    if (this.data.throttleFlag) return

    // 未确权逻辑处理
    type === 2 && this.fetchCheckStatus(item)
    
    // 已离线逻辑处理
    type === 1 && this.showRelinkDialog(item)
  },

  /**
   * 请求确权状态接口
   */
  async fetchCheckStatus(item) {
    this.data.throttleFlag = true
    wx.showLoading({ mask: true })
    this.linkDeviceService.getApplianceAuthType(item.applianceCode).then((respData) => {
      console.log('查询设备确权情况', respData)
      wx.hideLoading()
      const { status } = respData.data.data
      if (status == 0) {
        this.setData({
          titleContent: '设备状态已更新',
          messageContent: '您此前已完成安全验证，设备状态已更新，可直接选择使用',
          ishowCheckDialog: true
        })
        this.reFreshBatchStatus()
        this.data.throttleFlag = false
      } else {
        app.addDeviceInfo.currentGatewayInfo = item
        wx.navigateTo({
          url: `${afterCheck}?fromSubDeviceNetwork=true`,
          complete: () => {
            this.data.throttleFlag = false
          }
        })
      }
    }).catch((error) => {
      this.data.throttleFlag = false
      wx.hideLoading()
      console.error('查询确权状态失败', error)
    })
  },

  /**
   * 重新确权成功回调
   */
  onReCheckCallBackFn() {
    const list = app.addDeviceInfo.gatewayList || []
    const index = list.findIndex(e => e.applianceCode === this.data.currentItem.applianceCode)
    if (index > -1) {
      app.addDeviceInfo.gatewayList[index].status = 0
      this.init()
    }
    this.reCheckBurialPoint()
  },

  /**
   * 刷新首页确权状态接口
   */
  async reFreshBatchStatus() {
    try {
      let aplCodeList = app.globalData.applianceAuthList.map(applianceItem => {
        return applianceItem.applianceCode
      })
      await this.getBatchAuthList(aplCodeList)
    } catch(e) {
      console.error('刷新首页确权状态失败', e)
    }
  },

  /**
   * 打开重新联网弹窗
   */
  showRelinkDialog(item) {
    this.setData({
      titleContent: `是否立即为${item.name}重新联网`,
      messageContent: `将退出${app.addDeviceInfo.deviceName}的联网流程，请为${item.name}联网后重新添加${app.addDeviceInfo.deviceName}`,
      ishowLinkDialog: true
    })
    this.showRelinkBurialPoint()
  },

  /**
   * 点击去重新联网 - 同扫码场景配网
   */
  onToRelink() {
    this.relinkClickBurialPoint()
    const item = this.data.currentItem || {}
    let data = {
      ...item,
      mode: item.mode || '',
      isFromScanCode: true,
      isNotNeedModeParam: true, // 获取配网指引不需要传mode参数
      category: item.type?.includes('0x') ? item.type.substr(2, 2) : item.type,
      enterprise: item.enterpriseCode || '',
      fm: 'scanCode'
    }
    console.log('当前去重新联网网关信息：', data)
    this.actionGoNetwork(data)
  },

  /**
   * 网关列表排序时间
   * 先排序支持选择的网关，再排序不支持的
   */
  gatewayListSort(gatewayList) {
    let supportArr = gatewayList.filter(e => e.isLabelShow === false)
    let unsupportArr = gatewayList.filter(e => e.isLabelShow === true)
    return [...supportArr, ...unsupportArr]
  },

  /**
   * 页面初始化数据
   * 1、满足在线+确权+网关版本，显示为可选状态
   * 2、不可选状态文案优先级：离线>未确权>版本低
   * 3、先对比网关固件识别码是否一致，一致再判断版本序号>=
   */
  init() {
    let gatewayList = app.addDeviceInfo.gatewayList || []
    gatewayList.forEach(item => {
      item.isLabelShow = false
      item.deviceName = item.name
      if (item.onlineStatus == 0) { // 已离线
        item['isLabelShow'] = true
        item['labelText'] = '已离线，'
        item['labelClickText'] = '重新联网'
        item['clickType'] = 1
      } else if (!(item.status == 0 || item.status == 3)) { // 未确权
        item['isLabelShow'] = true
        item['labelText'] = '未进行安全验证，'
        item['labelClickText'] = '去验证'
        item['clickType'] = 2
      } else if (!item.isSuitableLowestVersion) { // 版本过低
        item['isLabelShow'] = true
        item['labelText'] = this.data.brandConfig.lowVersionText
        item['labelClickText'] = ''
      }
    })
    this.setData({ gatewayList: this.gatewayListSort(gatewayList) })
    // 单一网关默认选中
    if (
      this.data.gatewayList.length === 1
      && this.data.gatewayList[0].isLabelShow === false
      && this.data.currentRadio === -1
    ) {
      this.setData({
        currentRadio: this.data.currentRadio = this.data.gatewayList[0].applianceCode,
        currentGatewayInfo: this.data.gatewayList[0]
      })
    }
    wx.hideLoading()
  },

  /**
   * 检查是否有数据更新
   */
  hasListUpdate() {
    if (app.addDeviceInfo.isBackFromSubDeviceAfterCheck) {
      app.addDeviceInfo.isBackFromSubDeviceAfterCheck = false
      const { applianceCode, status } = app.addDeviceInfo.currentGatewayInfo
      app.addDeviceInfo.gatewayList.forEach(e => {
        if (e.applianceCode === applianceCode) {
          e.status = status
          this.reFreshBatchStatus()
        }
      })
      this.init()
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 检查是否有数据更新
    this.hasListUpdate()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(option) {
    wx.showLoading()
    getApp().onLoadCheckingLog()
    this.data.brand = getApp().globalData.brand
    let { currentHomeInfo, currentRoomId, currentRoomName } = getApp().globalData
    this.setData({
      brand: this.data.brand,
      familyInfo: currentHomeInfo,
      currentRoomId: currentRoomId,
      currentRoomName: currentRoomName
    })
    try {
      if (!getApp().globalData.linkupSDK) {
        getApp().globalData.linkupSDK = await require.async('../../../assets/sdk/index')
      }
      this.linkDeviceService = app.globalData.linkupSDK.commonIndex.linkDeviceService
      getApp().addDeviceInfo.apUtils = backUpApUtil
    } catch (error) {
      console.error('linkupSDK fail', error)
    }
    this.init()
    this.pageBurialPoint()
  },

  pageBurialPoint() {
    let gatewayList = app.addDeviceInfo.gatewayList || []
    let gatewayp = []
    gatewayList.forEach(item => {
      let gatewaypItem = {}
      gatewaypItem.sn8 = item.sn8
      if (item.onlineStatus) {
        gatewaypItem.status = 1
      } else {
        gatewaypItem.status = 2
      }
      if (!item.isSuitableLowestVersion) {
        gatewaypItem.status = 3
      }
      if (item.status != 0) {
        gatewaypItem.status = 4
      }
      gatewayp.push(gatewaypItem)
    })
    rangersBurialPoint('user_page_view', {
      module: 'appliance',
      page_id: 'choose_matching_gatewayp',
      page_name: '选择搭配的网关页面',
      ext_info: {
        gatewayp
      },
      device_session_id: '',
      a0: '',
      widget_cate: '',
      link_type: '',
      smartProductID: ''
    })
  },
  showRelinkBurialPoint() {
    rangersBurialPoint('user_behavior_event', {
      module: 'appliance',
      widget_id: 'gateway_reconnection',
      widget_name: '网关重新联网',
      device_session_id: '',
      a0: '',
      widget_cate: '',
      link_type: '',
      smartProductID: ''
    })
  },
  reCheckBurialPoint() {
    rangersBurialPoint('user_behavior_event', {
      module: 'appliance',
      widget_id: 'gateway_to_verify',
      widget_name: '网关去验证',
      device_session_id: '',
      a0: '',
      widget_cate: '',
      link_type: '',
      smartProductID: ''
    })
  },
  relinkClickBurialPoint() {
    rangersBurialPoint('user_behavior_event', {
      module: 'appliance',
      widget_id: 'upgrade_gateway_version_connect_now',
      widget_name: '网关立即重新联网',
      device_session_id: '',
      a0: '',
      widget_cate: '',
      link_type: '',
      smartProductID: ''
    })
  },
  nextStepBurialPoint() {
    let gatewayList = app.addDeviceInfo.gatewayList || []
    let gatewayp = []
    gatewayList.forEach(item => {
      let gatewaypItem = {}
      gatewaypItem.sn8 = item.sn8
      if (item.onlineStatus) {
        gatewaypItem.status = 1
      } else {
        gatewaypItem.status = 2
      }
      if (!item.isSuitableLowestVersion) {
        gatewaypItem.status = 3
      }
      if (item.status != 0) {
        gatewaypItem.status = 4
      }
      gatewayp.push(gatewaypItem)
    })
    rangersBurialPoint('user_behavior_event', {
      module: 'appliance',
      page_id: 'choose_matching_gatewayp',
      page_name: '选择搭配的网关页面',
      widget_id: 'next_buttom',
      widget_name: '下一步按钮',
      ext_info: {
        gatewayp
      },
      device_session_id: '',
      a0: '',
      widget_cate: '',
      link_type: '',
      smartProductID: ''
    })
  }

})