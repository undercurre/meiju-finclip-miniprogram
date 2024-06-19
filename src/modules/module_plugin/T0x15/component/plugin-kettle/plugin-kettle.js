// plugin/T0x15/component/plugin-kettle/plugin-kettle.js
const app = getApp()
import { imageDomain } from '../../assets/scripts/api'
import { parseComponentModel } from '../../assets/scripts/common'
import MideaToast from '../midea-toast/toast'
import { PluginConfig } from '../../card/js/15'
import { UI } from '../../assets/scripts/ui'
const rangersBurialPoint = app.getGlobalConfig().rangersBurialPoint
const requestService = app.getGlobalConfig().requestService
import { getStamp } from 'm-utilsdk/index'
import { DeviceData } from '../../assets/scripts/device-data'

let deviceStatusTimer = null
let isDeviceInterval = true
const THEME_COLOR = '#FFAA10'
const DISABLED_COLOR = '#7C879B'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    applianceData: {
      type: Object,
      value: function () {
        return {}
      },
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,
    bgImage: {
      off: imageDomain + '/0xFB/bg.png',
      on: imageDomain + '/0xFB/bg-running.png',
      work: imageDomain + '/0xFB/bg-running-move.png',
    },
    deviceInfo: {
      bgImage: imageDomain + '/0xFB/bg.png',
      isOnline: false,
      isRunning: false,
    },
    settingParams: {
      titleIndex: 0,
      isKeepWarm: true,
      keepWarmTemp: 55,
    },
    isBottomFixed: false,
    titleOptions: [
      {
        label: '除氯煮沸',
        desc: '(自来水推荐)',
      },
      {
        label: '加热定温',
        desc: '(净水推荐)',
      },
    ],
    switchKeepWarm: parseComponentModel({
      color: THEME_COLOR,
      selected: true,
    }),
    switchSchedule: parseComponentModel({
      color: THEME_COLOR,
      selected: false,
    }),
    sliderTemperature: parseComponentModel({
      color: THEME_COLOR,
      // isShowValue: true,
      min: 35,
      max: 85,
      interval: 5,
      currentValue: 55,
      valueArray: [
        {
          value: 35,
          label: '35',
        },
        {
          value: 85,
          label: '85',
        },
      ],
      width: '150%',
      unit: '',
    }),
    quickTempOptions: [
      {
        icon: imageDomain + '/0x15/icon_naifen.png',
        icon2: imageDomain + '/0x15/icon_naifen1.png',
        label: '泡奶',
        value: 40,
        unit: '℃',
      },
      {
        icon: imageDomain + '/0x15/icon_fengmi.png',
        icon2: imageDomain + '/0x15/icon_fengmi1.png',
        label: '蜂蜜',
        value: 55,
        unit: '℃',
      },
      {
        icon: imageDomain + '/0x15/icon_guozhifen.png',
        icon2: imageDomain + '/0x15/icon_guozhifen1.png',
        label: '果汁粉',
        value: 65,
        unit: '℃',
      },
      {
        icon: imageDomain + '/0x15/icon_lvchafen.png',
        icon2: imageDomain + '/0x15/icon_lvchafen1.png',
        label: '绿茶粉',
        value: 75,
        unit: '℃',
      },
      {
        icon: imageDomain + '/0x15/icon_paocha.png',
        icon2: imageDomain + '/0x15/icon_paocha1.png',
        label: '泡茶',
        value: 85,
        unit: '℃',
      },
    ],
    iconUrl: {
      arrow: {
        url1: imageDomain + '/0xE7/icon-arrow-r.png',
      },
      temperature: imageDomain + '/0xFB/icon-temperature.png',
      power: {
        off: imageDomain + '/0xFB/icon-switch.png',
        on: imageDomain + '/0x15/icon-power-on.png',
        on2: imageDomain + '/0x15/icon-power-on2.png',
      },
      backImgBase: imageDomain + '/0xFC/icon_youjiantou.png',
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // region 跳转到美居下载页
    goToDownLoad() {
      wx.navigateTo({
        url: '/pages/download/download',
      })
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

    // region 数据初始化
    dataInit(newDeviceStatus) {
      let data = this.data
      let deviceInfo = data.deviceInfo
      console.log('数据初始化')
      console.log(newDeviceStatus)
      if (newDeviceStatus) {
        deviceInfo.isOnline = true
        let sliderTemperature = parseComponentModel(this.data.sliderTemperature)
        sliderTemperature.color = THEME_COLOR
        sliderTemperature = parseComponentModel(sliderTemperature)
        Object.assign(deviceInfo, newDeviceStatus)
        // 判断工作状态
        switch (newDeviceStatus.work_status) {
          case '0':
            // 待机
            deviceInfo.isRunning = false
            deviceInfo.bgImage = this.data.bgImage.on
            break
          case '2':
          case '3':
            // 工作、保温
            deviceInfo.isRunning = true
            deviceInfo.bgImage = this.data.bgImage.work
            break
          default:
            deviceInfo.isRunning = false
            deviceInfo.bgImage = this.data.bgImage.off
            break
        }
      }
      console.log(deviceInfo)
      this.setData({ deviceInfo })
    },
    // endregion

    // 运行提示
    onClickRunningTips() {
      let deviceInfo = this.data.deviceInfo
      if (!deviceInfo.isOnline) {
        MideaToast('设备离线')
      } else {
        MideaToast('设备工作中，请稍后再试')
      }
    },

    // region 开始烹饪
    startWork() {
      let deviceInfo = this.data.deviceInfo
      if (!deviceInfo.isOnline) {
        MideaToast('设备离线')
        return
      }
      let data = this.data
      let settingParams = data.settingParams
      let controlParams = {
        work_switch: PluginConfig.workSwitch.work,
      }
      let titleText = ''
      if (settingParams.titleIndex === 0) {
        // 除氯煮沸
        controlParams['boil_target_temp'] = '100'
        titleText = '除氯煮沸'
      } else {
        // 加热定温
        controlParams['boil_target_temp'] = settingParams.keepWarmTemp
        titleText = '加热定温'
      }
      if (settingParams.isKeepWarm) {
        controlParams['warm_target_temp'] = settingParams.keepWarmTemp
        titleText += ' | 保温' + settingParams.keepWarmTemp + '℃'
      } else {
        controlParams['warm_target_temp'] = '0'
      }
      // 是否保温
      console.log('开始烹饪')
      console.log(controlParams)
      console.log(deviceInfo)
      wx.showModal({
        title: titleText,
        content: '启动前请放入合适的水量',
        cancelColor: '#007AFF',
        confirmColor: '#007AFF',
        confirmText: '启动',
        success: (res) => {
          if (res.confirm) {
            this.onClickControl(controlParams)
          } else if (res.cancel) {
          }
        },
      })
    },
    // endregion

    // region 取消工作
    stopWork() {
      let deviceInfo = this.data.deviceInfo
      if (!deviceInfo.isOnline) {
        MideaToast('设备离线')
        return
      }
      wx.showModal({
        title: '是否结束设备工作',
        content: '',
        success: (res) => {
          if (res.confirm) {
            this.onClickControl({
              work_switch: PluginConfig.workSwitch.cancel,
            })
          }
        },
      })
    },
    // endregion

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
            UI.hideLoading()
            if (res.data.code != 0) {
              let msg = PluginConfig.handleErrorMsg(res.data.code)
              MideaToast(msg)
            } else {
              this.dataInit(res.data.data.status)
              this.deviceStatusInterval()
            }
          })
      })
    },
    // endregion

    // 点击功能项
    onClickEvent(event) {
      let index = event?.currentTarget?.dataset?.index
      if (!index) {
        console.warn('缺少操作索引')
        return
      }
      let value = event?.currentTarget?.dataset?.value
      let deviceInfo = this.data.deviceInfo
      if (!deviceInfo.isOnline) {
        MideaToast('设备离线，无法进行操作')
        return
      }
      let settingParams = this.data.settingParams
      let switchKeepWarm = parseComponentModel(this.data.switchKeepWarm)
      let sliderTemperature = parseComponentModel(this.data.sliderTemperature)
      switch (index) {
        case 'title':
          // 选择首选项
          settingParams.titleIndex = Number(value)
          if (settingParams.titleIndex === 1) {
            settingParams.isKeepWarm = true
            this.openMeiJuAppPosInit(false)
          } else {
            settingParams.isKeepWarm = switchKeepWarm.selected
            this.openMeiJuAppPosInit(!settingParams.isKeepWarm)
          }
          break
        case 'temperature':
          // 选择快捷温度
          sliderTemperature.currentValue = settingParams.keepWarmTemp = Number(value)
          break
      }
      sliderTemperature = parseComponentModel(sliderTemperature)
      this.setData({ settingParams, sliderTemperature })
    },

    // 开关切换
    switchKeepWarmChange(event) {
      let model = event.detail
      let settingParams = this.data.settingParams
      settingParams.isKeepWarm = model.selected
      if (model.selected) {
        this.openMeiJuAppPosInit(false)
      } else {
        this.openMeiJuAppPosInit(true)
      }
      this.setData({
        settingParams,
        switchKeepWarm: parseComponentModel(model),
      })
    },

    // 温度滑块改变
    sliderTemperatureOnChange(event) {
      let model = event.detail
      let settingParams = this.data.settingParams
      settingParams.keepWarmTemp = model.currentValue
      this.setData({
        settingParams,
        sliderTemperature: parseComponentModel(model),
      })
    },

    // 美居提示位置初始化
    openMeiJuAppPosInit(isBottomFixed) {
      if (isBottomFixed === true || isBottomFixed === false) {
        this.setData({
          isBottomFixed: isBottomFixed,
        })
        return
      }
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
    },

    requestControl(command) {
      // wx.showNavigationBarLoading()
      // wx.showLoading({mask: true})
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
        let sliderTemperature = parseComponentModel(this.data.sliderTemperature)
        let switchKeepWarm = parseComponentModel(this.data.switchKeepWarm)
        let settingParams = this.data.settingParams
        requestService
          .request('luaGet', {
            applianceCode: this.properties.applianceData.applianceCode,
            command: {},
            reqId: getStamp().toString(),
            stamp: getStamp(),
          })
          .then((res) => {
            console.log('获取设备状态')
            console.log(res)
            if (res.data.code != 0) {
              deviceInfo.isOnline = false
              deviceInfo.bgImage = this.data.bgImage.off
              sliderTemperature.color = DISABLED_COLOR
              sliderTemperature = parseComponentModel(sliderTemperature)
              switchKeepWarm.selected = false
              settingParams.isKeepWarm = false
              switchKeepWarm = parseComponentModel(switchKeepWarm)
              this.setData({ deviceInfo, sliderTemperature, switchKeepWarm, settingParams })
              let msg = PluginConfig.handleErrorMsg(res.data.code)
              MideaToast(msg)
              resolve(res)
            }
            try {
              deviceInfo.isOnline = true
              this.dataInit(res.data.data)
            } catch (e) {
              console.error(e)
            }
            resolve(res)

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
            deviceInfo.bgImage = this.data.bgImage.off
            sliderTemperature.color = DISABLED_COLOR
            sliderTemperature = parseComponentModel(sliderTemperature)
            switchKeepWarm.selected = false
            settingParams.isKeepWarm = false
            switchKeepWarm = parseComponentModel(switchKeepWarm)
            this.setData({ deviceInfo, sliderTemperature, switchKeepWarm, settingParams })
            let res = err.data
            if (res) {
              if (res.result && res.result.returnData) {
                res = JSON.parse(res.result.returnData)
              }
              if (res.code != 0) {
                if (res.code !== 1307) {
                  let msg = PluginConfig.handleErrorMsg(res.code)
                  MideaToast(msg)
                }
              } else {
                MideaToast('未知错误-状态')
              }
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
          })
      })
    },
    rangersBurialPointClick(eventName, param) {
      let deviceInfo = this.data.deviceInfo
      if (deviceInfo) {
        let paramBurial = {}
        let paramBase = {
          module: '插件',
          apptype_name: '电水壶',
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
  attached() {
    console.log('组件渲染')
    console.log(this.properties.applianceData)
    if (this.properties.applianceData) {
      let deviceInfo = this.data.deviceInfo
      Object.assign(deviceInfo, this.properties.applianceData)
      let sliderTemperature = parseComponentModel(this.data.sliderTemperature)
      let switchKeepWarm = parseComponentModel(this.data.switchKeepWarm)
      let settingParams = this.data.settingParams
      if (deviceInfo.onlineStatus == DeviceData.onlineStatus.online) {
        deviceInfo.isOnline = true
        deviceInfo.bgImage = this.data.bgImage.on
        sliderTemperature.color = THEME_COLOR
        switchKeepWarm.selected = true
        settingParams.isKeepWarm = true
      } else {
        deviceInfo.isOnline = false
        deviceInfo.bgImage = this.data.bgImage.off
        sliderTemperature.color = DISABLED_COLOR
        switchKeepWarm.selected = false
        settingParams.isKeepWarm = false
      }
      sliderTemperature = parseComponentModel(sliderTemperature)
      switchKeepWarm = parseComponentModel(switchKeepWarm)
      let param = {}
      param['page_name'] = '首页'
      param['object'] = '进入插件页'
      this.rangersBurialPointClick('plugin_page_view', param)
      this.setData({ deviceInfo, sliderTemperature, switchKeepWarm, settingParams })
      this.openMeiJuAppPosInit()
      this.updateStatus().then((res) => {
        this.deviceStatusInterval()
      })
    }
  },
  detached() {
    this.clearDeviceStatusInterval()
    deviceStatusTimer = null
  },
})
