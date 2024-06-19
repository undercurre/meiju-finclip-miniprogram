import { imageDomain } from '../../assets/scripts/api'
export const FD = {
  // 获取工作模式图标
  getHumidityModeIcon(mode) {
    do {
      if (!mode) {
        console.warn('获取工作模式图标-缺少加湿器模式')
        break
      }
      let iconUrl = undefined
      switch (mode) {
        case this.humidityMode.continue:
          iconUrl = {
            url1: imageDomain + '/0xFD/icon_lianxu.png',
            url2: imageDomain + '/0xFD/icon_lianxu2.png',
          }
          break
        case this.humidityMode.parlour:
          iconUrl = {
            url1: imageDomain + '/0xFD/icon_keting.png',
            url2: imageDomain + '/0xFD/icon_keting2.png',
          }
          break
        case this.humidityMode.bedroom:
          iconUrl = {
            url1: imageDomain + '/0xFD/icon_woshi.png',
            url2: imageDomain + '/0xFD/icon_woshi2.png',
          }
          break
        case this.humidityMode.kitchen:
          iconUrl = {
            url1: imageDomain + '/0xFD/icon_chuwei.png',
            url2: imageDomain + '/0xFD/icon_chuwei2.png',
          }
          break
        case this.humidityMode.manual:
          iconUrl = {
            url1: imageDomain + '/0xFD/icon_shoudong.png',
            url2: imageDomain + '/0xFD/icon_shoudong2.png',
          }
          break
        case this.humidityMode.auto:
          iconUrl = {
            url1: imageDomain + '/0xFD/icon_zidong.png',
            url2: imageDomain + '/0xFD/icon_zidong2.png',
          }
          break
        case this.humidityMode.sleep:
          iconUrl = {
            url1: imageDomain + '/0xFD/icon_shuimian.png',
            url2: imageDomain + '/0xFD/icon_shuimian2.png',
          }
          break
      }
      return iconUrl
    } while (false)
  },
  // 工作模式
  humidityMode: {
    continue: 'continue', // 连续工作模式
    parlour: 'parlour', // 客厅模式
    bedroom: 'bedroom', // 卧室模式
    kitchen: 'kitchen', // 厨卫模式（儿童）
    manual: 'manual', // 手动模式
    auto: 'auto', // 自动模式
    sleep: 'sleep', // 睡眠模式
  },

  // 快开配置的key值
  apiKey: {
    power: 'power', // 开关
    mode: 'mode', // 模式
    timing: 'timing', // 定时
    humidity: 'humidity', // 湿度
    showSpecialGear: 'showSpecialGear', // 恒湿自动调整
    gear: 'gear', // 风速雾量档位
    windSpeed: 'windSpeed', // 风速(风挡)
    light: 'light', // 灯光
    netIons: 'netIons', // 净离子
    airDry: 'wetCurtain', // 湿帘风干
    buzzer: 'buzzer', // 声音
    displayOnOff: 'displayOnOff', // 屏幕显示
    showHumidityNum: 'showHumidityNum', // 是否显示湿度数值
    disinfection: 'disinfection', // 是否灭菌
  },

  // 处理错误信息
  handleErrorMsg(errCode) {
    let rtn = '系统提示: ' + errCode
    errCode = Number(errCode)
    switch (errCode) {
      case 1:
        rtn = '室内板与显示板通信故障Eb'
        break
      case 4:
        rtn = '过零检测故障'
        break
      case 10:
        rtn = '室内温度传感器故障'
        break
      case 34:
        rtn = '水满保护'
        break
      case 36:
        rtn = '水量不足，请加水后使用'
        break
      case 50:
        rtn = '雾化片失效'
        break
      case 51:
        rtn = '过流保护'
        break
      case 52:
        rtn = 'SPW器件损坏'
        break
      case 53:
        rtn = '加湿器倾倒了，请扶起加湿器后再启动'
        break
      case 54:
        rtn = '电解保护'
        break
      case 1306:
        rtn = '设备未响应'
        break
      case 1307:
        rtn = '设备已离线，请检查网络状态'
        break
    }
    return rtn
  },

  // 重定向至不支持页面
  redirectUnSupportDevice(deviceInfo) {
    wx.redirectTo({
      url:
        `/pages/unSupportDevice/unSupportDevice?backTo=/pages/index/index&deviceInfo=` +
        encodeURIComponent(JSON.stringify(deviceInfo)),
    })
  },

  // 解析快开配置参数
  quickDevJson2Local(quickDevJson) {
    let local_json = {
      model: quickDevJson.productName,
      subType: parseInt(quickDevJson.productModelNumber),
      functions: [],
      properties: {},
    }

    if (quickDevJson.properties && quickDevJson.properties.length > 0) {
      local_json.properties = {}
      quickDevJson.properties.forEach((propertyItem) => {
        if (propertyItem.settings && propertyItem.settings.length > 0) {
          local_json.properties[propertyItem.settings[0].apiKey] = propertyItem.settings[0].properties
        }
      })
    }

    let functions = []
    if (quickDevJson.functions && quickDevJson.functions.length > 0) {
      quickDevJson.functions.forEach((functionItem) => {
        if (functionItem.settings && functionItem.settings.length > 0) {
          functionItem.settingsData = {}
          // 检查工作状态
          functionItem.settings.forEach((settingItem) => {
            if (settingItem.apiKey === 'setWorkTime') {
              functionItem.expectedCookTime = settingItem.properties.defaultValue || settingItem.properties.value
            }
            functionItem.settingsData[settingItem.apiKey] = settingItem
          })
        }
        functions.push(functionItem)
      })
    }
    local_json.functions = functions

    return local_json
  },
}

export function getTimeRange() {
  return {
    hour: [1, 24],
  }
}

export const modeDesc = {
  cold_air: '冷风',
  normal: '暖风',
  constant_temperature: '智能模式',
}

export const modeName = {
  continue: '连续',
  parlour: '客厅',
  bedroom: '卧室',
  kitchen: '厨卫',
}

export const pickerType = {
  timerOn: 'timerOn',
  timerOff: 'timerOff',
  gear: 'gear',
}
