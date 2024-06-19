const app = getApp() //获取应用实例
const requestService = app.getGlobalConfig().requestService
const rangersBurialPoint = app.getGlobalConfig().rangersBurialPoint
import { getStamp } from 'm-utilsdk/index'
import { imageDomain } from '../assets/scripts/api'

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
  E7,
} from './js/E7.js'
import {
  getAppointTimeRange,
  getAppointWorkingText,
  getModeName,
  getWarmTimeText,
  mode2ID,
  targetID2Mode,
  workStatus2Int,
} from './js/E7'
import { pickerType } from './js/E7'
import { parseComponentModel } from '../assets/scripts/common'
import { DeviceData } from '../assets/scripts/device-data'
import MideaToast from '../component/midea-toast/toast'
import { Format } from '../assets/scripts/format'
import { UI } from '../assets/scripts/ui'
import { E7AiStepProfile } from './js/E7-ai-step-profile'
import { E7Profile } from './js/E7-profile'
import { commonApi } from '../assets/scripts/api'

let deviceStatusTimer = null
let isDeviceInterval = true
let showingSettingModalTimer = null
let isShowingSettingModal = false

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
    // region 2021.10.15 敖广骏
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
      isAiStep: false,
    },
    isBottomFixed: false,
    isInit: false,
    iconUrl: {
      arrow: {
        url1: imageDomain + '/0xE7/icon-arrow-r.png',
      },
      pause: {
        url1: imageDomain + '/0xE7/icon-pause.png',
      },
      continue: {
        url1: imageDomain + '/0xE7/icon-continue.png',
      },
      power: {
        url1: imageDomain + '/0xFB/icon-switch.png',
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
      type: 'error',
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
        power: '--',
        temperature: '--',
      },
    },
    workStatus: {},

    // region 定义控件
    sliderPower: parseComponentModel({
      min: 60,
      max: 120,
      interval: 1,
      currentValue: 70,
      valueArray: [
        {
          value: 60,
          label: '60w',
        },
        {
          value: 90,
          label: '90w',
        },
        {
          value: 120,
          label: '120w',
        },
      ],
      width: '110%',
      unit: 'w',
    }),
    sliderTemperature: parseComponentModel({
      min: 40,
      max: 200,
      interval: 1,
      currentValue: 70,
      valueArray: [
        {
          value: 40,
          label: '40℃',
        },
        {
          value: 120,
          label: '120℃',
        },
        {
          value: 200,
          label: '200℃',
        },
      ],
      width: '110%',
      unit: '℃',
    }),
    // switchSchedule: parseComponentModel({
    //     isActive: true,
    //     selected: false
    // }),
    // endregion
    // endregion

    // region 2021.10.15 之前代码
    scrollViewTop: 0,
    buttonSize: '110rpx',
    icons: {
      greyTriangle: 'assets/img/grey-triangle.png',
    },
    modelHidden: ['hengwenpengren', 'huoguo', 'baochao', 'baotang'],
    rowClass1: 'row-sb',
    rowClass2: 'row-sb',
    btnShowStatus: false,
    powerImg: {
      on: '/pages/T0xFC/assets/img/icon_switch_on01@3x.png',
      off: '/pages/T0xFC/assets/img/icon_switch_off01@3x.png',
    },
    modeImg: {
      hengwenpengren: {
        disabled: imageDomain + '/0xE7/hengwenpengren-1.png',
        on: imageDomain + '/0xE7/hengwenpengren-2.png',
        off: imageDomain + '/0xE7/hengwenpengren-1.png',
        appoint: imageDomain + '/0xE7/hengwenpengren-2.png',
      },
      huoguo: {
        disabled: imageDomain + '/0xE7/huoguo-1.png',
        on: imageDomain + '/0xE7/huoguo-2.png',
        off: imageDomain + '/0xE7/huoguo-1.png',
        appoint: imageDomain + '/0xE7/huoguo-2.png',
      },
      baochao: {
        disabled: imageDomain + '/0xE7/baochao-1.png',
        on: imageDomain + '/0xE7/baochao-2.png',
        off: imageDomain + '/0xE7/baochao-1.png',
        appoint: imageDomain + '/0xE7/baochao-2.png',
      },
      baotang: {
        disabled: imageDomain + '/0xE7/baotang-1.png',
        on: imageDomain + '/0xE7/baotang-2.png',
        off: imageDomain + '/0xE7/baotang-1.png',
        appoint: imageDomain + '/0xE7/baotang-2.png',
      },
    },
    circleImg: {
      yellow: imageDomain + '/0xE7/circle-yellow.png',
      red: imageDomain + '/0xE7/circle-red.png',
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
      function_no: '0',
      time_surplus_hr: '0',
      time_surplus_min: '0',
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
    hengwenpengren: {},
    huoguo: {},
    baochao: {},
    baotang: {},
    otherMenu: {},
    // ...
    showManualItems: false,
    showOfflineCard: false,
    offlineFlag: false,
    currentAppointData: {},
    otherMenuWorking: false,
    actionSheetShow: false,
    // 选择器
    multiArray: [[''], [''], ['']],
    multiIndex: [0, 0, 0],
    todayHours: [],
    tomorrowHours: [],
    todayFirstMinutes: [],
    tomorrowLastMinutes: [],
    normalMinutes: [],
    showDialog: false,
    pickerOpenHour: 0,
    pickerOpenMinute: 0,
    headerImg: imageDomain + '/0xE7/blender.png',

    currentPickerType: null,
    // endregion
  },
  methods: {
    // region 2021.10.15 敖广骏
    // region 跳转到美居下载页
    goToDownLoad() {
      wx.navigateTo({
        url: '/pages/download/download',
      })
    },
    // endregion
    // region 判断使用profile版本
    aiStep() {
      let rtn = false
      let deviceInfo = this.data.deviceInfo
      let is502S = deviceInfo.sn8 === '66001508'
      let isMC_CL22Q9_401 = deviceInfo.sn8 === '6600150J'
      let isMC_GCL2201 = deviceInfo.sn8 === '6600150F'
      let isMC_GCL2202 = deviceInfo.sn8 === '6600151F'
      if (is502S || isMC_CL22Q9_401 || isMC_GCL2201 || isMC_GCL2202) {
        rtn = true
      }
      deviceInfo.isAiStep = rtn
      this.setData({ deviceInfo })
      return rtn
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

    // region 数据初始化
    dataInit(newDeviceStatus) {
      let data = this.data
      let deviceInfo = data.deviceInfo
      let configList = data.configList
      let quickDevJson = data.quickDevJson
      let workStatus = data.workStatus
      console.log('数据初始化')
      console.log(newDeviceStatus)
      deviceInfo.temperature = ''
      if (newDeviceStatus) {
        Object.assign(deviceInfo, newDeviceStatus)
        deviceInfo.temperature = Number(deviceInfo.temperature)
        // 解析不同profile参数
        // 工作模式
        let menuIdParam = E7Profile.menuId
        // 已经工作时间
        let workTimeParam = E7Profile.workTime
        // 剩余时间
        let workTimeLeftParam = E7Profile.workTimeLeft
        if (this.aiStep()) {
          deviceInfo.work_status = E7AiStepProfile.STATUS_MAP[newDeviceStatus.work_status]
          workTimeParam = E7AiStepProfile.workTime
          workTimeLeftParam = E7AiStepProfile.workTimeLeft
          menuIdParam = E7AiStepProfile.menuId
        }
        // 工作状态
        let workStatusOptions = quickDevJson.properties[E7.settingApiKey.workStatue].options
        if (workStatusOptions && workStatusOptions.length > 0) {
          for (let i = 0; i < workStatusOptions.length; i++) {
            let workStatusOptionItem = workStatusOptions[i]
            workStatus[workStatusOptionItem.code] = workStatusOptionItem.value
            if (workStatusOptionItem.value == deviceInfo.work_status) {
              deviceInfo.workStatusName = workStatusOptionItem.desc || workStatusOptionItem.text
              if (deviceInfo.workStatusName.indexOf('设备') > -1) {
                deviceInfo.workStatusName = deviceInfo.workStatusName.replace('设备', '')
                // break;
              }
              // break;
            }
          }
        }
        // 已暂停
        if (deviceInfo.work_status === workStatus[E7.workStatus.pause]) {
          this.showNoticeBar({
            hasCloseBtn: false,
            content: '电磁炉已暂停，请点击“启动”键继续完成烹饪。',
            type: 'warn',
          })
        } else {
          this.closeNoticeBar()
        }
        do {
          // 判断设备运行状态
          if (deviceInfo.work_status != workStatus[E7.workStatus.standby]) {
            if (deviceInfo.work_status != workStatus[E7.workStatus.close]) {
              deviceInfo.isRunning = true
              break
            }
          }
          deviceInfo.isRunning = false
        } while (false)
        // 火力
        deviceInfo.powerMap = E7.powerMap[Number(deviceInfo.fire_level)]
        if (!deviceInfo.powerMap) {
          if (deviceInfo.fire_level !== '0') {
            deviceInfo.powerMap = {
              text: deviceInfo.fire_level + '档',
              value: deviceInfo.fire_level,
            }
          }
        }
        // 预计烹饪时间
        let setWorkTimeHours = Number(deviceInfo[workTimeParam.h]) + Number(deviceInfo[workTimeLeftParam.h])
        let setWorkTimeMinutes = Number(deviceInfo[workTimeParam.m]) + Number(deviceInfo[workTimeLeftParam.m])
        deviceInfo.setWorkTime = setWorkTimeHours * 60 + setWorkTimeMinutes
        if (this.aiStep()) {
          deviceInfo.setWorkTime = Math.floor(deviceInfo.set_work_time_sec / 60)
        }
        // 剩余时间
        let timeWorkHr = Number(deviceInfo[workTimeLeftParam.h] || 0)
        let timeWorkMin = Number(deviceInfo[workTimeLeftParam.m])
        let second = timeWorkHr * 60 * 60 + timeWorkMin * 60
        second = Number(second)
        if (this.aiStep()) {
          second = Number(deviceInfo.remain_work_time_sec)
        }
        let formatSecond = Format.formatSeconds(second)
        deviceInfo.currentTimeLabel = {
          hour: Format.getTime(formatSecond.hours),
          minute: Format.getTime(formatSecond.minutes),
          second: Format.getTime(formatSecond.seconds),
        }
        // 工作模式
        let workMode = deviceInfo[menuIdParam]
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
        }
      }
      this.setData({ deviceInfo, workStatus })
    },
    // endregion

    // region 参数设置对话框初始化
    functionConfigInit(selectedFunction) {
      let settingModal = this.data.settingModal
      let sliderPower = parseComponentModel(this.data.sliderPower)
      let sliderTemperature = parseComponentModel(this.data.sliderTemperature)
      // 火力
      let powerConfig = selectedFunction.settingsData[E7.settingApiKey.power]
      if (powerConfig) {
        // 火力映射表更新
        let E7PowerMap = [{ text: undefined, value: 0 }]
        if (powerConfig.properties.options && powerConfig.properties.options.length > 0) {
          powerConfig.properties.options.forEach((item) => {
            let newItem = { ...item }
            newItem.text += 'w'
            E7PowerMap.push(newItem)
          })
          E7.powerMap = E7PowerMap
        }
        let powerProperties = powerConfig.properties
        powerProperties.ifCanAdjust = this.showPower(powerConfig)
        sliderPower.currentValue = powerProperties.defaultValue
        let firsValueItem = {}
        let centerValueItem = {}
        let lastValueItem = {}
        if (powerProperties.range && powerProperties.range.length > 0) {
          sliderPower.min = Number(powerProperties.range[0]?.min ?? 0)
          sliderPower.max = Number(powerProperties.range[0]?.max ?? 2)
          let centerValue = Math.ceil((sliderPower.max - sliderPower.min) / 2 + sliderPower.min)
          sliderPower.interval = Number(powerProperties.range[0]?.step ?? 1)
          firsValueItem = {
            value: sliderPower.min,
            label: sliderPower.min + '档',
          }
          centerValueItem = {
            value: centerValue,
            label: centerValue + '档',
          }
          lastValueItem = {
            value: sliderPower.max,
            label: sliderPower.max + '档',
          }
          settingModal.params.power = sliderPower.currentValue + '档'
          // settingModal.params.power = E7.powerMap[Number(sliderPower.currentValue)];
        } else {
          let lastIndex = powerProperties.options.length - 1
          let centerIndex = Math.floor(lastIndex / 2)
          sliderPower.min = Number(powerProperties.options[0]?.value ?? 0)
          sliderPower.max = Number(powerProperties.options[lastIndex]?.value ?? 0)
          sliderPower.interval = 1
          for (let i = 0; i < powerProperties.options.length; i++) {
            let optionItem = powerProperties.options[i]
            if (optionItem.value === sliderPower.currentValue) {
              settingModal.params.power = optionItem.text + 'w'
              break
            }
          }
          firsValueItem = {
            value: powerProperties.options[0].value,
            label: powerProperties.options[0].text + 'w',
          }
          centerValueItem = {
            value: powerProperties.options[centerIndex].value,
            label: powerProperties.options[centerIndex].text + 'w',
          }
          lastValueItem = {
            value: powerProperties.options[lastIndex].value,
            label: powerProperties.options[lastIndex].text + 'w',
          }
        }
        let valueArr = [firsValueItem, centerValueItem, lastValueItem]
        sliderPower.valueArray = valueArr
      }
      // 温度
      let temperatureConfig = selectedFunction.settingsData[E7.settingApiKey.temperature]
      if (temperatureConfig) {
        let temperatureProperties = temperatureConfig.properties
        if (temperatureProperties.range && temperatureProperties.range.length > 0) {
          sliderTemperature.currentValue = settingModal.params.temperature = Number(temperatureProperties.defaultValue)
          sliderTemperature.min = Number(temperatureProperties.range[0]?.min ?? 0)
          sliderTemperature.max = Number(temperatureProperties.range[0]?.max ?? 0)
          sliderTemperature.interval = Number(temperatureProperties.range[0]?.step ?? 1)
          let interval = (sliderTemperature.max - sliderTemperature.min) / 2
          let valueArr = []
          for (let i = 0; i < 3; i++) {
            let itemValue = Math.floor(sliderTemperature.min + interval * i)
            valueArr.push({
              value: itemValue,
              label: itemValue + '℃',
            })
          }
          sliderTemperature.valueArray = valueArr
        }
      }
      // 工作时间
      let setWorkTimeConfig = selectedFunction.settingsData[E7.settingApiKey.workTime]
      if (setWorkTimeConfig) {
        this.workTimeDataInit({
          appointTime: setWorkTimeConfig,
        })
        // 初始值设置
        wx.nextTick(() => {
          let defaultValueMin = Number(setWorkTimeConfig.properties?.defaultValue ?? 0)
          let defaultValueTime = Format.formatSeconds(defaultValueMin * 60)
          if (defaultValueTime.minutes === 60) {
            defaultValueTime.hours += 1
            defaultValueTime.minutes = 0
          }
          let workTimeData = this.data.workTimeData
          let hoursIndex = workTimeData.hours.findIndex((item) => item === defaultValueTime.hours)
          let minutesIndex = workTimeData.minutes.findIndex((item) => item === defaultValueTime.minutes)
          if (hoursIndex === -1) {
            hoursIndex = 0
          }
          if (minutesIndex === -1) {
            minutesIndex = 0
          }
          this.workTimePickerOnChange({
            detail: {
              value: [0, hoursIndex, minutesIndex, 0],
            },
          })
        })
      }
      sliderPower = parseComponentModel(sliderPower)
      sliderTemperature = parseComponentModel(sliderTemperature)
      this.setData({ settingModal, sliderPower, sliderTemperature, selectedFunction })
    },
    // endregion

    // region 获取指定工作状态数值
    getWorkStatusCode(workStatus) {
      let quickDevJson = this.data.quickDevJson
      let workingStatus = '0'
      if (this.aiStep()) {
        workingStatus = E7AiStepProfile.STATUS_MAP[workStatus]
      } else {
        let workStatusOptions = quickDevJson.properties[E7.settingApiKey.workStatue].options
        console.log('配置项参数')
        console.log(workStatusOptions)
        console.log(workStatus)
        for (let i = 0; i < workStatusOptions.length; i++) {
          let workStatusOptionItem = workStatusOptions[i]
          if (workStatusOptionItem.code == workStatus) {
            console.log('选中参数')
            console.log(workStatusOptionItem)
            workingStatus = workStatusOptionItem.value
            break
          }
        }
      }
      return workingStatus
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
        let method = 'GET'
        let sendParams = {
          applianceId: deviceInfo.applianceCode,
          productTypeCode: deviceInfo.type,
          userId: data.uid,
          productModelNumber: deviceInfo.sn8 || productModelNumber,
          bigVer: DeviceData.bigVer,
        }
        if (this.aiStep()) {
          sendParams.bigVer = '6'
        }
        // 切换接口
        method = 'POST'
        sendParams = {
          serviceName: 'node-service',
          uri: '/productConfig' + Format.jsonToParam(sendParams),
          method: 'GET',
          contentType: 'application/json',
        }
        requestService
          .request(commonApi.sdaTransmit, sendParams, method)
          .then((res) => {
            console.log('获取产品配置')
            console.log(deviceInfo)
            console.log(res)
            // 设置页面功能
            let resData = null
            // if (isDebug) {
            //     res = res.data;
            //     resData = res.data;
            // } else {
            //     res = JSON.parse(res.data.result.returnData);
            //     resData = res.data;
            // }
            do {
              // if(res.resCode==50300||res.code==1001){
              //     // 无资源重定向
              //     E7.redirectUnSupportDevice(this.properties.applianceData);
              //     break;
              // }
              if (res.data.errorCode != 0) {
                let msg = E7.handleErrorMsg(res.code)
                MideaToast(msg)
                break
              }
              resData = JSON.parse(res.data.result.returnData)
              console.log(resData)

              let quickDevJson = E7.quickDevJson2Local(resData)
              console.log('解析后参数')
              console.log(quickDevJson)
              let configList = quickDevJson.functions
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
                  E7.redirectUnSupportDevice(this.properties.applianceData)
                  break
                }
                if (res.code != 0) {
                  let msg = E7.handleErrorMsg(res.code)
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

    // region 判断是否显示配置项
    showPower(setting) {
      let rtn = false
      if (
        setting.properties.ifCanAdjust === undefined ||
        setting.properties.ifCanAdjust === null ||
        setting.properties.ifCanAdjust === ''
      ) {
        rtn = true
      } else {
        rtn = setting.properties.ifCanAdjust
      }
      let deviceInfo = this.data.deviceInfo
      let isQH2133 = deviceInfo.sn8 === '000B0006'
      if (isQH2133) {
        rtn = false
      }
      return rtn
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
        let functionItem = event.currentTarget.dataset.item
        let selectedFunction = functionItem
        console.log('选中的功能项')
        console.log(selectedFunction)
        this.setData({ selectedFunction })
        this.functionConfigInit(selectedFunction)
        let hasOptions = false
        let isOnlyQuick = undefined
        // 火力
        let powerConfig = selectedFunction.settingsData[E7.settingApiKey.power]
        if (powerConfig && powerConfig.properties.ifCanAdjust !== false) {
          hasOptions = true
        }
        // 温度
        let temperatureConfig = selectedFunction.settingsData[E7.settingApiKey.temperature]
        if (temperatureConfig && temperatureConfig.properties.ifCanAdjust !== false) {
          hasOptions = true
        }
        // 烹饪时间
        if (selectedFunction.settingsData[E7.settingApiKey.workTime]) {
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
        // this.showSettingModal();
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
                let msg = E7.handleErrorMsg(res.data.code)
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

    // region 重置参数设置对话框
    settingModalInit() {
      let settingModal = this.data.settingModal
      settingModal = {
        isShow: false,
        params: {
          power: '--',
          temperature: '--',
        },
      }
      // 工作时间
      let workTimeData = {
        value: [0, 0, 0, 0],
        hours: [],
        minutes: [],
        result: undefined,
        resultLabel: undefined,
      }
      this.setData({ workTimeData, settingModal })
    },
    // endregion

    // region 显示参数设置对话框
    showSettingModal() {
      if (!isShowingSettingModal) {
        isShowingSettingModal = true
        let sliderPower = this.selectComponent('#sliderPower')
        let sliderTemperature = this.selectComponent('#sliderTemperature')
        let settingModal = this.data.settingModal
        settingModal.isShow = true
        this.setData({ settingModal })
        if (sliderPower || sliderTemperature) {
          setTimeout(() => {
            sliderPower?.getSliderWidth()
            sliderTemperature?.getSliderWidth()
          }, 500)
        }
        if (showingSettingModalTimer) {
          clearTimeout(showingSettingModalTimer)
        }
        showingSettingModalTimer = setTimeout(() => {
          isShowingSettingModal = false
        }, 1000)
      }
    },
    closeSettingModal() {
      if (!isShowingSettingModal) {
        let settingModal = this.data.settingModal
        settingModal.isShow = false
        this.setData({ settingModal })
        setTimeout(() => {
          this.settingModalInit()
        }, 300)
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
        noticeBar.type = options.type || 'error'
        this.setData({ noticeBar })
      } while (false)
    },
    closeNoticeBar() {
      let noticeBar = this.data.noticeBar
      noticeBar.isShow = false
      this.setData({ noticeBar })
    },
    // endregion

    // region 火力滑块参数改变
    sliderPowerChange(event) {
      let model = event.detail
      let settingModal = this.data.settingModal
      let powerConfig = this.data.selectedFunction.settingsData[E7.settingApiKey.power]
      let powerProperties = powerConfig.properties
      let targetValue = model.currentValue.toString()
      // if(this.aiStep()){
      //     settingModal.params.power = targetValue+'档';
      // } else {
      //     settingModal.params.power = powerProperties.options.find(item=>item.value===targetValue)?.text+'w'||'--';
      // }
      if (powerProperties.options && powerProperties.options.length > 0) {
        settingModal.params.power =
          powerProperties.options.find((item) => item.value === targetValue)?.text + 'w' || '--'
      } else {
        settingModal.params.power = targetValue + '档'
      }
      this.setData({
        settingModal,
        sliderPower: parseComponentModel(model),
      })
    },
    // endregion

    // region 温度滑块参数改变
    sliderTemperatureChange(event) {
      let model = event.detail
      let settingModal = this.data.settingModal
      settingModal.params.temperature = model.currentValue
      this.setData({
        settingModal,
        sliderTemperature: parseComponentModel(model),
      })
    },
    // endregion

    // region 开始烹饪
    startWork() {
      do {
        let data = this.data
        let deviceInfo = data.deviceInfo
        let workStatus = data.workStatus
        let quickDevJson = data.quickDevJson
        let selectedFunction = data.selectedFunction
        let sliderPower = parseComponentModel(data.sliderPower)
        let sliderTemperature = parseComponentModel(data.sliderTemperature)
        let controlParams = {}
        let menuId = E7Profile.menuId
        let curState = E7Profile.curState
        let workModeParam = E7Profile.workMode
        if (this.aiStep()) {
          menuId = E7AiStepProfile.menuId
          curState = E7AiStepProfile.curState
          workModeParam = E7AiStepProfile.workMode
          controlParams[E7AiStepProfile.workSwitch] = E7AiStepProfile.STRING_MAP['2']
        }
        controlParams[menuId] = selectedFunction.code
        let workingStatus = '1'
        let workStatusOptions = quickDevJson.properties[E7.settingApiKey.workStatue].options
        for (let i = 0; i < workStatusOptions.length; i++) {
          let workStatusOptionItem = workStatusOptions[i]
          if (workStatusOptionItem.code == workStatus[E7.workStatus.working]) {
            workingStatus = workStatusOptionItem.value
            break
          }
        }
        if (this.aiStep()) {
          workingStatus = E7AiStepProfile.STATUS_MAP.cooking
        }
        controlParams[curState] = workingStatus
        // 火力
        let powerConfig = selectedFunction.settingsData[E7.settingApiKey.power]
        if (powerConfig && powerConfig.properties.ifCanAdjust !== false) {
          let power = E7Profile.power
          if (this.aiStep()) {
            power = E7AiStepProfile.power
          }
          controlParams[power] = sliderPower.currentValue
          controlParams[workModeParam] = '1'
        }
        // 温度
        let temperatureConfig = selectedFunction.settingsData[E7.settingApiKey.temperature]
        if (temperatureConfig && temperatureConfig.properties.ifCanAdjust !== false) {
          let temperature = E7Profile.temperature
          if (this.aiStep()) {
            temperature = E7AiStepProfile.temperature
          }
          controlParams[temperature] = sliderTemperature.currentValue
          if (temperatureConfig.codeName === 'onlyOption') {
            controlParams[temperature] = temperatureConfig.properties.value
          }
          controlParams[workModeParam] = '2'
        }
        // 工作时间
        let setWorkTimeConfig = selectedFunction.settingsData[E7.settingApiKey.workTime]
        if (setWorkTimeConfig) {
          let workTimeData = data.workTimeData
          let workTimeHours = workTimeData.hours[workTimeData.value[1]]
          let workTimeMinutes = workTimeData.minutes[workTimeData.value[2]]
          let workTimeSeconds = workTimeHours * 60 * 60 + workTimeMinutes * 60
          let workTimeResult = Format.formatSeconds(workTimeSeconds)
          let setWorkTimeParam = E7Profile.setWorkTime
          if (this.aiStep()) {
            setWorkTimeParam = E7AiStepProfile.setWorkTime
            workTimeResult.minutes = workTimeResult.hours * 60 * 60 + workTimeResult.minutes * 60
          } else {
            controlParams[setWorkTimeParam.h] = workTimeResult.hours
          }
          controlParams[setWorkTimeParam.m] = workTimeResult.minutes
        }
        if (deviceInfo.work_status == workStatus[E7.workStatus.close]) {
          // 唤醒
          this.closeSettingModal()
          this.onClickControl(controlParams).then((res) => {
            this.onClickControl(controlParams)
          })
          break
        }
        this.closeSettingModal()
        this.onClickControl(controlParams)
        // console.log(controlParams);
      } while (false)
    },
    // endregion

    // region 停止工作
    stopWork() {
      let content = '美味仍未完成\r\n是否结束设备工作'
      let deviceInfo = this.data.deviceInfo
      let workStatus = this.data.workStatus
      // switch (workStatus){
      //     case E7.workStatus.appoint:
      //         content = '是否结束当前预约';
      //         break;
      // }
      wx.showModal({
        title: content,
        confirmText: '结束',
        success: (res) => {
          if (res.confirm) {
            let curState = E7Profile.curState
            if (this.aiStep()) {
              curState = E7AiStepProfile.curState
            }
            let controlParams = {}
            controlParams[curState] = workStatus[E7.workStatus.standby]
            if (this.aiStep()) {
              controlParams[E7AiStepProfile.workSwitch] = E7AiStepProfile.STRING_MAP['0']
            }
            this.onClickControl(controlParams).then((res) => {
              MideaToast('设备已结束工作')
            })
          }
        },
      })
    },
    // endregion

    // region 暂停与继续工作
    toggleWork() {
      let deviceInfo = this.data.deviceInfo
      let workStatus = this.data.workStatus
      let curStateParam = E7Profile.curState
      let menuIdParam = E7Profile.menuId
      let controlParam = {}
      let workIndex = 0
      let workStatusCode = ''
      if (deviceInfo.work_status == workStatus[E7.workStatus.working]) {
        // 工作中
        workStatusCode = workStatus[E7.workStatus.pause]
        if (this.aiStep()) {
          workIndex = '3'
        }
      } else {
        // 暂停中
        workStatusCode = workStatus[E7.workStatus.working]
        if (this.aiStep()) {
          workIndex = '2'
        }
      }
      if (this.aiStep()) {
        curStateParam = E7AiStepProfile.curState
        menuIdParam = E7AiStepProfile.menuId
        controlParam[E7AiStepProfile.workSwitch] = E7AiStepProfile.STRING_MAP[workIndex]
      }
      controlParam[curStateParam] = workStatusCode
      controlParam[menuIdParam] = deviceInfo[menuIdParam]
      // console.log(controlParam);
      this.onClickControl(controlParam)
    },
    continueWork() {},
    // endregion

    // region 工作时间参数初始化
    workTimeDataInit({ appointTime }) {
      let appointTimeData = appointTime.properties
      let appointTimeDataMin = Number(appointTimeData.min)
      let defaultValueMin = Number(appointTimeData?.defaultValue ?? 0)
      let defaultValueTime = Format.formatSeconds(defaultValueMin * 60)
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
      for (let i = minMinutes; i < 60; i++) {
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
        for (let i = minMinutes; i < 60; i++) {
          minutes.push(i)
        }
      } else if (hoursIndex === workTimeData.hours.length - 1) {
        // 筛选最大分钟
        for (let i = 0; i <= maxMinutes; i++) {
          minutes.push(i)
        }
      } else {
        for (let i = 0; i < 60; i++) {
          minutes.push(i)
        }
      }
      workTimeData.value = val
      workTimeData.minutes = minutes
      let workTimeHours = workTimeData.hours[val[1]]
      let workTimeMinutes = workTimeData.minutes[val[2]]
      let workTimeSeconds = workTimeHours * 60 * 60 + workTimeMinutes * 60
      let workTimeResult = Format.formatSeconds(workTimeSeconds)
      if (workTimeResult.minutes === 60) {
        workTimeResult.hours += 1
        workTimeResult.minutes = 0
      }
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
                let msg = E7.handleErrorMsg(res.data.code)
                MideaToast(msg)
                resolve(res)
                break
              }
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
                  let msg = E7.handleErrorMsg(res.code)
                  MideaToast(msg)
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
            // this.triggerEvent('modeChange', this.getCurrentMode());//向上层通知mode更改
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
        this.clearDeviceStatusInterval()
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
    // endregion

    // region 2021.10.15 之前代码
    refreshMinuteRange(pickeDate, value, newMinuteRange) {
      let curMinute = parseInt(pickeDate[1].replace('分', ''))
      let index = curMinute - newMinuteRange[0]
      if (index < 0) index = 0
      else if (index > newMinuteRange[1] - newMinuteRange[0]) index = newMinuteRange[1] - newMinuteRange[0]

      let obj = this.data.listData
      obj.minutes = []
      for (let j = newMinuteRange[0]; j <= newMinuteRange[1]; j++) {
        obj.minutes.push(j + '分')
      }

      obj.initValue = value
      obj.initValue[1] = index

      this.setData({
        listData: obj,
      })
    },
    // getActived() {
    //     try {
    //         let intervalKey = wx.getStorageSync('ECInterval' + this.properties.applianceData.applianceCode);
    //         if (intervalKey) {
    //             clearInterval(intervalKey);
    //         }
    //     } catch (e) {
    //         console.error(e)
    //     }
    //
    //     let checkStatus = setInterval(() => {
    //         this.updateStatus(false)
    //     }, 5000);
    //
    //     wx.setStorage({
    //         key: 'ECInterval' + this.properties.applianceData.applianceCode,
    //         data: checkStatus,
    //     })
    //     this.updateStatus();
    //     // this.triggerEvent('modeChange', this.getCurrentMode());//向上层通知mode更改
    //     console.log('f1 actived')
    // },

    processTouch(event) {},
    checkCup() {
      // 检查杯子类型
      let { cup_status, lid_status } = this.data._applianceDataStatus
      return cup_status == 'hot_cup' && lid_status == 'have_cup'
    },
    computePower() {
      //渲染电源按钮 中间那个圈和文字
      let { work_status, function_no, time_surplus_hr, time_surplus_min } = this.data._applianceDataStatus

      let code_id = function_no
      // work_status = workStatus2Int[work_status];
      let current_time = (parseInt(time_surplus_hr) * 60 + parseInt(time_surplus_min)).toString()

      // console.log('computePower ' + code_id + ' ' + work_status + ' ' + left_time_hour + ' ' + left_time_min + ' ' + current_time);

      let power = {},
        showText = true,
        circleSrc = '',
        showWorkingText = false,
        workingText = '',
        showWorkingStatus = false,
        workingStatus = '',
        finishTime = '',
        showFinishTime = false
      if (work_status == 0 || work_status == 5) {
        // 待机显示黄色圈
        power = {
          mainImg: this.data.powerImg.on,
          desc: '开机',
        }
        circleSrc = this.data.circleImg.yellow
        showText = true
        showWorkingText = false
        showWorkingStatus = false
        showFinishTime = false
        this.defaultIcon()
        // } else if (work_status == 2) {
        //     // 预约显示黄色圈
        //     power = {
        //         mainImg: this.data.powerImg.on,
        //         desc: '开机'
        //     }
        //     circleSrc = this.data.circleImg.red;
        //     showText = false;
        //     showWorkingText = true;
        //     // console.log('appoint ' + init_order_time_hour + ' ' + init_order_time_min)
        //     let date = new Date()
        //     let minutes = date.getHours() * 60 + parseInt(time_reserve_hr) * 60 + date.getMinutes() + parseInt(time_reserve_min);
        //     let newHour = Math.floor(minutes / 60);
        //     let tomorrow = newHour >= 24;
        //     let newMin = Math.floor(minutes - newHour * 60);
        //     if (newHour >= 24) newHour -= 24;
        //     workingText = `${tomorrow ? '明天' : '今天'}${newHour < 10 ? '0' + newHour : newHour}:${newMin < 10 ? '0' + newMin : newMin}完成`;
        //     workingStatus = getTextByStatus(work_status);
        //     showWorkingStatus = true;
        //     showFinishTime = false;
        //     finishTime = `约用时${parseInt(this.data._applianceDataStatus.time_work_setting_hr) * 60 + parseInt(this.data._applianceDataStatus.time_work_setting_min)}分钟`;
        //     this.iconToggle(getModelNameById(code_id))
        // } else if (work_status == 3) {
        //     power = {
        //         mainImg: this.data.powerImg.off,
        //         desc: '关机'
        //     }
        //     circleSrc = this.data.circleImg.red
        //     showText = false;
        //     showWorkingText = true;
        //     workingText = `${getWarmTimeText(time_warm_hr, time_warm_min)}`;
        //     workingStatus = getTextByStatus(work_status);
        //     showWorkingStatus = true;
        //     showFinishTime = false;
        //     this.iconToggle(getModelNameById(code_id))
      } else {
        power = {
          mainImg: this.data.powerImg.off,
          desc: '关机',
        }
        circleSrc = this.data.circleImg.red
        showText = false
        showWorkingText = true
        workingText = `${getWorkFinishTime(current_time)}完成`
        workingStatus = getTextByStatus(work_status)
        showWorkingStatus = true
        showFinishTime = true
        finishTime = `约用时${parseInt(time_surplus_hr) * 60 + parseInt(time_surplus_min)}分钟`
        this.iconToggle(getModelNameById(code_id))
      }
      this.setData({
        power,
        circleSrc,
        showText,
        showWorkingText,
        workingText,
        workingStatus,
        showWorkingStatus,
        showFinishTime,
        finishTime,
      })
    },
    computeMode() {
      //渲染自动、睡眠、手动按钮
      let { function_no, work_status } = this.data._applianceDataStatus
      let code_id = function_no

      let mode = {
        hengwenpengren: {},
        huoguo: {},
        baochao: {},
        baotang: {},
      }
      modeList.map((item) => {
        mode[item] = {
          desc: modeDesc[item],
          mainImg: '',
        }

        if (code_id == this.data.menuId[item]) {
          if (work_status == 0) {
            mode[item].mainImg = this.data.modeImg[item].off
          } else if (work_status == 2) {
            mode[item].mainImg = this.data.modeImg[item].appoint
          } else {
            mode[item].mainImg = this.data.modeImg[item].on
          }
        } else {
          mode[item].mainImg = this.data.modeImg[item].off
        }
      })
      this.setData({
        hengwenpengren: mode.hengwenpengren,
        huoguo: mode.huoguo,
        baochao: mode.baochao,
        baotang: mode.baotang,
      })
    },
    computeButtons() {
      this.computePower()
      this.computeMode()
    },
    computeStatus() {
      // 根据当前状态获取文字
      let { work_status } = this.data._applianceDataStatus
      let text = getTextByStatus(work_status)
      this.setData({
        text,
      })
    },
    _work() {
      this.work(this.data.currentMenuId)
    },
    work(menuId, isAppoint = false, appointTime = 0) {
      this.setData({
        actionSheetShow: false,
      })
      let params = {
        function_no: targetID2Mode[menuId],
        work_status: '1',
      }
      // 当传入预约时间时则为预约
      if (isAppoint) {
        if (appointTime <= 0) appointTime += 24 * 60
        params.time_reserve_hr = parseInt(appointTime / 60)
        params.time_reserve_min = appointTime % 60
        params.work_status = '2'
      }

      this.requestControl({
        control: { ...params },
      })
        .then((res) => {
          if (res.data.data.status.error_code !== 0 && res.data.data.status.work_status === '0') {
            wx.showToast({
              title: '启动失败，设备异常：' + res.data.data.status.error_code,
              icon: 'none',
              duration: 3000,
            })
          }
          wx.hideNavigationBarLoading()
          wx.hideLoading()
          this.updateDataAndUI(res.data.data.status)
        })
        .catch((err) => {
          this.controlTimeout(err)
          wx.hideNavigationBarLoading()
          wx.hideLoading()
        })
      return true
    },
    controlTimeout(err) {
      if (err && err.data && err.data.code == 1306) {
        wx.showToast({
          title: '设备未响应，请稍后尝试刷新',
          icon: 'none',
          duration: 3000,
        })
      }
    },
    cancelWork() {
      this.requestControl({
        control: {
          work_status: '0',
        },
      })
        .then((res) => {
          this.updateDataAndUI(res.data.data.status)
          wx.hideNavigationBarLoading()
          wx.hideLoading()
        })
        .catch((err) => {
          this.controlTimeout(err)
          wx.hideNavigationBarLoading()
          wx.hideLoading()
        })
    },
    quitWork() {
      //关闭工作状态
      let that = this
      wx.showModal({
        title: '提示',
        content: '是否结束工作',
        showCancel: true,
        success: (res) => {
          if (res.confirm) {
            that.cancelWork()
            // that.updateStatus();
            // that.setData({
            //     btnShowStatus:false,
            // })
          } else {
          }
        },
      })
    },
    defaultIcon() {
      this.setData({
        btnShowStatus: false,
        modelHidden: ['hengwenpengren', 'huoguo', 'baochao', 'baotang'],
        rowClass1: 'row-sb',
        rowClass2: 'row-sb',
        otherMenuWorking: false,
        otherMenu: {},
      })
    },
    iconToggle(id) {
      let tmp = ['hengwenpengren', 'huoguo', 'baochao', 'baotang']

      for (let i = 0; i < tmp.length; i++) {
        if (tmp[i].indexOf(id) == -1) {
          tmp[i] = ''
        }
      }

      console.log(tmp)

      this.setData({
        modelHidden: tmp,
        btnShowStatus: true,
        rowClass1: 'row-sb-1',
        rowClass2: 'row-sb-2',
      })

      if (id == undefined && this.data._applianceDataStatus.function_no != 0) {
        let mode_data = getModeName(this.data._applianceDataStatus.mode)
        // 其他菜单
        this.setData({
          otherMenuWorking: true,
          otherMenu: {
            mainImg: this.data.modeImg['hengwenpengren'].on, // 使用香甜饭的icon
            desc: mode_data,
          },
        })
      } else {
        this.setData({
          otherMenuWorking: false,
          otherMenu: {},
        })
      }
    },
    modeToggle(e) {
      //点击模式按钮
      // let that = this;
      // let {work_status} = this.data._applianceDataStatus;
      // // work_status = workStatus2Int[work_status];
      // if (work_status == 0) {
      //     this.setData({
      //         currentMenuId: e.target.id,
      //         // actionSheetShow: true
      //     })
      //     wx.showActionSheet({
      //         itemList: ['启动', '预约'],
      //         success(res) {
      //             console.log(res);
      //             if (res.tapIndex == 1) {
      //                 that.setData({
      //                     showDialog: true
      //                 });
      //             } else if (res.tapIndex == 0) {
      //                 // 启动
      //                 that.work(e.target.id);
      //                 // that.iconToggle(e.target.id);
      //             }
      //             // that.updateStatus();
      //         }
      //     })
      // }
      // else if (code_id == getMenuIdByKey(e.target.id)) {
      //   wx.showModal({
      //     title: '提示',
      //     content: '是否结束工作',
      //     success: () => {
      //       this.cancelWork();
      //       that.updateStatus();
      //     }
      //   })
      // } else {
      //   wx.showToast({
      //     title: '请先结束当前工作',
      //     icon: 'none'
      //   })
      // }
      let name = e.target.id
      if (name == 'hengwenpengren') {
        this.initPickerHengWenPengRen()
      } else if (name == 'huoguo') {
        this.initPickerHuoGuo()
      } else if (name == 'baochao') {
        this.initPickerBaoChao()
      } else if (name == 'baotang') {
        this.initPickerBaoTang()
      }
    },
    initPickerHengWenPengRen() {
      let obj = {}
      obj.empty = ['']
      obj.hours = []
      for (let i = 42; i <= 220; i++) {
        obj.hours.push(i)
      }
      obj.finish = ['°C']

      obj.initValue = [0, 0, 0]

      this.setData({
        currentPickerType: pickerType.hengwenpengren,
        multiArray: [obj.empty, obj.hours, obj.finish],
        multiIndex: [0, 0, 0],
      })
    },
    initPickerHuoGuo() {
      let obj = {}
      obj.empty = ['']
      obj.hours = []
      for (let i = 1; i <= 180; i++) {
        obj.hours.push(i)
      }
      obj.finish = ['分钟后结束']

      this.setData({
        currentPickerType: pickerType.huoguo,
        multiArray: [obj.empty, obj.hours, obj.finish],
        multiIndex: [0, 119, 0],
      })
    },
    initPickerBaoChao() {
      let obj = {}
      obj.empty = ['']
      obj.hours = []
      for (let i = 1; i <= 180; i++) {
        obj.hours.push(i)
      }
      obj.finish = ['分钟后结束']

      this.setData({
        currentPickerType: pickerType.baochao,
        multiArray: [obj.empty, obj.hours, obj.finish],
        multiIndex: [0, 59, 0],
      })
    },
    initPickerBaoTang() {
      let obj = {}
      obj.empty = ['']
      obj.hours = []
      obj.hours.push(120)
      obj.finish = ['分钟后结束']

      this.setData({
        currentPickerType: pickerType.baotang,
        multiArray: [obj.empty, obj.hours, obj.finish],
        multiIndex: [0, 0, 0],
      })
    },
    isModeChange(oldVal, newVal) {
      return oldVal.work_status != newVal.work_status ? true : false
    },
    calAppointTime(detail) {
      let date = new Date()
      let rHour = detail[0].replace(/[^0-9]/gi, '')
      let rMinute = parseInt(detail[1].slice(0, -1))

      let appointTime = rHour * 60 + rMinute - date.getHours() * 60 - date.getMinutes()
      return appointTime
    },
    closeActionSheet() {
      this.setData({
        actionSheetShow: false,
      })
    },
    _sure(e) {
      let { detail } = e
      let params = undefined

      if (this.data.currentPickerType === pickerType.hengwenpengren) {
        let temperature = parseInt(this.data.multiArray[1][detail.value[1]])
        params = {
          work_mode: '2',
          function_no: '21',
          work_status: '1',
          temperature: temperature.toString(),
        }
      } else if (this.data.currentPickerType === pickerType.huoguo) {
        let minute = parseInt(this.data.multiArray[1][detail.value[1]])
        params = {
          function_no: '14',
          work_status: '1',
          definite_time_hr: Math.floor(minute / 60).toString(),
          definite_time_min: Math.floor(minute % 60).toString(),
        }
      } else if (this.data.currentPickerType === pickerType.baochao) {
        let minute = parseInt(this.data.multiArray[1][detail.value[1]])
        params = {
          function_no: '13',
          work_status: '1',
          definite_time_hr: Math.floor(minute / 60).toString(),
          definite_time_min: Math.floor(minute % 60).toString(),
        }
      } else if (this.data.currentPickerType === pickerType.baotang) {
        let minute = parseInt(this.data.multiArray[1][detail.value[1]])
        params = {
          function_no: '2',
          work_status: '1',
          definite_time_hr: Math.floor(minute / 60).toString(),
          definite_time_min: Math.floor(minute % 60).toString(),
        }
      }

      if (params) {
        this.requestControl({
          control: { ...params },
        })
          .then((res) => {
            if (res.data.data.status.error_code !== 0 && res.data.data.status.work_status === '0') {
              wx.showToast({
                title: '启动失败，设备异常：' + res.data.data.status.error_code,
                icon: 'none',
                duration: 3000,
              })
            }
            wx.hideNavigationBarLoading()
            wx.hideLoading()

            this._close()
            this.updateDataAndUI(res.data.data.status)
          })
          .catch((err) => {
            this.controlTimeout(err)
            wx.hideNavigationBarLoading()
            wx.hideLoading()

            this._close()
          })
      }
    },
    _close(e) {
      this.setData({
        currentPickerType: null,
        multiIndex: [0, 0, 0],
        multiArray: [[''], [''], ['']],
      })
    },
    updateDataAndUI(newStatus) {
      if (newStatus.work_status == '5') newStatus.work_status = '0'
      // console.log('updateDataAndUI ' + this.data._applianceDataStatus.work_status + ' ' + newStatus.work_status);
      if (
        this.data._applianceDataStatus.work_status !== newStatus.work_status &&
        newStatus.work_status === '0' &&
        this.data._applianceDataStatus.work_status !== undefined
      ) {
        wx.showToast({
          title: '设备已停止工作',
          icon: 'none',
          duration: 3000,
        })
      }
      this.setData({
        _applianceDataStatus: newStatus,
      })
      this.computeButtons()
      this.computeStatus()
    },
    noop() {},
    // 埋点
    rangersBurialPointClick(eventName, param) {
      let deviceInfo = this.data.deviceInfo
      if (deviceInfo) {
        let paramBurial = {}
        let paramBase = {
          module: '插件',
          apptype_name: '电磁炉',
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
