import { CARD_MODE_OPTION } from 'm-miniCommonSDK/index'
const app = getApp() //获取应用实例
const requestService = app.getGlobalConfig().requestService
const rangersBurialPoint = app.getGlobalConfig().rangersBurialPoint
import { getStamp } from 'm-utilsdk/index'
import {
  getModelNameById,
  getTextByStatus,
  getMenuIdByKey,
  menuId,
  RemoteControl,
  modeDesc,
  modeList,
  getTimeRange,
  getWorkTimeById,
  getAppointFinishTime,
  getWorkFinishTime,
  STATUS,
} from './js/EA.js'
import {
  getAppointTimeRange,
  getAppointWorkingText,
  getModeName,
  getWarmTimeText,
  mode2ID,
  targetID2Mode,
  workStatus2Int,
} from './js/EA.js'
import config from '../common/script/config.js'
import { imageDomain, commonApi } from '../common/script/api.js'
import MediaToast from '../component/media-toast/toast.js'
import { UI } from '../common/script/ui.js'
import { Dict } from '../common/script/dict.js'
import { DeviceConfigData } from '../assets/script/device-config-data.js'
import { DeviceModeMap } from '../assets/script/device-mode-map.js'
import { Format } from '../common/script/format.js'
import { DeviceData } from '../assets/script/device-data.js'

