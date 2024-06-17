/* eslint-disable indent */
import computedBehavior from '../../../../utils/miniprogram-computed'
import { requestService } from '../../../../utils/requestService'
import images from '../../assets/js/img'

import { getAssistant } from '../../assistant/platform/wechat/plugins/ED/index'
import assistantBehavior from '../../assistant/platform/wechat/ability/mixins/index'
let assistant = getAssistant()

function getColor(color) {
  if (color == 'gray') return '#F2F2F2'
  if (color == 'tomato') return '#FE674A'
  if (color == 'yellow') return '#FFAA10'
  if (color == 'aqua') return '#29C3FF'
  if (color == 'colmo') return '#C26033'
  if (color == 'colmo-gray') return '#464646'
  return color
}
let washStatus = false //冲洗状态 change-冲洗状态变化 false-初始化状态 off-关闭状态 washing-过了30秒
let animationTimeout = null ////冲洗文字描述定时变化

Component({
  behaviors: [
    computedBehavior,
    ...assistantBehavior(
      assistant,
      [
        'deviceInfo',
        'deviceSetting',
        'statusNum',
        'statusTxt',
        'errorsTxt',
        'hasInTDS',
        'hasOutTDS',
        'outTDS',
        'inTDS',
        'deviceStatus',
      ],
      []
    ),
  ],
  properties: {},
  data: {
    images,
    todayWater: 0, //今日用水
    curTip: '', //当前水tips
    tipList: [
      //全部水tips
      '人只喝水至少可以存活7天以上',
      '地球上只有不到1%的可用淡水',
      '自来水一般都是使用氯杀菌的哦',
      '男性比女性体内多10%的水，男人才是水做的哦',
      '有水的地方才有生命',
      '在4℃以下，水的性质是热缩冷胀',
      '平均每人每年要喝一吨水（包括从食物里获得的水分）',
      '早晨起床应该要喝一杯凉白开水',
    ],
  },
  computed: {
    platform() {
      const info = wx.getSystemInfoSync()
      return info.platform
    },
    runBgColor() {
      const { statusNum } = this.data
      if (statusNum == 3) {
        return getColor('yellow')
      } else if (statusNum == 4) {
        return getColor('aqua')
      } else if ([5, 11, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29].includes(statusNum)) {
        return 'rgba(255,170,16,0.1)'
      } else if ([2, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16].includes(statusNum)) {
        return 'rgba(41,195,255,0.1)'
      } else {
        return 'transparent'
      }
    },
    runTxtColor() {
      const { statusNum } = this.data
      if ([3, 4].includes(statusNum)) {
        return '#FFFFFF'
      } else if ([5, 11, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29].includes(statusNum)) {
        return getColor('yellow')
      } else if ([2, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16].includes(statusNum)) {
        return getColor('aqua')
      } else {
        return 'transparent'
      }
    },
    currentTemperature() {
      //当前温度
      const { statusNum, deviceStatus } = this.data
      return statusNum == 3 && deviceStatus && deviceStatus.current_temperature ? deviceStatus.current_temperature : 0
    },
    germicidalLeftTime() {
      //高温杀菌剩余时间
      const { statusNum, deviceStatus } = this.data
      return statusNum == 5 && deviceStatus && deviceStatus.germicidal_left_time ? deviceStatus.germicidal_left_time : 0
    },
    velocity() {
      //软水、中央净 流速
      const { deviceStatus, deviceSetting } = this.data
      if (
        deviceSetting &&
        deviceSetting.deviceKind &&
        (deviceSetting.deviceKind == 9 || deviceSetting.deviceKind == 10)
      ) {
        return deviceStatus && deviceStatus.velocity ? deviceStatus.velocity : 0
      } else {
        return 0
      }
    },
    waterCount() {
      //软水剩余软水量、中央净今日用水量
      const { deviceStatus, deviceSetting, todayWater } = this.data
      if (deviceSetting && deviceSetting.deviceKind) {
        if (deviceSetting.deviceKind == 9) {
          return deviceStatus && deviceStatus.soft_available ? deviceStatus.soft_available : 0
        } else if (deviceSetting.deviceKind == 10) {
          return todayWater
        } else {
          return 0
        }
      } else {
        return 0
      }
    },
    remainTime() {
      //软水再生剩余时间、中央净当前清洗剩余时间
      const { deviceStatus, deviceSetting } = this.data
      if (deviceSetting && deviceSetting.deviceKind) {
        if (deviceSetting.deviceKind == 9) {
          return deviceStatus && deviceStatus.regeneration_left_seconds
            ? (deviceStatus.regeneration_left_seconds / 60).toFixed()
            : 0
        } else if (deviceSetting.deviceKind == 10) {
          return deviceStatus && deviceStatus.cleaning_left_seconds
            ? (deviceStatus.cleaning_left_seconds / 60).toFixed()
            : 0
        } else {
          return 0
        }
      } else {
        return 0
      }
    },
    washTxt() {
      //处理从冲洗关变冲洗开 前30秒显示“冲洗准备中”
      let { statusNum, deviceStatus, deviceSetting, images } = this.data
      if (deviceSetting && deviceSetting.deviceKind < 5) {
        deviceStatus = assistant.deviceStatus
        statusNum = assistant.statusNum
        if (statusNum == 4) {
          //冲洗状态
          if (washStatus == 'off') {
            //由关变开
            washStatus = 'change'
            animationTimeout = setTimeout(() => {
              washStatus = 'washing'
              //触发马上更新
              this.setData({ images })
            }, 30000)
            return '冲洗准备中'
          } else if (washStatus == false) {
            //由初始值变开
            washStatus = 'washing'
            return ''
          } else if (washStatus == 'change') {
            //冲洗前30秒期间
            return '冲洗准备中'
          } else {
            //冲洗中
            return ''
          }
        } else if (deviceStatus && deviceStatus.wash && deviceStatus.wash == 'off') {
          //冲洗关闭状态
          washStatus = 'off'
          clearTimeout(animationTimeout)
          return ''
        } else {
          //初始化状态
          washStatus = false
          clearTimeout(animationTimeout)
          return ''
        }
      } else {
        return ''
      }
    },
  },
  observers: {
    deviceInfo(val) {
      val && val.applianceCode && this.getTodayWater(val.applianceCode)
    },
  },
  lifetimes: {
    attached() {
      this.setTips()
    },
  },
  methods: {
    setTips() {
      const { tipList } = this.data
      this.setData({ curTip: tipList[0] })
      setInterval(() => {
        let index = tipList.indexOf(this.data.curTip) + 1
        if (index === tipList.length) {
          index = 0
        }
        this.setData({ curTip: tipList[index] })
      }, 20000)
    },
    getTodayWater(applianceCode) {
      let waterList = []
      requestService
        .request('ed', {
          msg: 'getRecentWeekDaysPureWaterAmount',
          params: {
            applianceId: String(applianceCode),
          },
        })
        .then((res) => {
          let arr = res.data.result.dataList
          let isML = false
          for (let i = 0; i < arr.length; i++) {
            let oneDay = 0
            if (arr[i].list != null) {
              for (let r = 0; r < arr[i].list.length; r++) {
                if (arr[i].unit && arr[i].unit === 'ML') {
                  isML = true
                }
                oneDay += parseInt(arr[i].list[r].amount)
              }
            }
            waterList[i] = oneDay
          }
          let tdWater = isML ? Math.round((waterList[6] / 1000) * 100) / 100 : waterList[6]
          this.setData({
            todayWater: Math.floor(tdWater * 10) / 10,
          })
        })
    },
  },
})
