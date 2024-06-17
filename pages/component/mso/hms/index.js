Component({
  properties: {
    key: {
      type: String,
      value: '',
    },
    hms: {
      type: Array,
      value: [1, 1, 1],
    },
    max: {
      type: String,
      value: '',
    },
    min: {
      type: String,
      value: '',
    },
    value: {
      type: Array,
      value: [6, 6, 6],
    },
  },
  data: {
    options: [],
    units: ['时', '分', '秒'],
    valueIndexArray: null,
  },
  observers: {
    'min, max, value': function (min, max, value) {
      console.log(min, max, value)
      this.reset()
    },
  },
  attached() {
    this.reset()
  },
  detached() {
    console.log('hms detached')
  },
  methods: {
    reset() {
      const keys = ['min', 'max']
      keys.forEach((key) => {
        this.data[key] = this.data[key] || this.data.value.join(':')
      })
      this.init()
      const valueIndexArray = this.getValueIndexArray(this.data.value)
      this.setData({
        valueIndexArray,
      })
    },
    init() {
      let options = []
      const max = this.strToArr('max')
      const min = this.strToArr('min')
      const defaultTime = this.data.value

      const num = defaultTime.length
      for (let i = 0; i < num; i++) {
        const [start, end] = this.getRange(min, max, i)
        const range = this.generateRange(start, end, i)
        let item = {
          range,
        }
        options.push(item)
      }

      this.setData({
        options,
      })
    },
    getRange(min, max, i) {
      if (i === 0) {
        return this.getHourRange(min, max, i)
      }

      if (i === 1) {
        return this.getMinuteRange(min, max, i)
      }

      return this.getSecondRange(min, max, i)
    },
    bindChange: function (e) {
      // 抓住相对不变的量value
      // 1. 保存value
      let valueIndexArray = e.detail.value

      this.data.value = this.getHms(valueIndexArray)

      // 2. 分别更新时分秒范围
      this.init()

      // 3. 更新时分秒索引
      valueIndexArray = this.getValueIndexArray(this.data.value)

      this.setData({
        valueIndexArray,
      })

      // 4. 更新时分秒值value
      const value = this.getHms(valueIndexArray)
      this.setData({
        value,
      })

      this.triggerEvent('hmsChange', {
        value,
        key: this.data.key,
      })
    },
    getHms(valueIndexArray) {
      let hms = []
      for (let index in valueIndexArray) {
        hms.push(this.data.options[index].range[valueIndexArray[index]])
      }
      return hms
    },
    getValueIndexArray(value) {
      let valueIndexArray = []
      for (let index in value) {
        valueIndexArray.push(this.data.options[index].range.indexOf(value[index]))
      }
      return valueIndexArray
    },
    getSecondRange(min, max, i) {
      let hourIndex = i - 2
      let minuteIndex = i - 1

      if (this.data.value[hourIndex] === max[hourIndex]) {
        if (this.data.value[minuteIndex] >= max[minuteIndex]) {
          this.data.value[minuteIndex] = max[minuteIndex]

          if (this.data.value[i] >= max[i]) {
            this.data.value[i] = max[i]
            return [Math.max(0, max[i]), max[i]]
          }

          return [Math.min(0, max[i]), max[i]]
        }

        return [0, 59]
      }

      if (this.data.value[hourIndex] === min[hourIndex]) {
        if (this.data.value[minuteIndex] <= min[minuteIndex]) {
          this.data.value[minuteIndex] = min[minuteIndex]

          if (this.data.value[i] < min[i]) {
            this.data.value[i] = min[i]
          }

          return [min[i], 59]
        }
      }

      return [0, 59]
    },
    getMinuteRange(min, max, i) {
      let previousIndex = i - 1
      if (this.data.value[previousIndex] < max[previousIndex]) {
        if (this.data.value[previousIndex] === min[previousIndex]) {
          if (this.data.value[i] < min[i]) {
            this.data.value[i] = min[i]
          }
          return [min[i], 59]
        }
        return [0, 59]
      }

      if (this.data.value[previousIndex] === max[previousIndex]) {
        if (this.data.value[i] > max[i]) {
          this.data.value[i] = max[i]
        }

        if (this.data.value[previousIndex] === min[previousIndex]) {
          return [min[i], max[i]]
        }

        return [0, max[i]]
      }
    },
    getHourRange(min, max, i) {
      return [min[i], max[i]]
    },
    /**
     * 步长为1，起始为0的连续数组
     * */
    generateRange(start, end) {
      let range = []
      for (let i = 0; i <= parseInt(end) - parseInt(start); i++) {
        range.push(+(parseInt(start) + i))
      }
      return range
    },
    getRangeIndex(range, value) {
      const results = range.filter((item) => {
        return item.value === value
      })
      return results[0].index
    },
    strToArr(propKey) {
      return Array.from(this.data[propKey].split(':'), (x) => parseInt(x))
    },
  },
})
