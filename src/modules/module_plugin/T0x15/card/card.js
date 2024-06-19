const app = getApp()

const rangersBurialPoint = app.getGlobalConfig().rangersBurialPoint
const requestService = app.getGlobalConfig().requestService
import { getStamp } from 'm-utilsdk/index'

import { EB } from './js/EB.js'
import { DeviceData } from '../assets/scripts/device-data'
import MideaToast from '../component/midea-toast/toast'
import { Format } from '../assets/scripts/format'
import { imageDomain, commonApi } from '../assets/scripts/api'
import { parseComponentModel } from '../assets/scripts/common'
import { UI } from '../assets/scripts/ui'
import { PluginConfig } from './js/15'

let deviceStatusTimer = null
let isDeviceInterval = true
let showingSettingModalTimer = null
let isShowingSettingModal = false
const THEME_COLOR = '#FFAA10'

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
    // region 2021.12.01 ao
    bgImage: {
      off: imageDomain + '/0xFB/bg.png',
      on: imageDomain + '/0xFB/bg-running.png',
      work: imageDomain + '/0xFB/bg-running-move.png',
    },
    configList: [],
    quickDevJson: undefined,
    deviceInfo: {
      isOnline: false,
      isRunning: false,
      isAiStep: false,
      workStatus: {},
      workStatusMap: {},
      bgImage: imageDomain + '/0xFB/bg.png',
    },
    pageProductConfig: {
      warmTime: {
        isShow: false,
        hasConfig: false,
      },
      warmTemp: {
        isShow: false,
        hasConfig: false,
        isHideSilder: false,
      },
      appoint: {
        isShow: false,
        hasConfig: false,
      },
    },
    isBottomFixed: false,
    isInit: false,
    isKettle: false,
    selectedFunction: {},
    settingModal: {
      isShow: false,
      params: {
        keepWarm: {
          value: true,
        },
        warmTime: {
          value: undefined,
          label: undefined,
        },
        warmTemp: {
          value: undefined,
          label: undefined,
        },
        appoint: {
          value: undefined,
          label: undefined,
        },
      },
    },
    scheduleData: {
      value: [0, 0, 0, 0, 0],
      day: [],
      hours: [],
      minutes: [],
      result: undefined,
      resultLabel: undefined,
    },
    scheduleModal: {
      isShow: false,
    },
    warmTimeData: {
      isShow: false,
      value: [0, 0, 0, 0],
      hours: [],
      minutes: [],
      result: undefined,
      resultLabel: undefined,
    },
    switchKeepWarm: parseComponentModel({
      color: THEME_COLOR,
      selected: true,
    }),
    switchSchedule: parseComponentModel({
      color: THEME_COLOR,
      selected: false,
    }),
    sliderWarmTemp: parseComponentModel({
      min: 60,
      max: 120,
      interval: 5,
      currentValue: 70,
      valueArray: [
        {
          value: 60,
          label: '60℃',
        },
        {
          value: 90,
          label: '90℃',
        },
        {
          value: 120,
          label: '120℃',
        },
      ],
      width: '150%',
      unit: '℃',
    }),
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
      clock: imageDomain + '/0xF1/icon-yuyue.png',
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
    // endregion
    // region 2021.12.01 之前代码
    _applianceData: {
      name: '',
      roomName: '',
      onlineStatus: 0,
    },
    _applianceDataStatus: {
      work_status: undefined,
      function_no: '0',
      time_surplus_hr: '0',
      time_surplus_min: '0',
    },
    // endregion
  },
  methods: {
    // region 2021.12.01 - ao
    // region 跳转到美居下载页
    // goToDownLoad() {
    //   wx.navigateTo({
    //     url: '/pages/download/download',
    //   })
    // },
    // endregion
    // 是否x2型号
    isX2() {
      let deviceInfo = this.data.deviceInfo
      let sn8 = deviceInfo.sn8
      return sn8 === '65200001'
    },
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
            resData = res.data.result.returnData
            if (resData === null || resData.code === 1004) {
              // 无资源重定向(判断为电热水壶)
              res.isKettle = true
            } else if (res.data.errorCode != 0) {
              let msg = PluginConfig.handleErrorMsg(res.code)
              MideaToast(msg)
            } else {
              let quickDevJson = PluginConfig.quickDevJson2Local(JSON.parse(resData))
              console.log('解析后参数')
              console.log(quickDevJson)
              let configList = quickDevJson.functions
              let functionLength = configList.length
              let properties = quickDevJson.properties
              if (properties.workStatus) {
                if (properties.workStatus.options && properties.workStatus.options.length > 0) {
                  properties.workStatus.options.forEach((optionItem) => {
                    deviceInfo.workStatus[optionItem.code] = optionItem.value
                  })
                }
              }
              do {
                if (functionLength === 7) {
                  deviceInfo['layoutClass'] = 'grid-layout-fourth'
                  break
                }
                if (functionLength === 2) {
                  deviceInfo['layoutClass'] = 'grid-layout-double'
                  break
                }
                if (functionLength === 1) {
                  deviceInfo['layoutClass'] = ''
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
            }
            resolve(res)
          })
          .catch((err) => {
            console.error('获取产品配置: ', err)
            let res = err.data
            if (res) {
              if (res.result && res.result.returnData) {
                res = JSON.parse(res.result.returnData)
              }
              if (res.resCode == 50300 || res.code == 1001) {
                // 无资源重定向(判断为电热水壶)
                res.isKettle = true
              } else if (res.code != 0) {
                let msg = PluginConfig.handleErrorMsg(res.code)
                MideaToast(msg)
              } else {
                MideaToast('未知错误-配置')
              }
            }
            resolve(res)
          })
      })
    },
    // endregion
    // region 数据初始化
    dataInit(newDeviceStatus) {
      let data = this.data
      let deviceInfo = data.deviceInfo
      let quickDevJson = data.quickDevJson
      console.log('数据初始化')
      console.log(newDeviceStatus)
      if (newDeviceStatus) {
        deviceInfo.isOnline = true
        Object.assign(deviceInfo, newDeviceStatus)
        // 判断工作状态
        switch (newDeviceStatus.work_status) {
          case deviceInfo.workStatus[PluginConfig.workStatusCode.standby]:
            // 待机
            deviceInfo.isRunning = true
            deviceInfo.isWorking = false
            deviceInfo.bgImage = this.data.bgImage.on
            break
          case deviceInfo.workStatus[PluginConfig.workStatusCode.working]:
          case deviceInfo.workStatus[PluginConfig.workStatusCode.appoint]:
          case deviceInfo.workStatus[PluginConfig.workStatusCode.keepWarm]:
            // 工作、预约、保温
            deviceInfo.isRunning = true
            deviceInfo.isWorking = true
            deviceInfo.bgImage = this.data.bgImage.work
            break
          default:
            deviceInfo.isRunning = false
            deviceInfo.isWorking = false
            deviceInfo.bgImage = this.data.bgImage.off
            break
        }
        // 工作功能
        let workFunction = quickDevJson.functions
        let currentFunction = {}
        deviceInfo.currentFunction = currentFunction
        if (newDeviceStatus.work_mode !== '0') {
          if (workFunction && workFunction.length > 0) {
            for (let j = 0; j < workFunction.length; j++) {
              let functionItem = workFunction[j]
              if (functionItem.code == newDeviceStatus.work_mode) {
                currentFunction = functionItem
                deviceInfo.currentFunction = currentFunction
                break
              }
            }
          }
        }
        // 工作状态名称赋值
        let workStatusOptions = quickDevJson.properties[PluginConfig.apiKey.workStatue]?.options
        if (workStatusOptions && workStatusOptions.length > 0) {
          for (let i = 0; i < workStatusOptions.length; i++) {
            let workStatusOptionItem = workStatusOptions[i]
            if (workStatusOptionItem.value === deviceInfo.work_status) {
              deviceInfo.workStatusName = workStatusOptionItem.desc || workStatusOptionItem.text
              if (deviceInfo.workStatusName === '烹饪中') {
                deviceInfo.workStatusName = '工作中'
              }
              if (deviceInfo.workStatusName.indexOf('设备') > -1) {
                deviceInfo.workStatusName = deviceInfo.workStatusName.replace('设备', '')
              }
            }
          }
        }
        // 保温时间
        let setKeepWarmTimeSec = Number(newDeviceStatus.set_keep_warm_time_sec)
        if (setKeepWarmTimeSec > 0) {
          let keepWarmTime = Math.ceil(setKeepWarmTimeSec / 60)
          deviceInfo.keepWarmTimeLabel = keepWarmTime + '分钟'
          if (keepWarmTime >= 60) {
            deviceInfo.keepWarmTimeLabel = Math.ceil(keepWarmTime / 60) + '小时'
          }
        }
        // 剩余工作时间
        let remainWorkTimeSec = Number(newDeviceStatus.remain_work_time_sec)
        deviceInfo.remainWorkTime = Format.formatSeconds(remainWorkTimeSec)
        deviceInfo.remainWorkTimeLabel = {
          hours: Format.getTime(deviceInfo.remainWorkTime.hours),
          minutes: Format.getTime(deviceInfo.remainWorkTime.minutes),
          seconds: Format.getTime(deviceInfo.remainWorkTime.seconds),
        }
        // 预约时间
        let setAppointTimeSec = Number(newDeviceStatus.remain_appoint_time_sec)
        let nowDate = new Date()
        let today = nowDate.getDate()
        let nowDateStamp = nowDate.getTime()
        let targetDateStamp = nowDateStamp + setAppointTimeSec * 1000
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
      }
      console.log(deviceInfo)
      this.setData({ deviceInfo })
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

    // region 开始烹饪
    startWork() {
      let data = this.data
      let deviceInfo = data.deviceInfo
      let selectedFunction = data.selectedFunction
      let pageProductConfig = data.pageProductConfig
      let settingModal = data.settingModal
      let warmTimeData = data.warmTimeData
      let scheduleData = data.scheduleData
      let sliderWarmTemp = parseComponentModel(data.sliderWarmTemp)
      let controlParams = {
        work_mode: selectedFunction.code,
        work_switch: PluginConfig.workSwitch.work,
      }
      // 保温
      if (settingModal.params.keepWarm.value) {
        // 保温温度
        if (pageProductConfig.warmTime.isShow) {
          controlParams['set_keep_warm_time_sec'] = warmTimeData.result * 60
        }
        // 保温时间
        if (pageProductConfig.warmTemp.isShow) {
          controlParams['warm_target_temp'] = sliderWarmTemp.currentValue
        }
      }
      // 预约
      if (settingModal.params.appoint.value && pageProductConfig.appoint.isShow) {
        controlParams['work_switch'] = PluginConfig.workSwitch.schedule
        controlParams['set_appoint_time_sec'] = scheduleData.result * 60
      }
      console.log('开始烹饪')
      console.log(controlParams)
      console.log(deviceInfo)
      this.closeSettingModal()
      this.onClickControl(controlParams)
    },
    // endregion

    // 控制设备状态
    onClickControlStatus(event) {
      let index = event.currentTarget.dataset.index
      let deviceInfo = this.data.deviceInfo
      if (!index) {
        console.warn(index)
        return
      }
      let controlParams = {}
      switch (index) {
        case 'power':
          controlParams['work_switch'] = deviceInfo.isRunning
            ? PluginConfig.workSwitch.close
            : PluginConfig.workSwitch.cancel
          this.onClickControl(controlParams)
          break
        case 'stop':
          controlParams['work_switch'] = PluginConfig.workSwitch.cancel
          wx.showModal({
            title: '是否结束设备工作',
            content: '',
            success: (res) => {
              if (res.confirm) {
                this.onClickControl(controlParams)
              }
            },
          })
          break
      }
    },

    // region 启动功能
    onClickControl(controlParams) {
      return new Promise((resolve, reject) => {
        UI.showLoading()
        this.clearDeviceStatusInterval()
        this.requestControl({
          control: controlParams,
        })
          .then((res) => {
            // 回到顶部
            wx.pageScrollTo({
              scrollTop: 0,
              duration: 300,
            })
            UI.hideLoading()
            this.dataInit(res.data.data.status)
            this.deviceStatusInterval()
            resolve()
          })
          .catch((err) => {
            console.log(err)
            let res = err
            UI.hideLoading()
            if (res.data.code != 0) {
              let msg = PluginConfig.handleErrorMsg(res.data.code)
              MideaToast(msg)
              return
            }
            this.dataInit(res.data.data.status)
            this.deviceStatusInterval()
          })
      })
    },
    // endregion

    // region 点击功能项
    onClickFunction(event) {
      let functionItem = event.currentTarget.dataset.item
      let selectedFunction = functionItem
      console.log('选中的功能项')
      console.log(selectedFunction)
      let deviceInfo = this.data.deviceInfo
      if (!deviceInfo.isOnline) {
        MideaToast('设备已离线，请检查设备状态')
        return
      } else if (!deviceInfo.isRunning) {
        MideaToast('设备未开机')
        return
      } else if (deviceInfo.isWorking) {
        MideaToast('设备工作中，请稍后再试')
        return
      }
      this.setData({ selectedFunction })
      this.functionConfigInit(selectedFunction)
      let hasOptions = true
      // 预约
      if (selectedFunction.settingsData[EB.apiKey.appointTime]) {
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
    },
    // endregion
    initPageProductConfig() {
      let pageProductConfig = this.data.pageProductConfig
      pageProductConfig = {
        warmTime: {
          isShow: false,
          hasConfig: false,
        },
        warmTemp: {
          isShow: false,
          hasConfig: false,
          isHideSilder: false,
        },
        appoint: {
          isShow: false,
          hasConfig: false,
        },
      }
      this.setData({ pageProductConfig })
    },
    // 所选功能参数初始化
    functionConfigInit(selectedFunction) {
      this.initPageProductConfig()
      if (selectedFunction.settings && selectedFunction.settings.length > 0) {
        let pageProductConfig = this.data.pageProductConfig
        let settingModal = this.data.settingModal
        let switchKeepWarm = parseComponentModel(this.data.switchKeepWarm)
        selectedFunction.settings.forEach((settingItem) => {
          let properties = settingItem.properties
          if (Number(selectedFunction.code) === 28) {
            pageProductConfig.warmTime.isSwitchShow = false
          } else {
            pageProductConfig.warmTime.isSwitchShow = true
          }
          settingModal.params.keepWarm.value = switchKeepWarm.selected = true
          switch (settingItem.apiKey) {
            case PluginConfig.apiKey.warmTime:
              // 保温时长
              this.warmTimeDataInit(properties)
              pageProductConfig.warmTime.hasConfig = true
              pageProductConfig.warmTime.isShow = true
              break
            case PluginConfig.apiKey.warmTemp:
              // 保温温度
              this.sliderWarmTempInit(properties)
              if (Number(properties.range[0].min) === Number(properties.range[0].max)) {
                pageProductConfig.warmTemp.isHideSilder = true
              } else {
                pageProductConfig.warmTemp.isHideSilder = false
              }
              pageProductConfig.warmTemp.isShow = true
              pageProductConfig.warmTemp.hasConfig = true
              break
            case PluginConfig.apiKey.appointTime:
              // 预约
              pageProductConfig.appoint.hasConfig = true
              pageProductConfig.appoint.isShow = true
              this.scheduleDataInit(properties)
              break
          }
        })
        switchKeepWarm = parseComponentModel(switchKeepWarm)
        this.setData({ settingModal, pageProductConfig, switchKeepWarm })
      }
    },

    // 保温温度滑块初始化
    sliderWarmTempInit(properties) {
      let settingModal = this.data.settingModal
      let sliderWarmTemp = parseComponentModel(this.data.sliderWarmTemp)
      settingModal.params.warmTemp.value = sliderWarmTemp.currentValue = Number(properties.defaultValue)
      sliderWarmTemp.min = Number(properties.range[0].min)
      if (sliderWarmTemp.currentValue < sliderWarmTemp.min) {
        settingModal.params.warmTemp.value = sliderWarmTemp.currentValue = sliderWarmTemp.min
      }
      sliderWarmTemp.max = Number(properties.range[0].max)
      sliderWarmTemp.interval = Number(properties.range[0].step)
      sliderWarmTemp.unit = properties.unit
      sliderWarmTemp.valueArray = [
        {
          value: sliderWarmTemp.min,
          label: sliderWarmTemp.min + sliderWarmTemp.unit,
        },
        {
          value: sliderWarmTemp.max,
          label: sliderWarmTemp.max + sliderWarmTemp.unit,
        },
      ]
      settingModal.params.warmTemp.label = sliderWarmTemp.currentValue + sliderWarmTemp.unit
      sliderWarmTemp = parseComponentModel(sliderWarmTemp)
      this.setData({ settingModal, sliderWarmTemp })
    },

    // 保温温度滑块改变
    sliderWarmTempOnMove(event) {
      let model = event.detail
      let settingModal = this.data.settingModal
      settingModal.params.warmTemp.label = model.currentValue + model.unit
      this.setData({ settingModal })
    },
    sliderWarmTempChange(event) {
      let model = event.detail
      let settingModal = this.data.settingModal
      settingModal.params.warmTemp.value = model.currentValue
      settingModal.params.warmTemp.label = model.currentValue + model.unit
      this.setData({
        settingModal,
        sliderWarmTemp: parseComponentModel(model),
      })
    },

    // 开关切换
    switchKeepWarmChange(event) {
      let model = event.detail
      let settingModal = this.data.settingModal
      settingModal.params.keepWarm.value = model.selected
      this.setData({
        settingModal,
        switchKeepWarm: parseComponentModel(model),
      })
    },
    // 预约开关切换
    switchScheduleChange(event) {
      let model = event.detail
      let scheduleData = this.data.scheduleData
      let selectedFunction = this.data.selectedFunction
      let properties = selectedFunction.settingsData[EB.apiKey.appointTime].properties
      let settingModal = this.data.settingModal
      if (model.selected) {
        this.scheduleDataInit(properties)
        this.showScheduleModal()
      } else {
        this.closeScheduleModal()
        this.settingModalInit()
      }
      settingModal.params.appoint.value = model.selected
      this.setData({
        scheduleData,
        settingModal,
        switchSchedule: parseComponentModel(model),
      })
    },

    // 确认保温时间
    confirmWarmTime() {
      let warmTimeData = this.data.warmTimeData
      let valueIndex = warmTimeData.value
      let hourIndex = valueIndex[1]
      let minIndex = valueIndex[2]
      let hours = warmTimeData.hours[hourIndex]
      let minutes = warmTimeData.minutes[minIndex]
      warmTimeData.result = hours * 60 + minutes
      warmTimeData.resultLabel = (hours > 0 ? hours + '小时' : '') + (minutes > 0 ? minutes + '分钟' : '')
      this.setData({ warmTimeData })
      this.closeWarmTimeModal()
    },

    // 保温时间初始化
    warmTimeDataInit(properties) {
      let warmTimeData = this.data.warmTimeData
      let defaultValue = Number(properties.defaultValue)
      let defaultHours = Math.floor(defaultValue / 60)
      let defaultMinutes = Math.floor(defaultValue % 60)
      let maxHour = Math.floor(properties.max / 60)
      let maxMinute = Math.floor(properties.max % 60)
      let minHour = Math.floor(properties.min / 60)
      let minMinute = Math.floor(properties.min % 60)
      warmTimeData.maxHour = maxHour
      warmTimeData.maxMinute = maxMinute
      warmTimeData.minHour = minHour
      warmTimeData.minMinute = minMinute
      // 设置小时数据
      let hours = []
      for (let i = minHour; i <= maxHour; i++) {
        hours.push(i)
        if (i === defaultHours) {
          warmTimeData.value[1] = hours.length - 1
        }
      }
      // 设置分钟数据
      let minutes = []
      let initEndMinutes = 60
      if (warmTimeData.value[1] === maxHour) {
        initEndMinutes = maxMinute
        if (maxMinute === 0) {
          initEndMinutes = 1
        }
      }
      for (let i = minMinute; i < initEndMinutes; i++) {
        minutes.push(i)
        if (i === defaultMinutes) {
          warmTimeData.value[2] = minutes.length - 1
        }
      }
      warmTimeData.result = defaultValue
      warmTimeData.resultLabel =
        (defaultHours > 0 ? defaultHours + '小时' : '') + (defaultMinutes > 0 ? defaultMinutes + '分钟' : '')
      warmTimeData.hours = hours
      warmTimeData.minutes = minutes
      this.setData({ warmTimeData })
    },

    // 保温时间改变
    warmTimeDataOnChange(event) {
      // 数据联动修改
      let val = event.detail.value
      let hourIndex = val[1]
      let minIndex = val[2]
      let warmTimeData = this.data.warmTimeData
      let minutes = []
      if (hourIndex === 0) {
        // 小时最小,重新赋值分钟
        for (let i = warmTimeData.minMinute; i < 60; i++) {
          minutes.push(i)
        }
        warmTimeData.minutes = minutes
      } else if (hourIndex === warmTimeData.hours.length - 1) {
        // 小时最大,重新赋值分钟
        for (let i = 0; i <= warmTimeData.maxMinute; i++) {
          minutes.push(i)
        }
        warmTimeData.minutes = minutes
      } else {
        for (let i = 0; i < 60; i++) {
          minutes.push(i)
        }
        warmTimeData.minutes = minutes
      }
      warmTimeData.value = val
      this.setData({ warmTimeData })
    },

    // 显示或隐藏保温时间对话框
    showWarmTimeModal() {
      let warmTimeData = this.data.warmTimeData
      warmTimeData.isShow = true
      this.setData({ warmTimeData })
    },
    closeWarmTimeModal() {
      let warmTimeData = this.data.warmTimeData
      warmTimeData.isShow = false
      this.setData({ warmTimeData })
    },

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

    // 预约时间选择
    scheduleDataOnChange(e) {
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
          // 选择了今天
          // 设置小时数据
          let initMaxHours = 24
          if (nowHour + maxHours < 24) {
            initMaxHours = nowHour + maxHours + 1
          }
          for (let i = nowHour + minHours; i < initMaxHours; i++) {
            hours.push(i)
          }
          // 设置分钟数据
          if (startMin >= 60) {
            startMin = nowMin + minMinutes - 60
          }
          if (hour !== 0) {
            startMin = 0
          }
          let initEndMin = hour === hours.length - 1 ? maxMinutes : 59
          for (let i = startMin; i <= initEndMin; i++) {
            minutes.push(i)
          }
        } else {
          // 选择了明天
          // 设置小时数据
          for (let i = 0; i <= nowHour - (24 - maxHours); i++) {
            hours.push(i)
          }
          // 设置分钟数据
          for (let i = 0; i < 60; i++) {
            minutes.push(i)
          }
          // 选择了最大小时
          if (hour === hours.length - 1) {
            minutes = []
            for (let i = 0; i <= nowMin - (60 - maxMinutes); i++) {
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

    // region 预约时间初始化
    scheduleDataInit(selectedOptionsData) {
      let scheduleData = this.data.scheduleData
      console.log('selectedOptionsData: ', selectedOptionsData)
      let appointTimeDataMin = Number(selectedOptionsData.min)
      let hours = []
      let minutes = []
      let minHours = Math.floor(appointTimeDataMin / 60)
      let minMinutes = appointTimeDataMin % 60
      let maxHours = Math.ceil(selectedOptionsData.max / 60)
      let maxMinutes = selectedOptionsData.max % 60
      // 获取当前时间
      let nowDate = new Date()
      // 设置小时数据
      let nowHour = nowDate.getHours()
      let nowMin = nowDate.getMinutes()
      // 默认预约时间
      let defaultValue = Number(selectedOptionsData.defaultValue)
      let defaultHourInterval = Math.floor(defaultValue / 60)
      let defaultMinuteInterval = Math.ceil(defaultValue % 60)
      let targetDayIndex = 0
      let targetHourIndex = 0
      let targetMinuteIndex = 0
      let targetHours = nowHour + defaultHourInterval
      let targetMinutes = nowMin + defaultMinuteInterval
      if (targetMinutes > 59) {
        targetMinutes = targetMinutes - 60
        targetHours++
      }
      if (targetHours > 23) {
        targetDayIndex = 1
        targetHours = targetHours - 24
      }
      // console.log('预约时间初始化 默认值:',{defaultValue,defaultHourInterval,defaultMinuteInterval,nowHour,nowMin})
      // 时间选项数据赋值
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
      // 设置小时数据
      let index = 0
      if (targetDayIndex) {
        // 加载明天的小时数据
        for (let i = 0; i <= nowHour - (24 - maxHours); i++) {
          hours.push(i)
          if (targetHours === i) {
            targetHourIndex = index
          }
          index++
        }
      } else {
        // 加载今天的小时数据
        for (let i = nowHour + minHours; i < 24; i++) {
          hours.push(i)
          if (targetHours === i) {
            targetHourIndex = index
          }
          index++
        }
      }

      // 设置分钟数据
      index = 0
      for (let i = startMin; i <= 60; i++) {
        if (i === 60) {
          minutes.push(0)
        } else {
          minutes.push(i)
        }
        if (targetMinutes === i) {
          targetMinuteIndex = index
        }
        index++
      }
      scheduleData.value = [0, targetDayIndex, targetHourIndex, targetMinuteIndex, 0]
      scheduleData.hours = hours
      scheduleData.minutes = minutes
      scheduleData.minHours = minHours
      scheduleData.minMinutes = minMinutes
      scheduleData.maxHours = maxHours
      scheduleData.maxMinutes = maxMinutes
      console.log('预约时间初始化 结果: ', scheduleData)
      this.setData({ scheduleData, nowDate })
    },
    // endregion

    // region 显示预约对话框
    showScheduleModal() {
      let scheduleModal = this.data.scheduleModal
      scheduleModal.isShow = true
      this.setData({ scheduleModal })
    },
    closeScheduleModal() {
      let scheduleModal = this.data.scheduleModal
      let scheduleData = this.data.scheduleData
      let switchSchedule = parseComponentModel(this.data.switchSchedule)
      scheduleModal.isShow = false
      if (!scheduleData.result) {
        switchSchedule.selected = false
        this.settingModalInit()
      }
      switchSchedule = parseComponentModel(switchSchedule)
      this.setData({ scheduleModal, switchSchedule })
    },
    // endregion

    // region 显示参数设置对话框
    showSettingModal() {
      // 防止用户多次点击选项，事件重复执行
      if (!isShowingSettingModal) {
        isShowingSettingModal = true
        let sliderWarmTemp = this.selectComponent('#sliderWarmTemp')
        let sliderTemperature = this.selectComponent('#sliderTemperature')
        let settingModal = this.data.settingModal
        settingModal.isShow = true
        this.setData({ settingModal })
        if (sliderWarmTemp || sliderTemperature) {
          setTimeout(() => {
            sliderWarmTemp?.getSliderWidth()
            sliderTemperature?.getSliderWidth()
          }, 500)
        }
        if (showingSettingModalTimer) {
          clearTimeout(showingSettingModalTimer)
        }
        showingSettingModalTimer = setTimeout(() => {
          isShowingSettingModal = false
        }, 500)
      }
    },
    closeSettingModal() {
      // if(!isShowingSettingModal){
      let settingModal = this.data.settingModal
      settingModal.isShow = false
      this.setData({ settingModal })
      // }
    },
    settingModalInit() {
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
      this.setData({ switchSchedule, scheduleData })
    },
    // endregion

    // endregion
    // region 2021.12.01 之前代码
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
    updateStatus() {
      return new Promise((resolve, reject) => {
        let deviceInfo = this.data.deviceInfo
        requestService
          .request('luaGet', {
            applianceCode: this.properties.applianceData.applianceCode,
            command: {},
            reqId: getStamp().toString(),
            stamp: getStamp(),
          })
          .then((res) => {
            console.log('获取设备状态')
            console.log(res)
            if (res.data.code != 0) {
              deviceInfo.isOnline = false
              deviceInfo.bgImage = this.data.bgImage.off
              this.setData({ deviceInfo })
              let msg = EB.handleErrorMsg(res.data.code)
              MideaToast(msg)
              resolve(res)
            }
            try {
              deviceInfo.isOnline = true
              this.dataInit(res.data.data)
            } catch (e) {
              console.error(e)
            }
            resolve(res)

            this.setData({
              deviceInfo,
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
            deviceInfo.isOnline = false
            deviceInfo.bgImage = this.data.bgImage.off
            this.setData({ deviceInfo })
            let res = err.data
            if (res) {
              if (res.result && res.result.returnData) {
                res = JSON.parse(res.result.returnData)
              }
              if (res.code != 0) {
                if (res.code !== 1307) {
                  let msg = EB.handleErrorMsg(res.code)
                  MideaToast(msg)
                }
              } else {
                MideaToast('未知错误-状态')
              }
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
        if (deviceStatusTimer) {
          clearInterval(deviceStatusTimer)
        }
        // 数据初始化
        deviceStatusTimer = null
        let intervalKey = wx.getStorageSync('ECInterval' + this.properties.applianceData.applianceCode)
        if (intervalKey) {
          clearInterval(intervalKey)
        }
        this.clearDeviceStatusInterval()
        if (showingSettingModalTimer) {
          clearTimeout(showingSettingModalTimer)
        }
        showingSettingModalTimer = null
        isShowingSettingModal = false
      } catch (e) {
        console.error(e)
      }
    },
    // endregion
    noop() {},
    // 埋点
    rangersBurialPointClick(eventName, param) {
      let deviceInfo = this.data.deviceInfo
      if (deviceInfo) {
        let paramBurial = {}
        let paramBase = {
          module: '插件',
          apptype_name: '电水壶',
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
      this.getProductConfig()
        .then((res) => {
          console.log('getProductConfig: ', res)
          if (res.isKettle) {
            this.setData({
              isKettle: true,
              isInit: true,
            })
            resolve()
          }
          let param = {}
          param['page_name'] = '首页'
          param['object'] = '进入插件页'
          this.rangersBurialPointClick('plugin_page_view', param)
          // 获取功能区域高度
          let windowHeight = wx.getSystemInfoSync().windowHeight
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
          this.updateStatus().then((res) => {
            this.deviceStatusInterval()
            this.setData({
              isInit: true,
            })
          })
        })
        .catch((err) => {
          console.error('getProductConfig: ', err)
        })
    })
  },
})
