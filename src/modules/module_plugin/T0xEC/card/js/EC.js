const app = getApp() //获取应用实例
const requestService = app.getGlobalConfig().requestService
import { Format } from '../../assets/scripts/format'
import { commonApi } from '../../assets/scripts/api'
import { DeviceData } from '../../assets/scripts/device-data'

export class EC {
  // 获取消息配置
  static recommendGet(deviceInfo) {
    return new Promise((resolve) => {
      const app = getApp()
      let userId = app.globalData.userData.iotUserId
      let productModelNumber =
        Number(deviceInfo.modelNumber) !== 0 ? DeviceData.getAO(deviceInfo.modelNumber) : deviceInfo.sn8
      let queryParams = {
        applianceId: deviceInfo.applianceCode,
        applianceType: deviceInfo.type,
        modelNo: productModelNumber,
        platform: 2,
        infoType: 'circleBox',
      }
      let sendParams = {
        serviceName: 'recipe-community',
        uri: 'recommend/get' + Format.jsonToParam(queryParams),
        method: 'GET',
        contentType: 'application/json',
        userId: userId,
      }
      let method = 'POST'
      requestService.request(commonApi.sdaTransmit, sendParams, method).then((res) => {
        if (res.data && res.data.errorCode === 0) {
          let resData = JSON.parse(res.data.result.returnData)
          let messageList = resData.data
          if (messageList && messageList.length > 0) {
            let random = Math.floor(Math.random() * messageList.length)
            let jumpType = 1
            let jumpLinkUrl = messageList[random].h5Link
            if (jumpLinkUrl.startsWith('midea-meiju://com.midea.meiju/main?')) {
              jumpType = 3
            }
            resolve({
              advertiseBarData: [
                {
                  contentUrl: messageList[random].iconUrl,
                  jumpType: jumpType,
                  jumpLinkUrl: jumpLinkUrl,
                },
              ],
            })
          }
        }
      })
    })
  }

  // 获取口感名称
  static getTasteName(taste) {
    taste = Number(taste)
    let rtn = '未定义-' + taste
    switch (taste) {
      case 0:
        rtn = '适中'
        break
      case 1:
        rtn = '软烂'
        break
      case 2:
        rtn = '嚼劲'
        break
    }
    return rtn
  }

  // 配置参数类型
  static settingApiKey = {
    workStatue: 'workStatue', // 工作状态
    appointTime: 'appointTime', // 预约时间
    pressureLevel: 'pressureLevel', // 压力等级
    workTime: 'setWorkTime', // 工作时间
    taste: 'taste', // 口感等级
    aroma: 'aroma', // 浓香模式
    attributes: 'attributes', // 属性
    keepPressureTime: 'keepPressureTime', // 保持压力时间(烹饪时间)
    NonIH: 'NonIH', // 是否IH
  }

  // 开关参数
  static workSwitch = {
    cancel: 'cancel', // 取消
    schedule: 'schedule', // 预约
    work: 'work', // 启动
    pause: 'pause', // 暂停
    halfwayOpen: 'halfway_open', // 中途开盖
    keepWarm: 'keep_warm', // 保温
    exhaust: 'exhaust', // 排气
  }

