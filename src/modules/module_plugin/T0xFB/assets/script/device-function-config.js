import { parseDeviceConfig } from './utils/request-param'
import { imageDomain } from '../../common/script/api'

export const DeviceFunctionConfig = {
  // 补全AO
  getAO(modelNumber) {
    let rtn = modelNumber
    for (let i = rtn.length; i < 8; i++) {
      rtn = '0' + rtn
    }
    return rtn
  },

  // 获取配置标签
  getConfigName(key, value) {
    let rtn = undefined
    if (key && value) {
      switch (key) {
        case 'mode':
          switch (value) {
            case this.mode.fastHot:
              rtn = '制热模式'
              break
            case this.mode.sleep:
              rtn = '睡眠模式'
            case this.mode.comfort:
              rtn = '舒适模式'
              break
            case this.mode.normal:
              rtn = '标准模式'
              break
            default:
              rtn = '模式 - ' + value
              break
          }
          break
        default:
          rtn = '未知设备状态'
          break
      }
    } else {
      console.warn('invalid key or value')
    }
    return rtn
  },

  // 获取模式图标
  getModeIcon(options) {
    let mode = options.mode
    let isActive = options.active
    let sn8 = options.sn8
    mode = parseDeviceConfig({
      type: 'mode',
      value: mode,
      sn8,
    })

    let rtn = imageDomain + '/0xFB/icon_zhire2.png'
    switch (mode) {
      case 'intelligent':
        // 智能
        if (isActive) {
          rtn = imageDomain + '/0xFB/icon_zhire2.png'
        } else {
          rtn = imageDomain + '/0xFB/icon_zhire.png'
        }
        break
      case 'efficient':
        // 节能
        if (isActive) {
          rtn = imageDomain + '/0xFB/icon_jieneng2.png'
        } else {
          rtn = imageDomain + '/0xFB/icon_jieneng.png'
        }
        break
      case 'sleep':
      case 'sleep_well':
      case 'sleep_well_cool':
        // 睡眠
        if (isActive) {
          rtn = imageDomain + '/0xFB/icon_shuimian2.png'
        } else {
          rtn = imageDomain + '/0xFB/icon_shuimian.png'
        }
        break
      case 'antifreezing':
        // 防冻
        if (isActive) {
          rtn = imageDomain + '/0xFB/icon_fangdong2.png'
        } else {
          rtn = imageDomain + '/0xFB/icon_fangdong.png'
        }
        break
      case 'comfort':
        // 舒适
        if (isActive) {
          rtn = imageDomain + '/0xFB/icon_shushi2.png'
        } else {
          rtn = imageDomain + '/0xFB/icon_shushi.png'
        }
        break
      case 'constant_temperature':
        // 智能恒温
        if (isActive) {
          rtn = imageDomain + '/0xFB/icon_zhinenghengwen2.png'
        } else {
          rtn = imageDomain + '/0xFB/icon_zhinenghengwen.png'
        }
        break
      case 'normal':
        // 正常
        if (isActive) {
          rtn = imageDomain + '/0xFB/icon_zhengchang2.png'
        } else {
          rtn = imageDomain + '/0xFB/icon_zhengchang.png'
        }
        break
      case 'fast_hot':
        // 速热
        if (isActive) {
          rtn = imageDomain + '/0xFB/icon_sure2.png'
        } else {
          rtn = imageDomain + '/0xFB/icon_sure.png'
        }
        break
      case 'idle_mode':
        // 空闲模式
        if (isActive) {
          rtn = imageDomain + '/0xFB/icon-humidify.png'
        } else {
          rtn = imageDomain + '/0xFC/icon-humidify.png'
        }
        break
      case 'cold_air':
        // 冷风
        if (isActive) {
          rtn = imageDomain + '/0xFB/icon_lengfeng2.png'
        } else {
          rtn = imageDomain + '/0xFB/icon_lengfeng.png'
        }
        break
      case 'hot_house':
        // 暖房
        if (isActive) {
          rtn = imageDomain + '/0xFB/icon_nuanfang2.png'
        } else {
          rtn = imageDomain + '/0xFB/icon_nuanfang.png'
        }
        break
      case 'bath_mode':
        // 沐浴
        if (isActive) {
          rtn = imageDomain + '/0xFB/icon_muyu2.png'
        } else {
          rtn = imageDomain + '/0xFB/icon_muyu.png'
        }
        break
      case 'hot_fee':
        // 暖脚
        if (isActive) {
          rtn = imageDomain + '/0xFB/icon_nuanjiao2.png'
        } else {
          rtn = imageDomain + '/0xFB/icon_nuanjiao.png'
        }
        break
      case 'hot_dry':
        // 烘干
        if (isActive) {
          rtn = imageDomain + '/0xFB/icon_honggan2.png'
        } else {
          rtn = imageDomain + '/0xFB/icon_honggan.png'
        }
        break
      case 'light':
        // 灯光
        if (isActive) {
          rtn = imageDomain + '/0xFB/icon_zhire2.png'
        } else {
          rtn = imageDomain + '/0xFB/icon_zhire.png'
        }
        break
      case 'circulate':
      case 'circulate_cool':
        // 循环
        if (isActive) {
          rtn = imageDomain + '/0xFB/icon_circulate2.png'
        } else {
          rtn = imageDomain + '/0xFB/icon_circulate.png'
        }
        break
      case 'optional_cool':
        // 自选
        if (isActive) {
          rtn = imageDomain + '/0xFB/icon_optional2.png'
        } else {
          rtn = imageDomain + '/0xFB/icon_optional.png'
        }
        break
      case 'warm_body':
        // 暖身
        if (isActive) {
          rtn = imageDomain + '/0xFB/icon_warm_body2.png'
        } else {
          rtn = imageDomain + '/0xFB/icon_warm_body.png'
        }
        break
      case 'warm_house':
        // 暖屋
        if (isActive) {
          rtn = imageDomain + '/0xFB/icon_warm_house2.png'
        } else {
          rtn = imageDomain + '/0xFB/icon_warm_house.png'
        }
        break
      case 'nature_cool':
        // 自然
        if (isActive) {
          rtn = imageDomain + '/0xFB/icon_nature_cool2.png'
        } else {
          rtn = imageDomain + '/0xFB/icon_nature_cool.png'
        }
        break
      default:
        console.warn('invalid mode')
        break
    }
    return rtn
  },

  // 设备故障代码
  errCode: {
    shortCircuit: 1, // 传感器短路保护
    openCircuit: 2, // 传感器开路保护
    heaterProtect: 4, // 高温保护
    dumpWarn: 8, // 倾倒报警
    ptcError: 9, // PTC位置检测异常
    circuitConnectError: 10, // 电路板通信故障
  },

  // 电源
  power: {
    on: 'on', // 打开
    off: 'off', // 关闭
  },

  // 声音
  voice: {
    openGps: 'open_gps', // 开启语音导航
    closeGps: 'close_gps', // 关闭语音导航
    openBuzzer: 'open_buzzer', // 开启蜂鸣器
    closeBuzzer: 'close_buzzer', // 关闭蜂鸣器
    openTip: 'open_tip', // 同时开启语音导航和蜂鸣器
    mute: 'mute', // 完全静音
    invalid: 'invalid', // 无效
  },

  // 模式
  mode: {
    intelligent: 'intelligent', // 智能
    efficient: 'efficient', // 节能(ECO)
    sleep: 'sleep', // 睡眠
    antifreezing: 'antifreezing', // 防冻
    comfort: 'comfort', // 舒适
    constantTemperature: 'constantTemperature', // 智能恒温
    normal: 'normal', // 正常
    fastHot: 'fast_hot', // 速热
    idleMode: 'idle_mode', // 空闲模式
    coldAir: 'cold_air', // 冷风
    hotHouse: 'hot_house', // 暖房
    bathMode: 'bath_mode', // 沐浴
    hotFeet: 'hot_feet', // 暖脚
    hotDry: 'hot_dry', // 烘干
    light: 'light', // 灯光
    invalid: 'invalid', // 无效
    circulate: 'circulate', //循环
    // 新协议
    warmHouse: 'warm_house', // 暖屋
    idle: 'idle', // 空闲
  },

  // 加湿模式
  humidification: {
    off: 'off', // 关闭
    noChange: 'no_change', // 无档位变化加湿
    invalid: 'invalid', // 无效
  },

  // 摇头(摆风)
  shakeSwitch: {
    on: 'on', // 开
    off: 'off', // 关闭
    default: 'default',
    normal: 'normal',
    invalid: 'invalid', // 无效
  },

  // 童锁
  lock: {
    on: 'on', // 上锁
    off: 'off', // 解锁
    invalid: 'invalid', // 无效
  },
  // 氛围灯
  fireLight: {
    on: 'on', // 上锁
    off: 'off', // 解锁
  },

  // 熄屏开关
  screenClose: {
    on: 'on', // 熄屏
    off: 'off', // 不熄屏
  },

  // 定时开关(分钟)
  timer: {
    clean: 'clean', // 清除定时开关
  },
}
