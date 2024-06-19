import {addZero, getCurrentAppointTime, mm2HHmmText} from '../../card/js/EC'
Component({
  options: {
    multipleSlots: true
  },
  properties: {
    model: {
      type: Object,
      observer: function(){
        this.getModel()
      }
    },
    disabled: {
      type: Boolean,
      value: null,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    bindModel: {},
    switchSchedule: {
      isActive: true,
      selected: false,
      color: "#FF8225"
    },
    isShowSetting: false,
    currentMinute: [0], // 初始值
    currentHour: [0], // 初始值
    currentDay: [0], // 初始值
    days: ["今天", "明天"],
    curDay: '',
    curHour: 0,
    curMin: 0,
    hours: [],
    minutes: [],
    minuteObj: {},
    hourObj: [],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getModel() {
      let bindModel = JSON.parse(JSON.stringify(this.properties.model))
      this.closeModal()
      let switchSchedule = this.data.switchSchedule
      switchSchedule.selected = bindModel.isSwitch
      this.setData({bindModel, switchSchedule})
      // 预约中调节参数模式
      if(bindModel.isScheduleCheck) {
        this.goSetTime()
      }
    },
    // region 预约对话框参数设置
    scheduleDataInit(){
      let bindModel = this.data.bindModel
      let days = []
      let hourObj = []
      let minuteObj = {}
      // 获取当前时间
      const now = new Date()
      const nowHour = now.getHours()
      const nowMin = now.getMinutes()
      let minAppointMinute = (nowMin + bindModel.workTime*1)%60 // 最小预约分钟
      let minAppointHour = nowHour + parseInt((nowMin + bindModel.workTime*1)/60) // 最小预约小时
      if(minAppointHour < 24) {
        days.push("今天")
      }
      let maxAppointMinute = (nowMin + bindModel.max*1)%60 // 最大预约分钟
      let maxAppointHour = nowHour + parseInt((nowMin + bindModel.max*1)/60) // 最大预约小时
      if(maxAppointHour > 23) {
        days.push("明天")
      }
      let day1Hours = [], day2Hours = [], commonMinutes = []
      for(let i=0;i < 60; i++) {
        commonMinutes.push(addZero(i))
      }
      for(let i = minAppointHour; i <= maxAppointHour; i ++) { // 遍历小时
        let minutes = [], curHour = 0
        if(i < 24) {
          day1Hours.push(i)
          curHour = i
        } else {
          curHour = i%24
          day2Hours.push(curHour)
          
        }
        if(i == minAppointHour) {
          for(let j=minAppointMinute; j < 60; j++) {
            minutes.push(addZero(j))
          }
        } else if(i == maxAppointHour) {
          for(let j=0; j <= maxAppointMinute; j++) {
            minutes.push(addZero(j))
          }
        } else {
          minutes = commonMinutes
        }
        minuteObj[curHour] = minutes
      }
      if(day1Hours.length) {  // 配置小时数组
        hourObj.push(day1Hours)
      }
      if(day2Hours.length) {
        hourObj.push(day2Hours)
      }
      // 设置当前的预约时间
      let currentAppoint = getCurrentAppointTime(bindModel.defaultValue*1)
      let curDay = currentAppoint[0] ? '今天' : '明天'
      let hours = hourObj[days.indexOf(curDay)]
      let curHour = currentAppoint[1]
      let minutes = minuteObj[curHour]
      let curMin = addZero(currentAppoint[2])
      let currentDay = [days.indexOf(curDay)]
      let currentHour = [hours.indexOf(curHour)]
      let currentMinute = [minutes.indexOf(curMin)]
      this.setData({days, hourObj, minuteObj, hours, minutes, curDay, curHour, curMin, currentDay, currentHour, currentMinute})
    },
    scheduleSwitchChange(e) { // 切换开关
      let switchSchedule = e.detail
      let bindModel = this.data.bindModel
      bindModel.isSwitch = switchSchedule.selected
      this.setData({switchSchedule, bindModel})
      this.triggerEvent('setAppointSwitch', bindModel);
    },
    goSetTime() {
      this.scheduleDataInit()
      this.setData({isShowSetting: true})
      setTimeout(() => {
        this.scheduleDataInit()
      }, 100);
    },
    closeModal() {
      this.setData({isShowSetting: false})
    },
    pickOnMinute(e) {
      const valueArr = e.detail.value
      let minutes = this.data.minutes
      let curMin = minutes[valueArr[0]]
      this.setData({curMin})
    },
    pickOnHour(e) { // 滚动小时
      const valueArr = e.detail.value
      let hours = this.data.hours
      let curHour = hours[valueArr[0]]
      let minuteObj = this.data.minuteObj
      let minutes = minuteObj[curHour]
      this.setData({minutes, curHour})
      // 设置分钟值
      let curMin = this.data.curMin
      let currentMinute = this.data.currentMinute
      if(minutes.indexOf(curMin) > -1) {
        currentMinute[0] = minutes.indexOf(curMin)
      } else {
        currentMinute[0] = 0
        curMin = minutes[0]
        this.setData({curMin})
      }
      this.setData({currentMinute})
    },
    pickOnDay(e) { // 滚动日
      const valueArr = e.detail.value
      let data = this.data
      let days = data.days
      let currentHour = data.currentHour
      let hourObj = data.hourObj
      let curDay = days[valueArr[0]]
      let hours = hourObj[valueArr[0]]
      currentHour = [0]
      this.setData({curDay, hours, currentHour})
      setTimeout(() => {
        this.pickOnHour({detail: {value: [0, 0]}})
      }, 10);
    },
    save() {
      let curDay = this.data.curDay
      let appointModal = this.data.bindModel
      const now = new Date(), nowH = now.getHours(), nowM = now.getMinutes()
      let aitH = this.data.curHour, aitM = this.data.curMin*1
      aitH += (curDay == "明天" ? 24 : 0)
      appointModal.defaultValue = (aitH - nowH)*60 + aitM - nowM
      appointModal.currentText = mm2HHmmText(appointModal.defaultValue)
      let currentAppoint = getCurrentAppointTime(appointModal.defaultValue*1)
      appointModal.currentText = `${currentAppoint[0] ? '今天' : '明天'}${currentAppoint[1]}:${addZero(currentAppoint[2])}完成`
      this.triggerEvent('onChange',appointModal);
      this.closeModal()
    }
  },
  attached(){
    this.getModel();
  }
})
