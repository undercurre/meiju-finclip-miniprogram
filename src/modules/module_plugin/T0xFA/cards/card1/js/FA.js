import { imageDomain } from '../../../assets/scripts/api'
export const FA = {
  // 主题色默认值（用来判断）
  themeColor: {
    default: '#267AFF',
    '24FG': '#00CBB8'
  },

  // 快开配置的code值
  baseImageUrl: 'http://ce-cdn.oss-cn-hangzhou.aliyuncs.com/ccs/icon',

  apiCode: {
    power: 0, // 开关
    voice: 1, // 声音
    lock: 2, // 童锁
    mode: 3, // 模式
    swing: 4, // 左右摇头
    gear: 5, // 风速(档位)
    timing: 6, // 定时
    spinSwitch: 7, // 内旋
    tempWindSwitch: 8, // 风随温变
    humidify: 9, // 加湿
    airDried: 10, // 风干
    udSwing: 11, // 上下摇头
    waterions: 12, // 净离子
    displayOnOff: 13, // 熄屏
    breathLight: 14, // 氛围灯
    charge: 15, // 无线充电
    anion: 16, // 负离子
    isSupportWaterShortness: 17, // 是否有缺水提醒
  },

  // 配置的key值
  apiKey: {
    power: 'power', // 开关
    voice: 'voice', // 声音
    lock: 'lock', // 童锁
    mode: 'mode', // 模式
    swing: 'swing', // 左右摇头
    gear: 'gear', // 风速(档位)
    timing: 'timing', // 定时
    spinSwitch: 'spinSwitch', // 内旋
    tempWindSwitch: 'tempWindSwitch', // 风随温变
    humidify: 'humidify', // 加湿
    airDried: 'airDried', // 风干
    udSwing: 'udSwing', // 上下摇头
    waterions: 'waterions', // 净离子
    displayOnOff: 'displayOnOff', // 熄屏
    breathLight: 'breathLight', // 氛围灯
    charge: 'charge', // 无线充电
    anion: 'anion', // 负离子
    isSupportWaterShortness: 'isSupportWaterShortness', // 是否有缺水提醒
  },

  // 获取常规配置
  getValueArray(settings, options) {
    let valueArray = []
    let { hasIcon, isTiming } = options || {}
    if (settings && settings.length > 0) {
      // 避免重复添加
      const diffArr = {}
      settings.forEach((settingItem) => {
        let properties = settingItem.properties
        if (properties.list && properties.list.length > 0) {
          properties.list.forEach((item) => {
            if (!diffArr[item.label] && !isTiming) {
              diffArr[item.label] = true
              let params = {
                value: item.value,
                label: item.label,
              }
              if (hasIcon) {
                params.iconUrl = this.getModeIcon(item.value)
              }
              valueArray.push(params)
            } else if (!diffArr[item.label] && isTiming) {
              valueArray.push(item.value)
            }
          })
        }
      })
    }
    return valueArray
  },
  // 获取工作模式图标
  getModeIcon(mode) {
    do {
      if (!mode) {
        console.warn('获取工作模式图标 - invalid mode')
        break
      }
      let iconUrl = undefined
      switch (mode) {
        case this.mode.normal:
          iconUrl = {
            url1: imageDomain + '/0xFA/icon_zhengchangfeng.png',
            url2: imageDomain + '/0xFA/icon_zhengchangfeng1.png',
          }
          break
        case this.mode.natural:
          iconUrl = {
            url1: imageDomain + '/0xFA/icon_ziranfeng.png',
            url2: imageDomain + '/0xFA/icon_ziranfeng1.png',
          }
          break
        case this.mode.sleep:
          iconUrl = {
            url1: imageDomain + '/0xFA/icon_shuimian.png',
            url2: imageDomain + '/0xFA/icon_shuimian1.png',
          }
          break
        case this.mode.comfort:
          iconUrl = {
            url1: imageDomain + '/0xFA/icon_shushi.png',
            url2: imageDomain + '/0xFA/icon_shushi1.png',
          }
          break
        case this.mode.mute:
          iconUrl = {
            url1: imageDomain + '/0xFA/icon_jingyinfeng.png',
            url2: imageDomain + '/0xFA/icon_jingyinfeng1.png',
          }
          break
        case this.mode.baby:
          iconUrl = {
            url1: imageDomain + '/0xFA/icon_baobaofeng.png',
            url2: imageDomain + '/0xFA/icon_baobaofeng1.png',
          }
          break
        case this.mode.feel:
          iconUrl = {
            url1: imageDomain + '/0xFA/icon_renganfeng.png',
            url2: imageDomain + '/0xFA/icon_renganfeng1.png',
          }
          break
        case this.mode.storm:
          iconUrl = {
            url1: imageDomain + '/0xFA/icon_baofeng.png',
            url2: imageDomain + '/0xFA/icon_baofeng1.png',
          }
          break
        case this.mode.strong:
          iconUrl = {
            url1: imageDomain + '/0xFA/icon_qiangjinfeng.png',
            url2: imageDomain + '/0xFA/icon_qiangjinfeng1.png',
          }
          break
        case this.mode.soft:
          iconUrl = {
            url1: imageDomain + '/0xFA/icon_qingroufeng.png',
            url2: imageDomain + '/0xFA/icon_qingroufeng1.png',
          }
          break
        case this.mode.customize:
          iconUrl = {
            url1: imageDomain + '/0xFA/icon_zidingyifeng.png',
            url2: imageDomain + '/0xFA/icon_zidingyifeng1.png',
          }
          break
        case this.mode.warm:
          iconUrl = {
            url1: imageDomain + '/0xFA/icon_nuanfeng.png',
            url2: imageDomain + '/0xFA/icon_nuanfeng1.png',
          }
          break
        case this.mode.smart:
          iconUrl = {
            url1: imageDomain + '/0xFA/icon_smart.png',
            url2: imageDomain + '/0xFA/icon_smart1.png',
          }
          break
        case this.mode.purified_wind:
          iconUrl = {
            url1: imageDomain + '/0xFA/icon_purified_wind.png',
            url2: imageDomain + '/0xFA/icon_purified_wind1.png',
          }
          break
        case this.mode.sleeping_wind:
          iconUrl = {
            url1: imageDomain + '/0xFA/icon_shuimian.png',
            url2: imageDomain + '/0xFA/icon_shuimian1.png',
          }
          break
        case this.mode.purify_only:
          iconUrl = {
            url1: imageDomain + '/0xFA/icon_purify_only.png',
            url2: imageDomain + '/0xFA/icon_purify_only1.png',
          }
          break
        case this.mode.self_selection:
          iconUrl = {
            url1: imageDomain + '/0xFA/icon_optional.png',
            url2: imageDomain + '/0xFA/icon_optional1.png',
          }
          break
        case this.mode.ecology:
          iconUrl = {
            url1: imageDomain + '/0xFA/icon_nature_cool.png',
            url2: imageDomain + '/0xFA/icon_nature_cool1.png',
          }
          break
      }
      return iconUrl
    } while (false)
  },
  // 工作模式
  mode: {
    normal: 'normal', // 正常风
    natural: 'natural', // 自然风
    sleep: 'sleep', // 睡眠风
    comfort: 'comfort', // 舒适风
    mute: 'mute', // 静音风
    baby: 'baby', // 宝宝风
    feel: 'feel', // 人感
    storm: 'storm', // 暴风/快循环
    strong: 'strong', // 强劲风
    soft: 'soft', // 轻柔风
    customize: 'customize', // 自定义风形
    warm: 'warm', // 暖风
    smart: 'smart', // 智能
    purified_wind: 'purified_wind', // 净化风
    sleeping_wind: 'sleeping_wind', // 安睡风
    purify_only: 'purify_only', // 纯净化
    self_selection: 'self_selection', // 正常风
    ecology: 'ecology', //生态风
  },
  // 开关组件的key列表(摇头、屏幕显示有的是多个参数，根据valueArray判断是否开关)
  // switchModelList: ['anion','lock','voice','swing','udSwing','tempWindSwitch','humidify','waterions','breathLight','airDried'],
  // 设备图配置
  mainPicMap: {
    "560011AF": 0,
    "56001174": 0,
    "5600117P": 0,
    "56001024": 0,
    "56001104": 0,
    "56001103": 0,
    "56001172": 0,
    "AMS125HB": 0,
    "560011AL": 2,
    "5600119Z": 2,
    "560011AH": 2,
    "560011B0": 2,
    "560011AJ": 2,
    "56000287": 2,
    "560011C2": 2,
    "5600117B": 2,
    "56100311": 2,
    "56011C97": 3,
    "56011C86": 3,
    "56011C87": 3,
    "56011C91": 3,
    "56011CB4": "56011CB4",
    "56011C8W": 3,
    "56011CDL": "56011CDL",
    "56011CDD": "56011CDD"
  },
  // 解析快开配置参数
  quickDevJson2Local(quickDevJson) {
    let local_json = {
      model: quickDevJson.productName,
      subType: parseInt(quickDevJson.productModelNumber),
      functions: {},
      properties: {},
    }
    if (quickDevJson.properties && quickDevJson.properties.length > 0) {
      quickDevJson.properties.forEach((propertyItem) => {
        let propertiesMap = new Map()
        if (propertyItem.settings && propertyItem.settings.length > 0) {
          propertyItem.settings.forEach((settingItem) => {
            // if (propertiesMap.has(settingItem.apiKey)) {
            //   local_json.properties[settingItem.apiKey].push(settingItem.properties)
            // } else {
              propertiesMap.set(settingItem.apiKey, true)
              local_json.properties[settingItem.apiKey] = settingItem.properties.value
            // }
          })
        }
      })
    }

    if (quickDevJson.functions && quickDevJson.functions.length > 0) {
      quickDevJson.functions.forEach((functionItem) => {
        let functionsMap = new Map()
        if (functionItem.settings && functionItem.settings.length > 0) {
          functionItem.settings.forEach((settingItem) => {
            if (functionsMap.has(settingItem.apiKey)) {
              local_json.functions[settingItem.apiKey].settings.push(settingItem.properties)
            } else {
              functionsMap.set(settingItem.apiKey, true)
              local_json.functions[settingItem.apiKey] = {
                code: functionItem.code,
                name: functionItem.name,
                settings: [settingItem.properties],
              }
            }
          })
        }
      })
    }

    return local_json
  },
  // 处理错误信息
  handleErrorMsg(errCode) {
    let rtn = '系统提示: ' + errCode
    errCode = Number(errCode)
    switch (errCode) {
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
}

export function getTimeRange() {
  return {
    hour: [1, 24],
  }
}

export const modeDesc = {
  normal: '正常风',
  natural: '自然风',
  sleep: '睡眠风',
  comfort: '舒适风',
  feel: '人感',
  baby: '宝宝风',
  mute: '静音风',
  storm: '循环风',
  strong: '强劲风',
  soft: '轻柔风',
  warm: '暖风',
  customize: '自定义',
}

export const modeName = {
  warmAir: '暖风',
  coldAir: '冷风',
  gear: '挡位',
  shake: '摆风',
  humidityMode: '加湿',
  eco: '节能',
  timer: '定时',
}

export const pickerType = {
  timerOn: 'timerOn',
  timerOff: 'timerOff',
  gear: 'gear',
}

export const errorName = {
  1: '传感器断路',
  2: '传感器短路',
  3: '电机反馈异常(闭环电机)',
  4: '倾倒保护',
  8: '摇头卡住',
  9: '拆机保护',
}

//特定摇头SN
const given = ['560011B3'];
// 上下摇头参数解析
export function swingUdFilter_FA({data, deviceSn8, status}) {
  const specified = given.includes(deviceSn8) ? '90' : data
  const params = {}
  if (status.swing == 'on' && status.swing_direction == 'ud') {
    if (data == 'off' || data == 0) {
      params.swing = 'off'
    } else {
      params.swing = 'on'
      params.swing_direction = 'ud'
      params.ud_swing_angle = specified
    }
  } else if (status.swing == 'on' && status.swing_direction == 'lr') {
    if (data == 'off' || data == 0) {
      // params.swing = 'off'
      params.swing = 'on'
      params.swing_direction = 'lr'
      params.swing_angle = status.swing_angle
    } else {
      params.swing = 'on'
      params.swing_direction = 'udlr'
      params.ud_swing_angle = specified
    }
  } else if (status.swing == 'on' && status.swing_direction == 'udlr') {
    if (data == 'off' || data == 0) {
      params.swing = 'on'
      params.swing_direction = 'lr'
    } else {
      params.swing = 'on'
      params.swing_direction = 'udlr'
      params.ud_swing_angle = specified
    }
  } else if (status.swing == 'off') {
    if (data == 'off' || data == 0) {
      params.swing = 'off'
    } else {
      params.swing = 'on'
      params.swing_direction = 'ud'
      params.ud_swing_angle = specified
    }
  } else if (data == 'off' || data == 0) {
    params.swing = 'off'
  } else {
    params.swing = 'on'
    params.swing_direction = 'ud'
    params.ud_swing_angle = specified
  }

  // params.ud_diy_swing = 'off'
  return params
}
// 左右摇头参数解析
export function shakeParamsTransfer_FA({data, isNewSwingProtocol = true, status,swingList=[]}) {
  console.log('shakeParamsTransfer_FA enter: ',{data,isNewSwingProtocol,swingList})
  if(isNewSwingProtocol){
    if(data){
      data = data?1275:0
    } else {
      data = 0
    }
  } else {
    if(data){
      // 默认90度，如果状态有角度，则用角度值；否则用配置表里的第一个角度~~!!!
      let dir = '90'
      let curDir = status.swing_angle == 'unknown' ? 'off' : status.swing_angle
      if (curDir && curDir != 'unknown') {
        dir = curDir
      }
      if (!(swingList.length == 0)) {
        dir = swingList[1].value
      }
      data = dir
    } else {
      data = 'off'
    }
  }
  console.log('shakeParamsTransfer_FA: ',data)
  let swing = null
  let angel = null
  if (data == 'on') {
    swing = data
    angel = isNewSwingProtocol ? '1275' : '90'
  } else if (data == 'off' || data == 0) {
    swing = isNewSwingProtocol ? 'off' : status.swing_direction.indexOf('ud') > -1 ? 'on' : 'off'
    angel = 0
  } else {
    swing = 'on'
    angel = data
  }
  let swing_direction
  if(status.swing_direction&&status.swing_direction.indexOf('ud') > -1) {
    if(data == 'off' || data == 0) {
      swing_direction = 'ud'
    } else {
      swing_direction = 'udlr'
    }
  } else {
    swing_direction = 'lr'
  }
  let params = isNewSwingProtocol ? {
      swing_direction: 'lr',
      swing_angle: angel
    } : {
      swing,
      swing_direction,
      swing_angle: angel
    }
    // if(angel !== null) {
    //   params.swing_angle = angel
    // }
  ;['off'].includes(data) && delete params.swing_angle

  return params
}

