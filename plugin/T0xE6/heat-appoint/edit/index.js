// plugin/T0xE6/heat-appoint/edit/index.js
import computedBehavior from './../../../../utils/miniprogram-computed'
import { requestService } from './../../../../utils/requestService'
import { getCurrentTime, toShow, toServer } from './../../assets/js/util'
import { getReqId, getStamp } from 'm-utilsdk/index'
import { pluginEventTrack } from '../../../../track/pluginTrack'

let selectedDays = []
let today = new Date().getDay()
let lastObj = {}

let hours = [],
  minutes = []
for (let i = 0; i < 24; i++) {
  hours.push(i < 10 ? '0' + i : i)
}
for (let i = 0; i < 60; i++) {
  minutes.push(i < 10 ? '0' + i : i)
}

// 获取范围数组如：【30-70】
const pickerRangeCreate = function (start, end, step) {
  let rs = []
  while (start <= end) {
    rs.push(start)
    start += step
  }
  return rs
}

Page({
  behaviors: [computedBehavior],

  /**
   * 页面的初始数据
   */
  data: {
    repetitionIndex: -1,
    modeName: '',
    task: {},
    appointOnTimeList: [[], [], [], [], [], [], []], // 预约开启的时间列表，表中0~6元素分别代表周日~周六预约开启数据
    isCloudOn: false,
    hasAppointOn: false, // 是否有已开启预约
    action: 'add', // 编辑类型add或update
    delShow: false,
    week: [
      { day: '一', value: 1, isOn: false },
      { day: '二', value: 2, isOn: false },
      { day: '三', value: 3, isOn: false },
      { day: '四', value: 4, isOn: false },
      { day: '五', value: 5, isOn: false },
      { day: '六', value: 6, isOn: false },
      { day: '日', value: 0, isOn: false },
    ],

    tempIndex: 0,
    isShowTimePicker: false,
    isShowTemPicker: false,
    timeType: '',
    multiArray: [],
    multiIndex: [0],
    startMultiUnit: ['时', '分'],
    endMultiUnit: ['', '时', '分'],
    selections: [],
    startTime: '',
    tem: pickerRangeCreate(30, 80, 1),
  },

  computed: {
    endTime() {
      if (Object.keys(this.data.task).length) {
        return toShow(this.data.task.endTime, this.data.task.isEndNextDay).endTime
      }
      return ''
    },

    endTimeDay() {
      if (Object.keys(this.data.task).length) {
        return toShow(this.data.task.endTime, this.data.task.isEndNextDay).isEndNextDay ? '次日' : ''
      }
      return ''
    },

    startTimeMultiArray() {
      const arr_24 = []
      for (let i = 0; i < 24; i++) {
        arr_24[i] = i.toString().padStart(2, '0')
      }
      const arr_60 = []
      for (let i = 0; i < 60; i++) {
        arr_60[i] = i.toString().padStart(2, '0')
      }
      return [arr_24, arr_60]
    },

    startTimeMultiIndex() {
      try {
        const hhmm = this.data.task.startTime.split(':')
        return [+hhmm[0], +hhmm[1]]
      } catch {}
      return [0, 0]
    },

    endTimeMultiArray() {
      const arr_24 = []
      for (let i = 0; i < 24; i++) {
        arr_24[i] = i.toString().padStart(2, '0')
      }
      const arr_60 = []
      for (let i = 0; i < 60; i++) {
        arr_60[i] = i.toString().padStart(2, '0')
      }
      return [['当日', '次日'], arr_24, arr_60]
    },

    endTimeMultiIndex() {
      try {
        const endTime = toShow(this.data.task.endTime, this.data.task.isEndNextDay).endTime
        const hhmm = endTime.split(':')
        return [this.data.endTimeDay == '次日' ? 1 : 0, +hhmm[0], +hhmm[1]]
      } catch {}
      return [0, 0, 0]
    },

    // tempActionTypeRange() {
    //   try {
    //     const pickerRangeCreate = function (start, end, step = 1) {
    //       let rs = []
    //       while (start <= end) {
    //         rs.push(start)
    //         start += step
    //       }
    //       return rs
    //     }
    //     return pickerRangeCreate(30, this.data.appData.heat_exchanger == 'radiator' ? 80 : 60)
    //   } catch {}
    //   return []
    // },

    modeActionTypeRange() {
      try {
        return this.data.setting.heatModeList.map((item) => ({
          name: item.title,
          value: item.value,
        }))
      } catch {}
      return []
    },

    modeActionTypeRangeIndex() {
      try {
        return (
          this.data.setting.heatModeList
            .map((item) => ({
              name: item.title,
              value: item.value,
            }))
            .findIndex((item) => item.value == this.data.task.mode) || 0
        )
      } catch {}
      return 0
    },

    modeName() {
      try {
        let modeObj = this.data.setting.heatModeList.find((x) => x.value == this.data.task.mode)
        return (modeObj && modeObj.title) || this.data.setting.heatModeList[0].title
      } catch {}
      return ''
    },
  },

  onLoad(options) {
    this.pageEventChannel = this.getOpenerEventChannel()
    this.pageEventChannel.on('initPageData', (data) => this.initPageData(data))
    //页面浏览埋点:采暖预约编辑浏览次数
    pluginEventTrack(
      'user_page_view',
      null,
      {
        page_id: 'page_heat-appoint_edit_index',
        page_name: '采暖预约编辑页',
        bd_name: '壁挂炉',
      },
      {}
    )
  },

  onShow() {
    // this.pageEventChannel && this.pageEventChannel.emit('refreshData')
  },

  /**
   * this.methods
   */
  initPageData(pageData) {
    const { action, setting, deviceInfo, appData, isCloudOn, hasAppointOn, taskObj, appointOnTimeList } = pageData
    this.setData({
      action,
      setting,
      deviceInfo,
      appData,
      isCloudOn,
      hasAppointOn,
      task: taskObj,
      appointOnTimeList,
    })
    wx.setNavigationBarTitle({ title: action == 'update' ? '更改预约' : '添加预约' })
    this.initAppointData()
  },

  initAppointData() {
    if (this.data.action == 'update') {
      let taskObj = this.data.task
      let weekArr = taskObj.week.split(',')
      selectedDays = weekArr.map((item) => parseInt(item))
      for (let i = 0; i < weekArr.length; i++) {
        let index = parseInt(weekArr[i])
        if (index == 0) {
          index = 7
        }
        this.data.week[index - 1].isOn = true
      }
      this.setData({ week: this.data.week, tempIndex: Math.floor((taskObj.temp - 30) / 1) })
      if (!this.data.task.isRepeat) {
        this.setData({ repetitionIndex: 0 })
      } else if (this.data.task.week == '1,2,3,4,5,6,0' || this.data.task.week == '0,1,2,3,4,5,6') {
        this.setData({ repetitionIndex: 1 })
      } else if (this.data.task.week == '1,2,3,4,5') {
        this.setData({ repetitionIndex: 2 })
      } else if (this.data.task.week == '6,0') {
        this.setData({ repetitionIndex: 3 })
      } else {
        this.setData({ repetitionIndex: 4 })
      }
      const item = this.data.task
      let modeObj = this.data.setting.heatModeList.find((x) => x.value == item.mode)
      let modeName = (modeObj && modeObj.title) || ''
      lastObj = {
        id: item.taskId || '',
        start_time: item.startTime,
        end_time: item.endTime,
        switch: item.enable ? '开' : '关',
        temp: item.temp + '℃',
        mode: modeName,
        repeat_cycle: item.week,
        repeat_switch: item.isRepeat ? '开' : '关',
      }
    } else {
      // 添加预约
      selectedDays = [today]
      let task = {
        temp: 60,
        mode: '',
        startTime: '12:00',
        endTime: '18:59',
        enable: true,
        isEndNextDay: false,
        actionType: 'temp',
        isRepeat: false,
        week: '' + today,
      }
      let tempIndex = Math.floor((task.temp - 30) / 1)
      this.setData({
        repetitionIndex: 0,
        tempIndex,
        task,
      })
      lastObj = {}
    }
  },

  initSelections() {
    const { tem, tempIndex } = this.data
    const selections = tem
    this.setData({
      selections,
      'multiArray[0]': selections,
      'multiIndex[0]': tempIndex,
    })
  },
  openTempPicker() {
    this.initSelections()
    this.setData({ isShowTemPicker: true })
  },

  openStartTimePicker() {
    const value = this.data.task.startTime.split(':')
    const hourIndex = hours.findIndex((item) => item == value[0]) || 0
    const minutesIndex = minutes.findIndex((item) => item == value[1]) || 0
    this.setData({
      timeType: 'start',
      isShowTimePicker: true,
      startTimeMultiIndex: [hourIndex, minutesIndex],
    })
  },

  openEndTimePicker() {
    const value = this.data.task.endTime.split(':')
    const hourIndex = hours.findIndex((item) => item == value[0]) || 0
    const minutesIndex = minutes.findIndex((item) => item == value[1]) || 0
    this.setData({
      timeType: 'end',
      isShowTimePicker: true,
      endTimeMultiIndex: [[this.data.endTimeDay == '次日' ? 1 : 0], hourIndex, minutesIndex],
    })
  },
  onPickerChange(e) {
    const value = e.detail
    const hour = this.data.endTimeMultiArray[1][value[1]]
    const minute = this.data.endTimeMultiArray[2][value[2]]
    const serverTime = toServer(`${hour}:${minute}`, value[0] == 1)
    const timeType = this.data.timeType

    if (timeType == 'start') {
      this.data.startTime = `${this.data.startTimeMultiArray[0][value[0]]}:${
        this.data.startTimeMultiArray[1][value[1]]
      }`
    } else {
      this.data.endTimeDay = value[0] == 0 ? '' : '次日'
      this.data.isEndNextDay = serverTime.isEndNextDay
      this.data.endTime = serverTime.endTime
    }
  },

  closeTemPicker() {
    this.setData({ isShowTemPicker: false })
  },
  onConfirm(e) {
    const value = e.detail
    const hour = this.data.endTimeMultiArray[1][value[1]]
    const minute = this.data.endTimeMultiArray[2][value[2]]
    const serverTime = toServer(`${hour}:${minute}`, value[0] == 1)
    const timeType = this.data.timeType
    if (timeType == 'start') {
      this.setData({
        'task.startTime': `${this.data.startTimeMultiArray[0][value[0]]}:${this.data.startTimeMultiArray[1][value[1]]}`,
        isShowTimePicker: false,
      })
    } else {
      this.setData({
        endTimeDay: this.data.endTimeDay,
        'task.isEndNextDay': this.data.isEndNextDay,
        'task.endTime': serverTime.endTime,
        isShowTimePicker: false,
      })
    }
  },
  onCancel() {
    this.setData({
      isShowTimePicker: false,
    })
  },

  // onTemPickerChange(event) {
  //   const value  = event.detail
  //   this.setData({
  //     "task.temp": value
  //   })
  // },

  onTemPickerConfirm(e) {
    const currentTemp = e.detail[0]
    this.setData({
      tempIndex: currentTemp,
      'task.temp': this.data.multiArray[0][currentTemp],
      isShowTemPicker: false,
    })
  },
  // bindStartTimeChange({ detail: { value } }) {
  //   this.setData({
  //     'task.startTime': `${this.data.startTimeRange[0][value[0]]}:${this.data.startTimeRange[1][value[1]]}`,
  //   })
  // },

  // bindEndTimeChange({ detail: { value } }) {
  //   const hour = this.data.endTimeRange[1][value[1]]
  //   const minute = this.data.endTimeRange[2][value[2]]
  //   const serverTime = toServer(`${hour}:${minute}`, value[0] == 1)
  //   this.setData({
  //     endTimeDay: value[0] == 0 ? '' : '次日',
  //     'task.isEndNextDay': serverTime.isEndNextDay,
  //     'task.endTime': serverTime.endTime,
  //   })
  // },

  bindActionTypeChange({ detail: { value } }) {
    if (value == 1 && this.data.task.mode == '') {
      this.data.task.mode = 'normal_mode'
    }
    const modeObj = this.data.setting.heatModeList.find((x) => x.value == this.data.task.mode)
    const modeName = modeObj ? modeObj.title : '普通模式'
    this.setData({
      'task.actionType': value == 0 ? 'temp' : 'mode',
      'task.mode': modeObj ? modeObj.value : 0,
      modeName,
    })
  },

  // bindTempActionTypeChange({ detail: { value } }) {
  //   this.setData({ 'task.temp': +value + 30 })
  // },

  bindModeActionTypeChange({ detail: { value } }) {
    const mode = this.data.modeActionTypeRange[value]
    this.setData({ 'task.mode': mode.value, modeName: mode.name })
  },

  bindRepeatListClick({
    currentTarget: {
      dataset: { index },
    },
  }) {
    if (index == 0) {
      // 单次
      selectedDays = [today]
      this.data.task.isRepeat = false
    } else if (index == 1) {
      // 每天
      selectedDays = [1, 2, 3, 4, 5, 6, 0]
      this.data.task.isRepeat = true
    } else if (index == 2) {
      // 工作日
      selectedDays = [1, 2, 3, 4, 5]
      this.data.task.isRepeat = true
    } else if (index == 3) {
      // 周末
      selectedDays = [6, 0]
      this.data.task.isRepeat = true
    } else {
      // 自定义
      this.data.task.isRepeat = true
    }
    for (var i = 0; i < 7; i++) {
      if (selectedDays.indexOf(this.data.week[i].value) != -1) {
        this.data.week[i].isOn = true
      } else {
        this.data.week[i].isOn = false
      }
    }
    this.data.task.week = selectedDays.join(',')

    this.setData({ repetitionIndex: index, task: this.data.task, week: this.data.week })
  },

  bindWeekItemClick({
    currentTarget: {
      dataset: { index },
    },
  }) {
    this.setData({
      repetitionIndex: 4,
      [`week[${index}].isOn`]: !this.data.week[index].isOn,
    })

    const arrTemp = []
    for (let i = 0; i < this.data.week.length; i++) {
      if (this.data.week[i].isOn) {
        arrTemp.push(this.data.week[i].value)
      }
    }
    this.setData({ 'task.week': arrTemp.join(',') })

    if (this.data.task.week == undefined || this.data.task.week == '') {
      // 未选中任何星期格
      this.setData({
        'task.isRepeat': false,
        'task.week': '' + today,
      })
    } else {
      this.setData({ 'task.isRepeat': true })
    }
  },

  beforeSave() {
    const timeInterval =
      this.getMinuteStamp(this.data.task.endTime) +
      1 +
      (this.data.task.isEndNextDay ? 1440 : 0) -
      this.getMinuteStamp(this.data.task.startTime)
    if (!this.data.task.isRepeat && this.timeChange(this.data.task.startTime) < this.timeChange(getCurrentTime())) {
      wx.showToast({ title: '不可选择过去的时间', icon: 'none' })
      return
    } else if (this.data.endTimeDay != '次日' && timeInterval <= 0) {
      wx.showToast({ title: '结束时间必须大于开始时间', icon: 'none' })
      return
    } else if (timeInterval < 5) {
      wx.showToast({ title: '时长至少5分钟', icon: 'none' })
      return
    } else if (
      this.data.task.isRepeat &&
      this.data.endTimeDay == '次日' &&
      this.timeChange(this.data.task.startTime) < this.timeChange(this.data.task.endTime)
    ) {
      // 有周期的次日预约，次日时间不能与开始时间重叠
      let week_list = this.data.task.week.split(',')
      for (let week of week_list) {
        for (let self_week of week_list) {
          let weekInterval = Math.abs(parseInt(week) - parseInt(self_week))
          if (weekInterval == 1 || weekInterval == 6) {
            wx.showToast({ title: '预约时间不能与次日重叠', icon: 'none' })
            return
          }
        }
      }
    }
    // 云管家互斥逻辑处理
    if (this.data.action == 'add' && this.data.isCloudOn) {
      // 要打开时先弹窗询问是否关闭云管家
      wx.showModal({
        title: '温馨提示',
        content: '设置预约后，将关闭云管家自动控温，是否确认关闭？',
        success(res) {
          if (res.confirm) {
            this.saveAppoint()
          } else if (res.cancel) {
          }
        },
      })
    } else {
      this.saveAppoint()
    }
  },
  saveAppoint() {
    var item = this.data.task
    // 处理单次隔日预约，隔日的暂不处理，在前面被拦截了
    if (!item.isRepeat && item.enable) {
      item.week = '' + today
    }
    // 判断预约冲突
    let isConflict = false
    if (item.enable && this.data.hasAppointOn) {
      // 有预约开启，判断预约是否冲突
      let week_list = item.week.split(',')
      if (this.timeChange(item.startTime) > this.timeChange(item.endTime)) {
        // 跨天则将当前预约拆分为两段分别判断
        let item_1 = { ...item, endTime: '24:00' }
        isConflict = this.getConflict(item_1)
        let new_week_list = week_list.map((week) => {
          return week == '6' ? 0 : Number(week) + 1
        })
        let item_2 = { ...item, startTime: '00:00', week: new_week_list.join(',') }
        isConflict = isConflict || this.getConflict(item_2)
      } else {
        // 不跨天
        isConflict = this.getConflict(item)
      }
    }
    if (isConflict) {
      return
    }
    if (this.saveAppointBusy) return
    this.saveAppointBusy = true

    // 埋点
    // 联动关闭云管家
    item.enable && this.switchCloudAi(0)
    // 联动开启普通模式
    // 发送预约保存请求
    requestService
      .request('e6', {
        msg: 'taskReservation',
        params: {
          applianceId: this.data.deviceInfo.applianceCode,
          platform: this.data.deviceInfo.sn8,
          action: this.data.action,
          task: [this.data.task],
        },
      })
      .then((rs) => {
        // todo 立即refresh
        wx.showToast({ title: '预约保存成功', icon: 'none' })
        // this.luaSetTemp(this.data.task)
        this.pageEventChannel && this.pageEventChannel.emit('refreshData')
        // 埋点上报
        pluginEventTrack('user_behavior_event', null, {
          page_id: 'page_control',
          page_name: '采暖预约编辑页',
          widget_id: 'click_appoint_save',
          widget_name: '采暖预约',
          ext_info: `预约内容：${this.data.task}`,
        })
        setTimeout(wx.navigateBack, 1000)
      })
      .catch(() =>
        wx.showToast({
          title: '系统错误,请重试',
          icon: 'error',
        })
      )
      .finally(() => (this.saveAppointBusy = false))
  },

  switchCloudAi(p) {
    return requestService
      .request('e6', {
        msg: 'cloudManagerSwitch',
        params: {
          applianceId: this.data.deviceInfo.applianceCode,
          action: 'set',
          switch: p,
        },
      })
      .then(({ data }) => data.retCode == 0 && this.setData({ isCloudOn: p == 1 }))
      .finally(() => {
        // 埋点上报
        pluginEventTrack('user_behavior_event', null, {
          page_id: 'page_control',
          page_name: '插件首页',
          widget_id: 'click_cloud_home',
          widget_name: '云管家',
          ext_info: p == 1 ? '开' : '关',
        })
      })
  },

  getConflict(item) {
    let week_list = item.week.split(',')
    for (let week of week_list) {
      for (let appointOnItem of this.data.appointOnTimeList[week]) {
        if (
          appointOnItem &&
          !(
            this.timeChange(appointOnItem.endTime) <= this.timeChange(item.startTime) ||
            this.timeChange(appointOnItem.startTime) >= this.timeChange(item.endTime)
          )
        ) {
          wx.showToast({ title: '该时间段已经设置过预约了', icon: 'none' })
          return true
        }
      }
    }
    return false
  },

  getMinuteStamp(time) {
    let H = parseInt(time.split(':')[0] * 60)
    let M = parseInt(time.split(':')[1])
    return H + M
  },

  timeChange(time) {
    return Number(time.replace(/:/g, ''))
  },

  timeNowChange() {
    let myDate = new Date()
    let day = JSON.stringify(myDate.getDay())
    let h = myDate.getHours() * 100
    let m = myDate.getMinutes()
    let nowHour = h + m
    return { nowHour, day }
  },

  // lua控制温度
  luaSetTemp(new_item) {
    if (new_item.enable) {
      let startT = this.timeChange(new_item.startTime)
      let endT = this.timeChange(new_item.endTime)
      let { nowHour, day } = this.timeNowChange()
      var isNow
      if (new_item.isEndNextDay) {
        isNow = nowHour >= startT
      } else {
        isNow = nowHour >= startT && nowHour <= endT
      }
      if (new_item.week.indexOf(day) > -1 && isNow) {
        let params = {
          current_heat_set_temperature: new_item.temp,
        }
        this.luaControl(params)
      }
    }
  },

  luaControl(param) {
    //控制设备
    let self = this
    return new Promise((resolve, reject) => {
      wx.showLoading({
        title: '加载中',
        mask: true,
      })
      self.setData({
        changing: true,
      })

      let reqData = {
        reqId: getReqId(),
        stamp: getStamp(),
        applianceCode: this.data.deviceInfo.applianceCode,
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
})
