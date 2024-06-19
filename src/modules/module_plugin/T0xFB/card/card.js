const app = getApp() //获取应用实例
const requestService = app.getGlobalConfig().requestService
const rangersBurialPoint = app.getGlobalConfig().rangersBurialPoint
import { getStamp } from 'm-utilsdk/index'

import { getTimeRange, menuId, modeDesc } from './js/FB.js'
import { modeName, pickerType } from './js/FB'
import MideaToast from '../component/media-toast/toast.js'
import { parseComponentModel } from '../common/script/common'
import { parseDeviceConfig, requestParam } from '../assets/script/utils/request-param'
import { UI } from '../common/script/ui'
import { Dict } from '../common/script/dict'
import { DeviceFunctionConfig } from '../assets/script/device-function-config'
import quickDev from '../common/script/quickDev'
import { commonApi, imageDomain } from '../common/script/api'
import { Format } from '../assets/script/format'

let deviceStatusTimer = null
let deviceShutdownTimer = null
let isDebug = false
let isLoading = false
let productConfig = {}
Component({
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    applianceData: Object,
  },
  data: {
    // 这两个模式，不显示头图中温度档位
    displayTempOffMode: ['nature_cool', 'idle'],

    // region 2021.08.10 Ao
    // region 定义属性
    newDeviceStatus: null,
    // 当前协议版本
    currentProtocolVersion: 0,
    // 解析后的快开
    quickDevJson: null,
    // 当前为冷风/暖风
    currentCoolOrWarmIndex: 0,
    isShowBottom: false,
    iconUrl: {
      arrow: {
        url1: imageDomain + '/0xE7/icon-arrow-r.png',
      },
    },
    deviceLabel: {
      mode: [],
      timing: [],
      gear: {},
      temp: [],
      coldAndWarmCtrlList: [],
      coldAndWarm: [],
      fireLightList: [],
      disinfectList: [],
    },
    functionIsDisabled: {
      sound: false,
    },
    isInit: false,
    cardNormalHeight: '120',
    deviceInfo: {
      isOnline: isDebug,
      isRunning: isDebug,
    },
    themeColor: 'theme-color',
    controllerInfo: {
      noticeBar: {
        isShow: false,
        content: undefined,
      },
      switchBtn: {
        isShow: true,
        value: undefined,
        iconUrl: imageDomain + '/0xFB/icon-switch.png',
        bgUrl1: imageDomain + '/0xFB/bg.png',
        bgUrl2: imageDomain + '/0xFB/bg-running.png',
        bgUrl3: imageDomain + '/0xFB/bg-running-move.png',
        url1: imageDomain + '/0xFB/bg.png',
        url2: imageDomain + '/0xFB/bg-running.png',
        url3: imageDomain + '/0xFA/bg-running-move.png',
      },
      modeBtn: undefined,
      timedShutdownBtn: undefined,
      temperatureSlider: undefined,
      gearButtons: undefined,
      childLock: undefined,
      gearSlider: undefined,
      disinfect: undefined,
      coldAndWarm: undefined,
      sound: undefined,
      screenDisplay: undefined,
      fireLight: undefined,
      humidify: undefined,
      shake: undefined,
      udShake: undefined,
      coolWarm: undefined,
    },
    timedShutdownPickerColumns: {
      hours: [],
      minutes: [],
      selectedValue: [0],
    },
    repeatPicker: {
      hours: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
      selectedValue: [0],
    },
    isShowSelectMode: false,
    isShowTimedShutdown: false,
    isShowRepeatPick: false,
    controllerHeight: 500,
    // endregion

    // region 定义组件
    childLockSwitch: parseComponentModel({
      selected: false,
      disabled: false,
    }),
    soundSwitch: parseComponentModel({
      selected: false,
      disabled: false,
      ctrlKey: 'voice',
      activeType: 'active',
    }),
    screenDisplaySwitch: parseComponentModel({
      selected: false,
      disabled: false,
      ctrlKey: 'screen_close',
      activeType: 'active',
    }),
    fireLightSwitch: parseComponentModel({
      selected: false,
      disabled: false,
      ctrlKey: 'fire_light',
      activeType: 'active',
    }),
    humidifySwitch: parseComponentModel({
      selected: false,
      disabled: false,
      ctrlKey: 'humidify_switch',
      activeType: 'active',
    }),
    shakeSwitch: parseComponentModel({
      selected: false,
      disabled: false,
      ctrlKey: 'shake_switch',
      activeType: 'active',
    }),
    udShakeSwitch: parseComponentModel({
      selected: false,
      disabled: false,
      ctrlKey: 'udShake_switch',
      activeType: 'active',
    }),
    temperatureSlider: parseComponentModel({
      min: 5,
      max: 35,
      unit: '℃',
      currentValue: 15,
    }),
    switchBtn: parseComponentModel({
      disabled: false,
    }),
    modeBtn: parseComponentModel({
      disabled: true,
      rightWrapper: {
        text: {
          content: '模式',
        },
      },
    }),
    timedShutdownBtn: parseComponentModel({
      disabled: true,
    }),
    gearSlider: parseComponentModel({
      min: 1,
      max: 10,
      interval: 3,
      unit: '档',
      currentValue: 1,
      isActiveCold: false,
    }),
    // endregion

    // region 2021.08.10 之前代码
    buttonSize: '110rpx',
    icons: {
      greyTriangle: 'assets/img/grey-triangle.png',
    },
    rowClass1: 'row-sb',
    rowClass2: 'row-sb',
    circleImg: {
      blue: imageDomain + '/0xFB/circle-blue.png',
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
    circleSrc: '',
    power: {},
    warmAir: {},
    coldAir: {},
    gear: {},
    shake: {},
    humidityMode: {},
    eco: {},
    timerOn: {},
    timerOff: {},
    offlineFlag: false,
    modeHasNoGear: false,
    mainTitle: '',
    powerDataList: {
      on: {
        mainImg: imageDomain + '/0xFB/power-off.png',
        desc: '关机',
      },
      off: {
        mainImg: imageDomain + '/0xFB/power-on.png',
        desc: '开机',
      },
    },
    warmAirDataList: {
      on: {
        mainImg: imageDomain + '/0xFB/warm-air-on.png',
        desc: modeName.warmAir,
      },
      off: {
        mainImg: imageDomain + '/0xFB/warm-air-off.png',
        desc: modeName.warmAir,
      },
      disabled: {
        mainImg: imageDomain + '/0xFB/warm-air-off.png',
        desc: modeName.warmAir,
      },
    },
    coldAirDataList: {
      on: {
        mainImg: imageDomain + '/0xFB/cold-air-on.png',
        desc: modeName.coldAir,
      },
      off: {
        mainImg: imageDomain + '/0xFB/cold-air-off.png',
        desc: modeName.coldAir,
      },
      disabled: {
        mainImg: imageDomain + '/0xFB/cold-air-off.png',
        desc: modeName.coldAir,
      },
    },
    gearDataList: {
      onWarm: {
        mainImg: imageDomain + '/0xFB/gear-on-warm.png',
        desc: modeName.gear,
      },
      onCold: {
        mainImg: imageDomain + '/0xFB/gear-on-cold.png',
        desc: modeName.gear,
      },
      off: {
        mainImg: imageDomain + '/0xFB/gear-off.png',
        desc: modeName.gear,
      },
      disabled: {
        mainImg: imageDomain + '/0xFB/gear-off.png',
        desc: modeName.gear,
      },
    },
    shakeDataList: {
      onWarm: {
        mainImg: imageDomain + '/0xFB/shake-on-warm.png',
        desc: modeName.shake,
      },
      onCold: {
        mainImg: imageDomain + '/0xFB/shake-on-cold.png',
        desc: modeName.shake,
      },
      off: {
        mainImg: imageDomain + '/0xFB/shake-off.png',
        desc: modeName.shake,
      },
      disabled: {
        mainImg: imageDomain + '/0xFB/shake-off.png',
        desc: modeName.shake,
      },
    },
    humidityModeDataList: {
      onWarm: {
        mainImg: imageDomain + '/0xFB/humidity-mode-on-warm.png',
        desc: modeName.humidityMode,
      },
      onCold: {
        mainImg: imageDomain + '/0xFB/humidity-mode-on-cold.png',
        desc: modeName.humidityMode,
      },
      off: {
        mainImg: imageDomain + '/0xFB/humidity-mode-off.png',
        desc: modeName.humidityMode,
      },
      disabled: {
        mainImg: imageDomain + '/0xFB/humidity-mode-off.png',
        desc: modeName.humidityMode,
      },
    },
    ecoDataList: {
      on: {
        mainImg: imageDomain + '/0xFB/eco-on.png',
        desc: modeName.eco,
      },
      off: {
        mainImg: imageDomain + '/0xFB/eco-off.png',
        desc: modeName.eco,
      },
      disabled: {
        mainImg: imageDomain + '/0xFB/eco-off.png',
        desc: modeName.eco,
      },
    },
    timerDataList: {
      onWarm: {
        mainImg: imageDomain + '/0xFB/timer-on-warm.png',
        desc: modeName.timer,
      },
      onCold: {
        mainImg: imageDomain + '/0xFB/timer-on-cold.png',
        desc: modeName.timer,
      },
      off: {
        mainImg: imageDomain + '/0xFB/timer-off.png',
        desc: modeName.timer,
      },
      disabled: {
        mainImg: imageDomain + '/0xFB/timer-off.png',
        desc: modeName.timer,
      },
    },
    tempRange: {
      minTemp: 5,
      maxTemp: 35,
      minTempDesc: '5°C',
      maxTempDesc: '35°C',
    },
    styles: {
      tempBtnColor: '#FFCD00',
    },
    currentModeName: '',
    currentPickerType: '',
    currentGear: '--',
    changingTemp: -1, // 长按加减时的临时温度，非真实温度
    changingTempInterval: -1,
    // 选择器
    multiArray: [[''], [''], ['']],
    multiIndex: [0, 0, 0],
    headerImg: imageDomain + '/0xFB/heater.png',
    // endregion
  },
  methods: {
    // region 2021.08.10 Ao
    noop() {},
    // region 跳转到美居下载页
    goToDownLoad() {
      wx.navigateTo({
        url: '/pages/download/download',
      })
    },
    // endregion
    // region 获取产品配置
    getProductConfig() {
      return new Promise((resolve, reject) => {
        let data = this.data
        let deviceInfo = data.deviceInfo
        deviceInfo.modelNumber = Number(deviceInfo.modelNumber)
        let productModelNumber =
          deviceInfo.modelNumber != 0
            ? deviceInfo.modelNumber >= 10
              ? '000000' + deviceInfo.modelNumber
              : '0000000' + deviceInfo.modelNumber
            : deviceInfo.sn8

        if (deviceInfo.onlineStatus == Dict.onlineStatus.online) {
          deviceInfo.isOnline = true
        } else {
          deviceInfo.isOnline = false
          MideaToast('设备已离线，请检查网络状态')
        }
        let method = 'GET'
        let sendParams = {
          applianceId: deviceInfo.applianceCode,
          productTypeCode: deviceInfo.type,
          userId: data.uid,
          productModelNumber: productModelNumber,
          bigVer: requestParam.bigVer,
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
          .then((res) => {
            console.log('获取产品配置')
            console.log(deviceInfo)
            console.log(res)
            // 设置页面功能
            let resData = null
            resData = JSON.parse(res.data.result.returnData)
            // resData = res.data;
            console.log(res)
            console.log(resData)
            let controllerInfo = data.controllerInfo
            let deviceLabel = data.deviceLabel
            let childLockSwitch = data.childLockSwitch
            let temperatureSlider = data.temperatureSlider
            let timedShutdownPickerColumns = data.timedShutdownPickerColumns
            let quickDevJson = data.quickDevJson
            let coolOrWarm = 0
            do {
              if (res.data.errorCode == 50300 || res.code == 1001) {
                wx.redirectTo({
                  url:
                    `/pages/unSupportDevice/unSupportDevice?backTo=/pages/index/index&deviceInfo=` +
                    encodeURIComponent(JSON.stringify(this.properties.applianceData)),
                })
                break
              }
              if (res.data.errorCode != 0) {
                UI.toast('系统提示: ' + res.errMsg)
                break
              }
              quickDevJson = quickDev.quickDevJson2Local(resData)
              console.log('quickDevJson: ', quickDevJson)
              if (quickDevJson.para.length > 0) {
                quickDevJson.para.forEach((item) => {
                  switch (item.key) {
                    case Dict.functions.key.power:
                      // 开关
                      controllerInfo.switchBtn.isShow = true
                      break
                    case Dict.functions.key.mode:
                      // 模式
                      controllerInfo.modeBtn = {
                        isShow: isDebug,
                        value: 'normal',
                        iconUrl: imageDomain + '/0xFB/icon_zhire.png',
                      }
                      // 获取模式字典
                      if (item.bindList && item.bindList.length > 0) {
                        // 使用bindList参数
                      } else {
                        // 使用valueList和displayList参数
                        let displayList = item.displayList
                        let valueList = item.valueList
                        deviceLabel.mode = []
                        if (valueList.length === 1) {
                          controllerInfo.modeBtn = undefined
                        }
                        // 如果支持冷暖风则需要通过冷暖风分组
                        if (quickDevJson.isSupportCoolWarmWind) {
                          controllerInfo.coolWarm = [
                            { label: '冷风', modeList: [], isActive: false },
                            { label: '暖风', modeList: [], isActive: false },
                          ]

                          for (let i = 0; i < valueList.length; i++) {
                            coolOrWarm = valueList[i].includes('cool') ? 0 : 1
                            controllerInfo.coolWarm[coolOrWarm].modeList.push({
                              value: valueList[i],
                              label: displayList[i],
                              parseValue: parseDeviceConfig({
                                type: 'mode',
                                value: valueList[i],
                                sn8: this.properties.applianceData.sn8,
                              }),
                              iconUrl1: DeviceFunctionConfig.getModeIcon({
                                mode: valueList[i],
                                active: false,
                                sn8: this.properties.applianceData.sn8,
                              }),
                              iconUrl2: DeviceFunctionConfig.getModeIcon({
                                mode: valueList[i],
                                active: true,
                                sn8: this.properties.applianceData.sn8,
                              }),
                            })
                          }
                        }

                        valueList.forEach((valueItem, index) => {
                          deviceLabel.mode.push({
                            value: valueItem,
                            label: displayList[index],
                            parseValue: parseDeviceConfig({
                              type: 'mode',
                              value: valueItem,
                              sn8: this.properties.applianceData.sn8,
                            }),
                            iconUrl1: DeviceFunctionConfig.getModeIcon({
                              mode: valueItem,
                              active: false,
                              sn8: this.properties.applianceData.sn8,
                            }),
                            iconUrl2: DeviceFunctionConfig.getModeIcon({
                              mode: valueItem,
                              active: true,
                              sn8: this.properties.applianceData.sn8,
                            }),
                          })
                        })
                      }
                      break
                    case Dict.functions.key.timeout:
                      // 定时
                      controllerInfo.timedShutdownBtn = {
                        isShow: isDebug,
                        value: {
                          hour: 0,
                          minute: 0,
                          second: 0,
                        },
                        label: undefined,
                        iconUrl: imageDomain + '/0xFB/icon-clock.png',
                      }
                      if (item.bindList && item.bindList.length > 0) {
                        // 使用bindList参数
                      } else {
                        // 使用valueList和displayList参数
                        let valueList = item.valueList
                        deviceLabel.timing[0] = []
                        valueList.forEach((valueItem, index) => {
                          if (valueItem !== 0) {
                            deviceLabel.timing[0].push(valueItem)
                          }
                        })
                      }
                      break
                    case Dict.functions.key.temperature:
                      // 设置温度
                      temperatureSlider = parseComponentModel(data.temperatureSlider)
                      controllerInfo.temperatureSlider = {
                        isShow: item.valueList != null,
                        value: '',
                        iconUrl: imageDomain + '/0xFB/icon-temperature.png',
                      }
                      if (item.bindList && item.bindList.length > 0) {
                        // 使用bindList参数
                        item.bindList.forEach((bindItem) => {
                          if (bindItem.valueList && bindItem.valueList.length > 0) {
                            deviceLabel.temp[bindItem.bindMode] = {
                              min: bindItem.valueList[0],
                              max: bindItem.valueList[bindItem.valueList.length - 1],
                            }
                          }
                        })
                      } else {
                        // 使用valueList和displayList参数
                        let valueList = item.valueList
                        if (valueList && valueList.length > 0) {
                          productConfig.temp = {
                            min: valueList[0],
                            max: valueList[valueList.length - 1],
                          }
                          temperatureSlider.min = valueList[0]
                          temperatureSlider.max = valueList[valueList.length - 1]
                        }
                      }
                      temperatureSlider = parseComponentModel(temperatureSlider)
                      break
                    case Dict.functions.key.gear:
                      // 档位
                      controllerInfo.gearButtons = {
                        isShow: isDebug,
                        value: undefined,
                        label: '--',
                        iconUrl: imageDomain + '/0xFB/icon-wind.png',
                      }
                      if (item.bindList && item.bindList.length > 0) {
                        // 使用bindList参数
                        item.bindList.forEach((bindItem) => {
                          if (bindItem.valueList && bindItem.valueList.length > 0) {
                            deviceLabel.gear[bindItem.bindMode] = []
                            bindItem.valueList.forEach((valueItem, index) => {
                              deviceLabel.gear[bindItem.bindMode].push({
                                value: valueItem,
                                label: bindItem.displayList[index],
                              })
                            })
                          }
                        })
                      } else {
                        // 使用valueList和displayList参数
                        let valueList = item.valueList
                        if (valueList && valueList.length > 0) {
                          productConfig.gear = []
                          valueList.forEach((valueItem, index) => {
                            productConfig.gear.push({
                              value: valueItem,
                              label: item.displayList[index],
                            })
                          })
                        }
                      }
                      break
                    case Dict.functions.key.childLock:
                      // 童锁
                      childLockSwitch = parseComponentModel(data.childLockSwitch)
                      controllerInfo.childLock = {
                        isShow: item.valueList != null,
                        value: undefined,
                        iconUrl: imageDomain + '/0xFB/icon-lock.png',
                      }
                      childLockSwitch = parseComponentModel(childLockSwitch)
                      break
                    case Dict.functions.key.humidify:
                      // 加湿
                      controllerInfo.humidify = {
                        isShow: isDebug,
                        value: undefined,
                        label: '--',
                        iconUrl: imageDomain + '/0xFC/icon-humidify.png',
                      }
                      break
                    case Dict.functions.key.disinfect:
                      // 杀菌
                      controllerInfo.disinfect = {
                        isShow: isDebug,
                        value: undefined,
                        label: '--',
                        iconUrl: imageDomain + '/0xFB/icon_disinfect.png',
                      }
                      let disinfectList = []
                      item.valueList.forEach((t, index) => {
                        disinfectList.push({
                          label: item.displayList[index],
                          value: t,
                        })
                      })
                      deviceLabel.disinfectList = disinfectList
                      break
                    case Dict.functions.key.sound:
                      // 声音
                      controllerInfo.sound = {
                        isShow: isDebug,
                        value: undefined,
                        label: '--',
                        iconUrl: imageDomain + '/0xFC/icon-voiceOnOff.png',
                      }
                      break
                    case Dict.functions.key.shake:
                      // 左右摇头
                      controllerInfo.shake = {
                        isShow: isDebug,
                        value: undefined,
                        label: '--',
                        iconUrl: imageDomain + '/0xFA/kit-swing.png',
                      }
                      break
                    case Dict.functions.key.udShake:
                      // 上下摇头
                      controllerInfo.udShake = {
                        isShow: isDebug,
                        value: undefined,
                        label: '--',
                        iconUrl: imageDomain + '/0xFB/icon_udSwing.png',
                      }
                      break
                    case Dict.functions.key.screenDisplay:
                      // 屏幕显示
                      controllerInfo.screenDisplay = {
                        isShow: isDebug,
                        value: undefined,
                        label: '--',
                        iconUrl: imageDomain + '/0xFB/icon_display.png',
                      }
                      break
                    case Dict.functions.key.fireLight:
                      // 氛围灯
                      controllerInfo.fireLight = {
                        isShow: isDebug,
                        value: undefined,
                        label: '--',
                        iconUrl: imageDomain + '/0xFA/kit-display-on-off.png',
                      }
                      if (item.valueList && item.valueList.length > 0) {
                        let fireLightList = []
                        item.valueList.forEach((t, index) => {
                          fireLightList.push({
                            label: item.displayList[index],
                            value: t,
                          })
                        })
                        deviceLabel.fireLightList = fireLightList
                      }

                      break
                    case Dict.functions.key.coldAndWarm:
                      // 冷暖
                      controllerInfo.coldAndWarm = {
                        isShow: isDebug,
                        value: undefined,
                        label: '--',
                        iconUrl: imageDomain + '/0xFB/icon-wind.png',
                      }
                      if (item.bindList && item.bindList.length > 0) {
                        let coldAndWarmCtrlList = [],
                          bindMode = '',
                          tempList = []
                        item.bindList.forEach((item) => {
                          if (bindMode !== item.bindMode) {
                            if (tempList.length) {
                              const temp = {
                                bindMode,
                                bindList: JSON.parse(JSON.stringify(tempList)),
                              }
                              coldAndWarmCtrlList.push(temp)
                            }
                            bindMode = item.bindMode
                            tempList = []
                          }
                          tempList.push({
                            label: item.displayList[0],
                            mode: item.valueList[0],
                            gear: item.valueList[1],
                          })
                        })
                        coldAndWarmCtrlList.push({
                          bindMode,
                          bindList: JSON.parse(JSON.stringify(tempList)),
                        })
                        deviceLabel.coldAndWarmCtrlList = coldAndWarmCtrlList
                      }
                      break
                    default:
                      break
                  }
                })
                break
              }
              UI.toast('该家电无功能数据')
            } while (false)
            console.log('controllerInfo:', controllerInfo)
            console.log('deviceLabel:', deviceLabel)
            this.setData({
              controllerInfo,
              deviceLabel,
              childLockSwitch,
              timedShutdownPickerColumns,
              temperatureSlider,
              quickDevJson,
            })
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
                if (res.data.errorCode == 50300 || res.code == 1001) {
                  wx.redirectTo({
                    url:
                      `/pages/unSupportDevice/unSupportDevice?backTo=/pages/index/index&deviceInfo=` +
                      encodeURIComponent(JSON.stringify(this.properties.applianceData)),
                  })
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
            reject()
          })
      })
    },
    // endregion
    // region 数据初始化,根据数据渲染页面元素
    dataInit(newDeviceStatus) {
      let currentProtocolVersion = newDeviceStatus?.version
      let data = this.data
      let deviceInfo = data.deviceInfo
      let controllerInfo = data.controllerInfo
      let functionIsDisabled = data.functionIsDisabled
      let deviceStatus = data.newDeviceStatus
      let modeHasNoGear = data.modeHasNoGear
      let mainTitle = data.mainTitle
      let currentCoolOrWarmIndex = data.currentCoolOrWarmIndex
      let childLockSwitch = parseComponentModel(data.childLockSwitch)
      let soundSwitch = parseComponentModel(data.soundSwitch)
      let screenDisplaySwitch = parseComponentModel(data.screenDisplaySwitch)
      let fireLightSwitch = parseComponentModel(data.fireLightSwitch)
      let humidifySwitch = parseComponentModel(data.humidifySwitch)
      let shakeSwitch = parseComponentModel(data.shakeSwitch)
      let udShakeSwitch = parseComponentModel(data.udShakeSwitch)
      if (deviceInfo.onlineStatus == Dict.onlineStatus.online) {
        deviceInfo.isOnline = true
        controllerInfo.switchBtn.disabled = false
        childLockSwitch.disabled = false
      } else {
        deviceInfo.isOnline = false
        controllerInfo.switchBtn.disabled = true
        childLockSwitch.disabled = true
      }
      deviceStatus = newDeviceStatus
      let themeColor = 'theme-color'
      let switchBtn = parseComponentModel(data.switchBtn)
      let timedShutdownBtn = parseComponentModel(data.timedShutdownBtn)
      let modeBtn = parseComponentModel(data.modeBtn)
      let temperatureSlider = parseComponentModel(data.temperatureSlider)
      let gearSlider = parseComponentModel(data.gearSlider)
      let deviceLabel = data.deviceLabel
      if (newDeviceStatus) {
        // 设备开关
        if (controllerInfo.timedShutdownBtn) {
          let hour = 0
          let minute = 0
          if (newDeviceStatus.power === DeviceFunctionConfig.power.on) {
            controllerInfo.timedShutdownBtn.value.hour = newDeviceStatus.timer_off_hour
            controllerInfo.timedShutdownBtn.value.minute = newDeviceStatus.timer_off_minute
            deviceInfo.isRunning = true
            // 定时关
            hour = parseDeviceConfig({
              type: 'timer',
              value: newDeviceStatus.timer_off_hour,
            })
            minute = parseDeviceConfig({
              type: 'timer',
              value: newDeviceStatus.timer_off_minute,
            })
          } else {
            controllerInfo.timedShutdownBtn.value.hour = newDeviceStatus.timer_on_hour
            controllerInfo.timedShutdownBtn.value.minute = newDeviceStatus.timer_on_minute
            deviceInfo.isRunning = false
            // 定时开
            hour = parseDeviceConfig({
              type: 'timer',
              value: newDeviceStatus.timer_on_hour,
            })
            minute = parseDeviceConfig({
              type: 'timer',
              value: newDeviceStatus.timer_on_minute,
            })
          }
          do {
            if (controllerInfo.timedShutdownBtn.value.hour === 0) {
              if (controllerInfo.timedShutdownBtn.value.minute === 0) {
                controllerInfo.timedShutdownBtn.label = undefined
                clearInterval(deviceShutdownTimer)
                break
              }
            }
            // 设置定时
            controllerInfo.timedShutdownBtn.label = hour + ':' + minute
          } while (false)
        }
        // 设备温度
        deviceInfo.curTemperature = newDeviceStatus.cur_temperature > 35 ? 35 : newDeviceStatus.cur_temperature
        deviceInfo.temperature = newDeviceStatus.temperature
        temperatureSlider.currentValue = newDeviceStatus.temperature
        if (deviceLabel.temp[newDeviceStatus.mode]) {
          controllerInfo.temperatureSlider = {
            isShow: true,
            value: '',
            iconUrl: imageDomain + '/0xFB/icon-temperature.png',
          }
          let deviceModeTempMin = deviceLabel.temp[newDeviceStatus.mode].min
          let deviceModeTempMax = deviceLabel.temp[newDeviceStatus.mode].max
          temperatureSlider.min = deviceModeTempMin
          temperatureSlider.max = deviceModeTempMax
        } else if (productConfig.temp) {
          controllerInfo.temperatureSlider = {
            isShow: true,
            value: '',
            iconUrl: imageDomain + '/0xFB/icon-temperature.png',
          }
          temperatureSlider.min = productConfig.temp.min
          temperatureSlider.max = productConfig.temp.max
        } else {
          controllerInfo.temperatureSlider = undefined
        }
        switch (deviceInfo.temperature) {
          case 128:
          case -41:
          case 87:
            // 设置温度无效
            deviceInfo.isInvalid = true
            controllerInfo.temperatureSlider = undefined
            break
        }
        switch (deviceInfo.curTemperature) {
          case 128:
          case -41:
          case 87:
            // 设置温度无效
            deviceInfo.isInvalid = true
            deviceInfo.curTemperature = undefined
            break
        }
        // 设备模式
        let newMode = (deviceInfo.modeValue = parseDeviceConfig({
          type: 'mode',
          value: newDeviceStatus.mode,
          sn8: this.properties.applianceData.sn8,
        }))
        if (controllerInfo.coolWarm && controllerInfo.coolWarm.length) {
          for (let i = 0; i < controllerInfo.coolWarm.length; i++) {
            const item = controllerInfo.coolWarm[i]
            item.isActive = false
            for (let j = 0; j < item.modeList.length; j++) {
              const element = item.modeList[j]
              if (element.value === deviceInfo.modeValue) {
                currentCoolOrWarmIndex = i
                item.isActive = true
              }
            }
          }
        }
        if (deviceInfo.modeValue.includes(DeviceFunctionConfig.mode.circulate)) {
          // 循环模式无档位
          modeHasNoGear = true
          mainTitle = '循环中'
        } else {
          modeHasNoGear = false
          mainTitle = ''
        }
        deviceLabel.mode.forEach((item) => {
          if (item.value === newMode) {
            modeBtn.rightWrapper.text.content = deviceInfo.mode = item.label + '模式'
            if (controllerInfo.modeBtn) {
              controllerInfo.modeBtn.value = item.value
              controllerInfo.modeBtn.iconUrl = DeviceFunctionConfig.getModeIcon({
                mode: item.value,
                active: false,
                sn8: this.properties.applianceData.sn8,
              })
            }
          }
        })
        // 设备档位
        if (controllerInfo.gearButtons) {
          controllerInfo.gearButtons.value = newDeviceStatus.gear
        }
        let gearList = deviceLabel.gear[newMode]
        let gearSlideInit = (gearList) => {
          if (gearList.length > 4) {
            controllerInfo.gearSlider = {
              isShow: true,
            }
            // gearList一般从0开始
            if (gearList.length % 2) {
              // 单数档
              gearSlider.interval = Math.floor((gearList.length - 1) / 4)
            } else {
              // 双数档
              gearSlider.interval = Math.floor((gearList.length - 1) / 3)
            }
            gearSlider.min = gearList[0].value
            if (gearList[0].value == 0) {
              gearSlider.min = gearList[1].value
            }
            gearSlider.max = gearList[gearList.length - 1].value
            gearSlider.currentValue = newDeviceStatus.gear
          } else {
            controllerInfo.gearSlider = undefined
          }
        }
        if (gearList && gearList.length > 0) {
          if (controllerInfo.gearButtons) {
            controllerInfo.gearButtons.isShow = true
          }
          gearSlideInit(gearList)
          gearList.forEach((gearItem) => {
            if (gearItem.value === newDeviceStatus.gear) {
              controllerInfo.gearButtons.label = gearItem.label
            }
          })
        } else if (productConfig.gear) {
          if (controllerInfo.gearButtons) {
            controllerInfo.gearButtons.isShow = true
          }
          deviceLabel.gear[newMode] = productConfig.gear
          gearSlideInit(productConfig.gear)
          deviceLabel.gear[newMode].forEach((gearItem) => {
            if (gearItem.value === newDeviceStatus.gear) {
              controllerInfo.gearButtons.label = gearItem.label
            }
          })
        } else {
          // 没有档位
          if (controllerInfo.gearButtons) {
            controllerInfo.gearButtons.isShow = false
          }
        }
        // 设备童锁
        if (controllerInfo.childLock) {
          if (deviceInfo.isRunning) {
            childLockSwitch.isActive = true
          } else {
            childLockSwitch.isActive = false
          }
          if (newDeviceStatus.lock === DeviceFunctionConfig.lock.on) {
            // 童锁开启
            controllerInfo.childLock.value = true
            childLockSwitch.selected = true
          } else {
            // 童锁关闭
            childLockSwitch.selected = false
            controllerInfo.childLock.value = false
          }
        }
        for (let key in controllerInfo) {
          if (controllerInfo[key] && key !== 'noticeBar' && key !== 'childLock') {
            controllerInfo[key].isShow = !childLockSwitch.selected
            if (key === 'switchBtn') {
              controllerInfo[key].isShow = true
              if (!deviceInfo.isRunning) {
                controllerInfo[key].disabled = true
                if (!childLockSwitch.selected) {
                  controllerInfo[key].disabled = false
                }
              }
            }
          }
        }
        // 冷暖风
        if (controllerInfo.coldAndWarm) {
          for (let i = 0; i < deviceLabel.coldAndWarmCtrlList.length; i++) {
            if (deviceLabel.coldAndWarmCtrlList[i].bindMode.includes(newDeviceStatus.mode)) {
              deviceLabel.coldAndWarm = deviceLabel.coldAndWarmCtrlList[i].bindList
              controllerInfo.coldAndWarm.mode = newDeviceStatus.mode
              controllerInfo.coldAndWarm.gear = newDeviceStatus.gear
              break
            }
          }
          for (let i = 0; i < deviceLabel.coldAndWarm.length; i++) {
            // 显示档位
            if (
              deviceLabel.coldAndWarm[i].mode == newDeviceStatus.mode &&
              (!controllerInfo.coldAndWarm.gear || deviceLabel.coldAndWarm[i].gear == newDeviceStatus.gear)
            ) {
              controllerInfo.gearButtons = {}
              controllerInfo.gearButtons.label = deviceLabel.coldAndWarm[i].label
              break
            }
          }
        }
        if (
          newDeviceStatus.mode.includes('cold') ||
          newDeviceStatus.mode.includes('cool') ||
          newDeviceStatus.mode === 'idle_mode'
        ) {
          // 判断冷暖主题色
          deviceLabel.mainBg3 = data.controllerInfo.switchBtn.url3
          themeColor = 'theme-color_cold'
          soundSwitch.activeType = 'active_cold'
          screenDisplaySwitch.activeType = 'active_cold'
          fireLightSwitch.activeType = 'active_cold'
          shakeSwitch.activeType = 'active_cold'
          udShakeSwitch.activeType = 'active_cold'
          humidifySwitch.activeType = 'active_cold'
          childLockSwitch.activeType = 'active_cold'
          gearSlider.isActiveCold = true
        } else {
          deviceLabel.mainBg3 = data.controllerInfo.switchBtn.bgUrl3
          themeColor = 'theme-color'
          soundSwitch.activeType = 'active'
          screenDisplaySwitch.activeType = 'active'
          fireLightSwitch.activeType = 'active'
          shakeSwitch.activeType = 'active'
          udShakeSwitch.activeType = 'active'
          humidifySwitch.activeType = 'active'
          childLockSwitch.activeType = 'active'
          gearSlider.isActiveCold = false
        }
        // 杀菌
        if (controllerInfo.disinfect) {
          controllerInfo.disinfect.value = newDeviceStatus.disinfect
          controllerInfo.disinfect.disinfect_interval_time = newDeviceStatus.disinfect_interval_time
        }
        // 声音
        if (controllerInfo.sound) {
          if (deviceInfo.isRunning) {
            soundSwitch.isActive = true
          } else {
            soundSwitch.isActive = false
          }
          if (newDeviceStatus.voice === DeviceFunctionConfig.voice.openBuzzer) {
            // 开启
            controllerInfo.sound.value = true
            soundSwitch.selected = true
          } else {
            // 关闭
            soundSwitch.selected = false
            controllerInfo.sound.value = false
          }

          if (newDeviceStatus.mode.includes('sleep')) {
            //  置灰
            functionIsDisabled.sound = true
            // 禁用
            soundSwitch.disabled = true
          } else {
            //  置灰
            functionIsDisabled.sound = false
            // 禁用
            soundSwitch.disabled = false
          }
        }
        // 屏幕显示
        if (controllerInfo.screenDisplay) {
          if (deviceInfo.isRunning) {
            screenDisplaySwitch.isActive = true
          } else {
            screenDisplaySwitch.isActive = false
          }
          if (newDeviceStatus.screen_close === DeviceFunctionConfig.screenClose.off) {
            // 开启
            controllerInfo.screenDisplay.value = true
            screenDisplaySwitch.selected = true
          } else {
            // 关闭
            screenDisplaySwitch.selected = false
            controllerInfo.screenDisplay.value = false
          }
        }
        // 加湿
        if (controllerInfo.humidify) {
          if (deviceInfo.isRunning) {
            humidifySwitch.isActive = true
          } else {
            humidifySwitch.isActive = false
          }
          if (newDeviceStatus.humidification === DeviceFunctionConfig.humidification.noChange) {
            // 开启
            controllerInfo.humidify.value = true
            humidifySwitch.selected = true
          } else {
            // 关闭
            humidifySwitch.selected = false
            controllerInfo.humidify.value = false
          }
        }
        // 氛围灯
        if (controllerInfo.fireLight) {
          if (deviceInfo.isRunning) {
            fireLightSwitch.isActive = true
          } else {
            fireLightSwitch.isActive = false
          }
          if (deviceLabel.fireLightList.length) {
            // 按钮
            deviceLabel.fireLightList.forEach((item) => {
              if (newDeviceStatus.fireLight === item.value) {
                controllerInfo.fireLight.value = newDeviceStatus.fireLight
              }
            })
          } else {
            // switch
            if (newDeviceStatus.fireLight === DeviceFunctionConfig.fireLight.on) {
              // 开启
              controllerInfo.fireLight.value = true
              fireLightSwitch.selected = true
            } else {
              // 关闭
              fireLightSwitch.selected = false
              controllerInfo.fireLight.value = false
            }
          }
        }
        // 摇头/左右摇头
        if (controllerInfo.shake) {
          if (deviceInfo.isRunning) {
            shakeSwitch.isActive = true
          } else {
            shakeSwitch.isActive = false
          }
          let isShakeSwitchActive = false
          // 判断当前协议
          if (currentProtocolVersion < 38) {
            isShakeSwitchActive = newDeviceStatus.shake_switch === DeviceFunctionConfig.shakeSwitch.on
          } else {
            isShakeSwitchActive = newDeviceStatus.lr_shake_switch !== DeviceFunctionConfig.shakeSwitch.off
          }
          if (isShakeSwitchActive) {
            // 开启
            controllerInfo.shake.value = true
            shakeSwitch.selected = true
          } else {
            // 关闭
            shakeSwitch.selected = false
            controllerInfo.shake.value = false
          }
        }
        // 上下摇头
        if (controllerInfo.udShake) {
          if (deviceInfo.isRunning) {
            udShakeSwitch.isActive = true
          } else {
            udShakeSwitch.isActive = false
          }
          if (newDeviceStatus.ud_shake_switch !== DeviceFunctionConfig.shakeSwitch.off) {
            // 开启
            controllerInfo.udShake.value = true
            udShakeSwitch.selected = true
          } else {
            // 关闭
            udShakeSwitch.selected = false
            controllerInfo.udShake.value = false
          }
        }
      }
      if (deviceInfo.isOnline) {
        switchBtn.disabled = false
        timedShutdownBtn.disabled = false
        if (deviceInfo.isRunning) {
          modeBtn.disabled = false
        } else {
          modeBtn.disabled = true
        }
      } else {
        switchBtn.disabled = true
        timedShutdownBtn.disabled = true
        modeBtn.disabled = true
      }
      switchBtn = parseComponentModel(switchBtn)
      modeBtn = parseComponentModel(modeBtn)
      timedShutdownBtn = parseComponentModel(timedShutdownBtn)
      temperatureSlider = parseComponentModel(temperatureSlider)
      childLockSwitch = parseComponentModel(childLockSwitch)
      soundSwitch = parseComponentModel(soundSwitch)
      screenDisplaySwitch = parseComponentModel(screenDisplaySwitch)
      fireLightSwitch = parseComponentModel(fireLightSwitch)
      shakeSwitch = parseComponentModel(shakeSwitch)
      humidifySwitch = parseComponentModel(humidifySwitch)
      udShakeSwitch = parseComponentModel(udShakeSwitch)
      gearSlider = parseComponentModel(gearSlider)
      console.log('deviceInfo')
      console.log(deviceInfo)
      this.setData({
        controllerInfo,
        deviceInfo,
        modeBtn,
        switchBtn,
        timedShutdownBtn,
        temperatureSlider,
        childLockSwitch,
        deviceLabel,
        gearSlider,
        themeColor,
        soundSwitch,
        screenDisplaySwitch,
        fireLightSwitch,
        shakeSwitch,
        udShakeSwitch,
        humidifySwitch,
        functionIsDisabled,
        currentProtocolVersion,
        deviceStatus,
        modeHasNoGear,
        mainTitle,
        currentCoolOrWarmIndex,
      })
    },
    // endregion
    // region 开关机
    switchDevice() {
      let data = this.data
      let deviceInfo = data.deviceInfo
      let childLockSwitch = parseComponentModel(data.childLockSwitch)
      let switchBtn = data.controllerInfo.switchBtn
      do {
        if (!deviceInfo.isOnline) {
          MideaToast('设备已离线，请检查网络状态')
          break
        }
        if (switchBtn) {
          if (switchBtn.disabled) {
            if (childLockSwitch.selected) {
              MideaToast('童锁已开启，功能不能点击')
            }
            break
          }
        }
        if (isLoading) {
          break
        }
        isLoading = true
        let modeBtn = parseComponentModel(data.modeBtn)
        let controllerInfo = data.controllerInfo
        if (deviceInfo.isRunning) {
          // 关机
          deviceInfo.isRunning = false
          controllerInfo.switchBtn.value = false
          modeBtn.disabled = true
        } else {
          // 开机
          deviceInfo.isRunning = true
          controllerInfo.switchBtn.value = true
          modeBtn.disabled = false
        }
        // 设置请求
        UI.showLoading()
        this.clearDeviceStatusInterval()
        this.requestControl({
          control: {
            power: controllerInfo.switchBtn.value ? 'on' : 'off',
          },
        })
          .then((res) => {
            isLoading = false
            UI.hideLoading()
            if (controllerInfo.switchBtn.value) {
              MideaToast('设备已开机')
            } else {
              MideaToast('设备已关机')
            }
            // 修改页面数据
            modeBtn = parseComponentModel(modeBtn)
            childLockSwitch = parseComponentModel(childLockSwitch)
            this.setData({
              deviceInfo,
              controllerInfo,
              modeBtn,
              childLockSwitch,
            })
            this.dataInit(res.data.data.status)
            this.deviceStatusInterval()
          })
          .catch((err) => {
            isLoading = false
            UI.hideLoading()
            this.deviceStatusInterval()
          })
        // 数据埋点
      } while (false)
    },
    // endregion
    // region 定时开关机事件
    // region 确认设置开关时间
    confirmOrderTime() {
      do {
        UI.showLoading()
        setTimeout(() => {
          let data = this.data
          let deviceInfo = data.deviceInfo
          let deviceLabel = data.deviceLabel
          let timedShutdownPickerColumns = this.data.timedShutdownPickerColumns
          let pickerValue = timedShutdownPickerColumns.selectedValue
          if (pickerValue === undefined) {
            pickerValue = [0]
          }
          let selectValue = deviceLabel.timing[0][pickerValue[0]]
          let controlParam = {
            timer_off_minute: 0,
          }
          let type = undefined
          if (deviceInfo.isRunning) {
            // 预约关机
            type = 'timer_off_hour'
          } else {
            // 预约开机
            type = 'timer_on_hour'
          }
          controlParam[type] = selectValue
          // 设置定时
          this.clearDeviceStatusInterval()
          this.requestControl({
            control: controlParam,
          })
            .then((res) => {
              UI.hideLoading()
              console.log('res:', res)
              this.dataInit(res.data.data.status)
              this.deviceStatusInterval()
              this.closeTimedShutdownModal()
            })
            .catch((err) => {
              console.error('设置定时错误')
              console.error(err)
              UI.hideLoading()
              this.deviceStatusInterval()
              this.closeTimedShutdownModal()
            })
        }, 500)
      } while (false)
    },
    // region 删除定时
    deleteTimedShutdown() {
      let data = this.data
      let deviceInfo = data.deviceInfo
      let type = undefined
      if (deviceInfo.isRunning) {
        // 删除定时关机
        type = 'timer_off_minute'
      } else {
        // 删除定时开机
        type = 'timer_on_minute'
      }
      let controlParam = {}
      controlParam[type] = 'clean'
      UI.showLoading()
      this.clearDeviceStatusInterval()
      this.requestControl({
        control: controlParam,
      })
        .then((res) => {
          UI.hideLoading()
          this.closeTimedShutdownModal()
          this.dataInit(res.data.data.status)
          this.deviceStatusInterval()
        })
        .catch((err) => {
          UI.hideLoading()
          console.error('删除定时错误')
          console.error(err)
          this.deviceStatusInterval()
        })
    },
    // endregion
    // region 定时倒计时
    timedShutdownCount() {
      clearInterval(deviceShutdownTimer)
      let controllerInfo = this.data.controllerInfo
      let timedShutdownBtn = controllerInfo.timedShutdownBtn
      let hour = timedShutdownBtn.value.hour
      let minute = timedShutdownBtn.value.minute
      let second = 0
      let countDown = () => {
        do {
          if (second !== 0) {
            second--
            break
          }
          if (minute !== 0) {
            second = 59
            minute--
            break
          }
          if (hour !== 0) {
            second = 59
            minute = 59
            hour--
            break
          }
          // 定时结束
        } while (false)
        timedShutdownBtn.value = {
          hour: hour,
          minute: minute,
          second: second,
        }
        let label = {
          hour: parseDeviceConfig({
            type: 'timer',
            value: hour,
          }),
          minute: parseDeviceConfig({
            type: 'timer',
            value: minute,
          }),
          second: parseDeviceConfig({
            type: 'timer',
            value: second,
          }),
        }
        controllerInfo.timedShutdownBtn.label = label.hour + ':' + label.minute + ':' + label.second
        this.setData({ controllerInfo })
      }
      countDown()
      deviceShutdownTimer = setInterval(() => {
        countDown()
      }, 1000)
    },
    // endregion
    // endregion
    pickOnChange(e) {
      do {
        let data = this.data
        let deviceInfo = data.deviceInfo
        let timedShutdownPickerColumns = this.data.timedShutdownPickerColumns
        if (!deviceInfo.isOnline) {
          break
        }
        let val = e.detail.value
        timedShutdownPickerColumns.selectedValue = val
        console.log(timedShutdownPickerColumns)
        this.setData({
          timedShutdownPickerColumns: timedShutdownPickerColumns,
        })
      } while (false)
    },
    timedShutdownPickerDataInit() {
      let hours = []
      let minutes = []
      for (let i = 0; i < 60; i++) {
        if (i < 25) {
          hours.push(i)
        }
        if (i !== 0) {
          minutes.push(i)
        }
      }
      let pickerColumns = this.data.timedShutdownPickerColumns
      pickerColumns.hours = hours
      pickerColumns.minutes = minutes
      this.setData({
        timedShutdownPickerColumns: pickerColumns,
      })
    },
    showTimedShutdownModal() {
      do {
        let data = this.data
        let deviceInfo = data.deviceInfo
        if (!deviceInfo.isOnline) {
          MideaToast('设备已离线，请检查网络状态')
          break
        }
        this.setData({
          isShowTimedShutdown: true,
        })
      } while (false)
    },
    closeTimedShutdownModal() {
      this.setData({
        isShowTimedShutdown: false,
      })
    },
    // endregion
    // region 模式事件
    // 设置模式
    selectMode(event) {
      do {
        if (isLoading) {
          break
        }
        isLoading = true
        let originValue = event.currentTarget.dataset.value
        let value = parseDeviceConfig({
          type: 'mode',
          value: originValue,
          sn8: this.properties.applianceData.sn8,
        })
        let controllerInfo = this.data.controllerInfo
        controllerInfo.modeBtn.value = originValue
        // 发送切换模式请求
        UI.showLoading()
        this.clearDeviceStatusInterval()
        let controlParam = {
          mode: value,
        }
        if (controllerInfo.gearButtons && controllerInfo.gearButtons.value >= 0) {
          controlParam['gear'] = controllerInfo.gearButtons.value
          if (controllerInfo.gearButtons.value == 0) {
            controlParam['gear'] = 1
          }
        }
        if (value === 'idle_mode') {
          // 空闲模式同时下发加湿
          controlParam['humidification'] = DeviceFunctionConfig.humidification.noChange
        }
        this.setData({ controllerInfo })
        this.requestControl({
          control: controlParam,
        })
          .then((res) => {
            isLoading = false
            UI.hideLoading()
            this.closeSelectModeModal()
            this.dataInit(res.data.data.status)
            this.deviceStatusInterval()
          })
          .catch(() => {
            isLoading = false
            UI.hideLoading()
            this.deviceStatusInterval()
          })
      } while (false)
    },
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
        this.setData({
          isShowSelectMode: true,
        })
      } while (false)
    },
    closeSelectModeModal() {
      this.setData({
        isShowSelectMode: false,
      })
    },
    // endregion
    // region 温度控制事件
    moveTemperature(event) {
      let deviceInfo = this.data.deviceInfo
      let temperatureModel = event.detail
      temperatureModel.currentValue = Math.floor(temperatureModel.currentValue)
      deviceInfo.temperature = temperatureModel.currentValue
      this.setData({ deviceInfo })
    },
    changeTemperatureValue(event) {
      let temperatureModel = event.detail
      temperatureModel.currentValue = Math.floor(temperatureModel.currentValue)
      this.setData({
        temperatureSlider: parseComponentModel(temperatureModel),
      })
      // 发送设置温度请求
      UI.showLoading()
      this.clearDeviceStatusInterval()
      this.requestControl({
        control: {
          temperature: temperatureModel.currentValue,
        },
      })
        .then((res) => {
          UI.hideLoading()
          this.dataInit(res.data.data.status)
          this.deviceStatusInterval()
        })
        .catch(() => {
          UI.hideLoading()
          this.deviceStatusInterval()
        })
    },
    // endregion
    // region 设置档位
    moveGearValue(event) {
      let gearModel = event.detail
      gearModel.currentValue = Math.floor(gearModel.currentValue)
      let controllerInfo = this.data.controllerInfo
      controllerInfo.gearButtons.label = gearModel.currentValue
      this.setData({ controllerInfo })
    },
    changeGearValue(event) {
      let gearModel = event.detail
      if (Math.ceil(gearModel.currentValue) - gearModel.currentValue - 0.5 < 0.0001) {
        gearModel.currentValue = Math.ceil(gearModel.currentValue)
      } else {
        gearModel.currentValue = Math.floor(gearModel.currentValue)
      }
      this.setData({
        gearSlider: parseComponentModel(gearModel),
      })
      this.selectGear(gearModel.currentValue)
    },
    selectGear(event) {
      return new Promise((resolve, reject) => {
        do {
          let deviceInfo = this.data.deviceInfo
          let controllerInfo = this.data.controllerInfo
          if (!deviceInfo.isRunning) {
            MideaToast('设备已离线，请检查网络状态')
            break
          }
          let value = undefined
          if (typeof event === 'number') {
            value = event
          } else {
            value = event.currentTarget.dataset.value
            if (value === controllerInfo.gearButtons.value) {
              break
            }
          }
          // 设置档位请求
          UI.showLoading()
          this.clearDeviceStatusInterval()
          this.requestControl({
            control: {
              gear: value,
              mode: parseDeviceConfig({
                type: 'mode',
                value: deviceInfo.modeValue,
                sn8: this.properties.applianceData.sn8,
              }),
            },
          })
            .then((res) => {
              UI.hideLoading()
              this.dataInit(res.data.data.status)
              this.deviceStatusInterval()
              resolve()
            })
            .catch((err) => {
              UI.hideLoading()
              this.deviceStatusInterval()
            })
        } while (false)
      })
    },
    selectColdAndWarm(event) {
      return new Promise((resolve, reject) => {
        do {
          let deviceInfo = this.data.deviceInfo
          if (!deviceInfo.isRunning) {
            MideaToast('设备已离线，请检查网络状态')
            break
          }
          // 设置档位请求
          UI.showLoading()
          this.clearDeviceStatusInterval()
          console.log(event)
          const e = event.currentTarget.dataset.value
          const params = {
            mode: e.mode,
          }
          if (typeof e.gear == 'number') {
            params.gear = e.gear
          }
          this.requestControl({
            control: params,
          })
            .then((res) => {
              UI.hideLoading()
              this.dataInit(res.data.data.status)
              this.deviceStatusInterval()
              resolve()
            })
            .catch((err) => {
              UI.hideLoading()
              this.deviceStatusInterval()
            })
        } while (false)
      })
    },
    selectCoolWarm(event) {
      let deviceInfo = this.data.deviceInfo
      const e = event.currentTarget.dataset.value
      if (!deviceInfo.isRunning) {
        MideaToast('设备已离线，请检查网络状态')
        return
      }
      // 设置档位请求
      UI.showLoading()
      this.clearDeviceStatusInterval()
      const params = {
        mode: e.modeList[0].value,
      }
      this.requestControl({
        control: params,
      })
        .then((res) => {
          UI.hideLoading()
          this.dataInit(res.data.data.status)
          this.deviceStatusInterval()
          resolve()
        })
        .catch((err) => {
          UI.hideLoading()
          this.deviceStatusInterval()
        })
    },
    selectDisinfect(event) {
      return new Promise((resolve, reject) => {
        do {
          let deviceInfo = this.data.deviceInfo
          if (!deviceInfo.isRunning) {
            MideaToast('设备已离线，请检查网络状态')
            break
          }
          UI.showLoading()
          this.clearDeviceStatusInterval()
          console.log(event)
          const e = event.currentTarget.dataset.value
          const params = {
            disinfect: e.value,
          }
          if (e.value == 'repeat') {
            params.disinfect_interval_time = 24
          }
          this.requestControl({
            control: params,
          })
            .then((res) => {
              UI.hideLoading()
              this.dataInit(res.data.data.status)
              this.deviceStatusInterval()
              resolve()
            })
            .catch((err) => {
              UI.hideLoading()
              this.deviceStatusInterval()
            })
        } while (false)
      })
    },
    selectFireLight(event) {
      return new Promise((resolve, reject) => {
        do {
          let deviceInfo = this.data.deviceInfo
          if (!deviceInfo.isRunning) {
            MideaToast('设备已离线，请检查网络状态')
            break
          }
          UI.showLoading()
          this.clearDeviceStatusInterval()
          console.log(event)
          const e = event.currentTarget.dataset.value
          const params = {
            fireLight: e.value,
          }
          this.requestControl({
            control: params,
          })
            .then((res) => {
              UI.hideLoading()
              this.dataInit(res.data.data.status)
              this.deviceStatusInterval()
              resolve()
            })
            .catch((err) => {
              UI.hideLoading()
              this.deviceStatusInterval()
            })
        } while (false)
      })
    },
    showRepeatPick() {
      this.setData({
        isShowRepeatPick: !this.data.isShowRepeatPick,
      })
    },
    repeatOnChange(e) {
      this.data.repeatPicker.selectedValue = e.detail.value
    },
    confirmRepeatPick() {
      return new Promise((resolve, reject) => {
        do {
          let deviceInfo = this.data.deviceInfo
          if (!deviceInfo.isRunning) {
            MideaToast('设备已离线，请检查网络状态')
            break
          }
          UI.showLoading()
          this.clearDeviceStatusInterval()
          this.showRepeatPick()
          let repeatPicker = this.data.repeatPicker
          const params = {
            disinfect_interval_time: repeatPicker.hours[repeatPicker.selectedValue[0]],
          }
          this.requestControl({
            control: params,
          })
            .then((res) => {
              UI.hideLoading()
              this.dataInit(res.data.data.status)
              this.deviceStatusInterval()
              resolve()
            })
            .catch((err) => {
              UI.hideLoading()
              this.deviceStatusInterval()
            })
        } while (false)
      })
    },
    // endregion
    // region 童锁事件
    switchChildLock(event) {
      let deviceInfo = this.data.deviceInfo
      if (!deviceInfo.isOnline) {
        MideaToast('设备已离线，请检查网络状态')
        return
      }
      let childLockModel = event.detail
      let value = DeviceFunctionConfig.lock.off
      let childLockSwitch = this.data.childLockSwitch
      let controllerInfo = this.data.controllerInfo
      controllerInfo.childLock.value = childLockModel.selected
      // 设置童锁请求
      if (childLockModel.selected) {
        value = DeviceFunctionConfig.lock.on
        controllerInfo.childLock.value = true
      } else {
        value = DeviceFunctionConfig.lock.off
        controllerInfo.childLock.value = false
      }
      UI.showLoading()
      this.requestControl({
        control: {
          lock: value,
        },
      })
        .then((res) => {
          UI.hideLoading()
          this.setData({ controllerInfo })
          this.dataInit(res.data.data.status)
          this.deviceStatusInterval()
        })
        .catch((err) => {
          UI.hideLoading()
          this.childLockSwitch.selected = !childLockModel.selected
          this.setData({ childLockSwitch })
          this.deviceStatusInterval()
        })
    },
    switchAction(event) {
      console.log(event, 1111)
      let detail = event.detail
      let currentProtocolVersion = this.data.currentProtocolVersion
      let quickDevJson = this.data.quickDevJson
      let deviceInfo = this.data.deviceInfo
      let control = {}
      let onOrder = quickDevJson.isSupportDiySwing
        ? DeviceFunctionConfig.shakeSwitch.normal
        : DeviceFunctionConfig.shakeSwitch.default
      switch (detail.ctrlKey) {
        case 'voice':
          control = {
            voice: detail.selected ? DeviceFunctionConfig.voice.openBuzzer : DeviceFunctionConfig.voice.closeBuzzer,
          }
          break
        case 'screen_close':
          control = {
            screen_close: detail.selected ? DeviceFunctionConfig.screenClose.off : DeviceFunctionConfig.screenClose.on,
          }
          break
        case 'shake_switch':
          // 判断当前协议版本
          if (currentProtocolVersion < 38) {
            control = {
              shake_switch: detail.selected
                ? DeviceFunctionConfig.shakeSwitch.on
                : DeviceFunctionConfig.shakeSwitch.off,
            }
          } else {
            control = {
              lr_shake_switch: detail.selected ? onOrder : DeviceFunctionConfig.shakeSwitch.off,
              lr_angle: detail.selected ? 120 : 0,
            }
          }
          break
        case 'udShake_switch':
          control = {
            ud_shake_switch: detail.selected ? onOrder : DeviceFunctionConfig.shakeSwitch.off,
            ud_angle: detail.selected ? 135 : 0,
          }

          break
        case 'fire_light':
          control = {
            fireLight: detail.selected ? DeviceFunctionConfig.fireLight.on : DeviceFunctionConfig.fireLight.off,
          }
        case 'humidify_switch':
          control = {
            humidification: detail.selected
              ? DeviceFunctionConfig.humidification.noChange
              : DeviceFunctionConfig.humidification.off,
          }
          if (deviceInfo.modeValue === DeviceFunctionConfig.mode.idle) {
            control.mode = DeviceFunctionConfig.mode.warmHouse
          }
          break
        default:
          break
      }
      UI.showLoading()
      this.requestControl({
        control,
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
    // endregion
    // region 轮询获取设备状态
    deviceStatusInterval() {
      if (deviceStatusTimer) {
        clearInterval(deviceStatusTimer)
      }
      deviceStatusTimer = setInterval(() => {
        this.updateStatus()
      }, 5000)
    },
    clearDeviceStatusInterval() {
      if (deviceStatusTimer) {
        clearInterval(deviceStatusTimer)
      }
    },
    // endregion
    // region 更新设备状态
    updateStatus() {
      let deviceInfo = this.data.deviceInfo
      return new Promise((resolve, reject) => {
        requestService
          .request('luaGet', {
            applianceCode: this.data.deviceInfo.applianceCode,
            command: {},
            reqId: getStamp().toString(),
            stamp: getStamp(),
          })
          .then((res) => {
            do {
              console.log('设备状态')
              console.log(res.data.data)
              if (res.data.code !== '0') {
                if (res.code == 1307) {
                  break
                }
                let msg = Dict.handleErrorMsg(res.code)
                MideaToast(msg)
                break
              }
              // 设置页面属性
              try {
                this.dataInit(res.data.data)
                // deviceInfo.onlineStatus = Dict.onlineStatus.online
                // this.setData({
                //   deviceInfo,
                // })
              } catch (e) {
                console.error(e)
              }

              resolve(res)
              // 判断设备是否故障
              if (res.data.data.error_code !== 0) {
                let controllerInfo = this.data.controllerInfo
                switch (res.data.data.error_code) {
                  case DeviceFunctionConfig.errCode.heaterProtect:
                    controllerInfo.noticeBar.isShow = true
                    controllerInfo.noticeBar.content = '提示: 设备加热时间过长，已自动关机'
                    break
                  default:
                    controllerInfo.noticeBar.isShow = true
                    controllerInfo.noticeBar.content = '提示: 设备故障,请联系客服处理4008899315'
                    console.warn('设备故障')
                    console.warn(res)
                    break
                }
                this.setData({ controllerInfo })
              }
            } while (false)
          })
          .catch((err) => {
            console.log(err)
            if (err && err.data && (err.data.code == '1307' || err.data.code == '40670')) {
              this.setData({
                deviceInfo,
                _applianceData: {
                  onlineStatus: 0,
                  offlineFlag: true,
                },
              })
            } else if (err && err.data) {
              do {
                let msg = Dict.handleErrorMsg(err.data.code)
                MideaToast(msg)
              } while (false)
            }
            resolve()
          })
      })
    },
    // endregion
    // endregion

    // region 2021.08.10 之前代码
    renderCircle() {
      let circleProgressBar = this.selectComponent('#circleProgressBar') //重新渲染环状条
      if (circleProgressBar) {
        let temperature = this.data.tempRange.minTemp
        if (this.data._applianceDataStatus.power === 'on')
          temperature = this.data.changingTemp > 0 ? this.data.changingTemp : this.data._applianceDataStatus.temperature
        setTimeout(() => {
          circleProgressBar.updateProgress(temperature)
        }, 50)
      }
    },
    temperatureChange(e) {
      //调节温度
      if (e.target.id === 'tempMinus') {
        this.moveDownTemperature()
      }
      if (e.target.id === 'tempPlus') {
        this.moveUpTemperature()
      }
    },
    temperatureQuickChange(e) {
      //调节温度
      let applianceStatus = this.data._applianceDataStatus
      if (!applianceStatus || !applianceStatus.temperature) return
      this.setData({
        changingTemp: applianceStatus.temperature,
      })

      if (e.target.id === 'tempPlus') {
        this.data.changingTempInterval = setInterval(() => {
          if (this.data.changingTemp === this.data.tempRange.maxTemp) return
          this.setData({
            changingTemp: this.data.changingTemp + 1,
          })
          this.renderCircle()
        }, 100)
      } else if (e.target.id === 'tempMinus') {
        this.data.changingTempInterval = setInterval(() => {
          if (this.data.changingTemp === this.data.tempRange.minTemp) return
          this.setData({
            changingTemp: this.data.changingTemp - 1,
          })
          this.renderCircle()
        }, 100)
      }
    },
    moveDownTemperature(callabck, error) {
      let temperature
      if (!this.data._applianceDataStatus.temperature) temperature = this.data.tempRange.maxTemp
      else temperature = Number(this.data._applianceDataStatus.temperature) - 1
      if (temperature >= this.data.tempRange.minTemp) {
        wx.showLoading({
          title: '温度调节中',
          mask: true,
        })
        this.requestControl(
          {
            control: {
              temperature: temperature,
            },
          },
          () => {
            wx.hideLoading()
          },
          () => {
            wx.hideLoading()
          }
        )
      } else {
        wx.showToast({
          title: '已经为最低温度',
          icon: 'none',
        })
      }
    },
    moveUpTemperature(callabck, error) {
      let temperature
      if (!this.data._applianceDataStatus.temperature) temperature = this.data.tempRange.minTemp
      else temperature = Number(this.data._applianceDataStatus.temperature) + 1
      if (temperature <= this.data.tempRange.maxTemp) {
        wx.showLoading({
          title: '温度调节中',
          mask: true,
        })
        this.requestControl(
          {
            control: {
              temperature: temperature,
            },
          },
          () => {
            wx.hideLoading()
          },
          () => {
            wx.hideLoading()
          }
        )
      } else {
        wx.showToast({
          title: '已经为最高温度',
          icon: 'none',
        })
      }
    },
    sendTemperatureCmd() {
      clearInterval(this.data.changingTempInterval)
      if (this.data.changingTemp === -1) return
      wx.showLoading({
        title: '温度调节中',
        mask: true,
      })
      this.requestControl(
        {
          control: {
            temperature: this.data.changingTemp,
          },
        },
        () => {
          wx.hideLoading()
          this.setData({
            changingTemp: -1,
            changingTempInterval: -1,
          })
        },
        () => {
          wx.hideLoading()
          this.setData({
            changingTemp: -1,
            changingTempInterval: -1,
          })
        }
      )
    },
    initPickerTimeOn() {
      let obj = {}
      obj.empty = ['']
      obj.hours = []
      // obj.minutes = [];
      obj.finish = ['小时后运行']
      let { hour } = getTimeRange()
      for (let i = hour[0]; i <= hour[1]; i++) {
        obj.hours.push(i)
      }

      obj.initValue = [0, 0, 0]

      this.setData({
        currentPickerType: pickerType.timerOn,
        multiArray: [obj.empty, obj.hours, obj.finish],
        multiIndex: [0, Math.max(this.data._applianceDataStatus.timer_on_hour - 1, 0), 0],
      })
    },
    initPickerTimeOff() {
      let obj = {}
      obj.empty = ['']
      obj.hours = []
      // obj.minutes = [];
      obj.finish = ['小时后关机']
      let { hour } = getTimeRange()
      for (let i = hour[0]; i <= hour[1]; i++) {
        obj.hours.push(i)
      }

      obj.initValue = [0, 0, 0]

      this.setData({
        currentPickerType: pickerType.timerOff,
        multiArray: [obj.empty, obj.hours, obj.finish],
        multiIndex: [0, Math.max(this.data._applianceDataStatus.timer_off_hour - 1, 0), 0],
      })
    },
    initPickerGear(mode) {
      let obj = {}
      obj.empty = ['']
      if (mode === 'normal') obj.hours = [1, 3]
      else if (mode === 'cold_air') obj.hours = [1, 2]
      // obj.minutes = [];
      obj.finish = ['挡']

      obj.initValue = [0, 0, 0]

      this.setData({
        currentPickerType: pickerType.gear,
        multiArray: [obj.empty, obj.hours, obj.finish],
        multiIndex: [
          0,
          this.data && this.data._applianceDataStatus && this.data._applianceDataStatus.gear
            ? Math.max(obj.hours.indexOf(this.data._applianceDataStatus.gear), 0)
            : 0,
          0,
        ],
      })
    },

    requestControl(command, success = () => {}, fail = () => {}) {
      // 埋点
      let params = {
        control_params: JSON.stringify(command),
      }
      this.rangersBurialPointClick('plugin_button_click', params)
      let deviceInfo = this.data.deviceInfo
      return new Promise((resolve, reject) => {
        requestService
          .request('luaControl', {
            applianceCode: deviceInfo.applianceCode,
            command: command,
            reqId: getStamp().toString(),
            stamp: getStamp(),
          })
          .then((res) => {
            console.log('设备修改完成')
            console.log(res)
            success()
            resolve(res)
          })
          .catch((err) => {
            if (err && err.data && err.data.code === '1307') {
              reject()
            }
            if (err.data && err.data.code) {
              do {
                let msg = Dict.handleErrorMsg(err.data.code)
                MideaToast(msg)
              } while (false)
            } else {
              MideaToast(JSON.stringify(err))
            }
            fail()
            reject()
          })
      })
    },
    computeStatus() {
      let { work_status, mode, gear } = this.data._applianceDataStatus
      this.setData({
        currentModeName: modeDesc[mode] ? modeDesc[mode] : '',
      })
      if (mode === 'cold_air') {
        this.setData({
          circleSrc: this.data.circleImg.blue,
        })
      }
      this.setData({
        currentGear: gear ? gear : 0,
      })
    },
    computeButtons() {
      let {
        power,
        mode,
        timer_on_hour,
        timer_on_minute,
        timer_off_hour,
        timer_off_minute,
        gear,
        humidification,
        shake_switch,
      } = this.data._applianceDataStatus
      let powerOn = power === 'on'

      let tempTimerData
      if (powerOn) {
        if (timer_off_hour !== 0 || timer_off_minute !== 0) {
          // 有设置定时关
          if (mode === 'normal') {
            tempTimerData = this.data.timerDataList.onWarm
          } else if (mode === 'cold_air') {
            tempTimerData = this.data.timerDataList.onCold
          } else {
            tempTimerData = this.data.timerDataList.onWarm
          }
          tempTimerData.desc = timer_off_hour + '小时关'
        } else {
          tempTimerData = this.data.timerDataList.off
        }
      } else {
        if (timer_on_hour !== 0 || timer_on_minute !== 0) {
          // 有设置定时开
          tempTimerData = this.data.timerDataList.onWarm
          tempTimerData.desc = timer_on_hour + '小时开'
        } else {
          tempTimerData = this.data.timerDataList.off
        }
      }

      let tempGearData
      if (powerOn) {
        if (mode === 'normal') {
          tempGearData = this.data.gearDataList.onWarm
          tempGearData.desc = '挡位 | ' + gear + '挡'
        } else if (mode === 'cold_air') {
          tempGearData = this.data.gearDataList.onCold
          tempGearData.desc = '挡位 | ' + gear + '挡'
        } else {
          tempGearData = this.data.gearDataList.off
        }
      } else {
        tempGearData = this.data.gearDataList.disabled
      }

      let tempHumidityData
      if (powerOn) {
        if (humidification === 'off') {
          tempHumidityData = this.data.humidityModeDataList.off
        } else {
          // TODO 暂时认为不是off就是开启了
          // 判断当前mode
          if (mode === 'normal') {
            tempHumidityData = this.data.humidityModeDataList.onWarm
          } else if (mode === 'cold_air') {
            tempHumidityData = this.data.humidityModeDataList.onCold
          } else {
            // TODO 其他模式都显示暖色
            tempHumidityData = this.data.humidityModeDataList.onWarm
          }
        }
      } else {
        tempHumidityData = this.data.humidityModeDataList.disabled
      }

      let tempShakeData
      if (powerOn) {
        if (shake_switch === 'off') {
          tempShakeData = this.data.shakeDataList.off
        } else {
          // TODO 暂时认为不是off就是开启了
          // 判断当前mode
          if (mode === 'normal') {
            tempShakeData = this.data.shakeDataList.onWarm
          } else if (mode === 'cold_air') {
            tempShakeData = this.data.shakeDataList.onCold
          } else {
            // TODO 其他模式都显示暖色
            tempShakeData = this.data.shakeDataList.onWarm
          }
        }
      } else {
        tempShakeData = this.data.shakeDataList.disabled
      }

      this.setData({
        power: powerOn ? this.data.powerDataList.on : this.data.powerDataList.off,
        warmAir: powerOn
          ? mode === 'normal'
            ? this.data.warmAirDataList.on
            : this.data.warmAirDataList.off
          : this.data.warmAirDataList.disabled,
        coldAir: powerOn
          ? mode === 'cold_air'
            ? this.data.coldAirDataList.on
            : this.data.coldAirDataList.off
          : this.data.coldAirDataList.disabled,
        gear: tempGearData,
        shake: tempShakeData,
        humidityMode: tempHumidityData,
        eco: powerOn
          ? mode === 'efficient'
            ? this.data.ecoDataList.on
            : this.data.ecoDataList.off
          : this.data.ecoDataList.disabled,
        timerOn: tempTimerData,
        timerOff: tempTimerData,
      })
    },
    defaultIcon() {
      this.setData({
        rowClass1: 'row-sb',
        rowClass2: 'row-sb',
      })
    },
    modeToggle(e) {
      //点击模式按钮
      console.log(e)
      let target = e.target.id
      let { power, timer_on_hour, timer_on_minute, timer_off_hour, timer_off_minute, humidification, mode } =
        this.data._applianceDataStatus
      if (target === 'power') {
        this.requestControl({
          control: {
            power: power === 'on' ? 'off' : 'on',
          },
        })
      } else if (target === 'timerOn') {
        if (power === 'off') {
          if (timer_on_hour === 0 && timer_on_minute === 0) {
            this.initPickerTimeOn()
            this._openPick()
          } else {
            // 取消定时开
            this.requestControl({
              control: {
                timer_on_minute: 'clean',
              },
            })
          }
        }
      } else if (target === 'timerOff') {
        if (power === 'on') {
          if (timer_off_hour === 0 && timer_off_minute === 0) {
            this.initPickerTimeOff()
            this._openPick()
          } else {
            // 取消定时关
            this.requestControl({
              control: {
                timer_off_minute: 'clean',
              },
            })
          }
        }
      } else if (target === 'warmAir') {
        this.requestControl({
          control: {
            mode: 'normal',
          },
        })
      } else if (target === 'coldAir') {
        this.requestControl({
          control: {
            mode: 'cold_air',
          },
        })
      } else if (target === 'eco') {
        this.requestControl({
          control: {
            mode: 'efficient',
          },
        })
      } else if (target === 'humidityMode') {
        if (humidification === 'off') {
          // TODO 暂定使用no_change
          this.requestControl({
            control: {
              humidification: 'no_change',
            },
          })
        } else if (humidification === 'no_change') {
          this.requestControl({
            control: {
              humidification: 'off',
            },
          })
        }
      } else if (target === 'gear') {
        this.initPickerGear(mode)
        this._openPick()
      } else if (target === 'shake') {
        if (this.data._applianceDataStatus.shake_switch === 'on') {
          this.requestControl({
            control: {
              shake_switch: 'off',
            },
          })
        } else {
          this.requestControl({
            control: {
              shake_switch: 'on',
            },
          })
        }
      }
    },
    _sure(e) {
      // 预约组件回调
      let { detail } = e
      console.log(detail)
      this.setData({ openPicker: false })
      if (this.data.currentPickerType === pickerType.timerOn) {
        this.requestControl({
          control: {
            timer_on_hour: detail.value[1] + 1,
            timer_on_minute: 0,
          },
        })
      } else if (this.data.currentPickerType === pickerType.timerOff) {
        this.requestControl({
          control: {
            timer_off_hour: detail.value[1] + 1,
            timer_off_minute: 0,
          },
        })
      } else if (this.data.currentPickerType === pickerType.gear) {
        this.requestControl({
          control: {
            gear: parseInt(this.data.multiArray[1][detail.value[1]]),
          },
        })
      }
    },
    _close(e) {
      this.setData({ openPicker: false })
    },
    _openPick() {
      this.setData({ openPicker: true })
    },
    // updateDataAndUI(applianceDataStatus) {
    //   // if (applianceDataStatus.mode !== this.data._applianceDataStatus.mode || applianceDataStatus.power !== this.data._applianceDataStatus.power)
    //   this.triggerEvent('modeChange', this.getCurrentMode(applianceDataStatus)) //向上层通知mode更改
    //   this.setData({
    //     _applianceDataStatus: applianceDataStatus,
    //   })
    //   this.renderCircle()
    //   this.computeButtons()
    //   this.computeStatus()
    // },
    /**
     *
     * @param applianceDataStatus 准备更新的最新状态
     * @returns {{applianceCode: *, mode: string}}
     */
    // getCurrentMode(applianceDataStatus) {
    //   let mode
    //   if (this.data._applianceData.onlineStatus == 0) {
    //     mode = CARD_MODE_OPTION.OFFLINE
    //   } else {
    //     if (!applianceDataStatus || applianceDataStatus.power === 'off') {
    //       mode = CARD_MODE_OPTION.HEAT
    //     } else {
    //       if (applianceDataStatus.mode === 'cold_air') {
    //         mode = CARD_MODE_OPTION.COLD
    //       } else {
    //         mode = CARD_MODE_OPTION.HEAT
    //       }
    //     }
    //   }
    //   return {
    //     applianceCode: this.data.applianceData.applianceCode,
    //     mode,
    //   }
    // },
    getDestoried() {
      //执行当前页面前后插件的业务逻辑，主要用于一些清除工作
      if (deviceStatusTimer) {
        clearInterval(deviceStatusTimer)
      }
      // 数据初始化
      deviceStatusTimer = null
      deviceShutdownTimer = null
      isDebug = false
      isLoading = false
      productConfig = {}
    },
    // 埋点
    rangersBurialPointClick(eventName, param) {
      let deviceInfo = this.data.deviceInfo
      if (deviceInfo) {
        let paramBurial = {}
        let paramBase = {
          module: '插件',
          apptype_name: '取暖器',
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
    // 获取设备高度
    wx.getSystemInfo({
      success: (res) => {
        // 设置功能区域高度
        let headerHeight = res.statusBarHeight + 40
        let factor = res.screenWidth / 750
        let mainHeight = 550 * factor
        let marginHeight = 40 * factor
        let controllerHeight = res.screenHeight - headerHeight - mainHeight - marginHeight - 35
        this.setData({
          controllerHeight: controllerHeight,
        })
      },
      fail: (err) => {
        console.error('设备信息')
        console.error(err)
      },
    })
    const app = getApp()
    let deviceInfo = this.data.deviceInfo
    wx.nextTick(() => {
      do {
        Object.assign(deviceInfo, this.properties.applianceData)
        let userData = app.globalData.userData
        if (isDebug) {
          this.setData({
            isInit: true,
          })
          break
        }
        if (!userData) {
          UI.toast('缺少用户信息')
          break
        }
        this.setData({
          uid: app.globalData.userData.uid,
          _applianceData: this.properties.applianceData,
          deviceInfo: deviceInfo,
        })
        let param = {}
        param['page_name'] = '首页'
        param['object'] = '进入插件页'
        this.rangersBurialPointClick('plugin_page_view', param)
        // 数据初始化
        // UI.showLoading();
        this.getProductConfig()
          .then(() => {
            this.updateStatus().then(() => {
              // UI.hideLoading();
              this.setData({
                isInit: true,
              })
              this.deviceStatusInterval()
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
          })
          .catch((err) => {
            UI.hideLoading()
          })
      } while (false)
    })
  },
})
