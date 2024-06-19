import { Format } from '../../assets/scripts/format'
import { DeviceData } from '../../assets/scripts/device-data'
import { commonApi } from "../../assets/scripts/api";
const app = getApp() //获取应用实例
const requestService = app.getGlobalConfig().requestService

export class F1 {
  static statusData = null
  static productConfig = null
  static deviceSmartType = null

  static updateProductConfig(productConfig) {
    this.productConfig = productConfig
    console.log('updateProductConfig: ', productConfig)
    let deviceSmartTypeProperties = productConfig.properties['deviceSmartType']
    if (deviceSmartTypeProperties) {
      this.deviceSmartType = deviceSmartTypeProperties.options[0].value
    }
  }

  static updateStatus(newDeviceStatus) {
    this.statusData = newDeviceStatus
  }

  static isSmartDevice() {
    return this.deviceSmartType === '2'
  }

  static isNotStandby() {
    return (
      this.statusData.work_status != this.workStatus[this.workStatus.standby] &&
      this.statusData.work_status != this.workStatus[this.workStatus.finished] &&
      this.statusData.work_mode != 0
    )
  }

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

  // 保温code
  static keepWarmCode = [22]

  // 工作状态后台配置参数
  static workStatusCode = {
    standby: 'standby',
    appoint: 'appoint',
    working: 'working',
    keepWarm: 'keepWarm',
    finished: 'finished',
    error: 'error',
  }

  // 工作状态参数
  static workStatus = {}

  // 工作开关参数
  static workSwitch = {
    work: 'work',
    schedule: 'schedule',
  }

  // 配置参数类型
  static settingApiKey = {
    workStatus: 'workStatus', // 工作状态
    appointTime: 'appointTime', // 预约时间
    blendSpeed: 'blendSpeed', // 搅拌速度
    blendDuration: 'blendDuration', // 搅拌时间
    mouthFeel: 'mouthFeel', // 口感
    setKeepWarmTemp: 'setKeepWarmTemp', // 保温温度
    setKeepWarmTime: 'setKeepWarmTime', // 保温时间
    waterAmountSelect: 'waterAmountSelect', // 水量控制
  }

  // 获取口感名称
  static getMouthFeelName(mouthFeel) {
    let mouthFeelName = mouthFeel
    do {
      if (!mouthFeel) {
        console.warn('缺少口感: ' + mouthFeel)
        break
      }
      mouthFeel = Number(mouthFeel)
      switch (mouthFeel) {
        case 0:
          mouthFeelName = '无口感'
          break
        case 1:
          mouthFeelName = '高纤'
          break
        case 2:
          mouthFeelName = '适中'
          break
        case 3:
          mouthFeelName = '细腻'
          break
      }
    } while (false)
    return mouthFeelName
  }

  // 获取杯盖状态
  static getLidStatus(lidStatus) {
    let isCupEnabled = false
    do {
      if (!lidStatus) {
        console.warn('缺少杯盖状态')
        break
      }
      switch (lidStatus) {
        // lid_status
        case 'have_cup':
          isCupEnabled = true
          break
        case 'no_cup':
          isCupEnabled = false
          break
        // flag_lid_status
        case '0':
          isCupEnabled = true
          break
        case '1':
          isCupEnabled = false
          break
      }
    } while (false)
    return isCupEnabled
  }

  // 获取工作状态
  static getWorkStatusName(workStatus) {
    let workStatusName = workStatus
    do {
      if (!workStatus) {
        console.warn('缺少工作状态: ' + workStatus)
        break
      }
      workStatus = Number(workStatus)
      switch (workStatus) {
        case this.workStatus.wait:
          workStatusName = '待机中'
          break
        case this.workStatus.working:
          workStatusName = '工作中'
          break
        case this.workStatus.schedule:
          workStatusName = '预约中'
          break
        case this.workStatus.keepWarm:
          workStatusName = '保温中'
          break
        default:
          workStatusName = '未知状态(' + workStatus + ')'
          break
      }
    } while (false)
    return workStatusName
  }

