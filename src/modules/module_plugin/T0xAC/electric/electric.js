// plugin/T0xAC/electric/electric.js
let app = getApp()
var wxCharts = require('../util/wx-chart/wxcharts-min')
var lineChart = null
const requestService = app.getGlobalConfig().requestService
import moment from '../components/moment.min'
import { cloudDecrypt } from 'm-utilsdk/index';
import selfApi from '../api/api'
import BleCommon from '../bluetooth/common'

let key = app.globalData?.userData?.key
let appKey = app.getGlobalConfig().appKey

Page({
  /**
   * 页面的初始数据
   */
  data: {
    timeArray: [], // M/dd-M/dd M/dd-M/dd 本周
    timeIndex: 2, //时间选中索引中

    tabArray: ['周', '月', '年'],
    tabIndex: 0, //tab选中索引值

    xAisArray: [],

    elecRangeDate: '--',
    elecRangeTotal: 0,
    lastDayElecVal: 0,
    todayElecVal: 0,
    ecoSwitch: false,
    lastDay: '',
    today: '',
    deviceInfo: {},
    defaultDate: ["--/--", "--/--", "--/--", "--/--", "--/--", "--/--", "--/--"],
    defaultElecData: [0, 0, 0, 0, 0, 0, 0],

    showECO: false, // 针对酷省机型，此处不展示ECO功能
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.initChart(this.data.defaultDate, this.data.defaultElecData);
    let acstatus = {}
    let that = this
    let data = JSON.parse(decodeURIComponent(options.data))
    let sn = cloudDecrypt(data.deviceInfo.sn, key, appKey)
    console.log(data.deviceInfo, '>>>>>>>')
    console.log(app.globalData.hasFuncs, "++++++++++++++++");
    let lastDay = this.getYesterdayDate()
    let today = this.getToday()
    this.setData({
      ctrlType: options.ctrlType,
      sn: sn,
      lastDay,
      today,
      deviceInfo: data.deviceInfo,
      showECO: app.globalData.hasFuncs && (app.globalData.hasFuncs.more.controlFunc.hasECO || app.globalData.hasFuncs.home.controlFunc.hasECO)
    })

    setTimeout(() => {
      this.timeGenerator(this.data.tabIndex)
      this.xAxisGenerator(this.data.tabIndex, this.data.timeArray[this.data.timeIndex], true)
    }, 200);
    
    if (options.ctrlType == 1) {
      console.log('蓝牙')
      //监听蓝牙接收事件dispatch('updateStatus')事件->在morefunc页面进行监听最后改变button的启停状态
      console.log('sleep 蓝牙监听')
      acstatus = JSON.parse(options.acstatus)
      that.setData({
        acstatus,
      })
      app.globalData.DeviceComDecorator._queryStatus()
      app.bluetoothConn.event.on('receiveMessagePlugin', (data) => {
        console.log(BleCommon.ab2hex(data), '>>>>>>>>>>>>>>>>接收到模组消息 electric')
        console.log(
          app.globalData.DeviceComDecorator.AcProcess.parser.sendingState,
          '>>>>>>>>>>接收到模组消息 electric'
        )
        // that.refreshSwitch(app.globalData.DeviceComDecorator.AcProcess.parser.sendingState)
        that.setData({
          ecoSwitch: app.globalData.DeviceComDecorator.AcProcess.parser.sendingState.ecoFunc == 1
        })
      })
    } else if (options.ctrlType == 2) {
      console.log('wifi')
      acstatus = JSON.parse(options.acstatus)
      that.setData({
        acstatus,
        ecoSwitch: acstatus.ecoFunc,
      })
      console.log('sleep wifi监听', acstatus)
      app.globalData.DeviceComDecorator._queryStatus()
      app.globalData.DeviceComDecorator.event.on(
        'receiveMessageLan',
        (data) => {
          console.log(
            'electric电量统计远程控制返回',
            app.globalData.DeviceComDecorator.AcProcess.parser.sendingState,
            data
          )
          that.setData({
            ecoSwitch: app.globalData.DeviceComDecorator.AcProcess.parser.sendingState.ecoFunc == 1
          })
          console.log(that.data.ecoSwitch, 'that.data.ecoSwitch')

          // that.refreshSwitch(app.globalData.DeviceComDecorator.AcProcess.parser.sendingState);
        },
        'electric'
      )
    }
  },

  electricDetail(type, date, result, firstLoad) {
    console.log(this.data.deviceInfo, '----------')
    let that = this
    requestService
      .request(
        selfApi.getElectric, {
          // "applianceId": "211106234544591",
          applianceId: this.data.deviceInfo.applianceCode,
          type,
          date,
        },
        'POST'
      )
      .then((res) => {
        let _d = []
        if (res.data.errCode == '0' && res.data.result) {
          res.data.result.elecDetails.forEach((element) => {
            _d.push(element.value)
          })
          this.setData({
            elecRangeTotal: res.data.result.totalValue ? res.data.result.totalValue : 0,
          })
          if (type == 1 && this.data.elecRangeDate == '本周') {
            for (let i = 0; i < res.data.result.elecDetails.length; i++) {
              if (res.data.result.elecDetails[i].key == this.data.lastDay) {
                this.setData({
                  lastDayElecVal: res.data.result.elecDetails[i].value ? res.data.result.elecDetails[i]
                    .value : 0,
                })
              }
              if (res.data.result.elecDetails[i].key == this.data.today) {
                this.setData({
                  todayElecVal: res.data.result.elecDetails[i].value ? res.data.result.elecDetails[i].value :
                    0,
                })
              }
            }
          }
        }
        console.log('result', result, '_d', _d);
        if (firstLoad) this.initChart(result, _d)
        else this.updateChartRender(result, _d)
      })
      .catch((e) => {
        console.log(e, 'electricDetail')
        // this.updateChartRender(result, [])
      })
  },

  //生成时间节点组件所需的数据 (time-change-selector)
  timeGenerator(tabIndex) {
    let timeArray = []
    if (tabIndex == 0) {
      //  周
      let todayMoment = moment() //今天
      let isSunday = todayMoment.day() == 0;
      //计算本周的第一天需要提前判断是否周日,周日的话需要往前推移一天再使用startOf('week')函数
      let inWeekday = isSunday ? todayMoment.subtract(1, 'days') : todayMoment;
      let startOfWeek = inWeekday.startOf('week').add(1, 'days')
      startOfWeek.subtract(14, 'days')
      let left_left = moment(startOfWeek.format('YYYY-MM-DD'), 'YYYY-MM-DD')
      startOfWeek.add(6, 'days')
      let left_right = moment(startOfWeek.format('YYYY-MM-DD'), 'YYYY-MM-DD')
      startOfWeek.add(1, 'days')
      let middle_left = moment(startOfWeek.format('YYYY-MM-DD'), 'YYYY-MM-DD')
      startOfWeek.add(6, 'days')
      let middle_right = moment(startOfWeek.format('YYYY-MM-DD'), 'YYYY-MM-DD')
      // timeArray.push(`${left_left}-${left_right}`)
      // timeArray.push(`${middle_left}-${middle_right}`)
      // timeArray.push('本周')

      timeArray.push({
        text: `${left_left.format('M/DD')}-${left_right.format('M/DD')}`,
        requestMoment: `${left_left.format('YYYY-MM-DD')}`
      })
      timeArray.push({
        text: `${middle_left.format('M/DD')}-${middle_right.format('M/DD')}`,
        requestMoment: `${middle_left.format('YYYY-MM-DD')}`
      })

      timeArray.push({
        text: '本周',
        requestMoment: `${moment().format('YYYY-MM-DD')}`
      })

    } else if (tabIndex == 1) {
      //月
      let left = moment().subtract(2, 'months')
      let middle = moment().subtract(1, 'months')
      timeArray.push({
        text: `${left.format('M') + '月'}`,
        requestMoment: left.format('YYYY-MM-DD')
      })
      timeArray.push({
        text: `${middle.format('M') + '月'}`,
        requestMoment: middle.format('YYYY-MM-DD')
      })
      timeArray.push({
        text: "本月",
        requestMoment: moment().format('YYYY-MM-DD')
      })
    } else {
      //年
      let left = moment().subtract(2, 'years')
      let middle = moment().subtract(1, 'years')
      timeArray.push({
        text: `${left.format('YYYY') + '年'}`,
        requestMoment: left.format('YYYY-MM-DD')
      })
      timeArray.push({
        text: `${middle.format('YYYY') + '年'}`,
        requestMoment: middle.format('YYYY-MM-DD')
      })

      timeArray.push({
        text: "本年",
        requestMoment: moment().format('YYYY-MM-DD')
      })

    }
    console.log('timeArrayGeneratedSuccess', timeArray)
    // this.data.tabIndex
    this.setData({
      timeArray,
    })
  },

  xAxisGenerator(timeType, item, firstLoad) {
    let timeDesc = item.text
    let requestMoment = item.requestMoment
    let result = []
    this.setData({
      elecRangeDate: timeDesc ? timeDesc : '--',
    })
    switch (timeType) {
      //周
      case 0:
        let todayMoment = moment() //今天
        let isSunday = todayMoment.day() == 0;
        //计算本周的第一天需要提前判断是否周日,周日的话需要往前推移一天再使用startOf('week')函数
        let inWeekday = isSunday ? todayMoment.subtract(1, 'days') : todayMoment;
        let first =
          timeDesc.indexOf('-') != -1 ? moment(timeDesc.split('-')[0], 'M/DD') : inWeekday.startOf('week').add(1,
            'days')
        result.push(first.format('M/DD'))
        let index = 0
        while (index < 6) {
          result.push(first.add(1, 'days').format('M/DD'))
          index++
        }
        console.log(first.format('YYYY-MM-DD'), result)
        this.electricDetail(1, requestMoment, result, firstLoad)
        break
      case 1:
        //月
        if (timeDesc == '本月') {
          this.monthDealer(result, moment(), requestMoment)
        } else {
          this.monthDealer(result, moment(parseInt(timeDesc.replace('月', '')), 'M'), requestMoment)
        }

        break
      default:
        //年
        for (let i = 1; i < 13; i++) {
          result.push(`${i}月`)
        }
        let _m = timeDesc == '本年' ? moment() : moment(parseInt(timeDesc.replace('年', '')), 'YYYY')
        this.electricDetail(3, requestMoment, result, firstLoad)
    }
    console.log('xAxisArray', result)
    // this.updateChartRender(result, [])
    let _d = []
    result.forEach((element) => {
      _d.push(2)
    })
    // if (firstLoad) this.initChart(result, _d)
    // else this.updateChartRender(result, _d)
    return result
  },

  monthDealer(result, time, requestMoment) {
    let now = new Date()
    let nowMonth = time.month() //月
    let nowYear = time.year() //年
    console.log(nowMonth, nowYear)
    //本月的开始时间
    let monthStartDate = new Date(nowYear, nowMonth, 1)
    var timeStar = Date.parse(monthStartDate) //s
    let startOfMonth = moment(timeStar) //月初
    let endOfMonth = time.endOf('month') //月尾
    console.log(startOfMonth, endOfMonth)
    result.push(startOfMonth.format('D'))
    while (startOfMonth.format('D') != endOfMonth.format('D')) {
      console.log(1)
      result.push(startOfMonth.add(1, 'days').format('D'))
    }

    this.electricDetail(2, requestMoment, result)
    return result
  },

  updateChartRender(xAixs, lineData) {
    lineChart.updateData({
      categories: xAixs,
      series: [{
        name: '用电量',
        data: lineData,
        color: '#267aff',
        format: function (val, name) {
          return val + '度'
        },
      }, ],
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('electric on unload')
    app.globalData.DeviceComDecorator.event.off('receiveMessageLan', (data) => {})
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

  initChart(categories, data) {
    let maxVal = Math.max(...data)
    let maxRange = 1
    if (maxVal <= 0.1) {
      maxRange = 0.1
    }
    console.log('categories', categories, 'data', data, maxVal)
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories,
      animation: false,
      background: '#fff',
      series: [{
        name: '用电量',
        data,
        color: '#267aff',
        format: function (val, name) {
          return val + '度'
        },
      }, ],
      xAxis: {
        disableGrid: true,
        gridColor: '#d8d8d8',
        fontColor: '#a4a4a4',
      },
      yAxis: {
        gridColor: '#d8d8d8',
        fontColor: '#a4a4a4',
        // format: function (val) {
        //   let valFixed = parseFloat(val)
        //   return valFixed + '度'
        // },
        min: 0,
        max: maxRange,
      },
      width: 300,
      height: 200,
      dataLabel: false,
      dataPointShape: true,
      // extra: {
      //   lineStyle: 'curve'
      // }
    });
  },
  onECOChange(e) {
    console.log('ECO')
    if (this.data.acstatus.runStatus == 0) {
      wx.showToast({
        title: '空调已关，请先开空调',
        icon: 'none',
      })
      this.setData({
        ecoSwitch: false,
      })
      return
    }
    if (this.data.acstatus.mode == 2) {
      let sendData = this.data.ecoSwitch ? 0 : 1
      app.globalData.DeviceComDecorator.switchECO(sendData, this.data.acstatus, 'click_eco', this.data.page_path)
      app.globalData.DeviceComDecorator.AcProcess.parser.newsendingState.superCoolingSw = 0
      app.globalData.DeviceComDecorator.AcProcess.parser.newsendingState.controlSwitchNoWindFeel = 0
    } else {
      wx.showToast({
        title: 'ECO需要在制冷模式下开启',
        icon: 'none',
      })
      this.setData({
        ecoSwitch: false,
      })
    }
  },
  onChangeTab(e) {
    let timeSelector = this.selectComponent('#time-selector')
    timeSelector.resetIndex() //每次切换周、月、年tab的时候重置时间轴
    this.setData({
      tabIndex: e.detail,
      timeIndex: 2,
    })
    this.timeGenerator(e.detail)
    this.xAxisGenerator(e.detail, this.data.timeArray[2])
  },
  onChangeTime(e) {
    console.log(e.detail, this.data.tabIndex)
    this.xAxisGenerator(this.data.tabIndex, this.data.timeArray[e.detail])
  },
  refreshSwitch(state) {
    console.log('refreshSwitch', state.ecoFunc)
    setTimeout(() => {
      this.setData({
        ecoSwitch: state.ecoFunc,
      })
    }, 400)
  },
  getToday() {
    var date = new Date()
    var seperator1 = '-'
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var strDate = date.getDate()
    if (month >= 1 && month <= 9) {
      month = '0' + month
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = '0' + strDate
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate
    return currentdate
  },
  getYesterdayDate() {
    //获取当前时间前一天
    var nowdate = new Date()
    nowdate.setDate(nowdate.getDate() - 1)
    var y = nowdate.getFullYear()
    var m = nowdate.getMonth() + 1 < 10 ? '0' + (nowdate.getMonth() + 1) : nowdate.getMonth() + 1
    var d = nowdate.getDate() < 10 ? '0' + nowdate.getDate() : nowdate.getDate()
    var formatwdate = y + '-' + m + '-' + d
    return formatwdate
  },
})
