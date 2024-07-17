const app = getApp() //获取应用实例
const requestService = app.getGlobalConfig().requestService
const rangersBurialPoint = app.getGlobalConfig().rangersBurialPoint
import { getStamp } from 'm-utilsdk/index'
import { FC } from './js/FC.js'
import { commonApi } from '../../assets/scripts/api'
import { DeviceData } from '../../assets/scripts/device-data'
import { Format } from '../../assets/scripts/format'
import { UI } from '../../assets/scripts/ui'
import quickDev from '../../assets/scripts/quickDev'
import Dialog from 'm-ui/mx-dialog/dialog'
import Toast from 'm-ui/mx-toast/toast'
let deviceStatusTimer = null
Component({
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    applianceData: Object,
  },
  data: {
    //  2024.1.19 ui8.0 malone
    activeColor: '',
    paramsArr: [],
    paramsArr1: [],
    weatherObj: {
      temperature: '--',
    },
    airQualityObj: {
      aqiText: '--',
    },
    hasTiming: false,
    hasDoubleEffectTiming: false,
    isCommonImg: false,
    isInit: false,
    noticeBar: {
      isShow: false,
      content: '',
    },
    hostWhenOffDisable: false,
    isHostingUsingMode: false,
    statusObj: {
      statusText: '已离线',
      appointText: '',
      appointDescribe: '',
      statusPoint: '',
    },
    bgImage: {
      deviceImg: DeviceData.baseImageUrl + '/ctrl8/FC/mainPic/',
      deviceImg_common: DeviceData.baseImageUrl + '/ctrl5/T0xFC/v3/main_pic_1.png',
      deviceImg_M2: DeviceData.baseImageUrl + '/ctrl5/T0xFC/v3/main_pic_2.png',
      running: DeviceData.baseImageUrl + '/ctrl8/FC/running.gif',
    },
    iconUrl: {
      arrow: DeviceData.baseImageUrl + '/ctrl5/T0xFC/v3/arrow_right.png',
      powerOff: DeviceData.baseImageUrl + '/ctrl8/FD/power_off.png',
      powerOn: DeviceData.baseImageUrl + '/ctrl8/FD/power_on.png',
      timerOn: DeviceData.baseImageUrl + '/ctrl8/FD/time_on_on_trans.png',
      timerOff: DeviceData.baseImageUrl + '/ctrl8/FD/time_off_trans.png',
      timerOnOff: DeviceData.baseImageUrl + '/ctrl8/FD/time_on_off_trans.png',
    },
    isFolder: true,
    // 智能托管开关
    hostingOnOffSwitch: {
      selected: false,
      disabled: false,
    },
    // region 2021.08.26 敖广骏
    configList: [],
    propertiesData: {},
    deviceInfo: {
      isOnline: false,
      isRunning: false,
      lock: undefined,
    },
    pageComponentVisible: {
      isShowSelectMode: false,
      isShowTimedShutdown: false,
    },
    bindModeGearConfig: {
      value: undefined,
      label: '--',
      list: [],
    },
    bindBrightLedConfig: {
      value: undefined,
      label: '--',
      list: [],
    },
    bindHumidifyConfig: {
      value: undefined,
      label: '--',
      list: [],
    },
    bindLightColorConfig: {
      value: undefined,
      label: '--',
      list: [],
    },
    bindDoubleEffectConfig: {
      value: undefined,
      label: '--',
      list: [],
    },
    timedShutdownPicker: {
      selectedValue: '',
      columns: [],
    },
    // 次级功能列表
    secondFunclist: [],
    // 次级功能个数
    secondFuncCount: 0,
    // 负离子开关
    anionSwitch: {
      selected: false,
      disabled: false,
    },

    // 净离子开关
    waterionsSwitch: {
      selected: false,
      disabled: false,
    },
    // 声音开关
    voiceOnOffSwitch: {
      selected: false,
      disabled: false,
    },
    // 童锁开关
    childLockSwitch: {
      selected: false,
      disabled: false,
    },
    // uv开关
    uvSwitch: {
      selected: false,
      disabled: false,
    },

    // endregion
  },
  methods: {
    // 2024.1.19 malone
    closeSelectModeModal() {
      let pageComponentVisible = this.data.pageComponentVisible
      pageComponentVisible = false
      this.setData({ pageComponentVisible })
    },
    // onModalModeChange() {},
    onCheckSecondFunc(event) {
      console.log('event:', event)
      const { index, item } = event.currentTarget.dataset
      const { checked, key } = item
      const secondFunclist = this.data.secondFunclist
      const checkLocking = key === 'lock'
      this.onClickControl(
        {
          [key]: checked ? DeviceData.powerValue.power.off : DeviceData.powerValue.power.on,
        },
        checkLocking
      ).then((res) => {
        secondFunclist[index].checked = !checked
        this.setData({
          secondFunclist,
        })
      })
    },
    onClickArrow() {
      console.log('点击事件：')
      let isFolder = this.data.isFolder
      isFolder = !isFolder
      this.setData({ isFolder })
    },
    // 电源启停
    onClickPower() {
      let deviceInfo = this.data.deviceInfo
      let controlParams = {
        power: undefined,
      }
      if (deviceInfo.isRunning) {
        controlParams.power = DeviceData.powerValue.power.off
      } else {
        controlParams.power = DeviceData.powerValue.power.on
      }
      this.onClickControl(controlParams)
    },
    onClickAppointment() {
      let hasTiming = this.data.hasTiming
      if (hasTiming) {
        Dialog.confirm({
          zIndex: 10001,
          context: this,
          title: '温馨提示',
          message: '确定取消定时吗？',
        })
          .then((res) => {
            if (res.action == 'confirm') {
              this.cancelTiming()
            }
            // on confirm
          })
          .catch((error) => {
            if (error.action == 'cancel') {
              this.closeTimingModal()
            }
            // on cancel
          })
      } else {
        this.showTimingModal()
      }
    },
    // 取消定时
    cancelTiming() {
      let controlParam = {}
      controlParam.power_on_timer = 'off'
      controlParam.power_off_timer = 'off'
      this.onClickControl(controlParam).then((res) => {
        this.closeTimingModal()
      })
    },
    // 轮询获取设备状态
    deviceStatusInterval() {
      if (deviceStatusTimer) {
        clearInterval(deviceStatusTimer)
      }
      deviceStatusTimer = setInterval(() => {
        try {
          this.updateStatus()
        } catch (e) {
          console.error(e)
        }
      }, 5000)
    },
    clearDeviceStatusInterval() {
      if (deviceStatusTimer) {
        clearInterval(deviceStatusTimer)
      }
    },
    onModeChange(event) {
      this.onClickControl({
        mode: event.detail.active,
      })
    },
    onAtmosphereLightChange(event) {
      this.onClickControl({
        light_color: event.detail.active,
      })
    },
    onAtmosphereLightEnableChange(event) {
      this.onClickControl({
        light_enable_percent: event.detail.active,
      })
    },
    onWindSpeedChange(event) {
      this.onClickControl({
        wind_speed: event.detail.active,
      })
    },
    onWindSpeedSliderChange({ detail }) {
      this.onClickControl({
        wind_speed: detail,
      })
    },
    onBrightLedChange(event) {
      this.onClickControl({
        bright: event.detail.active,
      })
    },
    onHumidityChange(event) {
      this.onClickControl({
        humidity: event.detail.active,
      })
    },
    onDoubleEffectChange(event) {
      let controParams = {}
      if (event.detail.active == 0) {
        controParams.sterilize_enable = DeviceData.powerValue.sterilizeEnable.off
      } else {
        controParams.sterilize_enable = DeviceData.powerValue.sterilizeEnable.on
        controParams.sterilize_minute = event.detail.active
      }
      this.onClickControl(controParams)
    },
    // 智能托管切换
    switchHostingOnOff({ detail }) {
      let { hostingOnOffSwitch, isHostingUsingMode } = this.data
      let control = {}
      if (isHostingUsingMode) {
        control.mode = detail ? 'auto' : 'sleep'
      } else {
        control.hosting = detail ? DeviceData.powerValue.hostingOnOff.on : DeviceData.powerValue.hostingOnOff.off
      }
      this.onClickControl(control).then((res) => {
        hostingOnOffSwitch.selected = detail
        this.setData({
          hostingOnOffSwitch,
        })
      })
    },
    // 净离子切换
    switchWaterions({ detail }) {
      let waterionsSwitch = this.data.waterionsSwitch
      this.onClickControl({
        waterions: detail ? DeviceData.powerValue.waterions.on : DeviceData.powerValue.waterions.off,
      }).then((res) => {
        waterionsSwitch.selected = detail
        this.setData({
          waterionsSwitch,
        })
      })
    },
    // 负离子切换
    switchAnion({ detail }) {
      let anionSwitch = this.data.anionSwitch
      this.onClickControl({
        anion: detail ? DeviceData.powerValue.anion.on : DeviceData.powerValue.anion.off,
      }).then((res) => {
        anionSwitch.selected = detail
        this.setData({
          anionSwitch,
        })
      })
    },
    // 声音切换
    switchVoiceOnOff({ detail }) {
      let voiceOnOffSwitch = this.data.voiceOnOffSwitch
      this.onClickControl({
        buzzer: detail ? DeviceData.powerValue.voiceOnOff.on : DeviceData.powerValue.voiceOnOff.off,
      }).then((res) => {
        voiceOnOffSwitch.selected = detail
        this.setData({
          voiceOnOffSwitch,
        })
      })
    },
    // 童锁切换
    switchChildLock({ detail }) {
      let childLockSwitch = this.data.childLockSwitch
      this.onClickControl(
        {
          lock: detail ? DeviceData.powerValue.childLock.on : DeviceData.powerValue.childLock.off,
        },
        true
      ).then((res) => {
        childLockSwitch.selected = detail
        this.setData({
          childLockSwitch,
        })
      })
    },
    // uv切换
    switchUv({ detail }) {
      let uvSwitch = this.data.uvSwitch
      this.onClickControl({
        uv_enable: detail ? DeviceData.powerValue.uvEnable.on : DeviceData.powerValue.uvEnable.off,
      }).then((res) => {
        uvSwitch.selected = detail
        this.setData({
          uvSwitch,
        })
      })
    },
    // 启动功能
    onClickControl(controlParams, checkLocking) {
      let deviceInfo = this.data.deviceInfo

      return new Promise((resolve, reject) => {
        // 童锁禁用解除
        if (false&&!checkLocking && deviceInfo.lock === DeviceData.powerValue.childLock.on) {
          Toast({ context: this, position: 'bottom', message: '请关闭童锁后再进行设置！' })
          reject()
        } else {
          UI.showLoading()
          this.requestControl({
            control: controlParams,
          })
            .then((res) => {
              UI.hideLoading()
              this.dataInit(res.data.data.status)
              resolve()
            })
            .catch((err) => {
              console.log(err)
              let res = err
              do {
                UI.hideLoading()
                if (res.data.code != 0) {
                  let message = FC.handleErrorMsg(res.data.code)
                  Toast({ context: this, position: 'bottom', message })
                  break
                }
                this.dataInit(res.data.data.status)
              } while (false)
            })
        }
      })
    },
    // endregion
    // 关闭顶部通知栏
    closeNoticeBar() {
      let noticeBar = this.data.noticeBar
      noticeBar.isShow = false
      this.setData({ noticeBar })
    },
    // 关闭定时对话框
    closeTimingModal() {
      let pageComponentVisible = this.data.pageComponentVisible
      pageComponentVisible.isShowTimedShutdown = false
      this.setData({ pageComponentVisible })
    },
    // 确认定时预约时间
    confirmOrderTime() {
      let timedShutdownPicker = this.data.timedShutdownPicker
      let deviceInfo = this.data.deviceInfo
      setTimeout(() => {
        let selectedValue = timedShutdownPicker.selectedValue
        let controlParam = {}
        if (deviceInfo.isRunning) {
          controlParam.power_off_timer = DeviceData.powerValue.powerOffTimer.on
          controlParam.time = selectedValue * 60
        } else {
          controlParam.power_on_timer = DeviceData.powerValue.powerOnTimer.on
          controlParam.time_on = selectedValue * 60
        }
        this.onClickControl(controlParam).then(() => {
          this.closeTimingModal()
        })
      }, 300)
    },
    onImgLoadErr() {
      let bgImage = this.data.bgImage
      bgImage.deviceImg = bgImage.deviceImg_common
      this.setData({
        bgImage,
        isCommonImg: true,
      })
    },
    // 获取产品配置
    getProductConfig() {
      return new Promise((resolve, reject) => {
        let data = this.data
        let {
          deviceInfo,
          secondFuncCount,
          secondFunclist,
          statusObj,
          bgImage,
          timedShutdownPicker,
          hostWhenOffDisable,
          hostingOnOffSwitch,
          anionSwitch,
          waterionsSwitch,
          voiceOnOffSwitch,
          childLockSwitch,
          uvSwitch,
          configList,
          propertiesData,
          bindModeGearConfig,
          bindBrightLedConfig,
          bindHumidifyConfig,
          bindLightColorConfig,
          bindDoubleEffectConfig,
          isHostingUsingMode,
        } = data
        if (deviceInfo.onlineStatus == DeviceData.onlineStatus.online) {
          deviceInfo.isOnline = true
        } else {
          statusObj.statusPoint = 'off'
          statusObj.statusText = '已离线'
          deviceInfo.isOnline = false
          Toast({ context: this, position: 'bottom', message: '设备已离线，请检查网络状态' })
        }
        anionSwitch.disabled = !deviceInfo.isOnline
        waterionsSwitch.disabled = !deviceInfo.isOnline
        voiceOnOffSwitch.disabled = !deviceInfo.isOnline
        childLockSwitch.disabled = !deviceInfo.isOnline
        hostingOnOffSwitch.disabled = !deviceInfo.isOnline
        uvSwitch.disabled = !deviceInfo.isOnline

        let productModelNumber = deviceInfo.modelNumber != 0 ? DeviceData.getAO(deviceInfo.modelNumber) : deviceInfo.sn8
        let method = 'GET'
        let sendParams = {
          applianceId: deviceInfo.applianceCode,
          productTypeCode: deviceInfo.type,
          userId: data.uid,
          productModelNumber: productModelNumber,
          bigVer: DeviceData.bigVer,
          platform: 2, // 获取美居/小程序功能，2-小程序
        }
        sendParams = {
          serviceName: 'node-service',
          uri: '/productConfig' + Format.jsonToParam(sendParams),
          method: 'GET',
          contentType: 'application/json',
        }
        method = 'POST'
        requestService
          .request(commonApi.sdaTransmit, sendParams, method)
          .then(async (res) => {
            console.log('获取产品配置')
            console.log(deviceInfo)
            console.log(res)
            // 设置页面功能
            let resData = null
            resData = JSON.parse(res.data.result.returnData)
            console.log(resData)
            do {
              if (res.data.errorCode == 50300 || res.code == 1001) {
                // 无资源重定向
                FC.redirectUnSupportDevice(this.properties.applianceData)
                break
              }
              bgImage.deviceImg += `main-pic_${deviceInfo.sn8}.png`
              let quickDevJson = quickDev.quickDevJson2Local(resData)
              console.log('解析后参数')
              console.log(quickDevJson)
              // 智能托管
              configList = quickDevJson.functions
              // 获取属性
              propertiesData = quickDevJson.properties
              // 关机时智能托管不可用
              hostWhenOffDisable = propertiesData.isOffDisableHosting
              isHostingUsingMode = propertiesData.isHostingUsingMode
              // 设置配置项
              for (const key in configList) {
                if (Object.hasOwnProperty.call(configList, key)) {
                  if (Object.keys(DeviceData.secondFunctionsControlMap).includes(key)) {
                    const { iconName, controlValue } = DeviceData.secondFunctionsControlMap[key]
                    secondFunclist.push({
                      key: controlValue,
                      checked: false,
                      name: DeviceData.secondFunctionsNameMap[key],
                      activeIcon: DeviceData.baseImageUrl + `/ctrl5/T0xFC/v3/${iconName}_on.png`,
                      icon: DeviceData.baseImageUrl + `/ctrl5/T0xFC/v3/${iconName}_off.png`,
                    })
                    secondFuncCount += 1
                  }
                }
              }
              // 模式
              let modeConfig = configList[DeviceData.functionsType.mode][0]

              if (modeConfig) {
                modeConfig.list.forEach((item) => {
                  item.icon = FC.getModeIcon(item.value)
                  if (modeConfig.defaultValue === item.value) {
                    deviceInfo.modeLabel = item.label
                  }
                })
              }

              // 定时
              let timingConfig = configList[DeviceData.functionsType.timing][0]
              if (timingConfig) {
                timedShutdownPicker.columns = timingConfig.list.map((item) => item.value)
              }
              // 风速(档位)
              let gearConfig = configList[DeviceData.functionsType.gear]
              if (gearConfig) {
                gearConfig.forEach((gearItem) => {
                  if (modeConfig.defaultValue === gearItem.bindValue) {
                    bindModeGearConfig.list = gearItem.list
                    bindModeGearConfig.list.forEach((modeItem) => {
                      if (modeItem.value === gearItem.defaultValue) {
                        bindModeGearConfig.value = modeItem.value
                        bindModeGearConfig.label = modeItem.label
                        if (!modeItem.label) {
                          bindModeGearConfig.label = bindModeGearConfig.value
                        }
                      }
                    })
                  }
                })
              }
              // 加湿
              let humidifyConfig = configList[DeviceData.functionsType.humidify]
              if (humidifyConfig) {
                humidifyConfig.forEach((humidifyItem) => {
                  bindHumidifyConfig.list = humidifyItem.list
                  bindHumidifyConfig.list.forEach((item) => {
                    if (item.value === humidifyItem.defaultValue) {
                      bindHumidifyConfig.value = item.value
                      bindHumidifyConfig.label = item.label
                      if (!item.label) {
                        bindHumidifyConfig.label = bindHumidifyConfig.value
                      }
                    }
                  })
                })
              }
              // 亮度
              let brightLedConfig = configList[DeviceData.functionsType.brightLed]
              if (brightLedConfig) {
                brightLedConfig.forEach((brightItem) => {
                  bindBrightLedConfig.list = brightItem.list
                  bindBrightLedConfig.list.forEach((item) => {
                    if (item.value === brightItem.defaultValue) {
                      bindBrightLedConfig.value = item.value
                      bindBrightLedConfig.label = item.label
                      if (!item.label) {
                        bindBrightLedConfig.label = bindBrightLedConfig.value
                      }
                    }
                  })
                })
              }
              // 氛围灯
              let lightColorConfig = configList[DeviceData.functionsType.lightColor]
              if (lightColorConfig) {
                lightColorConfig.forEach((brightItem) => {
                  bindLightColorConfig.list = brightItem.list
                  bindLightColorConfig.list.forEach((item) => {
                    if (item.value === brightItem.defaultValue) {
                      bindLightColorConfig.value = item.value
                      bindLightColorConfig.label = item.label
                      if (!item.label) {
                        bindLightColorConfig.label = bindLightColorConfig.value
                      }
                    }
                  })
                })
              }

              let doubleEffectConfig = configList[DeviceData.functionsType.doubleEffectSterilize]
              if (doubleEffectConfig) {
                doubleEffectConfig.forEach((doubleEffectItem) => {
                  bindDoubleEffectConfig.list = doubleEffectItem.list
                  bindDoubleEffectConfig.list.forEach((item) => {
                    if (item.value === doubleEffectItem.defaultValue) {
                      bindDoubleEffectConfig.value = item.value
                      bindDoubleEffectConfig.label = item.label
                      if (!item.label) {
                        bindDoubleEffectConfig.label = bindDoubleEffectConfig.value
                      }
                    }
                  })
                })
              }
              console.log('configList:', configList)
              console.log('secondFunclist:', secondFunclist)
            } while (false)

            this.setData({
              bgImage,
              deviceInfo,
              statusObj,
              configList,
              bindModeGearConfig,
              bindBrightLedConfig,
              bindLightColorConfig,
              bindDoubleEffectConfig,
              bindHumidifyConfig,
              propertiesData,
              anionSwitch,
              waterionsSwitch,
              voiceOnOffSwitch,
              childLockSwitch,
              hostingOnOffSwitch,
              uvSwitch,
              timedShutdownPicker,
              hostWhenOffDisable,
              secondFuncCount,
              secondFunclist,
              isHostingUsingMode,
            })
            resolve(res)
          })
          .catch((err) => {
            let res = err.data
            if (res) {
              if (res.result && res.result.returnData) {
                res = JSON.parse(res.result.returnData)
              }
              do {
                if (res.data.errorCode == 50300 || res.code == 1001) {
                  // 无资源重定向
                  FC.redirectUnSupportDevice(this.properties.applianceData)
                  break
                }
                if (res.code != 0) {
                  let message = FC.handleErrorMsg(res.code)
                  Toast({ context: this, position: 'bottom', message })

                  break
                }
                Toast({ context: this, position: 'bottom', message: '未知错误-配置' })
              } while (false)
            }
            resolve()
          })
      })
    },
    // 数据初始化
    dataInit(newDeviceStatus) {
      let data = this.data
      let {
        statusObj,
        deviceInfo,
        hasTiming,
        activeColor,
        hasDoubleEffectTiming,
        configList,
        paramsArr,
        paramsArr1,
        airQualityObj,
        weatherObj,
        hostWhenOffDisable,
        bindModeGearConfig,
        bindBrightLedConfig,
        bindLightColorConfig,
        bindDoubleEffectConfig,
        bindHumidifyConfig,
        bgImage,
        childLockSwitch,
        uvSwitch,
        anionSwitch,
        hostingOnOffSwitch,
        isHostingUsingMode,
        waterionsSwitch,
        voiceOnOffSwitch,
        secondFunclist,
      } = data
      console.log('数据初始化')
      console.log(newDeviceStatus)
      deviceInfo.status = newDeviceStatus
      if (deviceInfo.onlineStatus == DeviceData.onlineStatus.online) {
        deviceInfo.isOnline = true
      } else {
        deviceInfo.isOnline = false
        statusObj.statusPoint = 'off'
        statusObj.statusText = '已离线'
      }
      // 设备在线
      deviceInfo.isOnline = true
      deviceInfo.isRunning = false
      activeColor = '#7C879B'

      if (newDeviceStatus) {
        this.setData({ isInit: true })
        // 电源
        if (newDeviceStatus.power && newDeviceStatus.power == DeviceData.powerValue.power.on) {
          deviceInfo.isRunning = true
          activeColor = '#267AFF'
          if (
            newDeviceStatus.hosting === DeviceData.powerValue.hostingOnOff.on ||
            (newDeviceStatus.mode === 'auto' && isHostingUsingMode)
          ) {
            statusObj.statusText = '智能托管中'
          } else {
            statusObj.statusText = '运行中'
          }
          statusObj.statusPoint = 'on'
        } else {
          if (
            newDeviceStatus.hosting === DeviceData.powerValue.hostingOnOff.on ||
            (newDeviceStatus.mode === 'auto' && isHostingUsingMode)
          ) {
            statusObj.statusText = '智能托管中'
          } else {
            statusObj.statusText = '待机中'
          }
          statusObj.statusPoint = 'off'
          deviceInfo.isRunning = false
        }
        anionSwitch.disabled = !deviceInfo.isRunning
        waterionsSwitch.disabled = !deviceInfo.isRunning
        voiceOnOffSwitch.disabled = !deviceInfo.isRunning
        childLockSwitch.disabled = !deviceInfo.isOnline
        uvSwitch.disabled = !deviceInfo.isOnline
        // 等级与PM10数值区间：优：0-35；良：36-75；中：76-115；差：＞115； 已同步需求文档。
        deviceInfo.pm10 = newDeviceStatus.pm10
        if (deviceInfo.pm10 == 65535) {
          deviceInfo.pm10 = '--'
          deviceInfo.pm10Level = '--'
        } else {
          if (deviceInfo.pm10 < 36) deviceInfo.pm10Level = '优'
          else if (deviceInfo.pm10 < 76) deviceInfo.pm10Level = '良'
          else if (deviceInfo.pm10 < 116) deviceInfo.pm10Level = '中'
          else deviceInfo.pm10Level = '差'
        }
        const gradeLevel = ['优', '优', '良', '中', '差', '差']
        // PM2.5
        deviceInfo.pm25 = newDeviceStatus.pm25
        // 室内空气质量等级
        deviceInfo.ashTvoc = newDeviceStatus.ash_tvoc
        deviceInfo.pm25Label = ''
        if (deviceInfo.pm25 === 65535) {
          deviceInfo.pm25Label = '优'
        } else {
          deviceInfo.pm25Label = gradeLevel[parseInt(newDeviceStatus.ash_tvoc)]
        }
        // 甲醛
        // 设备支持甲醛检测再处理数据
        let hchoParamsContent = ''
        if (data.propertiesData?.hcho) {
          if (newDeviceStatus.hcho != '' && newDeviceStatus.hcho != undefined) {
            deviceInfo.hcho = (newDeviceStatus.hcho / 1000).toFixed(3)
            deviceInfo.hchoLevel = gradeLevel[parseInt(newDeviceStatus.hcho_level)]
            hchoParamsContent = deviceInfo.hchoLevel
            if (!deviceInfo.isRunning) {
              hchoParamsContent += ' | ' + deviceInfo.hcho
            }
          }
        }
        if (data.propertiesData?.hasVocSensor) {
          // 异味指数
          if (newDeviceStatus.smell_tvoc || newDeviceStatus.smell_tvoc === 0) {
            deviceInfo.smellTvoc = (newDeviceStatus.smell_tvoc / 100).toFixed(2)
            deviceInfo.smellTvocLabel = gradeLevel[parseInt(newDeviceStatus.smell_tvoc)]
          }
        }
        const arr = [
          {
            title: 'PM10',
            value: deviceInfo.pm10Level + ' | ' + deviceInfo.pm10,
            unit: deviceInfo.pm10 == '--' ? '' : 'μg/m³',
            isShow: data.propertiesData.hasPM10Sensor && deviceInfo.pm10 && deviceInfo.isRunning,
          },
          {
            title: 'PM2.5',
            value: deviceInfo.pm25Label + ' | ' + deviceInfo.pm25,
            unit: 'μg/m³',
            isShow:
              !data.propertiesData.isJustShowPm25Level &&
              deviceInfo.pm25 &&
              deviceInfo.pm25 != 65535 &&
              (!deviceInfo.isRunning || deviceInfo.hcho),
          },
          {
            title: 'PM2.5质量等级',
            value: deviceInfo.pm25Label,
            unit: '',
            isShow:
              ((data.propertiesData.isJustShowPm25Level && !deviceInfo.isRunning) ||
                (!data.propertiesData.isJustShowPm25Level && deviceInfo.isRunning && !deviceInfo.hcho)) &&
              deviceInfo.pm25Label,
          },
          {
            title: deviceInfo.isRunning ? '甲醛等级' : '甲醛',
            value: hchoParamsContent,
            unit: deviceInfo.isRunning ? '' : 'mg/m³',
            isShow: deviceInfo.hcho,
          },
          {
            title: 'VOC（气态污染物）',
            value: deviceInfo.smellTvocLabel,
            unit: '',
            isShow: Boolean(deviceInfo.smellTvocLabel),
          },
          {
            title: '室内湿度',
            value: newDeviceStatus.humidify_feedback,
            unit: '%RH',
            isShow: newDeviceStatus.humidify_feedback && newDeviceStatus.humidify_feedback != 255,
          },
          {
            title: '室内温度',
            value: newDeviceStatus.temperature_feedback,
            unit: '℃',
            isShow:
              (newDeviceStatus.temperature_feedback === 0 || newDeviceStatus.temperature_feedback) &&
              newDeviceStatus.temperature_feedback < 50,
          },
          {
            title: '室外空气 | 室外温度',
            value: airQualityObj.aqiText + ' | ' + weatherObj.temperature,
            unit: '℃',
            isShow: airQualityObj.aqiText != '--',
          },
        ]
        console.log('参数区域：', arr)
        const temp = arr.filter((item) => item.isShow)
        if (temp.length > 3) {
          paramsArr = temp.slice(0, 3)
          paramsArr1 = temp.slice(3)
        } else {
          paramsArr = temp
        }
        // 模式
        deviceInfo.mode = newDeviceStatus.mode
        let deviceInfoMode = []
        const modeConfigList = configList[DeviceData.functionsType.mode]
        if (modeConfigList && modeConfigList[0].list.length > 0) {
          deviceInfoMode = modeConfigList[0].list.filter((n) => n.value === deviceInfo.mode)[0]
          if (deviceInfoMode) {
            deviceInfo.modeLabel = deviceInfoMode.label
          } else if (deviceInfo.mode === 'manual') {
            // 手动的档位模式
            deviceInfo.mode = `${deviceInfo.mode}_${newDeviceStatus.wind_speed}`
            deviceInfoMode = modeConfigList[0].list.filter((n) => n.value === deviceInfo.mode)[0]
            deviceInfo.modeLabel = deviceInfoMode.label
          }
        }
        // 风速
        deviceInfo.windSpeed = newDeviceStatus.wind_speed
        bindModeGearConfig.label = newDeviceStatus.wind_speed
        // 获取档位配置参数
        const gearConfigList = configList[DeviceData.functionsType.gear]
        let bindGearConfig = []
        try {
          if (gearConfigList) {
            for (let i = 0; i < gearConfigList.length; i++) {
              let item = gearConfigList[i]
              if (item.bindValue == deviceInfo.mode) {
                bindGearConfig = item.list
                break
              }
            }
            if (bindGearConfig.length > 0) {
              for (let i = 0; i < bindGearConfig.length; i++) {
                const element = bindGearConfig[i]
                if (deviceInfo.windSpeed <= element.value) {
                  bindModeGearConfig.value = element.value
                  bindModeGearConfig.label = element.label
                  break
                }
              }
            }
            bindModeGearConfig.list = bindGearConfig
            if (bindModeGearConfig.list.length > 4) {
              bindModeGearConfig.markList = bindModeGearConfig.list.map((item) => item.value)
              bindModeGearConfig.max = bindModeGearConfig.list[bindModeGearConfig.list.length - 1].value
              bindModeGearConfig.min = bindModeGearConfig.list[0].value
            }
          }
        } catch (e) {
          console.error(e)
        }
        // 加湿
        deviceInfo.humidity = newDeviceStatus.humidity
        deviceInfo.water_lack = newDeviceStatus.water_lack
        deviceInfo.removable_water_box = newDeviceStatus.removable_water_box
        let humidityConfigList = configList[DeviceData.functionsType.humidify]
        let bindHumidityConfig = []
        if (humidityConfigList) {
          for (let i = 0; i < humidityConfigList.length; i++) {
            let item = humidityConfigList[i]
            bindHumidityConfig = item.list
            break
          }
          if (bindHumidityConfig.length > 0) {
            bindHumidityConfig.forEach((item) => {
              if (item.value == deviceInfo.humidity) {
                bindHumidifyConfig.value = item.value
                bindHumidifyConfig.label = item.label
              }
            })
          }
          bindHumidifyConfig.list = bindHumidityConfig
        }
        // 亮度
        deviceInfo.bright = newDeviceStatus.bright
        let brightLedConfigList = configList[DeviceData.functionsType.brightLed]
        let bindBrightConfig = []
        if (brightLedConfigList) {
          for (let i = 0; i < brightLedConfigList.length; i++) {
            let item = brightLedConfigList[i]
            bindBrightConfig = item.list
            break
          }
          if (bindBrightConfig.length > 0) {
            bindBrightConfig.forEach((item) => {
              if (item.value == deviceInfo.bright) {
                bindBrightLedConfig.value = item.value
                bindBrightLedConfig.label = item.label
              }
            })
          }
          bindBrightLedConfig.list = bindBrightConfig
        }
        // 氛围灯
        deviceInfo.light_color = newDeviceStatus.light_color
        let lightColorConfigList = configList[DeviceData.functionsType.lightColor]
        let bindLightConfig = []
        if (lightColorConfigList) {
          for (let i = 0; i < lightColorConfigList.length; i++) {
            let item = lightColorConfigList[i]
            bindLightConfig = item.list
            break
          }
          if (bindLightConfig.length > 0) {
            bindLightConfig.forEach((item) => {
              if (item.value == deviceInfo.light_color) {
                bindLightColorConfig.value = item.value
                bindLightColorConfig.label = item.label
              }
            })
          }
          bindLightColorConfig.list = bindLightConfig
        }

        // 双效杀菌
        deviceInfo.sterilize_minute = newDeviceStatus.sterilize_minute
        deviceInfo.sterilize_enable = newDeviceStatus.sterilize_enable
        let doubleEffectConfigList = configList[DeviceData.functionsType.doubleEffectSterilize]
        let bindEffectConfig = []
        if (doubleEffectConfigList) {
          for (let i = 0; i < doubleEffectConfigList.length; i++) {
            let item = doubleEffectConfigList[i]
            bindEffectConfig = item.list
            break
          }
          if (bindEffectConfig.length > 0) {
            for (let index = 0; index < bindEffectConfig.length; index++) {
              const item = bindEffectConfig[index]
              if (
                deviceInfo.sterilize_minute <= Number(item.value) ||
                (item.value == 0 && deviceInfo.sterilize_enable === 'off')
              ) {
                bindDoubleEffectConfig.value = item.value
                bindDoubleEffectConfig.label = item.label
                break
              }
            }
          }
          bindDoubleEffectConfig.list = bindEffectConfig
        }
        // 智能托管
        hostingOnOffSwitch.disabled = !deviceInfo.isRunning && hostWhenOffDisable
        if (!isHostingUsingMode) {
          hostingOnOffSwitch.selected = newDeviceStatus.hosting === DeviceData.powerValue.hostingOnOff.on
        } else {
          hostingOnOffSwitch.selected = deviceInfo.mode === 'auto'
        }
        // 净离子
        deviceInfo.waterions = newDeviceStatus.waterions
        waterionsSwitch.selected = deviceInfo.waterions === DeviceData.powerValue.waterions.on

        // 负离子
        deviceInfo.anion = newDeviceStatus.anion
        anionSwitch.selected = deviceInfo.anion === DeviceData.powerValue.childLock.on

        // 声音
        deviceInfo.buzzer = newDeviceStatus.buzzer
        voiceOnOffSwitch.selected = deviceInfo.buzzer === DeviceData.powerValue.voiceOnOff.on

        // 童锁
        deviceInfo.lock = newDeviceStatus.lock
        childLockSwitch.selected = deviceInfo.lock === DeviceData.powerValue.childLock.on

        // uv
        deviceInfo.uv_enable = newDeviceStatus.uv_enable
        uvSwitch.selected = deviceInfo.uv_enable === DeviceData.powerValue.uvEnable.on

        // 二级功能状态更新
        secondFunclist.forEach((item) => {
          item.checked = deviceInfo[item.key] === DeviceData.powerValue.power.on
        })
        // 定时关机
        if (deviceInfo.water_lack) {
          this.showNoticeBar('水箱缺水，请加水后使用')
        } else {
          this.closeNoticeBar()
        }
        // 定时开关/双效杀菌
        let timingSeconds = 0
        let timingMinutes = 0
        let hasOnTiming = false
        let hasOffTiming = false

        if (newDeviceStatus.power_on_timer === DeviceData.powerValue.powerOnTimer.on) {
          statusObj.appointText = '预约开机'
          timingSeconds = Number(newDeviceStatus.time_on) * 60
          hasOnTiming = true
        } else {
          hasOnTiming = false
        }
        if (newDeviceStatus.power_off_timer === DeviceData.powerValue.powerOffTimer.on) {
          statusObj.appointText = '预约关机'
          timingSeconds = Number(newDeviceStatus.time) * 60
          hasOffTiming = true
        } else {
          hasOffTiming = false
        }
        if (doubleEffectConfigList && Number(newDeviceStatus.sterilize_minute)) {
          statusObj.appointText = '双效杀菌'
          timingMinutes = Number(newDeviceStatus.sterilize_minute)
          hasDoubleEffectTiming = true
        } else {
          hasDoubleEffectTiming = false
        }
        hasTiming = hasOnTiming || hasOffTiming
        if (hasDoubleEffectTiming) {
          statusObj.appointDescribe = '剩余' + timingMinutes + '分钟'
        } else if (hasTiming) {
          let formatSecond = Format.calculateTime(timingSeconds)
          statusObj.appointDescribe = formatSecond
        }
      } else {
        deviceInfo.isOnline = false
        deviceInfo.isRunning = false
        statusObj.statusPoint = 'off'
        statusObj.statusText = '已离线'
      }
      this.setData({
        statusObj,
        deviceInfo,
        childLockSwitch,
        anionSwitch,
        hostingOnOffSwitch,
        waterionsSwitch,
        voiceOnOffSwitch,
        bindModeGearConfig,
        bindBrightLedConfig,
        bindLightColorConfig,
        bindDoubleEffectConfig,
        bindHumidifyConfig,
        bgImage,
        hasTiming,
        secondFunclist,
        paramsArr,
        paramsArr1,
        hasDoubleEffectTiming,
        activeColor,
      })
    },

    // 定时选项改变
    timingPickerOnChange(event) {
      let { deviceInfo, timedShutdownPicker } = this.data
      if (!deviceInfo.isOnline) {
        return
      }
      let val = event.detail.value
      timedShutdownPicker.selectedValue = val
      this.setData({ timedShutdownPicker })
    },

    // 切换档位(风速)
    selectGear(gear) {
      UI.showLoading()
      this.clearDeviceStatusInterval()
      this.requestControl({
        control: {
          wind_speed: gear,
        },
      })
        .then((res) => {
          UI.hideLoading()
          this.dataInit(res.data.data.status)
          this.deviceStatusInterval()
        })
        .catch((err) => {
          UI.hideLoading()
          this.deviceStatusInterval()
        })
    },

    // 请求控制
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
    // 天气获取接口
    getAirQuality({ latitude, longitude }) {
      return new Promise((resolve, reject) => {
        requestService
          .request(
            commonApi.weatherGet,
            {
              location: `${latitude},${longitude}`,
              reqId: getStamp().toString(),
              type: 'aqi',
            },
            'GET'
          )
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            reject()
          })
      })
    },
    getWeather({ latitude, longitude }) {
      return new Promise((resolve, reject) => {
        requestService
          .request(
            commonApi.weatherGet,
            {
              location: `${latitude},${longitude}`,
              reqId: getStamp().toString(),
              type: 'now',
            },
            'GET'
          )
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            reject()
          })
      })
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
        noticeBar.isShow = true
        noticeBar.content = content
        this.setData({ noticeBar })
      } while (false)
    },
    // 显示定时对话框
    showTimingModal() {
      let pageComponentVisible = this.data.pageComponentVisible
      let timedShutdownPicker = this.data.timedShutdownPicker
      pageComponentVisible.isShowTimedShutdown = true
      // 初始化
      this.timingPickerOnChange({ detail: { value: timedShutdownPicker.selectedValue||timedShutdownPicker.columns[0] } })
      this.setData({ pageComponentVisible, timedShutdownPicker })
    },
    // 获取设备状态
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
              if (res.data.code != 0) {
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
                    this.dataInit()
                    break
                  }
                  let message = FC.handleErrorMsg(res.code)
                  Toast({ context: this, position: 'bottom', message })
                  break
                }
                Toast({ context: this, position: 'bottom', message: '未知错误-状态' })
              } while (false)
            }
            resolve()
          })
      })
    },
    // 埋点
    rangersBurialPointClick(eventName, param) {
      let deviceInfo = this.data.deviceInfo
      if (deviceInfo) {
        let paramBurial = {}
        let paramBase = {
          module: '插件',
          apptype_name: '净化器',
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
    // 销毁组件
    getDestoried() {
      console.log('销毁组件')
      //执行当前页面前后插件的业务逻辑，主要用于一些清除工作
      if (deviceStatusTimer) {
        clearInterval(deviceStatusTimer)
      }
      // 数据初始化
      deviceStatusTimer = null
    },
  },

  attached() {
    do {
      if (DeviceData.isDebug) {
        break
      }
      var app = getApp()
      let deviceInfo = this.data.deviceInfo
      wx.nextTick(() => {
        Object.assign(deviceInfo, this.properties.applianceData)
        let uid = '5bb5f90e19b846a198299cf8083513de'
        if (app.globalData.userData) {
          uid = app.globalData.userData.uid
        }
        this.setData({
          uid,
          deviceInfo,
        })
        let param = {}
        param['page_name'] = '首页'
        param['object'] = '进入插件页'
        let that = this
        this.rangersBurialPointClick('plugin_page_view', param)
        this.getProductConfig().then(() => {
          wx.getLocation({
            type: 'wgs84',
            success(res) {
              let options = {
                latitude: res.latitude,
                longitude: res.longitude,
              }
              Promise.all([that.getWeather(options), that.getAirQuality(options)]).then((res) => {
                let weatherObj = res[0].data.data.observe
                let airQualityObj = res[1].data.data.airQual
                // 温度取小数点前面
                weatherObj = {
                  ...weatherObj,
                  temperature: weatherObj.temperature.split('.')[0],
                }
                that.setData(
                  {
                    weatherObj,
                    airQualityObj,
                  },
                  () => {
                    that.updateStatus().then(() => {
                      that.setData({
                        isInit: true,
                      })
                      that.deviceStatusInterval()
                    })
                  }
                )
              })
            },
          })
        })
      })
    } while (false)
  },
})
