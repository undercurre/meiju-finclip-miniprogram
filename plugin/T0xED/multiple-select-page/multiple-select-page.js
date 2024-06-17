import computedBehavior from '../../../utils/miniprogram-computed'

import { getAssistant } from '../assistant/platform/wechat/plugins/ED/index'
import assistantBehavior from '../assistant/platform/wechat/ability/mixins/index'
let assistant = getAssistant()

Page({
  behaviors: [
    computedBehavior,
    ...assistantBehavior(
      assistant,
      ['deviceInfo', 'deviceSetting', '$quantifySet.quantifySetDisable', '$tempSet.tempSetDisable', 'deviceStatus'],
      ['$quantifySet.setQuantify', '$tempSet.setTemp']
    ),
  ],

  data: {
    type: '',
    // 当前设置的定量项
    active: -1,
    isIphoneX: false,
    // 选择器
    showPicker: false,
    pickerRange: [],
    pickerValue: 0,
    pickerUnit: '',
    changing: false,
  },
  computed: {
    list() {
      const { deviceSetting, deviceStatus, type } = this.data
      if (deviceSetting && deviceStatus && type) {
        if (type === 'quantifySet') {
          if (deviceSetting.quantifyList) {
            return deviceSetting.quantifyList.map((item) => {
              if (deviceStatus.hasOwnProperty('version')) {
                let { ctrlMl, quantifyLabel = [], quantifyRange = [], quantifyKind = 0 } = item
                let currentQuantify = ctrlMl
                  ? deviceStatus[`quantify_${quantifyKind}`]
                  : deviceStatus[`quantify_${quantifyKind}`] * 10
                if (quantifyLabel.length > 0) {
                  item.rightText = quantifyLabel[quantifyRange.indexOf(currentQuantify)]
                } else {
                  item.rightText = currentQuantify === 0 ? '关闭' : currentQuantify + 'ml'
                }
              } else {
                item.rightText = ''
              }
              return item
            })
          } else {
            return []
          }
        } else if (type === 'tempSet') {
          if (deviceSetting.tempList || deviceSetting.tempList4Level3) {
            return deviceSetting[deviceSetting.tempList ? 'tempList' : 'tempList4Level3'].map((item) => {
              if (deviceStatus.hasOwnProperty('version')) {
                let { waterKind, temperatureLabel = [], temperatureRange: tempRange = [], range = [] } = item
                let temperatureRange = deviceSetting.tempList ? tempRange : range
                if (typeof waterKind === 'number') {
                  //2014指令1-绿茶(管线机协议上的绿茶相当于泡茶) 2-枸杞 3-蜂蜜 4-冲奶 5-咖啡
                  if (waterKind == 1) {
                    item.rightText = deviceStatus['tea_temperature'] + '℃'
                  } else if (waterKind == 2) {
                    item.rightText = deviceStatus['medlar_temperature'] + '℃'
                  } else if (waterKind == 3) {
                    item.rightText = deviceStatus['honey_temperature'] + '℃'
                  } else if (waterKind == 4) {
                    item.rightText = deviceStatus['milk_temperature'] + '℃'
                  } else if (waterKind == 5) {
                    item.rightText = deviceStatus['coffee_temperature'] + '℃'
                  }
                } else if (typeof waterKind === 'string') {
                  //0215新指令直接用具体字段命名
                  if (deviceStatus[waterKind]) {
                    if (temperatureLabel.length > 0) {
                      let index = temperatureRange.indexOf(Number(deviceStatus[waterKind]))
                      item.rightText = temperatureLabel[index]
                    } else {
                      item.rightText = deviceStatus[waterKind] + '℃'
                    }
                  } else {
                    item.rightText = ''
                  }
                }
              } else {
                item.rightText = ''
              }
              return item
            })
          } else {
            return []
          }
        } else {
          return []
        }
      } else {
        return []
      }
    },
  },

  onLoad({ type }) {
    this.setData({ type })
    wx.getSystemInfo({
      success: (res) => this.setData({ isIphoneX: res.safeArea.top > 20 }),
    })
    assistant.setPageTrack({
      page_id: type === 'quantifySet' ? 'page_quantify' : 'page_temp',
      page_name: type === 'quantifySet' ? '定量页' : '定温页',
    })
  },

  onUnload: function () {
    // 页面销毁时执行
    assistant.popPageTrack()
  },

  onQuantifyCellClick({
    currentTarget: {
      dataset: { index },
    },
  }) {
    const { deviceStatus, deviceSetting, quantifySetDisable } = this.data
    if (!deviceSetting || !deviceStatus.hasOwnProperty('version') || quantifySetDisable) return
    const { quantifyRange, quantifyLabel = [], ctrlMl, quantifyKind } = deviceSetting.quantifyList[index]
    const currentQuantify = ctrlMl
      ? deviceStatus[`quantify_${quantifyKind}`]
      : deviceStatus[`quantify_${quantifyKind}`] * 10
    const quantifyIndex = quantifyRange.findIndex((item) => item == currentQuantify)
    // console.log({ currentQuantify, quantifyIndex });
    this.setData({
      pickerRange: quantifyLabel.length ? quantifyLabel : quantifyRange,
      pickerValue: quantifyIndex,
      pickerUnit: quantifyLabel.length ? '' : 'ml',
      active: index,
      showPicker: true,
    })
  },

  onTempCellClick({
    currentTarget: {
      dataset: { index },
    },
  }) {
    const { deviceSetting, deviceStatus, tempSetDisable } = this.data
    if (!deviceSetting || !deviceStatus.hasOwnProperty('version') || tempSetDisable) return
    let {
      temperatureLabel = [],
      temperatureRange: tempRange = [],
      range = [],
      rangeLimit = false,
      waterKind,
    } = deviceSetting.tempList ? deviceSetting.tempList[index] : deviceSetting.tempList4Level3[index]
    const temperatureRange = deviceSetting.tempList ? tempRange : range
    let tRange = []
    if (rangeLimit) {
      if (waterKind === 'custom_temperature_1') {
        tRange = temperatureRange.slice(0, deviceStatus['custom_temperature_2'] - 46)
      } else if (waterKind === 'custom_temperature_2') {
        tRange = temperatureRange.slice(
          deviceStatus['custom_temperature_1'] - 45,
          deviceStatus['custom_temperature_3'] - 46
        )
      } else if (waterKind === 'custom_temperature_3') {
        tRange = temperatureRange.slice(
          deviceStatus['custom_temperature_2'] - 45,
          deviceStatus['custom_temperature_4'] - 46
        )
      } else if (waterKind === 'custom_temperature_4') {
        tRange = temperatureRange.slice(
          deviceStatus['custom_temperature_3'] - 45,
          deviceStatus['custom_temperature_5'] - 46
        )
      } else if (waterKind === 'custom_temperature_5') {
        tRange = temperatureRange.slice(deviceStatus['custom_temperature_4'] - 45)
      }
    } else {
      tRange = temperatureRange
    }
    if (deviceStatus.plateau_power && deviceStatus.plateau_power === 'on' && deviceStatus.plateau_boiling_point) {
      let newTRange = []
      let newTemperatureLabel = []
      for (let i = 0; i < tRange.length; i++) {
        if (deviceStatus.plateau_boiling_point == 10 && tRange[i] <= 80) {
          // 显示沸点80℃，实际设置81℃, 兼容旧版电源板不能发送沸点值为1
          newTRange.push(tRange[i])
          temperatureLabel.length && newTemperatureLabel.push(temperatureLabel[i])
        } else if (tRange[i] <= deviceStatus.plateau_boiling_point / 10 + 80) {
          newTRange.push(tRange[i])
          temperatureLabel.length && newTemperatureLabel.push(temperatureLabel[i])
        }
      }
      tRange = newTRange
      temperatureLabel = newTemperatureLabel
      if (tRange.length < 1) {
        if (deviceStatus.plateau_power && deviceStatus.plateau_power === 'on' && deviceStatus.plateau_boiling_point) {
          wx.showToast({
            title: '已开启高原模式，无法设置高于沸点的水温',
            icon: 'none',
          })
        }
        return
      }
    }
    let idx = Math.floor(tRange.length / 2)
    if (typeof waterKind === 'number') {
      //2014指令1-绿茶(管线机协议上的绿茶相当于泡茶) 2-枸杞 3-蜂蜜 4-冲奶 5-咖啡
      if (
        waterKind === 1 &&
        deviceStatus['tea_temperature'] &&
        tRange.indexOf(Number(deviceStatus['tea_temperature'])) !== -1
      ) {
        idx = tRange.indexOf(Number(deviceStatus['tea_temperature']))
      } else if (
        waterKind === 2 &&
        deviceStatus['medlar_temperature'] &&
        tRange.indexOf(Number(deviceStatus['medlar_temperature'])) !== -1
      ) {
        idx = tRange.indexOf(Number(deviceStatus['medlar_temperature']))
      } else if (
        waterKind === 3 &&
        deviceStatus['honey_temperature'] &&
        tRange.indexOf(Number(deviceStatus['honey_temperature'])) !== -1
      ) {
        idx = tRange.indexOf(Number(deviceStatus['honey_temperature']))
      } else if (
        waterKind === 4 &&
        deviceStatus['milk_temperature'] &&
        tRange.indexOf(Number(deviceStatus['milk_temperature'])) !== -1
      ) {
        idx = tRange.indexOf(Number(deviceStatus['milk_temperature']))
      } else if (
        waterKind === 5 &&
        deviceStatus['coffee_temperature'] &&
        tRange.indexOf(Number(deviceStatus['coffee_temperature'])) !== -1
      ) {
        idx = tRange.indexOf(Number(deviceStatus['coffee_temperature']))
      }
    } else if (typeof waterKind === 'string') {
      //0215新指令直接用具体字段命名
      if (deviceStatus[waterKind] && tRange.indexOf(Number(deviceStatus[waterKind])) !== -1) {
        idx = tRange.indexOf(Number(deviceStatus[waterKind]))
      }
    }
    this.setData({
      pickerRange: temperatureLabel.length ? temperatureLabel : tRange,
      pickerValue: idx,
      pickerUnit: temperatureLabel.length ? '' : '℃',
      active: index,
      showPicker: true,
    })
  },

  //picker确认
  onConfirm(e) {
    this.setData({
      showPicker: false,
    })
    const { deviceStatus, deviceSetting, active, type } = this.data
    if (type === 'quantifySet') {
      //定量设置
      const { single, ctrlMl, quantifyKind, quantifyRange, title } = deviceSetting.quantifyList[active]
      if (deviceStatus.out_water === 'on') {
        wx.showToast({
          title: '机器正在出水，无法设置定量功能~',
          icon: 'none',
        })
      } else {
        let params = {}
        if (!single) {
          for (let i = 1; i < 6; i++) {
            params[`quantify_${i}`] = deviceStatus[`quantify_${i}`]
          }
        }
        params[`quantify_${quantifyKind}`] = ctrlMl ? quantifyRange[e.detail] : quantifyRange[e.detail] / 10
        //埋点
        params['widget_name'] = title
        params['ext_info'] = quantifyRange[e.detail] + 'ml'
        this.setQuantify(params)
      }
    } else {
      //定温设置
      const {
        waterKind,
        temperatureRange: tempRange = [],
        range = [],
        title,
      } = deviceSetting.tempList ? deviceSetting.tempList[active] : deviceSetting.tempList4Level3[active]
      const temperatureRange = deviceSetting.tempList ? tempRange : range

      const curTemp = temperatureRange[e.detail]
      let params = {}
      if (typeof waterKind === 'number') {
        params = {
          mode_kind: waterKind,
          mode_temperature: curTemp,
          mode_quantify: 0,
        }
      } else if (typeof waterKind === 'string') {
        params[waterKind] = curTemp
      }
      //埋点
      params['widget_name'] = title
      params['ext_info'] = curTemp + '℃'
      this.setTemp(params)
    }
  },
  onCancel() {
    this.setData({
      showPicker: false,
    })
  },
})
