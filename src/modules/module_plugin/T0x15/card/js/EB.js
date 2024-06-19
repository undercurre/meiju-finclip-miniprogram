export class EB {
  // 快开配置功能key
  static apiKey = {
    workStatue: 'workStatue', // 工作状态
    mixingMode: 'mixingMode', // 搅拌
    power: 'power', // 烹饪火力
    setWorkTime: 'setWorkTime', // 烹饪时间
    appointTime: 'appointTime', // 预约
  }

  // 工作状态参数
  static workStatus = {}

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
        `/pages/unSupportDevice/unSupportDevice?backTo=/pages/index/index&deviceInfo=` +
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

export function getWorkTimeById(id) {
  let array = Object.values(menuId)
  let index = 0
  for (let i = 0; i < array.length; i++) {
    if (array[i] == id) {
      index = i
    }
  }
  let workTimeArray = Object.values(menuWorkTime)
  return workTimeArray[index]
}

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

export function getAppointTimeRange(menuId) {
  let date = new Date()
  let cMin = date.getHours() * 60 + date.getMinutes()
  let { minAppointDur, maxAppointDur } = getAppointDur(menuId)

  return {
    hour: [Math.floor((cMin + minAppointDur) / 60), Math.floor((cMin + maxAppointDur) / 60)],
    minuteMin: [(cMin + minAppointDur) % 60, 59],
    minuteMax: [0, (cMin + maxAppointDur) % 60],
    pickerOpenHour: date.getHours(),
    pickerOpenMinute: date.getMinutes(),
  }
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
