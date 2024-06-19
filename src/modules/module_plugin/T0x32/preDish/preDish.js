import pluginMixin from 'm-miniCommonSDK/utils/plugin-mixin'
import { imageDomain } from '../assets/scripts/api'
import { debounce } from 'm-utilsdk/index'
import MideaToast from '../component/midea-toast/toast'
import { Format } from '../assets/scripts/format'
import { parseComponentModel } from '../assets/scripts/common'
import { EC } from '../card/js/EC'
Page({
  behaviors: [pluginMixin],
  /**
   * 页面的初始数据
   */
  data: {
    bindKeyInput: true,
    title: '电蒸锅',
    typeList: ['全部', '珍味小梅园'],
    deviceInfo: {},
    prefabMenu: [],
    backupMenu: [],
    iconUrl: {
      aroma: imageDomain + '/0xEC/icon-aroma.png',
      arrow: {
        url1: imageDomain + '/0xE7/icon-arrow-r.png',
        url2: imageDomain + '/0x32/icon_right_arrow_gray.png',
      },
      power: {
        url1: imageDomain + '/0xFB/icon-switch.png',
      },
      pressure: {
        url1: imageDomain + '/0xEC/icon-pressure.png',
      },
      schedule: imageDomain + '/0x32/icon-schedule.png',
      workTime: imageDomain + '/0x32/icon-time.png',
      mouthfeel: {
        url1: imageDomain + '/0xF1/icon-kougan.png',
      },
      temperature: {
        url1: imageDomain + '/0xF1/icon-baowen.png',
      },
      test: {
        url1: imageDomain + '/0xFB/icon_zhire2.png',
        url2: imageDomain + '/0xFB/icon_zhire.png',
        url3: 'https://ce-cdn.midea.com/quick_dev/function/1e13781d-c5ab-41d4-b04d-cc43b72fbd93.png',
        url4: 'https://ce-cdn.midea.com/quick_dev/function/7239b481-7e19-4267-bfaa-65aec566e3e1.png',
      },
      backImgBase: imageDomain + '/0xFC/icon_youjiantou.png',
    },
    activeIndex: '全部',
    actionInput: '',
    selectedFunction: {},
    settingModal: {
      isShow: false,
      params: {
        taste: undefined,
        pressureLevel: undefined,
      },
      confirmText: '开始烹饪',
    },
    workTimeData: {
      value: [0, 0, 0, 0],
      hours: [0, 1, 2, 3, 4, 5],
      minutes: [0, 1, 2, 3, 4, 5],
      result: {},
    },
    scheduleData: {
      value: [0, 0, 0, 0],
      day: [],
      hours: [],
      minutes: [],
      result: undefined,
      resultLabel: undefined,
    },
    scheduleModal: {
      isShow: false,
    },
    workTimeModal: {
      isShow: false,
    },
    switchSchedule: parseComponentModel({
      color: '#FF8225',
      isActive: true,
      selected: false,
    }),
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '预制菜',
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#f9f9f9',
    })
    let prefabMenu = wx.getStorageSync('prefabMenu')
    let deviceInfo = wx.getStorageSync('deviceInfo')
    let backupMenu = JSON.parse(JSON.stringify(prefabMenu))
    let typeList = []
    backupMenu.forEach((item) => {
      const workSettingItem = item.settings.find((m) => m.apiKey == 'workStatus')
      typeList.push(workSettingItem?.properties?.prefabMenu)
    })
    typeList = ['全部', ...new Set(typeList)]
    this.setData({ backupMenu, prefabMenu, typeList, deviceInfo })
  },
  selectTypeTab(e) {
    let activeIndex = e.currentTarget.id
    this.setData({ activeIndex })
    this.changeArr()
  },
  checkInputValue(e) {
    // console.log('改变输入',e)
    let value = e?.detail || e?.detail?.value
    value = value === undefined ? '' : value
    this.setData({
      actionInput: value,
    })
    this.changeArr()
  },
  // 清除输入框
  clearInput() {
    this.setData({
      actionInput: '',
    })
    this.changeArr()
  },
  changeArr: debounce(
    function () {
      const activeIndex = this.data.activeIndex
      let prefabMenu = this.data.backupMenu
        .filter(
          (item) =>
            activeIndex == item?.settings.find((m) => m.apiKey == 'workStatus')?.properties?.prefabMenu ||
            activeIndex == '全部'
        )
        .filter((item) => item.name.indexOf(this.data.actionInput) > -1)
      this.setData({ prefabMenu })
    },
    500,
    true
  ),

  // region 点击功能项
  startPreCook(e) {
    do {
      let storageDeviceInfo = this.data.deviceInfo
      // console.log('缓存数据: ',storageDeviceInfo);
      // 获取插件页
      let pages = getCurrentPages()
      let pluginIndexPageIndex = pages.findIndex((item) => item.route.match(/plugin\/T0x(.*)\/index\/index/g))
      if (pluginIndexPageIndex > -1) {
        let pluginIndexPage = pages[pluginIndexPageIndex]
        // 获取插件页实例
        let cardComponent = pluginIndexPage.selectComponent('.component' + storageDeviceInfo.applianceCode)
        if (cardComponent) {
          let deviceInfo = cardComponent.data.deviceInfo
          if (!EC.isEnabledToStart(deviceInfo)) {
            return
          }
        }
      }
      let functionItem = e.detail
      let selectedFunction = functionItem
      this.setData({ selectedFunction })
      this.functionConfigInit(selectedFunction)
      this.showSettingModal()
    } while (false)
  },
  // region 参数设置对话框初始化
  functionConfigInit(selectedFunction) {
    // 工作时间
    let setWorkTimeConfig = selectedFunction.settingsData[EC.settingApiKey.workTime]
    let keepPressureTimeConfig = selectedFunction.settingsData[EC.settingApiKey.keepPressureTime]
    if (setWorkTimeConfig || keepPressureTimeConfig) {
      let workTimeConfig = setWorkTimeConfig || keepPressureTimeConfig
      this.workTimeDataInit({
        appointTime: workTimeConfig,
      })
      // 初始值设置
      wx.nextTick(() => {
        let defaultValueMin = Number(workTimeConfig.properties?.defaultValue ?? 0)
        let defaultValueTime = Format.formatSeconds(defaultValueMin * 60)
        let workTimeData = this.data.workTimeData
        let hoursIndex = workTimeData.hours.findIndex((item) => item === defaultValueTime.hours)
        let minutesIndex = workTimeData.minutes.findIndex((item) => item === defaultValueTime.minutes)
        if (hoursIndex === -1) {
          hoursIndex = 0
        }
        this.workTimePickerOnChange({
          detail: {
            value: [0, hoursIndex, minutesIndex, 0],
          },
        })
        this.confirmWorkTime()
      })
    }
  },
  // region 工作时间参数初始化
  workTimeDataInit({ appointTime }) {
    let appointTimeData = appointTime.properties
    let appointTimeDataMin = Number(appointTimeData.min)
    let workTimeData = this.data.workTimeData
    let hours = []
    let minutes = []
    let minHours = Math.floor(appointTimeDataMin / 60)
    let maxHours = Math.floor(appointTimeData.max / 60)
    let minMinutes = appointTimeDataMin % 60
    let maxMinutes = appointTimeData.max % 60
    // 设置小时数据
    for (let i = minHours; i <= maxHours; i++) {
      hours.push(i)
    }
    // 设置分钟数据
    let initEndMin = hours.length === 1 ? maxMinutes + 1 : 60
    for (let i = minMinutes; i < initEndMin; i++) {
      minutes.push(i)
    }
    workTimeData.minHours = minHours
    workTimeData.minMinutes = minMinutes
    workTimeData.maxHours = maxHours
    workTimeData.maxMinutes = maxMinutes
    workTimeData.hours = hours
    workTimeData.minutes = minutes
    this.setData({ workTimeData })
  },
  // region 烹饪时间选择
  workTimePickerOnChange(e) {
    // 数据联动修改
    let val = e.detail.value
    let hoursIndex = val[1]
    let workTimeData = this.data.workTimeData
    let minMinutes = workTimeData.minMinutes
    let maxMinutes = workTimeData.maxMinutes
    let minutes = []
    if (hoursIndex === 0) {
      // 筛选最小分钟
      let initEndMin = workTimeData.hours.length === 1 ? maxMinutes + 1 : 60
      for (let i = minMinutes; i < initEndMin; i++) {
        minutes.push(i)
      }
    } else if (hoursIndex === workTimeData.hours.length - 1) {
      // 筛选最大分钟
      for (let i = 0; i <= maxMinutes; i++) {
        minutes.push(i)
      }
    } else {
      let initEndMin = workTimeData.hours.length === 1 ? maxMinutes + 1 : 60
      for (let i = 0; i < initEndMin; i++) {
        minutes.push(i)
      }
    }
    workTimeData.value = val
    workTimeData.minutes = minutes
    let workTimeHours = workTimeData.hours[val[1]]
    let workTimeMinutes = workTimeData.minutes[val[2]]
    let workTimeSeconds = workTimeHours * 60 * 60 + workTimeMinutes * 60
    let workTimeResult = Format.formatSeconds(workTimeSeconds)
    workTimeData.result = workTimeResult
    this.setData({ workTimeData })
  },
  // region 显示烹饪时间对话框
  showWorkTimeModal() {
    console.log('显示烹饪时间对话框')
    let workTimeModal = this.data.workTimeModal
    workTimeModal.isShow = true
    this.setData({ workTimeModal })
  },
  closeWorkTimeModal() {
    let workTimeModal = this.data.workTimeModal
    workTimeModal.isShow = false
    this.setData({ workTimeModal })
  },
  // endregion
  // 确认烹饪时间
  confirmWorkTime() {
    let workTimeData = this.data.workTimeData
    let val = workTimeData.value
    let workTimeHours = workTimeData.hours[val[1]]
    let workTimeMinutes = workTimeData.minutes[val[2]]
    let workTimeSeconds = workTimeHours * 60 * 60 + workTimeMinutes * 60
    workTimeData.result = Format.formatSeconds(workTimeSeconds)
    workTimeData.resultLabel =
      (workTimeData.result.hours ? workTimeData.result.hours + '小时' : '') +
      (workTimeData.result.minutes ? workTimeData.result.minutes + '分钟' : '')
    this.setData({ workTimeData })
    this.closeWorkTimeModal()
    console.log('确认烹饪时间: ', workTimeData)
  },

  // region 预约开关切换
  scheduleSwitchChange(event) {
    let model = event.detail
    let selectedFunction = this.data.selectedFunction
    let appointTime = selectedFunction.settingsData[EC.settingApiKey.appointTime]
    let cookTime = selectedFunction.expectedCookTime || 0
    if (!cookTime) {
      // 工作时间
      let setWorkTimeConfig = selectedFunction.settingsData[EC.settingApiKey.workTime]
      if (setWorkTimeConfig) {
        if (setWorkTimeConfig.codeName !== 'onlyOption') {
          cookTime = setWorkTimeConfig.properties.defaultValue
        } else {
          cookTime = setWorkTimeConfig.properties.value
        }
      }
    }
    let settingModal = this.data.settingModal
    if (model.selected) {
      // 打开预约窗口
      this.scheduleDataInit({ appointTime, cookTime })
      this.confirmSchedule()
      // this.showScheduleModal();
      settingModal.confirmText = '开始预约'
    } else {
      this.cancelSchedule()
      settingModal.confirmText = '开始烹饪'
    }
    this.setData({
      switchSchedule: parseComponentModel(model),
      settingModal,
    })
  },
  // endregion

  // region 预约时间选择
  pickOnChange(e) {
    // 数据联动修改
    let val = e.detail.value
    if (val && val.length > 0) {
      let day = val[1]
      let hour = val[2]
      let min = val[3]
      let nowDate = this.data.nowDate
      let nowHour = nowDate.getHours()
      let nowMin = nowDate.getMinutes()
      let scheduleData = this.data.scheduleData
      let minHours = scheduleData.minHours
      let minMinutes = scheduleData.minMinutes
      let maxHours = scheduleData.maxHours
      let maxMinutes = scheduleData.maxMinutes
      let hours = []
      let minutes = []
      let startMin = nowMin + minMinutes
      // 监听天数
      if (day === 0) {
        if (startMin > 60) {
          // minHours++;
          startMin = nowMin + minMinutes - 60
        }
        // 选择了今天
        for (let i = nowHour + minHours; i < 24; i++) {
          hours.push(i)
        }
        // 设置分钟数据
        for (let i = startMin; i <= 60; i++) {
          if (i === 60) {
            if (startMin === 60) {
              minutes.push(0)
            }
          } else {
            minutes.push(i)
          }
        }
        if (hour !== 0) {
          minutes = []
          for (let i = 0; i < 60; i++) {
            minutes.push(i)
          }
        }
      } else {
        // 选择了明天
        if (nowHour - (maxHours % 24) >= 0) {
          for (let i = 0; i <= nowHour - (maxHours % 24); i++) {
            hours.push(i)
          }
        } else {
          for (let i = 0; i <= (maxHours % 24) - (24 - nowHour); i++) {
            hours.push(i)
          }
        }
        for (let i = 0; i < 60; i++) {
          minutes.push(i)
        }
        // 选择了小时
        if (hour === scheduleData.hours.length - 1) {
          minutes = []
          for (let i = 0; i <= nowMin - (maxMinutes % 60); i++) {
            minutes.push(i)
          }
        }
      }
      scheduleData.hours = hours
      scheduleData.minutes = minutes
      scheduleData.value = val
      this.setData({ scheduleData })
    }
  },
  // region 预约对话框参数设置
  scheduleDataInit({ appointTime, cookTime }) {
    let appointTimeData = appointTime.properties
    // let appointTimeDataMin = Number(appointTimeData.min)+Number(cookTime);
    let appointTimeDataMin = Number(appointTimeData.min)
    let appointTimeDataDefaultValue = appointTime.properties.defaultValue
    let scheduleData = this.data.scheduleData
    let hours = []
    let minutes = []
    let minHours = Math.floor(appointTimeDataMin / 60)
    let minMinutes = appointTimeDataMin % 60
    let maxHours = Math.floor(appointTimeData.max / 60)
    let maxMinutes = appointTimeData.max % 60
    let defaultHours = Math.floor(appointTimeDataDefaultValue / 60)
    let defaultMinutes = appointTimeDataDefaultValue % 60
    // 获取当前时间
    let nowDate = new Date()
    // 设置小时数据
    let nowHour = nowDate.getHours()
    let nowMin = nowDate.getMinutes()
    let startMin = nowMin + minMinutes
    if (nowHour + maxHours < 24) {
      // 预约时间不足明天
      scheduleData.day = ['今天']
    } else {
      scheduleData.day = ['今天', '明天']
    }
    if (startMin > 60) {
      minHours++
      startMin = nowMin + minMinutes - 60
    }
    let valueIndex = 0
    for (let i = nowHour + minHours; i < 24; i++) {
      if (i === nowHour + defaultHours) {
        scheduleData.value[2] = valueIndex
      }
      valueIndex++
      hours.push(i)
    }
    // 设置分钟数据
    valueIndex = 0
    for (let i = startMin; i <= 60; i++) {
      if (i === nowMin + defaultMinutes) {
        scheduleData.value[3] = valueIndex
      }
      valueIndex++
      if (i === 60) {
        minutes.push(0)
      } else {
        minutes.push(i)
      }
    }
    scheduleData.hours = hours
    scheduleData.minutes = minutes
    scheduleData.minHours = minHours
    scheduleData.minMinutes = minMinutes
    scheduleData.maxHours = maxHours
    scheduleData.maxMinutes = maxMinutes
    this.setData({ scheduleData, nowDate })
  },
  // region 显示预约时间对话框
  showScheduleModal() {
    let scheduleModal = this.data.scheduleModal
    scheduleModal.isShow = true
    this.setData({ scheduleModal })
  },
  closeScheduleModal() {
    let scheduleModal = this.data.scheduleModal
    scheduleModal.isShow = false
    this.setData({ scheduleModal })
  },
  // endregion
  // region 确定预约时间
  // 确认预约时间
  confirmSchedule() {
    let scheduleData = this.data.scheduleData
    let value = scheduleData.value
    let deviceInfo = this.data.deviceInfo
    let day = value[1]
    let hour = scheduleData.hours[value[2]]
    let minute = scheduleData.minutes[value[3]]
    let nowDate = new Date()

    // 判断RTC类型，计算完成时间
    if (deviceInfo.isSupportRtc) {
      // 时钟类型,不作处理
    } else {
      // 非时钟类型，计算间隔时间
      if (day === 0) {
        let interval = hour * 60 + minute - (nowDate.getHours() * 60 + nowDate.getMinutes())
        hour = Math.floor(interval / 60)
        minute = interval % 60
      } else {
        let nowTimestamp = nowDate.getTime()
        // 获取明天的时间
        let tomorrowTimestamp = nowTimestamp + 86400000
        let tomorrowDate = new Date(tomorrowTimestamp)
        // 获取明天的年月日
        let targetYear = tomorrowDate.getFullYear() + ''
        let targetMonth = tomorrowDate.getMonth() + 1 + ''
        let targetDate = tomorrowDate.getDate() + ''
        let targetString =
          targetYear + '/' + targetMonth + '/' + targetDate + ' ' + Format.getTime(hour) + ':' + Format.getTime(minute)
        // 获取目标时间的时间戳
        let targetTimestamp = new Date(targetString).getTime()
        let targetInterval = targetTimestamp - nowTimestamp
        hour = Math.floor(targetInterval / 1000 / 60 / 60)
        minute = (targetInterval / 1000 / 60) % 60
      }
    }
    scheduleData.result = hour * 60 + minute
    let today = nowDate.getDate()
    let nowDateStamp = nowDate.getTime()
    let targetDateStamp = nowDateStamp + scheduleData.result * 60 * 1000
    let targetDate = new Date(targetDateStamp)
    let targetDay = targetDate.getDate()
    let scheduleFinishLabel = '等待启动'
    if (today === targetDay) {
      // 今天
      scheduleFinishLabel = '今天'
    } else {
      // 明天
      scheduleFinishLabel = '明天'
    }
    let finishTime = Format.dateFormat('HH:MM', targetDate)
    scheduleFinishLabel += finishTime
    scheduleData.resultLabel = scheduleFinishLabel
    this.setData({ scheduleData })
    this.closeScheduleModal()
  },
  // 取消预约
  cancelSchedule() {
    this.closeScheduleModal()
    // 预约时间初始化
    let switchSchedule = parseComponentModel(this.data.switchSchedule)
    switchSchedule.selected = false
    switchSchedule = parseComponentModel(switchSchedule)
    let scheduleData = {
      value: [0, 0, 0, 0, 0],
      day: [],
      hours: [],
      minutes: [],
      result: undefined,
      resultLabel: undefined,
    }
    this.setData({ scheduleData })
  },
  // region 显示参数设置对话框
  showSettingModal() {
    let settingModal = this.data.settingModal
    settingModal.isShow = true
    settingModal.confirmText = '开始烹饪'
    this.setData({ settingModal })
  },
  closeSettingModal() {
    let settingModal = this.data.settingModal
    settingModal.isShow = false
    this.setData({ settingModal })
    setTimeout(() => {
      this.settingModalInit()
    }, 300)
  },
  // endregion
  // region 重置参数设置对话框
  settingModalInit() {
    // 预约时间
    let switchSchedule = parseComponentModel(this.data.switchSchedule)
    console.log('重置参数设置对话框: ', switchSchedule)
    switchSchedule.selected = false
    switchSchedule = parseComponentModel(switchSchedule)
    let scheduleData = {
      value: [0, 0, 0, 0, 0],
      day: [],
      hours: [],
      minutes: [],
      result: undefined,
      resultLabel: undefined,
    }
    // 工作时间
    let workTimeData = {
      value: [0, 0, 0, 0],
      hours: [],
      minutes: [],
      result: undefined,
      resultLabel: undefined,
    }
    this.setData({
      switchSchedule,
      scheduleData,
      workTimeData,
    })
  },
  // endregion
  // region 开始烹饪
  startWork() {
    do {
      let data = this.data
      let selectedFunction = data.selectedFunction
      let controlParams = {
        runMode: selectedFunction.code,
        workSwitch: EC.workSwitch.work,
        targetTemperature: 100,
        subCmd: 5,
        time: {},
      }
      // 工作时间
      let setWorkTimeConfig = selectedFunction.settingsData[EC.settingApiKey.workTime]
      console.log('test控制：', setWorkTimeConfig)
      if (setWorkTimeConfig) {
        let workTimeData = data.workTimeData
        let workTimeHours = workTimeData.hours[workTimeData.value[1]]
        let workTimeMinutes = workTimeData.minutes[workTimeData.value[2]]
        let workTimeSeconds = workTimeHours * 60 * 60 + workTimeMinutes * 60
        let workTimeResult = Format.formatSeconds(workTimeSeconds)
        // controlParams.time.workTimeHour = workTimeResult.hours;
        // controlParams.time.workTimeMinute = workTimeResult.minutes;
        controlParams.time.workTimeSecond = (workTimeResult.hours * 60 + workTimeResult.minutes) * 60
        controlParams.time.workTimeSecond =
          controlParams.time.workTimeSecond || setWorkTimeConfig.properties.defaultValue * 60
      }
      // 预约时间
      controlParams.time.appointTimeSecond = 0
      let appointTimeConfig = selectedFunction.settingsData[EC.settingApiKey.appointTime]
      if (appointTimeConfig) {
        let scheduleData = data.scheduleData
        let scheduleResult = Format.formatSeconds(scheduleData.result * 60)
        if (scheduleData.result) {
          controlParams.workSwitch = EC.workSwitch.schedule
          // controlParams.time.appointTimeHour = scheduleResult.hours;
          // controlParams.time.appointTimeMinute = scheduleResult.minutes;
          controlParams.time.appointTimeSecond = (scheduleResult.hours * 60 + scheduleResult.minutes) * 60
        }
      }
      this.closeSettingModal()
      let pages = getCurrentPages()
      let pluginIndexPageIndex = pages.findIndex((item) => item.route.match(/plugin\/T0x(.*)\/index\/index/g))
      if (pluginIndexPageIndex > -1) {
        let pluginIndexPage = pages[pluginIndexPageIndex]
        // 获取插件页实例
        let cardComponent = pluginIndexPage.selectComponent('.component' + this.data.deviceInfo.applianceCode)
        if (cardComponent) {
          cardComponent.onClickControl(controlParams).then((res) => {
            MideaToast('开始烹饪')
            this.goToWorkStatus()
          })
        }
      }
    } while (false)
  },
  // 跳转到状态页
  goToWorkStatus() {
    let deviceInfo = this.data.deviceInfo
    let pages = getCurrentPages()
    let currentPage = pages[pages.length - 1]
    let isMatchArr = currentPage.route.match(/plugin\/T0x(.*)\/index\/index/g)
    if (!isMatchArr) {
      wx.redirectTo({
        url:
          '../status/status' +
          Format.jsonToParam({
            applianceType: deviceInfo.type,
            modelNo: deviceInfo.sn8,
            applianceId: deviceInfo.applianceCode,
          }),
      })
    } else {
      wx.navigateTo({
        url:
          '../status/status' +
          Format.jsonToParam({
            applianceType: deviceInfo.type,
            modelNo: deviceInfo.sn8,
            applianceId: deviceInfo.applianceCode,
          }),
      })
    }
  },
  noop() {},
})
