const app = getApp()
Component({
  properties: {
    cancelText: {
      type: String,
      value: '取消',
    },
    confirmText: {
      type: String,
      value: '确定',
    },
    isShow: {
      type: Boolean,
      value: false,
    },
    canToday: {
      type: Boolean,
      value: true,
    },
    selectType: {
      type: String,
      default: '',
    },
    titleText: {
      type: String,
      value: '服务时间',
    },
    subTitleText: {
      type: String,
      value: '具体服务时间以服务商与您沟通的约定为准',
    },
    fromPage: {
      type: String,
      value: '',
    },
  },
  lifetimes: {
    attached() {},
  },
  observers: {
    isShow: function (newVal) {
      if (newVal) {
        this.setData({
          timeIndex: null,
          serviceDate: {},
          dateArray: this.getDateArray(),
        })
      }
    },
  },

  data: {
    isIphoneX: app.globalData.isIphoneX,
    nowDate: new Date().getDate(),
    dataList: [],
    dateArray: [], //左边的日期
    serviceDate: null,
    timeIndex: null,
    serviceTimeArr: null,
    tempArr0: [], //拿来做比对的数组
    choiseArray: [0, 0], //最终选择的日期跟时间
    value: [0, 0],
  },
  /**
   * 组件的方法列表
   */
  methods: {
    initTimeList() {
      // let serviceTimeArr = []
      // console.log(this.data.tempArr0)
      // console.log(this.data.tempArr)
      // 假如今天是可以开始选的
      let newVal = this.data.tempArr0[0]
      // console.log(newVal)
      // console.log(`${newVal.year}-${newVal.month}-${newVal.date}`)
      this.calcValueByCanToday(`${newVal.year}-${newVal.month}-${newVal.date}`)
    },

    /**
     * 获取未来30天
     * 若恢复上一个版本预约时间，使用 20240424前代码
     */
    getDateArray() {
      console.log(this.properties.fromPage)
      const oneDay = 86400000 // 一天的时间戳 24*60*60*1000
      let now = new Date()
      let tempArr = []
      let tempArr0 = []
      let nowHours = new Date().getHours() //获取当前的时钟几点
      let i = nowHours >= 9 ? 1 : 0 //当天事件超过10点  当天不可预约，不显示当天时间
      let showTime = this.properties.fromPage && this.properties.fromPage == 'upkeep' ? true : false //传参  保养显示7天
      let dataLength = nowHours >= 9 ? (showTime ? 8 : 31) : showTime ? 7 : 30
      for (; i < dataLength; i++) {
        const temp = new Date(now.getTime() + i * oneDay)
        let weekday = temp.getDay()
        // let year = temp.getFullYear()
        let month = temp.getMonth() + 1
        let date = temp.getDate()
        let weekday0
        switch (weekday) {
          case 0:
            weekday0 = '日'
            break
          case 1:
            weekday0 = '一'
            break
          case 2:
            weekday0 = '二'
            break
          case 3:
            weekday0 = '三'
            break
          case 4:
            weekday0 = '四'
            break
          case 5:
            weekday0 = '五'
            break
          case 6:
            weekday0 = '六'
            break
        }
        // console.log(weekday0)
        // console.log(date)
        // console.log('今天')
        let str =
          date == new Date(now.getTime()).getDate() && month == new Date(now.getTime()).getMonth() + 1
            ? month + '月' + date + '日' + '(' + '今天' + ')'
            : month + '月' + date + '日' + '(' + '周' + weekday0 + ')'
        tempArr.push(str)
        tempArr0.push({
          weekday: temp.getDay(),
          year: temp.getFullYear(),
          month: temp.getMonth() + 1,
          date: temp.getDate(),
          month0: temp.getMonth() + 1,
          date0: temp.getDate(),
        })
      }
      // console.log(tempArr0)
      this.setData({
        tempArr0,
        tempArr,
      })
      this.initTimeList()
      // this.setData({
      //   serviceTimeArr
      // })
      // console.log(tempArr);
      return tempArr
    },
    /**
     * 根据日期计算的规则函数
     * 若恢复上一个版本预约时间，使用 20240424前代码
     * @param newDate
     */
    calcValueByCanToday(newDate) {
      // 根据日期，判断所需显示的时间段
      let date = new Date(),
        // now = new Date().getTime(), // 当前时间戳
        // month = new Date().getMonth() + 1, //当前月份
        nowHours = new Date().getHours(),
        oneDay = 86400000, // 一天的时间戳
        isTomorrow = new Date(newDate.replace(/-/g, '/')) - new Date(date.toLocaleDateString()) === oneDay // 选择的日期减去今天的日期等于一天

      // let sixHours = 21600000 // 6小时
      // let fiveHours = 18000000 // 5小时
      // let fourHours = 14400000 //4小时
      // console.log(new Date().getDate()) //获取的今天日
      // console.log(new Date(newDate.replace(/-/g, '/')).getDate()); //选择的日
      let serviceTimeArr0 = [
        '09:00-10:00',
        '10:00-11:00',
        '11:00-12:00',
        '12:00-13:00',
        '13:00-14:00',
        '14:00-15:00',
        '15:00-16:00',
        '16:00-17:00',
        '17:00-18:00',
      ]
      //  今天
      console.log(new Date().getMonth() + 1)
      console.log(new Date(newDate.replace(/-/g, '/')).getMonth() + 1)
      if (
        new Date(newDate.replace(/-/g, '/')).getDate() === new Date().getDate() &&
        new Date().getMonth() + 1 === new Date(newDate.replace(/-/g, '/')).getMonth() + 1
      ) {
        if (nowHours < 9) {
          let serviceTimeArr = serviceTimeArr0.slice(8)
          this.setData({
            serviceTimeArr,
          })
        } else {
          this.setData({
            serviceTimeArr: [],
          })
        }
      } else if (isTomorrow) {
        //  明天
        if (nowHours < 10) {
          this.setData({
            serviceTimeArr: serviceTimeArr0,
          })
        } else if (nowHours >= 10 && nowHours < 17) {
          let gap = nowHours - 9
          let serviceTimeArr = serviceTimeArr0.slice(gap)
          this.setData({
            serviceTimeArr,
          })
        } else {
          let serviceTimeArr = serviceTimeArr0.slice(8)
          this.setData({
            serviceTimeArr,
          })
        }
      } else {
        this.setData({
          serviceTimeArr: serviceTimeArr0,
        })
      }
      console.log(serviceTimeArr0)
      // 日期支持选择未来30天
      // 选择时间段为早上9点至下午6点，以1小时为单位

      // 当天可预约时间段：
      // 当前时间 大于等于 12点之后：当天不可预约
      // 当前时间 9~12点：4小时后~18间的任一时段
      // 当前时间9点前（不包含9点）：13~18间任一时段

      // 当前时间 14点前（不包含14点）：09~18间任一时段
      // 当前时间 14点~15点：10~18间任一时段
      // 当前时间 15点~16点：11~18间任一时段
      // 当前时间 16点~17点：12~18间任一时段
      // 当前时间 17点~18点及18后时段：13~18间任一时段
    },
    // 确认选择
    onSelectItem() {
      let value = this.data.choiseArray
      let dataStr = value[0]
      let timeStr = value[1]
      let serviceDate = this.data.tempArr0[dataStr]
      let newData = this.data.tempArr[dataStr]
      let serviceTime = this.data.serviceTimeArr[timeStr]
      if (serviceDate.date <= 9) {
        serviceDate.date = '0' + serviceDate.date
      }
      if (serviceDate.month <= 9) {
        serviceDate.month = '0' + serviceDate.month
      }
      // console.log(serviceDate,serviceTime)
      this.triggerEvent('select', {
        date: `${serviceDate.year}-${serviceDate.month}-${serviceDate.date}`,
        year: serviceDate.year,
        month: serviceDate.month0,
        day: serviceDate.date0,
        newData: newData,
        serviceTime: serviceTime,
      })
      this.setData({
        isShow: false,
      })
    },
    //取消选择
    hideSelector() {
      this.setData({
        isShow: false,
      })
      this.triggerEvent('hide')
    },
    // 滚动picker选择时间
    bindChange(e) {
      // console.log(e.detail.value)
      let valArray = e.detail.value
      this.setData({
        choiseArray: e.detail.value,
        value: e.detail.value,
      })
      let str = valArray[0]
      let newVal = this.data.tempArr0[str]
      this.calcValueByCanToday(`${newVal.year}-${newVal.month}-${newVal.date}`)
    },
  },
})
