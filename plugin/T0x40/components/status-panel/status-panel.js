// plugin/T0x40/component/status-panel/status-panel.js
import { image } from '../../config/getImage'
import statusX from '../../config/statusX'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    deviceStatus: {
      type: Object,
      value: {},
    },
    deviceIsOnline: {
      type: Boolean,
      value: false,
    },
  },
  /**
   * 监听数据变化
   */
  observers: {
    deviceStatus(newVal) {
      statusX.setStatus(newVal)
      this.updateView()
    },
    deviceIsOnline(newVal) {
      this.setData({
        isOffLine: !newVal,
      })
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    isOffLine: true, // 是否离线
    isOff: true, // 是否全关
    isMainLightEnable: false, // 是否照明开启
    isBlowingEnable: false, // 是否吹风模式
    isVentilationEnable: false, // 是否换气模式
    curWindModeText: '', // 当前模式文本
    curWindBG: image.huanqi_animation, // 当前风背景图
    curSubBlockWidth: 0, // 当前子状态块宽度 120/240/360
    curSubStatusText: '', // 当前子状态文本 /摆风 | 照明 | 自动换气
    isShowModeTextLine: false,
    isSensoring: false, // 是否异味感应中
    isAutoVentilationEnable: false, // 是否自动换气中
  },
  /**
   * 组件的方法列表
   */
  methods: {
    updateView() {
      let isSmellEnable = statusX.isSmellEnable()
      let isOff = statusX.isOff()
      let isMainLightEnable = statusX.isMainLightEnable()
      let isBlowingEnable = statusX.isBlowingEnable()
      let isVentilationEnable = statusX.isVentilationEnable()
      let isAutoVentilationEnable = statusX.isSmellTrigger()

      let modeText = ''
      let windSpeed = statusX.windSpeed()
      let bgImage = ''
      let isShowLine = false
      if (isBlowingEnable) {
        if (windSpeed > 0 && windSpeed <= 34) {
          modeText += '弱风'
          bgImage = image.ruofeng_animation
        } else if (windSpeed > 34) {
          modeText += '强风'
          bgImage = image.qiangfeng_animation
        }
      }
      if (isVentilationEnable) {
        if (modeText == '') modeText += '换气'
        else {
          isShowLine = true
          modeText += '　换气'
        }
        if (bgImage == '') bgImage = image.huanqi_animation
      }

      let width = 0
      let subStatusText = ''
      if (statusX.isAutoWindDirection()) {
        subStatusText += '摆风'
        width += 120
      }
      if (isMainLightEnable) {
        width += 120
        if (subStatusText == '') subStatusText += '照明'
        else {
          subStatusText += ' | 照明'
        }
      }

      this.setData({
        isOff: isOff,
        isMainLightEnable: isMainLightEnable,
        isBlowingEnable: isBlowingEnable,
        isVentilationEnable: isVentilationEnable,
        curWindModeText: modeText,
        curWindBG: bgImage,
        curSubBlockWidth: width,
        curSubStatusText: subStatusText,
        isShowModeTextLine: isShowLine,
        isSensoring: isSmellEnable,
        isAutoVentilationEnable: isAutoVentilationEnable,
      })
    },
  },
  /**
   * 组件的生命周期函数
   */
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      this.setData({
        isOffLine: !this.properties.deviceIsOnline,
      })

      statusX.setStatus(this.properties.deviceStatus)
      this.updateView()
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
})
