import { requestService, rangersBurialPoint } from '../../../utils/requestService'
import { getStamp } from 'm-utilsdk/index'

import { PluginConfig } from './js/plugin-config.js'
import { DeviceData } from '../assets/scripts/device-data'
import MideaToast from '../component/midea-toast/toast'
import config from '../../../config'
import { Format } from '../assets/scripts/format'
import { imageApi } from '../assets/scripts/api'
import { parseComponentModel } from '../assets/scripts/common'

let deviceStatusTimer = null
let isDeviceInterval = true
let showingSettingModalTimer = null
const DO_WHILE_RETURN = false
const app = getApp()

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
    // region 2022.02.09 - AO
    stoveCardArr: [],
    stoveDoubleSettingModel: parseComponentModel({}),
    stoveMiddleSettingModel: parseComponentModel({}),
    // endregion
    // region 2022.01.13 - AO
    pageStyle: {
      footerBox: 'height: 168rpx',
      footerWrapper: 'padding-bottom: 0;',
    },
    popUpModalStyle: 'background:#fff;border-top-left-radius: 1rem;border-top-right-radius: 1rem;',
    configList: [],
    quickDevJson: undefined,
    deviceInfo: {
      isOnline: false,
      isRunning: false,
      isWorking: false,
      workStatus: {},
      workStatusMap: {},
    },
    isBottomFixed: false,
    isInit: false,
    noticeBar: {
      isShow: false,
      content: '内容',
      type: 'error',
    },
    iconUrl: {
      headerImg: imageApi.getImagePath.url + '/0xB9/img-header.png',
      power: {
        default: imageApi.getImagePath.url + '/0xB9/icon-power.png',
        white: imageApi.getImagePath.url + '/0xB9/icon-power-white.png',
      },
    },
    settingModal: {
      isInit: false,
      isShow: false,
      type: 'middle',
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
    // region 2022.01.25 - AO
    // 参数初始化
    stoveCardInit({ sn8 }) {
      let stoveCardArr = this.data.stoveCardArr
      let stoveDoubleSettingModel = this.data.stoveDoubleSettingModel
      let stoveMiddleSettingModel = this.data.stoveMiddleSettingModel
      switch (sn8) {
        case PluginConfig.sn8Data[0]:
          stoveCardArr = [
            {
              id: 0,
              name: '左灶',
              statusName: '待机',
              settingIndex: 'doubleSetting',
              realStatus: {},
              settingParams: {},
              cardInfo: parseComponentModel({
                id: 0,
                name: '左灶',
                statusName: '待机',
                isError: false,
                isRunning: false,
                isWorking: false,
                isPause: false,
                settingParams: {
                  valueText: '25档',
                  workTimeLabel: {
                    hours: '01',
                    minutes: '00',
                    seconds: '00',
                  },
                  setWorkTimeLabel: '1小时',
                },
              }),
            },
            {
              id: 1,
              name: '右灶',
              settingIndex: 'doubleSetting',
              realStatus: {},
              settingParams: {},
              cardInfo: parseComponentModel({
                id: 1,
                name: '右灶',
                statusName: '待机',
                isRunning: false,
                isWorking: false,
                isPause: false,
                settingParams: {
                  valueText: '25档',
                  workTimeLabel: {
                    hours: '01',
                    minutes: '00',
                    seconds: '00',
                  },
                  setWorkTimeLabel: '1小时',
                },
              }),
            },
          ]
          stoveDoubleSettingModel = parseComponentModel({
            maxTotalFireLevel: 100,
            hasTemperature: true,
            noLimit: true,
            stoveOptions: [
              {
                id: 0,
                name: '左灶',
                settingParams: {
                  isRunning: false,
                  isTemperature: false,
                  fireLevel: 25,
                  workMode: PluginConfig.workMode.heating,
                  setWorkTime: Format.formatSeconds(60 * 60),
                },
              },
              {
                id: 1,
                name: '右灶',
                settingParams: {
                  isRunning: false,
                  isTemperature: false,
                  fireLevel: 25,
                  workMode: PluginConfig.workMode.heating,
                  setWorkTime: Format.formatSeconds(60 * 60),
                },
              },
            ],
          })
          break
        case PluginConfig.sn8Data[2]:
          stoveCardArr = [
            {
              id: 0,
              name: '左灶',
              statusName: '待机',
              settingIndex: 'doubleSetting',
              realStatus: {},
              settingParams: {},
              cardInfo: parseComponentModel({
                id: 0,
                name: '左灶',
                statusName: '待机',
                isError: false,
                isRunning: false,
                isWorking: false,
                isPause: false,
                settingParams: {
                  valueText: '14档',
                  workTimeLabel: {
                    hours: '01',
                    minutes: '00',
                    seconds: '00',
                  },
                  setWorkTimeLabel: '1小时',
                },
              }),
            },
            {
              id: 2,
              name: '右灶',
              settingIndex: 'doubleSetting',
              realStatus: {},
              settingParams: {},
              cardInfo: parseComponentModel({
                id: 2,
                name: '右灶',
                statusName: '待机',
                isRunning: false,
                isWorking: false,
                isPause: false,
                settingParams: {
                  valueText: '14档',
                  workTimeLabel: {
                    hours: '01',
                    minutes: '00',
                    seconds: '00',
                  },
                  setWorkTimeLabel: '1小时',
                },
              }),
            },
            {
              id: 1,
              name: '中灶',
              settingIndex: 'middleSetting',
              realStatus: {},
              settingParams: {},
              cardInfo: parseComponentModel({
                id: 1,
                name: '中灶',
                statusName: '待机',
                isRunning: false,
                isWorking: false,
                isPause: false,
                settingParams: {
                  valueText: '大火',
                  workTimeLabel: {
                    hours: '02',
                    minutes: '00',
                    seconds: '00',
                  },
                  setWorkTimeLabel: '2小时',
                },
              }),
            },
          ]
          stoveDoubleSettingModel = parseComponentModel({
            maxSingleFireLevel: 15,
            maxTotalFireLevel: 28,
            maxPower: 3900,
            stoveOptions: [
              {
                id: 0,
                name: '左灶',
                settingParams: {
                  isRunning: false,
                  isTemperature: false,
                  fireLevel: 14,
                  workMode: PluginConfig.workMode.cook,
                  setWorkTime: Format.formatSeconds(60 * 60),
                },
                powerOptions: [
                  {
                    code: 1,
                    name: '炒菜',
                    value: 14,
                    bgColor: '#FFF6E7',
                    iconUrl: {
                      default: imageApi.getImagePath.url + '/0xB9/icon-chaocai.png',
                      white: imageApi.getImagePath.url + '/0xB9/icon-chaocai-white.png',
                      disabled: imageApi.getImagePath.url + '/0xB9/icon-chaocai-grey.png',
                      workMode: imageApi.getImagePath.url + '/0xB9/icon-chaocai.png',
                    },
                  },
                  {
                    code: 11,
                    name: '煎炸',
                    value: 10,
                    bgColor: '#FFF6E7',
                    iconUrl: {
                      default: imageApi.getImagePath.url + '/0xB9/icon-jianzha.png',
                      white: imageApi.getImagePath.url + '/0xB9/icon-jianzha-white.png',
                      disabled: imageApi.getImagePath.url + '/0xB9/icon-jianzha-grey.png',
                      workMode: imageApi.getImagePath.url + '/0xB9/icon-jianzha.png',
                    },
                  },
                  {
                    code: 15,
                    name: '炖煮',
                    value: 15,
                    bgColor: '#FFF6E7',
                    iconUrl: {
                      default: imageApi.getImagePath.url + '/0xB9/icon-dunzhu.png',
                      white: imageApi.getImagePath.url + '/0xB9/icon-dunzhu-white.png',
                      disabled: imageApi.getImagePath.url + '/0xB9/icon-dunzhu-grey.png',
                      workMode: imageApi.getImagePath.url + '/0xB9/icon-dunzhu.png',
                    },
                  },
                ],
              },
              {
                id: 2,
                name: '右灶',
                settingParams: {
                  isRunning: false,
                  isTemperature: false,
                  fireLevel: 14,
                  workMode: PluginConfig.workMode.cook,
                  setWorkTime: Format.formatSeconds(60 * 60),
                },
                powerOptions: [
                  {
                    code: 1,
                    name: '炒菜',
                    value: 14,
                    bgColor: '#FDF0EB',
                    iconUrl: {
                      default: imageApi.getImagePath.url + '/0xB9/icon-chaocai.png',
                      white: imageApi.getImagePath.url + '/0xB9/icon-chaocai-white.png',
                      disabled: imageApi.getImagePath.url + '/0xB9/icon-chaocai-grey.png',
                      workMode: imageApi.getImagePath.url + '/0xB9/icon-chaocai.png',
                    },
                  },
                  {
                    code: 11,
                    name: '煎炸',
                    value: 10,
                    bgColor: '#FDF0EB',
                    iconUrl: {
                      default: imageApi.getImagePath.url + '/0xB9/icon-jianzha.png',
                      white: imageApi.getImagePath.url + '/0xB9/icon-jianzha-white.png',
                      disabled: imageApi.getImagePath.url + '/0xB9/icon-jianzha-grey.png',
                      workMode: imageApi.getImagePath.url + '/0xB9/icon-jianzha.png',
                    },
                  },
                  {
                    code: 15,
                    name: '炖煮',
                    value: 15,
                    bgColor: '#FDF0EB',
                    iconUrl: {
                      default: imageApi.getImagePath.url + '/0xB9/icon-dunzhu.png',
                      white: imageApi.getImagePath.url + '/0xB9/icon-dunzhu-white.png',
                      disabled: imageApi.getImagePath.url + '/0xB9/icon-dunzhu-grey.png',
                      workMode: imageApi.getImagePath.url + '/0xB9/icon-dunzhu.png',
                    },
                  },
                ],
              },
            ],
          })
          stoveMiddleSettingModel = parseComponentModel({
            id: 1,
            fireLevel: 10,
            workMode: PluginConfig.workMode.soup,
            setWorkTime: Format.formatSeconds(120 * 60),
          })
          break
      }
      stoveCardArr.forEach((stoveItem) => {
        this.updateStatus({ stoveIndex: stoveItem.id })
      })
      this.setData({ stoveCardArr, stoveDoubleSettingModel, stoveMiddleSettingModel })
    },
    // 页面高度适应IOS
    adjustPage() {
      let pageStyle = this.data.pageStyle
      let isIpx = app.globalData.isPx
      pageStyle.footerBox = 'height:' + (isIpx ? '198rpx' : '168rpx') + ';'
      pageStyle.footerWrapper = 'padding-bottom:' + (isIpx ? '30rpx' : '0') + ';'
      this.setData({ pageStyle })
    },
    // endregion
    // region 2022.01.14 - AO
    onClickEvent(event) {
      do {
        console.log('点击事件')
        console.log(event)
        let index = event.currentTarget.dataset.index
        let item = event.detail.item
        console.log('index: ' + index)
        console.log('item: ', item)
        let settingModalParams = undefined
        let settingParams = {}
        let stoveCardArr = this.data.stoveCardArr
        let workSwitch = PluginConfig.workSwitch.pause
        if (index) {
          let isAllOn = true
          switch (index) {
            case 'powerOnAll':
              // 开关机
              stoveCardArr.forEach((stoveItem) => {
                stoveItem.cardInfo = parseComponentModel(stoveItem.cardInfo)
                workSwitch = stoveItem.cardInfo.isRunning
                  ? PluginConfig.workSwitch.powerOff
                  : PluginConfig.workSwitch.powerOn
                stoveItem.cardInfo = parseComponentModel(stoveItem.cardInfo)
                if (workSwitch === PluginConfig.workSwitch.powerOn) {
                  PluginConfig.onClickControl({
                    controlParams: {
                      work_switch: workSwitch,
                      cur_burner_number: stoveItem.id,
                    },
                  }).then((res) => {
                    this.dataInit(res.data.data.status)
                    // this.updateStatus({stoveIndex:stoveIndex})
                  })
                } else {
                  isAllOn = false
                }
              })
              if (isAllOn) {
                MideaToast('设备已开机')
              }
              break
            case 'doubleSetting':
              settingModalParams = {
                type: 'double',
              }
              break
            case 'middleSetting':
              settingModalParams = {
                type: 'middle',
              }
              break
          }
        }
        if (item) {
          let controlParams = {}
          let stoveIndex = Number(event.detail.stoveIndex)
          let currentCard = stoveCardArr.find((item) => item.id === stoveIndex)
          let stoveOptions = item.stoveOptions
          let stoveDoubleSettingModel = parseComponentModel(this.data.stoveDoubleSettingModel)
          switch (item.index) {
            case 'continue':
              workSwitch = PluginConfig.workSwitch.work
              wx.showModal({
                title: currentCard.name + '烹饪',
                content: '是否确定启动烹饪',
                success: (res) => {
                  if (res.confirm) {
                    PluginConfig.onClickControl({
                      controlParams: {
                        work_mode: currentCard.realStatus.work_mode,
                        work_switch: workSwitch,
                        cur_burner_number: stoveIndex,
                      },
                    }).then((res) => {
                      this.dataInit(res.data.data.status)
                    })
                  }
                },
              })
              break
            case 'pause':
              workSwitch = PluginConfig.workSwitch.pause
              PluginConfig.onClickControl({
                controlParams: {
                  work_mode: currentCard.realStatus.work_mode,
                  work_switch: workSwitch,
                  cur_burner_number: stoveIndex,
                },
              }).then((res) => {
                MideaToast('已为您暂停烹饪程序')
                this.dataInit(res.data.data.status)
              })
              break
            case 'start':
              if (index === 'doubleSetting') {
                let currentStoveSetting = stoveDoubleSettingModel.stoveOptions.find((item) => item.id === stoveIndex)
                if (currentStoveSetting) {
                  Object.assign(settingParams, currentStoveSetting.settingParams)
                }
              } else {
                settingParams = parseComponentModel(this.data.stoveMiddleSettingModel)
              }
              console.log(settingParams)
              // break;
              // 启动灶头
              wx.showModal({
                title: currentCard.name + '烹饪',
                content: '是否确定启动烹饪',
                success: (res) => {
                  if (res.confirm) {
                    controlParams = {
                      work_switch: PluginConfig.workSwitch.work,
                      cur_burner_number: stoveIndex,
                      work_mode: settingParams.workMode,
                    }
                    let setWorkTimeSec =
                      settingParams.setWorkTime.hours * 60 * 60 + settingParams.setWorkTime.minutes * 60
                    if (Number(currentCard.realStatus.set_work_time_sec) !== setWorkTimeSec) {
                      controlParams.set_work_time_sec =
                        settingParams.setWorkTime.hours * 60 * 60 +
                        settingParams.setWorkTime.minutes * 60 +
                        settingParams.setWorkTime.seconds
                    }
                    if (settingParams.isTemperature) {
                      controlParams.temperature = settingParams.temperature
                    } else {
                      controlParams.fire_level = settingParams.fireLevel
                    }
                    PluginConfig.onClickControl({
                      controlParams: controlParams,
                    }).then((res) => {
                      this.dataInit(res.data.data.status)
                    })
                  }
                },
              })
              break
            case 'power':
              // 开关机
              currentCard.cardInfo = parseComponentModel(currentCard.cardInfo)
              workSwitch = currentCard.cardInfo.isRunning
                ? PluginConfig.workSwitch.powerOff
                : PluginConfig.workSwitch.powerOn
              currentCard.cardInfo = parseComponentModel(currentCard.cardInfo)
              PluginConfig.onClickControl({
                controlParams: {
                  work_switch: workSwitch,
                  cur_burner_number: stoveIndex,
                },
              }).then((res) => {
                res.data.data.status.cur_burner_number = stoveIndex
                this.dataInit(res.data.data.status)
                // this.updateStatus({stoveIndex:stoveIndex})
              })
              break
            case 'stop':
              wx.showModal({
                title: currentCard.name + '将会结束烹饪',
                content: '是否继续',
                success: (res) => {
                  if (res.confirm) {
                    PluginConfig.onClickControl({
                      controlParams: {
                        work_switch:
                          PluginConfig.sn8 === PluginConfig.sn8Data[0]
                            ? PluginConfig.workSwitch.cancel
                            : PluginConfig.workSwitch.powerOff,
                        cur_burner_number: stoveIndex,
                      },
                    }).then((res) => {
                      res.data.data.status.cur_burner_number = stoveIndex
                      this.dataInit(res.data.data.status)
                    })
                  }
                },
              })
              break
            case 'setting':
              this.showSettingModal(settingModalParams)
              break
            case 'doubleSettingCancel':
              this.closeSettingModal()
              break
            case 'doubleSettingConfirm':
              // 左右灶确认启动
              if (stoveOptions && stoveOptions.length > 0) {
                stoveOptions.forEach((stoveItem) => {
                  if (stoveItem.stoveIndex === 1 && stoveCardArr.length === 3) {
                    stoveItem.stoveIndex = 2
                  }
                  let currentCard = stoveCardArr.find((item) => item.id === stoveItem.stoveIndex)
                  let changeControlParams = {
                    cur_burner_number: stoveItem.stoveIndex,
                    work_mode: stoveItem.settingParams.workMode,
                    work_switch: PluginConfig.workSwitch.work,
                  }
                  let setWorkTimeSec =
                    stoveItem.settingParams.setWorkTime.hours * 60 * 60 +
                    stoveItem.settingParams.setWorkTime.minutes * 60
                  if (Number(currentCard.realStatus.set_work_time_sec) !== setWorkTimeSec) {
                    changeControlParams.set_work_time_sec = setWorkTimeSec
                  }
                  if (stoveItem.settingParams.isTemperature) {
                    changeControlParams.temperature = stoveItem.settingParams.temperature
                  } else {
                    changeControlParams.fire_level = stoveItem.settingParams.fireLevel
                  }
                  if (stoveItem.settingParams.isRunning) {
                    do {
                      if (PluginConfig.sn8 === PluginConfig.sn8Data[2]) {
                        PluginConfig.onClickControl({
                          controlParams: {
                            work_mode: currentCard.realStatus.work_mode,
                            work_switch: PluginConfig.workSwitch.work,
                            cur_burner_number: stoveItem.stoveIndex,
                          },
                        }).then(() => {
                          PluginConfig.onClickControl({
                            controlParams: changeControlParams,
                          }).then((res) => {
                            this.dataInit(res.data.data.status)
                            this.closeSettingModal()
                          })
                        })
                        break
                      }
                      PluginConfig.onClickControl({
                        controlParams: changeControlParams,
                      }).then((res) => {
                        this.dataInit(res.data.data.status)
                        this.closeSettingModal()
                      })
                    } while (DO_WHILE_RETURN)
                  }
                })
              }
              break
            case 'middleSettingCancel':
              this.closeSettingModal()
              break
            case 'middleSettingConfirm':
              settingParams = item.settingParams
              PluginConfig.onClickControl({
                controlParams: {
                  cur_burner_number: 1,
                  work_mode: settingParams.workMode,
                  work_switch: PluginConfig.workSwitch.work,
                  fire_level: settingParams.fireLevel,
                  set_work_time_sec: settingParams.setWorkTime.hours * 60 * 60 + settingParams.setWorkTime.minutes * 60,
                },
              }).then((res) => {
                this.dataInit(res.data.data.status)
                this.closeSettingModal()
              })
              break
          }
        }
      } while (DO_WHILE_RETURN)
    },
    // endregion
    // region 2021.12.01 - ao
    // region 跳转到美居下载页
    goToDownLoad() {
      wx.navigateTo({
        url: '/pages/download/download',
      })
    },
    // endregion
    // region 获取产品配置
    getProductConfig() {
      return new Promise((resolve) => {
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
        let isDebug = config.environment == 'sit'
        if (!isDebug) {
          sendParams = {
            serviceName: 'quick-development-service',
            uri: 'frontend/productConfig' + Format.jsonToParam(sendParams),
            method: 'GET',
            contentType: 'application/json',
          }
          method = 'POST'
        }
        requestService
          .request('productConfig', sendParams, method)
          .then((res) => {
            console.log('获取产品配置')
            console.log(deviceInfo)
            console.log(res)
            // 设置页面功能
            let resData = null
            if (isDebug) {
              res = res.data
              resData = res.data
            } else {
              res = JSON.parse(res.data.result.returnData)
              resData = res.data
            }
            console.log(resData)
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
              let quickDevJson = PluginConfig.quickDevJson2Local(resData)
              console.log('解析后参数')
              console.log(quickDevJson)
              // 功能选项
              console.log('页面配置')
              // 设置灶头配置
              this.stoveCardInit({
                sn8: deviceInfo.sn8,
              })
              // console.log(configList)
              // this.setData({ configList, deviceInfo, quickDevJson, pageProductConfig })
            } while (DO_WHILE_RETURN)
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
    dataInit(newDeviceStatus) {
      let data = this.data
      let deviceInfo = data.deviceInfo
      console.log('数据初始化')
      console.log(newDeviceStatus)
      if (newDeviceStatus) {
        let stoveIndex = Number(newDeviceStatus.cur_burner_number)
        let stoveCardArr = this.data.stoveCardArr
        let currentCard = stoveCardArr.find((item) => item.id === stoveIndex)
        let stoveNum = Number(newDeviceStatus.burner_sum)
        let otherStoveIndex = stoveNum - 1 - stoveIndex
        let otherCard = stoveCardArr.find((item) => item.id === otherStoveIndex)
        Object.assign(currentCard.realStatus, newDeviceStatus)
        currentCard.cardInfo = parseComponentModel(currentCard.cardInfo)
        if (otherStoveIndex !== stoveIndex) {
          otherCard.cardInfo = parseComponentModel(otherCard.cardInfo)
        }
        // 工作状态
        newDeviceStatus.error_code = Number(newDeviceStatus.error_code)
        // newDeviceStatus.error_code = 1;
        currentCard.cardInfo.isError = newDeviceStatus.error_code !== 0
        currentCard.cardInfo.errorMsg = PluginConfig.errorCode[newDeviceStatus.error_code]
        if (newDeviceStatus.work_status) {
          currentCard.cardInfo.isPause = false
          currentCard.cardInfo.isRunning = false
          currentCard.cardInfo.isWorking = false
          switch (newDeviceStatus.work_status) {
            case PluginConfig.workStatus.standby:
              currentCard.cardInfo.isRunning = true
              currentCard.cardInfo.isWorking = false
              break
            case PluginConfig.workStatus.working:
              currentCard.cardInfo.isRunning = true
              currentCard.cardInfo.isWorking = true
              break
            case PluginConfig.workStatus.pause:
              currentCard.cardInfo.isRunning = true
              currentCard.cardInfo.isWorking = true
              currentCard.cardInfo.isPause = true
              break
          }
        }
        // 工作模式
        currentCard.cardInfo.statusName = PluginConfig.workModeName[Number(newDeviceStatus.work_mode)] || '待机'
        if (currentCard.cardInfo.isWorking) {
          // 火力
          if (newDeviceStatus.control_mode === '1') {
            currentCard.cardInfo.settingParams.valueText = newDeviceStatus.fire_level + '档'
            if (currentCard.name === '中灶') {
              currentCard.cardInfo.settingParams.valueText = PluginConfig.getPowerNameByFireLevel(
                newDeviceStatus.fire_level
              )
            }
          }
          // 温度
          if (newDeviceStatus.control_mode === '2') {
            currentCard.cardInfo.settingParams.valueText = newDeviceStatus.cur_temperature + '℃'
          }
          // 剩余时间
          let remainWorkTime = Format.formatSeconds(Number(newDeviceStatus.remain_work_time_sec))
          if (remainWorkTime.seconds > 0) {
            remainWorkTime.seconds = 0
            remainWorkTime.minutes++
          }
          if (remainWorkTime.minutes >= 60) {
            remainWorkTime.minutes = 0
            remainWorkTime.hours++
          }
          currentCard.cardInfo.settingParams.workTimeLabel = {
            hours: Format.getTime(remainWorkTime.hours),
            minutes: Format.getTime(remainWorkTime.minutes),
            seconds: Format.getTime(remainWorkTime.seconds),
          }
          // 工作时间
          let setWorkTime = Format.formatSeconds(Number(newDeviceStatus.set_work_time_sec))
          currentCard.cardInfo.settingParams.setWorkTimeLabel =
            (setWorkTime.hours > 0 ? setWorkTime.hours + '小时' : '') +
            (setWorkTime.minutes > 0 ? setWorkTime.minutes + '分' : '')
        }
        // 设置弹框状态同步
        let settingModal = this.data.settingModal
        let stoveDoubleSettingModel = parseComponentModel(this.data.stoveDoubleSettingModel)
        let stoveMiddleSettingModel = parseComponentModel(this.data.stoveMiddleSettingModel)
        if (!settingModal.isShow) {
          let currentStoveOption = stoveDoubleSettingModel.stoveOptions.find((item) => item.id === stoveIndex)
          if (currentStoveOption) {
            currentStoveOption.settingParams.isRunning = currentCard.cardInfo.isRunning
            // 同步设置信息
            currentCard.cardInfo.disabled = currentStoveOption.settingParams.disabled = false
            if (PluginConfig.is113W()) {
              if (currentCard.cardInfo.isPause) {
                currentCard.cardInfo.disabled = currentStoveOption.settingParams.disabled = true
              }
              if (otherCard.cardInfo.isPause) {
                currentCard.cardInfo.disabled = currentStoveOption.settingParams.disabled = true
              }
            }
            if (currentCard.cardInfo.isWorking) {
              currentStoveOption.settingParams.fireLevel = Number(newDeviceStatus.fire_level)
              currentStoveOption.settingParams.workMode = Number(newDeviceStatus.work_mode)
              currentStoveOption.settingParams.setWorkTime = Format.formatSeconds(
                Number(newDeviceStatus.set_work_time_sec)
              )
            }
          }
          if (currentCard.cardInfo.isWorking && currentCard.cardInfo.name === '中灶') {
            stoveMiddleSettingModel.fireLevel = Number(newDeviceStatus.fire_level)
            stoveMiddleSettingModel.workMode = Number(newDeviceStatus.work_mode)
            stoveMiddleSettingModel.setWorkTime = Format.formatSeconds(Number(newDeviceStatus.set_work_time_sec))
          }
        }
        stoveDoubleSettingModel = parseComponentModel(stoveDoubleSettingModel)
        stoveMiddleSettingModel = parseComponentModel(stoveMiddleSettingModel)
        currentCard.cardInfo = parseComponentModel(currentCard.cardInfo)
        if (otherStoveIndex !== stoveIndex) {
          otherCard.cardInfo = parseComponentModel(otherCard.cardInfo)
        }
        this.setData({ stoveCardArr, stoveDoubleSettingModel, stoveMiddleSettingModel })
      }
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
          let stoveCardArr = this.data.stoveCardArr
          if (stoveCardArr.length > 0) {
            stoveCardArr.forEach((item) => {
              this.updateStatus({ stoveIndex: item.id })
            })
          }
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

    // region 显示参数设置对话框
    showSettingModal(options) {
      // 防止用户多次点击选项，事件重复执行
      let settingModal = this.data.settingModal
      settingModal.isInit = true
      settingModal.isShow = true
      if (options) {
        settingModal = Object.assign(settingModal, options)
      }
      this.setData({ settingModal })
    },
    closeSettingModal() {
      let settingModal = this.data.settingModal
      settingModal.isShow = false
      this.setData({ settingModal })
      setTimeout(() => {
        settingModal.isInit = false
        this.setData({ settingModal })
      }, 500)
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
      } while (DO_WHILE_RETURN)
    },
    closeNoticeBar() {
      let noticeBar = this.data.noticeBar
      noticeBar.isShow = false
      this.setData({ noticeBar })
    },
    // endregion

    // endregion
    // region 2021.12.01 之前代码
    updateStatus(options) {
      let stoveIndex = 0
      if (options) {
        stoveIndex = options.stoveIndex || stoveIndex
      }
      return new Promise((resolve) => {
        let deviceInfo = this.data.deviceInfo
        requestService
          .request('luaGet', {
            applianceCode: this.properties.applianceData.applianceCode,
            command: {
              query: {
                query_burner_number: stoveIndex,
                query_type: '1',
              },
            },
            reqId: getStamp().toString(),
            stamp: getStamp(),
          })
          .then((res) => {
            do {
              console.log('获取设备状态')
              console.log(res)
              if (res.data.code != 0) {
                deviceInfo.isOnline = false
                let msg = PluginConfig.handleErrorMsg(res.data.code)
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
                  if (res.code == 1307) {
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
          apptype_name: '双灶电磁炉',
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
      // this.setData({
      //   isInit: true,
      // })
      // this.adjustPage()
      // break
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
        PluginConfig.init({
          applianceCode: this.properties.applianceData.applianceCode,
          sn8: deviceInfo.sn8,
        })
        this.adjustPage()
        this.deviceStatusInterval()
        this.getProductConfig().then(() => {
          this.setData({
            isInit: true,
          })
        })
      })
     
    } while (DO_WHILE_RETURN)
  },
})
