const app = getApp() //获取应用实例
const requestService = app.getGlobalConfig().requestService
import { DeviceData } from '../../assets/script/device-data'
import { Format } from '../../assets/script/format'

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

// 根据已有指令获取校验码
export function getCheckNum(hexControlStr){
  // 分割指令
  const size = 2
  let hexArr = []
  for(let i=0;i<hexControlStr.length;i+=size){
    hexArr.push(hexControlStr.substring(i,i+size))
  }
  console.log('分割后的指令(不含校验码)',hexArr)
  // 指令长度
  let msgLength = hexControlStr.length/2 - 1
  // 二进制指令建立
  let binaryArr = []
  for (let i = 0; i < hexArr.length; i++) {
    // 先把字符串转成十六进制再转二进制
    let binary = parseInt(hexArr[i],16).toString(2)
    // console.log('第'+i+'位:',binary,binary.length)
    // 不够八位进行补零
    if(binary.length<8){
      // 补零个数
      let count = 8-binary.length
      for(let j=0;j<count;j++){
        binary = '0'+binary
      }
    }
    // 组合二进制指令
    binaryArr.push(binary)
  }
  console.log('转换后的二进制指令',binaryArr)
  // 校验码计算
  let checkNum = 0
  for (let i = 1; i < msgLength; i++) {
    let intNum = parseInt(binaryArr[i], 2)
    // console.log('校验码计算第'+i+'位:',binaryArr[i],intNum)
    checkNum = checkNum + intNum
  }
  console.log('校验码计算')
  console.log(checkNum)
  checkNum = ~checkNum
  checkNum++
  checkNum = checkNum & 0xff
  console.log('十进制的checkNum',checkNum)
  checkNum = checkNum.toString(16).toUpperCase()
  console.log('十六进制的checkNum',checkNum)
  // 不够两位补零
  if(checkNum.length===1){
    checkNum = '0'+checkNum
  }
  return checkNum
}
