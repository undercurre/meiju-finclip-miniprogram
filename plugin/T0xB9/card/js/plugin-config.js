import { requestService } from '../../../../utils/requestService'
import { getStamp } from 'm-utilsdk/index'
import { UI } from '../../assets/scripts/ui'
import MideaToast from '../../component/midea-toast/toast'

export class PluginConfig {
  static init(options) {
    if (options) {
      this.applianceCode = options.applianceCode || this.applianceCode
      this.sn8 = options.sn8 || this.sn8
    }
  }

  // 设备ID
  static applianceCode = undefined

  // 设备SN8
  static sn8 = undefined

  // region 错误码
  static errorCode = {
    1: '主传感器断路(数码管显示E1)',
    2: '主传感器短路(数码管显示E2)',
    3: 'IGBT传感器断路(数码管显示E3)',
    4: 'IGBT传感器短路(数码管显示E4)',
    9: '通讯异常(数码管显示EU)',
    11: '主传感器过热(数码管显示C1)',
    12: 'IGBT传感器过热(数码管显示C2)',
    13: '锅具干烧(数码管显示C3)',
    14: '无锅',
    17: 'WIFI模组通信故障(数码管显示EA)',
    18: 'WIFI模组版本故障(数码管显示Eb)',
    19: 'WIFI模组SN故障(数码管显示Sn)',
    24: '工作电压过低(数码管显示EL)',
    25: '工作电压过高(数码管显示EH)',
    26: '主传感器失效(数码管显示E7)',
    66: 'WIFI模组工厂模式故障(数码管显示FP)',
  }
  // endregion

  // 产品SN8
  static sn8Data = [
    '6600151W', // MC-DZ22W7-113
    '66001536', // MC-ZHE3509
    '66000002', // MC-ZHC5001
  ]

  // 快开配置功能key
  static apiKey = {
    heatControl: 'heatControl', // 烧烤火力
    workStatue: 'workStatus', // 工作状态
    chooseTaste: 'chooseTaste', // 口感
    setTemperature: 'setTemperature', // 设置温度
    setWorkTime: 'setWorkTime', // 烹饪时间
    appointTime: 'appointTime', // 预约
    turnStatus: 'turnStatus', // 转动
    lightStatus: 'lightStatus', // 炉灯状态
  }

  // 工作开关
  static workSwitch = {
    cancel: 'cancel', // 取消
    schedule: 'schedule', // 预约
    work: 'work', // 工作
    pause: 'pause', // 暂停
    powerOff: 'power_off', // 关机
    powerOn: 'power_on', // 开机
  }

  // 工作状态参数
  static workStatus = {
    standby: 'standby',
    appoint: 'appoint',
    working: 'cooking',
    keepWarm: 'keepWarm',
    pause: 'pause',
    error: 'error',
  }

  static is113W() {
    return this.sn8 === this.sn8Data[0]
  }

  // region 获取火力对应档位(大中小)
  static getPowerNameByFireLevel(fireLevel) {
    fireLevel = Number(fireLevel)
    let rtn = fireLevel + '档'
    switch (this.sn8) {
      case this.sn8Data[2]:
        switch (fireLevel) {
          case 4:
            rtn = '小火'
            break
          case 8:
            rtn = '中火'
            break
          case 10:
            rtn = '大火'
            break
        }
        break
    }
    return rtn
  }
  // endregion

  // region 控制设备
  static onClickControl({ controlParams }) {
    return new Promise((resolve) => {
      UI.showLoading()
      this.requestControl({
        control: controlParams,
      })
        .then((res) => {
          UI.hideLoading()
          resolve(res)
        })
        .catch((err) => {
          console.log(err)
          let res = err
          UI.hideLoading()
          if (res.data.code != 0) {
            let msg = this.handleErrorMsg(res.data.code)
            MideaToast(msg)
          }
        })
    })
  }
  // endregion

