import { addZero } from '../../card/js/plugin-config'
Component({
  options: {
    multipleSlots: true,
  },
  properties: {
    model: {
      type: Object,
      observer: function () {
        this.getModel()
      },
    },
    disabled: {
      type: Boolean,
      value: null,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    bindModel: {},
    isShowSetting: false,
    currentMinute: [0, 0], // 初始值
    currentHour: [0, 0], // 初始值
    curHour: 0, // 设置的值
    curMin: 0, // 设置的值
    hours: [],
    minuteObj: {},
    curMinutes: [],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getModel() {
      let bindModel = JSON.parse(JSON.stringify(this.properties.model))
      let hours = [],
        minutes = []
      let defaultValue = bindModel.defaultValue * 1
      let minMinute = bindModel.min * 1,
        maxMinute = bindModel.max * 1
      let minHour = parseInt(minMinute / 60),
        MaxHour = parseInt(maxMinute / 60)
      let minuteObj = {}
      for (let i = 0; i < 60; i++) {
        minutes.push(addZero(i))
      }
      // 获取每一个小时选项对应的分钟数组
      for (let i = minHour; i <= MaxHour; i++) {
        hours.push(i)
        let minuteArr = []
        if (i * 60 < minMinute) {
          for (let j = minMinute - i * 60; j < 60; j++) {
            minuteArr.push(addZero(j))
            if (j + i * 60 > maxMinute) {
              break
            }
          }
          minuteObj[i] = minuteArr
        } else if (i == MaxHour) {
          for (let j = 0; j <= maxMinute - i * 60; j++) {
            if (j + i * 60 < minMinute) {
              continue
            }
            minuteArr.push(addZero(j))
          }
          minuteObj[i] = minuteArr
        } else {
          minuteObj[i] = minutes
        }
      }
      let curHour = parseInt(defaultValue / 60)
      let curMin = addZero(defaultValue % 60)
      let curMinutes = minuteObj[curHour]
      let currentHour = [hours.indexOf(curHour), 0]
      let currentMinute = [curMinutes.indexOf(curMin), 0]
      this.setData({ bindModel, hours, minuteObj, curMinutes, currentHour, currentMinute, curHour, curMin })
    },
    goSetTime() {
      this.setData({ isShowSetting: true })
    },
    closeModal() {
      this.setData({ isShowSetting: false })
    },
    pickOnMinute(e) {
      const valueArr = e.detail.value
      let curMinutes = this.data.curMinutes
      let curMin = curMinutes[valueArr[0]]
      this.setData({ curMin })
    },
    pickOnHour(e) {
      // 滚动小时
      const valueArr = e.detail.value
      let hours = this.data.hours
      let curHour = hours[valueArr[0]]
      let minuteObj = this.data.minuteObj
      let curMinutes = minuteObj[curHour]
      this.setData({ curMinutes, curHour })
      // 设置分钟值
      let curMin = this.data.curMin
      let currentMinute = this.data.currentMinute
      if (curMinutes.indexOf(curMin) > -1) {
        currentMinute[0] = curMinutes.indexOf(curMin)
      } else {
        currentMinute[0] = 0
        curMin = curMinutes[0]
        this.setData({ curMin })
      }
      this.setData({ currentMinute })
    },
    save() {
      let settingValue = [this.data.curHour, this.data.curMin * 1]
      this.triggerEvent('onChange', settingValue)
      this.closeModal()
    },
  },
  attached() {
    this.getModel()
  },
})
