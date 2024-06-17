import { requestService, rangersBurialPoint } from '../../../utils/requestService'
import { getStamp } from 'm-utilsdk/index'
import { pluginEventTrack } from '../../../track/pluginTrack'
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    statusNavBarHeight: app.globalData.statusNavBarHeight, //状态栏高 + 标题栏高
    moreList: [],
    curMode: {},
    temp: 0,
    // 页面传输数据
    applianceCode: '',
    hasDrawerDevice: false,
    activeNum: 0,
    modeList: [],
    // 预约时间数据
    timeArray: [],
    timeIndex: [0, 0, 0],
    orderTimeValue: [0, 0, 0],
    timeUnits: ['', '时', '分'],
    timeValue: '',
    isShow: false,
    // 预约模式数据
    showMode: false,
    modeArray: [],
    modeIndex: [0],
    orderMode: '',
    modeValue: '',
    // 附加功能数据
    curFunc: '',
    showMore: false,
    moreArray: [],
    moreIndex: [0],
    isInited: false,
    // 不用的数据
    // showPres: false,
    // presIndex: [0, 0],
    // presTime: 0,
    // isDry: false,
    // presUnits: ['天', '时'],
    // presArray: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let obj = JSON.parse(options.obj)
    let temp = []
    let modeList = []
    obj.modeList.forEach((item) => {
      if (!['keep', 'dry'].includes(item.value)) {
        modeList.push(item)
      }
    })
    let curMode = obj.curMode
    if (['keep', 'dry'].includes(obj.curMode.value)) {
      curMode = modeList.find((item) => {
        return item.value == 'eco_wash'
      })
    }
    let modeIndex = modeList.findIndex((item) => {
      return item.name == curMode.name
    })
    modeList.forEach((item) => {
      temp.push(item.name)
    })
    let hours = []
    let minutes = []
    for (let i = 0; i < 24; i++) {
      hours.push(i)
      minutes.push(i)
    }
    for (let i = 24; i < 60; i++) {
      minutes.push(i)
    }
    this.setData({
      applianceCode: obj.applianceCode,
      hasDrawerDevice: obj.hasDrawerDevice,
      activeNum: obj.activeNum,
      modeList: modeList,
      modeArray: [temp],
      timeArray: [['今日', '明日'], hours, minutes],
      modeValue: curMode.name,
      modeIndex: [modeIndex],
      orderMode: curMode.value,
      curMode: curMode,
    })
    this.initData()
    this.updateMoreList()
  },

  initData: function () {
    let timeValue = '明日 0:00'
    let value = {}
    // let presValue = '24小时'
    // let presTime = 24
    try {
      value = wx.getStorageSync('appointData')
    } catch (e) {}
    this.setData({
      timeValue: value.timeValue || timeValue,
      orderTimeValue: value.orderTimeValue || [1, 0, 0],
      // presValue: value.presValue || presValue,
      // presTime: value.presTime || presTime,
      // presIndex: value.presIndex || [0,0],
    })
  },

  // 更新morelist列表
  updateMoreList: function () {
    let exceptFilter = ['keep', 'dry', 'germ', 'diy', 'moreDry']
    let pickerFilter = ['additional', 'region', 'waterLevel', 'waterStrongLevel']
    let btnFilter = ['autoOpen', 'autoThrow']
    let funcName = {
      additional: '附加功能',
      autoOpen: '自动开门',
      autoThrow: '智能投放',
      region: '分层洗',
      waterLevel: '水位',
      waterStrongLevel: '强度',
    }
    let moreList = []
    console.log('checkout no switch in appointment: ', Object.keys(this.data.curMode.more))
    // let mores = Object.keys(this.data.curMode.more)
    Object.keys(this.data.curMode.more).forEach((item) => {
      console.log('checkout no switch in appointment btn click: ', btnFilter.includes(item))
      if (exceptFilter.includes(item)) {
        // 排除这些功能 不做操作
      } else if (pickerFilter.includes(item)) {
        // 选择框功能
        let func = { ...this.data.curMode.more[item] }
        func.type = 0
        func.key = item
        func.name = funcName[item]
        let curVal = this.data.curMode.more[item].curVal
        let list = this.data.curMode.more[item].list
        let name = ''
        let valueItem = list.find((it) => {
          return it.value == curVal
        })
        name = !valueItem ? list[0].name : valueItem.name
        // list.forEach((it) => {
        //   if (it.value == curVal) name = it.name
        // })
        func.rightText = name
        moreList.push(func)
      } else if (btnFilter.includes(item)) {
        console.log('checkout no switch in appointment btn click start: ')
        // 开关功能
        let func = { ...this.data.curMode.more[item] }
        func.type = 1
        func.key = item
        func.name = funcName[item]
        func.checked =
          item == 'autoOpen' ? (this.data.curMode.more[item].on ? true : false) : this.data.curMode.more[item].on
        moreList.push(func)
        console.log('checkout no switch in appointment btn click: ', moreList)
      }
    })
    this.setData({
      moreList: moreList,
      // isInited: true
    })
  },

  test() {
    this.setData({ isInited: true })
  },

  moreChange: function (e) {
    let curFunc = e.target.dataset.curFunc
    if (curFunc == 'autoOpen') {
      this.setData({
        'curMode.more.autoOpen.on': !this.data.curMode.more.autoOpen.on,
      })
    } else if (curFunc == 'autoThrow') {
      this.setData({
        'curMode.more.autoThrow.on': !this.data.curMode.more.autoThrow.on,
      })
    }
    this.updateMoreList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    setTimeout(() => {
      rangersBurialPoint('user_page_view', {
        page_path: 'plugin/T0xE1/appointment/index',
        module: '插件',
        page_id: 'page_control',
        page_name: '洗碗机预约页',
        object_type: '',
        object_id: '',
        object_name: '',
        device_info: {},
      })
    }, 0)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},

  // 接收预约时间数组 数组长度为三 分别代表天、时、分
  timeLegal: function (value) {
    let isLegal = false
    let day = value[0]
    let hour = value[1]
    let min = value[2]
    let curHour = new Date().getHours()
    let curMin = new Date().getMinutes()
    if (day == 1) {
      isLegal = true
    } else {
      if (hour > curHour) {
        isLegal = true
      } else if (hour == curHour) {
        if (min > curMin) {
          isLegal = true
        } else {
          isLegal = false
        }
      } else {
        isLegal = false
      }
    }
    return isLegal
  },

  order: function () {
    if (!this.timeLegal(this.data.orderTimeValue)) {
      wx.showToast({
        title: '选择的时间不能小于当前时间哦',
        icon: 'none',
        duration: 2000,
      })
      return
    }
    let setMin = (60 + this.data.orderTimeValue[2] - new Date().getMinutes()) % 60
    let setHour =
      this.data.orderTimeValue[0] * 24 +
      this.data.orderTimeValue[1] -
      new Date().getHours() -
      (this.data.orderTimeValue[2] >= new Date().getMinutes() ? 0 : 1)
    let param = {
      work_status: 'order',
      mode: this.data.orderMode,
      order_set_hour: setHour,
      order_set_min: setMin,
    }
    if (this.data.curMode.more.additional) {
      param.additional = this.data.curMode.more.additional.curVal
    }
    if (this.data.curMode.more.autoOpen) {
      param.door_auto_open = this.data.curMode.more.autoOpen.on ? 1 : 2
    }
    if (this.data.curMode.more.autoThrow) {
      param.auto_throw = this.data.curMode.more.autoThrow.on ? 1 : 0
    }
    if (this.data.curMode.more.waterLevel && this.data.curMode.more.waterLevel.curVal > 0) {
      param.water_level = this.data.curMode.more.waterLevel.curVal
    }
    if (this.data.curMode.more.waterStrongLevel && this.data.curMode.more.waterStrongLevel.curVal > 0) {
      param.water_strong_level = this.data.curMode.more.waterStrongLevel.curVal
    }
    if (this.data.curMode.more.region) {
      param.wash_region = this.data.curMode.more.region.curVal > 0 ? this.data.curMode.more.region.curVal : 3
    }
    setTimeout(() => {
      pluginEventTrack('user_behavior_event', null, {
        page_id: 'page_control',
        page_name: '洗碗机预约页',
        widget_id: 'click_order',
        widget_name: '预约',
      })
    }, 0)
    this.requestControl(param).then((rs) => {
      console.log('temp!!! appinetment res: ' + JSON.stringify(param))
      let appointData = {
        timeValue: this.data.timeValue,
        orderTimeValue: this.data.orderTimeValue,
        name: this.data.modeValue,
        // 暂时不用存的数据
        // presTime: this.data.presTime,
        // orderMode: this.data.orderMode,
        // modeIndex: this.data.modeIndex,
        // presIndex: this.data.presIndex,
        // modeValue: this.data.modeValue,
        // presValue: this.data.presValue,
      }
      wx.setStorageSync('appointData', appointData)
      wx.navigateBack()
    })
  },

  onTimeConfirm: function (e) {
    let value = e.detail
    if (!this.timeLegal(value)) {
      this.timeCancel()
      wx.showToast({
        title: '选择的时间不能小于当前时间哦',
        icon: 'none',
        duration: 2000,
      })
      return
    }
    let day = value[0] == 0 ? '今日 ' : '明日 '
    let min = value[2] < 10 ? '0' + value[2] : value[2]
    let timeValue = day + value[1] + ':' + min
    this.setData({
      // orderDay: value[0],
      // orderHour: value[1],
      // orderMinute: value[2],
      isShow: false,
      timeValue: timeValue,
      orderTimeValue: value,
    })
  },

  onModeConfirm: function (e) {
    let value = e.detail[0]
    let temp = this.data.modeList[value]
    this.setData({
      curMode: temp,
      orderMode: temp.value,
      showMode: false,
      modeValue: temp.name,
      modeIndex: [value],
    })
    this.updateMoreList()
  },

  onMoreConfirm: function (e) {
    let index = e.detail == -1 ? 0 : e.detail[0]
    let curFunc = this.data.curFunc
    let value = this.data.curMode.more[curFunc].list[index].value
    this.data.curMode.more[curFunc].curVal = value
    this.setData({
      curMode: this.data.curMode,
      showMore: false,
    })
    this.updateMoreList()
  },

  onPresConfirm: function (e) {
    let value = e.detail
    let time = value[0] * 24 + value[1]
    this.setData({
      presTime: time,
      presValue: time == 0 ? '不启动' : time + '小时',
      showPres: false,
      isDry: false,
      presIndex: value,
    })
  },

  presCancel: function () {
    this.setData({
      showPres: false,
    })
  },

  clickDry: function () {
    this.setData({
      isDry: !this.data.isDry,
      presValue: '不启动',
      presTime: 0,
    })
  },

  requestControl: function (control) {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    const command = this.data.hasDrawerDevice ? { control, drawer: activeNum } : { control }
    return requestService
      .request('luaControl', {
        applianceCode: this.data.applianceCode,
        command,
        reqId: getStamp().toString(),
        stamp: getStamp(),
      })
      .then((rs) => {
        console.log(JSON.stringify(rs), 'rs===========')
      })
      .catch((err) => {
        wx.hideLoading()
        console.log(err)
        wx.showToast({
          title: '请求失败，请稍后重试',
          icon: 'none',
          duration: 2000,
        })
      })
  },

  showModePicker: function () {
    this.setData({
      showMode: true,
    })
  },

  showMorePicker: function (e) {
    let curFunc = e.target.dataset.curFunc
    let type = e.target.dataset.curFuncType
    let moreArray = []
    this.data.curMode.more[curFunc].list.forEach((item) => {
      moreArray.push(item.name)
    })
    let moreIndex = 0
    for (let i = 0; i < this.data.curMode.more[curFunc].list.length; i++) {
      if (this.data.curMode.more[curFunc].list[i].value == this.data.curMode.more[curFunc].curVal) moreIndex = i
    }
    // this.data.curMode.more[curFunc].list.findIndex((item) => {
    //   return item.value = this.data.curMode.more[curFunc].curVal
    // })
    if (!type) {
      this.setData({
        curFunc: curFunc,
        showMore: true,
        moreArray: [moreArray],
        moreIndex: [moreIndex],
      })
    }
  },

  showPresPicker: function () {
    this.setData({
      showPres: true,
    })
  },

  showTimePicker: function () {
    this.setData({
      isShow: true,
    })
  },

  modeCancel: function () {
    this.setData({
      showMode: false,
    })
  },

  moreCancel: function () {
    this.setData({
      showMore: false,
    })
  },

  timeCancel: function () {
    this.setData({
      isShow: false,
    })
  },
})