let deviceStatusTimer = null
let deviceShutdownTimer = null
let isDebug = config.isDebug
let isLoading = false
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
    pageProductConfig: {},
    // region 定义属性
    nowDate: undefined,
    isInit: false,
    controllerHeight: 500,
    optionsData: [],
    selectedOptionsData: undefined,
    bgImgUrl: {
      bgUrl1: imageDomain + '/0xFB/bg.png?' + config.timestamp,
      bgUrl2: imageDomain + '/0xFB/bg-running.png?' + config.timestamp,
      bgUrl3: imageDomain + '/0xFB/bg-running-move.png?' + config.timestamp,
    },
    scheduleData: {
      value: [0, 0, 0, 0, 0],
      day: [],
      hours: [],
      minutes: [],
    },
    deviceInfo: {
      isOnline: false,
      isRunning: false,
      isSupportRtc: undefined,
      isError: false,
    },
    controllerInfo: {
      deviceStatus: {
        value: {
          hour: 0,
          minute: 0,
          second: 0,
        },
        statusText: '约剩余',
        valueText: '--:--:--',
        workStatusText: '',
        descText: undefined,
      },
      switchBtn: {
        isShow: false,
        label: undefined,
        isDisabled: false,
        isActive: false,
        iconUrl: imageDomain + '/0xFB/icon-switch.png',
        value1: undefined,
        value2: undefined,
        workStatus: undefined,
      },
      scheduleModal: {
        isShow: false,
      },
    },
    // endregion

    // region 定义组件

    // endregion

    // region 2021.08.16 之前的代码
    scrollViewTop: 0,
    buttonSize: '110rpx',
    icons: {
      greyTriangle: 'assets/img/grey-triangle.png',
    },
    modelHidden: ['xiangtianfan', 'zhuzhou', 'baotang'],
    rowClass1: 'row-sb',
    rowClass2: 'row-sb',
    btnShowStatus: false,
    powerImg: {
      on: '/pages/T0xFC/assets/img/icon_switch_on01@3x.png',
      off: '/pages/T0xFC/assets/img/icon_switch_off01@3x.png',
    },
    modeImg: {
      xiangtianfan: {
        disabled: imageDomain + '/0xEA/xiangtianfan-1.png',
        on: imageDomain + '/0xEA/xiangtianfan-2.png',
        off: imageDomain + '/0xEA/xiangtianfan-1.png',
        appoint: imageDomain + '/0xEA/xiangtianfan-2.png',
      },
      zhuzhou: {
        disabled: imageDomain + '/0xEA/zhuzhou-1.png',
        on: imageDomain + '/0xEA/zhuzhou-2.png',
        off: imageDomain + '/0xEA/zhuzhou-1.png',
        appoint: imageDomain + '/0xEA/zhuzhou-2.png',
      },
      baotang: {
        disabled: imageDomain + '/0xEA/baotang-1.png',
        on: imageDomain + '/0xEA/baotang-2.png',
        off: imageDomain + '/0xEA/baotang-1.png',
        appoint: imageDomain + '/0xEA/baotang-2.png',
      },
    },
    circleImg: {
      yellow: imageDomain + '/0xEA/circle-yellow.png',
      red: imageDomain + '/0xEA/circle-red.png',
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
    xiangtianfan: {},
    zhuzhou: {},
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
    multiArray: [['今天', '明天'], ['1'], ['时'], ['2'], ['分']],
    multiIndex: [0, 0, 0, 0, 0, 0],
    todayHours: [],
    tomorrowHours: [],
    todayFirstMinutes: [],
    tomorrowLastMinutes: [],
    normalMinutes: [],
    showDialog: false,
    headerImg: imageDomain + '/0xEA/blender.png',
    // endregion
  },
  methods: {
    // region 2021.08.16 Ao
    // region 获取产品配置
    getProductConfig(bigVer) {
      return new Promise((resolve, reject) => {
        let data = this.data
        let deviceInfo = data.deviceInfo
        deviceInfo.modelNumber = Number(deviceInfo.modelNumber)
        let productModelNumber = deviceInfo.modelNumber != 0 ? DeviceData.getAO(deviceInfo.modelNumber) : deviceInfo.sn8
        let method = 'GET'
        let sendParams = {
          applianceId: deviceInfo.applianceCode,
          productTypeCode: deviceInfo.type,
          userId: data.uid,
          productModelNumber: deviceInfo.sn8 || productModelNumber,
          bigVer: bigVer || 5,
          platform: 2, // 获取美居/小程序功能，2-小程序
        }
        // let isDebug = false;
        // if(!isDebug){
        //     sendParams = {
        //         serviceName:"quick-development-service",
        //         uri: "frontend/productConfig"+Format.jsonToParam(sendParams),
        //         method:"GET",
        //         contentType:"application/json",
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
            // 设置页面功能
            console.log(res)
            let resData = null
            resData = JSON.parse(res.data.result.returnData)
            console.log(resData)
            do {
              if (!resData && !bigVer) {
                // 再次获取快开配置
                this.getProductConfig(6).then((res) => {
                  resolve()
                })
                break
              }
              if (res.data.errorCode == 1306) {
                MediaToast('设备无响应')
                break
              }
              if (res.data.errorCode != 0) {
                MediaToast('系统提示: ' + res.code)
                break
              }
              let functions = resData.functions
              deviceInfo.isSupportRtc = resData.supportRtc
              // 获取预约功能
              let options = []
              if (functions && functions.length > 0) {
                functions.forEach((functionItem) => {
                  let defaultIcon1 =
                    'https://ce-cdn.midea.com/quick_dev/function/cf8c7ceb-3897-4f2f-8e3a-c6b42fe2a37e.png'
                  let defaultIcon2 =
                    'https://ce-cdn.midea.com/quick_dev/function/69703637-0d4e-43f9-a6eb-abe1d1889ef0.png'
                  options.push({
                    code: functionItem.code,
                    mode: DeviceModeMap.get(functionItem.code),
                    label: functionItem.name,
                    iconUrl1: functionItem.appletsIconUrl1 || defaultIcon1,
                    iconUrl2: functionItem.appletsIconUrl2 || defaultIcon2,
                  })
                  let settings = functionItem.settings
                  if (settings && settings.length > 0) {
                    for (let i = 0; i < settings.length; i++) {
                      let settingItem = settings[i]
                      if (settingItem.apiKey.match('appointTime')) {
                        if (settingItem.properties) {
                          // 设置预约时间范围,加入选项中
                          options[options.length - 1].min = Number(settingItem.properties.min)
                          options[options.length - 1].max = Number(settingItem.properties.max)
                          // options.push({
                          //     code: functionItem.code,
                          //     mode: DeviceModeMap.get(functionItem.code),
                          //     label: functionItem.name,
                          //     iconUrl1: functionItem.appletsIconUrl1||defaultIcon1,
                          //     iconUrl2: functionItem.appletsIconUrl2||defaultIcon2,
                          //     defaultValue: Number(settingItem.properties.defaultValue),
                          //     min: Number(settingItem.properties.min),
                          //     max: Number(settingItem.properties.max)
                          // });
                        } else {
                          console.warn('invalid appointTime: ' + settingItem)
                        }
                      }
                    }
                  }
                })
                let optionsData = options
                this.setData({
                  optionsData,
                  pageProductConfig: resData,
                })
              }
            } while (false)
            if (resData) {
              resolve()
            }
          })
          .catch((err) => {
            console.error('获取产品配置')
            console.error(err)
            let res = err.data
            do {
              if (res) {
                UI.alertResMsg({
                  title: '获取产品配置',
                  res: res,
                })
                break
              }
              MediaToast('未知错误')
            } while (false)
            reject()
          })
      })
    },
    // endregion
    // region 数据初始化
    dataInit(newDeviceStatus, extended = null) {
      let data = this.data
      let deviceInfo = data.deviceInfo
      let controllerInfo = data.controllerInfo
      let optionsData = data.optionsData
      if (deviceInfo.onlineStatus == Dict.onlineStatus.online) {
        deviceInfo.isOnline = true
      } else {
        deviceInfo.isOnline = false
      }
      console.log('设备状态11111')
      // console.log(deviceInfo);
      console.log(newDeviceStatus)
      if (newDeviceStatus) {
        // 工作状态
        let workStatus = newDeviceStatus.work_status
        deviceInfo.workStatus = workStatus
        let currentMode = 0
        controllerInfo.switchBtn.value1 = '--'
        if (newDeviceStatus.mode) {
          let selectWorkModeLabel = ''
          optionsData.forEach((optionsItem) => {
            if (
              optionsItem.mode === newDeviceStatus.mode ||
              Number(optionsItem.code) === Number(newDeviceStatus.mode)
            ) {
              currentMode = optionsItem.code
              selectWorkModeLabel = controllerInfo.switchBtn.value1 = optionsItem.label
            }
          })
          if (!selectWorkModeLabel) {
            // DIY是‘diy’，云食谱是数字
            if (!Number(newDeviceStatus.mode)) {
              controllerInfo.switchBtn.value1 = newDeviceStatus.mode.toUpperCase()
            } else {
              controllerInfo.switchBtn.value1 = '云食谱'
            }
          }
          if (extended && extended.name) {
            controllerInfo.switchBtn.value1 = extended.name
          }
        }
        // 是否显示时间
        deviceInfo.showTime = newDeviceStatus.show_time
        // 预计工作时间
        let initWorkTimeHour = newDeviceStatus.init_work_time_hour
        let initWorkTimeMin = newDeviceStatus.init_work_time_min
        if (initWorkTimeHour !== 0 || initWorkTimeMin !== 0) {
          controllerInfo.deviceStatus.descText = '约' + (initWorkTimeHour * 60 + initWorkTimeMin) + '分钟'
        }
        // 配置工作时间
        let pageProductConfig = this.data.pageProductConfig
        let properties = pageProductConfig.properties
        if (properties && properties.length > 0) {
          let defaultWorkTimeTableSetting = properties.find(
            (propertiesItem) =>
              propertiesItem.settings[0] && propertiesItem.settings[0].apiKey === 'defaultWorkTimeTable'
          )
          if (defaultWorkTimeTableSetting) {
            defaultWorkTimeTableSetting = defaultWorkTimeTableSetting.settings[0]
            let defaultWorkTimeTableArr = defaultWorkTimeTableSetting.properties.item
            if (currentMode) {
              let currentModeWorkTime = defaultWorkTimeTableArr.filter(
                (item) => Number(item.modeID) === Number(currentMode)
              )
              if (currentModeWorkTime && currentModeWorkTime.length > 0) {
                let currentWorkTime = 0
                let targetMouthfeel = DeviceData.profileConvertData.mouthfeel.find(
                  (item) => item.string === newDeviceStatus.mouthfeel
                )
                currentModeWorkTime.forEach((workTimeItem) => {
                  if (targetMouthfeel && Number(workTimeItem.mouthFeel) === targetMouthfeel.number) {
                    currentWorkTime = Number(workTimeItem.workTime)
                  }
                })
                if (!currentWorkTime) {
                  currentWorkTime = Number(currentModeWorkTime[0].workTime)
                }
                controllerInfo.deviceStatus.descText = '约' + currentWorkTime + '分钟'
              }
              // console.log('当前工作时间: ',currentModeWorkTime);
            }
            // console.log('默认工作时间: ',defaultWorkTimeTableArr);
          }
        }
        if (workStatus) {
          switch (workStatus) {
            case DeviceConfigData.workStatus.cooking:
            case DeviceConfigData.workStatus.awakening_rice:
              controllerInfo.switchBtn.isShow = deviceInfo.isRunning = true
              controllerInfo.switchBtn.value2 =
                workStatus === DeviceConfigData.workStatus.awakening_rice ? '醒米中' : '烹饪中'
              controllerInfo.deviceStatus.statusText = deviceInfo.showTime ? '约剩余' : '剩余时间计算中'
              // 剩余工作时间
              let leftTimeHour = newDeviceStatus.left_time_hour
              let leftTimeMin = newDeviceStatus.left_time_min
              if (leftTimeHour !== 0 || leftTimeMin !== 0) {
                controllerInfo.deviceStatus.value.hour = leftTimeHour
                controllerInfo.deviceStatus.value.minute = leftTimeMin
                controllerInfo.deviceStatus.valueText = Format.getTime(leftTimeHour) + ':' + Format.getTime(leftTimeMin)
              }
              break
            case DeviceConfigData.workStatus.schedule:
              // 预约中
              deviceInfo.showTime = true
              controllerInfo.switchBtn.isShow = deviceInfo.isRunning = true
              controllerInfo.switchBtn.value2 = '预约中'
              controllerInfo.deviceStatus.statusText = '预约中'
              let orderTimeHour = newDeviceStatus.order_time_hour
              let orderTimeMin = newDeviceStatus.order_time_min
              let nowDate = new Date()
              if (!deviceInfo.isSupportRtc && (orderTimeHour !== 0 || orderTimeMin !== 0)) {
                let day = '今天'
                let targetInterval = (orderTimeHour * 60 + orderTimeMin) * 60 * 1000
                let targetDateTimestamp = nowDate.getTime() + targetInterval
                let targetDate = new Date(targetDateTimestamp)
                if (nowDate.getDate() !== targetDate.getDate()) {
                  day = '明天'
                }
                controllerInfo.deviceStatus.value.hour = targetDate.getHours()
                controllerInfo.deviceStatus.value.minute = targetDate.getMinutes()
                controllerInfo.deviceStatus.valueText =
                  day + Format.getTime(targetDate.getHours()) + ':' + Format.getTime(targetDate.getMinutes()) + '完成'
              } else if (deviceInfo.isSupportRtc) {
                let day = '今天'
                if (orderTimeHour > nowDate.getHours()) {
                  day = '今天'
                } else if (orderTimeHour < nowDate.getHours()) {
                  day = '明天'
                } else {
                  day = orderTimeMin > nowDate.getMinutes() ? '今天' : '明天'
                }
                controllerInfo.deviceStatus.valueText =
                  day + Format.getTime(orderTimeHour) + ':' + Format.getTime(orderTimeMin) + '完成'
              }
              break
            case DeviceConfigData.workStatus.keepWarm:
              // 保温中
              controllerInfo.switchBtn.isShow = deviceInfo.isRunning = true
              controllerInfo.deviceStatus.statusText = '已保温'
              controllerInfo.deviceStatus.valueText =
                Format.getTime(newDeviceStatus.warm_time_hour) + ':' + Format.getTime(newDeviceStatus.warm_time_min)
              controllerInfo.deviceStatus.descText = undefined
              controllerInfo.switchBtn.value2 = '保温中'
              break
            case DeviceConfigData.workStatus.cancel:
              // 待机中
              controllerInfo.switchBtn.isShow = deviceInfo.isRunning = false
              break
            default:
              deviceInfo.isRunning = true
              controllerInfo.deviceStatus.statusText = undefined
              controllerInfo.deviceStatus.workStatusText = '工作中'
              break
          }
          if (newDeviceStatus.error_code > 0) {
            deviceInfo.isError = true
            controllerInfo.deviceStatus.workStatusText = '故障中'
          } else {
            deviceInfo.isError = false
            controllerInfo.deviceStatus.workStatusText = '待机中'
          }
        }
      }
      this.setData({
        deviceInfo,
        controllerInfo,
      })
    },
    updateStatus() {
      let deviceInfo = this.data.deviceInfo
      return new Promise(async (resolve, reject) => {
        let params = {
          applianceCode: deviceInfo.applianceCode,
          applianceType: deviceInfo.type,
          modelNo: deviceInfo.sn8,
        }
        let res = await RemoteControl.getStatus(params)
        let returnData = JSON.parse(res.data.result.returnData)
        if (returnData.code !== 0) {
          reject(returnData)
        } else {
          this.setData({
            _applianceData: {
              onlineStatus: 1,
              offlineFlag: false,
            },
          })
          // 此处判断一下工作状态的变化
          let result = this.isModeChange(this.data._applianceDataStatus, returnData.data.status)
          // 设置页面属性
          let isEmpetyExtend = true
          if (returnData.data.extended && returnData.data.extended.name) {
            isEmpetyExtend = false
          }
          if (isEmpetyExtend) {
            this.dataInit(returnData.data.status)
          } else {
            this.dataInit(returnData.data.status, returnData.data.extended)
          }
          if (result == true) {
            this.triggerEvent('modeChange', this.getCurrentMode()) //向上层通知mode更改
          }
          resolve(returnData.data.status)
        }
      }).then(
        (res) => {
          return res
        },
        (err) => {
          if (err && err.code == 3123) {
            if (!this.data.isInit) {
              MediaToast('设备已离线，请检查网络状态')
            }
            this.setData({
              _applianceData: {
                onlineStatus: 0,
                offlineFlag: true,
              },
            })
          } else if (err && err.code == 3138) {
            MediaToast('设备未响应，请稍后尝试刷新')
          } else {
            MediaToast(err.msg)
          }
          this.dataInit()
          console.error(err)
          this.triggerEvent('modeChange', this.getCurrentMode()) //向上层通知mode更改
          // throw err
        }
      )
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
    // region 结束功能
    stopFunction() {
      do {
        if (isLoading) {
          break
        }
        let deviceInfo = this.data.deviceInfo
        let text = ''
        switch (deviceInfo.workStatus) {
          case DeviceConfigData.workStatus.keepWarm:
          case DeviceConfigData.workStatus.cooking:
            // 工作中
            text = '美味仍未完成\r\n是否结束设备工作'
            break
          case DeviceConfigData.workStatus.schedule:
            // 预约中
            text = '是否结束当前预约'
            break
          default:
            text = '是否结束当前任务'
            break
        }
        wx.showModal({
          title: text,
          content: '',
          success: (res) => {
            if (res.confirm) {
              isLoading = true
              UI.showLoading('取消中')
              this.clearDeviceStatusInterval()
              this.requestControl({
                control: {
                  mode: '0',
                  work_status: 'cancel',
                },
              })
                .then((res) => {
                  isLoading = false
                  UI.hideLoading()
                  this.dataInit(res.data.data.status)
                  this.deviceStatusInterval()
                })
                .catch((err) => {
                  isLoading = false
                  UI.hideLoading()
                  this.deviceStatusInterval()
                })
            }
          },
        })
      } while (false)
    },
    // endregion
    // region 启动功能
    startFunction(selectedOption, isAppoint) {
      return new Promise((resolve, reject) => {
        do {
          if (isLoading) {
            break
          }
          if (selectedOption) {
            let controlParams = {
              mode: DeviceModeMap.get(selectedOption.code) || selectedOption.code,
              work_status: DeviceConfigData.workStatus.cooking,
            }
            let sn8 = this.data.deviceInfo.sn8
            let isMB_DHZ4001XM = sn8 === '00000028'
            let isMB_DHZ4002XM = sn8 === '0000002A'
            let isMB_CFB3081H = sn8 === '610015DL'
            let isMB_HS4006pro = sn8 === '61000194'
            let isMB_HZ4005pro = sn8 === '61001456'
            let menuType = 'normal'
            if ((isMB_DHZ4001XM || isMB_DHZ4002XM) && controlParams.mode == 'low_sugar_rice') {
              controlParams.mode = 'lessSugar'
              menuType = 'lessSugarRice'
            }
            if ((isMB_HZ4005pro || isMB_HS4006pro) && controlParams.mode == 'low_sugar_rice') {
              controlParams.city = '佛山市'
              controlParams.province = '广东省'
              controlParams.cityId = '101280800'
              controlParams.inDoorTemp = '25'
              menuType = 'lessSugarRice'
              controlParams.riceWeight = 2
              controlParams.cook_rice_weight = 2
              controlParams.rice_type = 'northeast'
            }
            if (isMB_CFB3081H && controlParams.mode == 'low_sugar_rice') {
              controlParams.mode = 'lessSugar'
              menuType = 'lessSugarRice'
            }
            if (isAppoint) {
              // 预约功能则设置预约时间
              controlParams.order_time_hour = selectedOption.hours
              controlParams.order_time_min = Math.ceil(selectedOption.minutes)
              controlParams.work_status = DeviceConfigData.workStatus.schedule
            }
            UI.showLoading('启动中')
            isLoading = true
            this.clearDeviceStatusInterval()
            if (selectedOption.code === 71) {
              RemoteControl.work({
                controlParams: controlParams,
                applianceId: this.data.deviceInfo.applianceCode,
                applianceType: this.data.deviceInfo.type,
                modelNo: sn8,
                menuType: menuType,
              })
                .then((res) => {
                  isLoading = false
                  UI.hideLoading()
                  let result = JSON.parse(res.data.result.returnData)
                  console.log('启动成功，返回的数据:', result)
                  this.dataInit(result.data.status, result.data.extended)
                  this.deviceStatusInterval()
                  if (result.data.status.error_code !== 0 && result.data.status.work_status === 'cancel') {
                    wx.showToast({
                      title: '启动失败，设备异常：' + result.data.status.error_code,
                      icon: 'none',
                    })
                  }
                  resolve()
                })
                .catch((err) => {
                  isLoading = false
                  UI.hideLoading()
                  resolve()
                })
            } else {
              this.requestControl({
                control: controlParams,
              })
                .then((res) => {
                  isLoading = false
                  UI.hideLoading()
                  this.dataInit(res.data.data.status)
                  this.deviceStatusInterval()
                  if (res.data.data.status.error_code !== 0 && res.data.data.status.work_status === 'cancel') {
                    wx.showToast({
                      title: '启动失败，设备异常：' + res.data.data.status.error_code,
                      icon: 'none',
                    })
                  }
                  resolve()
                })
                .catch((err) => {
                  isLoading = false
                  UI.hideLoading()
                  resolve()
                })
            }

            break
          }
          console.warn('启动功能错误: invalid selectedOption')
        } while (false)
      })
    },
    // endregion
    // region 获取picker数值
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
            // minHours++
            startMin = nowMin + minMinutes - 60
          }
          // 选择了今天
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
        console.log(scheduleData)
        scheduleData.hours = hours
        scheduleData.minutes = minutes
        scheduleData.value = val
        this.setData({ scheduleData })
      }
    },
    // endregion
    // region 确认预约时间
    confirmSchedule() {
      do {
        let scheduleData = this.data.scheduleData
        if (scheduleData.isSelecting) {
          break
        }
        let value = scheduleData.value

        let selectedOptionsData = this.data.selectedOptionsData
        let deviceInfo = this.data.deviceInfo
        let day = value[1]
        let hour = scheduleData.hours[value[2]]
        let minute = scheduleData.minutes[value[3]]
        // 判断RTC类型，计算完成时间
        if (deviceInfo.isSupportRtc) {
          // 时钟类型,不作处理
        } else {
          // 非时钟类型，计算间隔时间
          let nowDate = new Date()
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
        selectedOptionsData.hours = hour
        selectedOptionsData.minutes = minute
        this.startFunction(selectedOptionsData, true).then(() => {
          this.closeScheduleModal()
        })
      } while (false)
    },
    // endregion
    // region 显示预约对话框
    showScheduleModal(selectedOptionsData) {
      let controllerInfo = this.data.controllerInfo
      let scheduleData = {
        value: [0, 0, 0, 0, 0],
        day: [],
        hours: [],
        minutes: [],
      }
      let hours = []
      let minutes = []
      let minHours = Math.floor(selectedOptionsData.min / 60)
      let minMinutes = selectedOptionsData.min % 60

      let maxHours = 1440
      let maxQuickDevHours = Math.floor(selectedOptionsData.max / 60)
      let maxQuickDevMinutes = selectedOptionsData.max % 60
      let maxMinutes = 60
      // 获取当前时间
      let nowDate = new Date()
      // 设置小时数据
      let nowHour = nowDate.getHours()
      let nowMin = nowDate.getMinutes()
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
      scheduleData.maxQuickDevHours = maxQuickDevHours
      scheduleData.maxQuickDevMinutes = maxQuickDevMinutes
      scheduleData.maxMinutes = maxMinutes
      console.log('scheduleData:', scheduleData)
      controllerInfo.scheduleModal.isShow = true
      this.setData({ controllerInfo, scheduleData, nowDate })
    },
    closeScheduleModal() {
      let controllerInfo = this.data.controllerInfo
      controllerInfo.scheduleModal.isShow = false
      this.setData({ controllerInfo })
    },
    // endregion
    // region 显示工作选项
    showRunningMenuModal(event) {
      do {
        let deviceInfo = this.data.deviceInfo
        let selectedOptionsData = event.currentTarget.dataset.value
        console.log(selectedOptionsData)
        if (!isDebug) {
          if (!deviceInfo.isOnline) {
            MediaToast('设备已离线，请检查网络状态')
            break
          }
          if (deviceInfo.isRunning) {
            MediaToast('设备工作中\r\n无法重复启动功能')
            break
          }
          if (deviceInfo.isError) {
            MediaToast('设备故障中')
            break
          }
        }
        this.setData({ selectedOptionsData })
        let itemList = ['启动']
        let hasSchedule = typeof selectedOptionsData.min === 'number' && typeof selectedOptionsData.max === 'number'
        if (hasSchedule) {
          itemList.push('预约')
        }
        if (selectedOptionsData.code === 71) {
          let that = this
          wx.showModal({
            title: '您是否已有沥糖釜',
            cancelText: '否',
            confirmText: '是',
            success(res) {
              if (res.confirm) {
                wx.showActionSheet({
                  itemList: itemList,
                  success: (res) => {
                    let index = res.tapIndex
                    switch (index) {
                      case 0:
                        // 启动
                        that.startFunction(selectedOptionsData)
                        break
                      case 1:
                        // 预约
                        that.showScheduleModal(selectedOptionsData)
                        break
                      default:
                        MediaToast('未定义选项')
                        break
                    }
                  },
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            },
          })
        } else {
          wx.showActionSheet({
            itemList: itemList,
            success: (res) => {
              let index = res.tapIndex
              switch (index) {
                case 0:
                  // 启动
                  this.startFunction(selectedOptionsData)
                  break
                case 1:
                  // 预约
                  this.showScheduleModal(selectedOptionsData)
                  break
                default:
                  MediaToast('未定义选项')
                  break
              }
            },
          })
        }
      } while (false)
    },
    // endregion
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
    getDestoried() {
      //执行当前页面前后插件的业务逻辑，主要用于一些清除工作
      if (deviceStatusTimer) {
        clearInterval(deviceStatusTimer)
      }
      // 数据初始化
      deviceStatusTimer = null
      deviceShutdownTimer = null
      isDebug = config.isDebug
      isLoading = false
    },
    isModeChange(oldVal, newVal) {
      return oldVal.work_status != newVal.work_status ? true : false
    },
    getCurrentMode() {
      let mode
      if (this.data._applianceData.onlineStatus == 0) {
        mode = CARD_MODE_OPTION.OFFLINE
      } else {
        if (this.data._applianceDataStatus.work_status == '2') {
          mode = CARD_MODE_OPTION.BOIL
        } else {
          mode = CARD_MODE_OPTION.HEAT
        }
      }
      return {
        applianceCode: this.data.applianceData.applianceCode,
        mode,
      }
    },
    // 埋点
    rangersBurialPointClick(eventName, param) {
      let deviceInfo = this.data.deviceInfo
      if (deviceInfo) {
        let paramBurial = {}
        let paramBase = {
          module: '插件',
          apptype_name: '电饭煲',
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
      // 获取设备高度
      wx.getSystemInfo({
        success: (res) => {
          // 设置功能区域高度
          let headerHeight = res.statusBarHeight + 40
          let factor = res.screenWidth / 750
          let mainHeight = 500 * factor
          let marginHeight = 40 * factor
          let switchHeight = 200
          let controllerHeight = res.screenHeight - headerHeight - mainHeight - marginHeight - switchHeight - 50
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
      wx.nextTick(async () => {
        do {
          if (isDebug) {
            this.setData({
              isInit: true,
            })
            break
          }
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
          // 数据初始化
          UI.showLoading()
          this.getProductConfig()
            .then(() => {
              let complete = () => {
                UI.hideLoading()
                let pages = getCurrentPages()
                let currentPage = pages[pages.length - 1]
                currentPage.setData({
                  isShowCard: true,
                })
                this.setData({
                  isInit: true,
                })
              }
              this.updateStatus()
                .then(() => {
                  complete()
                  this.deviceStatusInterval()
                })
                .catch((err) => {
                  complete()
                })
            })
            .catch((err) => {
              UI.hideLoading()
            })
        } while (false)
      })
    } while (false)
  },
})
