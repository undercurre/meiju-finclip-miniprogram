const app = getApp() //获取应用实例
const requestService = app.getGlobalConfig().requestService
const rangersBurialPoint = app.getGlobalConfig().rangersBurialPoint
import { getStamp } from 'm-utilsdk/index'

import { FA, errorName } from './js/FA.js'
import { parseComponentModel } from '../../assets/scripts/common.js'
import { Format } from '../../assets/scripts/format.js'
import { UI } from '../../assets/scripts/ui.js'
import MideaToast from '../../component/midea-toast/toast.js'
import { DeviceData } from '../../assets/scripts/device-data.js'
import { commonApi, imageDomain } from '../../assets/scripts/api.js'

let deviceStatusTimer = null
let isDeviceInterval = true
let themeStyleColor = '#267AFF'

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
    // 设备状态
    status: null,
    // 判断是否正在定时
    hasTiming: false,
    minSliderValue: 1,
    sliderList: [],
    // region 2021.11.22 敖广骏
    isInit: false,
    noticeBar: {
      isShow: false,
      content: '内容',
    },
    bgImage: {
      url1: imageDomain + '/0xFB/bg.png',
      url2: imageDomain + '/0xFB/bg-running.png',
      url3: imageDomain + '/0xFA/bg-running-move.png',
    },
    iconUrl: {
      power: imageDomain + '/0xFB/icon-switch.png',
      clock: imageDomain + '/0xF1/icon-shijian.png',
      gear: imageDomain + '/0xFA/kit-gear.png',
      swing: imageDomain + '/0xFA/kit-swing.png',
      tempWindSwitch: imageDomain + '/0xFA/kit-temp-wind-switch.png',
      displayOnOff: imageDomain + '/0xFA/kit-display-on-off.png',
      breathLight: imageDomain + '/0xFA/kit-breath-light.png',
      waterions: imageDomain + '/0xFA/kit-waterions.png',
      humidify: imageDomain + '/0xFA/kit-humidify.png',
      airDried: imageDomain + '/0xFA/kit-air-dried.png',
      anion: imageDomain + '/0xFA/kit-anion.png',
      lock: imageDomain + '/0xFB/icon-lock.png',
      voice: imageDomain + '/0xFC/icon-voiceOnOff.png',
      udSwing: imageDomain + '/0xFA/kit-ud-swing.png',
    },
    cardNormalHeight: 120,
    pageProductConfig: {
      power: {
        isShow: false,
        hasConfig: false,
      },
      mode: {
        isShow: false,
        iconUrl: imageDomain + '/0xFB/icon-switch.png',
        hasConfig: false,
        isShowSelectMode: false,
      },
      timing: {
        isShow: false,
        hasConfig: false,
        isShowTimedShutdown: false,
        selectedValue: [0],
        valueArray: [],
      },
      gear: {
        isShow: false,
        hasConfig: false,
        valueArray: {},
        activatedValueArray: [],
      },
      displayOnOff: {
        isShow: false,
        hasConfig: false,
        valueArray: [],
      },
      anion: {
        isShow: false,
        hasConfig: false,
      },
      lock: {
        isShow: false,
        hasConfig: false,
      },
      voice: {
        isShow: false,
        hasConfig: false,
      },
      swing: {
        isShow: false,
        hasConfig: false,
        valueArray: [],
      },
      udSwing: {
        isShow: false,
        hasConfig: false,
        valueArray: [],
      },
      tempWindSwitch: {
        isShow: false,
        hasConfig: false,
      },
      humidify: {
        isShow: false,
        hasConfig: false,
      },
      waterions: {
        isShow: false,
        hasConfig: false,
      },
      breathLight: {
        isShow: false,
        hasConfig: false,
      },
      airDried: {
        isShow: false,
        hasConfig: false,
      },
    },
    // 定义控件
    powerBtn: parseComponentModel({
      disabled: false,
    }),
    modeBtn: parseComponentModel({
      disabled: false,
    }),
    sliderGear: {
      min: 1,
      max: 1,
      interval: 1,
      currentValue: 4,
    },
    switchDisplayOnOff: parseComponentModel({
      color: themeStyleColor,
      selected: false,
      disabled: true,
    }),
    switchAnion: parseComponentModel({
      color: themeStyleColor,
      selected: false,
      disabled: true,
    }),
    switchLock: parseComponentModel({
      color: themeStyleColor,
      selected: false,
      disabled: true,
    }),
    switchVoice: parseComponentModel({
      color: themeStyleColor,
      selected: false,
      disabled: true,
    }),
    switchTempWindSwitch: parseComponentModel({
      color: themeStyleColor,
      selected: false,
      disabled: true,
    }),
    switchHumidify: parseComponentModel({
      color: themeStyleColor,
      selected: false,
      disabled: true,
    }),
    switchAirDried: parseComponentModel({
      color: themeStyleColor,
      selected: false,
      disabled: true,
    }),
    switchWaterions: parseComponentModel({
      color: themeStyleColor,
      selected: false,
      disabled: true,
    }),
    switchBreathLight: parseComponentModel({
      color: themeStyleColor,
      selected: false,
      disabled: true,
    }),

    // endregion
    // region 2021.09.14 敖广骏
    deviceInfo: {
      isRunning: false,
      isOnline: false,
    },
    userData: undefined,
    configList: {},
    userInfo: null,
    isSupportCard: false,
    isNewSwingProtocol: false,
    // 最新协议,版本号>6
    isNewestSwingProtocol: false,
    swingSliderList: [],
  },
  methods: {
    // 状态初始化
    dataInit(newDeviceStatus) {
      let data = this.data
      let deviceInfo = data.deviceInfo
      let pageProductConfig = data.pageProductConfig
      let modeBtn = parseComponentModel(data.modeBtn)
      let sliderGear = data.sliderGear
      let isNewSwingProtocol = data.isNewSwingProtocol
      let isNewestSwingProtocol = data.isNewestSwingProtocol
      let switchTempWindSwitch = parseComponentModel(data.switchTempWindSwitch)
      let switchDisplayOnOff = parseComponentModel(data.switchDisplayOnOff)
      let switchAnion = parseComponentModel(data.switchAnion)
      let switchLock = parseComponentModel(data.switchLock)
      let switchVoice = parseComponentModel(data.switchVoice)
      let switchBreathLight = parseComponentModel(data.switchBreathLight)
      let switchWaterions = parseComponentModel(data.switchWaterions)
      let switchHumidify = parseComponentModel(data.switchHumidify)
      let switchAirDried = parseComponentModel(data.switchAirDried)
      console.log('数据初始化')
      console.log(newDeviceStatus)
      if (newDeviceStatus) {
        deviceInfo.status = newDeviceStatus
        Object.assign(deviceInfo, newDeviceStatus)
        let errCode = Number(newDeviceStatus.error_code)
        if (errCode !== 0) {
          this.showNoticeBar(FA.handleErrorMsg(errCode))
        } else {
          this.closeNoticeBar()
        }
        // 电源
        if (newDeviceStatus.power === 'on') {
          deviceInfo.isRunning = true
          modeBtn.disabled = false
          switchTempWindSwitch.disabled = false
          switchDisplayOnOff.disabled = false
          switchAnion.disabled = false
          switchVoice.disabled = false
          switchWaterions.disabled = false
          switchBreathLight.disabled = false
          switchHumidify.disabled = false
          switchAirDried.disabled = false
        } else {
          deviceInfo.isRunning = false
          modeBtn.disabled = true
          switchTempWindSwitch.disabled = true
          switchDisplayOnOff.disabled = true
          switchAnion.disabled = true
          switchVoice.disabled = true
          switchWaterions.disabled = true
          switchBreathLight.disabled = true
          switchHumidify.disabled = true
          switchAirDried.disabled = true
        }

        // 童锁
        if (pageProductConfig.lock.hasConfig && pageProductConfig.lock.isShow) {
          switchLock.selected = newDeviceStatus.lock === 'on'
          // 隐藏操作功能
          for (let key in pageProductConfig) {
            if (key !== FA.apiKey.power && key !== FA.apiKey.lock) {
              // eslint-disable-next-line no-prototype-builtins
              if (pageProductConfig.hasOwnProperty(key)) {
                pageProductConfig[key].isShow = !switchLock.selected
              }
            }
          }
        }
        // 模式
        if (pageProductConfig.mode.hasConfig && newDeviceStatus.mode) {
          for (let i = 0; i < pageProductConfig.mode.valueArray.length; i++) {
            let valueItem = pageProductConfig.mode.valueArray[i]
            if (newDeviceStatus.mode === 'double_area') {
              newDeviceStatus.mode = 'self_selection'
            }
            if (valueItem.value === newDeviceStatus.mode) {
              deviceInfo.modeName = valueItem.label
              pageProductConfig.mode.iconUrl = valueItem.iconUrl?.url1
              break
            }
          }
        }
        // 定时开关
        let timingSeconds = 0
        let hasTiming = false
        let timeOnMinutes = newDeviceStatus.timer_on_hour * 60 + newDeviceStatus.timer_on_minute
        let timeOffMinutes = newDeviceStatus.timer_off_hour * 60 + newDeviceStatus.timer_off_minute
        if (timeOnMinutes > 0) {
          pageProductConfig.timing.label = '定时开机'
          timingSeconds = Number(timeOnMinutes) * 60
          hasTiming = true
        }
        if (timeOffMinutes > 0) {
          pageProductConfig.timing.label = '定时关机'
          timingSeconds = Number(timeOffMinutes) * 60
          hasTiming = true
        }
        if (hasTiming) {
          let formatSecond = Format.formatSeconds(timingSeconds)

          pageProductConfig.timing.value = {
            hour: Format.getTime(formatSecond.hours),
            minute: Format.getTime(formatSecond.minutes),
            second: Format.getTime(formatSecond.seconds),
          }
        } else {
          pageProductConfig.timing.value = undefined
        }
        this.setData({
          hasTiming,
        })
        // 档位(风速)
        if (pageProductConfig.gear.hasConfig && pageProductConfig.gear.valueArray) {
          let activatedValueArray = (pageProductConfig.gear.activatedValueArray =
            pageProductConfig.gear.valueArray[newDeviceStatus.mode])
          if (activatedValueArray) {
            deviceInfo.hasLabel = false
            activatedValueArray.forEach((valueItem) => {
              if (valueItem.value === newDeviceStatus.gear) {
                deviceInfo.gearLabel = valueItem.label
                deviceInfo.hasLabel = true
              }
            })
            let temp = []
            sliderGear.min = activatedValueArray[0].value
            sliderGear.max = activatedValueArray[activatedValueArray.length - 1].value
            temp = [sliderGear.min, sliderGear.max]
            this.setData({
              sliderList: temp,
            })
            sliderGear.currentValue = Number(newDeviceStatus.gear)
            pageProductConfig.gear.isShow = true
          } else {
            pageProductConfig.gear.isShow = false
          }
        }
        // 熄屏
        if (pageProductConfig.displayOnOff.hasConfig && pageProductConfig.displayOnOff.isShow) {
          switchDisplayOnOff.selected = newDeviceStatus.display_on_off === 'off'
        }
        // 负离子
        if (pageProductConfig.anion.hasConfig && pageProductConfig.anion.isShow) {
          switchAnion.selected = newDeviceStatus.anion === 'on'
        }
        // 声音
        if (pageProductConfig.voice.hasConfig && pageProductConfig.voice.isShow) {
          deviceInfo.isOpenVoice = switchVoice.selected = newDeviceStatus.voice?.indexOf('open') > -1
        }
        // 摇头
        let swingIsOnOff = false
        let swingIsOnOffAndOpenIsAngle = false
        let udSwingIsOnOff = false
        let udSwingIsOnOffAndOpenIsAngle = false
        if (isNewestSwingProtocol && !newDeviceStatus.swing) {
          if (newDeviceStatus.lr_shake_switch !== 'off') {
            deviceInfo.swingValue = '120'
          } else if (newDeviceStatus.lr_shake_switch === 'off') {
            deviceInfo.swingValue = 'off'
          }

          if (newDeviceStatus.ud_shake_switch !== 'off') {
            deviceInfo.udSwingValue = '135'
          } else if (newDeviceStatus.ud_shake_switch === 'off') {
            deviceInfo.udSwingValue = 'off'
          }
        } else if (newDeviceStatus.swing === 'on') {
          swingIsOnOff = pageProductConfig.swing.valueArray.length === 2
          udSwingIsOnOff = pageProductConfig.udSwing.valueArray.length === 2
          if (pageProductConfig.swing.valueArray.length > 0) {
            pageProductConfig.swing.valueArray.forEach((item) => {
              if (Number(item.value)) {
                // 左右开启为角度的情况
                swingIsOnOffAndOpenIsAngle = true
              }
            })
          }
          if (pageProductConfig.udSwing.valueArray.length > 0) {
            pageProductConfig.udSwing.valueArray.forEach((item) => {
              if (Number(item.value)) {
                // 上下开启为角度的情况
                udSwingIsOnOffAndOpenIsAngle = true
              }
            })
          }

          if (swingIsOnOff) {
            // 左右摇头只有开启和关闭
            if (isNewSwingProtocol) {
              // 如果是新协议
              deviceInfo.swingValue = newDeviceStatus.swing_angle.toString()
            } else {
              // 如果是旧协议
              // swing_direction不包含lr（ud_swing_angle为unknown的话，value为on,否则为off）
              // swing_direction包含lr 但是左右摇头角度为0,value为off
              // swing_direction包含lr 并且左右摇头角度不为0（有摇头角度，value为摇头角度或者on）
              deviceInfo.swingValue = newDeviceStatus.swing_direction.includes('lr')
                ? newDeviceStatus.swing_angle === 0
                  ? 'off'
                  : swingIsOnOffAndOpenIsAngle
                  ? newDeviceStatus.swing_angle
                  : 'on'
                : newDeviceStatus.ud_swing_angle === 'unknown'
                ? 'on'
                : 'off'
            }
          } else if (newDeviceStatus.swing_angle || newDeviceStatus.swing_angle === 0) {
            // 左右摇头有角度
            deviceInfo.swingValue =
              newDeviceStatus.swing_angle === 'unknown' ? 'off' : newDeviceStatus.swing_angle.toString()
          }

          if (udSwingIsOnOff) {
            // 上下摇头只有开启和关闭
            if (isNewSwingProtocol) {
              // 如果是新协议
              deviceInfo.udSwingValue = newDeviceStatus.ud_swing_angle.toString()
            } else {
              // 如果是旧协议
              deviceInfo.udSwingValue =
                newDeviceStatus.swing_direction.includes('ud') && newDeviceStatus.ud_swing_angle != 'unknown'
                  ? newDeviceStatus.ud_swing_angle === 0
                    ? 'off'
                    : udSwingIsOnOffAndOpenIsAngle
                    ? newDeviceStatus.ud_swing_angle
                    : 'on'
                  : 'off'
            }
          } else if (newDeviceStatus.ud_swing_angle || newDeviceStatus.ud_swing_angle === 0) {
            // 上下摇头有角度
            deviceInfo.udSwingValue =
              newDeviceStatus.ud_swing_angle === 'unknown' ? 'off' : newDeviceStatus.ud_swing_angle.toString()
          }
        } else {
          // swing为off的情况
          if (isNewSwingProtocol) {
            // 如果是新协议，value等于角度
            deviceInfo.swingValue =
              newDeviceStatus.swing_angle || newDeviceStatus.swing_angle === 0
                ? newDeviceStatus.swing_angle.toString()
                : ''
            deviceInfo.udSwingValue =
              newDeviceStatus.ud_swing_angle || newDeviceStatus.ud_swing_angle === 0
                ? newDeviceStatus.ud_swing_angle.toString()
                : ''
          } else {
            // 如果是旧协议，value等于off
            deviceInfo.swingValue = 'off'
            deviceInfo.udSwingValue = 'off'
          }
        }
        console.log(deviceInfo.swingValue)
        console.log(deviceInfo.udSwingValue)
        // 风随温变
        if (pageProductConfig.tempWindSwitch.hasConfig && pageProductConfig.tempWindSwitch.isShow) {
          if (newDeviceStatus.temp_wind_switch) {
            switchTempWindSwitch.selected = newDeviceStatus.temp_wind_switch === 'on'
          } else {
            switchTempWindSwitch.selected = false
          }
        }
        // 加湿
        if (pageProductConfig.humidify.hasConfig && pageProductConfig.humidify.isShow) {
          switchHumidify.selected = newDeviceStatus.humidify !== 'off'
        }
        // 风干
        if (pageProductConfig.airDried.hasConfig && pageProductConfig.airDried.isShow) {
          switchAirDried.selected = newDeviceStatus.air_dry_switch !== 'off'
        }
        // 净离子
        if (pageProductConfig.waterions.hasConfig && pageProductConfig.waterions.isShow) {
          switchWaterions.selected = newDeviceStatus.waterions === 'on'
        }
        // 氛围灯
        if (pageProductConfig.breathLight.hasConfig && pageProductConfig.breathLight.isShow) {
          switchBreathLight.selected = newDeviceStatus.breath_light === 'on'
        }
      }
      modeBtn = parseComponentModel(modeBtn)
      switchTempWindSwitch = parseComponentModel(switchTempWindSwitch)
      switchDisplayOnOff = parseComponentModel(switchDisplayOnOff)
      switchAnion = parseComponentModel(switchAnion)
      switchLock = parseComponentModel(switchLock)
      switchVoice = parseComponentModel(switchVoice)
      switchWaterions = parseComponentModel(switchWaterions)
      switchBreathLight = parseComponentModel(switchBreathLight)
      switchHumidify = parseComponentModel(switchHumidify)
      switchAirDried = parseComponentModel(switchAirDried)
      console.log('deviceInfo')
      console.log(deviceInfo)
      this.setData({
        deviceInfo,
        pageProductConfig,
        sliderGear,
        switchLock,
        modeBtn,
        switchTempWindSwitch,
        switchDisplayOnOff,
        switchVoice,
        switchBreathLight,
        switchWaterions,
        switchHumidify,
        switchAirDried,
        switchAnion,
      })
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

    // 启动功能
    onClickControl(controlParams, options) {
      let { isNoLoading, isNoDataInit } = options || {}
      return new Promise((resolve, reject) => {
        if (!isNoLoading) {
          UI.showLoading()
        }
        this.clearDeviceStatusInterval()

        this.requestControl({
          control: controlParams,
        })
          .then((res) => {
            console.log('启动功能', res)
            if (!isNoLoading) {
              UI.hideLoading()
            }
            if (!isNoDataInit) {
              this.dataInit(res.data.data.status)
            }
            this.deviceStatusInterval()
            resolve(res)
          })
          .catch((err) => {
            console.log(err, 11111111)
            let res = err
            do {
              if (!isNoLoading) {
                UI.hideLoading()
              }
              if (res.data.code != 0) {
                let msg = FA.handleErrorMsg(res.data.code)
                MideaToast(msg)
                break
              }
              if (!isNoDataInit) {
                this.dataInit(res.data.data.status)
              }
              this.deviceStatusInterval()
            } while (false)
          })
      })
    },
    // 点击功能项
    onClickEvent(event) {
      console.log(event)
      let hasTiming = this.data.hasTiming
      let isNewSwingProtocol = this.data.isNewSwingProtocol
      let isNewestSwingProtocol = this.data.isNewestSwingProtocol
      do {
        let index = event?.currentTarget?.dataset?.index
        if (!index) {
          console.warn('缺少操作索引')
          break
        }
        let value = event?.currentTarget?.dataset?.value
        let deviceInfo = this.data.deviceInfo
        console.log('deviceInfo:', this.data.deviceInfo)
        if (!deviceInfo.isOnline) {
          break
        }
        console.log('index', index)
        switch (index) {
          // 点击开关
          case FA.apiKey.power:
            let controlParam = {
              power: deviceInfo.isRunning ? 'off' : 'on',
            }

            // 取消定时
            let timeOnMinutes = deviceInfo.timer_on_hour * 60 + deviceInfo.timer_on_minute
            let timeOffMinutes = deviceInfo.timer_off_hour * 60 + deviceInfo.timer_off_minute
            if (timeOnMinutes > 0) {
              controlParam.time_on_minute = 'clean'
            }
            if (timeOffMinutes > 0) {
              controlParam.time_off_minute = 'clean'
            }
            this.onClickControl(controlParam)
            break
          // 模式
          case FA.apiKey.mode:
            if (!deviceInfo.isRunning) {
              UI.toast('设备未启动，无法设置')
              break
            }
            this.showSelectModeModal()
            break
          // 选择模式
          case 'selectMode':
            if (!deviceInfo.isRunning) {
              UI.toast('设备未启动，无法设置')
              break
            }
            UI.showLoading('控制设备')
            this.onClickControl({
              mode: value,
            }).then((res) => {
              this.closeSelectModeModal()
              UI.hideLoading()
            })
            break
          // 定时
          case FA.apiKey.timing:
            if (hasTiming) {
              this.showCloseTimingModal()
            } else {
              this.showTimingModal()
            }
            break
          // 档位(风速)
          case FA.apiKey.gear:
            if (!deviceInfo.isRunning) {
              UI.toast('设备未启动，无法设置')
              break
            }
            this.onClickControl({
              gear: value,
            })
            break
          // 熄屏
          case FA.apiKey.displayOnOff:
            if (!deviceInfo.isRunning) {
              UI.toast('设备未启动，无法设置')
              break
            }
            let controlDisplayParams = {
              display_on_off: value,
            }
            this.onClickControl(controlDisplayParams)
            break
          // 左右摇头
          case FA.apiKey.swing:
            let controlParams = null
            let swing_angle = ''
            if (!deviceInfo.isRunning) {
              UI.toast('设备未启动，无法设置')
              break
            }
            if (isNewestSwingProtocol) {
              if (value !== 'off') {
                controlParams = {
                  lr_shake_switch: 'normal',
                  lr_angle: value,
                }
              } else {
                controlParams = {
                  lr_shake_switch: value,
                }
              }
            } else if (isNewSwingProtocol) {
              if (value !== 'off' && value !== 'on') {
                swing_angle = value
              } else if (value === 'off') {
                swing_angle = '0'
              } else {
                swing_angle = '1275'
              }
              controlParams = {
                swing_angle: swing_angle,
                swing_direction: 'lr',
              }
            } else {
              controlParams = {
                swing: value !== 'off' ? 'on' : 'off',
              }
              if (value !== 'off') {
                controlParams['swing_angle'] = Number(value) ? value : '90'
                controlParams['swing_direction'] = 'lr'
                if (deviceInfo.swing_direction.includes('ud')) {
                  controlParams['swing_direction'] = 'udlr'
                }
              } else {
                if (deviceInfo.swing_direction.includes('ud')) {
                  controlParams['swing'] = 'on'
                  controlParams['swing_direction'] = 'ud'
                }
              }
            }
            this.onClickControl(controlParams)
            break
          // 上下摇头
          case FA.apiKey.udSwing:
            let controlUdParams = null
            let ud_swing_angle = ''
            if (!deviceInfo.isRunning) {
              UI.toast('设备未启动，无法设置')
              break
            }
            if (isNewestSwingProtocol) {
              if (value !== 'off') {
                controlUdParams = {
                  ud_shake_switch: 'normal',
                  ud_angle: value,
                }
              } else {
                controlUdParams = {
                  ud_shake_switch: value,
                }
              }
            } else if (isNewSwingProtocol) {
              if (value !== 'off' && value !== 'on') {
                ud_swing_angle = value
              } else if (value === 'off') {
                ud_swing_angle = '0'
              } else {
                ud_swing_angle = '1275'
              }
              controlUdParams = {
                ud_swing_angle: ud_swing_angle,
                swing_direction: 'ud',
              }
            } else {
              controlUdParams = {
                swing: value !== 'off' ? 'on' : 'off',
              }
              if (value !== 'off') {
                controlUdParams['swing_direction'] = 'ud'
                controlUdParams['ud_swing_angle'] = Number(value) ? value : '90'
                if (deviceInfo.swing_direction.includes('lr')) {
                  controlUdParams['swing_direction'] = 'udlr'
                }
              } else {
                if (deviceInfo.swing_direction.includes('lr')) {
                  controlUdParams['swing'] = 'on'
                  controlUdParams['swing_direction'] = 'lr'
                }
              }
            }

            this.onClickControl(controlUdParams)
            break
        }
      } while (false)
    },
    changeSliderGear(event) {
      let model = event.detail
      let deviceInfo = this.data.deviceInfo
      let pageProductConfig = this.data.pageProductConfig
      let controlParam = {
        gear: model,
      }
      this.onClickControl(controlParam).then((res) => {
        this.setData({
          deviceInfo,
          pageProductConfig,
          sliderGear: { ...this.data.sliderGear, currentValue: model },
        })
        console.log('滑块参数: ', JSON.stringify(this.data.sliderGear))
      })
    },

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

    // region 显示和隐藏模式对话框
    showSelectModeModal() {
      let deviceInfo = this.data.deviceInfo
      let modeBtn = parseComponentModel(this.data.modeBtn)
      do {
        if (modeBtn.disabled) {
          break
        }
        if (!deviceInfo.isOnline) {
          MideaToast('设备已离线，请检查网络状态')
          break
        }
        let pageProductConfig = this.data.pageProductConfig
        pageProductConfig.mode.isShowSelectMode = true
        this.setData({ pageProductConfig })
      } while (false)
    },
    closeSelectModeModal() {
      let pageProductConfig = this.data.pageProductConfig
      pageProductConfig.mode.isShowSelectMode = false
      this.setData({ pageProductConfig })
    },
    // endregion

    // 取消定时
    cancelTiming(options) {
      let { isNoLoading, isNoDataInit } = options || {}
      let deviceInfo = this.data.deviceInfo
      let controlParam = {}
      let timeOnMinutes = deviceInfo.timer_on_hour * 60 + deviceInfo.timer_on_minute
      let timeOffMinutes = deviceInfo.timer_off_hour * 60 + deviceInfo.timer_off_minute
      if (timeOnMinutes > 0) {
        controlParam.timer_on_minute = 'clean'
      } else if (timeOffMinutes > 0) {
        controlParam.timer_off_minute = 'clean'
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
      do {
        let pageProductConfig = this.data.pageProductConfig
        let deviceInfo = this.data.deviceInfo
        UI.showLoading()
        setTimeout(() => {
          console.log('pageProductConfig.timing', pageProductConfig.timing)
          let selectedIndex = pageProductConfig.timing.selectedValue[0]
          let valueArray = pageProductConfig.timing.valueArray
          let selectedValue = valueArray[selectedIndex]
          let valueNumber = Number(selectedValue.value)
          let minutes = valueNumber % 1
          if (minutes > 0) {
            minutes = minutes * 60
          }
          let controlParam = {}
          if (deviceInfo.isRunning) {
            controlParam.timer_off_hour = selectedValue.value
            controlParam.timer_off_minute = minutes
          } else {
            controlParam.timer_on_hour = selectedValue.value
            controlParam.timer_on_minute = minutes
          }
          this.onClickControl(controlParam).then((res) => {
            console.log('定时成功后的res:', res)
            UI.toast('操作成功')
            UI.hideLoading()
            this.closeTimingModal()
            this.setData({
              hasTiming: true,
            })
          })
        }, 300)
      } while (false)
    },
    // 定时选项改变
    timingPickerOnChange(event) {
      do {
        let data = this.data
        let deviceInfo = data.deviceInfo
        let pageProductConfig = data.pageProductConfig
        if (!deviceInfo.isOnline) {
          break
        }
        let val = event.detail.value
        pageProductConfig.timing.selectedValue = val
        this.setData({ pageProductConfig })
      } while (false)
    },
    // region 显示和隐藏定时对话框
    showTimingModal() {
      let pageProductConfig = this.data.pageProductConfig
      pageProductConfig.timing.isShowTimedShutdown = true
      this.setData({ pageProductConfig })
    },
    showCloseTimingModal() {
      wx.showModal({
        title: '温馨提示',
        content: this.data.deviceInfo.isRunning ? '确定关闭“定时关机”吗' : '确定关闭“定时开机”吗',
        success: (res) => {
          if (res.confirm) {
            this.cancelTiming()
            this.setData({
              hasTiming: false,
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        },
      })
    },
    closeTimingModal() {
      let pageProductConfig = this.data.pageProductConfig
      pageProductConfig.timing.isShowTimedShutdown = false
      this.setData({ pageProductConfig })
    },
    // endregion
    switchDisplayOnOffChange(event) {
      let model = event.detail
      this.onClickControl({
        display_on_off: model.selected ? 'off' : 'on',
      }).then((res) => {
        this.setData({
          switchDisplayOnOff: parseComponentModel(model),
        })
      })
    },
    switchAnionChange(event) {
      let model = event.detail
      this.setData({
        switchAnion: parseComponentModel(model),
      })
      this.onClickControl({
        anion: model.selected ? 'on' : 'off',
      })
    },
    switchLockChange(event) {
      let model = event.detail
      this.setData({
        switchLock: parseComponentModel(model),
      })
      this.onClickControl({
        lock: model.selected ? 'on' : 'off',
      })
    },
    switchVoiceChange(event) {
      let model = event.detail
      this.setData({
        switchVoice: parseComponentModel(model),
      })
      this.onClickControl({
        voice: model.selected ? 'open_buzzer' : 'close_buzzer',
      })
    },

    switchTempWindChange(event) {
      let model = event.detail
      this.setData({
        switchTempWindSwitch: parseComponentModel(model),
      })
      this.onClickControl({
        temp_wind_switch: model.selected ? 'on' : 'off',
      })
    },
    switchHumidifyChange(event) {
      let model = event.detail
      this.setData({
        switchHumidify: parseComponentModel(model),
      })
      this.onClickControl({
        humidify: model.selected ? '1' : 'off',
      })
    },
    switchAirDriedChange(event) {
      let model = event.detail
      this.setData({
        switchAirDried: parseComponentModel(model),
      })
      this.onClickControl({
        air_dry_switch: model.selected ? 'on' : 'off',
      })
    },
    switchWaterionsChange(event) {
      let model = event.detail
      this.setData({
        switchWaterions: parseComponentModel(model),
      })
      this.onClickControl({
        waterions: model.selected ? 'on' : 'off',
      })
    },
    switchBreathLightChange(event) {
      let model = event.detail
      this.setData({
        switchBreathLight: parseComponentModel(model),
      })
      this.onClickControl({
        breath_light: model.selected ? 'on' : 'off',
      })
    },

    // endregion
    // region 2021.09.14 敖广骏
    // 获取产品配置
    getProductConfig() {
      return new Promise((resolve, reject) => {
        let data = this.data
        let deviceInfo = data.deviceInfo
        let swingSliderList = data.swingSliderList
        if (deviceInfo.onlineStatus == DeviceData.onlineStatus.online) {
          deviceInfo.isOnline = true
        } else {
          deviceInfo.isOnline = false
          MideaToast('设备已离线，请检查网络状态')
        }
        // 设备调试
        let productModelNumber =
          deviceInfo.modelNumber != 0
            ? deviceInfo.modelNumber >= 10
              ? '000000' + deviceInfo.modelNumber
              : '0000000' + deviceInfo.modelNumber
            : deviceInfo.sn8
        // let productModelNumber = deviceInfo.sn8
        let method = 'GET'
        let sendParams = {
          applianceId: deviceInfo.applianceCode,
          productTypeCode: deviceInfo.type,
          userId: data.uid,
          productModelNumber: productModelNumber,
          bigVer: DeviceData.bigVer,
          platform: 2, // 获取美居/小程序功能，2-小程序
        }
        let isDebug = false
        if (!isDebug) {
          sendParams = {
            serviceName: 'node-service',
            uri: '/productConfig' + Format.jsonToParam(sendParams),
            method: 'GET',
            contentType: 'application/json',
          }
          method = 'POST'
        }
        requestService
          .request(commonApi.sdaTransmit, sendParams, method)
          .then((res) => {
            console.log('获取产品配置')
            console.log(deviceInfo)
            console.log(res)
            // 设置页面功能
            let resData = JSON.parse(res.data.result.returnData)
            console.log(res)
            console.log(resData)
            do {
              let quickDevJson = FA.quickDevJson2Local(resData)
              let pageProductConfig = this.data.pageProductConfig
              deviceInfo.model = quickDevJson.model
              console.log('解析后参数')
              console.log(quickDevJson)
              if (quickDevJson.properties.productInfo) {
                this.setData({ isSupportCard: true })
              }
              // 判断产品配置
              let functions = resData.functions
              if (functions && functions.length > 0) {
                functions.forEach((functionItem) => {
                  let settings = functionItem.settings
                  switch (functionItem.code) {
                    // 电源
                    case FA.apiCode.power:
                      pageProductConfig.power.hasConfig = true
                      pageProductConfig.power.isShow = true
                      break
                    // 模式
                    case FA.apiCode.mode:
                      pageProductConfig.mode.hasConfig = true
                      pageProductConfig.mode.isShow = true
                      // 获取配置参数
                      pageProductConfig.mode.valueArray = FA.getValueArray(settings, { hasIcon: true })
                      break
                    // 定时
                    case FA.apiCode.timing:
                      pageProductConfig.timing.hasConfig = true
                      pageProductConfig.timing.isShow = true
                      pageProductConfig.timing.valueArray = FA.getValueArray(settings)
                      break
                    // 档位(风速)
                    case FA.apiCode.gear:
                      pageProductConfig.gear.hasConfig = true
                      pageProductConfig.gear.valueArray = {}
                      if (settings && settings.length > 0) {
                        settings.forEach((settingItem) => {
                          let properties = settingItem.properties
                          if (properties.list && properties.list.length > 0) {
                            let valueArray = []
                            properties.list.forEach((item) => {
                              valueArray.push({
                                value: Number(item.value),
                                label: item.label,
                              })
                            })
                            pageProductConfig.gear.valueArray[properties.bindValue] = valueArray
                          }
                        })
                      }
                      break
                    // 熄屏
                    case FA.apiCode.displayOnOff:
                      pageProductConfig.displayOnOff.hasConfig = true
                      pageProductConfig.displayOnOff.isShow = true
                      pageProductConfig.displayOnOff.valueArray = FA.getValueArray(settings)
                      break
                    // 负离子
                    case FA.apiCode.anion:
                      pageProductConfig.anion.hasConfig = true
                      pageProductConfig.anion.isShow = true
                      break
                    // 童锁
                    case FA.apiCode.lock:
                      pageProductConfig.lock.hasConfig = true
                      pageProductConfig.lock.isShow = true
                      break
                    // 声音
                    case FA.apiCode.voice:
                      pageProductConfig.voice.hasConfig = true
                      pageProductConfig.voice.isShow = true
                      break
                    // 左右摇头
                    case FA.apiCode.swing:
                      pageProductConfig.swing.hasConfig = true
                      pageProductConfig.swing.isShow = true
                      pageProductConfig.swing.valueArray = FA.getValueArray(settings)
                      // 处理slider模式的数据
                      if (pageProductConfig.swing.valueArray.length > 4) {
                        pageProductConfig.swing.valueArray.forEach((item) => {
                          swingSliderList.push(item.label)
                        })
                      }
                      break
                    // 上下摇头
                    case FA.apiCode.udSwing:
                      pageProductConfig.udSwing.hasConfig = true
                      pageProductConfig.udSwing.isShow = true
                      pageProductConfig.udSwing.valueArray = FA.getValueArray(settings)
                      break
                    // 风随温变
                    case FA.apiCode.tempWindSwitch:
                      pageProductConfig.tempWindSwitch.hasConfig = true
                      pageProductConfig.tempWindSwitch.isShow = true
                      break
                    // 加湿
                    case FA.apiCode.humidify:
                      pageProductConfig.humidify.hasConfig = true
                      pageProductConfig.humidify.isShow = true
                      break
                    // 风干
                    case FA.apiCode.airDried:
                      pageProductConfig.airDried.hasConfig = true
                      pageProductConfig.airDried.isShow = true
                      break
                    // 净离子
                    case FA.apiCode.waterions:
                      pageProductConfig.waterions.hasConfig = true
                      pageProductConfig.waterions.isShow = true
                      break
                    // 氛围灯
                    case FA.apiCode.breathLight:
                      pageProductConfig.breathLight.hasConfig = true
                      pageProductConfig.breathLight.isShow = true
                      break
                  }
                })
              }
              console.log('配置完成的参数')
              console.log(pageProductConfig)
              this.setData({
                deviceInfo: deviceInfo,
                pageProductConfig,
                configList: quickDevJson.functions,
                swingSliderList,
              })
            } while (false)
            resolve()
          })
          .catch((err) => {
            console.error(err)
            let res = err.data
            do {
              if (res) {
                if (res.result && res.result.returnData) {
                  res = JSON.parse(res.result.returnData)
                }
                // 未配置资源
                if (res.resCode == 50300 || res.code == 1001) {
                  FA.redirectUnSupportDevice(this.properties.applianceData)
                  break
                }
                UI.alertResMsg({
                  title: '获取产品配置',
                  res: res,
                })
                break
              }
              UI.toast('未知错误')
            } while (false)
            resolve()
          })
      })
    },

    // 启动一键智控模式
    setAutoMode() {
      let sendParams = {
        serviceName: 'understand-you',
        uri: 'fan/set?applianceId=' + this.properties.applianceData.applianceCode + '&enable=true',
        method: 'POST',
        contentType: 'application/json',
        userId: this.data.userData.iotUserId.toString(),
      }
      // this.closeAutoModeModal();
      wx.showLoading('加载中')
      requestService
        .request(commonApi.sdaTransmit, sendParams, 'POST')
        .then((res) => {
          wx.hideLoading()
          console.log('启动完成')
          console.log(res)
          if (res.data.errorCode == 0) {
            let returnData = res.data.result.returnData
            if (typeof returnData === 'string') {
              res = JSON.parse(returnData)
            } else {
              res = returnData
            }
            let resData = res.data
            let enable = resData.enable
            if (enable == true) {
              wx.showToast({
                title: '启动成功',
                icon: 'success',
              })
            }
          }
        })
        .catch((err) => {
          wx.hideLoading()
          console.error('启动完成')
          console.error(err)
        })
    },
    requestControl(command) {
      // 埋点
      let params = {
        control_params: JSON.stringify(command),
      }
      this.rangersBurialPointClick('plugin_button_click', params)
      if (this.data.deviceInfo.error_code && this.data.deviceInfo.error_code !== 0) {
        wx.showToast({
          title: errorName[this.data.deviceInfo.error_code] + '，设备功能暂不支持操作',
          icon: 'none',
        })
        return
      }
      return requestService.request('luaControl', {
        applianceCode: this.properties.applianceData.applianceCode,
        command: command,
        reqId: getStamp().toString(),
        stamp: getStamp(),
      })
    },
    updateStatus() {
      let isNewSwingProtocol = this.data.isNewSwingProtocol
      let isNewestSwingProtocol = this.data.isNewestSwingProtocol
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
              let status = res.data.data
              console.log('status:', status)
              this.setData({
                status,
              })
              if (res.data.code != 0) {
                let msg = FA.handleErrorMsg(res.data.code)
                MideaToast(msg)
                resolve(res)
                break
              }
              try {
                let protocolVersion = res.data.data.protocol_version
                if (protocolVersion) {
                  if (protocolVersion > 5) {
                    isNewestSwingProtocol = true
                  } else if (protocolVersion === 5) {
                    isNewSwingProtocol = true
                  }
                }
                this.setData({ isNewSwingProtocol, isNewestSwingProtocol })
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
                  let msg = FA.handleErrorMsg(res.code)
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
            } else if (err && err.data && err.data.code == 1306) {
              MideaToast('设备未响应，请稍后尝试刷新')
            }

            // this.triggerEvent('modeChange', this.getCurrentMode(this.data._applianceDataStatus));//向上层通知mode更改
          })
      })
    },
    // endregion
    // 埋点
    rangersBurialPointClick(eventName, param) {
      let deviceInfo = this.data.deviceInfo
      if (deviceInfo) {
        let paramBurial = {}
        let paramBase = {
          module: '插件',
          apptype_name: '风扇',
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
  detached() {
    this.clearDeviceStatusInterval()
    deviceStatusTimer = null
  },
  async attached() {
    const app = getApp()
    console.log(app.globalData)
    let deviceInfo = this.data.deviceInfo
    Object.assign(deviceInfo, this.properties.applianceData)
    this.setData({
      uid: app.globalData.userData.uid,
      userData: app.globalData.userData,
      _applianceData: this.properties.applianceData,
      deviceInfo: deviceInfo,
    })
    let param = {}
    param['page_name'] = '首页'
    param['object'] = '进入插件页'
    this.rangersBurialPointClick('plugin_page_view', param)
    if (deviceInfo.onlineStatus == DeviceData.onlineStatus.online) {
      deviceInfo.isOnline = true
    } else {
      deviceInfo.isOnline = false
    }

    this.getProductConfig().then(() => {
      // 获取设备状态
      this.updateStatus().then(() => {
        this.deviceStatusInterval()
        this.setData({
          isInit: true,
        })
      })
      // 获取功能区域高度
      let windowHeight = wx.getSystemInfoSync().windowHeight
      wx.createSelectorQuery()
        .in(this)
        .select('.controller-wrapper')
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
  },
})
