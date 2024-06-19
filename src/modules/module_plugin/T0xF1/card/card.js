const app = getApp() //获取应用实例
const requestService = app.getGlobalConfig().requestService
const rangersBurialPoint = app.getGlobalConfig().rangersBurialPoint
import { getStamp } from 'm-utilsdk/index'
import { commonApi } from "../assets/scripts/api";

import {
  F1,
  getAppointFinishTime,
  getMenuIdByKey,
  getModelNameById,
  getTextByStatus,
  getTimeRange,
  getWorkFinishTime,
  getWorkTimeById,
  menuId,
  modeDesc,
  modeList,
  STATUS,
} from './js/F1.js'
import { imageDomain } from '../assets/scripts/api'
import { DeviceData } from '../assets/scripts/device-data'
import MideaToast from '../component/midea-toast/toast'
import { Format } from '../assets/scripts/format'
import { UI } from '../assets/scripts/ui'
import { parseComponentModel, parseToString } from '../assets/scripts/common'

let deviceStatusTimer = null
let workTimeTimer = null
let keepWarmTimer = null
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
    isShowErrorModal: false, // 是否显示错误弹框
    // 是否可以不加水
    isCouldZero: '',
    // 当前水量
    currentAmount: 0,
    // 当前搅拌速度
    currentSpeed: 0,
    // 是否全自动
    isSmartDevice: false,
    // 定义属性
    isInit: false,
    bgImage: {
      url1: imageDomain + '/0xFB/bg.png',
      url2: imageDomain + '/0xFB/bg-running.png',
      url3: imageDomain + '/0xFB/bg-running-move.png',
    },
    configList: [],
    cupTypeBadge: {
      isShow: false,
      content: '烹饪杯',
    },
    deviceInfo: {
      isOnline: false,
      isRunning: false,
    },
    devicePropertiesData: {},
    quickDevJson: null,
    defaultData: {
      optionsWrapperWidth: 686,
    },
    iconUrl: {
      power: {
        url1: imageDomain + '/0xFB/icon-switch.png',
      },
      clock: {
        url1: imageDomain + '/0xF1/icon-yuyue.png',
      },
      test: {
        url1: imageDomain + '/0xFB/icon_zhire2.png',
        url2: imageDomain + '/0xFB/icon_zhire.png',
        url3: 'https://ce-cdn.midea.com/quick_dev/function/1e13781d-c5ab-41d4-b04d-cc43b72fbd93.png',
        url4: 'https://ce-cdn.midea.com/quick_dev/function/7239b481-7e19-4267-bfaa-65aec566e3e1.png',
      },
      temperature: {
        url1: imageDomain + '/0xF1/icon-baowen.png',
      },
      fast: {
        url1: imageDomain + '/0xF1/icon-dangwei.png',
      },
      mouthfeel: {
        url1: imageDomain + '/0xF1/icon-kougan.png',
      },
      waterAmount: {
        url1: imageDomain + '/0xF1/icon-shuiliang.png',
      },
      backImgBase: imageDomain + '/0xFC/icon_youjiantou.png',
    },
    isShowBottom: false,
    isBottomFixed: false,
    noticeBar: {
      isShow: false,
      content: '内容',
    },
    nowDate: undefined,
    optionsWrapper: {
      translateX: 0,
      height: undefined,
    },
    scheduleData: {
      value: [0, 0, 0, 0, 0],
      day: [],
      hours: [],
      minutes: [],
      result: undefined,
    },
    scheduleModal: {
      isShow: false,
    },
    selectedCupType: 0,
    selectedFunction: {},
    settingModal: {
      isShow: false,
    },
    settingParam: {
      workSpeed: undefined,
      isKeepWarm: undefined,
      mouthFeel: undefined,
      waterAmount: undefined,
    },
    waterAmountConfig: {
      isShowSlider: false,
      isShowSelector: false,
      result: undefined,
    },
    workSpeedConfig: {
      isShowSlider: false,
      result: undefined,
    },
    waterAmountData: {
      isShowModal: false,
      value: [0],
      result: undefined,
      resultLabel: undefined,
    },
    workStatus: {},
    workTimeData: {
      isShowModal: false,
      value: [0, 0, 0, 0],
      minutes: [],
      seconds: [],
      result: undefined,
      resultLabel: undefined,
    },
    // 定义控件
    scheduleSwitch: parseComponentModel({
      isActive: true,
      selected: false,
    }),
    workSpeedSlider: parseComponentModel({
      min: 1,
      max: 10,
      interval: 1,
      currentValue: 1,
      width: '80%',
    }),
    sliderWaterAmount: parseComponentModel({
      min: 100,
      max: 500,
      interval: 100,
      currentValue: 100,
      width: '88%',
    }),

    // region 2021.09.08 之前代码
    scrollViewTop: 0,
    buttonSize: '90rpx',
    icons: {
      greyTriangle: 'assets/img/grey-triangle.png',
    },
    modelHidden: ['zalianghu', 'wugujiang', 'yingerhu', 'yingerzhou', 'yingyangzheng', 'nongtang'],
    rowClass1: 'row-sb',
    rowClass2: 'row-sb',
    btnShowStatus: false,
    powerImg: {
      on: '/pages/T0xFC/assets/img/icon_switch_on01@3x.png',
      off: '/pages/T0xFC/assets/img/icon_switch_off01@3x.png',
    },
    modeImg: {
      zalianghu: {
        disabled: imageDomain + '/0xF1/zalianghu-1.png',
        on: imageDomain + '/0xF1/zalianghu-3.png',
        off: imageDomain + '/0xF1/zalianghu-1.png',
        appoint: imageDomain + '/0xF1/zalianghu-2.png',
      },
      wugujiang: {
        disabled: imageDomain + '/0xF1/wugujiang-1.png',
        on: imageDomain + '/0xF1/wugujiang-3.png',
        off: imageDomain + '/0xF1/wugujiang-1.png',
        appoint: imageDomain + '/0xF1/wugujiang-2.png',
      },
      yingerhu: {
        disabled: imageDomain + '/0xF1/yingerhu-1.png',
        on: imageDomain + '/0xF1/yingerhu-3.png',
        off: imageDomain + '/0xF1/yingerhu-1.png',
        appoint: imageDomain + '/0xF1/yingerhu-2.png',
      },
      yingerzhou: {
        disabled: imageDomain + '/0xF1/yingerzhou-1.png',
        on: imageDomain + '/0xF1/yingerzhou-3.png',
        off: imageDomain + '/0xF1/yingerzhou-1.png',
        appoint: imageDomain + '/0xF1/yingerzhou-2.png',
      },
      yingyangzheng: {
        disabled: imageDomain + '/0xF1/yingyangzheng-1.png',
        on: imageDomain + '/0xF1/yingyangzheng-3.png',
        off: imageDomain + '/0xF1/yingyangzheng-1.png',
        appoint: imageDomain + '/0xF1/yingyangzheng-2.png',
      },
      nongtang: {
        disabled: imageDomain + '/0xF1/nongtang-1.png',
        on: imageDomain + '/0xF1/nongtang-3.png',
        off: imageDomain + '/0xF1/nongtang-1.png',
        appoint: imageDomain + '/0xF1/nongtang-2.png',
      },
    },
    circleImg: {
      yellow: imageDomain + '/0xF1/circle-yellow.png',
      red: imageDomain + '/0xF1/circle-red.png',
    },
    openPicker: false,
    listData: {},
    _applianceData: {
      name: '',
      roomName: '',
      onlineStatus: 0,
    },
    _applianceDataStatus: {},
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
    zalianghu: {},
    wugujiang: {},
    yingerhu: {},
    yingerzhou: {},
    yingyangzheng: {},
    nongtang: {},
    // ...
    showManualItems: false,
    showOfflineCard: false,
    offlineFlag: false,
    headerImg: imageDomain + '/0xF1/blender.png',
    // endregion
  },
  methods: {
    // 显示错误提示
    showErrorModal(errorMsg) {
      const { isShowErrorModal } = this.data
      if (!isShowErrorModal) {
        this.setData({ isShowErrorModal: true })
        wx.showModal({
          title: '设备故障',
          content: errorMsg,
          confirmText: '我知道了',
          showCancel: false,
          success: (res) => {
            if (res.confirm) {
              this.setData({ isShowErrorModal: false })
              wx.navigateBack({
                delta: 1,
                fail: (err) => {
                  wx.switchTab({
                    url: '/pages/index/index',
                  })
                },
              })
            }
          },
        })
      }
    },
    // region 2021.09.08 敖广骏
    // region 跳转到美居下载页
    goToDownLoad() {
      wx.navigateTo({
        url: '/pages/download/download',
      })
    },
    // endregion
    noop() {},
    // region 轮询获取设备状态
    deviceStatusInterval(interval) {
      if (deviceStatusTimer) {
        clearInterval(deviceStatusTimer)
      }
      if (!interval) {
        interval = 6000
      }
      deviceStatusTimer = setInterval(() => {
        if (isDeviceInterval) {
          this.updateStatus()
        }
      }, interval)
      this.updateStatus()
    },
    clearDeviceStatusInterval() {
      if (deviceStatusTimer) {
        clearInterval(deviceStatusTimer)
      }
    },
    // 获取diy名称
    getMenuName() {
      return new Promise((resolve, reject) => {
        const app = getApp()
        const uriParams = {
          applianceId: this.properties.applianceData.applianceCode,
          applianceType: 'F1',
          modelNo: this.properties.applianceData.sn8,
          userId: app.globalData.userData.iotUserId,
          queryType: 1,
        }
        const sendParams = {
          serviceName: 'remote-control',
          uri: 'v2/F1' + '/control/getStatus' + Format.jsonToParam(uriParams),
          method: 'POST',
          contentType: 'application/json',
          userId: app.globalData.userData.iotUserId,
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
    // endregion
    // 关闭顶部通知栏
    closeNoticeBar() {
      let cupTypeBadge = this.data.cupTypeBadge
      let noticeBar = this.data.noticeBar
      noticeBar.isShow = false
      cupTypeBadge.isShow = true
      this.setData({ cupTypeBadge, noticeBar })
    },
    // 关闭参数设置对话框
    closeSettingModal() {
      let settingModal = this.data.settingModal
      settingModal.isShow = false
      this.setData({ settingModal })
      this.settingModalInit()
    },
    // 取消预约
    cancelSchedule() {
      this.closeScheduleModal()
      this.settingModalInit()
    },
    // 关闭预约时间对话框
    closeScheduleModal() {
      let scheduleModal = this.data.scheduleModal
      scheduleModal.isShow = false
      this.setData({ scheduleModal })
    },
    // 关闭水量对话框
    closeWaterAmountModal() {
      let waterAmountData = this.data.waterAmountData
      waterAmountData.isShowModal = false
      this.setData({ waterAmountData })
    },
    // 关闭工作时间对话框
    closeWorkTimeModal() {
      let workTimeData = this.data.workTimeData
      workTimeData.isShow = false
      this.setData({ workTimeData })
    },
    // 确认预约时间
    confirmSchedule() {
      do {
        let scheduleData = this.data.scheduleData
        if (scheduleData.isSelecting) {
          break
        }
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
            minute = Math.ceil((targetInterval / 1000 / 60) % 60)
          }
        }
        scheduleData.result = hour * 60 + minute
        console.log('预约时间确定: ', hour, minute)
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
      } while (false)
    },
    // 确认水量选择
    confirmWaterAmount(event) {
      setTimeout(() => {
        let waterAmountData = this.data.waterAmountData
        let valueIndex = waterAmountData.value[0]
        console.log(waterAmountData.value)
        console.log(valueIndex)
        let waterAmount = Number(waterAmountData.valueArray[valueIndex].value)
        waterAmountData.result = waterAmount
        waterAmountData.resultLabel = waterAmount + 'ml'
        this.setData({ waterAmountData })
        this.closeWaterAmountModal()
      }, 50)
    },
    // 确认工作时间
    confirmWorkTime() {
      do {
        let workTimeData = this.data.workTimeData
        if (workTimeData.isSelecting) {
          break
        }
        let value = workTimeData.value
        let minuteIndex = value[1]
        let secondIndex = value[2]
        let minutes = Number(workTimeData.minutes[minuteIndex])
        let seconds = Number(workTimeData.seconds[secondIndex])
        workTimeData.result = minutes * 60 + seconds
        let resultLabel = seconds + '秒'
        if (minutes > 0) {
          resultLabel = minutes + '分 ' + seconds + '秒'
        }
        workTimeData.resultLabel = resultLabel
        this.setData({ workTimeData })
        this.closeWorkTimeModal()
      } while (false)
    },
    // 数据初始化
    async dataInit(newDeviceStatus) {
      let data = this.data
      let deviceInfo = data.deviceInfo
      let cupTypeBadge = data.cupTypeBadge
      let configList = data.configList
      let devicePropertiesData = data.devicePropertiesData
      if (newDeviceStatus) {
        F1.updateStatus(newDeviceStatus)
        this.setData({ isInit: true })
        // 工作状态
        deviceInfo.status = newDeviceStatus
        deviceInfo.workStatus = newDeviceStatus.work_status
        console.log(newDeviceStatus, 3333333333)
        let workStatusOptions = devicePropertiesData.workStatus?.options
        if (workStatusOptions && workStatusOptions.length > 0) {
          for (let i = 0; i < workStatusOptions.length; i++) {
            let workStatusOptionItem = workStatusOptions[i]
            if (workStatusOptionItem.value == deviceInfo.workStatus) {
              deviceInfo.workStatusName = workStatusOptionItem.text
              if (deviceInfo.workStatusName.indexOf('设备') > -1) {
                deviceInfo.workStatusName = deviceInfo.workStatusName.replace('设备', '')
              }
              break
            }
          }
        }
        if (
          newDeviceStatus.work_status != F1.workStatus[F1.workStatusCode.standby] &&
          newDeviceStatus.work_status != F1.workStatus[F1.workStatusCode.finished] &&
          newDeviceStatus.work_mode != 0
        ) {
          deviceInfo.isRunning = true
          deviceInfo.isOnline = true
        } else {
          deviceInfo.isRunning = false
        }
        // 工作模式
        deviceInfo.workMode = newDeviceStatus.work_mode
        let workMode = newDeviceStatus.work_mode
        let currentFunction = {}
        if (workMode != 0) {
          let hasFind = false
          for (let i = 0; i < configList.length; i++) {
            let configItem = configList[i]
            if (configItem.functions && configItem.functions.length > 0) {
              for (let j = 0; j < configItem.functions.length; j++) {
                let functionItem = configItem.functions[j]
                if (functionItem.code == workMode) {
                  currentFunction = functionItem
                  hasFind = true
                  break
                }
              }
              if (hasFind) {
                break
              }
            }
          }
          if (!currentFunction.code) {
            // 非本地功能
            const menuDetail = await this.getMenuName()
            const menuRes = JSON.parse(menuDetail.data.result.returnData)
            const resData = menuRes.data
            currentFunction.name = resData.extended.name
            currentFunction.code = resData.extended.runMode
          }
          deviceInfo.currentFunction = currentFunction
        } else {
          deviceInfo.isRunning = false
        }
        // 口感
        deviceInfo.mouthFeel = newDeviceStatus.mouthfeel
        deviceInfo.mouthFeelName = F1.getMouthFeelName(deviceInfo.mouthFeel)
        // 当前温度
        deviceInfo.currentTemperature = newDeviceStatus.current_temp
        // 跑马灯
        if (newDeviceStatus.flag_horse_race_lamp || newDeviceStatus.horse_race_lamp) {
          deviceInfo.horseRaceLamp = Number(newDeviceStatus.flag_horse_race_lamp || newDeviceStatus.horse_race_lamp)
        }
        // 剩余时间
        let keepWarmCodeIndex = (deviceInfo.keepWarmCodeIndex = F1.keepWarmCode.indexOf(Number(deviceInfo.workMode)))
        if (deviceInfo.workStatus == F1.workStatus[F1.workStatusCode.working]) {
          let second = (deviceInfo.currentTime = newDeviceStatus.current_time || newDeviceStatus.remain_work_time_sec)
          let setWorkTimeSec = Number(newDeviceStatus.set_work_time_sec)
          if (deviceInfo.isNew) {
            second = deviceInfo.currentTime = newDeviceStatus.remain_work_time_sec
          } else {
            second = deviceInfo.currentTime = newDeviceStatus.current_time
          }
          second = Number(second)
          // 往分钟取整
          if (second > 60) {
            second = Math.ceil(second / 60) * 60
          }
          let formatSecond = Format.formatSeconds(second)
          deviceInfo.currentTimeLabel = {
            hour: Format.getTime(formatSecond.hours),
            minute: Format.getTime(formatSecond.minutes),
            second: second > 60 ? 0 : Format.getTime(formatSecond.seconds),
          }
          if (!deviceInfo.horseRaceLamp) {
            // &&((!deviceInfo.isNew)||second<10)
            // this.clearDeviceStatusInterval()
            // let interval = 6000
            // if (deviceInfo.isNew) {
            //   interval = 6000
            // }
            // this.deviceStatusInterval(interval)
            // 倒计时
            if (workTimeTimer || second == 0) {
              clearInterval(workTimeTimer)
            }
            workTimeTimer = setInterval(() => {
              // 或者接浆杯存在则进行倒计时
              let currentHasReceiveSerousCup = Number(F1.statusData.flag_receive_serous_cup) === 1
              if (second !== setWorkTimeSec) {
                deviceInfo.hasCountdown = true
                if (second == 0) {
                  clearInterval(workTimeTimer)
                } else {
                  second--
                }
                // 往分钟取整
                if (second > 60) {
                  second = Math.ceil(second / 60) * 60
                }
                let formatSecond = Format.formatSeconds(second)
                deviceInfo.currentTimeLabel = {
                  hour: Format.getTime(formatSecond.hours),
                  minute: Format.getTime(formatSecond.minutes),
                  second: second > 60 ? 0 : Format.getTime(formatSecond.seconds),
                }
                this.setData({ deviceInfo })
              }
            }, 1000)
          }
        }
        // 保温时间
        if (deviceInfo.workStatus == F1.workStatus[F1.workStatusCode.keepWarm] || keepWarmCodeIndex > -1) {
          console.log('保温中')
          deviceInfo.setKeepWarmTime = 0
          // 保温中，返回分钟
          let formatSecond = 0
          let second = 0
          if (deviceInfo.isNew) {
            const { set_keep_warm_time_sec, keep_warm_time_sec } = newDeviceStatus
            if (set_keep_warm_time_sec <= 720) {
              //某些型号的破壁机， set_keep_warm_time_sec 实际上返回的是分钟，需要转换成秒（小于等于 720 是因为返回分钟的型号不大于该值，可以此为依据）
              //（保温是正计时，使用 floor ，满1分钟显示1分钟）
              second = Number(set_keep_warm_time_sec * 60 - keep_warm_time_sec)
            } else {
              //（保温是正计时，使用 floor ，满1分钟显示1分钟）
              second = Number(set_keep_warm_time_sec - keep_warm_time_sec)
            }
          } else {
            const { current_time, set_keep_warm_time } = newDeviceStatus
            let setKeepWarmTime = set_keep_warm_time
            if (set_keep_warm_time <= 720) {
              setKeepWarmTime = set_keep_warm_time * 60
            }
            second = setKeepWarmTime - current_time
          }
          formatSecond = Format.formatSeconds(second)
          deviceInfo.keepWarmTimeLabel = {
            hour: Format.getTime(formatSecond.hours),
            minute: Format.getTime(formatSecond.minutes),
          }
        }
        // 烹饪时间
        let setWorkTime = 0
        if (currentFunction.settingsData) {
          setWorkTime = currentFunction.settingsData[F1.settingApiKey.workStatus].properties.cookTime || 0
          let setWorkTimeLabel =
            currentFunction.cookTimeLabel ||
            currentFunction.settingsData[F1.settingApiKey.workStatus].properties.cookTime + '分钟' ||
            '0分钟'
          deviceInfo.setWorkTime = setWorkTimeLabel
          // 查找默认工作时间配置
          setWorkTimeLabel = this.setDefaultWorkTimeLabel(Number(newDeviceStatus.water_inflow), currentFunction)
          if (setWorkTimeLabel) {
            deviceInfo.setWorkTime = setWorkTimeLabel + '分钟'
          }
        }
        if (
          (newDeviceStatus.set_work_time && newDeviceStatus.set_work_time != '0' && !deviceInfo.horseRaceLamp) ||
          newDeviceStatus.set_work_time_sec !== '0'
        ) {
          setWorkTime = Number(newDeviceStatus.set_work_time_sec || newDeviceStatus.set_work_time)
          deviceInfo.setWorkTime = Math.floor(setWorkTime / 60) + '分钟'
          if (setWorkTime % 60 != 0) {
            deviceInfo.setWorkTime += Math.floor(setWorkTime % 60) + '秒'
          }
          if (setWorkTime < 60) {
            deviceInfo.setWorkTime = setWorkTime + '秒'
          }
        }
        if (setWorkTime === 0 && deviceInfo.currentTime && deviceInfo.currentTime != '0') {
          deviceInfo.setWorkTime = Math.floor(deviceInfo.currentTime / 60) + '分钟'
        }
        if (setWorkTime === 0 && newDeviceStatus.set_work_time_sec && deviceInfo.isNew) {
          if (newDeviceStatus.set_work_time_sec != '0') {
            let workTime = Number(newDeviceStatus.set_work_time_sec)
            if (workTime >= 60) {
              workTime = Math.floor(workTime / 60) + '分钟'
              if (setWorkTime % 60 != 0) {
                workTime += Math.floor(workTime % 60) + '秒'
              }
            } else {
              workTime = Math.floor(workTime) + '秒'
            }
            deviceInfo.setWorkTime = workTime
          }
        }
        // 预约时间（分钟）
        if (deviceInfo.workStatus == F1.workStatus[F1.workStatusCode.appoint]) {
          // let finishMinutes = Number(newDeviceStatus.current_time)+Number(setWorkTime);
          let finishMinutes = Number(newDeviceStatus.current_time)
          if (deviceInfo.isNew) {
            // finishMinutes = Math.floor(Number(newDeviceStatus.remain_appoint_time_sec)/60)+Number(setWorkTime);
            finishMinutes = Math.floor(Number(newDeviceStatus.remain_appoint_time_sec) / 60)
          }
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
        }
        // 杯子类型
        deviceInfo.cupType = F1.getCupTypeByStatus(newDeviceStatus.cup_status)
        cupTypeBadge.content = F1.getCupTypeName(deviceInfo.cupType)
        cupTypeBadge.isShow = true
        // 设备状态提示
        if (!this.showDeviceNotice(newDeviceStatus)) {
          this.closeNoticeBar()
        }
        // 设备故障提示
        let errorCode = Number(newDeviceStatus.error_code)
        if (errorCode) {
          let errorCodeMap = this.data.quickDevJson?.errorCodeMap
          if (errorCodeMap) {
            for (let key in errorCodeMap) {
              let errorItem = errorCodeMap[key]
              if (errorItem.code === errorCode) {
                // 找到错误提示
                this.showErrorModal(errorItem.name)
                break
              }
            }
          }
        }
        // 杯子是否盖好
        deviceInfo.enabledCupLid = F1.getLidStatus(newDeviceStatus.lid_status || newDeviceStatus.flag_lid_status)
      }
      if (!deviceInfo.cupType && deviceInfo.workStatus == '0') {
        this.showNoticeBar('设备当前为无杯状态，请正确安装杯体后使用。')
      }
      this.setData({ deviceInfo, cupTypeBadge })
    },
    // 设备状态提示
    showDeviceNotice(deviceStatus) {
      // deviceStatus是接口返回的设备状态数据
      let rtn = false
      if (deviceStatus) {
        // 是否有废水杯
        let currentHasLiquidWasteCup = Number(deviceStatus.flag_liquid_waste_cup) === 1
        // 是否有接浆杯
        let currentHasReceiveSerousCup = Number(deviceStatus.flag_receive_serous_cup) === 1
        // 是否有水壶
        let potIsOk = deviceStatus.pot_status === '0'
        // 是否养生杯
        let isHealthCup = Number(deviceStatus.cup_status) === 9
        // 缺水提示
        if (Number(deviceStatus.flag_lack_of_water)) {
          this.showNoticeBar('检测到当前设备水量不足，请尽快加水。')
          rtn = true
        }
        // 杯子是否盖好
        let enabledCupLid = F1.getLidStatus(deviceStatus.lid_status || deviceStatus.flag_lid_status)
        if (!enabledCupLid) {
          this.showNoticeBar('设备已开盖，请合盖后继续烹饪')
          rtn = true
        }
        // 全自动破壁机提示
        if (F1.isNotStandby() && F1.isSmartDevice()) {
          // 清洗功能
          if (this.isCleanMenu(deviceStatus.work_mode)) {
            // 没有废水杯
            if (!currentHasLiquidWasteCup) {
              if (currentHasReceiveSerousCup) {
                // 有接浆杯
                this.showNoticeBar('请替换为废水杯')
              } else {
                // 什么杯都没有
                this.showNoticeBar('请尽快放置废水杯')
              }
              rtn = true
            }
          } else {
            // 普通功能,没有接浆杯
            if (!currentHasReceiveSerousCup) {
              this.showNoticeBar('为了不影响出浆，请尽快放置接浆杯')
              rtn = true
            }
            // 有废水杯
            if (currentHasLiquidWasteCup) {
              this.showNoticeBar('请替换为接浆杯')
              rtn = true
            }
          }
        }

        // 养生杯
        if (isHealthCup) {
          // 水壶状态
          if (!potIsOk) {
            this.showNoticeBar('养生壶已提起，2分钟后自动关机')
            rtn = true
          }
        }
      }
      return rtn
    },
    // 根据内容区域高度设置区域高度
    fixOptionsWrapperHeightByOptions(index) {
      let className = '.options-' + index
      wx.createSelectorQuery()
        .in(this)
        .select(className)
        .fields(
          {
            dataset: true,
            size: true,
            scrollOffset: true,
            properties: ['scrollX', 'scrollY'],
            computedStyle: ['margin', 'backgroundColor'],
            context: true,
          },
          (res) => {
            if (res) {
              let optionsWrapper = this.data.optionsWrapper
              optionsWrapper.height = res.height
              this.setData({ optionsWrapper })
              // 判断功能区域高度
              if (res.height > 270) {
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
    },
    // 销毁组件
    getDestoried() {
      //执行当前页面前后插件的业务逻辑，主要用于一些清除工作
      if (deviceStatusTimer) {
        clearInterval(deviceStatusTimer)
      }
      if (workTimeTimer) {
        clearInterval(workTimeTimer)
      }
      // 数据初始化
      deviceStatusTimer = null
      workTimeTimer = null
    },
    // 获取产品配置
    getProductConfig(bigVer) {
      return new Promise((resolve, reject) => {
        let data = this.data
        let deviceInfo = data.deviceInfo
        let configList = data.configList
        let devicePropertiesData = data.devicePropertiesData
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
          bigVer: bigVer || DeviceData.bigVer,
          platform: 2, // 获取美居/小程序功能，2-小程序
        }
        let sendParams = {
          serviceName: 'node-service',
          uri: '/productConfig' + Format.jsonToParam(params),
          method: 'GET',
          contentType: 'application/json',
        }
        const method = 'POST'
        requestService
          .request(commonApi.sdaTransmit, sendParams, method)
          .then((res) => {
            console.log('获取产品配置')
            console.log(deviceInfo)
            // 设置页面功能

            let resData = JSON.parse(res.data.result.returnData)
            console.log(resData, 77777777777)
            do {
              if (res.data.errorCode == 50300 || res.data.errorCode == 1001) {
                // 无资源重定向
                F1.redirectUnSupportDevice(this.properties.applianceData)
                break
              }
              if (res.data.errorCode != 0) {
                let msg = F1.handleErrorMsg(res.code)
                MideaToast(msg)
                break
              } else if (!resData && !bigVer) {
                // 再次获取快开配置
                this.getProductConfig(8)
                break
              }
              let quickDevJson = F1.quickDevJson2Local(resData)
              console.log('解析后参数', quickDevJson)
              F1.updateProductConfig(quickDevJson)
              if (quickDevJson.properties['isNewProfile']) {
                deviceInfo.isNew = quickDevJson.properties['isNewProfile'].data
              }
              configList = quickDevJson.functions
              let filterConfigList = []
              configList.forEach((configItem, index) => {
                let functionLength = configItem.functions.length
                do {
                  if (functionLength === 7) {
                    configItem['layoutClass'] = 'grid-layout-fourth'
                    break
                  }
                  if (functionLength === 2) {
                    configItem['layoutClass'] = 'grid-layout-double'
                    break
                  }
                  if (functionLength % 6 === 0) {
                    configItem['layoutClass'] = 'grid-layout-third'
                    break
                  }
                  if (functionLength % 2 === 0) {
                    configItem['layoutClass'] = 'grid-layout-fourth'
                    break
                  }
                  configItem['layoutClass'] = 'grid-layout-third'
                } while (false)
                // 过滤杯子类型
                do {
                  if (configItem.cupType == '4') {
                    configItem['isFilter'] = true
                    break
                  }
                  filterConfigList.push(configItem)
                } while (false)
              })
              configList = filterConfigList
              devicePropertiesData = quickDevJson.properties
              let workStatusProperties = quickDevJson.properties[F1.settingApiKey.workStatus]
              if (workStatusProperties) {
                workStatusProperties.options.forEach((optionItem) => {
                  F1.workStatus[optionItem.code] = optionItem.value
                })
              }
              let workStatus = this.data.workStatus
              workStatus = F1.workStatus
              this.setData({ configList, workStatus, devicePropertiesData, quickDevJson })
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
                  F1.redirectUnSupportDevice(this.properties.applianceData)
                  break
                }
                if (res.code != 0) {
                  let msg = F1.handleErrorMsg(res.code)
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
    // 点击功能
    onClickFunction(event) {
      do {
        let deviceInfo = this.data.deviceInfo
        let functionItem = event.currentTarget.dataset.item
        let disabled = event.currentTarget.dataset.disabled
        let enabled = event.currentTarget.dataset.enabled
        console.log('快开属性: ', this.data.devicePropertiesData)
        console.log('当前功能: ', functionItem)
        console.log('设备状态deviceInfo: ', deviceInfo)
        if (!deviceInfo.isOnline) {
          MideaToast('设备已离线，请检查设备状态')
          break
        }
        if (!deviceInfo.cupType) {
          MideaToast('检测不到杯体，无法启动')
          this.showNoticeBar('设备当前为无杯状态，请正确安装杯体后使用。')
          break
        }
        if (deviceInfo.isRunning) {
          MideaToast('设备工作中，请稍后再试')
          break
        }
        if (!enabled) {
          MideaToast('该功能与当前杯体不匹配\r\n请检查或更换杯体')
          break
        }
        if (!deviceInfo.enabledCupLid) {
          MideaToast('设备已开盖，请合盖后继续烹饪')
          break
        }
        // 根据功能判断杯体状态
        let isCupStatusError = this.checkCupStatusByMenu({
          menuId: functionItem.code,
          attributes: functionItem.settingsData.workStatus,
        })
        if (isCupStatusError) {
          return
        }
        // 判断可用参数
        let hasOptions = false
        let isOnlyQuick = undefined
        let selectedFunction = functionItem
        if (selectedFunction.settingsData[F1.settingApiKey.mouthFeel]) {
          hasOptions = true
          isOnlyQuick = false
        }
        if (selectedFunction.settingsData[F1.settingApiKey.waterAmountSelect]) {
          hasOptions = true
          isOnlyQuick = false
        }
        if (selectedFunction.settingsData[F1.settingApiKey.appointTime]) {
          hasOptions = true
          isOnlyQuick = false
        }
        if (selectedFunction.settingsData[F1.settingApiKey.blendSpeed]) {
          hasOptions = true
          isOnlyQuick = false
        }
        if (selectedFunction.settingsData[F1.settingApiKey.blendDuration]) {
          hasOptions = true
          isOnlyQuick = false
        }
        if (selectedFunction.settingsData[F1.settingApiKey.setKeepWarmTime]) {
          hasOptions = true
          if (isOnlyQuick === undefined) {
            isOnlyQuick = true
          }
        }
        this.functionConfigInit(selectedFunction)
        let cookTime = selectedFunction.settingsData[F1.settingApiKey.workStatus].properties.cookTime
        let workTime = selectedFunction.cookTimeLabel || cookTime + '分钟'
        // 设置参数设置对话框描述
        selectedFunction.desc = workTime
        this.setData({ selectedFunction })
        if (!hasOptions || isOnlyQuick) {
          let confirmTitle = functionItem.name + '\r\n\r\n约用时' + workTime + '\r\n是否确认启动设备'
          let keepWarmCodeIndex = F1.keepWarmCode.indexOf(Number(selectedFunction.code))
          if (!cookTime && keepWarmCodeIndex > -1) {
            confirmTitle = functionItem.name + '\r\n\r\n约用时360分钟\r\n是否确认启动设备'
          }
          wx.showModal({
            title: confirmTitle,
            confirmText: '启动',
            success: (res) => {
              if (res.confirm) {
                this.startWork()
              }
            },
          })
        } else {
          this.showSettingModal()
        }
      } while (false)
    },
    // 根据功能判断杯体状态
    checkCupStatusByMenu({ attributes, menuId }) {
      let isError = false
      console.log('根据功能判断杯体状态: ', menuId, attributes)
      if (attributes) {
        let isRequireReceiveSerousCup = attributes.properties['isRequireReceiveSerousCup']
        let currentHasReceiveSerousCup = Number(F1.statusData.flag_receive_serous_cup) === 1
        let currentHasLiquidWasteCup = Number(F1.statusData.flag_liquid_waste_cup) === 1
        switch (isRequireReceiveSerousCup) {
          case '0':
            // 不需要接浆杯
            if (currentHasReceiveSerousCup) {
              MideaToast('请取出接浆杯')
              isError = true
            }
            break
          case '1':
            // 需要接浆杯
            if (!currentHasReceiveSerousCup) {
              MideaToast('请放入接浆杯')
              isError = true
            }
            break
          case 'null':
            // 不需要
            break
          default:
            // 非清洁功能且是全自动
            if (F1.isSmartDevice() && !this.isCleanMenu(menuId)) {
              if (!currentHasReceiveSerousCup) {
                isError = true
                MideaToast('请放入接浆杯')
              }
            }
            break
        }
        // 是否需要废水杯
        let isRequireReceiveWasteCup = attributes.properties['isRequireReceiveWasteCup']
        // nativeService.alert('废水杯: '+this.currentHasLiquidWasteCup+' / '+JSON.stringify(isRequireReceiveWasteCup,null,2));
        switch (isRequireReceiveWasteCup) {
          case '0':
            // 不需要废水杯
            if (currentHasLiquidWasteCup) {
              isError = true
              MideaToast('请取出废水杯')
            }
            break
          case '1':
            // 需要废水杯
            if (!currentHasLiquidWasteCup) {
              isError = true
              MideaToast('请放入废水杯')
            }
            break
          default:
            // 默认不限制
            break
        }
      }
      return isError
    },
    // 选中功能是否清洗功能
    isCleanMenu(menuId) {
      menuId = Number(menuId)
      return menuId === 71 || menuId === 92 || menuId === 94 || menuId === 95
    },
    // 功能配置初始化
    functionConfigInit(selectedFunction) {
      // console.log('当前功能：', selectedFunction)
      let settingParam = {
        workSpeed: undefined,
        isKeepWarm: undefined,
        mouthFeel: undefined,
        waterAmount: undefined,
      }
      // 口感
      let mouthFeelData = selectedFunction.settingsData[F1.settingApiKey.mouthFeel]
      if (mouthFeelData) {
        settingParam.mouthFeel = mouthFeelData.properties.defaultValue
      }
      // 水量
      let sliderWaterAmount = parseComponentModel(this.data.sliderWaterAmount)
      let waterAmountSelectData = selectedFunction.settingsData[F1.settingApiKey.waterAmountSelect]
      let waterAmountConfig = this.data.waterAmountConfig
      if (waterAmountSelectData) {
        let waterAmountOptions = waterAmountSelectData.properties.range
        console.log('水量：', waterAmountOptions)
        settingParam.waterAmount = Number(waterAmountSelectData.properties.defaultValue)
        if (waterAmountOptions[0].value == 0 && waterAmountOptions.length > 4) {
          waterAmountOptions.splice(0, 1)
        }
        if (waterAmountOptions.length > 4) {
          waterAmountConfig.isShowSlider = false
          waterAmountConfig.isShowSelector = true
        } else if (waterAmountOptions.length === 1 && waterAmountOptions[0].hasOwnProperty('max')) {
          waterAmountConfig.isShowSlider = true
          waterAmountConfig.isShowSelector = false
          let interval = Number(waterAmountOptions[0].step)
          let min = Number(waterAmountOptions[0].min)
          let max = Number(waterAmountOptions[0].max)
          let currentValue = settingParam.waterAmount
          let valueArray = []
          let waterAmountData = this.data.waterAmountData
          waterAmountData.resultLabel = currentValue + 'ml'
          if (Math.floor((max - min) / interval) < 6) {
            for (let i = min; i <= max; i = i + interval) {
              if (i % interval === 0) {
                valueArray.push({ value: i, label: i.toString() })
              }
            }
          } else {
            valueArray = [
              { value: min, label: min },
              { value: max, label: max },
            ]
          }
          waterAmountData.hasNoWaterValue = false
          // 判断是否有不加水设置
          let ownList = waterAmountSelectData.properties.ownList
          for (let i = 0; i < ownList.length; i++) {
            let item = ownList[i]
            if (item.min && item.min === item.max && Number(item.min) === 0) {
              // 不进水
              waterAmountData.hasNoWaterValue = true
              waterAmountData.resultLabel = item.name
              currentValue = min = min - interval
              valueArray[0] = {
                value: min,
                label: item.name,
              }
              break
            }
          }
          sliderWaterAmount = {
            max,
            min,
            interval,
            valueArray,
            currentValue,
          }
          this.setData({ waterAmountData })
        } else {
          waterAmountConfig.isShowSlider = false
          waterAmountConfig.isShowSelector = false
        }
      }
      // 转换参数类型
      sliderWaterAmount = parseToString(sliderWaterAmount)
      // 工作速度
      let workSpeedSlider = parseComponentModel(this.data.workSpeedSlider)
      let workSpeedConfig = this.data.workSpeedConfig
      let blendSpeedData = selectedFunction.settingsData[F1.settingApiKey.blendSpeed]
      if (blendSpeedData) {
        let blendSpeedOptions = blendSpeedData.properties.options
        settingParam.workSpeed = Number(blendSpeedData.properties.defaultValue)
        if (blendSpeedOptions.length > 3) {
          workSpeedConfig.isShowSlider = true
          let valueArray = []
          workSpeedSlider.min = Number(blendSpeedOptions[0].value)
          workSpeedSlider.max = Number(blendSpeedOptions[blendSpeedOptions.length - 1].value)
          workSpeedSlider.currentValue = settingParam.workSpeed
          workSpeedSlider.width = '86%'
          blendSpeedOptions.forEach((optionItem) => {
            if (optionItem.text == 'L') {
              workSpeedSlider.width = '80%'
              workSpeedSlider.min = 0
              valueArray.unshift({
                value: 0,
                label: optionItem.text,
              })
            } else {
              if (optionItem.text == 'H') {
                optionItem.value = blendSpeedOptions.length - 1
                workSpeedSlider.max = optionItem.value
              }
              valueArray.push({
                value: Number(optionItem.value),
                label: optionItem.text,
              })
            }
          })
          workSpeedSlider.valueArray = valueArray
        } else {
          workSpeedConfig.isShowSlider = false
        }
      }
      workSpeedSlider = parseComponentModel(workSpeedSlider)
      // 工作时间
      let blendDurationData = selectedFunction.settingsData[F1.settingApiKey.blendDuration]
      if (blendDurationData) {
        let workTimeProperties = blendDurationData.properties
        if (workTimeProperties) {
          if (workTimeProperties.min == workTimeProperties.max) {
            this.workTimeDataInit(blendDurationData)
            this.confirmWorkTime()
          }
        }
      }
      this.setData({
        settingParam,
        workSpeedConfig,
        workSpeedSlider,
        sliderWaterAmount,
        waterAmountConfig,
      })
    },
    // 启动功能
    onClickControl(controlParams) {
      return new Promise((resolve, reject) => {
        UI.showLoading()
        this.clearDeviceStatusInterval()
        let interval = 6000
        let deviceInfo = this.data.deviceInfo
        if (deviceInfo.isNew) {
          interval = 6000
        }

        this.requestControl({
          control: controlParams,
        })
          .then((res) => {
            UI.hideLoading()
            this.dataInit(res.data.data.status)
            let deviceStatus = res.data.data.status
            let workTime = deviceStatus.remain_work_time_sec
            if (workTime && workTime < 60) {
              interval = 6000
            }
            this.deviceStatusInterval(interval)
            resolve()
          })
          .catch((err) => {
            console.log(err)
            let res = err
            do {
              UI.hideLoading()
              if (res.data.code != 0) {
                let msg = F1.handleErrorMsg(res.data.code)
                MideaToast(msg)
                break
              }
              this.dataInit(res.data.data.status)
              this.deviceStatusInterval(interval)
            } while (false)
          })
        let clickId = 'start'
        switch (controlParams.work_status) {
          case F1.workStatus.schedule:
            clickId = 'appoint'
            break
        }
        clickId = clickId + '_function_no_' + controlParams.code_id
        if (controlParams.power == 'off') {
          clickId = 'cancel_work'
        }
      })
    },
    // 预约时间选择
    scheduleDataOnStart() {
      let scheduleData = this.data.scheduleData
      scheduleData.isSelecting = true
      this.setData({ scheduleData })
    },
    scheduleDataOnEnd() {
      let scheduleData = this.data.scheduleData
      scheduleData.isSelecting = false
      this.setData({ scheduleData })
    },
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
          console.log(startMin)
          // 设置分钟数据
          for (let i = startMin; i <= 60; i++) {
            if (i === 60) {
              minutes.push(0)
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
          for (let i = 0; i <= nowHour - (maxHours % 24); i++) {
            hours.push(i)
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
    // 预约开关切换
    scheduleSwitchChange(event) {
      let model = event.detail
      let selectedFunction = this.data.selectedFunction
      let appointTime = selectedFunction.settingsData[F1.settingApiKey.appointTime]
      let cookTime = selectedFunction.settingsData[F1.settingApiKey.workStatus].properties.cookTime
      if (model.selected) {
        // 打开预约窗口
        this.scheduleDataInit({ appointTime, cookTime })
        this.confirmSchedule()
        // this.showScheduleModal();
      } else {
        this.cancelSchedule()
      }
      this.setData({
        scheduleSwitch: parseComponentModel(model),
      })
    },
    // 保温开关改变
    switchKeepWarmChange(event) {
      let model = event.detail
      let settingParam = this.data.settingParam
      if (model.selected) {
        settingParam.isKeepWarm = true
      } else {
        settingParam.isKeepWarm = false
      }
      this.setData({ settingParam })
    },
    // 预约对话框参数设置
    scheduleDataInit({ appointTime, cookTime }) {
      // console.log('预约时间初始化: ',appointTime);
      let appointTimeData = appointTime.properties
      // let appointTimeDataMin = Number(appointTimeData.min)+Number(cookTime);
      let appointTimeDataMin = Number(appointTimeData.min)
      let scheduleData = this.data.scheduleData
      let hours = []
      let minutes = []
      let minHours = Math.floor(appointTimeDataMin / 60)
      let minMinutes = appointTimeDataMin % 60
      let maxHours = Math.floor(appointTimeData.max / 60)
      let maxMinutes = appointTimeData.max % 60
      // 获取当前时间
      let nowDate = new Date()
      // 设置小时数据
      let nowHour = nowDate.getHours()
      let nowMin = nowDate.getMinutes()
      // 默认预约时间
      let defaultValue = Number(appointTimeData.defaultValue)
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
        for (let i = 0; i <= nowHour - (maxHours % 24); i++) {
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
      // console.log('预约时间初始化 结果: ',scheduleData);
      this.setData({ scheduleData, nowDate })
    },
    // 选择杯子类型
    selectCubType(event) {
      do {
        let index = 0
        if (typeof event === 'number') {
          index = event
        } else {
          index = event.currentTarget.dataset.index
        }
        let selectedCupType = this.data.selectedCupType
        let optionsWrapperWidth = this.data.defaultData.optionsWrapperWidth
        let translateX = -index * optionsWrapperWidth
        let optionsWrapper = this.data.optionsWrapper
        optionsWrapper.translateX = translateX
        selectedCupType = index
        this.fixOptionsWrapperHeightByOptions(index)
        this.setData({ optionsWrapper, selectedCupType })
      } while (false)
    },
    // 选择口感
    selectMouthFeel(event) {
      let value = event.currentTarget.dataset.value
      let settingParam = this.data.settingParam
      settingParam.mouthFeel = value
      this.setData({ settingParam })
    },
    // 选择水量
    selectWaterAmount(event) {
      let value = event.currentTarget.dataset.value
      console.log(value)
      let settingParam = this.data.settingParam
      settingParam.waterAmount = value
      this.setData({ settingParam })
    },
    // 选择搅拌速度
    selectWorkSpeed(event) {
      let value = event.currentTarget.dataset.value
      let settingParam = this.data.settingParam
      settingParam.workSpeed = value
      this.setData({ settingParam })
    },
    // 重置参数设置对话框
    settingModalInit() {
      let scheduleSwitch = parseComponentModel(this.data.scheduleSwitch)
      scheduleSwitch.selected = false
      scheduleSwitch = parseComponentModel(scheduleSwitch)
      let scheduleData = {
        value: [0, 0, 0, 0, 0],
        day: [],
        hours: [],
        minutes: [],
        result: undefined,
        resultLabel: undefined,
      }
      let workTimeData = this.data.workTimeData
      workTimeData = {
        isShowModal: false,
        value: [0, 0, 0, 0],
        minutes: [],
        seconds: [],
        result: undefined,
        resultLabel: undefined,
      }
      this.setData({ scheduleSwitch, scheduleData, workTimeData })
    },
    // 显示顶部通知栏
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
        let cupTypeBadge = this.data.cupTypeBadge
        cupTypeBadge.isShow = false
        noticeBar.isShow = true
        noticeBar.content = content
        this.setData({ noticeBar, cupTypeBadge })
      } while (false)
    },
    // 显示参数设置对话框
    showSettingModal() {
      let settingModal = this.data.settingModal
      let isCouldZero = this.data.isCouldZero
      let currentAmount = this.data.currentAmount
      let currentSpeed = parseComponentModel(this.data.workSpeedSlider).currentValue
      settingModal.isShow = true
      let sliderWaterAmount = parseComponentModel(this.data.sliderWaterAmount)
      if (isCouldZero) {
        currentAmount = 0
      } else {
        currentAmount = sliderWaterAmount.min
      }

      this.setData({ settingModal, currentAmount, currentSpeed })
    },
    // 显示预约时间对话框
    showScheduleModal() {
      let scheduleModal = this.data.scheduleModal
      scheduleModal.isShow = true
      this.setData({ scheduleModal })
    },
    // 显示水量对话框
    showWaterAmountModal() {
      console.log('显示水量对话框')
      let selectedFunction = this.data.selectedFunction
      let waterAmountSelect = selectedFunction.settingsData[F1.settingApiKey.waterAmountSelect]
      this.waterAmountDataInit(waterAmountSelect)
      let waterAmountData = this.data.waterAmountData
      waterAmountData.isShowModal = true
      this.setData({ waterAmountData })
    },
    // 显示工作时间对话框
    showWorkTimeModal() {
      do {
        let selectedFunction = this.data.selectedFunction
        let blendDuration = selectedFunction.settingsData[F1.settingApiKey.blendDuration]
        let workTimeProperties = blendDuration.properties
        if (workTimeProperties) {
          if (workTimeProperties.min == workTimeProperties.max) {
            break
          }
        }
        this.workTimeDataInit(blendDuration)
        let workTimeData = this.data.workTimeData
        workTimeData.isShow = true
        this.setData({ workTimeData })
      } while (false)
    },
    sliderWaterAmountChange(event) {
      let model = event.detail
      // console.log('水量滑块',model);
      let waterAmountData = this.data.waterAmountData
      if (model.valueArray.length < 6) {
        let targetValue = model.valueArray.find((item) => item.value === model.currentValue)
        if (targetValue && !Number(targetValue.label)) {
          waterAmountData.resultLabel = targetValue.label
        } else {
          waterAmountData.resultLabel = model.currentValue + 'ml'
        }
      }
      // 查找默认工作时间配置
      let workTimeLabel = this.setDefaultWorkTimeLabel(model.currentValue)
      // 修改默认值
      let configList = this.data.configList
      let selectedFunction = this.data.selectedFunction
      // 查找当前选中功能
      for (let i = 0; i < configList.length; i++) {
        let cupTypeItem = configList[i]
        let targetFunction = cupTypeItem.functions.find((item) => item.code === selectedFunction.code)
        if (targetFunction) {
          // console.log('修改默认值: ',targetFunction,configList,selectedFunction)
          // 修改水量默认值
          let waterAmountSelectData = targetFunction.settingsData[F1.settingApiKey.waterAmountSelect]
          if (waterAmountSelectData) {
            waterAmountSelectData.properties.defaultValue = model.currentValue
          }
          // 修改工作时间显示
          let workStatusData = targetFunction.settingsData[F1.settingApiKey.workStatus]
          if (workStatusData) {
            workStatusData.properties.cookTime = workTimeLabel || workStatusData.properties.cookTime
          }
          this.setData({ configList })
          break
        }
      }
      this.setData({
        sliderWaterAmount: parseComponentModel(model),
        waterAmountData,
      })
    },
    // 查找默认工作时间配置
    setDefaultWorkTimeLabel(waterInflow, targetFunction) {
      waterInflow = Number(waterInflow)
      let selectedFunction = targetFunction || this.data.selectedFunction
      let defaultWorkTimeTable = this.data.devicePropertiesData.defaultWorkTimeTable
      let workTimeLabel = ''
      if (defaultWorkTimeTable) {
        let selectedFunctionWorkTimeTable = defaultWorkTimeTable.item.filter(
          (item) => Number(item.modeID) === Number(selectedFunction.code)
        )
        if (selectedFunctionWorkTimeTable && selectedFunctionWorkTimeTable.length > 0) {
          selectedFunctionWorkTimeTable.forEach((selectedWorkTimeItem) => {
            let min = Number(selectedWorkTimeItem.min)
            let max = Number(selectedWorkTimeItem.max)
            if (waterInflow >= min && waterInflow <= max) {
              workTimeLabel = selectedWorkTimeItem.workTime
              selectedFunction.desc = workTimeLabel + '分钟'
              this.setData({ selectedFunction })
            }
          })
        }
      }
      return workTimeLabel
    },
    // 搅拌速度滑块参数改变
    sliderWorkSpeedChange(event) {
      let model = event.detail
      this.setData({
        workSpeedSlider: parseComponentModel(model),
        currentSpeed: model.currentValue,
      })
    },
    // 开始烹饪
    startWork() {
      do {
        let data = this.data
        let deviceInfo = data.deviceInfo
        let settingParam = data.settingParam
        let scheduleData = data.scheduleData
        let selectedFunction = data.selectedFunction
        let workTimeData = data.workTimeData
        let workSpeedConfig = data.workSpeedConfig
        let waterAmountConfig = data.waterAmountConfig
        let workSpeedSlider = parseComponentModel(data.workSpeedSlider)
        let sliderWaterAmount = parseComponentModel(data.sliderWaterAmount)
        if (!deviceInfo.enabledCupLid) {
          this.showNoticeBar('设备已开盖，请合盖后继续烹饪')
          break
        }
        // 根据功能判断杯体状态
        let isCupStatusError = this.checkCupStatusByMenu({
          menuId: selectedFunction.code,
          attributes: selectedFunction.settingsData.workStatus,
        })
        if (isCupStatusError) {
          return
        }

        // 是否工作中
        if (deviceInfo.isRunning) {
          MideaToast('设备工作中，请稍后再试')
          break
        }
        // 冷杯/研磨杯
        if (Number(deviceInfo.status.cup_status) === 2) {
          MideaToast('由于安全问题，当前功能不支持APP启动\n请在设备上手动启动')
          break
        }
        // 控制参数
        let controlParams = {
          code_id: selectedFunction.code,
          work_mode: selectedFunction.code,
        }
        if (!deviceInfo.isNew) {
          controlParams.power = 'on'
        } else {
          controlParams.work_switch = F1.workSwitch.work
          controlParams.sub_cmd = '1'
        }
        // 口感
        if (selectedFunction.settingsData[F1.settingApiKey.mouthFeel]) {
          if (settingParam.mouthFeel) {
            controlParams.mouthfeel = settingParam.mouthFeel
          } else {
            MideaToast('请选择口感')
            break
          }
        }
        // 水量
        let waterAmountData = data.waterAmountData
        if (selectedFunction.settingsData[F1.settingApiKey.waterAmountSelect]) {
          if (waterAmountConfig.isShowSlider) {
            settingParam.waterAmount = sliderWaterAmount.currentValue
          }
          if (waterAmountConfig.isShowSelector) {
            settingParam.waterAmount = waterAmountData.result
          }
          if (!settingParam.waterAmount) {
            MideaToast('请选择水量')
            break
          }
          controlParams.water_inflow = settingParam.waterAmount
          // 判断当前值是否不进水
          if (waterAmountData.hasNoWaterValue) {
            if (sliderWaterAmount.min === sliderWaterAmount.currentValue) {
              controlParams.water_inflow = 0
            }
          }
        }
        // 搅拌时间与速度
        if (selectedFunction.settingsData[F1.settingApiKey.blendSpeed]) {
          if (workSpeedConfig.isShowSlider) {
            workSpeedSlider.valueArray.forEach((valueItem) => {
              if (valueItem.value === workSpeedSlider.currentValue) {
                settingParam.workSpeed = valueItem.label
              }
            })
          }
          if (!settingParam.workSpeed) {
            MideaToast('请选择搅拌速度')
            break
          }
          controlParams.speed = settingParam.workSpeed
        }
        if (selectedFunction.settingsData[F1.settingApiKey.blendDuration]) {
          if (!workTimeData.result) {
            MideaToast('请选择搅拌时间')
            break
          }
          if (!deviceInfo.isNew) {
            controlParams.set_work_time = workTimeData.result
          } else {
            controlParams.set_work_time_sec = workTimeData.result
          }
        }
        // 是否保温
        let keepWarmCodeIndex = F1.keepWarmCode.indexOf(Number(selectedFunction.code))
        if (settingParam.isKeepWarm || keepWarmCodeIndex > -1) {
          controlParams.set_keep_warm_temp = '55'
          if (deviceInfo.isNew) {
            controlParams.set_keep_warm_time_sec = (360 * 60).toString()
          } else {
            controlParams.set_keep_warm_time = '360'
          }
        }
        // 预约
        if (scheduleData.result) {
          controlParams.work_status = F1.workStatus.schedule
          controlParams.work_switch = F1.workSwitch.schedule
          // let cookTime = selectedFunction.settingsData[F1.settingApiKey.workStatus].properties.cookTime;
          // scheduleData.result = scheduleData.result - Number(cookTime);
          if (!deviceInfo.isNew) {
            controlParams.appoint_time = Math.floor(scheduleData.result)
          } else {
            controlParams.set_appoint_time_sec = Math.floor(scheduleData.result * 60)
          }
        }
        // console.log(controlParams);
        // break;
        this.closeSettingModal()
        this.onClickControl(controlParams)
      } while (false)
    },
    // 停止工作
    stopWork() {
      let content = '是否结束设备工作'
      let deviceInfo = this.data.deviceInfo
      let workStatus = Number(deviceInfo.workStatus)
      switch (workStatus) {
        case F1.workStatus.working:
          content = '美味仍未完成\r\n是否结束设备工作'
          break
        case F1.workStatus.schedule:
          content = '是否结束当前预约'
          break
      }
      wx.showModal({
        title: content,
        confirmText: '结束',
        success: (res) => {
          if (res.confirm) {
            let controlParams = {
              power: 'off',
            }
            if (deviceInfo.isNew) {
              controlParams = {
                work_switch: 'cancel',
                sub_cmd: '1',
                work_mode: '0',
              }
            }
            this.onClickControl(controlParams).then((res) => {
              MideaToast('设备已结束工作')
            })
          }
        },
      })
    },
    // 获取设备信息
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
                let msg = F1.handleErrorMsg(res.data.code)
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
              // 判断设备是否故障
            } while (false)
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
                  let msg = F1.handleErrorMsg(res.code)
                  MideaToast(msg)
                  break
                }
                MideaToast('未知错误-状态')
              } while (false)
            }
            resolve()
          })
      })
    },
    // 水量对话框参数设置
    waterAmountDataInit(waterAmountSelect) {
      console.log(waterAmountSelect)
      let waterAmountData = this.data.waterAmountData
      waterAmountData.valueArray = waterAmountSelect.properties.range
      this.setData({ waterAmountData })
    },
    // 工作对话框参数设置
    workTimeDataInit(workTime) {
      let workTimeProperties = workTime.properties
      let workTimeData = this.data.workTimeData
      // 获取当前时间
      let nowDate = new Date()
      let maxMinutes = Math.floor(workTimeProperties.max / 60)
      let maxSeconds = workTimeProperties.max - maxMinutes * 60
      let minMinutes = Math.floor(workTimeProperties.min / 60)
      let minSecond = workTimeProperties.min
      if (minMinutes !== 0) {
        minSecond = minSecond - 60
      }
      workTimeData.minutes = []
      workTimeData.seconds = []
      for (let i = minMinutes; i <= maxMinutes; i++) {
        workTimeData.minutes.push(i)
      }
      for (let j = minSecond; j < 60; j++) {
        workTimeData.seconds.push(j)
      }
      if (maxMinutes == minMinutes) {
        workTimeData.seconds.push(0)
      }
      let min = workTimeData.minutes[workTimeData.value[1]]
      if (maxMinutes == min) {
        workTimeData.seconds = [0]
      }
      workTimeData.minSecond = minSecond
      workTimeData.minMinutes = minMinutes
      workTimeData.maxSeconds = maxSeconds
      workTimeData.maxMinutes = maxMinutes
      this.setData({ workTimeData, nowDate })
    },
    // 工作时间选择
    workTimeDataOnStart() {
      let workTimeData = this.data.workTimeData
      workTimeData.isSelecting = true
      this.setData({ workTimeData })
    },
    workTimeDataOnEnd() {
      let workTimeData = this.data.workTimeData
      workTimeData.isSelecting = false
      this.setData({ workTimeData })
    },
    workTimeOnChange(e) {
      // 数据联动修改
      let val = e.detail.value
      let workTimeData = this.data.workTimeData
      console.log('工作时间选择: ', workTimeData)
      do {
        if (workTimeData.maxMinutes == workTimeData.minMinutes) {
          break
        }
        if (val && val.length > 0) {
          let min = workTimeData.minutes[val[1]]
          let seconds = []
          let startSecond = 0
          let endSecond = 60
          if (min === 0) {
            startSecond = workTimeData.minSecond
          } else if (min === workTimeData.maxMinutes) {
            startSecond = 0
            endSecond = workTimeData.maxSeconds + 1
          }
          for (let i = startSecond; i < endSecond; i++) {
            seconds.push(i)
          }
          workTimeData.seconds = seconds
          workTimeData.value = val
        }
      } while (false)

      this.setData({ workTimeData })
    },
    // 水量选择器改变
    waterSelectorOnChange(e) {
      // 数据联动修改
      let val = e.detail.value
      if (val && val.length > 0) {
        let waterAmountData = this.data.waterAmountData
        waterAmountData.value = val
        this.setData({ waterAmountData })
      }
    },
    // endregion

    // region 2021.09.08 之前代码
    initPickerTime() {
      // 初始化预约组件代码 预约时间为2h-12h 默认6h
      let obj = {}
      obj.hours = []
      obj.minutes = []
      obj.finish = ['完成']
      let { hour, minute } = getTimeRange(2, 12)
      for (let i = hour[0]; i <= hour[1]; i++) {
        if (i >= 24) {
          obj.hours.push('明天' + (i - 24) + '时')
        } else {
          obj.hours.push(i + '时')
        }
      }
      for (let j = minute[0]; j <= minute[1]; j++) {
        obj.minutes.push(j + '分')
      }

      this.setData({
        listData: obj,
      })
    },
    // getActived() {
    //   try {
    //     let intervalKey = wx.getStorageSync('F1Interval'+this.properties.applianceData.applianceCode);
    //     if (intervalKey) {
    //       clearInterval(intervalKey);
    //     }
    //   } catch (e) {
    //     console.error(e)
    //   }
    //
    //   let checkStatus = setInterval(() => {
    //     this.updateStatus(false)
    //   }, 5000);
    //
    //   wx.setStorage({
    //     key: 'F1Interval'+this.properties.applianceData.applianceCode,
    //     data: checkStatus,
    //   })
    //   this.updateStatus();
    //   // this.triggerEvent('modeChange', this.getCurrentMode());//向上层通知mode更改
    //   console.log('f1 actived')
    // },
    requestControl(command) {
      // 埋点
      let params = {
        control_params: JSON.stringify(command),
      }
      this.rangersBurialPointClick('plugin_button_click', params)
      wx.showNavigationBarLoading()
      return requestService.request('luaControl', {
        applianceCode: this.properties.applianceData.applianceCode,
        command: command,
        reqId: getStamp().toString(),
        stamp: getStamp(),
      })
    },
    processTouch(event) {},
    checkCup() {
      // 检查杯子类型
      let { cup_status, lid_status } = this.data._applianceDataStatus
      return cup_status == 'hot_cup' && lid_status == 'have_cup'
    },
    computePower() {
      //渲染电源按钮 中间那个圈和文字
      let { work_status, code_id, current_time } = this.data._applianceDataStatus

      let power = {},
        showText = true,
        circleSrc = '',
        showWorkingText = false,
        workingText = '',
        showWorkingStatus = false,
        workingStatus = '',
        finishTime = '',
        showFinishTime = false
      if (work_status == STATUS.STANDBY) {
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
      } else if (work_status == STATUS.APPOINT) {
        // 预约显示黄色圈
        power = {
          mainImg: this.data.powerImg.on,
          desc: '开机',
        }
        circleSrc = this.data.circleImg.yellow
        showText = false
        showWorkingText = true
        workingText = `今天${getAppointFinishTime(current_time)}完成`
        workingStatus = getTextByStatus(work_status)
        showWorkingStatus = true
        showFinishTime = true
        finishTime = `约用时${getWorkTimeById(code_id)}分钟`
        this.iconToggle(getModelNameById(code_id))
      } else if (work_status == STATUS.WORKING) {
        power = {
          mainImg: this.data.powerImg.off,
          desc: '关机',
        }
        circleSrc = this.data.circleImg.red
        showText = false
        showWorkingText = true
        workingText = `今天${getWorkFinishTime(current_time)}完成`
        workingStatus = getTextByStatus(work_status)
        showWorkingStatus = true
        showFinishTime = true
        finishTime = `约用时${getWorkTimeById(code_id)}分钟`
        this.iconToggle(getModelNameById(code_id))
      } else {
        // 其他显示待机黄色圈
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
      let { code_id, work_status } = this.data._applianceDataStatus

      let mode = {
        zalianghu: {},
        wugujiang: {},
        yingerhu: {},
        yingerzhou: {},
        yingyangzheng: {},
        nongtang: {},
      }
      modeList.map((item) => {
        mode[item] = {
          desc: modeDesc[item],
          mainImg: '',
        }

        if (code_id == this.data.menuId[item]) {
          if (work_status == 2) {
            mode[item].mainImg = this.data.modeImg[item].on
          } else {
            mode[item].mainImg = this.data.modeImg[item].appoint
          }
        } else {
          mode[item].mainImg = this.data.modeImg[item].off
        }
      })
      this.setData({
        zalianghu: mode.zalianghu,
        wugujiang: mode.wugujiang,
        yingerhu: mode.yingerhu,
        yingerzhou: mode.yingerzhou,
        yingyangzheng: mode.yingyangzheng,
        nongtang: mode.nongtang,
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
    work(menuId, appointTime = 0) {
      let params = {
        code_id: getMenuIdByKey(menuId),
        work_mode: getMenuIdByKey(menuId),
        power: 'on',
      }
      // 当传入预约时间时则为预约
      if (appointTime != 0) {
        if (appointTime > 120 && appointTime < 720) {
          params.appoint_time = appointTime
          params.work_status = 1
        } else {
          // 预约时间过短则退出
          wx.showToast({
            title: '预约的时间范围应在2-12小时之间，请重新选择时间',
            icon: 'none',
          })
          return false
        }
      }

      // 检查杯子
      if (!this.checkCup()) {
        wx.showToast({
          title: '请放置好热杯',
          icon: 'none',
        })
        return false
      }

      this.requestControl({
        control: { ...params },
      })
        .then((res) => {
          wx.hideNavigationBarLoading()
          this.updateStatus()
        })
        .catch((err) => {
          wx.hideNavigationBarLoading()
        })
      return true
    },
    cancelWork() {
      this.requestControl({
        control: {
          power: 'off',
        },
      })
        .then((res) => {
          wx.hideNavigationBarLoading()
        })
        .catch((err) => {
          wx.hideNavigationBarLoading()
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
            that.updateStatus()
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
        modelHidden: ['zalianghu', 'wugujiang', 'yingerhu', 'yingerzhou', 'yingyangzheng', 'nongtang'],
        rowClass1: 'row-sb',
        rowClass2: 'row-sb',
      })
    },
    iconToggle(id) {
      let tmp = this.data.modelHidden

      for (let i = 0; i < tmp.length; i++) {
        if (tmp[i].indexOf(id) == -1) {
          tmp[i] = ''
        }
      }

      this.setData({
        modelHidden: tmp,
        btnShowStatus: true,
        rowClass1: 'row-sb-1',
        rowClass2: 'row-sb-2',
      })
    },
    modeToggle(e) {
      //点击模式按钮
      let that = this
      let { work_status } = this.data._applianceDataStatus
      if (work_status == 0 || work_status == 3) {
        wx.showActionSheet({
          itemList: ['启动', '预约'],
          success(res) {
            if (res.tapIndex == 1) {
              // 预约
              that._openPick(e.target.id)
            } else if (res.tapIndex == 0) {
              // 启动
              that.work(e.target.id)
              // that.iconToggle(e.target.id);
            }
            that.updateStatus()
          },
        })
      }
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
    _sure(e) {
      // 预约组件回调
      let { detail } = e
      let appointTime = this.calAppointTime(detail)

      let res = this.work(this.data.currentMenuId, appointTime)
      setTimeout(() => {
        if (!res) {
          this.setData({
            openPicker: false,
            currentMenuId: 0,
          })
          return
        }

        this.iconToggle(this.data.currentMenuId)

        this.setData({
          openPicker: false,
          currentMenuId: 0,
        })
      }, 50)
    },
    _close(e) {
      this.setData({ openPicker: false, currentMenuId: 0 })
    },
    _openPick(currentMenuId) {
      this.setData({ openPicker: true, currentMenuId })
    },
    // getCurrentMode() {
    //   let mode
    //   if (this.data._applianceData.onlineStatus == 0) {
    //     mode = CARD_MODE_OPTION.OFFLINE
    //   } else {
    //     if (this.data._applianceDataStatus.work_status == '2') {
    //       mode = CARD_MODE_OPTION.BOIL
    //     } else {
    //       mode = CARD_MODE_OPTION.HEAT
    //     }
    //   }
    //   return {
    //     applianceCode: this.data.applianceData.applianceCode,
    //     mode,
    //   }
    // },
    // 埋点
    rangersBurialPointClick(eventName, param) {
      let deviceInfo = this.data.deviceInfo
      if (deviceInfo) {
        let paramBurial = {}
        let paramBase = {
          module: '插件',
          apptype_name: '破壁机',
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
    do {
      if (DeviceData.isDebug) {
        break
      }
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
        // UI.showLoading();
        this.getProductConfig().then(() => {
          // this.setData({isInit:true});
          this.updateStatus().then(() => {
            this.setData({ isInit: true })
            this.fixOptionsWrapperHeightByOptions(0)
            let configList = this.data.configList
            for (let i = 0; i < configList.length; i++) {
              let configItem = configList[i]
              if (configItem.cupType == deviceInfo.cupType) {
                this.selectCubType(i)
                break
              }
            }
            // UI.hideLoading();
            this.deviceStatusInterval()
          })
        })
      })

      // this.initPickerTime();
    } while (false)
  },
})