  // 控制设备请求
  static requestControl(command) {
    // 埋点
    let params = {
      control_params: JSON.stringify(command),
    }
    this.rangersBurialPointClick('plugin_button_click', params)
    if (!this.applianceCode) {
      console.warn('invalid applianceCode')
      return
    }
    return requestService.request('luaControl', {
      applianceCode: this.applianceCode,
      command: command,
      reqId: getStamp().toString(),
      stamp: getStamp(),
    })
  }
  // 埋点
  static rangersBurialPointClick(eventName, param) {
    let deviceInfo = this.data.deviceInfo
    if (deviceInfo) {
      let paramBurial = {}
      let paramBase = {
        module: '插件',
        apptype_name: '双灶电磁炉',
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
  }
  // 根据火力获取功率
  static getPowerByFireLevel(fireLevel) {
    fireLevel = Number(fireLevel)
    let rtn = '未定义参数 - ' + fireLevel
    if (this.sn8 === '66000002') {
      rtn = this.getSwitchPowerBy5001(fireLevel) || rtn
    } else {
      rtn = this.getSwitchPowerBy5001(fireLevel) || rtn
    }
    return rtn
  }

  // 多头灶5001功率参数
  static getSwitchPowerBy5001(fireLevel) {
    let rtn = undefined
    switch (fireLevel) {
      case 1:
        rtn = 120
        break
      case 2:
        rtn = 200
        break
      case 3:
        rtn = 300
        break
      case 4:
        rtn = 400
        break
      case 5:
        rtn = 500
        break
      case 6:
        rtn = 600
        break
      case 7:
        rtn = 700
        break
      case 8:
        rtn = 800
        break
      case 9:
        rtn = 900
        break
      case 10:
        rtn = 1100
        break
      case 11:
        rtn = 1300
        break
      case 12:
        rtn = 1500
        break
      case 13:
        rtn = 1700
        break
      case 14:
        rtn = 1900
        break
      case 15:
        rtn = 2200
        break
    }
    return rtn
  }

  // region 工作模式常量
  static workMode = {
    cook: 1, // 炒菜
    soup: 2, // 煲汤
    keepWarm: 3, // 保温
    break: 4, // 爆料
    cookSoup: 5, // 烧汤
    rinse: 6, // 涮
    scald: 7, // 烫
    steamFishAndShrimp: 8, // 蒸鱼虾
    steamPorkSlices: 9, // 蒸肉片
    steamOther: 10, // 蒸其他
    frying: 11, // 煎炸
    heating: 12, // 加热
    quickFry: 13, // 爆炒
    hotPot: 14, // 火锅
    steamCook: 15, // 蒸煮(炖煮)
    boilWater: 16, // 烧水
    porridge: 17, // 煮粥
    slowFire: 18, // 文火
    frying2: 19, // 煎烙
    stew: 20, // 炖熬(焖炖)
    constantHeat: 21, // 恒温加热
    constantFermentation: 22, // 恒温发酵
    constantKeepWarm: 23, // 恒温温热
    constantStew: 24, // 恒温炖熬
    constantFrying2: 25, // 恒温煎烙
    constantQuickFry: 26, // 恒温轻炒
  }
  // endregion

  // region 工作模式名称
  static workModeName = {
    1: '炒菜',
    2: '煲汤',
    3: '保温',
    4: '爆料',
    5: '烧汤',
    6: '涮',
    7: '烫',
    8: '蒸鱼虾',
    9: '蒸肉片',
    10: '蒸其他',
    11: '煎炸',
    12: '加热',
    13: '爆炒',
    14: '火锅',
    15: '炖煮',
    16: '烧水',
    17: '煮粥',
    18: '文火',
    19: '煎烙',
    20: '焖炖',
    21: '恒温加热',
    22: '恒温发酵',
    23: '恒温温热',
    24: '恒温炖熬',
    25: '恒温煎烙',
    26: '恒温轻炒',
  }
  // endregion

  // 处理错误信息
  static handleErrorMsg(errCode) {
    let rtn = '系统提示: ' + errCode
    if (errCode == 1306) {
      rtn = '设备未响应'
    }
    if (errCode == 1307) {
      rtn = '设备已离线，请检查网络状态'
    }
    return rtn
  }

  // 重定向至不支持页面
  static redirectUnSupportDevice(deviceInfo) {
    wx.redirectTo({
      url:
        '/pages/unSupportDevice/unSupportDevice?backTo=/pages/index/index&deviceInfo=' +
        encodeURIComponent(JSON.stringify(deviceInfo)),
    })
  }

  // 解析快开配置参数
  static quickDevJson2Local(quickDevJson) {
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
            if (settingItem.apiKey === this.apiKey.setTemperature) {
              functionItem.expectedCookTemp = settingItem.properties.defaultValue
            }
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
  }
}

export const STATUS = {
  STANDBY: '0',
  APPOINT: '1',
  WORKING: '2',
  KEEPWARM: '3',
}

// const menuWorkTime = { // 返回菜单工作时间 min
//     hengwenpengren: 0,
//     huoguo: 0,
//     baochao: 0,
//     baotang: 0,
// }

export function getTextByStatus(status) {
  let result = ''
  status = parseInt(status)
  switch (status) {
    case 0:
      result = '待机中'
      break
    case 1:
      result = '预约中'
      break
    case 2:
      result = '关机中'
      break
    case 3:
      result = '保温中'
      break
    case 4:
      result = '暂停中'
      break
    case 5:
      result = '工作中'
      break
    case 6:
      result = '收汁中'
      break
    case 7:
      result = '已完成'
      break
    case 9:
      result = '无锅'
      break
    default:
      result = ''
      break
  }
  return result
}

export function getTimeRange(min, max) {
  let date = new Date()
  let cHour = date.getHours()

  let minHour = cHour + min
  let maxHour = cHour + max

  return {
    hour: [minHour, maxHour],
    minute: [0, 59],
  }
}

export function getAppointFinishTime(currentTime) {
  // 通过预约时间计算出预约完成时间
  let date = new Date()
  let cHour = date.getHours()
  let cMinute = date.getMinutes()
  let end = cHour * 60 + cMinute + parseInt(currentTime)

  let endHour = Math.floor(end / 60) % 24 >= 10 ? Math.floor(end / 60) % 24 : `0${Math.floor(end / 60) % 24}`
  let endMinute = end % 60 >= 10 ? end % 60 : `0${end % 60}`

  return `${endHour}:${endMinute}`
}

export function getWorkFinishTime(currentTime) {
  let day = '今天'
  let date = new Date()
  let cHour = date.getHours()
  let cMinute = date.getMinutes()
  let end = cHour * 60 + cMinute + Math.floor(parseInt(currentTime))
  if (end > 1359) day = '明天'

  let endHour = Math.floor(end / 60) % 24 >= 10 ? Math.floor(end / 60) % 24 : `0${Math.floor(end / 60) % 24}`
  let endMinute = end % 60 >= 10 ? end % 60 : `0${end % 60}`

  console.log('getWorkFinishTime ' + cHour + ' ' + cMinute + ' ' + end + ' ' + endHour + ' ' + endMinute)

  return `${day}${endHour}:${endMinute}`
}

export function getMenuIdByKey(key) {
  return menuId[key]
}

export const menuId = {
  hengwenpengren: 21,
  huoguo: 14,
  baochao: 13,
  baotang: 2,
}

export function getModelNameById(id) {
  return modelName[id]
}

export const modelName = {
  2: 'baotang',
  13: 'baochao',
  14: 'huoguo',
  21: 'hengwenpengren',
}

// export function getWorkTimeById(id) {
//   let array = Object.values(menuId)
//   let index = 0
//   for (let i = 0; i < array.length; i++) {
//     if (array[i] == id) {
//       index = i
//     }
//   }
//   let workTimeArray = Object.values(menuWorkTime)
//   return workTimeArray[index]
// }

export const modeDesc = {
  hengwenpengren: '恒温烹饪',
  huoguo: '火锅',
  baochao: '爆炒',
  baotang: '煲汤',
}

// export const mode2ID = {
//     20027: menuId.kuaisufan,
//     20026: menuId.kuaisuzhou,
//     20038: menuId.baotang,
//     20004: menuId.rouji,
// };

export const workStatus2Int = {
  standby: 0,
  order: 1,
  power_off: 2,
  keep_warm: 3,
  pause: 4,
  work: 5,
  collect_juice: 6,
  finished: 7,
  no_pan: 9,
}

export const targetID2Mode = {
  hengwenpengren: 21,
  huoguo: 14,
  baochao: 13,
  baotang: 2,
}

// export function getAppointDur(menuId) {
//     switch (menuId) {
//         case 'kuaisufan':
//             return {
//                 minAppointDur: 120,
//                 maxAppointDur: 24 * 60
//             };
//         case 'kuaisuzhou':
//             return {
//                 minAppointDur: 120,
//                 maxAppointDur: 24 * 60
//             };
//         case 'baotang':
//             return {
//                 minAppointDur: 120,
//                 maxAppointDur: 24 * 60
//             };
//         case 'rouji':
//             return {
//                 minAppointDur: 120,
//                 maxAppointDur: 24 * 60
//             };
//         default:
//             return {
//                 minAppointDur: 120,
//                 maxAppointDur: 24 * 60
//             };
//     }
// }

export function getAppointWorkingText(hour, min) {
  let date = new Date()

  let day = '今天'
  if (hour * 60 + min < date.getHours() * 60 + date.getMinutes()) day = '明天'
  return day + addZero(hour) + ':' + addZero(min) + '完成'
}

export function addZero(num) {
  return num < 10 ? '0' + num : num
}

export function getWarmTimeText(hour, min) {
  if (hour == 0) return `${min}分钟`
  else return `${hour < 10 ? '0' + hour : hour}小时${min < 10 ? '0' + min : min}分钟`
}

export function getModeName(mode) {
  let mode_data = '其他功能'
  switch (mode) {
    case '30':
      return '手动'
    case '20005':
      return '红烧排骨'
    case '20008':
      return '回锅肉'
    case '20003':
      return '红烧肉'
    case '20054':
      return '三杯鸡'
    case '20027':
      return '宫保鸡丁'
    case '20023':
      return '可乐鸡翅'
    case '20073':
      return '啤酒鸭'
    case '20074':
      return '红烧牛肉'
    case '20087':
      return '山药焖羊肉'
    case '20011':
      return '油焖大虾'
    case '20007':
      return '农家小炒肉'
    case '20035':
      return '土豆烧排骨'
    case '20024':
      return '土豆烧鸡'
    case '20019':
      return '萝卜牛腩煲'
    case '20092':
      return '红烧鲫鱼'
    case '20098':
      return '彩椒鱿鱼卷'
    case '20112':
      return '干锅香辣鱼块'
    case '20015':
      return '地三鲜'
    case '20017':
      return '手撕包菜'
    case '20018':
      return '酸辣土豆丝'
    case '20136':
      return '长豆角烧茄子'
    case '20168':
      return '青菜香菇'
    case '20021':
      return '培根金针菇卷'
    case '20169':
      return '荷塘小炒'
    case '20114':
      return '攸县香干'
    case '20120':
      return '青椒千张'
    case '20121':
      return '胡萝卜丝千张'
    case '20130':
      return '西芹腐竹'
    case '20022':
      return '养生银耳汤'
    case '20075':
      return '罗宋汤'
  }
  return mode_data
}

export const modeList = ['hengwenpengren', 'huoguo', 'baochao', 'baotang']

export const pickerType = {
  hengwenpengren: 'hengwenpengren',
  huoguo: 'huoguo',
  baochao: 'baochao',
  baotang: 'baotang',
}
