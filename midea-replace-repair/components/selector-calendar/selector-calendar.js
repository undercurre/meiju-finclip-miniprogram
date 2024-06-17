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
    titleText: {
      type: String,
      value: '选择时间',
    },
    subTitleText: {
      type: String,
      value: '365天以换代修权益仅针对在2021年1月1日以后购买的设备，此设备购买时间不符合要求',
    },
  },
  lifetimes: {
    attached() {
      console.log('attached')
      this.getYearArray()
      this.initDateArray()
    },
    ready() {},
  },
  observers: {
    // "isShow": function (newVal, oldVal) {
    //   if (newVal) {
    //     this.setData({
    //       timeIndex: null,
    //       yearArray: this.getYearArray(),
    //     })
    //   }
    // },
  },

  data: {
    isIphoneX: app.globalData.isIphoneX,
    nowDate: new Date().getDate(),
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth(), // 0-11
    currentDay: new Date().getDate(), // 1-31

    dataList: [],
    yearArray: [], //picker list year
    monthArray: [], //picker list month
    dateArray: [], //picker list day
    timeIndex: null,
    choiseArray: [10, 3, 5], //最终选择的日期跟时间
    value: [10, 3, 5],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 年列表
     */
    getYearArray() {
      let yearArr = []
      for (let index = 0; index < 20; index++) {
        yearArr.push(2010 + index)
      }
      this.getMonthArray()
      this.initDateArray()
      this.setData({
        yearArray: yearArr,
      })
      return yearArr
    },
    /*
      生成月列表
    */
    getMonthArray() {
      let monthArr = []
      for (let index = 1; index <= 12; index++) {
        monthArr.push(index)
      }
      this.setData({
        monthArray: monthArr,
      })
    },

    initDateArray() {
      let dateArr = [],
        { currentYear, currentMonth, currentDay } = this.data
      let currentDayCount = new Date(currentYear, currentMonth + 1, 0).getDate()
      console.log('year-month-date', `${currentYear}-${currentMonth + 1}-${currentDay}`)
      console.log('currentDayCount', currentDayCount)
      for (let index = 1; index <= currentDayCount; index++) {
        dateArr.push(index)
      }
      this.setData({
        dateArray: dateArr,
        value: [currentYear - 2010, currentMonth, currentDay - 1],
        choiseArray: [currentYear - 2010, currentMonth, currentDay - 1],
      })
    },

    // 确认选择
    onSelectItem() {
      let { yearArray, monthArray, dateArray, choiseArray } = this.data
      let year = yearArray[choiseArray[0]],
        month = monthArray[choiseArray[1]],
        date = dateArray[choiseArray[2]]
      if (date <= 9) {
        date = `0${date}`
      }
      if (month <= 9) {
        month = `0${month}`
      }
      this.triggerEvent('select', {
        date: `${year}-${month}-${date}`,
        year: year,
        month: month,
        day: date,
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
      console.log('data bindChange', e.detail.value)
      let indexValue = e.detail.value
      let { yearArray, monthArray } = this.data
      console.log('yearArray indexValue', yearArray[indexValue[0]])
      console.log('monthArray indexValue', monthArray[indexValue[1]])
      let currentDayCount = new Date(yearArray[indexValue[0]], monthArray[indexValue[1]], 0).getDate()
      console.log('change currentDayCount', currentDayCount)
      let tempDateArr = []
      for (let index = 1; index <= currentDayCount; index++) {
        tempDateArr.push(index)
      }
      console.log('value before', this.data.value)
      this.setData({
        dateArray: tempDateArr,
        choiseArray: indexValue,
        value: indexValue,
        // value:[currentYear-2010, currentMonth, currentDay-1]
      })
      console.log('value after', this.data.value)
    },
  },
})
