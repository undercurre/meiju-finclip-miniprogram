const app = getApp() //获取应用实例
const requestService = app.getGlobalConfig().requestService
const rangersBurialPoint = app.getGlobalConfig().rangersBurialPoint
import Dialog from 'm-ui/mx-dialog/dialog'
import { getStamp } from 'm-utilsdk/index'
import { FD } from './js/FD.js'
import quickDev from '../assets/scripts/quick-dev'
import { DeviceData } from '../assets/scripts/device-data'
import { Format } from '../assets/scripts/format'
import { UI } from '../assets/scripts/ui'
import { commonApi } from '../assets/scripts/api'

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
    // 2023.10.12 ui8
    weatherObj: {},
    hasTiming: false,
    windGearObj: {
      windGearMarkList: [],
      currentValue: '',
    },
    humidityObj: {
      humidityMarkList: [],
      valueList: [],
      min: '',
      max: '',
      step: '',
      currentValue: '',
    },
    statusObj: {
      statusText: '',
      appointText: '',
      appointDescribe: '',
      statusPoint: '',
    },

    bgImage: {
      airDry: 'http://ce-cdn.oss-cn-hangzhou.aliyuncs.com/ccs/icon/ctrl8/FD/airDry-bg.gif',
      running: 'http://ce-cdn.oss-cn-hangzhou.aliyuncs.com/ccs/icon/ctrl8/FD/running-bg.gif',
      standbyCommon: 'http://ce-cdn.oss-cn-hangzhou.aliyuncs.com/ccs/icon/ctrl8/FD/mainPic/main-pic_common.png',
      standbySpecial: 'http://ce-cdn.oss-cn-hangzhou.aliyuncs.com/ccs/icon/ctrl8/FD/',
    },
    specialMainPicArr: ['202Z310H', '202Z310Y'],
    powerObj: {
      checked: false,
    },
    appointmentObj: {
      checked: false,
    },
    // region 2021.11.09 Ao
    isInit: false,
    deviceInfo: {
      isOnline: false,
      isRunning: false,
    },
    noticeBar: {
      isShow: false,
      content: '',
    },
    quickDevJson: {},
    iconUrl: {
      powerOff: 'http://ce-cdn.oss-cn-hangzhou.aliyuncs.com/ccs/icon/ctrl8/FD/power_off.png',
      powerOn: 'http://ce-cdn.oss-cn-hangzhou.aliyuncs.com/ccs/icon/ctrl8/FD/power_on.png',
      timerOn: 'http://ce-cdn.oss-cn-hangzhou.aliyuncs.com/ccs/icon/ctrl8/FD/time_on_on_trans.png',
      timerOff: 'http://ce-cdn.oss-cn-hangzhou.aliyuncs.com/ccs/icon/ctrl8/FD/time_off_trans.png',
      timerOnOff: 'http://ce-cdn.oss-cn-hangzhou.aliyuncs.com/ccs/icon/ctrl8/FD/time_on_off_trans.png',
    },
    pageProductConfig: {
      power: {
        isShow: true,
        hasConfig: false,
      },
      mode: {
        isShow: false,
        hasConfig: false,
        isShowSelectMode: false,
        iconUrl: '',
      },
      timing: {
        isShow: false,
        hasConfig: false,
        isShowTimedShutdown: false,
        selectedValue: 0,
        valueArray: [],
      },
      humidity: {
        isShow: false,
        hasConfig: false,
        autoKeep: {
          isShow: false,
          hasConfig: false,
        },
      },
      windSpeed: {
        isShow: false,
        hasConfig: false,
      },
      // 雾量
      windGear: {
        isShow: false,
        hasConfig: false,
      },
      brightLed: {
        isShow: false,
        hasConfig: false,
      },
      netIons: {
        isShow: false,
        hasConfig: false,
      },
      airDry: {
        isShow: false,
        hasConfig: false,
      },
      buzzer: {
        isShow: false,
        hasConfig: false,
      },
      displayOnOff: {
        isShow: false,
        hasConfig: false,
      },
    },
    switchNetIons: {
      selected: false,
      disabled: false,
    },
    switchAirDry: {
      selected: false,
      disabled: false,
    },
    switchDisplayOnOff: {
      selected: false,
      disabled: false,
    },
    switchBuzzer: {
      selected: false,
      disabled: false,
    },
    // 底部占位元素高度
    boxFillHeight: '',
    // endregion
    // region 2021.11.09 之前
    _applianceData: {
      name: '',
      roomName: '',
      onlineStatus: 0,
    },
    _applianceDataStatus: {
      power: 'off',
      humidity_mode: 'parlour',
      bright_led: '',
      error_code: '',
    },
    deviceStatus: null,
    subFunctionNum: 0,
    // endregion
  },
  methods: {
    // 2023.10.16 Malone
    // 状态初始化
    dataInit(newDeviceStatus) {
      let data = this.data
      let deviceStatus = newDeviceStatus
      let deviceInfo = data.deviceInfo
      let pageProductConfig = data.pageProductConfig
      let statusObj = data.statusObj
      let powerObj = data.powerObj
      let appointmentObj = data.appointmentObj
      let windGearObj = data.windGearObj
      let humidityObj = data.humidityObj
      let switchNetIons = data.switchNetIons
      let switchAirDry = data.switchAirDry
      let switchBuzzer = data.switchBuzzer
      let switchDisplayOnOff = data.switchDisplayOnOff
      let hasTiming = data.hasTiming
      console.log('数据初始化：', newDeviceStatus)
      if (newDeviceStatus) {
        Object.assign(deviceInfo, newDeviceStatus)
        let errCode = Number(newDeviceStatus.error_code)
        if (errCode !== 0) {
          this.showNoticeBar(FD.handleErrorMsg(errCode))
        } else {
          this.closeNoticeBar()
        }
        // 电源
        pageProductConfig.timing.disabled = false
        if (newDeviceStatus.power === 'on') {
          statusObj.statusText = '运行中'
          statusObj.statusPoint = 'on'
          powerObj.checked = true
          deviceInfo.isRunning = true
          deviceInfo.isAirDrying = false
          switchNetIons.disabled = false
          switchAirDry.disabled = false
          switchBuzzer.disabled = false
          switchDisplayOnOff.disabled = false
          if (pageProductConfig.timing.hasConfig && !pageProductConfig.timing.supportOff) {
            pageProductConfig.timing.disabled = true
          }
          if (Boolean(deviceInfo.air_dry_left_time)) {
            let airDryLeftTimeObj = Format.formatSeconds(deviceInfo.air_dry_left_time)
            if (airDryLeftTimeObj.minutes === 45) {
              deviceInfo.airDryLeftTime = 45
            } else {
              deviceInfo.airDryLeftTime = airDryLeftTimeObj.minutes + 1
            }
            statusObj.statusText = '风干中'
            statusObj.statusPoint = 'on'
            pageProductConfig.timing.disabled = true
            deviceInfo.isRunning = true
            deviceInfo.isAirDrying = true
            switchNetIons.disabled = true
            switchAirDry.disabled = true
            switchBuzzer.disabled = true
            switchDisplayOnOff.disabled = true
            powerObj.checked = false
          }
        } else {
          powerObj.checked = false
          deviceInfo.isRunning = false
          deviceInfo.isAirDrying = false
          switchNetIons.disabled = true
          switchAirDry.disabled = true
          switchBuzzer.disabled = true
          switchDisplayOnOff.disabled = true
          statusObj.statusText = '待机中'
          statusObj.statusPoint = 'off'
          if (pageProductConfig.timing.hasConfig && !pageProductConfig.timing.supportOn) {
            pageProductConfig.timing.disabled = true
          }
        }
        // 模式
        if (pageProductConfig.mode.hasConfig && newDeviceStatus.humidity_mode) {
          pageProductConfig.windGear.isShow = newDeviceStatus.humidity_mode === 'manual'
          for (let i = 0; i < pageProductConfig.mode.valueArray.length; i++) {
            let valueItem = pageProductConfig.mode.valueArray[i]
            if (valueItem.value === newDeviceStatus.humidity_mode) {
              deviceInfo.modeName = valueItem.label
              pageProductConfig.mode.iconUrl = valueItem.iconUrl.url2
              break
            }
          }
        }

        // 定时开关
        let timingSeconds = 0
        let hasOnTiming = false
        let hasOffTiming = false
        if (newDeviceStatus.power_on_timer === 'on') {
          statusObj.appointText = '预约开机'
          timingSeconds = Number(newDeviceStatus.time_on) * 60
          hasOnTiming = true
        } else {
          hasOnTiming = false
        }
        if (newDeviceStatus.power_off_timer === 'on') {
          statusObj.appointText = '预约关机'
          timingSeconds = Number(newDeviceStatus.time_off) * 60
          hasOffTiming = true
        } else {
          hasOffTiming = false
        }
        hasTiming = hasOnTiming || hasOffTiming
        if (hasTiming) {
          let formatSecond = Format.calculateTime(timingSeconds)
          statusObj.appointDescribe = formatSecond
          appointmentObj.checked = true
        } else {
          appointmentObj.checked = false
        }
        // 湿度
        if (pageProductConfig.humidity.hasConfig) {
          if (deviceInfo.sn8 === '202Z219S') {
            humidityObj.currentValue = newDeviceStatus.humidity
          } else {
            console.log('数组，', pageProductConfig.humidity.valueArray)
            pageProductConfig.humidity.valueArray.forEach((item, index) => {
              if (newDeviceStatus.humidity === item.value) {
                humidityObj.currentValue = index + 1
              }
            })
          }
        }
        deviceInfo.humidityLabel = Number(newDeviceStatus.humidity) === 100 ? 'F(%RH)' : newDeviceStatus.humidity + '%'
        // 灯光
        if (pageProductConfig.brightLed.hasConfig) {
          pageProductConfig.brightLed.valueArray.forEach((valueItem) => {
            if (valueItem.value === newDeviceStatus.bright_led) {
              deviceInfo.brightLedLabel = valueItem.label
            }
          })
        }
        // 风速
        if (pageProductConfig.windSpeed.hasConfig && newDeviceStatus.wind_gear) {
          for (let i = 0; i < pageProductConfig.windSpeed.valueArray.length; i++) {
            let valueItem = pageProductConfig.windSpeed.valueArray[i]
            if (valueItem.value === newDeviceStatus.wind_gear) {
              deviceInfo.windSpeedName = valueItem.label
              break
            }
          }
        }
        // 档位
        if (pageProductConfig.windGear.hasConfig && newDeviceStatus.wind_speed) {
          for (let i = 0; i < pageProductConfig.windGear.valueArray.length; i++) {
            let valueItem = pageProductConfig.windGear.valueArray[i]
            if (valueItem.value === newDeviceStatus.wind_speed) {
              deviceInfo.windGearName = valueItem.label
              windGearObj.currentValue = i + 1
              break
            }
          }
        }
        // 净离子
        if (pageProductConfig.netIons.hasConfig && newDeviceStatus.netIons_on_off) {
          switchNetIons.selected = newDeviceStatus.netIons_on_off === 'on'
        }
        // 风干
        if (pageProductConfig.airDry.hasConfig && newDeviceStatus.airDry_on_off) {
          switchAirDry.selected = newDeviceStatus.airDry_on_off === 'on'
        }
        // 声音
        if (pageProductConfig.buzzer.hasConfig && newDeviceStatus.buzzer) {
          switchBuzzer.selected = newDeviceStatus.buzzer === 'on'
        }
        // 屏幕显示
        if (pageProductConfig.displayOnOff.hasConfig && newDeviceStatus.display_on_off) {
          switchDisplayOnOff.selected = newDeviceStatus.display_on_off === 'off'
        }
        // 人因3A40FB
        if (deviceInfo.sn8 === '202Z219S') {
          // 睡眠模式下隐藏雾量和湿度调节模块
          if (newDeviceStatus.humidity_mode === 'sleep') {
            pageProductConfig.windGear.isShow = false
            pageProductConfig.humidity.isShow = false
          } else {
            pageProductConfig.windGear.isShow = true
            // 手动模式下AI智能恒湿显示湿度设置模块
            if (newDeviceStatus.wind_speed === 'auto') {
              pageProductConfig.humidity.isShow = true
            } else {
              pageProductConfig.humidity.isShow = false
            }
          }
        }
        // 3A40FW 灯光显示选项 睡眠模式下文本显示不同
        if (deviceInfo.sn8 === '20208071') {
          let labelSet = []
          if (newDeviceStatus.humidity_mode === 'sleep') {
            labelSet = ['灯暗', '灯亮', '关闭']
          } else {
            labelSet = ['亮屏', '开启', '关闭']
          }
          labelSet.forEach((displayItem, index) => {
            pageProductConfig.brightLed.valueArray[index].label = displayItem
          })
          // 雾量不为关闭时，禁用风速关闭按钮
          pageProductConfig.windSpeed.valueArray.forEach((item) => {
            item.disabled = false
            if (newDeviceStatus.wind_speed !== 'off' && item.value === 'off') {
              item.disabled = true
            }
          })
        }
        // 2D40 1LA80W 3S25W 3C40W湿度为100并且有雾量档位配置，则显示
        if (
          deviceInfo.sn8 === '202Z2199' ||
          deviceInfo.sn8 === '202Z219V' ||
          deviceInfo.sn8 === '202Z219U' ||
          deviceInfo.sn8 === '202Z219Q'
        ) {
          if (Number(newDeviceStatus.humidity) === 100 && pageProductConfig.windGear.hasConfig) {
            pageProductConfig.windGear.isShow = true
          } else {
            pageProductConfig.windGear.isShow = false
          }
        }
      }
      switchNetIons = switchNetIons
      switchAirDry = switchAirDry
      switchBuzzer = switchBuzzer
      switchDisplayOnOff = switchDisplayOnOff
      console.log('deviceInfo', deviceInfo)
      this.setData({
        deviceInfo,
        hasTiming,
        pageProductConfig,
        switchNetIons,
        switchAirDry,
        switchBuzzer,
        switchDisplayOnOff,
        deviceStatus,
        statusObj,
        powerObj,
        appointmentObj,
        windGearObj,
        humidityObj,
      })
    },

    onClickPower({ detail }) {
      console.log(detail)
      let powerObj = this.data.powerObj
      let deviceInfo = this.data.deviceInfo
      let noticeBar = this.data.noticeBar
      console.log(deviceInfo)
      // 水满保护可开启
      if (Number(deviceInfo.error_code) !== 0 && Number(deviceInfo.error_code) !== 34) {
        UI.toast(noticeBar.content)
        return
      }
      let controlParam = {
        power: deviceInfo.isRunning ? 'off' : 'on',
      }
      // 取消定时
      if (deviceInfo.power_on_timer === 'on') {
        controlParam.time_on = 1920
      }
      if (deviceInfo.power_off_timer === 'on') {
        controlParam.time_off = 1920
      }
      this.onClickControl(controlParam).then((res) => {
        powerObj.checked = detail
        this.setData({ powerObj })
      })
    },
    onClickAppointment() {
      let deviceInfo = this.data.deviceInfo
      let pageProductConfig = this.data.pageProductConfig
      let hasTiming = this.data.hasTiming
      if (pageProductConfig.timing.disabled) {
        let target = deviceInfo.isRunning ? '关机' : '开机'
        if (Boolean(deviceInfo.air_dry_left_time)) {
          UI.toast('风干中不支持定时' + target)
        } else {
          UI.toast('设备不支持定时' + target)
        }
        return
      }
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
    onWindGearChange({ detail }) {
      let pageProductConfig = this.data.pageProductConfig
      let value = pageProductConfig.windGear.valueArray[detail - 1].value
      this.onClickControl({
        wind_speed: value,
      })
    },
    onWindButtonChange({ detail }) {
      this.onClickControl({
        wind_speed: detail.active,
      })
    },
    onClickModeModalItem(event) {
      let value = event?.currentTarget?.dataset?.value
      this.onClickControl({
        humidity_mode: value,
      }).then((res) => {
        this.closeSelectModeModal()
      })
    },
    // region 显示和隐藏模式对话框
    showSelectModeModal() {
      let deviceInfo = this.data.deviceInfo
      if (Boolean(deviceInfo.air_dry_left_time) || !deviceInfo.isRunning) {
        return
      }
      let pageProductConfig = this.data.pageProductConfig
      pageProductConfig.mode.isShowSelectMode = true
      this.setData({ pageProductConfig })
    },
    closeSelectModeModal() {
      let pageProductConfig = this.data.pageProductConfig
      pageProductConfig.mode.isShowSelectMode = false
      this.setData({ pageProductConfig })
    },
    onModeChange(event) {
      this.onClickControl({
        humidity_mode: event.detail.active,
      })
    },
    onModalModeChange(event) {
      let deviceInfo = this.data.deviceInfo
      let value = event.currentTarget.dataset.value
      if (Boolean(deviceInfo.air_dry_left_time) || !deviceInfo.isRunning) {
        return
      }
      this.onClickControl({
        humidity_mode: value,
      }).then((res) => {
        this.closeSelectModeModal()
      })
    },
    // 风档
    onWindSpeedChange({ detail }) {
      this.onClickControl({
        wind_gear: detail.active,
      })
    },
    // 点击灯光
    onLightChange({ detail }) {
      this.onClickControl({
        bright_led: detail.active,
      })
    },
    switchBuzzerChange({ detail }) {
      let switchBuzzer = this.data.switchBuzzer
      this.onClickControl({
        buzzer: detail ? 'on' : 'off',
      }).then((res) => {
        switchBuzzer.checked = detail
        this.setData({
          switchBuzzer,
        })
      })
    },
    switchDisplayOnOffChange({ detail }) {
      let switchDisplayOnOff = this.data.switchDisplayOnOff
      this.onClickControl({
        display_on_off: detail ? 'off' : 'on',
      }).then((res) => {
        switchDisplayOnOff.checked = detail
        this.setData({
          switchDisplayOnOff,
        })
      })
    },
    switchNetIonsChange({ detail }) {
      let switchNetIons = this.data.switchNetIons
      this.onClickControl({
        netIons_on_off: detail ? 'on' : 'off',
      }).then((res) => {
        this.setData({
          switchNetIons,
        })
      })
    },
    switchAirDryChange({ detail }) {
      let switchAirDry = this.data.switchAirDry
      this.onClickControl({
        airDry_on_off: detail ? 'on' : 'off',
      }).then((res) => {
        this.setData({
          switchAirDry,
        })
      })
    },
    onChangeHumidity({ detail }) {
      let deviceInfo = this.data.deviceInfo
      let pageProductConfig = this.data.pageProductConfig
      let value = ''
      if (deviceInfo.sn8 === '202Z219S') {
        // 人因加湿器
        value = detail
      } else {
        value = pageProductConfig.humidity.valueArray[detail - 1].value
      }
      let controlParam = {
        humidity: value,
      }
      if (deviceInfo.sn8 === '202Z2199' || deviceInfo.sn8 === '202Z219V' || deviceInfo.sn8 === '202Z219U') {
        if (value === 100 && pageProductConfig.windGear.hasConfig) {
          pageProductConfig.windGear.isShow = true
          controlParam.humidity_mode = FD.humidityMode.manual
        } else {
          pageProductConfig.windGear.isShow = false
          controlParam.humidity_mode = FD.humidityMode.auto
        }
      }
      this.onClickControl(controlParam).then((res) => {
        this.setData({
          deviceInfo,
          pageProductConfig,
        })
      })
    },
    // endregion
    noop() {},
    // 取消定时
    cancelTiming(options) {
      let { isNoLoading, isNoDataInit } = options || {}
      let deviceInfo = this.data.deviceInfo
      let controlParam = {}
      if (deviceInfo.power_on_timer === 'on') {
        controlParam.power_on_timer = 'on'
        controlParam.time_on = 1920
      } else if (deviceInfo.power_off_timer === 'on') {
        controlParam.power_off_timer = 'on'
        controlParam.time_off = 1920
      }
      this.onClickControl(controlParam, {
        isNoLoading: isNoLoading,
        isNoDataInit: isNoDataInit,
      }).then((res) => {
        this.closeTimingModal()
      })
    },
    // 设置定时时间
    confirmOrderTime() {
      let pageProductConfig = this.data.pageProductConfig
      let deviceInfo = this.data.deviceInfo
      UI.showLoading()
      setTimeout(() => {
        let selectedValue = pageProductConfig.timing.selectedValue
        let controlParam = {}
        if (deviceInfo.isRunning) {
          controlParam.power_off_timer = 'on'
          controlParam.time_off = selectedValue * 60
        } else {
          controlParam.power_on_timer = 'on'
          controlParam.time_on = selectedValue * 60
        }
        this.onClickControl(controlParam).then(() => {
          UI.toast('操作成功')
          UI.hideLoading()
          this.closeTimingModal()
        })
      }, 300)
    },
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
    },
    clearDeviceStatusInterval() {
      if (deviceStatusTimer) {
        clearInterval(deviceStatusTimer)
      }
    },
    // endregion
    // getDestoried() {
    //   //执行当前页面前后插件的业务逻辑，主要用于一些清除工作
    //   console.log('销毁组件啦啦啦啦啦啦')
    //   this.clearDeviceStatusInterval()
    //   deviceStatusTimer = null
    // },
    // 获取产品配置
    getProductConfig(bigVer) {
      return new Promise((resolve, reject) => {
        let data = this.data
        let deviceInfo = data.deviceInfo
        if (deviceInfo.onlineStatus == DeviceData.onlineStatus.online) {
          deviceInfo.isOnline = true
        } else {
          deviceInfo.isOnline = false
          UI.toast('设备已离线，请检查网络状态')
        }
        let productModelNumber = deviceInfo.modelNumber != 0 ? DeviceData.getAO(deviceInfo.modelNumber) : deviceInfo.sn8
        let method = 'GET'
        let sendParams = {
          applianceId: deviceInfo.applianceCode,
          productTypeCode: deviceInfo.type,
          userId: data.uid,
          productModelNumber: productModelNumber || deviceInfo.sn8,
          bigVer,
          platform: 2,
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
          .then((res) => {
            console.log('获取产品配置', res)

            console.log(deviceInfo)
            // 设置页面功能
            let resData = null
            resData = JSON.parse(res.data.result.returnData)
            console.log(resData)
            do {
              if (!resData) {
                // 再次获取快开配置
                this.getProductConfig(5)
                break
              }
              if (res.data.errorCode == 50300 || res.code == 1001) {
                // 无资源重定向
                FD.redirectUnSupportDevice(this.properties.applianceData)
                break
              }
              if (this.data.specialMainPicArr.includes(deviceInfo.sn8)) {
                let bgImage = this.data.bgImage
                bgImage.standbyCommon = bgImage.standbySpecial + `main-pic-${deviceInfo.sn8}.png`
                this.setData({
                  bgImage,
                })
              }
              // 解析快开配置
              let quickDevJson = quickDev.quickDevJson2Local(resData)
              console.log('解析后参数')
              console.log(quickDevJson)
              quickDevJson.para.forEach((item) => {
                this.initProductConfigPage(item)
              })
              console.log('页面配置完成')
              console.log(this.data.pageProductConfig)

              this.setData({ deviceInfo, quickDevJson })
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
                if (res.data.errorCode == 50300 || res.code == 1001) {
                  // 无资源重定向
                  FC.redirectUnSupportDevice(this.properties.applianceData)
                  break
                }
                if (res.code != 0) {
                  let msg = FC.handleErrorMsg(res.code)
                  UI.toast(msg)
                  break
                }
                UI.toast('未知错误-配置')
              } while (false)
            }
            resolve()
          })
      })
    },
    initProductConfigPage(quickDevItem) {
      let pageProductConfig = this.data.pageProductConfig
      let subFunctionNum = this.data.subFunctionNum
      let deviceInfo = this.data.deviceInfo
      let windGearObj = this.data.windGearObj
      let humidityObj = this.data.humidityObj
      try {
        switch (quickDevItem.key) {
          case FD.apiKey.power:
            pageProductConfig.power.isShow = true
            pageProductConfig.power.hasConfig = true
            break
          case FD.apiKey.mode:
            pageProductConfig.mode.isShow = true
            pageProductConfig.mode.hasConfig = true
            let valueArray = quickDevItem.valueList
            let displayArray = quickDevItem.displayList
            if (valueArray.length === displayArray.length) {
              pageProductConfig.mode.valueObj = {}
              pageProductConfig.mode.valueArray = []
              valueArray.forEach((valueItem, index) => {
                pageProductConfig.mode.valueObj[valueItem] = displayArray[index].title
                pageProductConfig.mode.valueArray.push({
                  iconUrl: FD.getHumidityModeIcon(valueItem),
                  value: valueItem,
                  label: displayArray[index].title,
                })
              })
            }
            break
          case FD.apiKey.timing:
            pageProductConfig.timing.hasConfig = true
            pageProductConfig.timing.isShow = true
            console.log('quickDevItem.displayList', quickDevItem.displayList)

            if (quickDevItem.valueList && quickDevItem.valueList.length > 0) {
              pageProductConfig.timing.valueArray = quickDevItem.displayList
            }
            if (quickDevItem.valueListBind) {
              quickDevItem.valueListBind.forEach((valueListBindItem) => {
                if (valueListBindItem === 'on') {
                  pageProductConfig.timing.supportOff = true
                } else if (valueListBindItem === 'off') {
                  pageProductConfig.timing.supportOn = true
                }
              })
            }
            break
          // 是否显示湿度数值
          case FD.apiKey.showHumidityNum:
            if (quickDevItem.valueList && quickDevItem.valueList.length > 0) {
              deviceInfo.isShowHumidityNum = quickDevItem.valueList[0] === 'true'
            }
            break
          // 档位
          case FD.apiKey.gear:
            pageProductConfig.windGear.hasConfig = true
            pageProductConfig.windGear.isShow = true
            if (quickDevItem.valueList && quickDevItem.valueList.length > 0) {
              let valueArray = []
              quickDevItem.valueList.forEach((valueItem, index) => {
                valueArray.push({
                  value: valueItem,
                  label: quickDevItem.displayList[index],
                })
                windGearObj.windGearMarkList.push(quickDevItem.displayList[index])
              })
              pageProductConfig.windGear.valueArray = valueArray
            }
            break
          // 风速
          case FD.apiKey.windSpeed:
            pageProductConfig.windSpeed.hasConfig = true
            pageProductConfig.windSpeed.isShow = true
            if (quickDevItem.valueList && quickDevItem.valueList.length > 0) {
              let valueArray = []
              quickDevItem.valueList.forEach((valueItem, index) => {
                valueArray.push({
                  value: valueItem,
                  label: quickDevItem.displayList[index],
                  disabled: false, //3A40FW特殊需求：雾量档位为非关闭状态的时候，风速的关闭按钮需要置灰处理
                })
              })
              pageProductConfig.windSpeed.valueArray = valueArray
            }
            break
          // 灯光配置
          case FD.apiKey.light:
            pageProductConfig.brightLed.hasConfig = true
            pageProductConfig.brightLed.isShow = true
            console.log('quickDevItem', quickDevItem)
            let arr = quickDevItem.displayList ? quickDevItem.displayList : quickDevItem.displayListBind[0]
            if (quickDevItem.valueList && quickDevItem.valueList.length > 0) {
              let valueArray = []
              quickDevItem.valueList.forEach((valueItem, index) => {
                valueArray.push({
                  value: valueItem,
                  label: arr[index],
                })
              })
              pageProductConfig.brightLed.valueArray = valueArray
            }
            break
          //湿度配置
          case FD.apiKey.humidity:
            pageProductConfig.humidity.hasConfig = true
            pageProductConfig.humidity.isShow = true
            if (quickDevItem.valueList && quickDevItem.valueList.length > 0) {
              let valueArray = []
              quickDevItem.valueList.forEach((valueItem, index) => {
                valueArray.push({
                  value: Number(valueItem),
                  label: quickDevItem.displayList[index],
                })
              })
              pageProductConfig.humidity.valueArray = valueArray
              console.log('湿度数组', pageProductConfig.humidity.valueArray)
              valueArray.forEach((item) => {
                if (Number(item.label) % 5 === 0) {
                  humidityObj.humidityMarkList.push(item.label + '%')
                } else if (!Number(item.label)) {
                  humidityObj.humidityMarkList.push(item.label)
                }
              })
              // 人因加湿器步进为1
              if (deviceInfo.sn8 === '202Z219S') {
                humidityObj.min = pageProductConfig.humidity.valueArray[0].value
                humidityObj.max =
                  pageProductConfig.humidity.valueArray[pageProductConfig.humidity.valueArray.length - 1].value
              } else {
                humidityObj.min = 1
                humidityObj.max = pageProductConfig.humidity.valueArray.length
              }
            }
            break
          // 风干
          case FD.apiKey.airDry:
            pageProductConfig.airDry.hasConfig = true
            pageProductConfig.airDry.isShow = true
            break
          // 声音
          case FD.apiKey.buzzer:
            subFunctionNum = subFunctionNum + 1
            pageProductConfig.buzzer.hasConfig = true
            pageProductConfig.buzzer.isShow = true
            break
          // 净离子
          case FD.apiKey.netIons:
            subFunctionNum = subFunctionNum + 1
            pageProductConfig.netIons.hasConfig = true
            pageProductConfig.netIons.isShow = true
            break
          // 屏幕显示
          case FD.apiKey.displayOnOff:
            subFunctionNum = subFunctionNum + 1
            pageProductConfig.displayOnOff.hasConfig = true
            pageProductConfig.displayOnOff.isShow = true
            break
          case FD.apiKey.disinfection:
            deviceInfo.hasDisinfection = true
            break
          default:
            break
        }

        this.setData({ pageProductConfig, humidityObj, windGearObj, subFunctionNum })
      } catch (error) {
        console.log(error)
      }
    },
    // 启动功能
    onClickControl(controlParams, options) {
      let { isNoLoading, isNoDataInit } = options || {}
      return new Promise((resolve, reject) => {
        if (!isNoLoading) {
          UI.showLoading()
        }
        this.requestControl({
          control: controlParams,
        })
          .then((res) => {
            if (!isNoLoading) {
              UI.hideLoading()
            }
            if (!isNoDataInit) {
              this.dataInit(res.data.data.status)
            }
            resolve()
          })
          .catch((err) => {
            console.log(err)
            let res = err
            do {
              if (!isNoLoading) {
                UI.hideLoading()
              }
              if (res.data.code != 0) {
                let msg = FD.handleErrorMsg(res.data.code)
                UI.toast(msg)
                break
              }
              if (!isNoDataInit) {
                this.dataInit(res.data.data.status)
              }
            } while (false)
          })
      })
    },

    // 定时选项改变
    timingPickerOnChange(event) {
      let data = this.data
      let deviceInfo = data.deviceInfo
      let pageProductConfig = data.pageProductConfig
      if (!deviceInfo.isOnline) {
        return
      }
      let val = event.detail.value
      console.log('val:', val)
      pageProductConfig.timing.selectedValue = val
      this.setData({ pageProductConfig })
    },
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
    // endregion
    // region 显示和隐藏定时对话框
    showTimingModal() {
      let pageProductConfig = this.data.pageProductConfig
      pageProductConfig.timing.isShowTimedShutdown = true
      // 初始化
      this.timingPickerOnChange({ detail: { value: pageProductConfig.timing.selectedValue||pageProductConfig.timing.valueArray[0] } })
      this.setData({ pageProductConfig })
    },
    closeTimingModal() {
      let pageProductConfig = this.data.pageProductConfig
      pageProductConfig.timing.isShowTimedShutdown = false
      this.setData({ pageProductConfig })
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

    // 获取状态
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
              // console.log('获取设备状态：', res)
              if (res.data.code != 0) {
                let msg = FD.handleErrorMsg(res.data.code)
                UI.toast(msg)
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
                  let msg = FD.handleErrorMsg(res.code)
                  UI.toast(msg)
                  break
                }
                UI.toast('未知错误-状态')
              } while (false)
            }
            resolve()

            if (err && err.data && (err.data.code == 1307 || err.data.code == 40670)) {
              this.setData({
                _applianceData: {
                  onlineStatus: 0,
                  offlineFlag: true,
                },
                statusObj: {
                  statusPoint: 'off',
                  statusText: '已离线',
                },
              })
              wx.setStorage({
                key: 'offlineFlag',
                data: true,
              })
            } else if (err && err.data && err.data.code == 1306) {
              wx.showToast({
                title: '设备未响应，请稍后尝试刷新',
                icon: 'none',
                duration: 3000,
              })
            }
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
          apptype_name: '加湿器',
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
            let weatherObj = res.data.data.observe
            // 温度取小数点前面
            weatherObj = {
              ...weatherObj,
              temperature: weatherObj.temperature.split('.')[0],
            }
            this.setData({
              weatherObj,
            })
          })
          .catch((err) => {
            reject()
          })
      })
    },
  },
  attached() {
    const app = getApp()
    let deviceInfo = this.data.deviceInfo
    wx.nextTick(() => {
      Object.assign(deviceInfo, this.properties.applianceData)
      console.log(JSON.stringify(deviceInfo))
      this.setData({
        uid: app.globalData.userData.uid,
        _applianceData: this.properties.applianceData,
        deviceInfo: deviceInfo,
      })
      let param = {}
      param['page_name'] = '首页'
      param['object'] = '进入插件页'
      this.rangersBurialPointClick('plugin_page_view', param)
      // 获取快开配置
      try {
        let that = this
        this.getProductConfig(DeviceData.bigVer).then(() => {
          wx.getLocation({
            type: 'wgs84',
            success(res) {
              that.getWeather({
                latitude: res.latitude,
                longitude: res.longitude,
              })
            },
          })
          // 获取设备状态
          this.updateStatus().then(() => {
            this.deviceStatusInterval()
            this.setData({
              isInit: true,
            })
          })
        })
      } catch (e) {
        console.error(e)
      }
    })
  },
  // 销毁组件
  detached() {
    console.log('销毁组件');
    //执行当前页面前后插件的业务逻辑，主要用于一些清除工作
    if (deviceStatusTimer) {
      clearInterval(deviceStatusTimer)
    }
    // 数据初始化
    deviceStatusTimer = null
  },
})
