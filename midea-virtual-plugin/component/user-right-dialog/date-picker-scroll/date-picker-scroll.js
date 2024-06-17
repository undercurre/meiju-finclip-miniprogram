// 初始化日期模态框数据
let date = new Date()
let years = []
let months = []
let days = []

for (let i = date.getFullYear() - 20; i <= date.getFullYear(); i++) {
  years.push(i)
}
for (let i = 1; i <= 12; i++) {
  months.push(pad0(i))
}

for (let i = 1; i <= 31; i++) {
  days.push(pad0(i))
}

function pad0(num) {
  return num >= 10 ? num : '0' + num
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    isLimitMaxDay: {
      //是否可选大于当前日期
      type: Boolean,
      value: true,
    },
    years: {
      type: Array,
      value: '年',
    },
    months: {
      type: Array,
      value: '月',
    },
    days: {
      type: Array,
      value: '日',
    },
    value: {
      type: Array,
      value: [20, 6, 15],
    },
    // hours: {
    //   type: Array,
    //   value: "小时"
    // },
    // minutes: {
    //   type: Array,
    //   value: "分钟"
    // }
  },
  /* 组件的初始数据*/
  data: {
    dateZindex: 11000000,
    borderRadius: 32,
    showBtn: true,
    backgroundColor: '#fff',
    selectTimeArr: [],
  },
  attached() {
    this.initTime()
  },
  /** 组件的方法列表 **/
  methods: {
    initTime() {
      this.setData({
        years: years,
        months: months,
        days: days,
      })
      setTimeout(() => {
        this.data.initValue = [years.length - 1, date.getMonth(), date.getDate() - 1]
        this.setData({
          //默认当天
          value: [years.length, date.getMonth(), date.getDate() - 1],
        })
      }, 0)
    },
    //取消
    canslebtn() {
      this.setData({
        show: false,
      })
      this.triggerEvent('canslebtn')
    },
    //确认
    confirmBtn() {
      this.setData({
        show: false,
      })
      let timeArr = this.data.selectTimeArr
      let selectTime
      if (!timeArr.length) {
        //未滚动 点确定
        selectTime = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
      } else if (
        this.data.isLimitMaxDay &&
        years[timeArr[0]] >= date.getFullYear() &&
        months[timeArr[1]] >= date.getMonth() &&
        days[timeArr[2]] > date.getDate()
      ) {
        //限制不能选取大于当前日期
        selectTime = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
      } else {
        selectTime = `${years[timeArr[0]]}-${months[timeArr[1]]}-${days[timeArr[2]]}` //'yyyy-MM-dd'
      }
      this.triggerEvent('confirmBtn', selectTime)
    },
    // 调用父组件  事件
    fnbindChange(e) {
      this.data.selectTimeArr = e.detail.value
      let selYear = years[this.data.selectTimeArr[0]]
      let selMonth = months[this.data.selectTimeArr[1]]
      let selDay = days[this.data.selectTimeArr[2]]
      let curDays = new Date(selYear, selMonth, 0).getDate() //联动后当前年月天数
      if (
        (this.data.isLimitMaxDay && selYear >= date.getFullYear() && Number(selMonth) > date.getMonth() + 1) ||
        (this.data.isLimitMaxDay &&
          selYear >= date.getFullYear() &&
          Number(selMonth) >= date.getMonth() + 1 &&
          selDay > date.getDate())
      ) {
        // this.initTime()
        this.setData({
          value: this.data.initValue,
          selectTimeArr: this.data.initValue,
        })
      }
      days = []
      for (let i = 1; i <= curDays; i++) {
        days.push(pad0(i))
      }
      this.setData({
        days: days,
      })
      this.triggerEvent('bindChangeEvent', e.detail)
    },
  },
})
