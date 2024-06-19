const app = getApp() //获取应用实例
const requestService = app.getGlobalConfig().requestService
import { DeviceData } from '../../assets/script/device-data'
import { Format } from '../../assets/script/format'
import { commonApi } from '../../common/script/api'

export class RemoteControl {
  // 启动设备
  static work(params) {
    return new Promise((resolve, reject) => {
      let control = {
        control: {
          ...params.controlParams,
        },
      }
      let uriParams = {
        applianceId: params.applianceId,
        applianceType: params.applianceType,
        modelNo: params.modelNo,
        menuType: params.menuType,
      }
      let urlDataString = Format.jsonToParam(uriParams).substr(1)
      let jsonOrderString = '&jsonOrder=' + JSON.stringify(control)
      urlDataString += jsonOrderString
      let sendParams = {
        serviceName: 'remote-control',
        uri: '/v2/' + params.applianceType.slice(-2) + '/control/work',
        method: 'POST',
        contentType: 'application/x-www-form-urlencoded;charset=utf-8',
        userId: app.globalData.userData.iotUserId,
        data: urlDataString,
      }
      requestService
        .request(commonApi.sdaTransmit, sendParams)
        .then((res) => {
          console.log('启动设备 传参: ', sendParams)
          console.log('启动设备 返回参: ', res)
          resolve(res)
        })
        .catch((err) => {
          console.error('启动设备 错误: ', err)
          reject(err)
        })
    })
  }

  // 查询设备状态
  static getStatus(params) {
    return new Promise((resolve, reject) => {
      let uriParams = {
        applianceId: params.applianceCode,
        applianceType: params.applianceType,
        modelNo: params.modelNo,
        userId: app.globalData.userData.iotUserId,
        queryType: params.queryType || 0,
      }
      let sendParams = {
        serviceName: 'remote-control',
        uri: '/v2/' + params.applianceType.slice(-2) + '/control/getStatus' + Format.jsonToParam(uriParams),
        method: 'POST',
        contentType: 'application/json',
        userId: app.globalData.userData.iotUserId,
      }
      requestService
        .request(commonApi.sdaTransmit, sendParams)
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          if (err.data) {
            resolve(err)
          } else {
            reject(err)
          }
        })
    })
  }
}

// 获取消息配置
export function recommendGet(deviceInfo) {
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

export const STATUS = {
  STANDBY: '0',
  APPOINT: '1',
  WORKING: '2',
  KEEPWARM: '3',
}

const menuWorkTime = {
  // 返回菜单工作时间 min
  xiangtianfan: 30,
  zhuzhou: 60,
  baotang: 120,
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
    case 3:
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
  xiangtianfan: 39,
  zhuzhou: 50,
  baotang: 46,
}

export function getModelNameById(id) {
  return modelName[id]
}

export const modelName = {
  39: 'xiangtianfan',
  50: 'zhuzhou',
  46: 'baotang',
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
  xiangtianfan: '香甜饭',
  zhuzhou: '煮粥',
  baotang: '煲汤',
}

export const mode2ID = {
  luscious_rice: menuId.xiangtianfan,
  cook_congee: menuId.zhuzhou,
  cook_soup: menuId.baotang,
}

export const workStatus2Int = {
  cancel: STATUS.STANDBY,
  cooking: STATUS.WORKING,
  schedule: STATUS.APPOINT,
  keep_warm: STATUS.KEEPWARM,
}

export const targetID2Mode = {
  xiangtianfan: 'luscious_rice',
  zhuzhou: 'cook_congee',
  baotang: 'cook_soup',
}

export function getAppointTimeRange(menuId) {
  let date = new Date()
  let cMin = date.getHours() * 60 + date.getMinutes()
  let { minAppointDur, maxAppointDur } = getAppointDur(menuId)

  return {
    hour: [Math.floor((cMin + minAppointDur) / 60), Math.floor((cMin + maxAppointDur) / 60)],
    minuteMin: [(cMin + minAppointDur) % 60, 59],
    minuteMax: [0, (cMin + maxAppointDur) % 60],
  }
}

export function getAppointDur(menuId) {
  switch (menuId) {
    case 'xiangtianfan':
      return {
        minAppointDur: 60,
        maxAppointDur: 23 * 60 + 58,
      }
    case 'zhuzhou':
      return {
        minAppointDur: 62,
        maxAppointDur: 23 * 60 + 58,
      }
    case 'baotang':
      return {
        minAppointDur: 122,
        maxAppointDur: 23 * 60 + 58,
      }
    default:
      return {
        minAppointDur: 60,
        maxAppointDur: 23 * 60 + 58,
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
  if (hour === 0) return `${min}分钟`
  else return `${hour}小时${min}分钟`
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

export const modeList = ['xiangtianfan', 'zhuzhou', 'baotang']
