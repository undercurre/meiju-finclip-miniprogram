// plugin/T0x40/components/cell-list/cell-list.js
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
    functionList: [
      {
        key: 'autoWind',
        functionName: '自动摆风',
        tip: '',
        isShow: false,
        isSwitchOn: false,
        icon: image.swing_white_small,
      },
      { key: 'light', functionName: '照明', tip: '', isShow: true, isSwitchOn: false, icon: image.light_white_small },
      {
        key: 'sensor',
        functionName: '异味感应',
        tip: '关机状态下，监测到异味时自动换气',
        isShow: false,
        isSwitchOn: false,
        icon: image.smoke_sensing_white_small,
      }, // tip: 自动换气已开启
    ],
    listShowCnt: 0, //列表显示的条数
    isOffLine: false, //是否离线
    isOff: false, //是否电源关
    curThemeColor: '#00CBB8', //开机时的主题色，换气#00CBB8，强风#267AFF，弱风#29C3FF，照明#FFAA10
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onCellSwitchClick(data) {
      let index = parseInt(data.currentTarget.dataset.item)
      if (index == 0) {
        let isAutoWindDirection = statusX.isAutoWindDirection()
        let value = isAutoWindDirection ? '254' : '253'
        this.sendControl({
          blowing_direction: value,
        })
      } else if (index == 1) {
        let isMainLightEnable = statusX.isMainLightEnable()
        let value = isMainLightEnable ? 'close_all' : 'main_light'
        this.sendControl({
          light_mode: value,
        })
      } else if (index == 2) {
        let isSmellEnable = statusX.isSmellEnable()
        let value = isSmellEnable ? 'off' : 'on'
        this.sendControl({
          smelly_enable: value,
        })
      }
    },
    updateView() {
      let isOff = statusX.isOff()
      let list = this.data.functionList
      let showCnt = 0

      let isMainLightEnable = statusX.isMainLightEnable()
      let isBlowingEnable = statusX.isBlowingEnable()
      let isAutoWindDirection = statusX.isAutoWindDirection()
      let isVentilationEnable = statusX.isVentilationEnable()
      let isSmellEnable = statusX.isSmellEnable()
      let isSmellTrigger = statusX.isSmellTrigger()
      let windSpeed = statusX.windSpeed()

      if (isOff) {
        list[0].isShow = false
        list[1].isShow = true
        list[2].isShow = true
        showCnt = 2
      } else {
        if (isVentilationEnable && !isBlowingEnable) {
          list[0].isShow = false
          list[1].isShow = true
          list[2].isShow = true
          showCnt = 2
        } else {
          list[0].isShow = true
          list[1].isShow = true
          list[2].isShow = true
          showCnt = 3
        }
      }

      if (isAutoWindDirection) list[0].isSwitchOn = true
      else list[0].isSwitchOn = false

      if (isMainLightEnable) list[1].isSwitchOn = true
      else list[1].isSwitchOn = false

      if (isSmellEnable) list[2].isSwitchOn = true
      else list[2].isSwitchOn = false

      let themeColor = '#7C879B'
      if (isMainLightEnable) themeColor = '#FFAA10'
      if (isVentilationEnable) {
        if (isSmellTrigger) {
          if (isMainLightEnable) themeColor = '#FFAA10'
          else themeColor = '#7C879B'
        } else {
          themeColor = '#00CBB8'
        }
      }
      if (isBlowingEnable) {
        if (windSpeed > 0 && windSpeed <= 34) {
          themeColor = '#29C3FF'
        } else if (windSpeed > 34) {
          themeColor = '#267AFF'
        }
      }

      this.setData({
        functionList: list,
        listShowCnt: showCnt,
        isOff: isOff,
        curThemeColor: themeColor,
      })
    },
    sendControl(jsonObj) {
      this.triggerEvent('sendControlJson', jsonObj)
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
