import computedBehavior from '../../../utils/miniprogram-computed'
import settingBehavior from '../assets/js/setting'
import { getReqId, getStamp } from 'm-utilsdk/index'
import { requestService } from '../../../utils/requestService'

let hours = [],
  minutes = []
for (let i = 0; i < 24; i++) {
  hours.push(i < 10 ? '0' + i : i)
}
for (let i = 0; i < 60; i++) {
  minutes.push(i < 10 ? '0' + i : i)
}

Page({
  behaviors: [settingBehavior, computedBehavior],

  data: {
    isShow: false,
    type: 'default', // colmo
    status: {},
    applianceData: {},
    setting: {},
    isAddAppoint: true,
    height: 0,
    doneIcon: './assets/image/E3/doneYellow.png',
    doneIconComl: './assets/image/E3/doneComl.png',
    rightText: '保存',
    rightTextStyle: {
      fontSize: 30,
    },
    temperature: '0℃',
    startTime: '18:00',
    endTime: '20:00',
    sendTemp: 0,
    temperatureIndex: 0,
    week: [
      {
        title: '日',
        selected: false,
      },
      {
        title: '一',
        selected: false,
      },
      {
        title: '二',
        selected: false,
      },
      {
        title: '三',
        selected: false,
      },
      {
        title: '四',
        selected: false,
      },
      {
        title: '五',
        selected: false,
      },
      {
        title: '六',
        selected: false,
      },
    ],
    appoint: [],
    weekArray: [],
    appointNum: 1,
    appointType: 1,
    appointList: [], // 把预约从数组转成对象放在一起
    appointOnTimeList: [[], [], [], [], [], [], []], // 缓存已开启的预约，用来处理时间段重复问题
    startTimeMultiArray: [hours, minutes],
    startTimeMultiIndex: [0, 0, 0, 0],
    endTimeMultiArray: [hours, minutes],
    endTimeMultiIndex: [0, 0, 0, 0],
    multiUnit: ['时', '分'],
    defaultLoopIndex: -1, // 默认选中的循环周期
    // defaultWeekdaySelectList: [0,1,2], // 默认选中的星期数
    timeType: '',
  },

  computed: {
    defaultWeekdaySelectList() {
      const dictionaries = {
        日: 0,
        一: 1,
        二: 2,
        三: 3,
        四: 4,
        五: 5,
        六: 6,
      }
      const arr = this.data.week
        .filter((item) => item.selected)
        .map((item) => dictionaries[item.title])
        .sort()
      return arr
    },
  },

  onLoad() {
    let self = this
    const eventChannel = self.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('deviceWaterAppoint', function (data) {
      // console.log(data)
      self.setData({
        applianceData: data.applianceData,
        status: data.status,
        setting: data.setting,
        appointNum: data.appointNum,
        isAdd: data.isAdd,
      })
      if (data.appointNum != 'add')
        self.setData({
          appointNum: data.appointNum * 1,
        })
      wx.setNavigationBarTitle({
        title: data.title,
      })
      self.queryYyLuaData()
    })
  },
  onShow() {
    var pages = getCurrentPages()
    var prevPage = pages[pages.length - 2]
    prevPage.setData({
      isSwitch: true,
    })
  },
  onStartTimePickerClick() {
    const value = this.data.startTime.split(':')
    const hourIndex = hours.findIndex((item) => item == value[0]) || 0
    const minutesIndex = minutes.findIndex((item) => item == value[1]) || 0
    this.setData({
      timeType: 'start',
      isShow: true,
      startTimeMultiIndex: [hourIndex, minutesIndex, minutesIndex, minutesIndex],
    })
    // console.log({
    //   week: this.data.week
    // });
  },

  onEndTimePickerClick() {
    const value = this.data.endTime.split(':')
    const hourIndex = hours.findIndex((item) => item == value[0]) || 0
    const minutesIndex = minutes.findIndex((item) => item == value[1]) || 0
    this.setData({
      timeType: 'end',
      isShow: true,
      endTimeMultiIndex: [hourIndex, minutesIndex, minutesIndex, minutesIndex],
    })
  },

  onPickerChange(e) {
    const value = e.detail
    const timeType = this.data.timeType
    const hour = value[0] < 10 ? '0' + value[0] : value[0]
    const minutes = value[1] < 10 ? '0' + value[1] : value[1]
    if (timeType == 'start') {
      this.data.startTime = `${hour}:${minutes}`
    } else {
      this.data.endTime = `${hour}:${minutes}`
    }
  },

  onConfirm() {
    this.setData({
      startTime: this.data.startTime,
      endTime: this.data.endTime,
      isShow: false,
    })
  },
  onCancel() {
    this.setData({
      isShow: false,
    })
  },

  onLoopItemClick({ detail: index }) {
    this.setAppointType(index + 1)
  },

  onWeekdayItemClick({ detail: { index } }) {
    switch (index) {
      case 0:
        index = 1
        break
      case 1:
        index = 2
        break
      case 2:
        index = 3
        break
      case 3:
        index = 4
        break
      case 4:
        index = 5
        break
      case 5:
        index = 6
        break
      case 6:
        index = 0
        break
    }
    console.log({
      index,
    })
    let week = [...this.data.week]
    week[index].selected = !week[index].selected
    this.setData({
      week,
    })
    // this.setWeekType();
  },

  // 遍历所有的周期都不选
  setNoWeek() {
    const week = [...this.data.week]
    week.forEach((element) => {
      element.selected = false
    })
    this.setData({
      week,
    })
  },

  //  遍历所有的周期都选
  setAllWeek() {
    const week = [...this.data.week]
    week.forEach((element) => {
      element.selected = true
    })
    this.setData({
      week,
    })
  },

  // 获取周几为选中状态
  initWeek(num, week) {
    for (var i = 0, r = 0; i <= 6; i++, r++) {
      if (num[i] != 0) {
        week[r].selected = true
      }
    }
    return week
  },

  // 设置选择预约模式
  setAppointType(i) {
    let week = [...this.data.week]
    switch (i) {
      // 仅此一次，不重复
      case 1:
        this.setNoWeek()
        this.setData({
          appointType: 1,
        })
        break
      // 每天
      case 2:
        this.setAllWeek()
        this.setData({
          appointType: 2,
        })
        break
      // 工作日
      case 3:
        this.setAllWeek()
        week[0].selected = false
        week[6].selected = false
        this.setData({
          appointType: 3,
          week,
        })
        break
      // 周末
      case 4:
        this.setNoWeek()
        week[0].selected = true
        week[6].selected = true
        this.setData({
          appointType: 4,
          week,
        })
        break
      case 5:
        this.setData({
          appointType: 5,
          week: this.initWeek(this.data.weekArray, this.data.week),
        })
        break
      default:
        this.setData({
          appointType: 5,
          week: this.initWeek(this.data.weekArray, this.data.week),
        })
    }
  },

  luaQuery(loading = true, command = {}) {
    let self = this
    //查询设备状态
    return new Promise((resolve, reject) => {
      if (loading) {
        wx.showLoading({
          title: '加载中',
          mask: true,
        })
      }
      let reqData = {
        reqId: getReqId(),
        stamp: getStamp(),
        applianceCode: this.data.applianceData.applianceCode,
        command,
      }
      requestService.request('luaGet', reqData).then(
        (resp) => {
          if (loading) {
            wx.hideLoading()
          }
          if (resp.data.code == 0) {
            if (resp.data.data.temperature > 65) {
              this.setData({
                minTemp: 70,
                maxTemp: 130,
              })
            }
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
      self.setData({
        changing: true,
      })
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
            this.setData({
              status: resp.data.data.status,
            })
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

  getConflict(item) {
    const { appointOnTimeList } = this.data
    let week_list = item.week.split(',')
    for (let week of week_list) {
      for (let appointOnItem of appointOnTimeList[week]) {
        if (appointOnItem.taskId == item.taskId) continue
        if (!(appointOnItem.endTime < item.startTime || appointOnItem.startTime > item.endTime)) {
          console.log('冲突时间', appointOnItem.startTime, appointOnItem.endTime)
          wx.showToast({
            title: '该时间段已经设置过预约了',
            icon: 'none',
          })
          return true
        }
      }
    }
    return false
  },

  convertTime(time) {
    return time.split(':').map(Number)
  },

  // 控制lua方法
  controlLua(param) {
    this.luaControl(param)
      .then((res) => {
        wx.showToast({
          title: '保存成功',
          icon: 'none',
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1,
          })
        }, 1000)
      })
      .catch(() => {
        wx.showToast({
          title: '网络较差，请稍后再试',
          icon: 'none',
        })
        // setTimeout(() => {
        //   wx.navigateBack();
        // }, 1000);
      })
  },

  // 转换周期，【1，1，1，1，1，1，1】
  getCount() {
    var count = 0
    var tip = 0
    for (var r = 0; r < 7; r++) {
      tip = this.data.week[r].selected == true ? 1 : 0
      count = count + Math.pow(2, r) * tip
    }
    //如果七天都不选，默然重复当前这一天
    if (count == 0) {
      var thisDay = new Date().getDay()
      count = Math.pow(2, thisDay)
    }
    return count
    // 加上循环的位
  },

  // 转换周期，【1，1，1，1，1，1，1】-----不重复
  convertWeek() {
    let count = this.getCount()
    count = count + Math.pow(2, 7) * 0
    return count
  },

  // 转换周期，【1，1，1，1，1，1，1】-----重复
  convertWeekRepeat() {
    let count = this.getCount()
    count = count + Math.pow(2, 7) * 1
    return count
  },

  saveOrder() {
    const { startTime, endTime, week, appointType, appointNum } = this.data
    if (startTime == endTime) {
      wx.showToast({
        title: '开始时间和结束时间不能相同',
        icon: 'none',
      })
      return
    }
    let weekList = []
    week.map((item, index) => {
      if (item.selected == true) {
        weekList.push(index)
      }
    })
    if (appointType == 1) {
      weekList = [new Date().getDay()]
    }
    let newItem = {
      taskId: appointNum + '',
      startTime: startTime,
      endTime: endTime,
      week: weekList.join(','),
      enable: true,
    }
    let isConflict = false //判断时间段是否冲突
    if (newItem.startTime > newItem.endTime) {
      // 跨天则将当前预约拆分为两段分别判断
      let week_list = newItem.week.split(',')
      let item_1 = {
        ...newItem,
        endTime: '24:00',
      }
      isConflict = this.getConflict(item_1)
      let new_week_list = week_list.map((week) => {
        return week == '6' ? 0 : Number(week) + 1
      })
      let item_2 = {
        ...newItem,
        startTime: '00:00',
        week: new_week_list.join(','),
      }
      isConflict = isConflict || this.getConflict(item_2)
    } else {
      isConflict = this.getConflict(newItem)
    }
    if (isConflict) return
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    let param = {}
    var startT = this.convertTime(startTime)
    var endT = this.convertTime(endTime)
    this.setData({
      appoint:
        appointType == 1
          ? [1 * 255, this.data.sendTemp, startT[0], startT[1], endT[0], endT[1], this.convertWeek()]
          : [1 * 255, this.data.sendTemp, startT[0], startT[1], endT[0], endT[1], this.convertWeekRepeat()],
    })
    switch (appointNum) {
      case 0:
        param = {
          appoint_one: this.data.appoint.toString(),
        }
        this.controlLua(param)
        return
      case 1:
        param = {
          appoint_two: this.data.appoint.toString(),
        }
        this.controlLua(param)
        return
      case 2:
        param = {
          appoint_three: this.data.appoint.toString(),
        }
        this.controlLua(param)
        return
      case 3:
        param = {
          appoint_four: this.data.appoint.toString(),
        }
        this.controlLua(param)
        return
    }
  },

  // 预约查询指令
  sendQueryYYLuaData() {
    const queryParam = {
      query: {
        query_type: 'predict',
      },
    }
    return this.luaQuery(true, queryParam)
  },

  // 初始化预约信息
  initAppoint(result) {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    const { appointNum } = this.data
    let appoint = []
    if (typeof result.appoint_one === 'object') {
      switch (appointNum) {
        case 0:
          appoint = result.appoint_one
          break
        case 1:
          appoint = result.appoint_two
          break
        case 2:
          appoint = result.appoint_three
          break
        case 3:
          appoint = result.appoint_four
          break
      }
    } else {
      switch (appointNum) {
        case 0:
          appoint = JSON.parse(result.appoint_one)
          break
        case 1:
          appoint = JSON.parse(result.appoint_two)
          break
        case 2:
          appoint = JSON.parse(result.appoint_three)
          break
        case 3:
          appoint = JSON.parse(result.appoint_four)
          break
      }
    }
    this.setData({
      appoint,
    })
    wx.hideLoading()
  },

  //0变为00,1变为01
  initDouble(n) {
    var tmp = '' + n
    if (n < 10) {
      tmp = '0' + n
    }
    return tmp
  },

  // 转二进制字符串
  to2Bit(val) {
    var _str_val = parseInt(val).toString(2)
    var _str = ''
    if (_str_val.length < 8) {
      for (var i = 0; i < 8 - _str_val.length; i++) {
        _str += '0' //补零
      }
    }
    var str_2 = _str + _str_val
    str_2 = str_2.split('').map(Number).reverse()
    return str_2
  },

  // 获取周几为选中状态
  initWeek(num, week) {
    for (var i = 0, r = 0; i <= 6; i++, r++) {
      if (num[i] != 0) {
        week[r].selected = true
      }
    }
    return week
  },

  //根据选择日期自动勾选类型
  setWeekType() {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    const { week } = this.data
    var str = ''
    var arr = new Array()
    for (var i = 0; i < 7; i++) {
      if (week[i].selected) str += i.toString()
    }
    arr = str.split('').sort()
    var weekType
    if (arr.length == 0) {
      // 仅此一次，不重复
      weekType = 1
    } else if (arr.length == 7) {
      // 每天
      weekType = 2
    } else if (str == '12345') {
      // 工作日
      weekType = 3
    } else if (str == '06') {
      // 周末
      weekType = 4
    } else {
      weekType = 5 //自定义
    }
    this.setData({
      appointType: weekType,
    })
    wx.hideLoading()
  },

  // 根据预约对象初始化预约具体信息
  initDetailAppoint() {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    const { appoint, isAdd } = this.data
    if (!isAdd) {
      this.setData({
        sendTemp: appoint[1],
        temperature: appoint[1] + '℃',
        startTime: this.initDouble(appoint[2]) + ':' + this.initDouble(appoint[3]),
        endTime: this.initDouble(appoint[4]) + ':' + this.initDouble(appoint[5]),
      })
      if (![1, 2, 4, 8, 16, 32, 64].includes(appoint[6] * 1)) {
        this.setData({
          weekArray: this.to2Bit(appoint[6]),
        })
      }
      if (![1, 2, 4, 8, 16, 32, 64].includes(appoint[6] * 1)) {
        this.setData({
          week: this.initWeek(this.data.weekArray, this.data.week),
        })
      }
      this.setWeekType()
    }
    wx.hideLoading()
  },
  creatNormalList(list = []) {
    let arr = []
    list.map((item, index) => {
      let startTime = `${this.initDouble(item[2])}:${this.initDouble(item[3])}`
      let endTime = `${this.initDouble(item[4])}:${this.initDouble(item[5])}`
      let week_list = this.to2Bit(item[6])
      let arr2 = []
      for (var i = 0; i < 7; i++) {
        week_list[i] && arr2.push(i)
      }
      arr.push({
        startTime,
        endTime,
        week: arr2.sort().join(','),
        enable: item[0] != 0,
        taskId: index,
      })
    })
    return arr
  },

  initOnTimeList(list = []) {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    // 重置存放开启状态的列表
    this.setData({
      appointOnTimeList: [[], [], [], [], [], [], []],
    })
    list.map((item, index) => {
      if (item.enable) {
        let week_list = item.week.split(',')
        if (item.startTime > item.endTime) {
          // 跨天则将当前预约拆分为两段
          let item_1 = {
            ...item,
            endTime: '24:00',
          }
          week_list.map((week) => {
            if (this.data.appointOnTimeList[week]) {
              const appointOnTimeList = [...this.data.appointOnTimeList]
              appointOnTimeList[week].push(item_1)
              this.setData({
                appointOnTimeList,
              })
            }
          })
          let new_week_list = week_list.map((week) => {
            return week == '6' ? 0 : Number(week) + 1
          })
          let item_2 = {
            ...item,
            startTime: '00:00',
            week: new_week_list.join(','),
          }
          new_week_list.map((week) => {
            if (this.data.appointOnTimeList[week]) {
              const appointOnTimeList = [...this.data.appointOnTimeList]
              appointOnTimeList[week].push(item_2)
              this.setData({
                appointOnTimeList,
              })
            }
          })
        } else {
          // 不跨天
          week_list.map((week) => {
            if (this.data.appointOnTimeList[week]) {
              const appointOnTimeList = [...this.data.appointOnTimeList]
              appointOnTimeList[week].push(item)
              this.setData({
                appointOnTimeList,
              })
            }
          })
        }
      }
    })
    wx.hideLoading()
  },

  initAppointList(result) {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    this.setData({
      appointList: this.creatNormalList([
        result.appoint_one,
        result.appoint_two,
        result.appoint_three,
        result.appoint_four,
      ]),
    })
    this.initOnTimeList(this.data.appointList)
    wx.hideLoading()
  },

  // 获取预约查询数据的方法
  queryYyLuaData() {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    this.sendQueryYYLuaData()
      .then((res) => {
        wx.hideLoading()
        this.initAppoint(res)
        this.initDetailAppoint()
        this.initAppointList(res)
      })
      .catch((e) => {
        wx.hideLoading()
        //nativeService.toast("网络较差，请稍后重试");
      })
  },
})
