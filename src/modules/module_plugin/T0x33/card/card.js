const app = getApp()

const rangersBurialPoint = app.getGlobalConfig().rangersBurialPoint
const requestService = app.getGlobalConfig().requestService
import { getStamp } from 'm-utilsdk/index'
import {
  PluginConfig,
  addZero,
  getCurrentAppointTime,
  mm2HHmmText,
  workStatus2Text,
  mm2HHmmStr,
  getWorkFinishTime,
  sortObj,
} from './js/plugin-config.js'
import Dialog from 'm-ui/mx-dialog/dialog'
import { DeviceData } from '../assets/scripts/device-data'
import MideaToast from '../component/midea-toast/toast'
import { Format } from '../assets/scripts/format'
import { imageDomain, commonApi } from '../assets/scripts/api'
import { UI } from '../assets/scripts/ui'
import { RemoteControl } from '../sda-cloud-menu/js/api'

let deviceStatusTimer = null
let isDeviceInterval = true
let showingSettingModalTimer = null

let isShowingSettingModal = false
// const THEME_COLOR = '#FFAA10'
const DO_WHILE_RETURN = false

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
    deviceName: '',
    tabList: [
      {
        value: 0,
        label: '快捷烹饪',
      },
    ],
    // region 2021.12.01 ao
    bgImage: {
      url_bg: imageDomain + '/0x33/home_bg.png',
      url_device: imageDomain + '/0x33/device.png',
    },
    configList: [],
    quickDevJson: undefined,
    deviceInfo: {
      isOnline: false,
      isRunning: false,
      isWorking: false,
      workStatus: {},
      workStatusMap: {},
      statusButtonRightText: '',
      statusButtonRightTime: '',
      bgImage: imageDomain + '/0xFB/bg.png',
      isComplete: false,
    },
    pageProductConfig: {
      chooseTaste: {
        isShow: false,
        hasConfig: false,
      },
      windSpeed: {
        isShow: false,
        hasConfig: false,
      },
      temperature: {
        isShow: false,
        hasConfig: false,
        isShowSlider: true,
      },
      firePower: {
        isShow: false,
        hasConfig: false,
        valueArray: [],
      },
      workTime: {
        isShow: false,
        hasConfig: false,
      },
      turnStatus: {
        isShow: false,
        hasConfig: false,
      },
      appoint: {
        isShow: false,
        hasConfig: false,
      },
      preheat: {
        isShow: false,
        hasConfig: false,
      },
      light: {
        isShow: false,
        hasConfig: false,
      },
    },
    limitRateData: {
      rate: 0.35,
      extraHeight: 0,
    },
    isInit: false,
    selectedFunction: {},
    settingModal: {
      isShow: false,
      currentWindSpeedValue: '',
      currentfirePowerValue: '',
      currentTasteValue: '',
    },
    workTimeModal: {
      defaultValue: 0,
      currentText: '30分钟',
      min: 1,
      max: 60,
    },
    appointModal: {
      defaultValue: 0,
      currentText: '',
      isSwitch: false,
    },
    preheatModal: {
      color: '#FF8225',
      isSelected: false,
    },
    scheduleModal: {
      isShow: false,
    },
    switchTurn: {
      color: '#FF8225',
      selected: false,
    },
    switchLight: {
      isActive: true,
      color: '#FF8225',
      selected: false,
    },
    // 温度滑块数据
    sliderTemperature: {
      min: 40,
      max: 200,
      step: 5,
      currentValue: 200,
    },
    // 滑块底部数据
    sliderMarkList: [],
    iconUrl: {
      light: imageDomain + '/0x33/kit-light.png',
      arrowDownBlack: imageDomain + '/0x33/arrow-down-black.png',
      arrowRight: imageDomain + '/0x33/arrow-right.png',
      iconLight: imageDomain + '/0x33/icon-light.png',
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
    // 全部功能
    showAllControlItem: false,
    showAllControlItemText: '全部功能',
    currentFuncMinTime: '',
    currentFuncMaxTime: '',
    currentFuncLowTempToMaxTime: '',
    funcDefaultValue: '',
    errorTitle: '',
    errorSolution: '',
    currentSliderValue: '',
    // endregion
  },
  methods: {
    showAllControlItem() {
      this.setData({
        showAllControlItem: !this.data.showAllControlItem,
      })
      let showAllControlItemText = this.data.showAllControlItemText
      ;(showAllControlItemText = this.data.showAllControlItem ? '收起' : '全部功能'),
        this.setData({
          showAllControlItemText,
        })
    },
    // 回到顶部
    scrollToTop() {
      wx.pageScrollTo({
        scrollTop: 0,
      })
    },
    // 获取当前功能
    getCurrentFunction(workMode) {
      workMode = Number(workMode)
      let data = this.data
      let configList = data.configList
      let quickDevJson = data.quickDevJson
      let deviceInfo = this.data.deviceInfo
      let isSearched = false
      let currentFunction = {}
      if (configList && configList.length > 0) {
        for (let j = 0; j < configList.length; j++) {
          if (isSearched) {
            break
          }
          let functionItem = configList[j]
          if (workMode === functionItem.code) {
            currentFunction = functionItem
            isSearched = true
            break
          }
        }
      }
      // 查找过滤的功能
      if (!isSearched) {
        if (quickDevJson.extraFunctions && quickDevJson.extraFunctions.length > 0) {
          let functions = quickDevJson.extraFunctions
          for (let k = 0; k < functions.length; k++) {
            let functionItem = functions[k]
            if (functionItem.code === workMode) {
              currentFunction = functionItem
              isSearched = true
              break
            }
          }
        }
      }
      // 判断是否DIY
      if (!isSearched && workMode === 110000) {
        currentFunction.name = deviceInfo.extended.name
        isSearched = true
      }
      // 获取云食谱名称
      if (!isSearched) {
        if (!currentFunction || currentFunction.code !== workMode) {
          PluginConfig.getMenuName(workMode)
            .then((res) => {
              if (!res.data.errorCode) {
                let resultData = JSON.parse(res.data.result.returnData)
                if (resultData.retInfo) {
                  deviceInfo.currentFunction.code = workMode
                  deviceInfo.currentFunction.name = resultData.retInfo

                  this.setData({ deviceInfo })
                }
              }
            })
            .catch((err) => {})
        }
      }
      return currentFunction
    },
    getDeviceImg() {
      let deviceInfo = this.data.deviceInfo
      deviceInfo.deviceImg =
        deviceInfo && deviceInfo.sn8
          ? `http://ce-cdn.oss-cn-hangzhou.aliyuncs.com/ccs/icon/ctrl8/33/header/${deviceInfo.sn8}.png`
          : 'http://ce-cdn.oss-cn-hangzhou.aliyuncs.com/ccs/icon/ctrl8/33/device_image.png'
      this.setData({
        deviceInfo,
      })
    },
    // region 2021.12.01 - ao
    // endregion
    // 快开缓存
    setConfigStorage(data) {
      const sn8 = this.data.deviceInfo.sn8
      // 查询缓存key数组
      try {
        var value = wx.getStorageSync(`SDA_CONFIG_KEYS`)
        if (value) {
          if (value.length > 10) {
            const removeKey = value.shift()
            wx.removeStorage(removeKey)
          }
        } else {
          wx.setStorageSync(`SDA_CONFIG_KEYS`, [`config_${sn8}`])
        }
        wx.setStorageSync(`config_${sn8}`, data)
      } catch (e) {}
    },
    getConfigStorage() {
      const sn8 = this.data.deviceInfo.sn8
      return wx.getStorageSync(`config_${sn8}`)
    },
    dealConfigData(resData) {
      let data = this.data
      let errorCodeMap = resData.errorCodeMap
      const deviceInfo = data.deviceInfo
      let quickDevJson = { ...PluginConfig.quickDevJson2Local(resData), errorCodeMap }
      console.log('解析后的快开：', quickDevJson)

      let configList = []
      // 配置SN8
      PluginConfig.sn8 = deviceInfo.sn8
      // 是否支持暂停
      deviceInfo.isSupportPause = false
      if (quickDevJson.properties['setPauseStatus']) {
        deviceInfo.isSupportPause = quickDevJson.properties.setPauseStatus.defaultValue
      }
      // 是否有烧烤模式
      if (quickDevJson.properties['isGrill']) {
        deviceInfo.isGrill = quickDevJson.properties.isGrill.defaultValue
      }
      // 是否有门
      if (quickDevJson.properties['isDoor']) {
        deviceInfo.isDoor = quickDevJson.properties.isDoor.defaultValue
      }
      // 是否设置暂停状态
      if (quickDevJson.properties['setPauseStatus']) {
        deviceInfo.hasSetPauseStatus = quickDevJson.properties.setPauseStatus.defaultValue
      }
      // 炉灯设置
      let lightStatus = quickDevJson.properties[PluginConfig.apiKey.lightStatus]
      let pageProductConfig = data.pageProductConfig
      let limitRateData = this.data.limitRateData
      if (lightStatus) {
        pageProductConfig.light.hasConfig = true
        pageProductConfig.light.isShow = true
        limitRateData.extraHeight = limitRateData.extraHeight + 82
      }
      // 功能选项
      quickDevJson.functions.forEach((item) => {
        do {
          configList.push(item)
        } while (DO_WHILE_RETURN)
      })
      console.log('页面配置:', configList)
      this.setData({ configList, deviceInfo, quickDevJson, pageProductConfig })
      if (configList.length === 1) {
        this.functionConfigInit(configList[0])
      }
      if (configList.length > 6) {
        this.setData({
          showAllControlItem: false,
        })
      } else {
        this.setData({
          showAllControlItem: true,
        })
      }
    },
    // region 获取产品配置
    getProductConfig(bigVer) {
      return new Promise((resolve) => {
        let data = this.data
        let deviceInfo = data.deviceInfo
        if (deviceInfo.onlineStatus == DeviceData.onlineStatus.online) {
          deviceInfo.isOnline = true
          deviceInfo.bgImage = this.data.bgImage.url2
        } else {
          deviceInfo.isOnline = false
          deviceInfo.bgImage = this.data.bgImage.url1
          MideaToast('设备已离线，请检查网络状态')
        }
        this.setData({ deviceInfo })
        let productModelNumber = deviceInfo.modelNumber != 0 ? DeviceData.getAO(deviceInfo.modelNumber) : deviceInfo.sn8
        let method = 'POST'
        let sendParams = {
          applianceId: deviceInfo.applianceCode,
          productTypeCode: deviceInfo.type,
          userId: data.uid,
          productModelNumber: deviceInfo.sn8 || productModelNumber,
          bigVer: bigVer || 8,
          platform: 2, // 获取美居/小程序功能，2-小程序
        }
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
            do {
              let resData
              if (res.data.errorCode != 0) {
                resData = this.getConfigStorage()
                let msg = PluginConfig.handleErrorMsg(res.data.errorCode)
                MideaToast(msg)
              } else {
                resData = JSON.parse(res.data.result.returnData)

                if (!resData && !bigVer) {
                  // 再次获取快开配置
                  this.getProductConfig(6)
                  break
                }
                this.setConfigStorage(resData)
              }
              this.dealConfigData(resData)
            } while (DO_WHILE_RETURN)
            resolve(res)
          })
          .catch((err) => {
            let resData = this.getConfigStorage()
            if (resData) {
              this.dealConfigData(resData)
              resolve()
              return
            }
            let res = err.data
            if (res) {
              if (res.result && res.result.returnData) {
                res = JSON.parse(res.result.returnData)
              }
              do {
                if (res.resCode == 50300 || res.code == 1001) {
                  // 无资源重定向
                  PluginConfig.redirectUnSupportDevice(this.properties.applianceData)
                  break
                }
                if (res.code != 0) {
                  let msg = PluginConfig.handleErrorMsg(res.code)
                  MideaToast(msg)
                  break
                }
                MideaToast('未知错误-配置')
              } while (DO_WHILE_RETURN)
            }
            resolve()
          })
      })
    },
    // endregion
    // region 数据初始化
    dataInit(options) {
      let newDeviceStatus = options?.status
      let extended = options?.extended
      let data = this.data
      let deviceInfo = data.deviceInfo
      let statusButtonRightText = ''
      let statusButtonRightTime = ''
      let quickDevJson = data.quickDevJson
      let switchLight = data.switchLight
      let limitRateData = data.limitRateData
      console.log('lua数据', newDeviceStatus)
      // DIY
      if (extended) {
        deviceInfo.extended = extended
      } else {
        deviceInfo.extended = ''
      }

      // 是否完成烹饪
      if (deviceInfo.isComplete) {
        Dialog.alert({
          title: '烹饪完成',
          message: '美食已经出炉\r\n趁热食用口味更佳',
          context: this,
          confirmButtonText: '知道了',
          zIndex: 9999,
        }).then(() => {
          // on close
          deviceInfo.isComplete = false
        })
      }
      let errorObj = quickDevJson.errorCodeMap
      let errorTitle = ''
      let errorSolution = ''
      if (newDeviceStatus) {
        newDeviceStatus.error_code = Number(newDeviceStatus.error_code)
        Object.assign(deviceInfo, newDeviceStatus)
        // 工作状态赋值
        let workStatusOptions = quickDevJson.properties[PluginConfig.apiKey.workStatus].options
        if (workStatusOptions && workStatusOptions.length > 0) {
          for (let i = 0; i < workStatusOptions.length; i++) {
            let workStatusOptionItem = workStatusOptions[i]
            deviceInfo.workStatus[workStatusOptionItem.code] = workStatusOptionItem.value
            if (workStatusOptionItem.value === newDeviceStatus.work_status) {
              deviceInfo.workStatusName = workStatusOptionItem.desc || workStatusOptionItem.text
              if (deviceInfo.workStatusName.indexOf('空闲中') > -1) {
                deviceInfo.workStatusName = deviceInfo.workStatusName.replace('空闲中', '待机中')
              }
            }
          }
        }
        // 工作状态
        deviceInfo.isPause = false
        deviceInfo.isError = false
        switch (newDeviceStatus.work_status) {
          case deviceInfo.workStatus[PluginConfig.workStatus.appoint]:
            // 预约
            deviceInfo.isOnline = true
            deviceInfo.isRunning = true
            deviceInfo.isWorking = true

            statusButtonRightText = '预计完成时间'
            const remainAppointTime = parseInt(deviceInfo.remain_appoint_time_sec / 60)
            statusButtonRightTime = getWorkFinishTime(remainAppointTime)
            break
          case deviceInfo.workStatus[PluginConfig.workStatus.working]:
            // 工作
            deviceInfo.isOnline = true
            deviceInfo.isRunning = true
            deviceInfo.isWorking = true

            statusButtonRightText = '预计完成时间'
            const remainWorkMinutes = parseInt(deviceInfo.remain_work_time_sec / 60)
            statusButtonRightTime = getWorkFinishTime(remainWorkMinutes)
            break
          case deviceInfo.workStatus[PluginConfig.workStatus.pause]:
            // 暂停
            deviceInfo.isOnline = true
            deviceInfo.isRunning = true
            deviceInfo.isWorking = false
            deviceInfo.isPause = true
            break
          case PluginConfig.workStatus.error:
            // 错误
            deviceInfo.isOnline = true
            deviceInfo.isRunning = true
            deviceInfo.isWorking = false
            deviceInfo.isPause = true
            deviceInfo.isError = true
            deviceInfo.workStatusName = '故障中'

            if (deviceInfo.isError) {
              for (const key in errorObj) {
                if (Object.hasOwnProperty.call(errorObj, key)) {
                  const element = errorObj[key]
                  if (element.code === deviceInfo.error_code * 1) {
                    errorTitle = element.name
                    errorSolution = element.solution
                  }
                }
              }
            }
            break
          default:
            deviceInfo.isOnline = true
            deviceInfo.isRunning = false
            deviceInfo.isWorking = false
            break
        }
        if (deviceInfo.isRunning) {
          limitRateData.rate = 0.12
        } else {
          limitRateData.rate = 0.35
        }
        // 工作模式
        // 如果有extended，就改变work_mode
        let workMode = 0
        if (deviceInfo.extended) {
          workMode = Number(deviceInfo.extended.work_mode)
        } else {
          workMode = deviceInfo.work_mode = Number(newDeviceStatus.work_mode)
        }
        let currentFunction = {}
        let hasChooseTaste = false
        if (workMode !== 0) {
          deviceInfo.currentFunction = currentFunction = this.getCurrentFunction(workMode)
          if (currentFunction.settingsData) {
            // 获取火力标签
            let heatControlSetting = currentFunction.settingsData.heatControl
            deviceInfo.firePowerLabel = ''
            if (heatControlSetting) {
              heatControlSetting.properties.options.forEach((item) => {
                if (item.value === newDeviceStatus.fire_power) {
                  deviceInfo.firePowerLabel = item.text
                }
              })
            }
            // 判断是否有口感
            let chooseTaste = currentFunction.settingsData.chooseTaste
            if (chooseTaste) {
              hasChooseTaste = true
            }
          }
        }
        deviceInfo.hasChooseTaste = hasChooseTaste
        // 设备模式
        deviceInfo.device_mode = Number(newDeviceStatus.device_mode)
        do {
          if (newDeviceStatus.flag_open_box === '1') {
            deviceInfo.enabledWork = false
            break
          }
          if (deviceInfo.hasSetPauseStatus && deviceInfo.isPause && !deviceInfo.device_mode) {
            deviceInfo.enabledWork = false
            break
          }
          if (newDeviceStatus.error_code) {
            deviceInfo.enabledWork = false
            break
          }
          deviceInfo.enabledWork = true
        } while (false)
        do {
          // 暂停工作
          if (!deviceInfo.enabledWork) {
            let content = '空炸炸桶已被取出，请放回后再尝试启动。'
            if (deviceInfo.isDoor) {
              content = '空炸箱门已打开，请关闭后再尝试启动。'
            }
            if (deviceInfo.isGrill) {
              content = '空炸盖子已打开，请放回后再尝试启动。'
              if (deviceInfo.device_mode === 0) {
                content = '炸篮/烤盘已被取出，请放回后再尝试启动。'
              }
            }
            break
          }
        } while (false)
        // 设置功能选项禁用样式
        deviceInfo.functionEnabled = deviceInfo.isOnline && deviceInfo.enabledWork
        // 剩余时间
        let raminWorkTimeSec = Number(newDeviceStatus.remain_work_time_sec)
        deviceInfo.currentTime = Format.formatSeconds(raminWorkTimeSec)
        // 暂停中
        if (deviceInfo.isPause) {
          let remainPauseTimeSec = Number(newDeviceStatus.remain_pause_time_min) * 60
          deviceInfo.currentTime = Format.formatSeconds(remainPauseTimeSec)
        }
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
        if (newDeviceStatus.extended) {
          deviceInfo.extended = newDeviceStatus.extended
        }
        // 工作时间
        let setWorkTimeSec = Number(newDeviceStatus.set_work_time_sec)
        deviceInfo.setWorkTime = Math.ceil(setWorkTimeSec / 60)
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
        // 炉灯状态
        switchLight.selected = newDeviceStatus.flag_light === '1'
      }
      console.log('deviceInfo:', deviceInfo)
      this.setData({
        deviceInfo,
        switchLight,
        statusButtonRightText,
        statusButtonRightTime,
        errorTitle,
        errorSolution,
      })
    },
    // endregion
    // region 轮询获取设备状态
    deviceStatusInterval(interval) {
      if (deviceStatusTimer) {
        clearInterval(deviceStatusTimer)
      }
      if (!interval) {
        interval = 5000
      }
      if (isDeviceInterval) {
        deviceStatusTimer = setInterval(() => {
          this.updateStatus()
        }, interval)
      }
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
        let pageProductConfig = data.pageProductConfig
        let selectedFunction = data.selectedFunction
        let workTimeModal = data.workTimeModal
        let appointModal = data.appointModal
        let settingModal = data.settingModal
        let sliderTemperature = data.sliderTemperature
        if (!deviceInfo.isOnline) {
          MideaToast('设备已离线，请检查网络状态')
          break
        }

        if (!deviceInfo.enabledWork) {
          if (deviceInfo.isRunning) {
            let content = '请放回空炸炸桶，'
            if (deviceInfo.isDoor) {
              content = '请关闭空炸箱门，'
            }
            if (deviceInfo.isGrill) {
              content = '请放回空炸盖子，'
              if (deviceInfo.device_mode === 0) {
                content = '请放回炸篮/烤盘，'
              }
            }
            content += '再启动设备'
            MideaToast(content)
            break
          }
          let content = '空炸炸桶已被取出，'
          if (deviceInfo.isDoor) {
            content = '空炸箱门已打开，'
          }
          if (deviceInfo.isGrill) {
            content = '空炸盖子已打开，'
            if (deviceInfo.device_mode === 0) {
              content = '炸篮/烤盘已被取出，'
            }
          }
          content += '无法启动'
          MideaToast(content)
          break
        }
        let controlParams = {
          work_mode: selectedFunction.code,
          work_switch: 'work',
        }
        // 口感
        if (pageProductConfig.chooseTaste.hasConfig) {
          controlParams['bake_type'] = settingModal.currentTasteValue
        }
        // 风速
        if (pageProductConfig.windSpeed.hasConfig) {
          // 风速可调，切换口感优先使用口感所配置风速
          selectedFunction.settings.forEach((item) => {
            if (item.apiKey === 'chooseTaste') {
              item.properties.options.forEach((e) => {
                if (e.value === settingModal.currentTasteValue && e.defaultWind) {
                  settingModal.currentWindSpeedValue = e.defaultWind
                }
              })
            }
          })
          controlParams['motor_speed'] = settingModal.currentWindSpeedValue
        } else {
          // 风速不可调但是有默认值
          selectedFunction.settings.forEach((item) => {
            if (item.apiKey === 'windSpeed' && item.properties.defaultValue) {
              controlParams['motor_speed'] = item.properties.defaultValue
            }
          })
        }

        // 温度
        if (pageProductConfig.temperature.hasConfig) {
          controlParams['target_temp'] = sliderTemperature.currentValue
          controlParams['flag_modify_temp_enable'] = 1
        }
        // 火力等级
        if (pageProductConfig.firePower.hasConfig) {
          controlParams['fire_power'] = settingModal.currentfirePowerValue
        }
        // 工作时间
        if (pageProductConfig.workTime.hasConfig) {
          controlParams['set_work_time_sec'] = workTimeModal.defaultValue * 60
          controlParams['flag_modify_time_enable'] = 1
        }
        // 转动
        if (pageProductConfig.turnStatus.hasConfig) {
          controlParams['flag_turn_enable'] = settingModal.currentTurnStatusValue ? 1 : 0
          controlParams['flag_modify_turn_enable'] = 1
        }
        // 预约完成时间
        if (appointModal.isSwitch) {
          if (appointModal.defaultValue) {
            controlParams['work_switch'] = 'schedule'
            appointModal.defaultValue = Math.max(appointModal.min, appointModal.defaultValue)
            controlParams['set_appoint_time_sec'] = appointModal.defaultValue * 60
          }
        }
        // 预热
        if (pageProductConfig.preheat.hasConfig) {
          controlParams['flag_preheat_enable'] = settingModal.currentPreheatValue ? 1 : 0
        }
        let currentAppoint = getCurrentAppointTime(workTimeModal.defaultValue * 1)
        let toastText = `${currentAppoint[0] ? '今天' : '明天'}${currentAppoint[1]}:${addZero(currentAppoint[2])}`
        let hasAppoint = pageProductConfig.appoint.isShow && appointModal.isSwitch

        if (hasAppoint && appointModal.defaultValue < workTimeModal.defaultValue) {
          Dialog.alert({
            title: '预约时间过短',
            message: `完成烹饪需晚于${toastText}`,
            context: this,
            confirmButtonText: '知道了',
            zIndex: 9999,
          }).then(() => {
            // on close
          })
        } else {
          this.onClickControl(controlParams).then((result) => {
            this.closeSettingModal()
            this.goToWorkStatus()
          })
        }
      } while (DO_WHILE_RETURN)
    },

    // 跳转到状态页
    goToWorkStatus(fromCloud = false) {
      let deviceInfo = this.data.deviceInfo
      let pages = getCurrentPages()
      let currentPage = pages[pages.length - 1]
      let isMatchArr = currentPage.route.match(/plugin\/T0x(.*)\/index\/index/g)
      if (!isMatchArr) {
        if (fromCloud) {
          wx.redirectTo({
            url: '../../../device-status/device-status?deviceInfo=' + JSON.stringify(deviceInfo),
          })
        } else {
          wx.redirectTo({
            url: '../device-status/device-status?deviceInfo=' + JSON.stringify(deviceInfo),
          })
        }
      } else {
        if (fromCloud) {
          wx.navigateTo({
            url: '../../../device-status/device-status?deviceInfo=' + JSON.stringify(deviceInfo),
          })
        } else {
          wx.navigateTo({
            url: '../device-status/device-status?deviceInfo=' + JSON.stringify(deviceInfo),
          })
        }
      }
    },
    // endregion
    onClickStatus() {
      let deviceInfo = this.data.deviceInfo
      if (deviceInfo.work_status === 'standby' || !deviceInfo.isOnline || deviceInfo.isError) {
        return
      }
      this.goToWorkStatus()
    },
    // region 启动功能
    onClickControl(controlParams, type = 'normal') {
      return new Promise((resolve) => {
        UI.showLoading({
          content: '加载中',
          mask: true,
        })
        this.clearDeviceStatusInterval()
        this.requestControl({
          control: controlParams,
        })
          .then((res) => {
            console.log('参数下发成功，返回的结果：', res)
            // 结束时不用弹出提示
            if (type !== 'stop') {
              if (res.data.data.status.flag_should_adjust_gear === 1) {
                UI.hideLoading()
                return MideaToast('请调节至干煸档位后再启动')
              } else if (res.data.data.status.flag_should_adjust_gear === 2) {
                UI.hideLoading()
                return MideaToast('请调节至嫩烤档位后再启动')
              } else if (res.data.data.status.flag_should_close_box === 1) {
                if (res.data.data.status.work_status === 'standby') {
                  UI.hideLoading()
                  return MideaToast('请合盖后再启动')
                }
              }
            }
            UI.hideLoading()
            this.dataInit(res.data.data)
            this.deviceStatusInterval()
            resolve()
          })
          .catch((err) => {
            console.log(err)
            let res = err
            do {
              UI.hideLoading()
              if (res.data.code != 0) {
                let msg = PluginConfig.handleErrorMsg(res.data.code)
                MideaToast(msg)
                break
              }
              this.dataInit(res.data.data)
              this.deviceStatusInterval()
            } while (DO_WHILE_RETURN)
          })
      })
    },

    // region 点击功能项
    async onClickFunction(event) {
      // console.log('event', event)
      do {
        let deviceInfo = this.data.deviceInfo
        let selectedFunction = event.currentTarget.dataset.item
        if (deviceInfo.error_code > 0) {
          MideaToast('设备故障中')
          break
        }

        if (deviceInfo.isRunning) {
          MideaToast('设备工作中，请稍后再试')
          break
        }
        if (deviceInfo.device_mode === 1 && selectedFunction.code === 22) {
          return MideaToast('当前模式为烤篮模式')
        }
        if (deviceInfo.device_mode === 2 && selectedFunction.code !== 22) {
          return MideaToast('当前模式为烤盘模式')
        }

        console.log('选中的功能项', selectedFunction)
        this.setData({ selectedFunction })
        let pageProductConfig = await this.functionConfigInit(selectedFunction)
        // 检查所有对象的isShow属性是否都为false
        const allIsShowFalse = Object.values(pageProductConfig).every((obj) => obj.isShow === false)
        if (allIsShowFalse) {
          Dialog.alert({
            showCancelButton: true,
            title: selectedFunction.name,
            message: `${this.data.sliderTemperature.currentValue}°C | ${this.data.workTimeModal.currentText}\r\n是否开始烹饪？`,
            context: this,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            zIndex: 9999,
          })
            .then((res) => {
              if (res.action == 'confirm') {
                this.startWork()
              }
            })
            .catch((error) => {
              if (error.action == 'cancel') {
                console.log('点击取消')
              }
              // on cancel
            })
        } else {
          this.showSettingModal()
        }
      } while (DO_WHILE_RETURN)
    },
    // endregion
    // 设置弹框点击事件
    onClickSettingEvent(event) {
      let index = event.currentTarget.dataset.index
      let value = event.currentTarget.dataset.value
      let item = event.currentTarget.dataset.item
      let sliderMarkList = this.data.sliderMarkList
      let currentSliderValue = this.data.currentSliderValue
      let funcDefaultValue = this.data.funcDefaultValue
      if (!index) {
        return MideaToast('invalid index')
      }
      let settingModal = this.data.settingModal
      let sliderTemperature = this.data.sliderTemperature
      let pageProductConfig = this.data.pageProductConfig
      let workTimeModal = this.data.workTimeModal
      let quickDevJson = this.data.quickDevJson
      switch (index) {
        case 'chooseTaste':
          if (!item) {
            return MideaToast('缺少item')
          }
          if (!value) {
            return MideaToast('缺少value')
          }

          if (value === '0' || value === '1') {
            // 脆烤或嫩烤
            pageProductConfig.temperature.isShow = true
            pageProductConfig.workTime.isShow = true
            sliderTemperature.min = 40
            // 嫩烤可调节
            if (quickDevJson.properties && value === '1') {
              let TRControlTempOrTime = quickDevJson.properties?.TRControlTempOrTime
              if (TRControlTempOrTime) {
                pageProductConfig.temperature.isShow = true
                pageProductConfig.workTime.isShow = true
              } else {
                pageProductConfig.temperature.isShow = false
                pageProductConfig.workTime.isShow = false
              }
            }
          } else {
            // 嫩煎
            sliderTemperature.min = 150
          }
          let obj = {}
          obj.temp = Number(item.temp)
          currentSliderValue = sliderTemperature.currentValue = obj.temp
          pageProductConfig.chooseTaste.valueArray.forEach((item) => {
            if (item.value === value) {
              item.classActive = 'active'
            } else {
              item.classActive = ''
            }
          })
          console.log(item.time)
          // 口感变化促使烹饪时间变化
          let params = {
            defaultValue: item.time,
            // min和max不存在
            max: item.maxTime ? item.maxTime : '60',
            min: item.minTime ? item.minTime : '0',
          }
          workTimeModal = params
          funcDefaultValue = item.time
          workTimeModal.currentText = mm2HHmmText(item.time)
          settingModal.currentTasteValue = value
          break
        case 'windSpeed':
          pageProductConfig.windSpeed.valueArray.forEach((item) => {
            if (item.value === value) {
              item.classActive = 'active'
            } else {
              item.classActive = ''
            }
          })
          settingModal.currentWindSpeedValue = value
          // 小档风的时候，温度不可大于150度

          if (value == 2) {
            // 小档风
            sliderTemperature.max = 150
            if (sliderTemperature.currentValue > sliderTemperature.max) {
              currentSliderValue = sliderTemperature.currentValue = sliderTemperature.max
            }
          } else {
            sliderTemperature.max = 200
          }

          break
        case 'firePower':
          pageProductConfig.firePower.valueArray.forEach((item) => {
            if (item.value === value) {
              item.classActive = 'active'
            } else {
              item.classActive = ''
            }
          })
          settingModal.currentfirePowerValue = value
          break
        default:
          break
      }
      sliderMarkList = [`${sliderTemperature.min}°C`, `${sliderTemperature.max}°C`]
      this.setData({
        pageProductConfig,
        settingModal,
        sliderTemperature,
        sliderMarkList,
        workTimeModal,
        currentSliderValue,
        funcDefaultValue,
      })
    },

    workTimeSetting(e) {
      let data = this.data
      let workTimeModal = data.workTimeModal
      const val = e.detail
      workTimeModal.defaultValue = val[0] * 60 + val[1]
      workTimeModal.currentText = mm2HHmmText(workTimeModal.defaultValue)
      // let appointModal = data.appointModal // 更新工作时间后，更新预约对象
      // appointModal.workTime = workTimeModal.defaultValue
      // if (appointModal.defaultValue < 60) {
      //   // 默认时间小于60时，预约完成时间跟随烹饪时间
      //   appointModal.defaultValue = workTimeModal.defaultValue
      //   let currentAppoint = getCurrentAppointTime(appointModal.defaultValue * 1)
      //   appointModal.currentText = `${currentAppoint[0] ? '今天' : '明天'}${currentAppoint[1]}:${addZero(
      //     currentAppoint[2]
      //   )}`
      // } else {
      //   // 默认时间大于等于60时，当烹饪时间大于预约完成时间时，预约完成时间跟随烹饪时间

      // }
      // if (workTimeModal.defaultValue > appointModal.defaultValue) {
      //   appointModal.defaultValue = workTimeModal.defaultValue
      //   let currentAppoint = getCurrentAppointTime(appointModal.defaultValue * 1)
      //   appointModal.currentText = `${currentAppoint[0] ? '今天' : '明天'}${currentAppoint[1]}:${addZero(
      //     currentAppoint[2]
      //   )}`
      // }
      // this.setData({ workTimeModal, appointModal })
      this.setData({ workTimeModal })
    },
    // 所选功能参数初始化
    functionConfigInit(selectedFunction) {
      let quickDevJson = this.data.quickDevJson
      return new Promise((resolve, reject) => {
        this.pageProductConfigInit()
        let currentFuncMinTime = ''
        let currentFuncMaxTime = ''
        let currentFuncLowTempToMaxTime = ''
        let funcDefaultValue = ''
        for (let i = 0; i < selectedFunction.settings.length; i++) {
          if (selectedFunction.settings[i].apiKey === 'setWorkTime') {
            currentFuncMinTime = selectedFunction.settings[i].properties.min
            currentFuncMaxTime = selectedFunction.settings[i].properties.max
            currentFuncLowTempToMaxTime = selectedFunction.settings[i].properties.lowTempToMaxTime
            funcDefaultValue = selectedFunction.settings[i].properties.defaultValue
          }
        }
        if (selectedFunction.settings && selectedFunction.settings.length > 0) {
          let pageProductConfig = this.data.pageProductConfig
          let sliderTemperature = this.data.sliderTemperature
          let sliderMarkList = this.data.sliderMarkList
          let settingModal = this.data.settingModal
          let workTimeModal = this.data.workTimeModal
          let appointModal = this.data.appointModal
          let preheatModal = this.data.preheatModal
          let currentSliderValue = this.data.currentSliderValue
          // 嫩烤可调节
          let resultData = null
          let valueArr = []
          for (let i = 0; i < selectedFunction.settings.length; i++) {
            let item = selectedFunction.settings[i]
            let properties = item.properties
            let properteyCanShow = !item.properties.hide
            switch (item.apiKey) {
              // 温度
              case PluginConfig.apiKey.setTemperature:
                pageProductConfig.temperature.hasConfig = true
                pageProductConfig.temperature.isShow = properteyCanShow
                sliderTemperature = { ...properties.range[0], currentValue: properties.defaultValue }
                currentSliderValue = properties.defaultValue
                let sliderTemperatureObj = properties.range[0]
                sliderMarkList = [`${sliderTemperatureObj.min}°C`, `${sliderTemperatureObj.max}°C`]
                break
              // 口感
              case PluginConfig.apiKey.chooseTaste:
                if (item.properties.ifCanAdjust) {
                  pageProductConfig.temperature.isShow = false
                  pageProductConfig.workTime.isShow = false
                }
                pageProductConfig.chooseTaste.hasConfig = true
                pageProductConfig.chooseTaste.isShow = item.properties.ifCanAdjust
                resultData = PluginConfig.getOptionsArray(properties)
                pageProductConfig.chooseTaste.valueArray = resultData.valueArr
                settingModal.currentTasteValue = properties.defaultValue
                if (properties.defaultValue == '3') {
                  sliderTemperature.min = 150
                  if (sliderTemperature.currentValue < 150) {
                    // 嫩煎模式温度范围150~200
                    sliderTemperature.currentValue = 150
                  }
                }
                sliderMarkList = [`${sliderTemperature.min}°C`, `${sliderTemperature.max}°C`]
                break
              // 烹饪时间
              case PluginConfig.apiKey.setWorkTime:
                if (properties.defaultValue) {
                  // 可配置工作时间
                  pageProductConfig.workTime.isShow = properteyCanShow
                  pageProductConfig.workTime.hasConfig = true
                  workTimeModal = JSON.parse(JSON.stringify(properties))
                  if (Number(currentSliderValue) <= 80) {
                    workTimeModal.max = quickDevJson.properties[PluginConfig.apiKey.setWorkTime].max
                  } else {
                    workTimeModal.max = properties.lowTempToMaxTime ? properties.lowTempToMaxTime : properties.max
                  }
                  workTimeModal.currentText = mm2HHmmText(workTimeModal.defaultValue)
                } else {
                  // 默认工作时间
                  workTimeModal.defaultValue = properties.value
                }
                break
              // 预约
              case PluginConfig.apiKey.appointTime:
                pageProductConfig.appoint.isShow = properteyCanShow
                appointModal = properties
                appointModal.isSwitch = false
                break
              // 预热
              case PluginConfig.apiKey.preheat:
                pageProductConfig.preheat.isShow = properteyCanShow
                pageProductConfig.preheat.hasConfig = true
                preheatModal.isSwitch = false
                break
              // 风速
              case PluginConfig.apiKey.windSpeed:
                if (item.properties.ifCanAdjust) {
                  // 是否可调风速
                  pageProductConfig.windSpeed.hasConfig = true
                  pageProductConfig.windSpeed.isShow = properteyCanShow
                  resultData = PluginConfig.getOptionsArray(properties)
                  valueArr = resultData.valueArr
                  pageProductConfig.windSpeed.valueArray = valueArr
                  settingModal.currentWindSpeedValue = properties.defaultValue
                  if (settingModal.currentWindSpeedValue == 2) {
                    sliderTemperature.max = 150
                  }
                }
                break
              // 转动
              case PluginConfig.apiKey.turnStatus:
                pageProductConfig.turnStatus.hasConfig = true
                pageProductConfig.turnStatus.isShow = properteyCanShow
                break
              // 烧烤火力
              case PluginConfig.apiKey.heatControl:
                pageProductConfig.firePower.hasConfig = true
                pageProductConfig.firePower.isShow = properteyCanShow
                if (properties.options && properties.options.length > 0) {
                  pageProductConfig.firePower.valueArray = []
                  properties.options.forEach((optionsItem) => {
                    if (properties.defaultValue.value === optionsItem.value) {
                      properties.defaultValue.label = optionsItem.text
                    }
                    pageProductConfig.firePower.valueArray.push({
                      classActive: optionsItem.value === properties.defaultValue ? 'active' : '',
                      value: optionsItem.value,
                      label: optionsItem.text,
                    })
                  })
                }
                settingModal.currentfirePowerValue = properties.defaultValue
                break
              default:
                break
            }
          }
          let currentAppoint = getCurrentAppointTime(appointModal.min * 1)
          appointModal.currentText = `${currentAppoint[0] ? '今天' : '明天'}${currentAppoint[1]}:${addZero(
            currentAppoint[2]
          )}`
          this.setData(
            {
              pageProductConfig,
              sliderMarkList,
              sliderTemperature,
              settingModal,
              workTimeModal,
              appointModal,
              preheatModal,
              currentFuncMinTime,
              currentFuncMaxTime,
              currentFuncLowTempToMaxTime,
              funcDefaultValue,
              currentSliderValue,
            },
            () => {
              resolve(pageProductConfig)
            }
          )
        }
      })
    },
    sliderTemperatureChange(event) {
      let sliderTemperature = this.data.sliderTemperature
      let quickDevJson = this.data.quickDevJson
      let workTimeModal = this.data.workTimeModal
      let currentValue = event.detail
      let currentFuncMinTime = this.data.currentFuncMinTime
      let currentFuncMaxTime = this.data.currentFuncMaxTime
      let currentFuncLowTempToMaxTime = this.data.currentFuncLowTempToMaxTime
      let params = null
      // 调节温度促使烹饪时间变化
      for (const key in quickDevJson.properties) {
        if (Object.hasOwnProperty.call(quickDevJson.properties, key) && key === 'setWorkTime') {
          if (currentValue <= 80) {
            params = {
              defaultValue: workTimeModal.defaultValue,
              // 设备的最大最小时间
              max: quickDevJson.properties[key].max,
              min: quickDevJson.properties[key].min,
            }
          } else {
            if (workTimeModal.defaultValue > 60) {
              workTimeModal.defaultValue = 60
            }
            params = {
              defaultValue: workTimeModal.defaultValue,
              // 功能的最大最小时间
              max: currentFuncLowTempToMaxTime ? currentFuncLowTempToMaxTime : currentFuncMaxTime,
              min: currentFuncMinTime,
            }
          }
        }
      }
      workTimeModal = params
      workTimeModal.currentText = mm2HHmmText(params.defaultValue)
      this.setData({
        currentSliderValue: currentValue,
        sliderTemperature: { ...sliderTemperature, currentValue },
        workTimeModal,
      })
    },
    sliderTemperatureDrag(event) {
      let currentValue = event.detail.value
      this.setData({
        currentSliderValue: currentValue,
      })
    },
    // region 页面配置初始化
    pageProductConfigInit() {
      let pageProductConfig = this.data.pageProductConfig
      pageProductConfig = {
        chooseTaste: {
          isShow: false,
          hasConfig: false,
          valueArray: [],
        },
        windSpeed: {
          isShow: false,
          hasConfig: false,
        },
        temperature: {
          isShow: false,
          hasConfig: false,
          isShowSlider: true,
        },
        firePower: {
          isShow: false,
          hasConfig: false,
          valueArray: [],
        },
        workTime: {
          isShow: false,
          hasConfig: false,
        },
        turnStatus: {
          isShow: false,
          hasConfig: false,
        },
        appoint: {
          isShow: false,
          hasConfig: false,
        },
        preheat: {
          isShow: false,
          hasConfig: false,
        },
        light: {
          isShow: pageProductConfig.light.isShow,
          hasConfig: pageProductConfig.light.hasConfig,
        },
      }
      this.setData({ pageProductConfig })
    },
    // endregion

    // region 炉灯开关
    switchLightChange(event) {
      let model = event.detail
      do {
        let deviceInfo = this.data.deviceInfo
        if (!deviceInfo.isRunning) {
          MideaToast('待机状态无法设置炉灯')
          model.selected = false
          break
        }
        this.onClickControl({
          work_switch: 'modifyParam',
          flag_modify_light_enable: 1,
          flag_light_enable: model.selected ? 1 : 0,
        })
      } while (DO_WHILE_RETURN)
      this.setData({
        switchLight: model,
      })
    },
    // endregion

    // 转动开关切换
    switchTurnChange(event) {
      let model = event.detail
      let settingModal = this.data.settingModal
      settingModal.currentTurnStatusValue = model.selected
      this.setData({
        settingModal,
        switchTurn: model,
      })
    },
    // 预热开关切换
    switchPreheatChange(event) {
      let model = event.detail
      let settingModal = this.data.settingModal
      settingModal.currentPreheatValue = model.selected
      this.setData({
        settingModal,
        preheatModal: model,
      })
    },

    // 预约开关切换
    appointSetting(e) {
      let appointModal = e.detail
      this.setData({ appointModal })
    },
    // 控制预约开关
    setAppointSwitch(e) {
      let appointModal = e.detail
      this.setData({ appointModal })
    },

    // region 显示参数设置对话框
    showSettingModal() {
      // 防止用户多次点击选项，事件重复执行
      if (!isShowingSettingModal) {
        isShowingSettingModal = true
        let settingModal = this.data.settingModal
        settingModal.isShow = true
        this.setData({ settingModal })

        if (showingSettingModalTimer) {
          clearTimeout(showingSettingModalTimer)
        }
        showingSettingModalTimer = setTimeout(() => {
          isShowingSettingModal = false
        }, 500)
      }
    },
    closeSettingModal() {
      if (!isShowingSettingModal) {
        let settingModal = this.data.settingModal
        settingModal.isShow = false
        // 烹饪时间初始化
        this.setData({ settingModal })
      }
    },
    // endregion

    // region 2021.12.01 之前代码
    requestControl(command) {
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
      return new Promise((resolve) => {
        let deviceInfo = this.data.deviceInfo
        let params = {
          applianceCode: deviceInfo.applianceCode,
          applianceType: deviceInfo.type,
          modelNo: deviceInfo.sn8,
        }
        RemoteControl.getStatus(params)
          .then((res) => {
            console.log('设备状态获取:', JSON.parse(res.data.result.returnData))
            do {
              if (JSON.parse(res.data.result.returnData).code !== 0) {
                deviceInfo.isOnline = false
                deviceInfo.enabledWork = false
                deviceInfo.functionEnabled = deviceInfo.isOnline && deviceInfo.enabledWork
                this.setData({ deviceInfo })
                resolve(JSON.parse(res.data.result.returnData))
                break
              }

              try {
                deviceInfo.isOnline = true
                this.dataInit(JSON.parse(res.data.result.returnData).data)
              } catch (e) {
                console.error(e)
              }
              resolve(res)
            } while (DO_WHILE_RETURN)
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
            let res = err.data
            if (res) {
              if (res.result && res.result.returnData) {
                res = JSON.parse(res.result.returnData)
              }
              do {
                if (res.code != 0) {
                  if (res.code == 1307 || res.code == 1306) {
                    deviceInfo.isOnline = false
                    deviceInfo.isRunning = false
                    deviceInfo.enabledWork = false
                    deviceInfo.functionEnabled = deviceInfo.isOnline && deviceInfo.enabledWork
                    this.setData({ deviceInfo })
                    break
                  }
                  let msg = PluginConfig.handleErrorMsg(res.code)
                  MideaToast(msg)
                  break
                }
                MideaToast('未知错误-状态')
              } while (DO_WHILE_RETURN)
            }
            resolve()
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
    // 埋点
    rangersBurialPointClick(eventName, param) {
      let deviceInfo = this.data.deviceInfo
      if (deviceInfo) {
        let paramBurial = {}
        let paramBase = {
          module: '插件',
          apptype_name: '空气炸锅',
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
        deviceName: this.properties.applianceData.name,
        uid: app.globalData.userData.uid,
        _applianceData: this.properties.applianceData,
        deviceInfo: deviceInfo,
      })
      let param = {}
      param['page_name'] = '首页'
      param['object'] = '进入插件页'
      this.rangersBurialPointClick('plugin_page_view', param)
      this.getDeviceImg()
      this.getProductConfig()
        .then((quickDev) => {
          this.updateStatus().then((res) => {
            this.deviceStatusInterval()
            this.setData({
              isInit: true,
            })
          })
        })
        .catch((err) => {
          console.error('获取快开配置错误: ', err)
        })
    })
  },
})
