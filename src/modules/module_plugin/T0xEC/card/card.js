const app = getApp() //获取应用实例
const requestService = app.getGlobalConfig().requestService
const rangersBurialPoint = app.getGlobalConfig().rangersBurialPoint
import { getStamp } from 'm-utilsdk/index'
import { imageDomain, commonApi } from '../assets/scripts/api'

import {
  getModelNameById,
  getTextByStatus,
  getMenuIdByKey,
  menuId,
  modeDesc,
  modeList,
  getTimeRange,
  getWorkTimeById,
  getAppointFinishTime,
  getWorkFinishTime,
  STATUS,
  EC,
} from './js/EC.js'
import {
  getAppointTimeRange,
  getAppointWorkingText,
  getModeName,
  getWarmTimeText,
  mode2ID,
  targetID2Mode,
  workStatus2Int,
} from './js/EC'
import { DeviceData } from '../assets/scripts/device-data'
import MideaToast from '../component/midea-toast/toast'
import { Format } from '../assets/scripts/format'
import { parseComponentModel } from '../assets/scripts/common'
import { UI } from '../assets/scripts/ui'

let deviceStatusTimer = null
let isDeviceInterval = true
Component({
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    applianceData: {
      type: Object,
      value: function () {
        return {}
      },
    },
  },
  data: {
    // region 2021.10.11 敖广骏
    bgImage: {
      url1: imageDomain + '/0xFB/bg.png',
      url2: imageDomain + '/0xFB/bg-running.png',
      url3: imageDomain + '/0xFB/bg-running-move.png',
    },
    configList: [],
    quickDevJson: undefined,
    deviceInfo: {
      isOnline: false,
      isRunning: false,
    },
    isBottomFixed: false,
    isInit: false,
    iconUrl: {
      aroma: imageDomain + '/0xEC/icon-aroma.png',
      arrow: {
        url1: imageDomain + '/0xE7/icon-arrow-r.png',
      },
      power: {
        url1: imageDomain + '/0xFB/icon-switch.png',
      },
      pressure: {
        url1: imageDomain + '/0xEC/icon-pressure.png',
      },
      clock: {
        url1: imageDomain + '/0xF1/icon-yuyue.png',
      },
      workTime: {
        url1: imageDomain + '/0xF1/icon-shijian.png',
      },
      mouthfeel: {
        url1: imageDomain + '/0xF1/icon-kougan.png',
      },
      temperature: {
        url1: imageDomain + '/0xF1/icon-baowen.png',
      },
      test: {
        url1: imageDomain + '/0xFB/icon_zhire2.png',
        url2: imageDomain + '/0xFB/icon_zhire.png',
        url3: 'https://ce-cdn.midea.com/quick_dev/function/1e13781d-c5ab-41d4-b04d-cc43b72fbd93.png',
        url4: 'https://ce-cdn.midea.com/quick_dev/function/7239b481-7e19-4267-bfaa-65aec566e3e1.png',
      },
      backImgBase: imageDomain + '/0xFC/icon_youjiantou.png',
    },
    noticeBar: {
      isShow: false,
      content: '内容',
      type: 'danger',
    },
    workTimeData: {
      value: [0, 0, 0, 0],
      hours: [0, 1, 2, 3, 4, 5],
      minutes: [0, 1, 2, 3, 4, 5],
      result: {},
    },
    scheduleData: {
      value: [0, 0, 0, 0],
      day: [],
      hours: [],
      minutes: [],
      result: undefined,
      resultLabel: undefined,
    },
    scheduleModal: {
      isShow: false,
    },
    selectedFunction: {},
    settingModal: {
      isShow: false,
      params: {
        taste: undefined,
        pressureLevel: undefined,
      },
    },
    workStatus: {},

    // region 定义控件
    sliderPressureLevel: parseComponentModel({
      min: 60,
      max: 120,
      interval: 1,
      currentValue: 70,
      valueArray: [
        {
          value: 60,
          label: '60kPa',
        },
        {
          value: 90,
          label: '90kPa',
        },
        {
          value: 120,
          label: '120kPa',
        },
      ],
      width: '110%',
      unit: 'kPa',
    }),
    switchAroma: parseComponentModel({
      isActive: true,
      selected: false,
    }),
    switchSchedule: parseComponentModel({
      isActive: true,
      selected: false,
    }),
    // endregion

    // endregion

    // region 2021.10.11 之前的代码
    scrollViewTop: 0,
    buttonSize: '110rpx',
    icons: {
      greyTriangle: 'assets/img/grey-triangle.png',
    },
    modelHidden: ['kuaisufan', 'kuaisuzhou', 'baotang', 'rouji'],
    rowClass1: 'row-sb',
    rowClass2: 'row-sb',
    btnShowStatus: false,
    powerImg: {
      on: '/pages/T0xFC/assets/img/icon_switch_on01@3x.png',
      off: '/pages/T0xFC/assets/img/icon_switch_off01@3x.png',
    },
    modeImg: {
      kuaisufan: {
        disabled: imageDomain + '/0xEC/kuaisufan-1.png',
        on: imageDomain + '/0xEC/kuaisufan-2.png',
        off: imageDomain + '/0xEC/kuaisufan-1.png',
        appoint: imageDomain + '/0xEC/kuaisufan-2.png',
      },
      kuaisuzhou: {
        disabled: imageDomain + '/0xEC/kuaisuzhou-1.png',
        on: imageDomain + '/0xEC/kuaisuzhou-2.png',
        off: imageDomain + '/0xEC/kuaisuzhou-1.png',
        appoint: imageDomain + '/0xEC/kuaisuzhou-2.png',
      },
      baotang: {
        disabled: imageDomain + '/0xEC/baotang-1.png',
        on: imageDomain + '/0xEC/baotang-2.png',
        off: imageDomain + '/0xEC/baotang-1.png',
        appoint: imageDomain + '/0xEC/baotang-2.png',
      },
      rouji: {
        disabled: imageDomain + '/0xEC/rouji-1.png',
        on: imageDomain + '/0xEC/rouji-2.png',
        off: imageDomain + '/0xEC/rouji-1.png',
        appoint: imageDomain + '/0xEC/rouji-2.png',
      },
    },
    circleImg: {
      yellow: imageDomain + '/0xEC/circle-yellow.png',
      red: imageDomain + '/0xEC/circle-red.png',
    },
    openPicker: false,
    listData: {},
    _applianceData: {
      name: '',
      roomName: '',
      onlineStatus: 0,
    },
    _applianceDataStatus: {
      work_status: '0',
      cmd_code: '0',
      time_work_hr: '0',
      time_work_min: '0',
      time_warm_hr: '0',
      time_warm_min: '0',
      time_reserve_hr: '0',
      time_reserve_min: '0',
    },
    text: '待机中', // 显示状态文字（待机中）
    menuId: menuId,
    currentMenuId: 0, // 记录当前的menuId
    showText: false,
    showWorkingText: false, // 显示工作参数
    workingText: '', // 工作参数
    showWorkingStatus: false, // 显示工作状态
    workingStatus: '', // 工作状态
    finishTime: '',
    showFinishTime: false,
    circleSrc: '',
    power: {},
    // 菜单
    kuaisufan: {},
    kuaisuzhou: {},
    baotang: {},
    rouji: {},
    otherMenu: {},
    // ...
    showManualItems: false,
    showOfflineCard: false,
    offlineFlag: false,
    currentAppointData: {},
    otherMenuWorking: false,
    actionSheetShow: false,
    // 选择器
    multiArray: [['今天', '明天'], ['1'], ['时'], ['2'], ['分']],
    multiIndex: [0, 0, 0, 0, 0, 0],
    todayHours: [],
    tomorrowHours: [],
    todayFirstMinutes: [],
    tomorrowLastMinutes: [],
    normalMinutes: [],
    showDialog: false,
    pickerOpenHour: 0,
    pickerOpenMinute: 0,
    headerImg: imageDomain + '/0xEC/blender.png',
    // endregion
  },
  methods: {
    // 设置离线状态
    updateViewOnlineToggle(isOnline) {
      let deviceInfo = this.data.deviceInfo
      deviceInfo.isOnline = isOnline
      this.setData({ deviceInfo })
    },
    // 获取云食谱名称
    getMenuName(menuId) {
      return new Promise((resolve, reject) => {
        let sendParams = {
          serviceName: 'recipe-service',
          uri: 'menu/getMenuNameByMenuId?menuId=' + menuId,
          method: 'POST',
          contentType: 'application/json',
        }
        requestService
          .request(commonApi.sdaTransmit, sendParams)
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            if (err.data) {
              resolve(err)
            } else {
              reject(err)
            }
          })
      })
    },
    // region 2021.10.11 敖广骏

    // region 跳转到美居下载页
    goToDownLoad() {
      wx.navigateTo({
        url: '/pages/download/download',
      })
    },
    // endregion

    // region 轮询获取设备状态
    deviceStatusInterval(interval) {
      if (deviceStatusTimer) {
        clearInterval(deviceStatusTimer)
      }
      if (!interval) {
        interval = 6000
      }
      if (isDeviceInterval) {
        deviceStatusTimer = setInterval(() => {
          this.updateStatus()
        }, interval)
      }
      // this.updateStatus();
    },
    clearDeviceStatusInterval() {
      if (deviceStatusTimer) {
        clearInterval(deviceStatusTimer)
      }
    },
    // endregion

    // region 显示顶部通知栏
    showNoticeBar(options) {
      do {
        if (!options) {
          console.warn('缺少options')
          break
        }
        let content = '内容'
        if (typeof options === 'string') {
          content = options
        } else {
          content = options.content
        }
        let noticeBar = this.data.noticeBar
        noticeBar.isShow = true
        noticeBar.content = content
        this.setData({ noticeBar })
      } while (false)
    },
    closeNoticeBar() {
      let noticeBar = this.data.noticeBar
      noticeBar.isShow = false
      this.setData({ noticeBar })
    },
    // endregion

    // region 确定预约时间
    // 确认预约时间
    confirmSchedule() {
      let scheduleData = this.data.scheduleData
      let value = scheduleData.value
      let deviceInfo = this.data.deviceInfo
      let day = value[1]
      let hour = scheduleData.hours[value[2]]
      let minute = scheduleData.minutes[value[3]]
      let nowDate = new Date()
      // 判断RTC类型，计算完成时间
      if (deviceInfo.isSupportRtc) {
        // 时钟类型,不作处理
      } else {
        // 非时钟类型，计算间隔时间
        if (day === 0) {
          let interval = hour * 60 + minute - (nowDate.getHours() * 60 + nowDate.getMinutes())
          hour = Math.floor(interval / 60)
          minute = interval % 60
        } else {
          let nowTimestamp = nowDate.getTime()
          // 获取明天的时间
          let tomorrowTimestamp = nowTimestamp + 86400000
          let tomorrowDate = new Date(tomorrowTimestamp)
          // 获取明天的年月日
          let targetYear = tomorrowDate.getFullYear() + ''
          let targetMonth = tomorrowDate.getMonth() + 1 + ''
          let targetDate = tomorrowDate.getDate() + ''
          let targetString =
            targetYear +
            '/' +
            targetMonth +
            '/' +
            targetDate +
            ' ' +
            Format.getTime(hour) +
            ':' +
            Format.getTime(minute)
          // 获取目标时间的时间戳
          let targetTimestamp = new Date(targetString).getTime()
          let targetInterval = targetTimestamp - nowTimestamp
          hour = Math.floor(targetInterval / 1000 / 60 / 60)
          minute = (targetInterval / 1000 / 60) % 60
        }
      }
      scheduleData.result = hour * 60 + minute
      let today = nowDate.getDate()
      let nowDateStamp = nowDate.getTime()
      let targetDateStamp = nowDateStamp + scheduleData.result * 60 * 1000
      let targetDate = new Date(targetDateStamp)
      let targetDay = targetDate.getDate()
      let scheduleFinishLabel = '等待启动'
      if (today === targetDay) {
        // 今天
        scheduleFinishLabel = '今天'
      } else {
        // 明天
        scheduleFinishLabel = '明天'
      }
      let finishTime = Format.dateFormat('HH:MM', targetDate)
      scheduleFinishLabel += finishTime
      scheduleData.resultLabel = scheduleFinishLabel
      this.setData({ scheduleData })
      this.closeScheduleModal()
    },
    // 取消预约
    cancelSchedule() {
      this.closeScheduleModal()
      // 预约时间初始化
      let switchSchedule = parseComponentModel(this.data.switchSchedule)
      switchSchedule.selected = false
      switchSchedule = parseComponentModel(switchSchedule)
      let scheduleData = {
        value: [0, 0, 0, 0, 0],
        day: [],
        hours: [],
        minutes: [],
        result: undefined,
        resultLabel: undefined,
      }
      this.setData({ scheduleData })
    },
    // endregion

    // region 数据初始化
    dataInit(newDeviceStatus) {
      let data = this.data
      let deviceInfo = data.deviceInfo
      let configList = data.configList
      let quickDevJson = data.quickDevJson
      let workStatus = data.workStatus
      console.log('数据初始化')
      console.log(newDeviceStatus)
      if (newDeviceStatus) {
        Object.assign(deviceInfo, newDeviceStatus)
        // 工作状态
        let workStatusOptions = quickDevJson.properties[EC.settingApiKey.workStatue].options
        if (workStatusOptions && workStatusOptions.length > 0) {
          for (let i = 0; i < workStatusOptions.length; i++) {
            let workStatusOptionItem = workStatusOptions[i]
            workStatus[workStatusOptionItem.code] = workStatusOptionItem.value
            if (workStatusOptionItem.value == deviceInfo.work_status) {
              deviceInfo.workStatusName = workStatusOptionItem.desc || workStatusOptionItem.text
              if (
                workStatusOptionItem.code === EC.workStatus.workingVenting ||
                workStatusOptionItem.code === EC.workStatus.interruptVenting
              ) {
                deviceInfo.workStatusName = '排气中'
              }
              if (deviceInfo.workStatusName.indexOf('设备') > -1) {
                deviceInfo.workStatusName = deviceInfo.workStatusName.replace('设备', '')
              }
            }
          }
        }
        if (deviceInfo.work_status !== '0') {
          deviceInfo.isRunning = true
        } else {
          deviceInfo.isRunning = false
        }
        // 是否开盖
        if (deviceInfo.open_cap == '0') {
          // 盖子打开
          deviceInfo.enabledCap = false
          this.showNoticeBar('设备已开盖，请合盖后再启动功能。')
        } else {
          // 盖子合上
          deviceInfo.enabledCap = true
          this.closeNoticeBar()
        }
        // 预约时间
        let timeReserveSettingHr = Number(deviceInfo.time_reserve_hr)
        let timeReserveSettingMin = Number(deviceInfo.time_reserve_min)
        let finishMinutes = timeReserveSettingHr * 60 + timeReserveSettingMin
        let nowDate = new Date()
        let today = nowDate.getDate()
        let nowDateStamp = nowDate.getTime()
        let targetDateStamp = nowDateStamp + finishMinutes * 60 * 1000
        let targetDate = new Date(targetDateStamp)
        let targetDay = targetDate.getDate()
        let scheduleFinishLabel = '等待启动'
        if (today === targetDay) {
          // 今天
          scheduleFinishLabel = '今天'
        } else {
          // 明天
          scheduleFinishLabel = '明天'
        }
        let finishTime = Format.dateFormat('HH:MM', targetDate)
        scheduleFinishLabel += finishTime
        deviceInfo.finishTime = scheduleFinishLabel
        // 剩余时间
        deviceInfo.time_work_setting_hr = Number(deviceInfo.time_work_setting_hr)
        deviceInfo.time_work_setting_min = Number(deviceInfo.time_work_setting_min)
        let timeWorkHr = Number(deviceInfo.time_work_hr)
        let timeWorkMin = Number(deviceInfo.time_work_min)
        if (timeWorkHr > 0 || timeWorkMin > 0) {
          let second = timeWorkHr * 60 * 60 + timeWorkMin * 60
          second = Number(second)
          let formatSecond = Format.formatSeconds(second)
          deviceInfo.currentTimeLabel = {
            hour: Format.getTime(formatSecond.hours),
            minute: Format.getTime(formatSecond.minutes),
            second: Format.getTime(formatSecond.seconds),
          }
        }
        // 保温时间
        let timeWarmHr = Number(deviceInfo.time_warm_hr)
        let timeWarmMin = Number(deviceInfo.time_warm_min)
        let second = timeWarmHr * 60 * 60 + timeWarmMin * 60
        second = Number(second)
        let formatSecond = Format.formatSeconds(second)
        deviceInfo.keepWarmTimeLabel = {
          hour: Format.getTime(formatSecond.hours),
          minute: Format.getTime(formatSecond.minutes),
          second: Format.getTime(formatSecond.seconds),
        }
        // 工作模式
        let workMode = deviceInfo.cmd_code
        let currentFunction = {}
        if (workMode != 0) {
          if (configList && configList.length > 0) {
            for (let j = 0; j < configList.length; j++) {
              let functionItem = configList[j]
              if (functionItem.code == workMode) {
                currentFunction = functionItem
                break
              }
            }
          }
          deviceInfo.currentFunction = currentFunction
          if (!deviceInfo.currentFunction.name) {
            deviceInfo.cloudMenu = deviceInfo.cloudMenu || {}
            if (deviceInfo.cloudMenu.code !== workMode) {
              // 获取云食谱名称
              this.getMenuName(workMode).then((res) => {
                if (res.data.errorCode === 0) {
                  let resData = JSON.parse(res.data.result.returnData)
                  if (resData.retInfo) {
                    deviceInfo.cloudMenu.code = workMode
                    deviceInfo.cloudMenu.name = resData.retInfo
                    this.setData({ deviceInfo })
                  }
                }
              })
            }
          }
        }
        // 口感
        if (deviceInfo.taste) {
          deviceInfo.tasteLabel = EC.getTasteName(deviceInfo.taste)
        }
      }
      this.setData({ deviceInfo, workStatus })
    },
    // endregion

    // region 重置参数设置对话框
    settingModalInit() {
      let settingModal = this.data.settingModal
      // 浓香模式
      let switchAroma = parseComponentModel(this.data.switchAroma)
      switchAroma.selected = false
      switchAroma = parseComponentModel(switchAroma)
      // 口感
      settingModal.params.taste = undefined
      // 预约时间
      let switchSchedule = parseComponentModel(this.data.switchSchedule)
      switchSchedule.selected = false
      switchSchedule = parseComponentModel(switchSchedule)
      let scheduleData = {
        value: [0, 0, 0, 0, 0],
        day: [],
        hours: [],
        minutes: [],
        result: undefined,
        resultLabel: undefined,
      }
      // 工作时间
      let workTimeData = {
        value: [0, 0, 0, 0],
        hours: [],
        minutes: [],
        result: undefined,
        resultLabel: undefined,
      }
      this.setData({
        switchSchedule,
        scheduleData,
        workTimeData,
        switchAroma,
        settingModal,
      })
    },
    // endregion

    // region 显示参数设置对话框
    showSettingModal() {
      let settingModal = this.data.settingModal
      settingModal.isShow = true
      this.setData({ settingModal })
    },
    closeSettingModal() {
      let settingModal = this.data.settingModal
      settingModal.isShow = false
      this.setData({ settingModal })
      setTimeout(() => {
        this.settingModalInit()
      }, 300)
    },
    // endregion

    // region 获取产品配置
    getProductConfig() {
      return new Promise((resolve, reject) => {
        let data = this.data
        let deviceInfo = data.deviceInfo
        if (deviceInfo.onlineStatus == DeviceData.onlineStatus.online) {
          deviceInfo.isOnline = true
        } else {
          deviceInfo.isOnline = false
          MideaToast('设备已离线，请检查网络状态')
        }
        this.setData({ deviceInfo })
        let productModelNumber = deviceInfo.modelNumber != 0 ? DeviceData.getAO(deviceInfo.modelNumber) : deviceInfo.sn8
        let params = {
          applianceId: deviceInfo.applianceCode,
          productTypeCode: deviceInfo.type,
          userId: data.uid,
          productModelNumber: deviceInfo.sn8 || productModelNumber,
          bigVer: 5,
        }
        let sendParams = {
          serviceName: 'node-service',
          uri: '/productConfig' + Format.jsonToParam(params),
          method: 'GET',
          contentType: 'application/json',
        }
        let method = 'POST'
        requestService
          .request(commonApi.sdaTransmit, sendParams, method)
          .then((res) => {
            console.log('获取产品配置')
            console.log(deviceInfo)
            console.log(res)
            // 设置页面功能
            let resData = null

            resData = JSON.parse(res.data.result.returnData)
            do {
              if (res.data.errorCode == 50300 || res.data.errorCode == 1001) {
                // 无资源重定向
                EC.redirectUnSupportDevice(this.properties.applianceData)
                break
              }
              if (res.data.errorCode != 0) {
                let msg = EC.handleErrorMsg(res.code)
                MideaToast(msg)
                break
              }
              let quickDevJson = EC.quickDevJson2Local(resData)
              console.log('解析后参数')
              console.log(quickDevJson)
              let configList = []
              // 过滤快捷功能
              quickDevJson.functions.forEach((functionsItem) => {
                do {
                  let attributesSetting = functionsItem.settingsData[EC.settingApiKey.attributes]
                  if (attributesSetting) {
                    if (attributesSetting.properties.intelligentCook) {
                      break
                    }
                  }
                  configList.push(functionsItem)
                } while (false)
              })
              let functionLength = configList.length
              do {
                if (functionLength === 7) {
                  deviceInfo['layoutClass'] = 'grid-layout-fourth'
                  break
                }
                if (functionLength === 2) {
                  deviceInfo['layoutClass'] = 'grid-layout-double'
                  break
                }
                if (functionLength % 6 === 0) {
                  deviceInfo['layoutClass'] = 'grid-layout-third'
                  break
                }
                if (functionLength % 2 === 0) {
                  deviceInfo['layoutClass'] = 'grid-layout-fourth'
                  break
                }
                deviceInfo['layoutClass'] = 'grid-layout-third'
              } while (false)
              this.setData({ configList, deviceInfo, quickDevJson })
            } while (false)
            resolve(res)
          })
          .catch((err) => {
            let res = err.data
            if (res) {
              if (res.result && res.result.returnData) {
                res = JSON.parse(res.result.returnData)
              }
              do {
                if (res.resCode == 50300 || res.code == 1001) {
                  // 无资源重定向
                  EC.redirectUnSupportDevice(this.properties.applianceData)
                  break
                }
                if (res.code != 0) {
                  let msg = EC.handleErrorMsg(res.code)
                  MideaToast(msg)
                  break
                }
                MideaToast('未知错误-配置')
              } while (false)
            }
            resolve()
          })
      })
    },
    // endregion

    // region 点击功能项
    onClickFunction(event) {
      do {
        let deviceInfo = this.data.deviceInfo
        if (!deviceInfo.isOnline) {
          MideaToast('设备已离线，请检查设备状态')
          break
        }
        if (deviceInfo.isRunning) {
          MideaToast('设备工作中，请稍后再试')
          break
        }
        if (!deviceInfo.enabledCap) {
          MideaToast('请先合盖再尝试启动')
          this.showNoticeBar('设备已开盖，请合盖后再启动功能。')
          break
        }
        let functionItem = event.currentTarget.dataset.item
        let selectedFunction = functionItem
        console.log('选中的功能项')
        console.log(selectedFunction)
        this.setData({ selectedFunction })
        this.functionConfigInit(selectedFunction)
        let hasOptions = false
        // 浓香模式
        if (selectedFunction.settingsData[EC.settingApiKey.aroma]) {
          hasOptions = true
        }
        // 口感
        if (selectedFunction.settingsData[EC.settingApiKey.taste]) {
          hasOptions = true
        }
        // 压力
        let pressureLevelConfig = selectedFunction.settingsData[EC.settingApiKey.pressureLevel]
        if (pressureLevelConfig && pressureLevelConfig.codeName !== 'onlyOption') {
          hasOptions = true
        }
        // 烹饪时间
        let setWorkTimeConfig = selectedFunction.settingsData[EC.settingApiKey.workTime]
        if (setWorkTimeConfig && setWorkTimeConfig.codeName !== 'onlyOption') {
          hasOptions = true
        }
        // 预约
        if (selectedFunction.settingsData[EC.settingApiKey.appointTime]) {
          hasOptions = true
        }
        if (hasOptions) {
          this.showSettingModal()
        } else {
          // 快速启动
          wx.showModal({
            title: '是否确认启动设备',
            confirmText: '启动',
            success: (res) => {
              if (res.confirm) {
                this.startWork()
              }
            },
          })
        }
      } while (false)
    },
    // endregion

    // region 启动功能
    onClickControl(controlParams) {
      return new Promise((resolve, reject) => {
        UI.showLoading()
        this.clearDeviceStatusInterval()
        this.requestControl({
          control: controlParams,
        })
          .then((res) => {
            UI.hideLoading()
            this.dataInit(res.data.data.status)
            this.deviceStatusInterval()
            resolve()
          })
          .catch((err) => {
            console.log(err)
            let res = err
            do {
              UI.hideLoading()
              if (res.data.code != 0) {
                let msg = EC.handleErrorMsg(res.data.code)
                MideaToast(msg)
                break
              }
              this.dataInit(res.data.data.status)
              this.deviceStatusInterval()
            } while (false)
          })
      })
    },
    // endregion

    // region 选择口感
    onClickTaste(event) {
      let functionItem = event.currentTarget.dataset.item
      let settingModal = this.data.settingModal
      settingModal.params.taste = functionItem.value
      this.setData({ settingModal })
    },
    // endregion

    // region 压力等级滑块参数改变
    sliderPressureLevelChange(event) {
      let model = event.detail
      let settingModal = this.data.settingModal
      settingModal.params.pressureLevel = model.currentValue
      this.setData({
        settingModal,
        sliderPressureLevel: parseComponentModel(model),
      })
    },
    // endregion

    // region 开始烹饪
    startWork() {
      do {
        let data = this.data
        let deviceInfo = data.deviceInfo
        let selectedFunction = data.selectedFunction
        let settingModal = data.settingModal
        let workStatus = data.workStatus
        let controlParams = {
          cmd_code: selectedFunction.code,
          work_status: '1',
          work_switch: EC.workSwitch.work,
        }
        let attributes = selectedFunction.settingsData['attributes']
        let { flag_cap_on } = deviceInfo
        let flagCapOn = Number(flag_cap_on)
        let workMode = Number(selectedFunction.code)
        if (workMode === 20017) {
          // 保温状态修改
          controlParams.work_status = workStatus[EC.workStatus.keepWarm]
        } else {
          // 合盖检测 - 保温不做限制
          if (attributes) {
            let isOpenCap = attributes.properties.isOpenCap
            if (isOpenCap) {
              // 要求开盖
              // flag_cap_on: 0盖子拿走、1盖子盖上
              if (flagCapOn === 1) {
                MideaToast('请拿走盖子后再启动功能')
                break
              }
            } else {
              // 要求合盖
              if (flagCapOn === 0) {
                MideaToast('请合盖后再启动功能')
                break
              }
            }
          } else {
            // 要求合盖
            if (flagCapOn === 0) {
              MideaToast('请合盖后再启动功能')
              break
            }
          }
        }
        // 浓香模式
        let switchAroma = parseComponentModel(data.switchAroma)
        if (switchAroma.selected) {
          controlParams.aroma = '1'
        }
        // 口感
        if (settingModal.params.taste) {
          controlParams.taste = settingModal.params.taste
        }
        // 压力等级
        let pressureLevelConfig = selectedFunction.settingsData[EC.settingApiKey.pressureLevel]
        if (pressureLevelConfig) {
          if (pressureLevelConfig.codeName !== 'onlyOption') {
            let sliderPressureLevel = parseComponentModel(data.sliderPressureLevel)
            controlParams.pressure = sliderPressureLevel.currentValue
          } else {
            controlParams.pressure = pressureLevelConfig.properties.value
          }
        }
        // 工作时间
        let setWorkTimeConfig = selectedFunction.settingsData[EC.settingApiKey.workTime]
        if (setWorkTimeConfig) {
          if (setWorkTimeConfig.codeName !== 'onlyOption') {
            let workTimeData = data.workTimeData
            let workTimeHours = workTimeData.hours[workTimeData.value[1]]
            let workTimeMinutes = workTimeData.minutes[workTimeData.value[2]]
            let workTimeSeconds = workTimeHours * 60 * 60 + workTimeMinutes * 60
            let workTimeResult = Format.formatSeconds(workTimeSeconds)
            controlParams.time_work_hr = workTimeResult.hours
            controlParams.time_work_min = workTimeResult.minutes
          } else {
            // controlParams.time_work_hr = setWorkTimeConfig.properties.value;
            controlParams.time_work_min = setWorkTimeConfig.properties.value
          }
        }
        // 保持压力时间(烹饪时间)
        let keepPressureTimeConfig = selectedFunction.settingsData[EC.settingApiKey.keepPressureTime]
        if (keepPressureTimeConfig) {
          let NonIHConfig = selectedFunction.settingsData[EC.settingApiKey.NonIH]
          let interval = 0
          do {
            if (NonIHConfig) {
              let NonIHValue = NonIHConfig.settings[0].properties.defaultValue
              if (!NonIHValue) {
                // IN压力锅需要调整10分钟
                interval = 10
              }
            }
            // 非IN压力锅需要调整15分钟
            interval = 15
          } while (false)
          if (keepPressureTimeConfig.codeName !== 'onlyOption') {
            let workTimeData = data.workTimeData
            let workTimeHours = workTimeData.hours[workTimeData.value[1]]
            let workTimeMinutes = workTimeData.minutes[workTimeData.value[2]]
            let workTimeSeconds = workTimeHours * 60 * 60 + (workTimeMinutes - interval) * 60
            let workTimeResult = Format.formatSeconds(workTimeSeconds)
            controlParams.time_pressurize_hr = workTimeResult.hours
            controlParams.time_pressurize_min = workTimeResult.minutes
          } else {
            // controlParams.time_work_hr = setWorkTimeConfig.properties.value;
            controlParams.time_pressurize_min = setWorkTimeConfig.properties.value - interval
          }
        }
        // 预约时间
        let appointTimeConfig = selectedFunction.settingsData[EC.settingApiKey.appointTime]
        if (appointTimeConfig) {
          let scheduleData = data.scheduleData
          let scheduleResult = Format.formatSeconds(scheduleData.result * 60)
          if (scheduleData.result) {
            controlParams.work_switch = EC.workSwitch.schedule
            controlParams.work_status = '2'
            controlParams.time_reserve_hr = scheduleResult.hours
            controlParams.time_reserve_min = scheduleResult.minutes
          }
        }
        this.closeSettingModal()
        this.onClickControl(controlParams)
      } while (false)
    },
    // endregion

    // region 停止工作
    stopWork() {
      let content = '美味仍未完成\r\n是否结束设备工作'
      let deviceInfo = this.data.deviceInfo
      let quickDevJson = this.data.quickDevJson
      if (quickDevJson.workStatusMap) {
        switch (deviceInfo.work_status) {
          case quickDevJson.workStatusMap.appoint.value:
            content = '是否结束当前预约'
            break
        }
      }
      wx.showModal({
        title: content,
        confirmText: '结束',
        success: (res) => {
          if (res.confirm) {
            let controlParams = {
              work_status: '0',
              work_switch: EC.workSwitch.cancel,
            }
            this.onClickControl(controlParams).then((res) => {
              MideaToast('设备已结束工作')
            })
          }
        },
      })
    },
    // endregion

    // region 参数设置对话框初始化
    functionConfigInit(selectedFunction) {
      let settingModal = this.data.settingModal
      // 口感
      let tasteConfig = selectedFunction.settingsData[EC.settingApiKey.taste]
      if (tasteConfig) {
        settingModal.params.taste = tasteConfig.properties.defaultValue
      }
      // 压力等级
      let sliderPressureLevel = parseComponentModel(this.data.sliderPressureLevel)
      if (selectedFunction.settingsData[EC.settingApiKey.pressureLevel]) {
        let pressureLevelProperties = selectedFunction.settingsData[EC.settingApiKey.pressureLevel].properties
        if (pressureLevelProperties.range && pressureLevelProperties.range.length > 0) {
          sliderPressureLevel.currentValue = settingModal.params.pressureLevel = Number(
            pressureLevelProperties.defaultValue
          )
          sliderPressureLevel.min = Number(pressureLevelProperties.range[0]?.min ?? 0)
          sliderPressureLevel.max = Number(pressureLevelProperties.range[0]?.max ?? 0)
          sliderPressureLevel.interval = Number(pressureLevelProperties.range[0]?.step ?? 0)
          let interval = (sliderPressureLevel.max - sliderPressureLevel.min) / 2
          let valueArr = []
          for (let i = 0; i < 3; i++) {
            valueArr.push({
              value: sliderPressureLevel.min + interval * i,
              label: sliderPressureLevel.min + interval * i + 'kPa',
            })
          }
          sliderPressureLevel.valueArray = valueArr
        }
      }
      sliderPressureLevel = parseComponentModel(sliderPressureLevel)
      // 工作时间
      let setWorkTimeConfig = selectedFunction.settingsData[EC.settingApiKey.workTime]
      let keepPressureTimeConfig = selectedFunction.settingsData[EC.settingApiKey.keepPressureTime]
      if (setWorkTimeConfig || keepPressureTimeConfig) {
        let workTimeConfig = setWorkTimeConfig || keepPressureTimeConfig
        this.workTimeDataInit({
          appointTime: workTimeConfig,
        })
        // 初始值设置
        wx.nextTick(() => {
          let defaultValueMin = Number(workTimeConfig.properties?.defaultValue ?? 0)
          let defaultValueTime = Format.formatSeconds(defaultValueMin * 60)
          let workTimeData = this.data.workTimeData
          let hoursIndex = workTimeData.hours.findIndex((item) => item === defaultValueTime.hours)
          let minutesIndex = workTimeData.minutes.findIndex((item) => item === defaultValueTime.minutes)
          if (hoursIndex === -1) {
            hoursIndex = 0
          }
          this.workTimePickerOnChange({
            detail: {
              value: [0, hoursIndex, minutesIndex, 0],
            },
          })
        })
      }
      this.setData({ sliderPressureLevel, settingModal })
    },
    // endregion

    // region 预约时间选择
    pickOnChange(e) {
      // 数据联动修改
      let val = e.detail.value
      if (val && val.length > 0) {
        let day = val[1]
        let hour = val[2]
        let min = val[3]
        let nowDate = this.data.nowDate
        let nowHour = nowDate.getHours()
        let nowMin = nowDate.getMinutes()
        let scheduleData = this.data.scheduleData
        let minHours = scheduleData.minHours
        let minMinutes = scheduleData.minMinutes
        let maxHours = scheduleData.maxHours
        let maxMinutes = scheduleData.maxMinutes
        let hours = []
        let minutes = []
        let startMin = nowMin + minMinutes
        // 监听天数
        if (day === 0) {
          if (startMin > 60) {
            // minHours++;
            startMin = nowMin + minMinutes - 60
          }
          // 选择了今天
          for (let i = nowHour + minHours; i < 24; i++) {
            hours.push(i)
          }
          // 设置分钟数据
          for (let i = startMin; i <= 60; i++) {
            if (i === 60) {
              if (startMin === 60) {
                minutes.push(0)
              }
            } else {
              minutes.push(i)
            }
          }
          if (hour !== 0) {
            minutes = []
            for (let i = 0; i < 60; i++) {
              minutes.push(i)
            }
          }
        } else {
          // 选择了明天
          if (nowHour - (maxHours % 24) >= 0) {
            for (let i = 0; i <= nowHour - (maxHours % 24); i++) {
              hours.push(i)
            }
          } else {
            for (let i = 0; i <= (maxHours % 24) - (24 - nowHour); i++) {
              hours.push(i)
            }
          }
          for (let i = 0; i < 60; i++) {
            minutes.push(i)
          }
          // 选择了小时
          if (hour === scheduleData.hours.length - 1) {
            minutes = []
            for (let i = 0; i <= nowMin - (maxMinutes % 60); i++) {
              minutes.push(i)
            }
          }
        }
        scheduleData.hours = hours
        scheduleData.minutes = minutes
        scheduleData.value = val
        this.setData({ scheduleData })
      }
    },
    // endregion

    // region 预约对话框参数设置
    scheduleDataInit({ appointTime, cookTime }) {
      let appointTimeData = appointTime.properties
      // let appointTimeDataMin = Number(appointTimeData.min)+Number(cookTime);
      let appointTimeDataMin = Number(appointTimeData.min)
      let appointTimeDataDefaultValue = appointTime.properties.defaultValue
      let scheduleData = this.data.scheduleData
      let hours = []
      let minutes = []
      let minHours = Math.floor(appointTimeDataMin / 60)
      let minMinutes = appointTimeDataMin % 60
      let maxHours = Math.floor(appointTimeData.max / 60)
      let maxMinutes = appointTimeData.max % 60
      let defaultHours = Math.floor(appointTimeDataDefaultValue / 60)
      let defaultMinutes = appointTimeDataDefaultValue % 60
      // 获取当前时间
      let nowDate = new Date()
      // 设置小时数据
      let nowHour = nowDate.getHours()
      let nowMin = nowDate.getMinutes()
      let startMin = nowMin + minMinutes
      if (nowHour + maxHours < 24) {
        // 预约时间不足明天
        scheduleData.day = ['今天']
      } else {
        scheduleData.day = ['今天', '明天']
      }
      if (startMin > 60) {
        minHours++
        startMin = nowMin + minMinutes - 60
      }
      let valueIndex = 0
      for (let i = nowHour + minHours; i < 24; i++) {
        if (i === nowHour + defaultHours) {
          scheduleData.value[2] = valueIndex
        }
        valueIndex++
        hours.push(i)
      }
      // 设置分钟数据
      valueIndex = 0
      for (let i = startMin; i <= 60; i++) {
        if (i === nowMin + defaultMinutes) {
          scheduleData.value[3] = valueIndex
        }
        valueIndex++
        if (i === 60) {
          minutes.push(0)
        } else {
          minutes.push(i)
        }
      }
      scheduleData.hours = hours
      scheduleData.minutes = minutes
      scheduleData.minHours = minHours
      scheduleData.minMinutes = minMinutes
      scheduleData.maxHours = maxHours
      scheduleData.maxMinutes = maxMinutes
      this.setData({ scheduleData, nowDate })
    },
    // endregion

    // region 浓香模式开关切换
    switchAromaChange(event) {
      let model = event.detail
      this.setData({
        switchAroma: parseComponentModel(model),
      })
    },
    // endregion

    // region 预约开关切换
    scheduleSwitchChange(event) {
      let model = event.detail
      let selectedFunction = this.data.selectedFunction
      let appointTime = selectedFunction.settingsData[EC.settingApiKey.appointTime]
      let cookTime = selectedFunction.expectedCookTime || 0
      if (!cookTime) {
        // 工作时间
        let setWorkTimeConfig = selectedFunction.settingsData[EC.settingApiKey.workTime]
        if (setWorkTimeConfig) {
          if (setWorkTimeConfig.codeName !== 'onlyOption') {
            cookTime = setWorkTimeConfig.properties.defaultValue
          } else {
            cookTime = setWorkTimeConfig.properties.value
          }
        }
        // 保持压力时间
        let keepPressureTimeConfig = selectedFunction.settingsData[EC.settingApiKey.keepPressureTime]
        if (keepPressureTimeConfig) {
          if (keepPressureTimeConfig.codeName !== 'onlyOption') {
            cookTime = keepPressureTimeConfig.properties.defaultValue
          } else {
            cookTime = keepPressureTimeConfig.properties.value
          }
        }
      }
      if (model.selected) {
        // 打开预约窗口
        this.scheduleDataInit({ appointTime, cookTime })
        this.confirmSchedule()
        // this.showScheduleModal();
      } else {
        this.cancelSchedule()
      }
      this.setData({
        switchSchedule: parseComponentModel(model),
      })
    },
    // endregion

    // region 显示预约时间对话框
    showScheduleModal() {
      let scheduleModal = this.data.scheduleModal
      scheduleModal.isShow = true
      this.setData({ scheduleModal })
    },
    closeScheduleModal() {
      let scheduleModal = this.data.scheduleModal
      scheduleModal.isShow = false
      this.setData({ scheduleModal })
    },
    // endregion

    // region 工作时间参数初始化
    workTimeDataInit({ appointTime }) {
      let appointTimeData = appointTime.properties
      let appointTimeDataMin = Number(appointTimeData.min)
      let workTimeData = this.data.workTimeData
      let hours = []
      let minutes = []
      let minHours = Math.floor(appointTimeDataMin / 60)
      let maxHours = Math.floor(appointTimeData.max / 60)
      let minMinutes = appointTimeDataMin % 60
      let maxMinutes = appointTimeData.max % 60
      // 设置小时数据
      for (let i = minHours; i <= maxHours; i++) {
        hours.push(i)
      }
      // 设置分钟数据
      let initEndMin = hours.length === 1 ? maxMinutes + 1 : 60
      for (let i = minMinutes; i < initEndMin; i++) {
        minutes.push(i)
      }
      workTimeData.minHours = minHours
      workTimeData.minMinutes = minMinutes
      workTimeData.maxHours = maxHours
      workTimeData.maxMinutes = maxMinutes
      workTimeData.hours = hours
      workTimeData.minutes = minutes
      this.setData({ workTimeData })
    },
    // endregion

    // region 烹饪时间选择
    workTimePickerOnChange(e) {
      // 数据联动修改
      let val = e.detail.value
      let hoursIndex = val[1]
      let workTimeData = this.data.workTimeData
      let minHours = workTimeData.minHours
      let minMinutes = workTimeData.minMinutes
      let maxHours = workTimeData.maxHours
      let maxMinutes = workTimeData.maxMinutes
      let minutes = []
      if (hoursIndex === 0) {
        // 筛选最小分钟
        let initEndMin = workTimeData.hours.length === 1 ? maxMinutes + 1 : 60
        for (let i = minMinutes; i < initEndMin; i++) {
          minutes.push(i)
        }
      } else if (hoursIndex === workTimeData.hours.length - 1) {
        // 筛选最大分钟
        for (let i = 0; i <= maxMinutes; i++) {
          minutes.push(i)
        }
      } else {
        let initEndMin = workTimeData.hours.length === 1 ? maxMinutes + 1 : 60
        for (let i = 0; i < initEndMin; i++) {
          minutes.push(i)
        }
      }
      workTimeData.value = val
      workTimeData.minutes = minutes
      let workTimeHours = workTimeData.hours[val[1]]
      let workTimeMinutes = workTimeData.minutes[val[2]]
      let workTimeSeconds = workTimeHours * 60 * 60 + workTimeMinutes * 60
      let workTimeResult = Format.formatSeconds(workTimeSeconds)
      workTimeData.result = workTimeResult
      this.setData({ workTimeData })
    },
    // endregion

    updateStatus() {
      return new Promise((resolve, reject) => {
        requestService
          .request('luaGet', {
            applianceCode: this.properties.applianceData.applianceCode,
            command: {},
            reqId: getStamp().toString(),
            stamp: getStamp(),
          })
          .then((res) => {
            do {
              console.log('获取设备状态')
              console.log(res)
              if (res.data.code != 0) {
                let msg = EC.handleErrorMsg(res.data.code)
                // MideaToast(msg);
                this.updateViewOnlineToggle(false)
                resolve(res)
                break
              }
              this.updateViewOnlineToggle(true)
              try {
                this.dataInit(res.data.data)
              } catch (e) {
                console.error(e)
              }
              resolve(res)
            } while (false)

            this.setData({
              _applianceData: {
                onlineStatus: 1,
                offlineFlag: false,
              },
            })

            wx.setStorage({
              key: 'offlineFlag',
              data: false,
            })
          })
          .catch((err) => {
            let res = err.data
            if (res) {
              if (res.result && res.result.returnData) {
                res = JSON.parse(res.result.returnData)
              }
              do {
                if (res.code != 0) {
                  if (res.code == 1307) {
                    break
                  }
                  // if(res.code==1306){
                  //   this.showNoticeBar('设备当前为无杯状态，请正确安装杯体后使用。');
                  //   break;
                  // }
                  let msg = EC.handleErrorMsg(res.code)
                  // MideaToast(msg);
                  this.updateViewOnlineToggle(false)
                  break
                }
                MideaToast('未知错误-状态')
              } while (false)
            }
            resolve()
            if (err && err.data && (err.data.code == 1307 || err.data.code == 40670)) {
              this.setData({
                _applianceData: {
                  onlineStatus: 0,
                  offlineFlag: true,
                },
              })
              wx.setStorage({
                key: 'offlineFlag',
                data: true,
              })
            }
          })
      })
    },
    getDestoried() {
      //执行当前页面前后插件的业务逻辑，主要用于一些清除工作
      try {
        let intervalKey = wx.getStorageSync('ECInterval' + this.properties.applianceData.applianceCode)
        if (intervalKey) {
          clearInterval(intervalKey)
        }
        if (deviceStatusTimer) {
          clearInterval(deviceStatusTimer)
        }
        // 数据初始化
        deviceStatusTimer = null
      } catch (e) {
        console.error(e)
      }
    },
    requestControl(command) {
      // wx.showNavigationBarLoading()
      // wx.showLoading({mask: true})
      // 埋点
      let params = {
        control_params: JSON.stringify(command),
      }
      this.rangersBurialPointClick('plugin_button_click', params)
      return requestService.request('luaControl', {
        applianceCode: this.properties.applianceData.applianceCode,
        command: command,
        reqId: getStamp().toString(),
        stamp: getStamp(),
      })
    },
    noop() {},
    // 埋点
    rangersBurialPointClick(eventName, param) {
      let deviceInfo = this.data.deviceInfo
      if (deviceInfo) {
        let paramBurial = {}
        let paramBase = {
          module: '插件',
          apptype_name: '电压力锅',
          deviceInfo: {
            widget_cate: deviceInfo.type,
            sn8: deviceInfo.sn8,
            a0: deviceInfo.modelNumber,
            iot_device_id: deviceInfo.applianceCode,
          },
        }
        paramBurial = Object.assign(paramBase, param)
        rangersBurialPoint(eventName, paramBurial)
      }
    },
    // endregion
  },

  attached() {
    const app = getApp()
    let deviceInfo = this.data.deviceInfo
    wx.nextTick(() => {
      Object.assign(deviceInfo, this.properties.applianceData)
      this.setData({
        uid: app.globalData.userData.uid,
        _applianceData: this.properties.applianceData,
        deviceInfo: deviceInfo,
      })
      let param = {}
      param['page_name'] = '首页'
      param['object'] = '进入插件页'
      this.rangersBurialPointClick('plugin_page_view', param)
      // this.updateDataAndUI(this.data._applianceDataStatus)
      this.getProductConfig().then(() => {
        this.updateStatus().then(() => {
          this.deviceStatusInterval()
          this.setData({
            isInit: true,
          })
          let windowHeight = wx.getSystemInfoSync().windowHeight
          // 获取功能区域高度
          wx.createSelectorQuery()
            .in(this)
            .select('.options-wrapper')
            .fields(
              {
                size: true,
              },
              (res) => {
                console.log(res)
                if (res) {
                  let limitRate = res.height / windowHeight
                  if (limitRate > 0.4) {
                    this.setData({
                      isBottomFixed: false,
                    })
                  } else {
                    this.setData({
                      isBottomFixed: true,
                    })
                  }
                }
              }
            )
            .exec()
        })
      })
    })
  },
})
