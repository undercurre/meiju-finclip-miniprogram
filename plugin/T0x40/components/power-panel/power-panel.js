// plugin/T0x40/components/power-panel/power-panel.js
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
    iconPower: image.power_white,
    modeList: [
      { key: 'strong', modeName: '强风', isOn: false, iconOff: image.qiangfeng_back, iconOn: image.qiangfeng_white },
      { key: 'weak', modeName: '弱风', isOn: false, iconOff: image.ruofeng_back, iconOn: image.ruofeng_white },
      { key: 'switch', modeName: '换气', isOn: false, iconOff: image.huanqi_back, iconOn: image.huanqi_white },
    ],
    isOffLine: true, //是否离线
    isOff: true, //是否电源关
    isSelectingMode: false, //是否选择模式中
    curModeText: '开机', //当前模式显示文本 /开机/强风/弱风/换气
    curThemeColor: '#00CBB8', //开机时的主题色，换气#00CBB8，强风#267AFF，弱风#29C3FF
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onPowerClick() {
      if (this.data.isOffLine) return
      let isOff = statusX.isOff()
      if (isOff) {
        this.setData({
          isSelectingMode: true,
        })
      } else {
        this.setData({
          isSelectingMode: false,
        })
        this.sendControl({ mode: '' })
      }
    },
    onSelectCancelClick() {
      this.setData({
        isSelectingMode: false,
      })
    },
    onSelectModeClick(data) {
      let index = data.currentTarget.dataset.item
      let isBlowingEnable = statusX.isBlowingEnable()
      let isVentilationEnable = statusX.isVentilationEnable()
      let isSmellTrigger = statusX.isSmellTrigger()
      let windSpeed = statusX.windSpeed()

      if (index == 0) {
        if (isBlowingEnable && windSpeed > 34) {
          let value = ''
          if (isVentilationEnable) value = 'ventilation'
          this.sendControl({
            mode: value,
            blowing_speed: '100',
          })
        } else {
          this.sendControl({
            mode: 'blowing',
            blowing_speed: '100',
          })
        }
      } else if (index == 1) {
        if (isBlowingEnable && windSpeed <= 34) {
          let value = ''
          if (isVentilationEnable) value = 'ventilation'
          this.sendControl({
            mode: value,
            blowing_speed: '1',
          })
        } else {
          let value = 'blowing'
          if (isVentilationEnable) value += ',ventilation'
          this.sendControl({
            mode: value,
            blowing_speed: '1',
          })
        }
      } else if (index == 2) {
        if (isVentilationEnable && !isSmellTrigger) {
          let value = ''
          if (isBlowingEnable) value = 'blowing'
          this.sendControl({
            mode: value,
            blowing_speed: '1',
          })
        } else {
          let value = 'ventilation'
          if (isBlowingEnable) value = 'blowing,ventilation'
          this.sendControl({
            mode: value,
            blowing_speed: '1',
          })
        }
      }
    },
    updateView() {
      let isOff = statusX.isOff()

      let list = this.data.modeList
      let isBlowingEnable = statusX.isBlowingEnable()
      let isVentilationEnable = statusX.isVentilationEnable()
      let windSpeed = statusX.windSpeed()
      let isSmellTrigger = statusX.isSmellTrigger()

      for (let i = 0; i < list.length; i++) {
        list[i].isOn = false
      }
      let modeText = ''
      let themeColor = ''
      if (isOff) {
        modeText = '开机'
      } else {
        if (isBlowingEnable) {
          if (windSpeed > 0 && windSpeed <= 34) {
            list[1].isOn = true
            modeText = '弱风'
            themeColor = '#29C3FF'
          } else if (windSpeed > 34) {
            list[0].isOn = true
            modeText = '强风'
            themeColor = '#267AFF'
          }
        }
        if (isVentilationEnable) {
          if (!isSmellTrigger) {
            list[2].isOn = true
            if (modeText == '') modeText = '换气'
            else modeText += ' | 换气'
            themeColor = '#00CBB8'
          }
        }
        modeText += '模式'
      }

      this.setData({
        modeList: list,
        isOff: isOff,
        curModeText: modeText,
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