  // 工作状态参数
  static workStatus = {
    standby: 'standby', // 待机中
    appoint: 'appoint', // 预约中
    appointCooking: 'appoint_cooking', // 工作中
    appointVenting: 'appoint_venting', // 工作中
    working: 'working', // 工作中
    workingKeepPressure: 'working_keep_pressure', // 工作中
    workingVenting: 'working_venting', // 排气中
    interrupt: 'interrupt', // 中途开盖中
    errorOpen: 'errorOpen', // 设备未上锁
    interruptVenting: 'interrupt_venting', // 排气中
    interruptVentingFinish: 'interrupt_venting_finish', // 排气完成
    interruptOpen: 'interrupt_open', // 设备已开盖
    keepWarm: 'keepWarm', // 保温中
  }

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
        // 工作状态处理
        if (propertyItem.settings[0].apiKey === 'workStatue') {
          let options = propertyItem.settings[0].properties.options
          if (options && options.length > 0) {
            local_json.workStatusMap = {}
            options.forEach((statusItem) => {
              local_json.workStatusMap[statusItem.code] = statusItem
            })
          }
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

const menuWorkTime = {
  // 返回菜单工作时间 min
  kuaisufan: 20,
  kuaisuzhou: 20,
  baotang: 40,
  rouji: 25,
}

export function getTextByStatus(status) {
  let result = ''
  status = parseInt(status)
  switch (status) {
    case 0:
      result = '待机中'
      break
    case 2:
      result = '预约中'
      break
    case 3:
      result = '已保温'
      break
    default:
      result = '工作中'
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
  let date = new Date()
  let cHour = date.getHours()
  let cMinute = date.getMinutes()
  let end = cHour * 60 + cMinute + Math.floor(parseInt(currentTime))

  let endHour = Math.floor(end / 60) % 24 >= 10 ? Math.floor(end / 60) % 24 : `0${Math.floor(end / 60) % 24}`
  let endMinute = end % 60 >= 10 ? end % 60 : `0${end % 60}`

  console.log('getWorkFinishTime ' + cHour + ' ' + cMinute + ' ' + end + ' ' + endHour + ' ' + endMinute)

  return `${endHour}:${endMinute}`
}

export function getMenuIdByKey(key) {
  return menuId[key]
}

export const menuId = {
  kuaisufan: 20027,
  kuaisuzhou: 20026,
  baotang: 20038,
  rouji: 20004,
}

export function getModelNameById(id) {
  return modelName[id]
}

export const modelName = {
  20027: 'kuaisufan',
  20026: 'kuaisuzhou',
  20038: 'baotang',
  20004: 'rouji',
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
  kuaisufan: '快速饭',
  kuaisuzhou: '快速粥',
  baotang: '汤类',
  rouji: '肉/鸡',
}

export const mode2ID = {
  20027: menuId.kuaisufan,
  20026: menuId.kuaisuzhou,
  20038: menuId.baotang,
  20004: menuId.rouji,
}

export const workStatus2Int = {
  cancel: STATUS.STANDBY,
  cooking: STATUS.WORKING,
  schedule: STATUS.APPOINT,
  keep_warm: STATUS.KEEPWARM,
}

export const targetID2Mode = {
  kuaisufan: 20027,
  kuaisuzhou: 20026,
  baotang: 20038,
  rouji: 20004,
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

export function getAppointDur(menuId) {
  switch (menuId) {
    case 'kuaisufan':
      return {
        minAppointDur: 120,
        maxAppointDur: 24 * 60,
      }
    case 'kuaisuzhou':
      return {
        minAppointDur: 120,
        maxAppointDur: 24 * 60,
      }
    case 'baotang':
      return {
        minAppointDur: 120,
        maxAppointDur: 24 * 60,
      }
    case 'rouji':
      return {
        minAppointDur: 120,
        maxAppointDur: 24 * 60,
      }
    default:
      return {
        minAppointDur: 120,
        maxAppointDur: 24 * 60,
      }
  }
}

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
  let mode_data
  switch (mode) {
    case 'cook_rice':
      mode_data = '精华煮'
      break
    case 'fast_cook_rice':
      mode_data = '超快煮'
      break
    case 'standard_cook_rice':
      mode_data = '标准煮'
      break
    case 'gruel':
      mode_data = '稀饭'
      break
    case 'cook_congee':
      mode_data = '煮粥'
      break
    case 'stew_soup':
      mode_data = '汤'
      break
    case 'stewing':
      mode_data = '蒸煮'
      break
    case 'heat_rice':
      mode_data = '热饭'
      break
    case 'make_cake':
      mode_data = '蛋糕'
      break
    case 'yoghourt':
      mode_data = '酸奶'
      break
    case 'soup_rice':
      mode_data = '煲仔饭'
      break
    case 'coarse_rice':
      mode_data = '杂粮饭'
      break
    case 'five_ceeals_rice':
      mode_data = '五谷饭'
      break
    case 'eight_treasures_rice':
      mode_data = '八宝饭'
      break
    case 'crispy_rice':
      mode_data = '锅巴饭'
      break
    case 'shelled_rice':
      mode_data = '玄米'
      break
    case 'eight_treasures_congee':
      mode_data = '八宝粥'
      break
    case 'infant_congee':
      mode_data = '婴儿粥'
      break
    case 'older_rice':
      mode_data = '长者饭'
      break
    case 'rice_soup':
      mode_data = '米汤'
      break
    case 'rice_paste':
      mode_data = '米糊'
      break
    case 'egg_custard':
      mode_data = '蛋羹'
      break
    case 'warm_milk':
      mode_data = '温奶'
      break
    case 'hot_spring_egg':
      mode_data = '温泉蛋'
      break
    case 'millet_congee':
      mode_data = '小米粥'
      break
    case 'firewood_rice':
      mode_data = '柴火饭'
      break
    case 'few_rice':
      mode_data = '少量饭'
      break
    case 'red_potato':
      mode_data = '红薯'
      break
    case 'corn':
      mode_data = '玉米'
      break
    case 'quick_freeze_bun':
      mode_data = '速冻包'
      break
    case 'steam_ribs':
      mode_data = '蒸排骨'
      break
    case 'steam_egg':
      mode_data = '蒸鸡蛋'
      break
    case 'coarse_congee':
      mode_data = '杂粮粥'
      break
    case 'steep_rice':
      mode_data = '泡饭'
      break
    case 'appetizing_congee':
      mode_data = '开胃粥'
      break
    case 'corn_congee':
      mode_data = '玉米粥'
      break
    case 'sprout_rice':
      mode_data = '发芽米'
      break
    case 'luscious_rice':
      mode_data = '香甜饭'
      break
    case 'luscious_boiled':
      mode_data = '香甜煮'
      break
    case 'fast_rice':
      mode_data = '快速饭'
      break
    case 'fast_boil':
      mode_data = '快速煮'
      break
    case 'bean_rice_congee':
      mode_data = '豆米粥'
      break
    case 'fast_congee':
      mode_data = '快速粥'
      break
    case 'baby_congee':
      mode_data = '宝宝粥'
      break
    case 'cook_soup':
      mode_data = '煲汤'
      break
    case 'congee_coup':
      mode_data = '粥/汤'
      break
    case 'steam_corn':
      mode_data = '蒸玉米'
      break
    case 'steam_red_potato':
      mode_data = '蒸红薯'
      break
    case 'boil_congee':
      mode_data = '煮粥'
      break
    case 'delicious_steam':
      mode_data = '美味蒸'
      break
    case 'boil_egg':
      mode_data = '煮鸡蛋'
      break
    case 'keep_warm':
      mode_data = '保温'
      break
    case 'rice_wine':
      mode_data = '米酒'
      break
    case 'fruit_vegetable_paste':
      mode_data = '果蔬泥'
      break
    case 'vegetable_porridge':
      mode_data = '蔬菜粥'
      break
    case 'pork_porridge':
      mode_data = '肉末粥'
      break
    case 'fragrant_rice':
      mode_data = '香软饭'
      break
    case 'assorte_rice':
      mode_data = '什锦饭'
      break
    case 'steame_fish':
      mode_data = '蒸鱼肉'
      break
    case 'baby_rice':
      mode_data = '宝宝饭'
      break
    case 'essence_rice':
      mode_data = '精华饭'
      break
    case 'fragrant_dense_congee':
      mode_data = '香浓粥'
      break
    case 'one_two_cook':
      mode_data = '一锅两煮'
      break
    case 'original_steame':
      mode_data = '原味蒸'
      break
    case 'hot_fast_rice':
      mode_data = '热水快速饭'
      break
    case 'online_celebrity_rice':
      mode_data = '网红饭'
      break
    case 'sushi_rice':
      mode_data = '寿司饭'
      break
    case 'stone_bowl_rice':
      mode_data = '石锅饭'
      break
    case 'boiled_water_rice':
      mode_data = '热水快饭'
      break
    case 'no_water_treat':
      mode_data = '无水焗'
      break
    case 'diy':
      mode_data = 'DIY'
      break
    default:
      mode_data = '其他功能'
      break
  }
  return mode_data
}

export const modeList = ['kuaisufan', 'kuaisuzhou', 'baotang', 'rouji']