  // 获取杯子类型
  static getCupTypeByStatus(cupStatus) {
    let cupType = undefined
    do {
      if (!cupStatus) {
        console.warn('无效cupStatus: ' + cupStatus)
        break
      }
      switch (cupStatus) {
        case 'default':
          cupType = '0'
          break
        case 'hot_cup':
          cupType = '1'
          break
        case 'cold_cup':
          cupType = '2'
          break
        case 'sub_cup':
          cupType = '3'
          break
        default:
          cupType = cupStatus
          break
      }
    } while (false)
    return cupType
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

  // 获取杯子类型
  static getCupTypeName(cupType) {
    if (!cupType) {
      console.warn('无效cupType')
      return cupType
    }
    cupType = cupType.toString()
    let cupName = undefined
    switch (cupType) {
      case '0':
        cupName = '默认'
        break
      case '1':
        cupName = '搅拌杯'
        break
      case '2':
        cupName = '研磨杯/冷杯'
        break
      case '3':
        cupName = '子杯/热杯'
        break
      case '4':
        cupName = '切丝杯'
        break
      case '5':
        cupName = '烹饪杯'
        break
      case '6':
        cupName = '火锅'
        break
      case '7':
        cupName = '焙香杯'
        break
      case '9':
        cupName = '养生杯'
        break
      case '11':
        cupName = '茶漏杯'
        break
      case '12':
        cupName = '辅食杯'
        break
      default:
        cupName = '未知-' + cupType
        break
    }
    return cupName
  }

  // 解析快开配置参数
  static quickDevJson2Local(quickDevJson) {
    let local_json = {
      model: quickDevJson.productName,
      subType: parseInt(quickDevJson.productModelNumber),
      functions: [],
      properties: {},
      errorCodeMap: quickDevJson.errorCodeMap,
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
      let cupTypeMap = new Map()
      quickDevJson.functions.forEach((functionItem) => {
        if (functionItem.settings && functionItem.settings.length > 0) {
          functionItem.settingsData = {}
          // 检查工作状态
          functionItem.settings.forEach((settingItem) => {
            do {
              functionItem.settingsData[settingItem.apiKey] = settingItem
              if (settingItem.apiKey !== 'workStatus') {
                break
              }
              // functionItem[settingItem.apiKey] = settingItem;
              if (!settingItem.properties || !settingItem.properties.cupType) {
                break
              }
              let cookTime = settingItem.properties.cookTime
              if (cookTime && cookTime < 1) {
                cookTime = Number(cookTime)
                functionItem['cookTimeLabel'] = cookTime * 60 + '秒'
              }
              let cupType = settingItem.properties.cupType
              let index = cupTypeMap.get(cupType)
              if (cupTypeMap.has(cupType)) {
                functions[index].functions.push(functionItem)
                break
              }
              cupTypeMap.set(cupType, functions.length)
              let cupTypeName = this.getCupTypeName(cupType)
              functions.push({
                cupType: cupType,
                cupTypeName: cupTypeName,
                functions: [functionItem],
              })
            } while (false)
          })
        }
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
  KEEPWARM: '4',
}

const menuWorkTime = {
  // 返回菜单工作时间 min
  zalianghu: 40,
  wugujiang: 32,
  yingerhu: 40,
  yingerzhou: 31,
  yingyangzheng: 30,
  nongtang: 60,
}

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
      result = '工作中'
      break
    case 4:
      result = '保温中'
      break
    default:
      result = '待机中'
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
  let end = cHour * 60 + cMinute + Math.floor(parseInt(currentTime) / 60)

  let endHour = Math.floor(end / 60) % 24 >= 10 ? Math.floor(end / 60) % 24 : `0${Math.floor(end / 60) % 24}`
  let endMinute = end % 60 >= 10 ? end % 60 : `0${end % 60}`

  return `${endHour}:${endMinute}`
}

export function getMenuIdByKey(key) {
  return menuId[key]
}

export const menuId = {
  zalianghu: 12,
  wugujiang: 18,
  yingerhu: 25,
  yingerzhou: 33,
  yingyangzheng: 35,
  nongtang: 1,
}

export function getModelNameById(id) {
  return modelName[id]
}

export const modelName = {
  12: 'zalianghu',
  18: 'wugujiang',
  25: 'yingerhu',
  33: 'yingerzhou',
  35: 'yingyangzheng',
  1: 'nongtang',
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
  zalianghu: '杂粮糊',
  wugujiang: '五谷浆',
  yingerhu: '婴儿糊',
  yingerzhou: '婴儿粥',
  yingyangzheng: '营养蒸',
  nongtang: '浓汤',
}

export const modeList = ['zalianghu', 'wugujiang', 'yingerhu', 'yingerzhou', 'yingyangzheng', 'nongtang']
