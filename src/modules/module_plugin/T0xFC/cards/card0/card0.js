const app = getApp() //获取应用实例
const requestService = app.getGlobalConfig().requestService
const rangersBurialPoint = app.getGlobalConfig().rangersBurialPoint
import { getStamp } from 'm-utilsdk/index'
import { FC } from './js/FC'
import { imageDomain, commonApi } from '../../assets/scripts/api'
import { DeviceData } from '../../assets/scripts/device-data'
import { formatTimer, goToWebView, parseComponentModel } from '../../assets/scripts/common'
import { Format } from '../../assets/scripts/format'
import { UI } from '../../assets/scripts/ui'
import quickDev from '../../assets/scripts/quickDev'
import MideaToast from '../../component/midea-toast/toast'

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
    // region 2021.08.26 敖广骏
    // 定义属性
    isInit: false,
    noticeBar: {
      isShow: false,
      content: '内容',
    },
    controllerHeight: 500,
    themeStyle: 'wait',
    themeColor: DeviceData.themeColor,
    configList: [],
    propertiesData: {},
    deviceInfo: {
      isOnline: false,
      isRunning: false,
      lock: undefined,
    },
    deviceErrCode: undefined,
    statusDeepFilterPercent: 100,
    statusDeepFilterIsShow: false,
    cardNormalHeight: '120',
    bgImage: {
      url1: imageDomain + '/0xFB/bg.png',
      url2: imageDomain + '/0xFB/bg-running.png',
      url3: imageDomain + '/0xFC/bg-excellent-move.png',
    },
    iconUrl: {
      arrow: {
        url1: imageDomain + '/0xE7/icon-arrow-r.png',
      },
      power: {
        url1: imageDomain + '/0xFB/icon-switch.png',
      },
      mode: FC.getModeIcon('manual'),
      noneMode: imageDomain + '/0xFC/icon-none-mode.png',
      clock: {
        url1: imageDomain + '/0xFB/icon-clock.png',
      },
      gear: {
        url1: imageDomain + '/0xFC/icon-wind-speed.png',
      },
      anion: {
        url1: imageDomain + '/0xFC/icon-anion.png',
      },
      childLock: {
        url1: imageDomain + '/0xFB/icon-lock.png',
      },
      hosting: {
        url1: imageDomain + '/0xFC/icon-hosting.png',
      },
      brightLed: {
        url1: imageDomain + '/0xFC/icon-bright-led.png',
      },
      humidify: {
        url1: imageDomain + '/0xFC/icon-humidify.png',
      },
      lightColor: {
        url1: imageDomain + '/0xFC/icon-light-color.png',
      },
      waterions: {
        url1: imageDomain + '/0xFC/icon-waterions.png',
      },
      voiceOnOff: {
        url1: imageDomain + '/0xFC/icon-voiceOnOff.png',
      },
      filter: {
        url1: imageDomain + '/0xFC/icon_genghuanlvwang.png',
        url2: imageDomain + '/0xFC/icon-filter.png',
      },
      backImgBase: imageDomain + '/0xFC/icon_youjiantou.png',
    },
    isShowBottom: false,
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
    timedShutdownPicker: {
      selectedValue: [0],
      columns: [],
    },
    // 定义控件
    // 开关按钮
    powerBtn: parseComponentModel({
      leftWrapper: {
        text: {
          content: '开机',
        },
      },
    }),
    // 模式按钮
    modeBtn: parseComponentModel({
      rightWrapper: {
        text: {
          content: '模式',
        },
      },
    }),
    hostingBtn: parseComponentModel({
      rightWrapper: {
        text: {
          content: '模式',
        },
      },
    }),
    // 定时按钮
    scheduleBtn: parseComponentModel({
      rightWrapper: {
        text: {
          content: '定时',
        },
      },
    }),
    // 档位控制滑块
    gearSlider: parseComponentModel({
      min: 1,
      max: 10,
      interval: 3,
      unit: '档',
      currentValue: 1,
      color: DeviceData.themeColor['wait'],
    }),
    // 负离子开关
    anionSwitch: parseComponentModel({
      isActive: true,
      selected: true,
      disabled: true,
      color: DeviceData.themeColor['wait'],
    }),
    // 智能托管开关
    hostingOnOffSwitch: parseComponentModel({
      isActive: true,
      selected: true,
      disabled: true,
      color: DeviceData.themeColor['wait'],
    }),
    // 净离子开关
    waterionsSwitch: parseComponentModel({
      isActive: true,
      selected: true,
      disabled: true,
      color: DeviceData.themeColor['wait'],
    }),
    // 声音开关
    voiceOnOffSwitch: parseComponentModel({
      isActive: true,
      selected: true,
      disabled: true,
      color: DeviceData.themeColor['wait'],
    }),
    // 童锁开关
    childLockSwitch: parseComponentModel({
      isActive: true,
      selected: true,
      disabled: true,
      color: DeviceData.themeColor['wait'],
    }),
    // endregion

    // region 2021.08.26 之前代码
    scrollViewTop: 0,
    icons: {
      greyTriangle: imageDomain + '/0xFC/grey-triangle.png',
      btnTriangle: {
        on_show: imageDomain + '/0xFC/img_blue-check@3x.png',
        on_hide: imageDomain + '/0xFC/img_icon@3x.png',
        off: imageDomain + '/0xFC/img_gray-unchecked@3x.png',
      },
    },
    powerImg: {
      on: imageDomain + '/0xFC/icon_switch_on01@3x.png',
      off: imageDomain + '/0xFC/icon_switch_off01@3x.png',
    },
    modeImg: {
      auto: {
        disabled: imageDomain + '/0xFC/icon_air-conditioner_auto01@3x.png',
        on: imageDomain + '/0xFC/icon_air-conditioner_auto02@3x.png',
        off: imageDomain + '/0xFC/icon_air-conditioner_auto03@3x.png',
      },
      sleep: {
        disabled: imageDomain + '/0xFC/icon_air-conditioner_sleep01@3x.png',
        on: imageDomain + '/0xFC/icon_air-conditioner_sleep02@3x.png',
        off: imageDomain + '/0xFC/icon_air-conditioner_sleep03@3x.png',
      },
      manual: {
        disabled: imageDomain + '/0xFC/icon_air-conditioner_manual01@3x.png',
        on: imageDomain + '/0xFC/icon_air-conditioner_manual02@3x.png',
        off: imageDomain + '/0xFC/icon_air-conditioner_manual03@3x.png',
      },
    },
    circleImg: {
      on: imageDomain + '/0xFC/img_air-cleaner_circle01@3x.png',
      off: imageDomain + '/0xFC/img_air-cleaner_circle04@3x.png',
    },
    _applianceData: {
      name: '',
      roomName: '',
      onlineStatus: 0,
    },
    _applianceDataStatus: {
      power: 'on',
      wind_speed: '101',
      mode: 'manual',
      pm25: '0',
    },
    text: 'PM 2.5',
    showText: false,
    circleSrc: '',
    power: {},
    auto: {},
    sleep: {},
    manual: {},
    showManualItems: false,
    showOfflineCard: false,
    headerImg: imageDomain + '/0xFC/img_air-cleaner@3x.png',
    // 关机时 智能托管是否可用
    hostWhenOffDisable: false,
    // endregion
  },
  methods: {
    // region 2022.06.09 Ao
    /**
     * 跳转到商城小程序（首页）
     */
    // endregion
    // region 2021.08.27 敖广骏
    noop() {},
    // region 轮询获取设备状态
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
    // endregion
    // 改变档位(风速)数值
    changeGearValue(event) {
      let gearModel = event.detail
      gearModel.currentValue = Math.floor(gearModel.currentValue)
      this.setData({
        gearSlider: parseComponentModel(gearModel),
      })
      this.selectGear(gearModel.currentValue)
    },
    // 关闭模式对话框
    closeModeModal() {
      let pageComponentVisible = this.data.pageComponentVisible
      pageComponentVisible.isShowSelectMode = false
      this.setData({ pageComponentVisible })
    },
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
    confirmScheduleTime() {
      UI.showLoading()
      setTimeout(() => {
        let deviceInfo = this.data.deviceInfo
        let timedShutdownPicker = this.data.timedShutdownPicker
        let selectedIndex = timedShutdownPicker.selectedValue[0]
        let selectedItem = timedShutdownPicker.columns[selectedIndex]
        let selectedValue = selectedItem.value
        // 选择的是小时
        selectedValue = selectedValue * 60
        let controlParams = {}
        if (deviceInfo.isRunning) {
          // 定时关
          controlParams.power_off_timer = 'on'
          controlParams.time = selectedValue - 1
        } else {
          // 定时开
          controlParams.power_on_timer = 'on'
          controlParams.time_on = selectedValue - 1
        }
        this.clearDeviceStatusInterval()
        this.requestControl({
          control: controlParams,
        })
          .then((res) => {
            UI.hideLoading()
            this.dataInit(res.data.data.status)
            this.deviceStatusInterval()
            this.closeTimingModal()
          })
          .catch((err) => {
            UI.hideLoading()
            this.deviceStatusInterval()
          })
      }, 500)
    },
    // 删除定时
    deleteScheduleTime(noLoading) {
      let data = this.data
      let deviceInfo = data.deviceInfo
      let controlParams = {}
      // if(deviceInfo.isRunning){
      //     // 定时关
      //     controlParams.power_off_timer = 'off';
      // } else {
      //     // 定时开
      //     controlParams.power_on_timer = 'off';
      // }
      controlParams.power_on_timer = 'off'
      controlParams.power_off_timer = 'off'
      if (noLoading !== true) {
        UI.showLoading()
      }
      this.clearDeviceStatusInterval()
      this.requestControl({
        control: controlParams,
      })
        .then((res) => {
          if (noLoading !== true) {
            UI.hideLoading()
          }
          this.dataInit(res.data.data.status)
          this.deviceStatusInterval()
          this.closeTimingModal()
        })
        .catch((err) => {
          if (noLoading !== true) {
            UI.hideLoading()
          }
          this.deviceStatusInterval()
        })
    },

    // 获取产品配置
    getProductConfig() {
      return new Promise((resolve, reject) => {
        let data = this.data
        let deviceInfo = data.deviceInfo
        let hostWhenOffDisable = data.hostWhenOffDisable
        let timedShutdownPicker = data.timedShutdownPicker
        let iconUrl = data.iconUrl
        let anionSwitch = parseComponentModel(data.anionSwitch)
        let hostingOnOffSwitch = parseComponentModel(data.hostingOnOffSwitch)
        let waterionsSwitch = parseComponentModel(data.waterionsSwitch)
        let voiceOnOffSwitch = parseComponentModel(data.voiceOnOffSwitch)
        let childLockSwitch = parseComponentModel(data.childLockSwitch)
        let modeBtn = parseComponentModel(data.modeBtn)
        if (deviceInfo.onlineStatus == DeviceData.onlineStatus.online) {
          deviceInfo.isOnline = true
        } else {
          deviceInfo.isOnline = false
          MideaToast('设备已离线，请检查网络状态')
        }
        modeBtn.disabled = !deviceInfo.isOnline
        anionSwitch.disabled = !deviceInfo.isOnline
        waterionsSwitch.disabled = !deviceInfo.isOnline
        voiceOnOffSwitch.disabled = !deviceInfo.isOnline
        // hostingOnOffSwitch.disabled = !deviceInfo.isOnline
        childLockSwitch.disabled = !deviceInfo.isOnline
        anionSwitch = parseComponentModel(anionSwitch)
        hostingOnOffSwitch = parseComponentModel(hostingOnOffSwitch)

        voiceOnOffSwitch = parseComponentModel(voiceOnOffSwitch)
        waterionsSwitch = parseComponentModel(waterionsSwitch)
        childLockSwitch = parseComponentModel(childLockSwitch)
        this.setData({ deviceInfo, anionSwitch, childLockSwitch })
        let configList = data.configList
        let propertiesData = data.propertiesData
        let bindModeGearConfig = data.bindModeGearConfig
        let bindBrightLedConfig = data.bindBrightLedConfig
        let bindHumidifyConfig = data.bindHumidifyConfig
        let bindLightColorConfig = data.bindLightColorConfig
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
          .then((res) => {
            console.log('获取产品配置')
            console.log(deviceInfo)
            console.log(res)
            // 设置页面功能
            let resData = null
            resData = JSON.parse(res.data.result.returnData)
            // resData = res.data;
            console.log(resData)
            do {
              if (res.data.errorCode == 50300 || res.code == 1001) {
                // 无资源重定向
                // FC.redirectUnSupportDevice(this.properties.applianceData);
                // break;
                resData = {
                  version: '1.99',
                  productName: 'KJ800G-H Pro',
                  productModelNumber: '571Z306H',
                  productImageUrl: '',
                  productTypeCode: '0xFC',
                  productTypeName: '净化器',
                  protocolVersionCode: 1,
                  supportRtc: false,
                  capacity: '0',
                  published: true,
                  errorCodes: {},
                  properties: [
                    {
                      settings: [
                        { apiKey: 'filterMaxRunHours', codeName: 'wx_property_number', properties: { value: '8600' } },
                      ],
                    },
                    { settings: [{ apiKey: 'hcho', codeName: 'wx_property_boolean', properties: { value: true } }] },
                  ],
                  functions: [
                    {
                      name: '电源',
                      code: 0,
                      iconUrl1: '',
                      iconUrl2: '',
                      iconUrl3: '',
                      ovIconUrl1: '',
                      ovIconUrl2: '',
                      appletsIconUrl1: '',
                      appletsIconUrl2: '',
                      harmonyIconUrl1: '',
                      harmonyIconUrl2: '',
                      toshibaIconUrl1: '',
                      toshibaIconUrl2: '',
                      settings: [
                        {
                          apiKey: 'power',
                          codeName: 'wx_array_list',
                          properties: {
                            defaultValue: 'off',
                            list: [
                              { label: '开', value: 'on' },
                              { label: '关', value: 'off' },
                            ],
                          },
                        },
                      ],
                    },
                    {
                      name: '模式',
                      code: 1,
                      iconUrl1: '',
                      iconUrl2: '',
                      iconUrl3: '',
                      ovIconUrl1: '',
                      ovIconUrl2: '',
                      appletsIconUrl1: '',
                      appletsIconUrl2: '',
                      harmonyIconUrl1: '',
                      harmonyIconUrl2: '',
                      toshibaIconUrl1: '',
                      toshibaIconUrl2: '',
                      settings: [
                        {
                          apiKey: 'mode',
                          codeName: 'wx_array_list',
                          properties: {
                            defaultValue: 'manual',
                            list: [
                              { label: '手动', value: 'manual' },
                              { label: '睡眠', value: 'sleep' },
                              { label: '急速', value: 'fast' },
                            ],
                            title: '',
                          },
                        },
                      ],
                    },
                    {
                      name: '风速',
                      code: 2,
                      iconUrl1: '',
                      iconUrl2: '',
                      iconUrl3: '',
                      ovIconUrl1: '',
                      ovIconUrl2: '',
                      appletsIconUrl1: '',
                      appletsIconUrl2: '',
                      harmonyIconUrl1: '',
                      harmonyIconUrl2: '',
                      toshibaIconUrl1: '',
                      toshibaIconUrl2: '',
                      settings: [
                        {
                          apiKey: 'gear',
                          codeName: 'wx_bind_array_list',
                          properties: {
                            defaultValue: '39',
                            list: [
                              { label: '低', value: '39' },
                              { label: '中', value: '59' },
                              { label: '高', value: '80' },
                            ],
                            bindValue: 'manual',
                          },
                        },
                      ],
                    },
                    {
                      name: '一键托管',
                      code: 14,
                      iconUrl1: '',
                      iconUrl2: '',
                      iconUrl3: '',
                      ovIconUrl1: '',
                      ovIconUrl2: '',
                      appletsIconUrl1: '',
                      appletsIconUrl2: '',
                      harmonyIconUrl1: '',
                      harmonyIconUrl2: '',
                      toshibaIconUrl1: '',
                      toshibaIconUrl2: '',
                      settings: [
                        {
                          apiKey: 'hostingOnOff',
                          codeName: 'wx_array_list',
                          properties: {
                            defaultValue: 'off',
                            list: [
                              { label: '开', value: 'on' },
                              { label: '关', value: 'off' },
                            ],
                            title: '',
                          },
                        },
                      ],
                    },
                    {
                      name: '定时',
                      code: 3,
                      iconUrl1: '',
                      iconUrl2: '',
                      iconUrl3: '',
                      ovIconUrl1: '',
                      ovIconUrl2: '',
                      appletsIconUrl1: '',
                      appletsIconUrl2: '',
                      harmonyIconUrl1: '',
                      harmonyIconUrl2: '',
                      toshibaIconUrl1: '',
                      toshibaIconUrl2: '',
                      settings: [
                        {
                          apiKey: 'timing',
                          codeName: 'wx_array_list',
                          properties: {
                            defaultValue: '',
                            list: [
                              { label: '1', value: '1' },
                              { label: '2', value: '2' },
                              { label: '3', value: '3' },
                              { label: '4', value: '4' },
                              { label: '5', value: '5' },
                              { label: '6', value: '6' },
                              { label: '7', value: '7' },
                              { label: '8', value: '8' },
                              { label: '9', value: '9' },
                              { label: '10', value: '10' },
                              { label: '11', value: '11' },
                              { label: '12', value: '12' },
                              { label: '13', value: '13' },
                              { label: '14', value: '14' },
                              { label: '15', value: '15' },
                              { label: '16', value: '16' },
                              { label: '17', value: '17' },
                              { label: '18', value: '18' },
                              { label: '19', value: '19' },
                              { label: '20', value: '20' },
                              { label: '21', value: '21' },
                              { label: '22', value: '22' },
                              { label: '23', value: '23' },
                              { label: '24', value: '24' },
                            ],
                            title: '',
                          },
                        },
                      ],
                    },
                    {
                      name: '亮度',
                      code: 5,
                      iconUrl1: '',
                      iconUrl2: '',
                      iconUrl3: '',
                      ovIconUrl1: '',
                      ovIconUrl2: '',
                      appletsIconUrl1: '',
                      appletsIconUrl2: '',
                      harmonyIconUrl1: '',
                      harmonyIconUrl2: '',
                      toshibaIconUrl1: '',
                      toshibaIconUrl2: '',
                      settings: [
                        {
                          apiKey: 'brightLed',
                          codeName: 'wx_array_list',
                          properties: {
                            defaultValue: '7',
                            list: [
                              { label: '亮', value: '0' },
                              { label: '暗', value: '6' },
                              { label: '灭', value: '7' },
                            ],
                          },
                        },
                      ],
                    },
                    {
                      name: '双效杀菌',
                      code: 16,
                      iconUrl1: '',
                      iconUrl2: '',
                      iconUrl3: '',
                      ovIconUrl1: '',
                      ovIconUrl2: '',
                      appletsIconUrl1: '',
                      appletsIconUrl2: '',
                      harmonyIconUrl1: '',
                      harmonyIconUrl2: '',
                      toshibaIconUrl1: '',
                      toshibaIconUrl2: '',
                      settings: [
                        {
                          apiKey: 'doubleEffectSterilize',
                          codeName: 'wx_array_list',
                          properties: {
                            defaultValue: '0',
                            list: [
                              { label: '30分钟', value: '30' },
                              { label: '60分钟', value: '60' },
                              { label: '关闭', value: '0' },
                            ],
                            title: '',
                          },
                        },
                      ],
                    },
                    {
                      name: '童锁',
                      code: 4,
                      iconUrl1: '',
                      iconUrl2: '',
                      iconUrl3: '',
                      ovIconUrl1: '',
                      ovIconUrl2: '',
                      appletsIconUrl1: '',
                      appletsIconUrl2: '',
                      harmonyIconUrl1: '',
                      harmonyIconUrl2: '',
                      toshibaIconUrl1: '',
                      toshibaIconUrl2: '',
                      settings: [
                        {
                          apiKey: 'childLock',
                          codeName: 'wx_array_list',
                          properties: {
                            defaultValue: 'off',
                            list: [
                              { label: '开', value: 'on' },
                              { label: '关', value: 'off' },
                            ],
                          },
                        },
                      ],
                    },
                    {
                      name: '滤网复位',
                      code: 11,
                      iconUrl1: '',
                      iconUrl2: '',
                      iconUrl3: '',
                      ovIconUrl1: '',
                      ovIconUrl2: '',
                      appletsIconUrl1: '',
                      appletsIconUrl2: '',
                      harmonyIconUrl1: '',
                      harmonyIconUrl2: '',
                      toshibaIconUrl1: '',
                      toshibaIconUrl2: '',
                      settings: [
                        {
                          apiKey: 'FilterReset',
                          codeName: 'wx_array_list',
                          properties: {
                            defaultValue: '',
                            list: [
                              { label: '初效滤网', value: 'first' },
                              { label: 'HEPA滤网', value: 'deep' },
                            ],
                            title: '',
                          },
                        },
                      ],
                    },
                  ],
                  errorCodeMap: {},
                  language: {},
                }
              }
              // if (DeviceData.hostWhenOffDisableModelList.includes(resData.productModelNumber)) {
              //   hostWhenOffDisable = true
              // }
              let quickDevJson = quickDev.quickDevJson2Local(resData)
              console.log('解析后参数')
              console.log(quickDevJson)
              // 智能托管
              configList = quickDevJson.functions
              // 获取属性
              propertiesData = quickDevJson.properties
              // 设置配置项
              // 模式
              // 关机时智能托管不可用
              hostWhenOffDisable = propertiesData.isOffDisableHosting
              let modeConfig = configList[DeviceData.functionsType.mode][0]
              if (modeConfig) {
                modeConfig.list.forEach((item) => {
                  item.icon = FC.getModeIcon(item.value)
                  if (modeConfig.defaultValue === item.value) {
                    iconUrl.mode = FC.getModeIcon(item.value)
                    deviceInfo.modeLabel = modeBtn.rightWrapper.text.content = item.label + '模式'
                  }
                })
              } else {
                modeConfig.isHidden = true
              }
              // 定时

              let timingConfig = configList[DeviceData.functionsType.timing][0]
              if (timingConfig) {
                timedShutdownPicker.columns = timingConfig.list
              }
              // 风速(档位)
              let gearConfig = configList[DeviceData.functionsType.gear]
              if (gearConfig) {
                gearConfig.forEach((gearItem) => {
                  if (modeConfig.defaultValue === gearItem.bindValue) {
                    bindModeGearConfig.list = gearItem.list
                    gearItem.list.forEach((item) => {
                      if (item.label.indexOf('档') === -1) {
                        item.label += '档'
                      }
                    })
                    bindModeGearConfig.list.forEach((modeItem) => {
                      if (modeItem.value === gearItem.defaultValue) {
                        bindModeGearConfig.value = modeItem.value
                        bindModeGearConfig.label = modeItem.label
                        if (bindModeGearConfig.label.indexOf('档') === -1) {
                          bindModeGearConfig.label += '档'
                        }
                        if (!modeItem.label) {
                          bindModeGearConfig.label = bindModeGearConfig.value + '档'
                        }
                      }
                    })
                  }
                })
                let pattern = new RegExp('[0-9]+')
                let isConfigLabelNum = pattern.test(bindModeGearConfig.list[0].label)
                if (isConfigLabelNum && bindModeGearConfig.list.length > 3) {
                  this.gearSliderDataInit({
                    gearList: bindModeGearConfig.list,
                    gearValue: bindModeGearConfig.value,
                  })
                  bindModeGearConfig.isShowSlider = true
                } else if (gearConfig[0] && gearConfig[0].hasOwnProperty('valueStep')) {
                  this.gearSliderDataInit({
                    gearList: bindModeGearConfig.list,
                    gearValue: bindModeGearConfig.value,
                    valueStep: gearConfig[0].valueStep,
                  })
                  bindModeGearConfig.isShowSlider = true
                } else {
                  bindModeGearConfig.isShowSlider = false
                }
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
              // 负离子
              let anion = configList[DeviceData.functionsType.anion]
              anionSwitch = parseComponentModel(anionSwitch)
              if (anion) {
                if (anion[0].defaultValue === DeviceData.powerValue.anion.on) {
                  anionSwitch.selected = true
                } else {
                  anionSwitch.selected = false
                }
              } else {
                anion = {
                  isHidden: true,
                }
              }
              // 智能托管
              let hostingOnOff = configList[DeviceData.functionsType.hostingOnOff]
              hostingOnOffSwitch = parseComponentModel(hostingOnOffSwitch)
              if (hostingOnOff) {
                if (!hostWhenOffDisable) {
                  if (hostingOnOff[0].defaultValue === DeviceData.powerValue.hostingOnOff.on) {
                    hostingOnOffSwitch.selected = true
                  } else {
                    hostingOnOffSwitch.selected = false
                  }
                } else {
                  hostingOnOffSwitch.selected = false
                }
              } else {
                hostingOnOff = {
                  isHidden: true,
                }
              }

              // 净离子
              let waterions = configList[DeviceData.functionsType.waterions]
              waterionsSwitch = parseComponentModel(waterionsSwitch)
              if (waterions) {
                if (waterions[0].defaultValue === DeviceData.powerValue.waterions.on) {
                  waterionsSwitch.selected = true
                } else {
                  waterionsSwitch.selected = false
                }
              } else {
                waterions = {
                  isHidden: true,
                }
              }
              console.log('configList:', configList)

              // 声音
              let voiceOnOff = configList[DeviceData.functionsType.voiceOnOff]
              voiceOnOffSwitch = parseComponentModel(voiceOnOffSwitch)
              if (voiceOnOff) {
                if (voiceOnOff[0].defaultValue === DeviceData.powerValue.voiceOnOff.on) {
                  voiceOnOffSwitch.selected = true
                } else {
                  voiceOnOffSwitch.selected = false
                }
              } else {
                voiceOnOff = {
                  isHidden: true,
                }
              }

              // 童锁
              let childLock = configList[DeviceData.functionsType.childLock]
              childLockSwitch = parseComponentModel(childLockSwitch)
              try {
                if (childLock) {
                  if (childLock[0].defaultValue === DeviceData.powerValue.childLock.on) {
                    childLockSwitch.selected = true
                  } else {
                    childLockSwitch.selected = false
                  }
                } else {
                  childLock = {
                    isHidden: true,
                  }
                }
              } catch (e) {
                console.error(e)
              }
            } while (false)
            modeBtn = parseComponentModel(modeBtn)
            anionSwitch = parseComponentModel(anionSwitch)
            hostingOnOffSwitch = parseComponentModel(hostingOnOffSwitch)
            waterionsSwitch = parseComponentModel(waterionsSwitch)
            voiceOnOffSwitch = parseComponentModel(voiceOnOffSwitch)
            childLockSwitch = parseComponentModel(childLockSwitch)

            this.setData({
              _applianceDataStatus: resData,
              deviceInfo,
              configList,
              bindModeGearConfig,
              bindBrightLedConfig,
              bindLightColorConfig,
              bindHumidifyConfig,
              modeBtn: modeBtn,
              propertiesData,
              iconUrl,
              anionSwitch,
              hostingOnOffSwitch,
              waterionsSwitch,
              voiceOnOffSwitch,
              childLockSwitch,
              timedShutdownPicker,
              hostWhenOffDisable,
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
                  let msg = FC.handleErrorMsg(res.code)
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
    // 数据初始化
    dataInit(newDeviceStatus) {
      let data = this.data
      let deviceInfo = data.deviceInfo
      let hostWhenOffDisable = data.hostWhenOffDisable
      let statusDeepFilterPercent = this.data.statusDeepFilterPercent
      let configList = data.configList
      let iconUrl = data.iconUrl
      let propertiesData = data.propertiesData
      let themeStyle = data.themeStyle
      let themeColor = data.themeColor
      let bindModeGearConfig = data.bindModeGearConfig
      let bindBrightLedConfig = data.bindBrightLedConfig
      let bindLightColorConfig = data.bindLightColorConfig
      let bindHumidifyConfig = data.bindHumidifyConfig
      let bgImage = data.bgImage
      let modeBtn = parseComponentModel(data.modeBtn)
      let childLockSwitch = parseComponentModel(data.childLockSwitch)
      let anionSwitch = parseComponentModel(data.anionSwitch)
      let hostingOnOffSwitch = parseComponentModel(data.hostingOnOffSwitch)
      let waterionsSwitch = parseComponentModel(data.waterionsSwitch)
      let voiceOnOffSwitch = parseComponentModel(data.voiceOnOffSwitch)
      let gearSlider = parseComponentModel(data.gearSlider)
      console.log('数据初始化')
      console.log(newDeviceStatus)
      if (deviceInfo.onlineStatus == DeviceData.onlineStatus.online) {
        deviceInfo.isOnline = true
      } else {
        deviceInfo.isOnline = false
      }
      childLockSwitch.disabled = !deviceInfo.isOnline
      deviceInfo.isRunning = false
      modeBtn.disabled = !deviceInfo.isRunning
      themeStyle = 'wait'
      if (newDeviceStatus) {
        this.setData({ isInit: true })
        // 电源
        if (newDeviceStatus.power && newDeviceStatus.power == DeviceData.powerValue.power.on) {
          deviceInfo.isRunning = true
          themeStyle = 'excellent'
        } else {
          deviceInfo.isRunning = false
          themeStyle = 'wait'
        }
        modeBtn.disabled = !deviceInfo.isRunning
        anionSwitch.disabled = !deviceInfo.isRunning
        // hostingOnOffSwitch.disabled = !deviceInfo.isRunning
        hostingOnOffSwitch.disabled = !deviceInfo.isOnline || (!deviceInfo.isRunning && hostWhenOffDisable)
        waterionsSwitch.disabled = !deviceInfo.isRunning
        voiceOnOffSwitch.disabled = !deviceInfo.isRunning
        // PM2.5
        deviceInfo.pm25 = newDeviceStatus.pm25
        // 室内空气质量等级
        deviceInfo.ashTvoc = newDeviceStatus.ash_tvoc
        if (deviceInfo.ashTvoc == 0 || deviceInfo.ashTvoc == 1) {
          deviceInfo.pm25Label = '优'
          if (deviceInfo.isRunning) {
            themeStyle = 'excellent'
            bgImage.url3 = imageDomain + '/0xFC/bg-excellent-move.png'
          }
        } else if (deviceInfo.ashTvoc == 2 || deviceInfo.ashTvoc == 3) {
          deviceInfo.pm25Label = '中'
          if (deviceInfo.isRunning) {
            themeStyle = 'middle'
            bgImage.url3 = imageDomain + '/0xFC/bg-good-move.png'
          }
        } else if (deviceInfo.ashTvoc == 4 || deviceInfo.ashTvoc == 5) {
          deviceInfo.pm25Label = '差'
          if (deviceInfo.isRunning) {
            themeStyle = 'bad'
            bgImage.url3 = imageDomain + '/0xFC/bg-bad-move.png'
          }
        }
        if (newDeviceStatus.pm25 == 65535) {
          deviceInfo.pm25Label = '暂无数据'
          // this.showNoticeBar('提示: 空气质量检测无效，请检查设备');
        }
        anionSwitch.color = themeColor[themeStyle]
        hostingOnOffSwitch.color = themeColor[themeStyle]
        waterionsSwitch.color = themeColor[themeStyle]
        voiceOnOffSwitch.color = themeColor[themeStyle]
        childLockSwitch.color = themeColor[themeStyle]
        gearSlider.color = themeColor[themeStyle]
        gearSlider = parseComponentModel(gearSlider)
        this.setData({ gearSlider })
        // 甲醛
        // 设备支持甲醛检测再处理数据
        if (data.propertiesData?.hcho) {
          if (newDeviceStatus.hcho != '' && newDeviceStatus.hcho != undefined) {
            deviceInfo.hcho = (newDeviceStatus.hcho / 1000).toFixed(2)
          }
        }
        if (data.propertiesData?.hasVocSensor) {
          // 异味指数
          let gradeLevel = ['优', '优', '良', '中', '差', '差']
          if (newDeviceStatus.smell_tvoc || newDeviceStatus.smell_tvoc === 0) {
            deviceInfo.smellTvoc = (newDeviceStatus.smell_tvoc / 100).toFixed(2)
            deviceInfo.smellTvocLabel = gradeLevel[parseInt(newDeviceStatus.smell_tvoc)]
          }
        }

        // 模式
        deviceInfo.mode = newDeviceStatus.mode
        let deviceInfoMode = []
        if (configList[DeviceData.functionsType.mode] && configList[DeviceData.functionsType.mode][0].list.length > 0) {
          deviceInfoMode = configList[DeviceData.functionsType.mode][0].list.filter(
            (n) => n.value === deviceInfo.mode
          )[0]
          if (deviceInfoMode) {
            iconUrl.mode = FC.getModeIcon(deviceInfo.mode)
            deviceInfo.modeLabel = modeBtn.rightWrapper.text.content = deviceInfoMode.label + '模式'
          } else if (deviceInfo.mode === 'manual') {
            // 手动的档位模式
            deviceInfo.mode = `${deviceInfo.mode}_${newDeviceStatus.wind_speed}`
            deviceInfoMode = configList[DeviceData.functionsType.mode][0].list.filter(
              (n) => n.value === deviceInfo.mode
            )[0]
            iconUrl.mode = FC.getModeIcon(deviceInfo.mode)
            deviceInfo.modeLabel = modeBtn.rightWrapper.text.content = deviceInfoMode.label + '模式'
          }
        }
        // 风速
        deviceInfo.windSpeed = newDeviceStatus.wind_speed
        bindModeGearConfig.label = deviceInfo.windSpeed
        // 获取档位配置参数
        let gearConfigList = configList[DeviceData.functionsType.gear]
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
            let pattern = new RegExp('[0-9]+')
            let isConfigLabelNum = false
            if (bindGearConfig.length > 0) {
              bindGearConfig.forEach((item) => {
                if (item.value == deviceInfo.windSpeed) {
                  bindModeGearConfig.value = item.value
                  bindModeGearConfig.label = item.label
                  if (bindModeGearConfig.label.indexOf('档') === -1) {
                    bindModeGearConfig.label += '档'
                  }
                }
              })
              isConfigLabelNum = pattern.test(bindGearConfig[0].label)
            }
            bindModeGearConfig.list = bindGearConfig
            if (isConfigLabelNum && bindModeGearConfig.list.length > 3) {
              this.gearSliderDataInit({
                gearList: bindModeGearConfig.list,
                gearValue: deviceInfo.windSpeed,
              })
              bindModeGearConfig.isShowSlider = true
            } else if (gearConfigList[0] && gearConfigList[0].hasOwnProperty('valueStep')) {
              this.gearSliderDataInit({
                gearList: bindModeGearConfig.list,
                gearValue: deviceInfo.windSpeed,
                valueStep: gearConfigList[0].valueStep,
              })
              bindModeGearConfig.isShowSlider = true
            } else {
              bindModeGearConfig.isShowSlider = false
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
        // 负离子
        deviceInfo.anion = newDeviceStatus.anion
        if (deviceInfo.anion === DeviceData.powerValue.childLock.on) {
          anionSwitch.selected = true
          deviceInfo.anionLabel = '已开启'
        } else {
          anionSwitch.selected = false
          deviceInfo.anionLabel = '已关闭'
        }
        // 智能托管
        if (!hostWhenOffDisable) {
          deviceInfo.hosting = newDeviceStatus.hosting
          if (deviceInfo.hosting === DeviceData.powerValue.hostingOnOff.on) {
            hostingOnOffSwitch.selected = true
          } else {
            hostingOnOffSwitch.selected = false
          }
        } else {
          if (deviceInfo.mode === 'auto') {
            hostingOnOffSwitch.selected = true
          } else {
            hostingOnOffSwitch.selected = false
          }
        }
        // 净离子
        deviceInfo.waterions = newDeviceStatus.waterions
        if (deviceInfo.waterions === DeviceData.powerValue.waterions.on) {
          waterionsSwitch.selected = true
        } else {
          waterionsSwitch.selected = false
        }
        // 声音
        deviceInfo.buzzer = newDeviceStatus.buzzer
        if (deviceInfo.buzzer === DeviceData.powerValue.voiceOnOff.on) {
          voiceOnOffSwitch.selected = true
        } else {
          voiceOnOffSwitch.selected = false
        }
        // 童锁
        deviceInfo.lock = newDeviceStatus.lock
        if (deviceInfo.lock === DeviceData.powerValue.childLock.on) {
          childLockSwitch.selected = true
          deviceInfo.lockLabel = '已开启'
        } else {
          childLockSwitch.selected = false
          deviceInfo.lockLabel = '已关闭'
        }
        deviceInfo.water_lack = newDeviceStatus.water_lack
        // 定时关机
        if (deviceInfo.water_lack) {
          this.showNoticeBar('水箱缺水，请加水后使用')
        } else {
          this.closeNoticeBar()
        }
        deviceInfo.schedule = undefined
        if (newDeviceStatus.power_off_timer === DeviceData.powerValue.powerOffTimer.on) {
          deviceInfo.schedule = {
            hours: formatTimer(Math.floor((newDeviceStatus.time + 1) / 60)),
            minutes: formatTimer((newDeviceStatus.time + 1) % 60),
          }
          if (!deviceInfo.isRunning) {
            this.deleteScheduleTime(true)
          }
        }
        // 定时开机
        if (newDeviceStatus.power_on_timer === DeviceData.powerValue.powerOnTimer.on) {
          deviceInfo.schedule = {
            hours: formatTimer(Math.floor((newDeviceStatus.time_on + 1) / 60)),
            minutes: formatTimer((newDeviceStatus.time_on + 1) % 60),
          }
          if (deviceInfo.isRunning) {
            this.deleteScheduleTime(true)
          }
        }
        // 滤网计算
        let subType = deviceInfo.modelNumber
        let leftLifeValue = 1
        let percent = 100
        if ([1, 2, 3, 6, 8, 9, 10, 14, 19, 34].includes(parseInt(subType))) {
          // 使用时间计算的滤网寿命
          leftLifeValue = (1 - newDeviceStatus.filter_deep_1_acc_time / propertiesData.filterMaxRunHours).toFixed(2) // 剩余百分比【注意：累计时间有可能会大于最长的时间】
          leftLifeValue = Number(leftLifeValue)
          percent = Math.max(0, Number((leftLifeValue * 100).toFixed(0)))
        } else if ([4, 5, 15, 17, 18, 24, 28].includes(parseInt(subType))) {
          // 使用时间计算的滤网寿命(特殊处理)
          leftLifeValue = (1 - newDeviceStatus.filter_deep_1_acc_time / propertiesData.filterMaxRunHours).toFixed(2) // 剩余百分比【注意：累计时间有可能会大于最长的时间】
          percent = Math.max(0, Number((leftLifeValue * 100).toFixed(0)))
        } else {
          // 使用百分比直接显示的滤网寿命
          percent = newDeviceStatus.deep_filter_percent
        }
        statusDeepFilterPercent = percent
        let statusDeepFilterIsShow = this.data.statusDeepFilterIsShow
        if (!statusDeepFilterIsShow) {
          statusDeepFilterIsShow = true
          this.setData({ statusDeepFilterIsShow })
          if (statusDeepFilterPercent < 15) {
            this.showNoticeBar('提示: 滤网剩余不足，请尽快更换')
          }
        }
      }
      modeBtn = parseComponentModel(modeBtn)
      anionSwitch = parseComponentModel(anionSwitch)
      hostingOnOffSwitch = parseComponentModel(hostingOnOffSwitch)
      waterionsSwitch = parseComponentModel(waterionsSwitch)
      voiceOnOffSwitch = parseComponentModel(voiceOnOffSwitch)
      childLockSwitch = parseComponentModel(childLockSwitch)
      this.setData({
        themeStyle,
        deviceInfo,
        modeBtn,
        childLockSwitch,
        anionSwitch,
        hostingOnOffSwitch,
        waterionsSwitch,
        voiceOnOffSwitch,
        bindModeGearConfig,
        bindBrightLedConfig,
        bindLightColorConfig,
        bindHumidifyConfig,
        statusDeepFilterPercent,
        iconUrl,
        bgImage,
      })
      let windowHeight = wx.getSystemInfoSync().windowHeight
      // 获取功能区域高度
      wx.createSelectorQuery()
        .in(this)
        .select('.controller-wrapper')
        .fields(
          {
            size: true,
          },
          (res) => {
            let limitRate = res?.height / windowHeight
            if (res) {
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
    },

    // region 跳转到美居下载页
    goToDownLoad() {
      wx.navigateTo({
        url: '/pages/download/download',
      })
    },
    // endregion

    // 档位(风速)滑块数据初始化
    gearSliderDataInit({ gearList, gearValue, valueStep }) {
      let gearSlider = parseComponentModel(this.data.gearSlider)
      do {
        if (valueStep) {
          valueStep = Number(valueStep)
          gearSlider.min = Number(gearList[0]?.value) + valueStep
          gearSlider.max = Number(gearList[gearList.length - 1]?.value) + valueStep
          let interval = gearSlider.max - gearSlider.min
          gearSlider.interval = interval
          gearSlider.currentValue = Number(gearValue)
          break
        }
        gearSlider.min = Number(gearList[0]?.value)
        if (gearList[0].value == 0) {
          gearSlider.min = Number(gearList[1]?.value)
        }
        gearSlider.max = Number(gearList[gearList.length - 1]?.value)
        let maxMinInterval = gearSlider.max - gearSlider.min
        if (maxMinInterval % 2) {
          // 单数档
          gearSlider.interval = Math.floor(maxMinInterval / 4)
        } else {
          // 双数档
          gearSlider.interval = Math.floor(maxMinInterval / 3)
        }
        gearSlider.currentValue = Number(gearValue)
      } while (false)
      gearSlider = parseComponentModel(gearSlider)
      this.setData({ gearSlider })
    },
    // 移动档位(风速)滑块
    moveGearValue(event) {
      let gearModel = event.detail
      gearModel.currentValue = Math.floor(gearModel.currentValue)
      let bindModeGearConfig = this.data.bindModeGearConfig
      bindModeGearConfig.label = gearModel.currentValue + '档'
      this.setData({ bindModeGearConfig })
    },
    // 点击功能按钮
    onClickController(event) {
      do {
        let index = event.currentTarget.dataset.index
        let value = event.currentTarget.dataset.value
        let item = event.currentTarget.dataset.item
        let propertiesData = this.data.propertiesData
        let deviceErrCode = this.data.deviceErrCode
        if (DeviceData.isDebug) {
          break
        }
        let deviceInfo = this.data.deviceInfo
        // 订阅滤网消息
        // openSubscribeModal(
        //   modelIds[13],
        //   deviceInfo.name,
        //   deviceInfo.sn,
        //   [templateIds?.[23]?.[0]],
        //   deviceInfo.sn8,
        //   deviceInfo.type,
        //   deviceInfo.applianceCode,
        // )
        if (!deviceInfo.isOnline) {
          MideaToast('设备已离线，请检查网络状态')
          break
        }
        if (deviceErrCode) {
          let msg = FC.handleErrorMsg(deviceErrCode)
          MideaToast(msg)
          break
        }
        if (index === DeviceData.functionsType.power) {
          if (deviceInfo.lock === DeviceData.powerValue.childLock.on) {
            MideaToast('请关闭童锁后再进行设置！')
            break
          }
          // 电源
          this.powerOnOff()
          break
        }
        if (index === 'showTiming') {
          // 显示定时选项
          this.showTimingModal()
          break
        }
        if (index === 'goBuyFilter') {
          let filterBuyLink = propertiesData['filterBuyLink']
          if (!filterBuyLink) {
            MideaToast('缺少购买链接')
            break
          }
          goToWebView(filterBuyLink)
          break
        }
        if (!deviceInfo.isRunning) {
          MideaToast('设备已关机')
          break
        }
        switch (index) {
          case DeviceData.functionsType.mode:
            // 模式
            try {
              this.selectMode(item)
            } catch (e) {
              console.error(e)
            }
            break
          case 'showMode':
            // 显示模式选项
            this.showModeModal()
            break
          case DeviceData.functionsType.gear:
            // 切换档位
            this.selectGear(value)
            break
          case DeviceData.functionsType.brightLed:
            // 切换亮度
            this.selectBrightLed(value)
            break
          case DeviceData.functionsType.lightColor:
            // 切换氛围灯
            this.selectLightColor(value)
            break
          case DeviceData.functionsType.humidify:
            // 切换加湿
            this.selectHumidify(value)
            break
        }
      } while (false)
    },

    // 定时选项改变
    pickOnChange(e) {
      do {
        let data = this.data
        let deviceInfo = data.deviceInfo
        if (!deviceInfo.isOnline) {
          break
        }
        let val = e.detail.value
        let timedShutdownPicker = this.data.timedShutdownPicker
        timedShutdownPicker.selectedValue = val
        this.setData({ timedShutdownPicker })
      } while (false)
    },
    // 电源启停
    powerOnOff() {
      let deviceInfo = this.data.deviceInfo
      let controlParams = {
        power: undefined,
      }
      if (deviceInfo.isRunning) {
        controlParams.power = 'off'
      } else {
        controlParams.power = 'on'
      }
      this.clearDeviceStatusInterval()
      UI.showLoading()
      this.requestControl({
        control: controlParams,
      })
        .then((res) => {
          console.log('操作结束')
          console.log(res)
          UI.hideLoading()
          do {
            if (res.data.code != 0) {
              let msg = FC.handleErrorMsg(res.data.code)
              MideaToast(msg)
              break
            }
            this.dataInit(res.data.data.status)
            // this.deleteScheduleTime(true);
            this.deviceStatusInterval()
          } while (false)
        })
        .catch((err) => {
          UI.hideLoading()
          this.deviceStatusInterval()
        })
    },
    // 切换模式
    selectMode(modeItem) {
      UI.showLoading()
      this.clearDeviceStatusInterval()
      let control = null
      let reg = /^manual_[0-9]{1}$/
      if (reg.test(modeItem.value)) {
        let manualArr = modeItem.value.split('_')
        control = {
          mode: manualArr[0],
          wind_speed: manualArr[1],
        }
      } else {
        control = {
          mode: modeItem.value,
        }
      }
      this.requestControl({
        control,
      })
        .then((res) => {
          UI.hideLoading()
          this.dataInit(res.data.data.status)
          this.deviceStatusInterval()
          this.closeModeModal()
          setTimeout(() => {
            MideaToast('已切换至' + modeItem.label + '模式')
          }, 500)
        })
        .catch((err) => {
          UI.hideLoading()
          this.deviceStatusInterval()
        })
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
    selectBrightLed(bright) {
      UI.showLoading()
      this.clearDeviceStatusInterval()
      this.requestControl({
        control: {
          bright,
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
    selectHumidify(humidity) {
      // const deviceInfo = this.data.deviceInfo
      // if (deviceInfo.water_lack) {
      //   return MideaToast('请加水后再开启加湿功能')
      // } else if (!deviceInfo.removable_water_box) {
      //   return MideaToast('请放置水箱再开启加湿功能')
      // }
      UI.showLoading()
      this.clearDeviceStatusInterval()
      this.requestControl({
        control: {
          humidity,
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
    selectLightColor(light_color) {
      UI.showLoading()
      this.clearDeviceStatusInterval()
      this.requestControl({
        control: {
          light_color,
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
    // 显示模式对话框
    showModeModal() {
      do {
        let configList = this.data.configList
        let modeList = configList[DeviceData.functionsType.mode]
        if (!modeList || modeList.length === 0) {
          MideaToast('配置项缺少模式')
          break
        }
        let pageComponentVisible = this.data.pageComponentVisible
        pageComponentVisible.isShowSelectMode = true
        this.setData({ pageComponentVisible })
      } while (false)
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
      do {
        let pickerColumns = this.data.timedShutdownPicker.columns
        if (!pickerColumns || pickerColumns.length === 0) {
          MideaToast('配置项缺少数据')
          break
        }
        let pageComponentVisible = this.data.pageComponentVisible
        pageComponentVisible.isShowTimedShutdown = true
        this.setData({ pageComponentVisible })
      } while (false)
    },
    // 负离子切换
    switchAnion(event) {
      let anionModel = event.detail
      let value = DeviceData.powerValue.anion.off
      let anionSwitch = parseComponentModel(this.data.anionSwitch)
      // 设置童锁请求
      if (anionModel.selected) {
        value = DeviceData.powerValue.anion.on
      } else {
        value = DeviceData.powerValue.anion.off
      }
      UI.showLoading()
      this.clearDeviceStatusInterval()
      this.requestControl({
        control: {
          anion: value,
        },
      })
        .then((res) => {
          UI.hideLoading()
          anionSwitch.selected = anionModel.selected
          anionSwitch = parseComponentModel(anionSwitch)
          this.setData({ anionSwitch })
          let anion = res.data.data.status.anion
          if (anion === DeviceData.powerValue.anion.on) {
            MideaToast('负离子已开启')
          } else {
            MideaToast('负离子已关闭')
          }
          this.dataInit(res.data.data.status)
          this.deviceStatusInterval()
        })
        .catch((err) => {
          UI.hideLoading()
          anionSwitch.selected = !anionModel.selected
          anionSwitch = parseComponentModel(anionSwitch)
          this.setData({ anionSwitch })
          this.deviceStatusInterval()
        })
    },
    // 智能托管切换
    switchHostingOnOff(event) {
      let hostingOnOffModel = event.detail
      let hostWhenOffDisable = this.data.hostWhenOffDisable
      let value = ''
      let hostingOnOffSwitch = parseComponentModel(this.data.hostingOnOffSwitch)

      if (hostingOnOffModel.selected) {
        value = DeviceData.powerValue.hostingOnOff.on
      } else {
        value = DeviceData.powerValue.hostingOnOff.off
      }
      UI.showLoading()
      this.clearDeviceStatusInterval()
      let control = {
        hosting: value,
      }
      if (hostWhenOffDisable) {
        if (hostingOnOffModel.selected) {
          control = {
            mode: 'auto',
          }
        } else {
          control = {
            mode: 'sleep',
          }
        }
      }
      this.requestControl({ control })
        .then((res) => {
          UI.hideLoading()
          hostingOnOffSwitch.selected = hostingOnOffModel.selected
          hostingOnOffSwitch = parseComponentModel(hostingOnOffSwitch)
          this.setData({ hostingOnOffSwitch })
          if (!hostWhenOffDisable) {
            let hostingOnOff = res.data.data.status.hosting
            if (hostingOnOff === DeviceData.powerValue.hostingOnOff.on) {
              MideaToast('智能托管已开启')
            } else {
              MideaToast('智能托管已关闭')
            }
          } else {
            let mode = res.data.data.status.mode
            if (mode === 'auto') {
              MideaToast('智能托管已开启')
            } else {
              MideaToast('智能托管已关闭')
            }
          }

          this.dataInit(res.data.data.status)
          this.deviceStatusInterval()
        })
        .catch((err) => {
          UI.hideLoading()
          hostingOnOffSwitch.selected = !hostingOnOffModel.selected
          hostingOnOffSwitch = parseComponentModel(hostingOnOffSwitch)
          this.setData({ hostingOnOffSwitch })
          this.deviceStatusInterval()
        })
    },
    // 智能托管切换
    switchWaterions(event) {
      let waterionsModel = event.detail
      let value = ''
      let waterionsSwitch = parseComponentModel(this.data.waterionsSwitch)

      if (waterionsModel.selected) {
        value = DeviceData.powerValue.waterions.on
      } else {
        value = DeviceData.powerValue.waterions.off
      }
      UI.showLoading()
      this.clearDeviceStatusInterval()
      this.requestControl({
        control: {
          waterions: value,
        },
      })
        .then((res) => {
          UI.hideLoading()
          waterionsSwitch.selected = waterionsModel.selected
          waterionsSwitch = parseComponentModel(waterionsSwitch)
          this.setData({ waterionsSwitch })
          let waterions = res.data.data.status.waterions
          if (waterions === DeviceData.powerValue.waterions.on) {
            MideaToast('净离子已开启')
          } else {
            MideaToast('净离子已关闭')
          }
          this.dataInit(res.data.data.status)
          this.deviceStatusInterval()
        })
        .catch((err) => {
          UI.hideLoading()
          waterionsSwitch.selected = !waterionsModel.selected
          waterionsSwitch = parseComponentModel(waterionsSwitch)
          this.setData({ waterionsSwitch })
          this.deviceStatusInterval()
        })
    },
    // 声音切换
    switchVoiceOnOff(event) {
      let voiceOnOffModel = event.detail
      let value = ''
      let voiceOnOffSwitch = parseComponentModel(this.data.voiceOnOffSwitch)

      if (voiceOnOffModel.selected) {
        value = DeviceData.powerValue.voiceOnOff.on
      } else {
        value = DeviceData.powerValue.voiceOnOff.off
      }
      UI.showLoading()
      this.clearDeviceStatusInterval()
      this.requestControl({
        control: {
          buzzer: value,
        },
      })
        .then((res) => {
          UI.hideLoading()
          voiceOnOffSwitch.selected = voiceOnOffModel.selected
          voiceOnOffSwitch = parseComponentModel(voiceOnOffSwitch)
          this.setData({ voiceOnOffSwitch })
          let voiceOnOff = res.data.data.status.buzzer
          if (voiceOnOff === DeviceData.powerValue.voiceOnOff.on) {
            MideaToast('声音已开启')
          } else {
            MideaToast('声音已关闭')
          }
          this.dataInit(res.data.data.status)
          this.deviceStatusInterval()
        })
        .catch((err) => {
          UI.hideLoading()
          voiceOnOffSwitch.selected = !voiceOnOffModel.selected
          voiceOnOffSwitch = parseComponentModel(voiceOnOffSwitch)
          this.setData({ voiceOnOffSwitch })
          this.deviceStatusInterval()
        })
    },
    // 童锁开关切换
    switchChildLock(event) {
      let childLockModel = event.detail
      let value = DeviceData.powerValue.childLock.off
      let childLockSwitch = parseComponentModel(this.data.childLockSwitch)
      // 设置童锁请求
      if (childLockModel.selected) {
        value = DeviceData.powerValue.childLock.on
      } else {
        value = DeviceData.powerValue.childLock.off
      }
      UI.showLoading()
      this.clearDeviceStatusInterval()
      this.requestControl({
        control: {
          lock: value,
        },
      })
        .then((res) => {
          UI.hideLoading()
          childLockSwitch.selected = childLockModel.selected
          childLockSwitch = parseComponentModel(childLockSwitch)
          this.setData({ childLockSwitch })
          let lock = res.data.data.status.lock
          if (lock === DeviceData.powerValue.childLock.on) {
            MideaToast('童锁已开启')
          } else {
            MideaToast('童锁已关闭')
          }
          this.dataInit(res.data.data.status)
          this.deviceStatusInterval()
        })
        .catch((err) => {
          UI.hideLoading()
          childLockSwitch.selected = !childLockModel.selected
          childLockSwitch = parseComponentModel(childLockSwitch)
          this.setData({ childLockSwitch })
          this.deviceStatusInterval()
        })
    },
    // 获取设备状态
    updateStatus() {
      return new Promise((resolve, reject) => {
        let deviceErrCode = this.data.deviceErrCode
        requestService
          .request('luaGet', {
            applianceCode: this.properties.applianceData.applianceCode,
            command: {},
            reqId: getStamp().toString(),
            stamp: getStamp(),
          })
          .then((res) => {
            do {
              // console.log('获取设备状态')
              // console.log(res.data.data)
              if (res.data.code != 0) {
                if (deviceErrCode != res.data.code) {
                  deviceErrCode = res.data.code
                  this.setData({ deviceErrCode })
                  let msg = FC.handleErrorMsg(res.data.code)
                  MideaToast(msg)
                }
                resolve(res)
                break
              }
              deviceErrCode = undefined
              this.setData({ deviceErrCode })
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
                  let msg = FC.handleErrorMsg(res.code)
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
    // endregion

    // region 2021.08.27 之前代码
    // getCurrentMode() {
    //   return {
    //     applianceCode: this.data._applianceData.applianceCode,
    //     mode: this.properties.applianceData.onlineStatus == 1 ? CARD_MODE_OPTION.COLD : CARD_MODE_OPTION.OFFLINE,
    //   }
    // },

    // processTouch(event) {},
    computePower() {
      //渲染电源按钮 中间那个圈和文字
      let applianceStatus = this.data._applianceDataStatus
      let power = {},
        showText,
        circleSrc = ''
      if (applianceStatus.power == 'off') {
        power = {
          mainImg: this.data.powerImg.on,
          desc: '开机',
        }
        circleSrc = this.data.circleImg.on
        showText = false
      } else {
        power = {
          mainImg: this.data.powerImg.off,
          desc: '关机',
        }
        circleSrc = this.data.circleImg.off
        showText = true
      }
      this.setData({
        power,
        circleSrc,
        showText,
      })
    },
    computeMode() {
      //渲染自动、睡眠、手动按钮
      let applianceStatus = this.data._applianceDataStatus
      let modeList = ['auto', 'sleep', 'manual']
      let modeDesc = {
        auto: '自动',
        sleep: '睡眠',
        manual: '手动',
      }
      let mode = {
        auto: {},
        sleep: {},
        manual: {},
      }
      modeList.map((item) => {
        mode[item] = {
          desc: modeDesc[item],
          mainImg: '',
        }

        if (item == 'manual') {
          //计算手动按钮的状态
          var str = ''
          if (applianceStatus.power == 'off') {
            mode[item].desc = '手动'
          } else if (applianceStatus.mode != 'manual' || applianceStatus.wind_speed == '101') {
            mode[item].desc = '手动'
          } else {
            mode[item].desc = '手动 | ' + applianceStatus.wind_speed
          }
          if (applianceStatus.mode == 'manual' && applianceStatus.power == 'on') {
            mode[item].mainImg = this.data.modeImg[item].on
            if (this.data.showManualItems) {
              mode[item].triangleImg = this.data.icons.btnTriangle.on_show
            } else {
              mode[item].triangleImg = this.data.icons.btnTriangle.on_hide
            }
          } else if (applianceStatus.mode != 'manual' && applianceStatus.power == 'on') {
            mode[item].mainImg = this.data.modeImg[item].off
            mode[item].triangleImg = this.data.icons.btnTriangle.off
          } else {
            mode[item].mainImg = this.data.modeImg[item].disabled
            mode[item].triangleImg = this.data.icons.btnTriangle.off
          }
        }

        if (item == 'auto') {
          //计算自动按钮的状态
          if (applianceStatus.mode == 'auto' && applianceStatus.power == 'on') {
            mode[item].mainImg = this.data.modeImg[item].on
          } else if (applianceStatus.mode != 'auto' && applianceStatus.power == 'on') {
            mode[item].mainImg = this.data.modeImg[item].off
          } else {
            mode[item].mainImg = this.data.modeImg[item].disabled
          }
        }

        if (item == 'sleep') {
          //计算睡眠按钮的状态
          if (applianceStatus.mode == 'sleep' && applianceStatus.power == 'on') {
            mode[item].mainImg = this.data.modeImg[item].on
          } else if (applianceStatus.mode != 'sleep' && applianceStatus.power == 'on') {
            mode[item].mainImg = this.data.modeImg[item].off
          } else {
            mode[item].mainImg = this.data.modeImg[item].disabled
          }
        }
      })
      this.setData({
        auto: mode.auto,
        sleep: mode.sleep,
        manual: mode.manual,
      })
    },
    computeButtons() {
      this.computePower()
      this.computeMode()
    },
    modeToggle(e) {
      //点击模式按钮
      if (this.data._applianceDataStatus.power == 'on') {
        if (e.target.id == 'manual') {
          //点击 手动  按钮时
          this.setData({
            '_applianceDataStatus.mode': 'manual',
            showManualItems: !this.data.showManualItems,
            scrollViewTop: 500 + this.data.scrollViewTop,
          })
          if (this.data.showManualItems) {
            wx.showLoading({ mask: true })
            this.requestControl({
              control: {
                mode: 'manual',
                // wind_speed: this.data._applianceDataStatus.wind_speed
              },
            })
              .then((res) => {
                wx.hideLoading()
                this.setData({
                  _applianceDataStatus: res.data.data.status,
                })
                this.computeButtons()
                wx.hideNavigationBarLoading()
              })
              .catch((err) => {
                wx.hideLoading()
                wx.hideNavigationBarLoading()
              })
          }
        } else if (e.target.id == 'sleep') {
          //点击 睡眠  按钮时
          this.setData({
            showManualItems: false,
            '_applianceDataStatus.wind_speed': '101',
            '_applianceDataStatus.mode': 'sleep',
          })
          wx.showLoading({ mask: true })
          this.requestControl({
            control: {
              mode: 'sleep',
            },
          })
            .then((res) => {
              wx.hideLoading()
              this.setData({
                _applianceDataStatus: res.data.data.status,
              })
              wx.hideNavigationBarLoading()
            })
            .catch((err) => {
              wx.hideLoading()
              wx.hideNavigationBarLoading()
            })
        } else if (e.target.id == 'auto') {
          //点击 自动  按钮时
          this.setData({
            showManualItems: false,
            '_applianceDataStatus.wind_speed': '101',
            '_applianceDataStatus.mode': 'auto',
          })
          wx.showLoading({ mask: true })
          this.requestControl({
            control: {
              mode: 'auto',
              // wind_speed: '101'
            },
          })
            .then((res) => {
              wx.hideLoading()
              this.setData({
                _applianceDataStatus: res.data.data.status,
              })
              wx.hideNavigationBarLoading()
            })
            .catch((err) => {
              wx.hideLoading()
              wx.hideNavigationBarLoading()
            })
        }
        this.computeButtons()
      } else {
        wx.showToast({
          title: '设备已关机',
          icon: 'none',
        })
      }
    },
    windSpeedChange(e) {
      wx.showLoading({ mask: true })
      let speed = parseInt(e.detail.value)
      this.requestControl({
        control: {
          // mode: 'manual',
          wind_speed: speed,
        },
      })
        .then((res) => {
          wx.hideLoading()
          this.setData({
            _applianceDataStatus: res.data.data.status,
          })
          this.computeButtons()
          wx.hideNavigationBarLoading()
        })
        .catch((err) => {
          wx.hideLoading()
          wx.hideNavigationBarLoading()
        })
      this.computeButtons()
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
  },

  attached() {
    do {
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
          uid: uid,
          _applianceData: this.properties.applianceData,
          deviceInfo: deviceInfo,
        })
        let param = {}
        param['page_name'] = '首页'
        param['object'] = '进入插件页'

        this.rangersBurialPointClick('plugin_page_view', param)
        this.getProductConfig().then(() => {
          this.updateStatus().then(() => {
            this.setData({
              isInit: true,
            })
            this.deviceStatusInterval()
            // UI.hideLoading();
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
      })
    } while (false)
  },
  // 销毁组件
  detached() {
    //执行当前页面前后插件的业务逻辑，主要用于一些清除工作
    if (deviceStatusTimer) {
      clearInterval(deviceStatusTimer)
    }
    // 数据初始化
    deviceStatusTimer = null
  },
})
