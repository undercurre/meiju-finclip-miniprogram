const app = getApp() //获取应用实例
const requestService = app.getGlobalConfig().requestService
import { Format } from '../../assets/scripts/format'
import { DeviceData } from '../../assets/scripts/device-data'
import { commonApi } from '../../assets/scripts/api'

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

  // 配置参数类型
  static settingApiKey = {
    workStatue: 'workStatus', // 工作状态
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
    let functions = []
    if (quickDevJson.functions && quickDevJson.functions.length > 0) {
      quickDevJson.functions.forEach((functionItem) => {
        if (functionItem.settings && functionItem.settings.length > 0) {
          functionItem.settingsData = {}
          // 检查工作状态
          functionItem.settings.forEach((settingItem) => {
            if (settingItem.apiKey === 'setWorkTime') {
              functionItem.setWorkTime = settingItem.properties.defaultValue || settingItem.properties.value
              functionItem.unit = settingItem.properties.unit || settingItem.properties.unit || ''
            } else if (settingItem.apiKey === 'appointTime') {
              functionItem.appointTime = settingItem.properties.defaultValue || settingItem.properties.value
              functionItem.unit2 = settingItem.properties.unit || settingItem.properties.unit || ''
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
// standby	待机
// schedule	预约
// working	工作
// pause	暂停
// keepWarm	保温
// error	机器故障
// preheating	预热
// boiling	沸腾
// stewedMeat	精炖

export const workStatus2Text = {
  standby: '待机中',
  schedule: '预约中',
  working: '工作中',
  pause: '已暂停',
  keepWarm: '保温中',
  error: '故障中',
  preheating: '预热中',
  boiling: '沸腾中',
  stewedMeat: '精炖中',
}

export const sortObj = {
  9: 1,
  10: 2,
  1: 3,
  2: 4,
  3: 5,
  4: 6,
  5: 7,
  6: 8,
  7: 9,
  8: 10,
}
export const deviceStatusBg = {
  schedule: '#6CE781',
  working: '#FF6A4C',
  standby: '#6CE781',
  pause: '#6CE781',
  keepWarm: '#6CE781',
  error: '',
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
  let day = Math.floor(end / 60) > 23 ? '明天' : '今天'
  let endHour = Math.floor(end / 60) % 24 >= 10 ? Math.floor(end / 60) % 24 : `0${Math.floor(end / 60) % 24}`
  let endMinute = end % 60 >= 10 ? end % 60 : `0${end % 60}`

  console.log('getWorkFinishTime ' + cHour + ' ' + cMinute + ' ' + end + ' ' + endHour + ' ' + endMinute)

  return `${day + endHour}:${endMinute}`
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

export function getAppointWorkingText(hour, min) {
  let date = new Date()

  let day = '今天'
  if (hour * 60 + min < date.getHours() * 60 + date.getMinutes()) day = '明天'
  return day + addZero(hour) + ':' + addZero(min) + '完成'
}

export function addZero(num) {
  return num < 10 ? '0' + num : num
}
// 计算当前的预约时间
export function getCurrentAppointTime(leftAppointTime) {
  let isToday = true
  const now = new Date() // 获取当前时间
  const nowHour = now.getHours(),
    nowMin = now.getMinutes()
  let appointMin = nowMin + leftAppointTime
  let appointHour = nowHour + parseInt(appointMin / 60)
  appointMin = appointMin % 60
  if (appointHour > 23) {
    isToday = false // 判断今天or明天
  }
  appointHour = appointHour % 24
  return [isToday, appointHour, appointMin]
}
export function getWarmTimeText(hour, min) {
  if (hour == 0) return `${min}分钟`
  else return `${hour < 10 ? '0' + hour : hour}小时${min < 10 ? '0' + min : min}分钟`
}

export function mm2HHmmText(min) {
  const hours = parseInt(min / 60),
    mins = min % 60
  return `${hours ? hours + '小时' : ''}${mins ? mins + '分钟' : ''}`
}
export function mm2HHmmStr(min) {
  const hours = parseInt(min / 60),
    mins = min % 60
  return `${addZero(hours)}:${addZero(mins)}`
}
