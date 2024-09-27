// const QQMapWX = require('../assets/js/qqmap-wx-jssdk.min')
import computedBehavior from '../../../utils/miniprogram-computed'
import settingBehavior from '../assets/js/setting'
import images from '../assets/js/img'
import { CARD_MODE_OPTION } from '../../../pages/common/js/cardMode'
import { getReqId, getStamp } from 'm-utilsdk/index'
import { requestService, rangersBurialPoint } from '../../../utils/requestService'
import { mockData } from '../assets/js/mockData'
import { templateIds } from '../../../globalCommon/js/templateIds'
import { openSubscribe } from '../assets/js/openSubscribe'

const isMock = false
// let qqmapsdk
let queryTimeout

// 获取范围数组如：【30-40】
const pickerRangeCreate = function (start, end, step) {
  let rs = []
  while (start <= end) {
    rs.push(start)
    start += step
  }
  return rs
}

Component({
  behaviors: [settingBehavior, computedBehavior],
  properties: {
    deviceInfo: {
      type: Object,
      value: {},
    },
  },
  data: {
    applianceData: {},
    checked: true,
    isShowLottie: false,
    filterList: [],
    status: {},
    changing: false,
    destory: false,
    isNew: true, //默认为true
    errContent: '', //故障内容
    actions: [
      { name: 'VC美肤香氛滤芯', value: 'vcFilter3' },
      { name: 'VC MINI美肤滤芯', value: 'vcFilter1' },
      { name: '净氯滤芯', value: 'vcFilter2' },
    ],
    imgSrc: '',
    isShowBuyFilterSheet: false,
    isShowTemPicker: false,
    isCloudOn: false, // 云管家开关状态
    isCloudDelay: false, // 云管家暂停
    aiTemp: '', // 云管家温度
    aiTempList: [], // 云管家-智能控温曲线
    selfTempList: [], // 云管家-自定义控温曲线
    isStudying: true, // 云管家学习状态
    cloudMode: 1, // 已选模式：0智能，1自定义，2智能关机
    timeLeft: 0,
    bathTime: '--',
    inWaterTemperature: 20, // 进水温度
    haveAppiont: false,
    cloudSwitchStatus: false,
    isShowFilterLoading: true,
    infoDescVClx1:
      'VC美肤香氛沐浴滤芯，99.8%除去水中余氯，滋养肌肤，柔顺秀发，打造SPA级亲肤好水，而且还能过滤泥沙、铁锈等有害物，保障沐浴水质健康。\n当使用3个月或当香味消失时，建议更换一次滤芯，效果更佳。',
    infoDescVClx2:
      '净氯除垢沐浴滤芯，专利除余氯设计，采用KDF、MSAP和银离子过滤水中杂质、余氯等有害物质，减少水中内部杂质沉积，给肌肤舒适亲和力，呵护敏感肌。\n当使用6个月后，建议更换一次滤芯，效果更佳。',
    infoDescVClx3:
      '阻垢滤芯可将水中钙、镁离子捕获，防止在高温下形成水垢。建议1年更换一次（因使用地域、水质、用水量不同，实际使用周期不同）',
    //特殊型号信息
    infoDesc:
      '沐浴时，滤芯为您及您的家人提供满满维生素C，可以有效去除自来水中的余氯，美白肌肤抗衰老，并散发柠檬香气，使用周期3个月（实际消耗量与用水温度、流量与当地水质有关，请以实际消耗情况为准）。',
    // 耗材数组
    material: {
      mb: [], // 镁棒
      filter: [], // 滤芯
      tank: [], // 内胆
    },
    // 当前耗材
    currentItem: {
      mb: {}, // 镁棒
      filter: {}, // 滤芯
      tank: {}, // 内胆
    },
    life: [0, 0, 0], // 图标下方的使用天数/余量显示
    circleDataList: [], // 图标的数据列表
    appointmentCellDesc: '',
    showFunAppointType: false,
    showFunCloudHome: false,
    appointOnTimeList: null, // 预约开启数据
    appointType: 0, // 0：分段预约；1：延时预约
    //温度选择器
    multiArray: [],
    multiIndex: [0],
    selections: [],
    tem: pickerRangeCreate(30, 75, 5),
    nextAppointText: '',
  },
  computed: {
    images() {
      return images
    },
    filterPowerOffList() {
      if (this.data.deviceStatus >= 5) {
        return this.data.filterList.map((item) => ({
          name: item.name,
          circleText: '未知',
          circleVal: 0,
          remainDay: 0,
        }))
      }
      return ''
    },

    currentHour() {
      return new Date().getHours() + ':00'
    },
    btnText() {
      //状态栏文字显示
      if (!this.data.setting || !this.data.status) return
      const { end_time_hour, end_time_minute, hot_power } = this.data.status
      const { hotWaterType } = this.data.setting
      const { deviceStatus } = this.data
      let txt = ''
      let leftTime = ''
      if (end_time_hour != 0) {
        leftTime = end_time_hour + '小时' + end_time_minute + '分钟'
      } else {
        leftTime = end_time_minute + '分钟'
      }
      // 显示优先级：离线 => 故障中 => 出水断电中 (前三个不显示状态栏) => 已关机 => 高温抑菌中 => 加热中 => 预约加热中 => 保温中 => 待机中
      if (deviceStatus == 3) {
        if (hotWaterType == 'noWater') {
          // 无热水量时不显示时间
          txt = '加热中'
        } else {
          if (hot_power == 'on') {
            txt = '抑菌加热中 · 剩余' + leftTime
          } else {
            txt = '高温抑菌中'
          }
        }
      } else if (deviceStatus == 2 || deviceStatus == 4) {
        if (hotWaterType == 'noWater') {
          // 无热水量时不显示时间
          txt = '加热中'
        } else {
          if (deviceStatus == 4) {
            txt = '预约加热中 · 还需' + leftTime
          } else {
            txt = '加热中 · 还需' + leftTime
          }
        }
      } else if (deviceStatus == 1) {
        txt = '保温中'
      } else {
        txt = '待机中'
      }
      return txt
    },
    showBathTime() {
      if (!this.data.setting || !this.data.status) return
      const { hotWaterType } = this.data.setting
      const { bath_remaining_time } = this.data.status
      return hotWaterType == 'bathTime' && bath_remaining_time > 0
    },
    // 热水量
    hotWaterQuantity() {
      // 特殊情形，使用百分比热水量（现几乎全部升级为模糊热水量，相变热水器由于温度限制35~46，仍采用电控上报百分比模式）
      if (!this.data.setting || !this.data.status){
        return ''
      }
      const { hotWaterType = '' } = this.data.setting
      const { heat_water_level, cur_temperature } = this.data.status
      let hotWaterQuantity = ''
      if (hotWaterType == 'percentWater') {
        hotWaterQuantity = heat_water_level==undefined ? '' : (heat_water_level > 100 ? '100%' : heat_water_level + '%')
      } else {
        // 否则根据温度判断热水量
        if (cur_temperature < 45) {
          hotWaterQuantity = '不足'
        } else if (cur_temperature < 55) {
          hotWaterQuantity = '较少'
        } else if (cur_temperature < 65) {
          hotWaterQuantity = '较多'
        } else {
          hotWaterQuantity = '充足'
        }
      }
      return hotWaterQuantity
    },
    // 当前状态，同一时刻的值唯一，避免由于参数更新或渲染先后导致的组件状态差异。数值越大优先级越高 0:待机中 1:保温中 2:加热中 3:高温杀菌中 4:预约加热中 5:关机 6:出水断电 7:故障 8:离线
    deviceStatus() {
      if (!this.data.setting || !this.data.status || !this.data.applianceData) {
        return
      }
      const { onlineStatus } = this.data.applianceData
      const {
        elec_warning,
        sensor_error,
        limit_error,
        communication_error,
        error_code,
        protect,
        protect_show,
        power,
        appoint_power,
        sterilization,
        mode,
        hot_power,
        warm_power,
        smart_sterilize,
      } = this.data.status
      const { specialConfig } = this.data.setting
      let status = -1
      if (!onlineStatus) {
        // 离线
        status = 8
      } else if (
        elec_warning === 'on' ||
        (sensor_error == 'on' && specialConfig != '70EW_no_sensor_error') || //特殊处理：70EW电控存在误报“恒温阀传感器故障E6”
        limit_error == 'on' ||
        communication_error == 'on' ||
        (error_code && error_code !== 0)
      ) {
        // 故障
        status = 7
      } else if (protect === 'on' && protect_show === 'on') {
        // 出水断电
        status = 6
      } else if (power === 'off') {
        // 关机
        status = 5
      } else if (appoint_power === 'on') {
        // 预约加热中
        status = 4
      } else if (sterilization === 'on' || mode == 'sterilization') {
        // 高温抑菌中
        status = 3
      } else if (hot_power === 'on') {
        // 加热中
        status = 2
      } else if (warm_power === 'on') {
        // 保温中
        status = 1
      } else {
        // 待机中
        status = 0
      }

      // 特殊处理：FA3的电控存在BUG，智能杀菌开启后，预约加热中也会开启，需屏蔽
      if (specialConfig == 'FA3_appointHeat' && smart_sterilize == 'on' && status == 4) {
        if (hot_power === 'on') {
          // 加热中
          status = 2
        } else if (warm_power === 'on') {
          // 保温中
          status = 1
        } else {
          // 待机中
          status = 0
        }
      }
      return status
    },
    // 是否显示云管家
    showCloud() {
      const { deviceStatus, isCloudOn } = this.data
      return (
        deviceStatus < 5 && // 关机不显示
        isCloudOn // 云管家开启才显示
      )
    },
    temCellRightText() {
      const {
        isCloudOn,
        isCloudDelay,
        status: { temperature },
      } = this.data
      if (isCloudOn && !isCloudDelay) {
        return '云管家·控温中'
      } else {
        return (temperature || '60') + '℃'
      }
    },
    temCellDesc() {
      const { isCloudDelay, timeLeft, isCloudOn, showFunCloudHome } = this.data
      if (showFunCloudHome) {
        if (isCloudDelay) {
          return '自定义温度中，' + Math.floor(timeLeft / 60) + '小时' + (timeLeft % 60) + '分' + '后启动云管家'
        } else {
          return isCloudOn ? '云管家已启动，自动控温中' : '云管家已关闭，需要手动开启'
        }
      } else {
        return ''
      }
    },
    cur_temperature() {
      if (!this.data.status) return
      const { cur_temperature } = this.data.status
      if (cur_temperature) {
        return cur_temperature > 99 ? 99 : cur_temperature
      } else {
        return 25
      }
    },
    // 根据进水温度、当前功率、当前温度、是否出水断电估算模糊可用时长
    fuzzyWaterTime() {
      if (!this.data.status) return
      const { protect, rate } = this.data.status
      const { cur_temperature, inWaterTemperature } = this.data
      if (inWaterTemperature < 10) {
        if (protect == 'on' && rate == 11) {
          if (cur_temperature < 34) {
            return 5
          } else if (cur_temperature >= 34 && cur_temperature < 41) {
            return 10
          } else if (cur_temperature >= 41 && cur_temperature < 68) {
            return 15
          } else {
            return 20
          }
        } else {
          if (cur_temperature < 38) {
            return 5
          } else if (cur_temperature >= 38 && cur_temperature < 43) {
            return 10
          } else if (cur_temperature >= 43 && cur_temperature < 67) {
            return 15
          } else if (cur_temperature >= 67) {
            return 20
          } else {
            return '--'
          }
        }
      } else if (inWaterTemperature > 20) {
        if (protect == 'on') {
          if (cur_temperature < 35) {
            return 5
          } else if (cur_temperature >= 35 && cur_temperature < 41) {
            return 10
          } else if (cur_temperature >= 41 && cur_temperature < 55) {
            return 15
          } else if (cur_temperature >= 55 && cur_temperature < 70) {
            return 20
          } else if (cur_temperature >= 70) {
            return 25
          } else {
            return '--'
          }
        } else if (rate == 32) {
          if (cur_temperature < 37) {
            return 5
          } else if (cur_temperature >= 37 && cur_temperature < 41) {
            return 10
          } else if (cur_temperature >= 41 && cur_temperature < 47) {
            return 15
          } else if (cur_temperature >= 47 && cur_temperature < 55) {
            return 20
          } else if (cur_temperature >= 55) {
            return 25
          } else {
            return '--'
          }
        } else {
          if (cur_temperature < 37) {
            return 5
          } else if (cur_temperature >= 37 && cur_temperature < 41) {
            return 10
          } else if (cur_temperature >= 41 && cur_temperature < 52) {
            return 15
          } else if (cur_temperature >= 52 && cur_temperature < 61) {
            return 20
          } else if (cur_temperature >= 61) {
            return 25
          } else {
            return '--'
          }
        }
      } else {
        if (protect == 'on' && rate == 11) {
          if (cur_temperature < 35) {
            return 5
          } else if (cur_temperature >= 35 && cur_temperature < 41) {
            return 10
          } else if (cur_temperature >= 41 && cur_temperature < 60) {
            return 15
          } else if (cur_temperature >= 60) {
            return 20
          } else {
            return '--'
          }
        } else {
          if (cur_temperature < 38) {
            return 5
          } else if (cur_temperature >= 38 && cur_temperature < 45) {
            return 10
          } else if (cur_temperature >= 45 && cur_temperature < 62) {
            return 15
          } else if (cur_temperature >= 62 && cur_temperature < 73) {
            return 20
          } else if (cur_temperature >= 73) {
            return 25
          } else {
            return '--'
          }
        }
      }
    },
  },
  observers: {
    material: function (val) {
      if (!val.filter) return
      this.materialHandler(val)
    },
  },
  lifetimes: {
    attached() {
      // 实例化API核心类
      // qqmapsdk = new QQMapWX({ key: 'JI3BZ-DJEL6-P5QST-M3M5P-53OEF-KCF42' })

      this.setData({ applianceData: this.properties.deviceInfo })
      this.getSetting(this.properties.deviceInfo.sn8, this.properties.deviceInfo.modelNumber)
    },
  },

  pageLifetimes: {
    show: function () {
      // 页面被展示
      this.getCloudSwitch() //后退操作执行
    },
  },
  ready() {},
  methods: {
    afterGetSetting(){
      // 获取VC滤芯
      this.getVClxData().then(() => {
        const { mbReport, lxReport, ndReport } = this.data.setting
        if (mbReport >= 2 || lxReport == 2 || ndReport == 3) {
          // 云端耗材数据查询
          this.queryCloudMaintenance()
        } else {
          // 渲染页面数据
          this.filterHandler()
        }
      })

      // 预约
      this.isFunctionAppoint()

      // 云管家
      this.isFunctionCloudHome()
      this.getTimeLeft()

      //特殊机型需要获取当地地区
      if(this.data.setting.hotWaterType=='fuzzyWater') {
        this.getCityname()
      }
    },

    //// 功能列
    // // 预约
    isFunctionAppoint() {
      let showFunAppointType =
        this.data.setting.appointType == 'delayPartAppoint' ||
        this.data.setting.appointType == 'partAppoint' ||
        this.data.setting.appointType == 'timingUpdatePartAppoint'
      this.setData({ showFunAppointType })
      if(showFunAppointType){
        this.queryAppoint()
      }
    },
    // 云管家
    isFunctionCloudHome() {
      let cardList = this.data.setting.cardList || []
      if (cardList.length == 0) {
        cardList = this.data.setting.funcList || []
        if (cardList.length > 0) {
          let showFunCloudHome = cardList.some((i) => {
            return i.key == 'cloudHome4'
          })
          this.setData({ showFunCloudHome })
        }
      } else {
        let showFunCloudHome = cardList.some((i) => {
          return i == 'cloudHome4'
        })
        this.setData({ showFunCloudHome })
      }
    },

    // 耗材-滤芯
    materialHandler(val) {
      console.log('滤芯信息', val)
      // if (!val.filter && !val.filter.length) return;
      const filterName = [
        { id: 1, pId: 0, name: 'VC美肤香氛滤芯' },
        { id: 101, pId: 1, name: '柠檬香味' },
        { id: 102, pId: 1, name: '薄荷香味' },
        { id: 103, pId: 1, name: '薰衣草香味' },
        { id: 104, pId: 1, name: '松木香味' },
        { id: 2, pId: 0, name: '净氯滤芯' },
        { id: 201, pId: 2, name: '无香' },
        { id: 3, pId: 0, name: 'VC MINI美肤滤芯' },
        { id: 301, pId: 3, name: '薰衣花海' },
        { id: 302, pId: 3, name: '仲夏青柠' },
        { id: 303, pId: 3, name: '松间落雪' },
        { id: 304, pId: 3, name: '爆汁西柚' },
        { id: 305, pId: 3, name: '微醺莓果' },
        { id: 306, pId: 3, name: '漫步丁香' },
        { id: 307, pId: 3, name: '玫瑰呢喃' },
        { id: 308, pId: 3, name: '天竺少女' },
        { id: 309, pId: 3, name: '空谷依兰' },
        { id: 310, pId: 3, name: '橘子海洋' },
      ]
      let filterList = []
      if (this.data.deviceStatus > 5) {
        filterList = this.data.filterList.map((item) => ({
          name: item.name,
          circleText: '未知',
          circleVal: 0,
          remainDay: 0,
        }))
      } else {
        filterList = val['filter'].map((item) => {
          const index = filterName.findIndex((filterNameItem) => item.subId && filterNameItem.id === item.subId)
          if (index !== -1) {
            return {
              id: filterName[index]['id'],
              name: filterName[index]['name'],
              circleText: item.precent + '%',
              circleVal: parseInt(item.precent),
              remainDay: parseInt(item.infoText2) || parseInt(item.infoText1),
            }
          } else {
            return {
              name: '阻垢滤芯',
              circleText: item.precent + '%',
              circleVal: parseInt(item.precent),
              remainDay: parseInt(item.infoText2) || parseInt(item.infoText1),
            }
          }
        })
      }
      setTimeout(() => this.setData({ filterList }), 0)
    },
    // 微信获得经纬度
    getToLocation() {
      wx.getLocation({
        type: 'wgs84',
        success: ({ latitude, longitude }) => {
          this.getLocal(latitude, longitude)
        },
        fail: (res) => {
          //系统定位没开
          this.setData({ inWaterTemperature: 20 })
        },
      })
    },

    // 获取当前地理位置
    getLocal(latitude, longitude) {
      // qqmapsdk.reverseGeocoder({
      //   location: {
      //     latitude: latitude,
      //     longitude: longitude,
      //   },
      //   success: (res) => {
      //     let city = res.result.ad_info.city
      //     this.getInWatertmp(city.replace('市', ''))
      //   },
      //   fail: () => {
      //     this.setData({ inWaterTemperature: 20 })
      //   },
      // })
      this.setData({ inWaterTemperature: 20 })
    },

    // 获取城市名称
    getCityname() {
      wx.getSetting().then((res) => {
        const userLocation = res.authSetting['scope.userLocation']
        // 存在定位权限
        if (userLocation) {
          this.getToLocation()
        } else {
          this.setData({ inWaterTemperature: 20 })
        }
      })
    },

    getAppointOnTimeList(appointData) {
      // 处理预约时间段交叉逻辑，输出实际预约开启的列表
      let appointOnTimeList = [[], [], [], [], [], [], []] // 清空 0~6依次对应周日~周一
      appointData.map((item) => {
        if (item.enable && item.week) {
          let week_list = item.week.split(',')
          if (item.startTime >= item.endTime) {
            // 跨天则将当前预约拆分为两段
            let item_1 = {
              ...item,
              endTime: '24:00',
              spanningEndTime: item.endTime,
            }
            week_list.map((week) => {
              appointOnTimeList[week].push(item_1)
            })
            let new_week_list = week_list.map((week) => {
              return week == '6' ? 0 : Number(week) + 1
            })
            let item_2 = {
              ...item,
              startTime: '00:00',
              week: new_week_list.join(','),
              spanningStartTime: item.startTime,
            }
            new_week_list.map((week) => {
              appointOnTimeList[week].push(item_2)
            })
          } else {
            // 不跨天
            week_list.map((week) => {
              appointOnTimeList[week].push(item)
            })
          }
        }
      })
      return appointOnTimeList
    },

    // 获取下次预约数据
    getNextAppoint() {
      // 分段预约显示格式为：12:00关机；延时分段预约显示格式为：12:00结束
      let endText = this.data.appointType == 1 ? ' 结束' : ' 关机'
      let startText = this.data.appointType == 1 ? ' 用水' : ' 开机'
      if (!this.data.appointOnTimeList) return

      const nowDate = new Date()
      let day = nowDate.getDay()
      let time = this.parseTime(nowDate.getHours(), nowDate.getMinutes())

      let need = []
      let weekDay = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      // 先取本周的预约数据
      this.data.appointOnTimeList.map((dayList, index) => {
        if (index == day) {// 今天的预约
          dayList.map((item) => {
            if (time < item.startTime) {// 如果开始时间未到，则显示开始时间
              need.push(`${item.startTime} ${startText}`)
              need.sort()
            } else if (time < item.endTime) {// 如果开始时间已过，结束时间未到，则显示结束时间
              let endTime = item.spanningEndTime ? '次日' + item.spanningEndTime : item.endTime // spanningEndTime存在说明是跨天，取跨天结束时间
              need.push(endTime + endText)
              need.sort()
            }
          })
        } else if (index > day) {
          // 非今天的预约，取开始时间加入数组
          dayList.map((item) => {
            need.push(`${weekDay[index]}${item.startTime} ${startText}`)
          })
        }
      })
      // 再取下周数据，取开始时间加入数组
      this.data.appointOnTimeList.slice(0, day + 1).map((dayList, index) => {
        dayList.map((item) => {
          need.push(`${weekDay[index]}${item.startTime} ${startText}`)
        })
      })
      this.setData({ nextAppointText: need.length ? need[0] : '' })
    },
    // 获取云端下发给电控的预约信息
    getCloudToDeviceAppoint(){
      requestService
      .request('e2', {
        msg: 'getExecuteOrderList',
        params: {
          applianceId: String(this.data.applianceData.applianceCode),
        },
      })
      .then(({data}) => {
        if(data.retCode == '0'){
          let { time, isStart } = this.getNextAppointLegal(data.result)
          this.setData({nextAppointText: time ? `${time}${isStart?'用水':'结束'}` : ''})
        }
      })
    },
    // 获取下次预约数据-法定节假日预约使用
    getNextAppointLegal(result){
      let time = ''
      let isStart = ''
      if(result.length){
        const nowDate = new Date()
        let hour = Number(nowDate.getHours()) < 10 ? `0${Number(nowDate.getHours())}` : Number(nowDate.getHours())
        let min = Number(nowDate.getMinutes()) < 10 ? `0${Number(nowDate.getMinutes())}` : Number(nowDate.getMinutes())
        let now_time = `${hour}:${min}`
        let list = result.map((i,index)=>{
          let s_hour = Number(i.StartHour) < 10 ? `0${Number(i.StartHour)}` : Number(i.StartHour)
          let s_min = Number(i.StartMinute) < 10 ? `0${Number(i.StartMinute)}` : Number(i.StartMinute)
          let e_hour = Number(i.EndHour) < 10 ? `0${Number(i.EndHour)}` : Number(i.EndHour)
          let e_min = Number(i.EndMinute) < 10 ? `0${Number(i.EndMinute)}` : Number(i.EndMinute)
          return {
            start: `${s_hour}:${s_min}`,
            end: `${e_hour}:${e_min}`,
            temp: i.Temp,
            isRepeat: i.IsRepeat,
            IsCrossDay: i.IsCrossDay || 0,
            id: index // 通过添加ID，为后面筛选唯一识别
          }
        })
        let isBefore = list.every(i => now_time < i.start)
        let isAfter = list.every(i => now_time >= i.end)
        if(isBefore){ // 当前时间在所有预约总时间跨度的 前面
          time = list[0].start
          isStart = 1
        }else if(isAfter){ // 当前时间在所有预约总时间跨度的 后面
          time = ''
        }else{ // 当前时间在所有预约总时间跨度的 里面
          let cur_list = list.filter(i=>(now_time>=i.start&&now_time<i.end))
          if(cur_list.length){ // 当前时间在其中一条或多条预约区间里面
            let first = cur_list[0]
            // time = first.end
            time = first.IsCrossDay&&first.end=='23:59' ? '' : first.end // 云端返回跨天时则不显示

            // let repeatStartList = cur_list.filter(i=>(first.start==i.start)) // 筛选出开始时间重复的预约
            // if(repeatStartList.length<2){ // 开始时间没有重复时，显示自身结束时间
            //   time = first.end
            // }else{ // 开始时间重复时，显示结束时间靠后的
            //   let resortList = repeatStartList.sort((a,b)=>(b.end-a.end))
            //   time = resortList[0].end
            // }
          }else{ // 当前时间不在任何一条预约区间里面
            let future = list.filter(i => now_time < i.start)
            time = future[0].start
            isStart = 1
          }
        }
      }
      return { time, isStart }
    },

    // 将星期字符串转换为中文周期
    parseWeek(wkStr, isRepeat) {
      var weekArr = wkStr.split(',')
      let week = ''
      for (let i = 0; i < weekArr.length; i++) {
        if (weekArr[i] == '1') {
          week = week + '周一 '
        } else if (weekArr[i] == '2') {
          week = week + '周二 '
        } else if (weekArr[i] == '3') {
          week = week + '周三 '
        } else if (weekArr[i] == '4') {
          week = week + '周四 '
        } else if (weekArr[i] == '5') {
          week = week + '周五 '
        } else if (weekArr[i] == '6') {
          week = week + '周六 '
        } else if (weekArr[i] == '0') {
          week = week + '周日 '
        }
      }
      if (!isRepeat) {
        week = '单次'
      } else if (week == '周日 周六 ' || week == '周六 周日 ') {
        week = '周末'
      } else if (week == '周一 周二 周三 周四 周五 ') {
        week = '工作日'
      } else if (week == '周日 周一 周二 周三 周四 周五 周六 ') {
        week = '每天'
      } else if (week == '周一 周二 周三 周四 周五 周六 周日 ') {
        week = '每天'
      } else if (week == '') {
        week = '单次'
      }
      return week
    },

    // 获取预约 cell 的描述
    getAppointmentCellDesc(data) {
      function parseT(a, b) {
        let s1 = a > 9 ? a : '0' + a
        let s2 = b > 9 ? b : '0' + b
        let r = s1 + ':' + s2
        return r
      }

      let nowT = new Date()
      let day = nowT.getDay()
      let h = nowT.getHours()
      let m = nowT.getMinutes()
      let time = parseT(h, m)
      let cis = 0
      let need = []
      for (let i = day; ; ) {
        cis += 1
        if (cis >= 9) {
          break
        }
        let hasAppoint = false
        let weekDay = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
        data.result.map((v, k) => {
          if (v.week.indexOf(i) != -1) {
            // 预约星期包含该天
            if (cis == 1) {
              if (v.enable) {
                if (time < v.startTime) {
                  need.push(v.startTime + ' ' + v.temp + '℃')
                  hasAppoint = true
                } else {
                  if (time < v.endTime) {
                    // 分段预约显示格式为：12:00关机；延时分段预约显示格式为：12:00结束
                    need.push(v.endTime + (this.data.setting.appointType == 'delayPartAppoint' ? ' 结束' : ' 关机'))
                    hasAppoint = true
                  }
                }
              }
            } else {
              if (v.enable) {
                need.push(v.startTime + ' ' + v.temp + '℃')
                // 分段预约显示格式为：12:00关机；延时分段预约显示格式为：12:00结束
                need.push(v.endTime + (this.data.setting.appointType == 'delayPartAppoint' ? ' 结束' : ' 关机'))
                hasAppoint = true
              }
            }
          }
        })
        if (hasAppoint) {
          need.push(time)
          need.sort()
          need.map((v, k) => {
            if (v == time) {
              if (cis == 1) {
                if (need[k + 1]) {
                  this.setData({ appointmentCellDesc: need[k + 1] })
                } else {
                  this.setData({ appointmentCellDesc: need[0] })
                }
              } else {
                if (need[0] == time) {
                  this.setData({ appointmentCellDesc: need[1] })
                } else {
                  this.setData({ appointmentCellDesc: need[0] })
                }
              }
            }
          })
          break
        } else {
          this.setData({ appointmentCellDesc: '' })
        }

        if (i == 6) {
          i = 0
          continue
        } else {
          i++
        }
      }
    },

    // 将时与分转换为12:00格式字符串
    parseTime(a, b) {
      var s1 = a > 9 ? a : '0' + a
      var s2 = b > 9 ? b : '0' + b
      var r = s1 + ':' + s2
      return r
    },

    // 查询云端预约
    queryAppoint() {
      if(!this.data.showFunAppointType) return
      const { setting } = this.data
      const { applianceCode, sn8 } = this.data.applianceData
      let appointType = 0
      if (setting.appointType == 'delayPartAppoint') {
        appointType = 1
      }
      this.setData({ appointType })
      requestService
        .request('e2', {
          msg: 'reserve',
          params: {
            applianceId: String(applianceCode),
            platform: sn8,
            action: 'getAll',
            flag: appointType, //默认为分段预约，0：分段预约；1：延时预约
            task: [],
          },
        })
        .then(({ data }) => {
          let result = data.result
          this.setData({ haveAppiont: result.some(i=>i.enable) })
          // this.getAppointmentCellDesc(data);
          let appointData = this.handleData(result) // 格式化预约数据
          this.setData({
            appointOnTimeList: this.getAppointOnTimeList(appointData),
          }) // 获取预约开启的数据
          if(this.data.setting.appointHoliday){
            this.getCloudToDeviceAppoint()
          }else{
            this.getNextAppoint()
          }
        })
        .catch(() => wx.showToast({ title: '查询预约数据失败', icon: 'none' }))
    },

    // 处理数据，将原始数据处理为格式化输出的数据
    handleData(data) {
      // this.hasAppointOn = false
      return data.map(item => {
        let endTimeDay = item.startTime >= item.endTime ? '次日' : '' // （大于和等于都属于跨天）
        let week = item.week
        if(item.legalDate&&item.legalDate==1){
          week = '6,0'
        }else if(item.legalDate&&item.legalDate==2){
          week = '1,2,3,4,5'
        }
        if (item.enable) {
          // this.hasAppointOn = true
        }
        return {
          label: item.label,
          enable: item.enable,
          temp: item.temp,
          startTime: item.startTime,
          endTime: item.endTime,
          taskId: item.taskId,
          isRepeat: item.isRepeat,
          isDefault: item.isDefault,
          wkStr: this.parseWeek(week, item.isRepeat),
          week: week,
          endTimeStr: endTimeDay + item.endTime
        }
      })
    },

    beforeClickCloudSwitch({ detail }) {
      this.setData({ cloudSwitchStatus: detail })
      if (this.data.haveAppiont && detail) {
        wx.showModal({
          title: '温馨提示',
          content: '开启云管家自动控温后，将关闭预约功能，是否确认开启云管家？',
          success: (res) => {
            if (res.confirm) {
              this.cloudAiToggle(this.data.cloudSwitchStatus)
              this.closeAllAppoint()
            }
          },
        })
      } else {
        this.cloudAiToggle(detail)
      }
    },

    // 关闭所有预约
    closeAllAppoint() {
      // 关闭所有云端预约
      requestService.request('e2', {
        msg: 'disableAllReserve',
        params: {
          flag: 1, //2020.11.19加上，为1代表是云管家关闭的预约
          applianceId: String(this.data.applianceData.applianceCode),
        },
      })
      this.setData({ haveAppiont: false })
    },

    // 获取进水温度
    getInWatertmp(cityname) {
      let params = {
        msg: 'getInWaterTemp',
        params: {
          city: cityname,
        },
      }
      requestService.request('common', params).then(({ data }) => {
        if (data.retCode == 0) {
          this.setData({ inWaterTemperature: data.result.inWaterTemp })
        }
      })
    },

    // 永久关闭云管家，设置自定义温度
    setCustomTemp(temp) {
      this.setData({ changing: true })
      requestService
        .request('e2', {
          msg: 'SetCloudManagerSwitch',
          params: {
            applianceId: String(this.data.applianceData.applianceCode),
            switch: 0,
          },
        })
        .then(({ data }) => {
          if (data.retCode == '0') {
            this.setData({
              isCloudOn: false,
              isCloudDelay: false,
              timeLeft: 0,
            })
            this.luaTemp(temp)
          } else {
            wx.showToast({ title: '网络较差，请稍后重试' })
          }
        })
        .finally(() => this.setData({ changing: false, isShowTemPicker: false }))
    },

    // 关闭云管家3小时
    set3hourOff(temp) {
      let configureParams = {
        msg: 'cloudManagerManualSetTemp',
        params: {
          applianceId: String(this.data.applianceData.applianceCode),
          action: 'set',
          temp: parseInt(temp),
        },
      }
      this.setData({ changing: true })
      requestService
        .request('e2', configureParams)
        .then(({ data }) => {
          if (data.retCode == 0) {
            this.getTimeLeft()
            this.luaTemp(temp)
          } else {
            wx.showToast({ title: '网络异常，请稍后再试' })
          }
        })
        .finally(() => this.setData({ changing: false, isShowTemPicker: false }))
    },

    // 查询云管家暂停3小时倒计时
    getTimeLeft() {
      if(!this.data.showFunCloudHome) return
      let configureParams = {
        msg: 'cloudManagerManualSetTemp',
        params: {
          applianceId: String(this.data.applianceData.applianceCode),
          action: 'get',
          temp: 0, // 要传数值不传没反应
        },
      }
      requestService.request('e2', configureParams).then(({ data }) => {
        if (data.retCode == 0) {
          this.setData({
            isCloudDelay: data.result.switch !== 0,
            timeLeft: data.result.minutesLeft,
          })
        }
      })
    },

    // 打开温度选择器
    openTemPicker() {
      if (this.data.deviceStatus >= 5) return
      this.initSelections()
      this.initTemperatureIndex()
      this.setData({ isShowTemPicker: true })
    },

    initSelections() {
      const { setting, applianceData, tem } = this.data
      const selections = tem
      this.setData({
        selections,
        'multiArray[0]': selections,
      })
      let sn8 = applianceData.sn8
      let list30 = [] //最小温度30
      let isMin30 = setting.minTem == 30
      if (list30.indexOf(sn8) != -1 || isMin30) {
        const selections = pickerRangeCreate(30, 75, 5)
        this.setData({
          selections,
          'multiArray[0]': selections,
        })
      }
    },
    initTemperatureIndex() {
      const { selections, status } = this.data
      let minTemp = selections[0]
      let temperatureIndex = Math.round((status.temperature - minTemp) / 5)
      if(status.temperature == 80){
        temperatureIndex = selections.length-1
      }
      this.setData({
        'multiIndex[0]': temperatureIndex<0 ? 0 : temperatureIndex,
      })
    },

    // 关闭温度选择器
    closeTemPicker() {
      this.setData({ isShowTemPicker: false })
    },

    // 温度设置picker取消事件
    onTemPickerCancel(e) {
      const temp = this.data.multiArray[0][e.detail[0]]
      // if (this.data.isCloudOn) {
      //   this.set3hourOff(temp)
      // } else {
      //   this.closeTemPicker()
      // }
      this.closeTemPicker()
    },

    // 温度设置picker确认事件
    onTemPickerConfirm(e) {
      const temp = this.data.multiArray[0][e.detail[0]]
      // 埋点
      let params = {
        object: '温度设置',
        ex_value: this.data.temCellRightText,
        value: temp + '℃',
      }
      this.rangersBurialPointClick('plugin_function_click_check', params)
      //
      if (this.data.isCloudOn) {
        this.setCustomTemp(temp)
      } else {
        this.luaTemp(temp)
      }
    },

    luaTemp(temp) {
      this.setData({ changing: true })
      let params = {}
      if (this.data.setting.isNew) {
        params = {
          temperature: parseInt(temp),
          control_type: 'part',
        }
      } else {
        params = {
          temperature: parseInt(temp),
          scene: 'off',
          scene_id: 0,
          mode: 'custom',
        }
      }
      this.luaControl(params)
        .then((data) => {
          this.setData({ status: data })
          this.updateUI()
        })
        .finally(() => this.setData({ isShowTemPicker: false }))
    },

    // 跳转预约页面
    goappointment() {
      if (this.data.deviceStatus >= 5) return
      const data = {
        type: this.data.applianceData.type,
        sn8: this.data.applianceData.sn8,
        sn: this.data.applianceData.sn,
        modelNumber: this.data.applianceData.modelNumber,
        applianceCode: this.data.applianceData.applianceCode,
        onlineStatus: this.data.applianceData.onlineStatus,
        status:this.data.status,
      }
      const setting = this.data.setting
      // 埋点
      this.rangersBurialPointClick('plugin_button_click', {
        element_content: setting.appointHoliday?'法定节假日预约':'预约',
        custom_params: '',
      })
      //
      wx.navigateTo({
        url: `../appointment/${setting.appointHoliday?'listHoliday':'list'}/index?applianceData=${JSON.stringify(data)}&setting=${JSON.stringify(setting)}`,
        events: {
          luaControl: (params) => this.luaControl(params),
          luaQuery: (loading) => this.luaQuery(loading),
          closeOneKeyAi: ()=> this.closeOneKeyAi()
        },
        success:(res)=>{
          this.appointPageEventChannel = res.eventChannel
        }
      })
    },

    // 开关机切换
    powerToggle() {
      if (this.data.deviceStatus > 5) return
      let power = this.data.status.power == 'on' ? 'off' : 'on'
      this.setData({ changing: true })
      this.luaControl({
        power: power,
      }).then((data) => {
        // beging 添加字节埋点：电源开关
        let param = {}
        param['page_name'] = '首页'
        param['object'] = '电源开关'
        param['ex_value'] = power == 'on' ? '关' : '开'
        param['value'] = power == 'on' ? '开' : '关'
        param['req_id'] = getReqId()
        this.rangersBurialPointClick('plugin_function_click_result', param)
        // end 添加字节埋点：电源开关
        this.setData({ status: data })
        this.updateUI()
        this.materialHandler(this.data.material)
      })
    },

    // 获取云管家开关状态
    getCloudSwitch() {
      wx.showLoading({ title: '加载中', mask: true })
      requestService
        .request('e2', {
          msg: 'GetCloudManagerSwitch',
          params: {
            applianceId: String(this.data.applianceData.applianceCode),
          },
        })
        .then(({ data }) => {
          console.log('执行了重新查询开关')
          if (data.retCode == '0') {
            this.setData({ isCloudOn: data.result.switch == '1' })
            // if (this.data.isCloudOn) {
            //   this.getAiTemp()
            // }
          }
        })
        .finally(() => wx.hideLoading())
    },

    // 获取云管家设定温度
    getAiTemp() {
      const { applianceCode, sn8 } = this.data.applianceData
      // 学习期标志、当前运行模式获取
      requestService
        .request('e2', {
          msg: 'cloudManagerSetTempModeSetting',
          params: {
            applianceId: String(applianceCode),
            action: 'get',
          },
        })
        .then(({ data }) => {
          if (data.retCode == '0') {
            // nativeService.alert(res.result)
            // {"mode":0,"isStudying":true}
            if (!data.result.mode) {
              // mode为0时智能控温，获取温度数据
              requestService
                .request('e2', {
                  msg: 'getEcoSetTempData',
                  params: {
                    applianceId: String(applianceCode),
                    queryMode: 'C',
                  },
                })
                .then(({ data }) => {
                  if (data.retCode == 0) {
                    data = data.result.data
                    // nativeService.alert(data)
                    if (data.length > 0) {
                      // let numIndex = newDate.getHours()==0 ? 23 : newDate.getHours()-1
                      let numIndex = new Date().getHours()
                      this.setData({ aiTemp: data[numIndex].temp })
                    }
                  }
                })
            } else {
              // mode为1时自定义控温，获取温度
              requestService
                .request('e2', {
                  msg: 'cloudManagerManulSetTempData',
                  params: {
                    applianceId: String(applianceCode),
                    platform: sn8,
                    action: 'get',
                  },
                })
                .then(({ data }) => {
                  if (data.retCode == 0 && data.result.temp) {
                    data = data.result.temp
                    // nativeService.alert(data)
                    if (data.length > 0) {
                      // let numIndex = newDate.getHours()==0?23:newDate.getHours()-1
                      let numIndex = new Date().getHours()
                      this.setData({ aiTemp: data[numIndex] })
                    }
                  }
                })
            }
          }
        })
    },

     // 
     getCloseList({ setting, appData, data }) {
      if (!setting || !appData) {
        return []
      }
      let arr = []
      if (data && data.funName) {
        let listObject = {
          cloudManager: [
            'superWater', // 超大水量
            'eCapacity', // E+增容/净肤洗/多人洗
            'bigWaterPart', // E+增容/超大水量 分段控制
            'nightElectricity', // 峰谷夜电
            'nightElectricityCloud', // 峰谷夜电(云端)
            'saveMode', // 节能模式/低耗保温/中温保温/低耗节能（ECO图标）/ECO/随时浴
            'tHeat', // 单人瞬热
            'speedWash', // 极速洗
            'summerMode', // 夏季模式
            'winterMode', // 冬季模式
            'fastHotWashing',//瞬热洗
            'intelligentScaleInhibition', // 智能抑垢
          ],
          oneKeyAi: [
            'superWater', // 超大水量
            'eCapacity', // E+增容/净肤洗/多人洗
            'bigWaterPart', // E+增容/超大水量 分段控制
            'nightElectricity', // 峰谷夜电
            'nightElectricityCloud', // 峰谷夜电(云端)
            'saveMode', // 节能模式/低耗保温/中温保温/低耗节能（ECO图标）/ECO/随时浴
            'smartSterilize', // 电控智能杀菌
            'smartHome', // 智能省电
            'smartSaving', // 智能省电
            'smartSavingCloud', // 智能省电
            'tHeat', // 单人瞬热
            'speedWash', // 极速洗
            'summerMode', // 夏季模式
            'winterMode', // 冬季模式
            'fastHotWashing',//瞬热洗
            'intelligentScaleInhibition', // 智能抑垢
          ],
        }
        arr = listObject[data.funName]
      } else if (data && data.arr && data.arr.length > 0) {
        arr = data.arr
      }
      if (setting.funcList.length < 1 || arr.length < 1) {
        return []
      }
  
      let hasfun = setting.funcList.map(i => arr.includes(i.key) ? i.key : "").filter(j => j != "")
      if (hasfun.length > 0) {
        let list = []
        hasfun.forEach(key => {
          if (key == 'superWater') { // 超大水量
            let isOn = appData.big_water == 'on'
            if (isOn) {
              let params = {
                "big_water": "off",
                "control_type": setting.isNew ? "part" : ""
              }
              list.push({ key: key, params: params })
            }
          } else if (key == 'eCapacity' || key == 'bigWaterPart') { // E+增容/净肤洗/多人洗/超大水量 分段控制
            let isOn = appData.eplus == 'on' || appData.mode == 'eplus'
            if (isOn) {
              let params = null
              if (setting.isNew) {
                let obj = setting.funcList.find(i => i.key == 'eCapacity' || i.key == 'bigWaterPart')
                let isPart = obj.isPart || false
                params = {
                  "control_type": "part",
                  [isPart ? 'eplus_part' : 'eplus']: "off"
                }
              } else {
                params = {
                  "mode": "none"
                }
              }
              list.push({ key: key, params: params })
            }
          } else if (key == 'nightElectricity') { // 峰谷夜电
            let isOn = appData.night == 'on' || appData.mode == 'night'
            if (isOn) {
              let params = null
              if (setting.specialConfig == 'W7_nightElec') {
                // W7特殊逻辑
                params = {
                  'new_night': "off",
                  "control_type": 'part',
                }
              } else {
                if (setting.isNew) {
                  params = {
                    "night": "off",
                    "control_type": "part"
                  }
                } else {
                  params = {
                    "mode": "none"
                  }
                }
              }
              list.push({ key: key, params: params })
            }
          } else if (key == 'saveMode') { // 节能模式/低耗保温/中温保温/低耗节能（ECO图标）/ECO/随时浴
            let isOn = appData.efficient == 'on' || appData.mode == 'efficient'
            if (isOn) {
              let params = null
              if (setting.isNew) {
                let obj = setting.funcList.find(i => i.key == 'saveMode')
                let isPart = obj.isPart || false
                params = {
                  [isPart ? 'efficient_part' : 'efficient']: "off",
                  "control_type": "part"
                }
              } else {
                params = {
                  "mode": "none"
                }
              }
              list.push({ key: key, params: params })
            }
          } else if (key == 'smartSterilize') { // 电控智能杀菌
            let isOn = appData.smart_sterilize == 'on'
            if (isOn) {
              let num = appData.sterilize_cycle_index
              let sterilizeCycle = num == 1 ? 7 : num == 2 ? 14 : (num == 4 ? 30 : 21)
              let params = {
                "smart_sterilize": "off",
                "sterilize_cycle_days": sterilizeCycle,
                "sterilize_cycle_index": appData.sterilize_cycle_index,
                "control_type": "part"
              }
              list.push({ key: key, params: params })
            }
          } else if (key == 'smartHome' || key == 'smartSaving') { // 智能省电
            let isOn = appData.memory === 'on' || appData.mode === 'memory'
            if (isOn) {
              let params = null
              if (setting.isNew) {
                params = {
                  "memory": "off",
                  "control_type": "part"
                }
              } else {
                if (setting.specialConfig == 'GQ3_mutex') {
                  // CFGQXX32(旧GQ3,A058)特有逻辑，出水断电、智能管家、超大水量互斥
                  params = {
                    'mode': "none",
                    'big_water': 'off',
                    // 'protect': 'off', // 电控端或lua已经做了互斥
                  }
                } else if (setting.specialConfig == 'FT3_mutex' || setting.specialConfig == 'FQ5_mutex') {
                  // 50FQ5(A079)特殊逻辑, 智能管家、T+瞬热、超大水量互斥
                  // CFFT4050(旧FT3,A059)特殊逻辑，超大水量、智能管家、T+瞬热、出水断电互斥
                  params = {
                    "mode": "none",
                    "big_water": 'off',
                    "t_hot": 'off',
                    // 'protect': 'off' // 电控端或lua已经做了互斥
                  }
                } else {
                  params = {
                    "mode": "none"
                  }
                }
              }
              list.push({ key: key, params: params })
            }
          } else if (key == 'smartSavingCloud') { // 智能省电
            let isOn = appData.memory === 'on' || appData.mode === 'memory'
            if (isOn) {
              let params = null
              if(setting.isNew) {  // 新0214分段协议
                let obj = setting.funcList.find(i => i.key == 'smartSavingCloud')
                let isPart = obj.isPart || false
                params = {
                  "control_type": "part",
                  [isPart ? 'memory_part' : 'memory']: "off"
                }
              } else {   // 旧0204协议
                params = {
                  "mode": "none"
                }
              }
              list.push({ key: key, params: params })
            }
          } else if (key == 'tHeat') { // 单人瞬热
            let isOn = appData.t_hot == 'on'
            if (isOn) {
              let params = null
              if (setting.isNew) {
                params = {
                  "t_hot": "off",
                  "control_type": "part"
                }
              } else {
                if (setting.specialConfig == 'FQ5_mutex') {
                  // 50FQ5(A079)特殊逻辑, 智能管家、T+瞬热、超大水量互斥
                  params = {
                    "t_hot": "off",
                    "mode": 'none',
                    "big_water": 'off'
                  }
                } else {
                  params = {
                    "t_hot": "off",
                  }
                }
              }
              list.push({ key: key, params: params })
            }
          } else if (key == 'speedWash') { // 极速洗
            let isOn = appData.fast_wash == 'on' || appData.mode == 'fast_wash'
            if (isOn) {
              let params = null
              if (setting.isNew) {
                let obj = setting.funcList.find(i => i.key == 'speedWash')
                let isPart = obj.isPart || false
                params = {
                  [isPart ? 'fast_wash_part' : 'fast_wash']: "off", // isPart通过setting找到对应配置获取
                  "control_type": "part"
                }
              } else {
                params = {
                  "mode": "none",
                  "scene": 'off',
                  "scene_id": 0,
                }
              }
              list.push({ key: key, params: params })
            }
          } else if (key == 'winterMode') { // 冬季模式
            let isOn = appData.winter == 'on' || appData.mode == 'winter'
            if (isOn) {
              let params = null
              if (setting.isNew) {
                let obj = setting.funcList.find(i => i.key == 'winterMode')
                let isPart = obj.isPart || false
                params = {
                  [isPart ? 'winter_mode_part' : 'winter']: "off",
                  "control_type": "part"
                }
              } else {
                params = {
                  "mode": "none"
                }
              }
              list.push({ key: key, params: params })
            }
          } else if (key == 'summerMode') { // 夏季模式
            let isOn = appData.summer == 'on' || appData.mode == 'summer'
            if (isOn) {
              let params = null
              if (setting.isNew) {
                let obj = setting.funcList.find(i => i.key == 'summerMode')
                let isPart = obj.isPart || false
                params = {
                  [isPart ? 'summer_mode_part' : 'summer']: "off",
                  "control_type": "part"
                }
              } else {
                params = {
                  "mode": "none"
                }
              }
              list.push({ key: key, params: params })
            }
          }else if(key=='nightElectricityCloud'){ // 峰谷夜电（云端）
            // this.closeNightElectricityCloud("get")
            list.push({ key: key , params:'' })
          }else if (key == 'fastHotWashing') { // 瞬热洗
            let isOn = appData.fast_hot_washing == 'on'
            if (isOn) {
              let params = {
                "fast_hot_washing": 'off',
                "control_type": setting.isNew ? "part" : ""
              }
              list.push({ key: key, params: params })
            }
          }else if (key == 'intelligentScaleInhibition') { // 智能抑垢
            let isOn = appData.intelligent_scale_inhibition == 'on'
            if (isOn) {
              let params = {
                "intelligent_scale_inhibition": 'off',
                "control_type": setting.isNew ? "part" : ""
              }
              list.push({ key: key, params: params })
            }
          }
        });
        return list
      } else {
        return []
      }
    },
    // 云管家关闭其他互斥功能
    closeOther(){
      let closeList = this.getCloseList({
        setting:this.data.setting,
        appData:this.data.status,
        data:{funName:'cloudManager'}
      })
      if(closeList.length<1){
        this.cloudHomeSetTemp()     
        return
      } 
      let closeList2 = closeList.filter(i=>i.key!='nightElectricityCloud')
      if(closeList2.length<1){
        this.cloudHomeSetTemp()
      }else{
        for(let i in closeList2){
          this.luaControl(closeList2[i].params).then((data)=>{
            if(i==closeList2.length-1){
              this.setData({ status: data })
              this.updateUI()
              this.cloudHomeSetTemp()
            }
          })
        }
      } 
      this.closeNightElectricityCloud() // 关闭峰谷夜电
    },
    // 
    closeNightElectricityCloud(){
      requestService.request('e2',{
        msg: 'peakvalleyNightElec',
          params: {
            applianceId: String(this.data.applianceData.applianceCode),
            platform: this.data.applianceData.sn8,
            action: 'set',
            switch: 0,
          },
      }).then(res=>{
        
      })
    },
    /////////////////提取当前hour对应的温度
    // 初始化数据，获取是否学习期、控温模式
    cloudHomeSetTemp(){
      requestService.request('e2',{
        msg: 'cloudManagerSetTempModeSetting',
          params: {
            applianceId: String(this.data.applianceData.applianceCode),
            action: 'get',
          },
      }).then(({ data })=>{
        console.log('开启云管家后设置','mode',data)
        if (data.retCode == "0") {
          let isEarly = true
          let tabType = 0
          if(data.result){
            isEarly = data.result.isStudying
            tabType = isEarly ? 2 : (data.result.mode==1 ? 2 : 1) // mode：0智能，1自定义，2智能关机 
            this.setData({ isStudying: isEarly, cloudMode: tabType })
          }
          if(tabType==1){
            if(!isEarly){
              this.cloudHomeSetTempAi()//非学习期，执行智能温度数据获取
            }else{
              this.cloudHomeSetTempSelf()//自定义温度数据获取
            }
          }else if(tabType==2){
            this.cloudHomeSetTempSelf()//自定义温度数据获取
          }
        }
      })
    },
    // 按当前温度初始化aiData/selfData
    creatArrData(val){
      let temp = Number(val)
      if(temp == 80){
        let arr = new Array(24).fill(75) 
        return arr
      }else{
        let arr = new Array(24).fill(temp) 
        return arr
      }
    },
    cloudHomeSetTempAi(){
      // 按当前温度初始化aiData
      let aiData = this.creatArrData(this.data.status.temperature)
      requestService.request("e2", {
        msg: "getEcoSetTempData",
        params: {
          applianceId: String(this.data.applianceData.applianceCode),
          queryMode: "C",
        },
      })
      .then(({ data }) => {
        console.log('开启云管家后设置','ai',data)
        if(data.retCode == "0"){
          let aiList = data.result.data
          if (aiList.length == 24) {
            aiList.forEach((item, i) => {
              aiData.splice(i, 1, item.temp)
            })
          }
          let aiPowerOffData = aiData.map(temp=>{
            if(temp==37){ // 闲时关机模式时，集团推送37度即为关机，云端会下发关机；闲时低温模式时，集团推送37度即为37度，云端会下发37
              return 29 // 前端APP统一以29度作为关机并显示关机数据
            }else{
              return temp
            }
          })
          let list = this.data.cloudMode==2 ? aiPowerOffData : aiData
          this.cloudHomeSetTempNow(list)
        }
      })
    },
    cloudHomeSetTempSelf(){
      // 按当前温度初始化selfData
      let selfData = this.creatArrData(this.data.status.temperature)
      let today = new Date().getDay()
      requestService.request("e2", {
        msg: "cloudManagerManulSetTempDataV2",
        params: {
          applianceId: String(this.data.applianceData.applianceCode),
          platform: this.data.applianceData.sn8,
          action: "get",
        },
      })
      .then(({ data }) => {
        console.log('开启云管家后设置','self',data)
        if(data.retCode == "0"){
          let weekendTemp = data.result.weekendTemp||[] // 周末曲线
          let weekendSwitch = data.result.weekendSwitch // 是否打开
          let workDayTemp = data.result.workDayTemp||[] // 工作日曲线
          let workDaySwitch = data.result.workDaySwitch // 是否打开
          if(today==0||today==6){
            if(weekendSwitch&&weekendTemp.length){
              selfData=weekendTemp
            }
          }else{
            if(workDaySwitch&&workDayTemp.length){
              selfData=workDayTemp
            }
          }
          this.cloudHomeSetTempNow(selfData)
        }
      })
    },
    cloudHomeSetTempNow(list){
      let numIndex = new Date().getHours();
      let temp = list[numIndex]
      requestService.request("e2", {
        msg: "setCloudSetTempEvent",
        params: {
          applianceId: String(this.data.applianceData.applianceCode),
          temp: temp,
          fun: "cloudManager",
        },
      }).then(({data})=>{
        console.log('开启云管家后设置','set',temp)
        if(data.retCode=='0'){
          if(Number(temp)<30){
            this.powerToggle('off')
          }else if(this.data.status.power == 'off'){
            this.powerToggle('on')
            setTimeout(() => {
              this.luaTemp(temp)
            }, 1500);
          }else{
            this.luaTemp(temp)
          }
        }
      })
    },
    // 云管家切换
    cloudAiToggle(switchStatus) {
      this.setData({ changing: true })

      // 埋点
      // let params={
      //   object:'云管家',
      //   ex_value: this.data.isCloudOn=='on' ? "关" : "开",
      //   value: this.data.isCloudOn=='on' ? "关" : "开",
      //   custom_params: ''
      // }
      // this.rangersBurialPointClick('plugin_function_click_check',params)
      //

      wx.showLoading({ title: '加载中', mask: true })
      requestService
        .request('e2', {
          msg: 'SetCloudManagerSwitch',
          params: {
            applianceId: String(this.data.applianceData.applianceCode),
            switch: switchStatus ? 1 : 0,
          },
        })
        .then(({ data }) => {
          if (data.retCode == '0') {
            // 埋点
            let params = {
              object: '云管家',
              ex_value: this.data.isCloudOn == 'on' ? '开' : '关',
              value: this.data.isCloudOn == 'on' ? '关' : '开',
              custom_params: '',
            }
            this.rangersBurialPointClick('plugin_function_click_result', params) // 埋点
            //
            this.setData({ isCloudOn: switchStatus == 1 })
            this.getTimeLeft()
            this.updateUI()
            if(switchStatus == 1){
              this.closeOther()
            }
          } else {
            wx.showToast({ title: '网络较差，请稍后重试' })
          }
        })
        .finally(() => {
          wx.hideLoading()
          this.setData({ changing: false })
        })
    },

    // 滤芯购买
    buyFilter() {
      if (this.data.deviceStatus > 5) return
      openSubscribe(this.properties.applianceData, templateIds[31][0])
      this.setData({ isShowBuyFilterSheet: true })
    },

    closeBuyFilterSheet() {
      this.setData({ isShowBuyFilterSheet: false })
    },

    // 选中滤芯购买的选项
    onBuyFilterSheetSelect({ detail }) {
      requestService
        .request('common', {
          msg: 'getConsumablesInfo',
          params: {
            protype: 'e2',
            platform: 'meijuLite',
          },
        })
        .then(({ data }) => {
          const { sn8 } = this.data.applianceData
          const jumpList = data.result
          console.log('返回的', jumpList)
          let jumpUrl = jumpList.filter((item) => item.type == detail.value)[0].url
          this.closeBuyFilterSheet()
          if (detail.name === 'VC美肤香氛滤芯') {
            // 埋点
            let params = {
              element_content: '去购买',
              custom_params: JSON.stringify({ type: 'VC美肤香氛滤芯' }),
            }
            this.rangersBurialPointClick('plugin_button_click', params)

            this.goMiniProgram(jumpUrl)
          } else if (detail.name === 'VC MINI美肤滤芯') {
            // 埋点
            let params = {
              element_content: '去购买',
              custom_params: JSON.stringify({ type: 'VC MINI美肤滤芯' }),
            }
            this.rangersBurialPointClick('plugin_button_click', params)

            this.goMiniProgram(jumpUrl)
          } else {
            // 埋点
            let param = {
              element_content: '去购买',
              custom_params: JSON.stringify({ type: '净氯滤芯' }),
            }
            //
            if (sn8 == '51032GF7' || sn8 == '51002142' || sn8 == '510032VC' || sn8 == '510B850A') {
              wx.makePhoneCall({ phoneNumber: '4008899315' })
            } else if (sn8 == '51032CQ6' || sn8 == '51032CQ8') {
              // 埋点
              this.rangersBurialPointClick('plugin_button_click', param)
              //
              this.goMiniProgram(jumpUrl)
            } else {
              // 埋点
              this.rangersBurialPointClick('plugin_button_click', param)
              //
              this.goMiniProgram(jumpUrl)
            }
          }
        })
        .catch((res) => {
          console.log(res)
        })
    },

    //*****固定方法，供外界调用****
    getCurrentMode() {
      const { onlineStatus, applianceCode } = this.data.applianceData
      //当设备列表页切换到当前页面时，应该呈现的整体样式
      let mode
      if (onlineStatus == 0) {
        // 离线
        mode = CARD_MODE_OPTION.OFFLINE
      } else {
        // 在线
        mode = CARD_MODE_OPTION.HEAT
      }
      return {
        applianceCode,
        mode: mode,
      }
    },

    getActived() {
      //当设备列表页切换到当前页面时触发
      //通知外界更新界面
      // this.triggerEvent('modeChange', this.getCurrentMode());
      //刷新设备状态
      this.luaQuery()
        .then((data) => {
          //激活时再次刷新在线离线状态
          // 功能列
          this.setData({ status: data })
          this.updateUI()
        })
        .catch((error) => {
          if (error && error.data && error.data.code == 1306) {
            if (!this.data.destory) {
              wx.showToast({
                title: '设备未响应，请稍后尝试刷新',
                icon: 'none',
              })
            }
          }
        })
      this.setData({ destory: false })
      this.queryIntervalHandler()

      // beging 添加字节埋点：进入插件页
      let param = {}
      param['page_name'] = '首页'
      param['object'] = '进入插件页'
      this.rangersBurialPointClick('plugin_page_view', param)
      // end 添加字节埋点：进入插件页
    },

    initCard() {
      //初始化卡片页，只执行一次
      if (!this.data.isInit) {
        this.luaQuery(false)
          .then((data) => {
            this.setData({
              status: data,
              isInit: true,
            })
            this.updateUI()
          })
          .catch((error) => {
            this.setData({
              isInit: true,
            })
          })
      }
    },

    updateUI() {
      //更新界面
      this.triggerEvent('modeChange', this.getCurrentMode())
      let err = this.data.status.error_code
      if (err == 1) {
        this.setData({ errContent: 'E1:漏电故障' })
      } else if (err == 2) {
        this.setData({ errContent: 'E2:干烧故障' })
      } else if (err == 4) {
        this.setData({ errContent: 'E3:超温故障' })
      } else if (err == 8) {
        this.setData({ errContent: 'E4:传感器故障' })
      } else if (this.data.status.elec_warning == 'on') {
        this.setData({ errContent: 'E0:地线带电故障' })
      }
    },

    //轮询
    queryIntervalHandler() {
      const { destory, changing } = this.data
      const { applianceData } = this.data
      if (queryTimeout) {
        clearTimeout(queryTimeout)
      }
      queryTimeout = setTimeout(() => {
        this.luaQuery(false)
          .then((data) => {
            if (!destory) {
              if (changing) {
                // 跳过本次轮询
                this.queryIntervalHandler()
              } else {
                this.setData({
                  status: data,
                  applianceData: {
                    ...applianceData,
                    onlineStatus: '1',
                  },
                })
                this.updateUI()
                this.queryAppoint()
                this.queryIntervalHandler()
              }
            }
          })
          .catch((error) => {
            if (!destory) {
              this.queryIntervalHandler()
            }
          })
      }, 4000)
    },

    luaQuery(loading = true) {
      //查询设备状态并更新界面
      let self = this
      return new Promise((resolve, reject) => {
        if (loading) {
          wx.showLoading({
            title: '加载中',
            mask: true,
          })
        }
        if (isMock) {
          this.setData({
            status: mockData.luaGet.data,
          })
          resolve(mockData.luaGet.data)
          return
        }
        let reqData = {
          reqId: getReqId(),
          stamp: getStamp(),
          applianceCode: this.data.applianceData.applianceCode,
          command: {},
        }
        requestService.request('luaGet', reqData).then(
          (resp) => {
            if (loading) {
              wx.hideLoading()
            }
            if (resp.data.code == 0) {
              this.appointPageEventChannel&&this.appointPageEventChannel.emit('initPageData',{status:resp.data.data || {}})
              resolve(resp.data.data || {})
            } else {
              reject(resp)
            }
          },
          (error) => {
            if (loading) {
              wx.hideLoading()
            }
            if (error && error.data) {
              if (error.data.code == 1307) {
                //离线
                self.setData({
                  'applianceData.onlineStatus': '0',
                })
                self.triggerEvent('modeChange', self.getCurrentMode())
              }
            }
            reject(error)
          }
        )
      })
    },

    luaControl(param) {
      //控制设备
      let self = this
      return new Promise((resolve, reject) => {
        wx.showLoading({
          title: '加载中',
          mask: true,
        })
        if (isMock) {
          resolve(mockData.luaControl.data.status)
          return
        }
        let reqData = {
          reqId: getReqId(),
          stamp: getStamp(),
          applianceCode: this.data.applianceData.applianceCode,
          command: {
            control: param,
          },
        }
        requestService.request('luaControl', reqData).then(
          (resp) => {
            wx.hideLoading()
            self.setData({
              changing: false,
            })
            if (resp.data.code == 0) {
              resolve(resp.data.data.status || {})
            } else {
              reject(resp)
            }
          },
          (error) => {
            wx.hideLoading()
            self.setData({
              changing: false,
            })
            wx.showToast({
              title: '请求失败，请稍后重试',
              icon: 'none',
              duration: 2000,
            })
            console.error(error)
            reject(error)
          }
        )
      })
    },

    // 关闭一键智享
    closeOneKeyAi(){
      const { setting } = this.data
      if(!setting.hasOneKeyAi){
        return
      }
      requestService
      .request('e2', {
        msg: 'SetOneKeyAiSwitch',
        params: {
          applianceId: String(this.data.applianceData.applianceCode),
          switch:0
        },
      })
      .then((rs) => {

      })
      .catch((e) => {
        wx.hideLoading()
      })
    },

    //卡片切换时结束轮询
    getDestoried() {
      this.setData({
        destory: true,
      })
      clearTimeout(queryTimeout)
    },

    changeIconPercent({ key, value }) {
      // const { currentItem, material } = this.data
      // let circleDataList = this.data.circleDataList
      // circleDataList.forEach((i) => {
      //   if (i.key == key) {
      //     if (currentItem[key].key) {
      //       i.circleData.progressCounter = Number(currentItem[key].precent)
      //     } else {
      //       i.circleData.progressCounter = material[key].length ? Number(material[key][0].precent) : 0
      //     }
      //   }
      // })
      // this.setData({
      //   circleDataList: JSON.parse(JSON.stringify(circleDataList)),
      // })
    },

    // 云端耗材数据查询
    queryCloudMaintenance() {
      const { setting } = this.data
      const { applianceCode, sn8 } = this.data.applianceData
      requestService
        .request('e2', {
          msg: 'maintainService',
          params: {
            applianceId: String(applianceCode),
            platform: sn8,
            action: 'query',
          },
        })
        .then(({ data }) => {
          if (data.retCode != 0) {
            wx.showToast({ title: '网络异常，请稍后再试', icon: 'none' })
            return
          }
          if (setting.mbReport >= 2) {
            // 云端处理镁棒寿命
            let mbUsedDays =
              data.result.magnesiumRodUsedDays < 0
                ? 0
                : data.result.magnesiumRodUsedDays > 730
                ? 730
                : data.result.magnesiumRodUsedDays
            let life = this.data.life
            life.splice(0, 1, mbUsedDays)
            this.setData({ life })
          }
          if (setting.lxReport == 2) {
            // 云端处理滤芯寿命
            let filterUsedDays =
              data.result.filterUsedDays < 0 ? 0 : data.result.filterUsedDays > 365 ? 365 : data.result.filterUsedDays
            let life = this.data.life
            life.splice(1, 1, filterUsedDays)
            this.setData({ life })
          }
          if (setting.ndReport == 3) {
            // 云端处理内胆寿命
            let tankUsedDays =
              data.result.tankUsedDays < 0 ? 0 : data.result.tankUsedDays > 1095 ? 1095 : data.result.tankUsedDays
            let life = this.data.life
            life.splice(2, 1, tankUsedDays)
            this.setData({ life })
          }
          // 渲染页面数据
          this.filterHandler()
        })
    },

    dateDiff(date) {
      let day1 = new Date(date)
      let day2 = new Date()
      return parseInt(Math.abs(day2 - day1) / 1000 / 60 / 60 / 24)
    },

    getHomeGrouplistService() {
      //获取家庭列表
      let reqData = {
        reqId: getReqId(),
        stamp: getStamp(),
      }
      return new Promise((resolve, reject) => {
        requestService.request('homeList', reqData).then(
          (resp) => {
            if (resp.data.code == 0) {
              resolve(resp.data.data.homeList)
            } else {
              reject(resp)
            }
          },
          (error) => {
            reject(error)
          }
        )
      })
    },

    //--------------------VC滤芯---------start
    // 获取VC滤芯
    getVClxData() {
      return new Promise(async (resolve, reject) => {
        const { infoDescVClx1, infoDescVClx2 } = this.data
        let homegroupId = this.data.applianceData.homegroupId
        if (!homegroupId) {
          const res = await this.getHomeGrouplistService()
          homegroupId = res[0].homegroupId
        }
        const name = 'filter'
        requestService
          .request('e2', {
            msg: 'vcFilterInfo',
            params: {
              homeId: homegroupId,
              filterInfo: null,
              action: 'getAll',
            },
          })
          .then(({ data }) => {
            if (data.retCode == '0') {
              let arr = []
              if (data.result.length) {
                arr = JSON.parse(JSON.stringify(data.result))
                for (let i of arr) {
                  let num = this.dateDiff(i.date)
                  let max = i.mainId == 3 ? 45 : i.mainId == 1 ? 90 : 180
                  let surplus = num >= max ? 0 : max - num
                  i['isVClx'] = true
                  i['infoText1'] = num
                  i['infoUnit1'] = '天'
                  i['infoLabel1'] = '已使用天数'
                  i['infoText2'] = surplus > 0 ? surplus : 0
                  i['infoUnit2'] = '天'
                  i['infoLabel2'] = '剩余天数'
                  i['infoDesc'] = i.mainId == 1 ? infoDescVClx1 : infoDescVClx2
                  i['precent'] = Number(num >= max ? 0 : (((max - num) / max) * 100).toFixed(0))
                  i['isError'] = surplus <= 10 ? true : false
                  i['errorDesc'] = `提示：VC滤芯剩余${surplus}天，请及时更换！`
                  i['key'] = name
                }

                let material = this.data.material
                material[name] = arr
                this.setData({
                  material: JSON.parse(JSON.stringify(material)),
                })
              } else {
                let material = this.data.material
                material[name] = []
                this.setData({
                  material: JSON.parse(JSON.stringify(material)),
                })
              }
              this.filterHandler()
              resolve()
            } else {
              reject()
            }
          })
          .catch(() => {
            reject()
            // nativeService.hideLoading();
          })
      })
    },

    // 处理滤芯数据
    filterHandler() {
      const { setting, infoDescVClx3, infoDesc, life } = this.data
      const { sn8 } = this.data.applianceData
      const { waterday_highbyte, waterday_lowbyte, passwater_highbyte, passwater_lowbyte } = this.data.status
      const name = 'filter'

      this.setData({ isShowFilterLoading: true })

      // B850A特有逻辑，滤芯寿命采用活水天数计算
      if (setting.specialConfig == 'B850A_filter') {
        let liveWater = waterday_highbyte * 256 + waterday_lowbyte * 1 // 活水天数
        liveWater = liveWater > 0 ? (liveWater > 90 ? 90 : liveWater) : 0
        let obj = {
          isVClx: false,
          infoDesc: infoDescVClx3,
          infoText1: liveWater,
          infoUnit1: '天',
          infoLabel1: '已使用天数',
          infoText2: 90 - liveWater > 0 ? 90 - liveWater : 0,
          infoUnit2: '天',
          infoLabel2: '剩余天数',
          precent: 100 - (liveWater / 90) * 100,
          key: name,
        }
        if (liveWater >= 80) {
          obj.isError = true
        }
        obj.errorDesc = '提示：滤芯余量不足，建议及时更换'

        let index = this.data.material[name].findIndex((i) => i.isVClx == false)
        let material = this.data.material
        if (index > -1) {
          material[name][index] = obj
          this.setData({ material })
        } else {
          if (!!setting.lxReport) {
            material[name].push(obj)
            this.setData({ material })
          }
        }

        this.changeIconPercent({
          key: name,
          value: 100 - (liveWater / 90) * 100,
        })
        this.setData({
          material: JSON.parse(JSON.stringify(this.data.material)),
        })

        // 暂时不用（不可删除）
        // this.infoDesc = '滤芯可将水中钙、镁离子捕获，防止在高温下形成水垢。使用周期90天（因使用地域、水质、用水量不同，实际使用周期不同）。'
        return
      }
      if (setting.lxReport == 1) {
        // 1.电控上报滤芯数据
        let lxlife = passwater_highbyte * 256 + passwater_lowbyte // 滤芯过水量
        lxlife = lxlife > 0 ? lxlife : 0
        let lxMaxPassWater = setting.lxMaxPassWater || 48000
        let lxPercent = Math.floor(((lxMaxPassWater - lxlife) / lxMaxPassWater) * 100).toFixed(0)
        lxPercent = lxPercent <= 0 ? 0 : lxPercent
        let obj = {
          isVClx: false,
          infoDesc: sn8 == '510032VC' ? infoDesc : infoDescVClx3,
          infoText1: lxPercent,
          infoUnit1: '%',
          infoLabel1: '滤芯余量',
          infoText2: '',
          infoUnit2: '',
          infoLabel2: '',
          precent: lxPercent,
          key: name,
        }
        if (lxPercent <= 10) {
          obj.isError = true
        }
        obj.errorDesc = '提示：滤芯余量不足，建议及时更换'

        let index = this.data.material[name].findIndex((i) => i.isVClx == false)
        let material = this.data.material
        if (index > -1) {
          material[name][index] = obj
          this.setData({ material })
        } else {
          if (!!setting.lxReport) {
            material[name].push(obj)
            this.setData({ material })
          }
        }
        this.changeIconPercent({ key: name, value: lxPercent })
      } else {
        // 2.云端处理滤芯数据
        let obj = {
          isVClx: false,
          infoDesc: infoDescVClx3,
          infoText1: life[1],
          infoUnit1: '天',
          infoLabel1: '已使用天数',
          infoText2: 365 - life[1] > 0 ? 365 - life[1] : 0,
          infoUnit2: '天',
          infoLabel2: '剩余天数',
          precent: Math.floor(100 - (life[1] / 365) * 100),
          key: name,
        }
        if (life[1] >= 355) {
          obj.isError = true
        }
        obj.errorDesc = '提示：滤芯余量不足，建议及时更换'

        let index = this.data.material[name].findIndex((i) => i.isVClx == false)
        let material = this.data.material
        if (index > -1) {
          material[name][index] = obj
          this.setData({ material })
        } else {
          if (!!setting.lxReport) {
            material[name].push(obj)
            this.setData({ material })
          }
        }
        this.changeIconPercent({
          key: name,
          value: Math.floor(100 - (life[1] / 365) * 100),
        })
      }
      this.setData(
        {
          material: JSON.parse(JSON.stringify(this.data.material)),
        },
        () => {
          this.setData({ isShowFilterLoading: false })
        }
      )
    },

    // 显示云管家信息
    showCloudHomeInfo() {
      if (this.data.deviceStatus > 4) return
      wx.showModal({
        content:
          '1、云管家开启中，将持续学习您的用水习惯，进行智能控温，达到省电的效果\n2、新配网的设备由于没有历史数据，云管家会进入14天的学习期，学习期内记录您的用水习惯。学习期结束后，就可以使用云管家来节省电费啦',
        showCancel: false,
      })
    },
    // 跳转 小程序
    goMiniProgram(url) {
      wx.navigateToMiniProgram({
        appId: 'wx255b67a1403adbc2',
        path: url,
      })
    },

    // 埋点
    rangersBurialPointClick(eventName, param) {
      if (this.data.applianceData) {
        let paramBurial = {}
        let paramBase = {
          module: '插件',
          apptype_name: '电热水器',
          widget_cate: this.data.applianceData.type,
          sn8: this.data.applianceData.sn8,
          sn: this.data.applianceData.sn,
          a0: this.data.applianceData.modelNumber,
          iot_device_id: this.data.applianceData.applianceCode,
          online_status: this.data.applianceData.onlineStatus,
        }
        paramBurial = Object.assign(paramBase, param)
        rangersBurialPoint(eventName, paramBurial)
      }
    },
  },
})
