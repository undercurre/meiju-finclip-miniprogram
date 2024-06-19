const app = getApp() //获取应用实例
const requestService = app.getGlobalConfig().requestService
const rangersBurialPoint = app.getGlobalConfig().rangersBurialPoint
import { getStamp } from 'm-utilsdk/index'

import { EB } from './js/EB.js'
import { DeviceData } from '../assets/scripts/device-data'
import MideaToast from '../component/midea-toast/toast'
import { Format } from '../assets/scripts/format'
import { imageDomain, commonApi } from '../assets/scripts/api'
import { parseComponentModel } from '../assets/scripts/common'
import { EBProfile } from './js/EB-profile'
import { EBX2Profile } from './js/EB-X2-profile'
import { UI } from '../assets/scripts/ui'

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
      workStatus: {},
      workStatusMap: {},
      bgImage: imageDomain + '/0xFB/bg.png',
    },
    pageProductConfig: {
      mixingMode: {
        isShow: false,
        hasConfig: false,
      },
      power: {
        isShow: false,
        hasConfig: false,
        isShowSlider: true,
      },
      workTime: {
        isShow: false,
        hasConfig: false,
      },
      appoint: {
        isShow: false,
        hasConfig: false,
      },
    },
    isBottomFixed: false,
    isInit: false,
    selectedFunction: {},
    settingModal: {
      isShow: false,
      params: {
        mixingMode: {
          value: undefined,
          label: undefined,
        },
        power: {
          value: undefined,
          label: undefined,
        },
        workTime: {
          value: undefined,
          label: undefined,
        },
        appoint: {
          value: undefined,
          label: undefined,
        },
      },
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
    switchMixingMode: parseComponentModel({
      color: THEME_COLOR,
      selected: false,
    }),
    switchSchedule: parseComponentModel({
      color: THEME_COLOR,
      selected: false,
    }),
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
      width: '150%',
      unit: 'w',
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
    // region 注释
    // scrollViewTop: 0,
    // buttonSize: '110rpx',
    // icons: {
    //     greyTriangle: 'assets/img/grey-triangle.png',
    // },
    // modelHidden: ['hengwenpengren', 'huoguo', 'baochao', 'baotang'],
    // rowClass1: 'row-sb',
    // rowClass2: 'row-sb',
    // btnShowStatus: false,
    // powerImg: {
    //     on: '/pages/T0xFC/assets/img/icon_switch_on01@3x.png',
    //     off: '/pages/T0xFC/assets/img/icon_switch_off01@3x.png',
    // },
    // modeImg: {
    //     hengwenpengren: {
    //         disabled: imageDomain + '/0xEB/hengwenpengren-1.png',
    //         on: imageDomain + '/0xEB/hengwenpengren-2.png',
    //         off: imageDomain + '/0xEB/hengwenpengren-1.png',
    //         appoint: imageDomain + '/0xEB/hengwenpengren-2.png',
    //     },
    //     huoguo: {
    //         disabled: imageDomain + '/0xEB/huoguo-1.png',
    //         on: imageDomain + '/0xEB/huoguo-2.png',
    //         off: imageDomain + '/0xEB/huoguo-1.png',
    //         appoint: imageDomain + '/0xEB/huoguo-2.png',
    //     },
    //     baochao: {
    //         disabled: imageDomain + '/0xEB/baochao-1.png',
    //         on: imageDomain + '/0xEB/baochao-2.png',
    //         off: imageDomain + '/0xEB/baochao-1.png',
    //         appoint: imageDomain + '/0xEB/baochao-2.png',
    //     },
    //     baotang: {
    //         disabled: imageDomain + '/0xEB/baotang-1.png',
    //         on: imageDomain + '/0xEB/baotang-2.png',
    //         off: imageDomain + '/0xEB/baotang-1.png',
    //         appoint: imageDomain + '/0xEB/baotang-2.png',
    //     },
    // },
    // circleImg: {
    //     yellow: imageDomain + '/0xEB/circle-yellow.png',
    //     red: imageDomain + '/0xEB/circle-red.png'
    // },
    // openPicker: false,
    // listData: {},
    //
    // text: '待机中', // 显示状态文字（待机中）
    // menuId: menuId,
    // currentMenuId: 0, // 记录当前的menuId
    // showText: false,
    // showWorkingText: false, // 显示工作参数
    // workingText: '',// 工作参数
    // showWorkingStatus: false, // 显示工作状态
    // workingStatus: '',// 工作状态
    // finishTime: '',
    // showFinishTime: false,
    // circleSrc: '',
    // power: {},
    // // 菜单
    // hengwenpengren: {},
    // huoguo: {},
    // baochao: {},
    // baotang: {},
    // otherMenu: {},
    // // ...
    // showManualItems: false,
    // showOfflineCard: false,
    // offlineFlag: false,
    // currentAppointData: {},
    // otherMenuWorking: false,
    // actionSheetShow: false,
    // // 选择器
    // multiArray: [],
    // multiIndex: [],
    // todayHours: [],
    // tomorrowHours: [],
    // todayFirstMinutes: [],
    // tomorrowLastMinutes: [],
    // normalMinutes: [],
    // showDialog: false,
    // pickerOpenHour: 0,
    // pickerOpenMinute: 0,
    // headerImg: imageDomain + '/0xEB/blender.png',
    //
    // currentPickerType: null,
    //
    // showTips: true,
    // showQuit: false,
    // endregion
    // endregion
  },
  methods: {
    // region 2021.12.01 - ao
    // region 跳转到美居下载页
    goToDownLoad() {
      wx.navigateTo({
        url: '/pages/download/download',
      })
    },
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
        // let isDebug = config.environment == 'sit';
        // if (!isDebug) {
        //     sendParams = {
        //         serviceName: "quick-development-service",
        //         uri: "frontend/productConfig" + Format.jsonToParam(sendParams),
        //         method: "GET",
        //         contentType: "application/json",
        //     }
        //     method = 'POST';
        // }
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
            resData = JSON.parse(res.data.result.returnData)
            console.log(resData)
            do {
              // if(res.resCode==50300||res.code==1001){
              //     // 无资源重定向
              //     EB.redirectUnSupportDevice(this.properties.applianceData);
              //     break;
              // }
              if (res.data.errorCode != 0) {
                let msg = EB.handleErrorMsg(res.code)
                MideaToast(msg)
                break
              }
              let quickDevJson = EB.quickDevJson2Local(resData)
              console.log('解析后参数')
              console.log(quickDevJson)
              let configList = quickDevJson.functions
              let functionLength = configList.length
              deviceInfo.workStatusMap = EBProfile.STATUS_MAP
              if (this.isX2()) {
                deviceInfo.workStatusMap = EBX2Profile.STATUS_MAP
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
              if (configList.length === 1) {
                this.functionConfigInit(configList[0])
              }
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
                  EB.redirectUnSupportDevice(this.properties.applianceData)
                  break
                }
                if (res.code != 0) {
                  let msg = EB.handleErrorMsg(res.code)
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
    // region 数据初始化
    dataInit(newDeviceStatus) {
      let data = this.data
      let deviceInfo = data.deviceInfo
      let configList = data.configList
      let quickDevJson = data.quickDevJson
      let workTimeData = this.data.workTimeData
      let settingModal = this.data.settingModal
      console.log('数据初始化')
      console.log(newDeviceStatus)
      if (newDeviceStatus) {
        Object.assign(deviceInfo, newDeviceStatus)
        deviceInfo.work_status = EBProfile.STATUS_MAP[newDeviceStatus.work_status]
        let menuIdParam = EBProfile.menuId
        let workStatusMap = EBProfile.STATUS_MAP
        let workTimeLeft = EBProfile.workTimeLeft
        let workTimeLeftSec = EBProfile.workTimeLeftSeconds
        let power = EBProfile.power
        // 剩余时间
        let workTimeLeftHours = Number(deviceInfo[workTimeLeft.h])
        let workTimeLeftMinutes = Number(deviceInfo[workTimeLeft.m])
        let workTimeLeftSeconds = Number(deviceInfo[workTimeLeftSec])
        let raminWorkTimeSec = workTimeLeftHours * 60 * 60 + workTimeLeftMinutes * 60
        let setWorkTime = EBProfile.setWorkTime
        let setWorkTimeSec = Number(deviceInfo[setWorkTime.h]) * 60 * 60 + Number(deviceInfo[setWorkTime.m]) * 60

        if (this.isX2()) {
          deviceInfo.work_status = newDeviceStatus.work_status
          menuIdParam = EBX2Profile.menuId
          workStatusMap = EBX2Profile.STATUS_MAP
          workTimeLeft = EBX2Profile.workTimeLeft
          workTimeLeftSec = EBX2Profile.workTimeLeftSeconds
          power = EBX2Profile.power
          workTimeLeftSeconds = Number(deviceInfo[workTimeLeftSec])
          raminWorkTimeSec = workTimeLeftSeconds
          setWorkTime = EBX2Profile.setWorkTime
          setWorkTimeSec = Number(deviceInfo[setWorkTime.m])
        }
        // 工作状态赋值
        let workStatusOptions = quickDevJson.properties[EB.apiKey.workStatue].options
        if (workStatusOptions && workStatusOptions.length > 0) {
          for (let i = 0; i < workStatusOptions.length; i++) {
            let workStatusOptionItem = workStatusOptions[i]
            deviceInfo.workStatus[workStatusOptionItem.code] = workStatusOptionItem.value
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
        // 判断工作状态
        switch (deviceInfo.work_status) {
          case workStatusMap['work']:
            deviceInfo.bgImage = this.data.bgImage.url3
            deviceInfo.isRunning = true
            deviceInfo.isWorking = true
            break
          case workStatusMap['pause']:
          case workStatusMap['keep_warm']:
            deviceInfo.bgImage = this.data.bgImage.url2
            deviceInfo.isWorking = true
            deviceInfo.isRunning = true
            break
          case workStatusMap['power_off']:
            deviceInfo.bgImage = this.data.bgImage.url1
            deviceInfo.isRunning = false
            deviceInfo.isWorking = false
            break
          default:
            deviceInfo.bgImage = this.data.bgImage.url2
            deviceInfo.isRunning = true
            deviceInfo.isWorking = false
            break
        }
        // 工作模式
        let workMode = Number(deviceInfo[menuIdParam])
        let currentFunction = {}
        if (workMode !== 0) {
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
        // 剩余时间
        deviceInfo.currentTime = Format.formatSeconds(raminWorkTimeSec)
        if (deviceInfo.currentTime.seconds < 60 && deviceInfo.currentTime.seconds > 0) {
          deviceInfo.currentTime.minutes++
        }
        if (deviceInfo.currentTime.minutes >= 60) {
          deviceInfo.currentTime.minutes = 0
          deviceInfo.currentTime.hours++
        }
        deviceInfo.currentTimeLabel = {
          hour: Format.getTime(deviceInfo.currentTime.hours),
          minute: Format.getTime(deviceInfo.currentTime.minutes),
          second: Format.getTime(deviceInfo.currentTime.seconds),
        }
        // 工作时间
        deviceInfo.setWorkTime = Math.ceil(setWorkTimeSec / 60)
        // 火力
        deviceInfo.power = (Number(deviceInfo[power]) * 100 || '--') + 'w'
        if(deviceInfo.isWorking&&!settingModal.isShow){
          workTimeData.resultLabel = deviceInfo.setWorkTime+'分钟'
          settingModal.params.power.label = (Number(deviceInfo[power]) * 100 + 'W' || '--')
        } else {
          let hours = workTimeData.hours[workTimeData.value[1]]
          let minutes = workTimeData.minutes[workTimeData.value[2]]
          workTimeData.resultLabel = (hours > 0 ? hours+ '小时' : '') + (minutes > 0 ? minutes + '分钟' : '')
          let sliderPower = parseComponentModel(data.sliderPower)
          settingModal.params.power.label = sliderPower.currentValue * 100 +'W'
        }
      }
      console.log(deviceInfo)
      this.setData({ deviceInfo,workTimeData,settingModal })
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
      do {
        let data = this.data
        let deviceInfo = data.deviceInfo
        let selectedFunction = data.selectedFunction
        let pageProductConfig = data.pageProductConfig
        let settingModal = data.settingModal
        let scheduleData = data.scheduleData
        let sliderPower = parseComponentModel(data.sliderPower)

        let menuId = EBProfile.menuId
        let stringMap = EBProfile.STRING_MAP
        let statusMap = EBProfile.STATUS_MAP
        let curState = EBProfile.curState
        let power = EBProfile.power
        let mixingMode = EBProfile.mixingMode
        let setWorkTime = EBProfile.setWorkTime

        let controlParams = {}

        if (this.isX2()) {
          menuId = EBX2Profile.menuId
          stringMap = EBX2Profile.STRING_MAP
          statusMap = EBX2Profile.STATUS_MAP
          curState = EBX2Profile.curState
          power = EBX2Profile.power
          mixingMode = EBX2Profile.mixingMode
          setWorkTime = EBX2Profile.setWorkTime
          controlParams[EBX2Profile.workSwitch] = stringMap[statusMap.work]
        } else {
          controlParams[curState] = stringMap[statusMap.work]
        }

        controlParams[menuId] = selectedFunction.code
        // 搅拌
        if (pageProductConfig.mixingMode.isShow) {
          if (pageProductConfig.mixingMode.valueArray) {
            controlParams[mixingMode] = settingModal.params.mixingMode.value
          } else {
            controlParams[mixingMode] = settingModal.params.mixingMode.value ? 2 : 1
          }
        }
        // 火力
        if (pageProductConfig.power.isShow) {
          controlParams[power] = sliderPower.currentValue
        }
        // 烹饪时间
        if (pageProductConfig.workTime.isShow) {
          let workTimeData = data.workTimeData
          let hours = workTimeData.hours[workTimeData.value[1]]
          let minutes = workTimeData.minutes[workTimeData.value[2]]
          if (this.isX2()) {
            controlParams[setWorkTime.m] = hours * 60 * 60 + minutes * 60
          } else {
            controlParams[setWorkTime.h] = hours
            controlParams[setWorkTime.m] = minutes
          }
        }
        // 预约时间
        if (pageProductConfig.appoint.isShow && settingModal.params.appoint.value) {
          if (this.isX2()) {
            controlParams[EBX2Profile.workSwitch] = stringMap[statusMap.order]
          } else {
            controlParams[curState] = stringMap[statusMap.order]
          }
          controlParams[EB.apiKey.appointTime] = scheduleData.result
        }

        console.log('开始烹饪')
        console.log(controlParams)
        console.log(deviceInfo)
        // break;
        this.closeSettingModal()
        this.onClickControl(controlParams)
        // console.log(controlParams);
      } while (false)
    },
    // endregion

    // 控制设备状态
    onClickControlStatus(event) {
      let index = event.currentTarget.dataset.index
      let deviceInfo = this.data.deviceInfo
      do {
        if (!index) {
          console.warn(index)
          break
        }
        let controlParams = {}
        let menuId = EBProfile.menuId
        let curState = EBProfile.curState
        let stringMap = EBProfile.STRING_MAP
        let statusMap = EBProfile.STATUS_MAP
        let setWorkTime = EBProfile.setWorkTime
        let power = EBProfile.power
        let workTimeLeft = EBProfile.workTimeLeft
        if (this.isX2()) {
          menuId = EBX2Profile.menuId
          curState = EBX2Profile.curState
          stringMap = EBX2Profile.STRING_MAP
          statusMap = EBX2Profile.STATUS_MAP
          setWorkTime = EBX2Profile.setWorkTime
          power = EBX2Profile.power
          workTimeLeft = EBX2Profile.workTimeLeft
        }
        switch (index) {
          case 'power':
            if (this.isX2()) {
              controlParams[EBX2Profile.workSwitch] =
                stringMap[deviceInfo.isRunning ? statusMap.power_off : statusMap.power_on]
            } else {
              controlParams[curState] = stringMap[deviceInfo.isRunning ? statusMap.power_off : statusMap.standby]
            }
            this.onClickControl(controlParams)
            break
          case 'stop':
            if (this.isX2()) {
              controlParams[EBX2Profile.workSwitch] = stringMap[statusMap.standby]
            } else {
              controlParams[curState] = stringMap[statusMap.standby]
            }
            this.onClickControl(controlParams)
            break
          case 'toggleWork':
            let isPause = deviceInfo.work_status === statusMap.pause
            controlParams[menuId] = deviceInfo[menuId]
            if (this.isX2()) {
              controlParams[EBX2Profile.workSwitch] = stringMap[isPause ? statusMap.work : statusMap.pause]
            } else {
              controlParams[power] = deviceInfo[power]
              controlParams[setWorkTime.h] = deviceInfo[workTimeLeft.h]
              controlParams[setWorkTime.m] = deviceInfo[workTimeLeft.m]
              controlParams[curState] = stringMap[isPause ? statusMap.work : statusMap.pause]
            }
            this.onClickControl(controlParams)
            break
        }
      } while (false)
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
                let msg = EB.handleErrorMsg(res.data.code)
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

    // region 点击功能项
    onClickFunction(event) {
      do {
        let deviceInfo = this.data.deviceInfo
        if (!deviceInfo.isOnline) {
          MideaToast('设备已离线，请检查设备状态')
          break
        }
        if (!deviceInfo.isRunning) {
          MideaToast('设备未开机')
          break
        }
        if (deviceInfo.isWorking) {
          MideaToast('设备工作中，请稍后再试')
          break
        }
        let functionItem = event.currentTarget.dataset.item
        let selectedFunction = functionItem
        console.log('选中的功能项')
        console.log(selectedFunction)
        this.setData({ selectedFunction })
        let configList = this.data.configList
        if (configList.length !== 1) {
          this.functionConfigInit(selectedFunction)
        }
        let hasOptions = true
        let isOnlyQuick = undefined
        // 搅拌
        let mixingModeConfig = selectedFunction.settingsData[EB.apiKey.mixingMode]
        if (mixingModeConfig && mixingModeConfig.properties.ifCanAdjust !== false) {
          hasOptions = true
        }
        // 火力
        let powerConfig = selectedFunction.settingsData[EB.apiKey.power]
        if (powerConfig && powerConfig.properties.ifCanAdjust !== false) {
          hasOptions = true
        }
        // 烹饪时间
        if (selectedFunction.settingsData[EB.apiKey.setWorkTime]) {
          hasOptions = true
        }
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
        // this.showSettingModal();
      } while (false)
    },
    // endregion

    // region 设置弹框点击事件
    onClickSettingEvent(event) {
      do {
        let index = event.currentTarget.dataset.index
        let value = event.currentTarget.dataset.value
        if (!index) {
          MideaToast('invalid index')
          break
        }
        let settingModal = this.data.settingModal
        switch (index) {
          case 'mixingMode':
            if (!value) {
              MideaToast('缺少value')
              break
            }
            settingModal.params.mixingMode.value = value
            break
        }
        this.setData({ settingModal })
      } while (false)
    },
    // endregion

    // 所选功能参数初始化
    functionConfigInit(selectedFunction) {
      if (selectedFunction.settings && selectedFunction.settings.length > 0) {
        let pageProductConfig = this.data.pageProductConfig
        let sliderPower = parseComponentModel(this.data.sliderPower)
        let switchMixingMode = parseComponentModel(this.data.switchMixingMode)
        let settingModal = this.data.settingModal
        selectedFunction.settings.forEach((settingItem) => {
          let properties = settingItem.properties
          switch (settingItem.apiKey) {
            case EB.apiKey.mixingMode:
              pageProductConfig.mixingMode.hasConfig = true
              pageProductConfig.mixingMode.isShow = true
              if (settingItem.codeName === 'titleSwitch') {
                switchMixingMode.selected = settingModal.params.mixingMode.value = properties.defaultValue
                break
              }
              let valueArr = []
              if (properties.options && properties.options.length > 0) {
                properties.options.forEach((optionItem) => {
                  valueArr.push({
                    value: optionItem.value,
                    label: optionItem.text,
                  })
                })
              }
              pageProductConfig.mixingMode.valueArray = valueArr
              settingModal.params.mixingMode.value = properties.defaultValue
              break
            case EB.apiKey.power:
              pageProductConfig.power.hasConfig = true
              pageProductConfig.power.isShow = true
              if (properties.range) {
                sliderPower.currentValue = Number(settingItem.properties.defaultValue)
                sliderPower.min = Number(settingItem.properties.range[0].min)
                sliderPower.max = Number(settingItem.properties.range[0].max)
                sliderPower.interval = Number(settingItem.properties.range[0].step)
                sliderPower.valueArray = [
                  {
                    value: sliderPower.min,
                    label: sliderPower.min * 100 + settingItem.properties.unit,
                  },
                  {
                    value: sliderPower.max,
                    label: sliderPower.max * 100 + settingItem.properties.unit,
                  },
                ]
                sliderPower.unit = settingItem.properties.unit
                settingModal.params.power.label = sliderPower.currentValue * 100 + 'W'
                pageProductConfig.power.isShowSlider = true
              } else {
                pageProductConfig.power.isShowSlider = false
              }
              break
            case EB.apiKey.setWorkTime:
              pageProductConfig.workTime.hasConfig = true
              pageProductConfig.workTime.isShow = true
              this.workTimeDataInit({
                appointTime: settingItem,
              })
              break
            case EB.apiKey.appointTime:
              pageProductConfig.appoint.hasConfig = true
              pageProductConfig.appoint.isShow = true
              this.scheduleDataInit(properties)
              break
          }
        })
        sliderPower = parseComponentModel(sliderPower)
        switchMixingMode = parseComponentModel(switchMixingMode)
        this.setData({ settingModal, pageProductConfig, switchMixingMode, sliderPower })
      }
    },

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
      workTimeData.resultLabel = workTimeData.minMinutes + '分钟'
      this.setData({ workTimeData })
    },
    // endregion

    // 开关切换
    switchMixingModeChange(event) {
      let model = event.detail
      let settingModal = this.data.settingModal
      settingModal.params.mixingMode.value = model.selected
      this.setData({
        settingModal,
        switchMixingMode: parseComponentModel(model),
      })
    },

    // 火力滑块改变
    sliderPowerOnMove(event) {
      let model = event.detail
      let settingModal = this.data.settingModal
      settingModal.params.power.label = model.currentValue * 100 + 'W'
      this.setData({ settingModal })
    },
    sliderPowerChange(event) {
      let model = event.detail
      let settingModal = this.data.settingModal
      settingModal.params.power.label = model.currentValue * 100 + 'W'
      this.setData({
        settingModal,
        sliderPower: parseComponentModel(model),
      })
    },

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
      workTimeData.resultLabel =
        (workTimeData.result.hours > 0 ? workTimeData.result.hours + '小时' : '') +
        (workTimeData.result.minutes > 0 ? workTimeData.result.minutes + '分钟' : '')
      this.setData({ workTimeData })
    },
    // endregion

    // 预约开关切换
    switchScheduleChange(event) {
      let model = event.detail
      let scheduleData = this.data.scheduleData
      let settingModal = this.data.settingModal
      if (model.selected) {
        this.showScheduleModal()
      } else {
        scheduleData.result = undefined
        scheduleData.resultLabel = undefined
      }
      settingModal.params.appoint.value = model.selected
      this.setData({
        scheduleData,
        settingModal,
        switchSchedule: parseComponentModel(model),
      })
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
          for (let i = startMin; i < initEndMin; i++) {
            minutes.push(i)
          }
        } else {
          // 选择了明天
          // 设置小时数据
          for (let i = 0; i < nowHour + maxHours - 23; i++) {
            hours.push(i)
          }
          // 设置分钟数据
          for (let i = 0; i < 60; i++) {
            minutes.push(i)
          }
          // 选择了最大小时
          if (hour === hours.length - 1) {
            minutes = []
            for (let i = 0; i <= maxMinutes; i++) {
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
      let hours = []
      let minutes = []
      let minHours = Math.floor(selectedOptionsData.min / 60)
      let minMinutes = selectedOptionsData.min % 60
      let maxHours = Math.floor(selectedOptionsData.max / 60)
      let maxMinutes = selectedOptionsData.max % 60
      // 获取当前时间
      let nowDate = new Date()
      // 设置小时数据
      let nowHour = nowDate.getHours()
      let nowMin = nowDate.getMinutes()
      let startMin = nowMin + minMinutes
      if (nowMin + maxMinutes >= 60) {
        maxHours++
        maxMinutes = Math.abs(nowMin - 60 + maxMinutes)
      } else {
        maxMinutes = nowMin + maxMinutes
      }
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
      for (let i = nowHour + minHours; i < 24; i++) {
        hours.push(i)
      }
      // 设置分钟数据
      for (let i = startMin; i <= 60; i++) {
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
      if (!scheduleData.result) {
        switchSchedule.selected = false
      }
      scheduleModal.isShow = false
      switchSchedule = parseComponentModel(switchSchedule)
      this.setData({ scheduleModal, switchSchedule })
    },
    // endregion

    // region 显示参数设置对话框
    showSettingModal() {
      // 防止用户多次点击选项，事件重复执行
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
            do {
              console.log('获取设备状态')
              console.log(res)
              if (res.data.code != 0) {
                deviceInfo.isOnline = false
                let msg = EB.handleErrorMsg(res.data.code)
                MideaToast(msg)
                resolve(res)
                break
              }
              try {
                deviceInfo.isOnline = true
                this.dataInit(res.data.data)
              } catch (e) {
                console.error(e)
              }
              resolve(res)
            } while (false)

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
            this.setData({deviceInfo})
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
                  let msg = EB.handleErrorMsg(res.code)
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
        if (showingSettingModalTimer) {
          clearTimeout(showingSettingModalTimer)
        }
        showingSettingModalTimer = null
        isShowingSettingModal = false
      } catch (e) {
        console.error(e)
      }
    },
    noop() {},
    // 埋点
    rangersBurialPointClick(eventName, param) {
      let deviceInfo = this.data.deviceInfo
      if (deviceInfo) {
        let paramBurial = {}
        let paramBase = {
          module: '插件',
          apptype_name: '烹饪机',
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
        this.updateStatus().then((res) => {
          this.deviceStatusInterval()
          this.setData({
            isInit: true,
          })
        })
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
      })
    })
  },
})
