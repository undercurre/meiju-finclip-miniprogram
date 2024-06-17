// const date = new Date()
// const years = []
// const months = []
// const days = []

var settingArrData = function (start, end, step) {
  var arr = []
  if (start > end) {
    return arr
  }
  for (var i = 0; start + i * step <= end; i++) {
    var value = start + step * i
    if (value < 0) {
      continue
    }
    arr[i] = value
  }
  return arr
}

Component({
  properties: {
    key: {
      type: String,
      value: '',
    },
    range: {
      type: Array,
      value: [],
    },
    default: {
      type: Number,
      value: null,
    },
    unit: {
      type: String,
      value: '',
    },
  },
  data: {
    years: [],
    year: null,
    value: [1],
  },
  methods: {
    bindChange: function (e) {
      const val = e.detail.value
      this.setData({
        year: this.data.years[val[0]],
      })
      this.triggerEvent('pickerchange', { key: this.data.key, value: this.data.years[val[0]] }, {})
    },
    ranges() {
      // picker属性范围

      let list = []
      let range = this.data.range

      for (var i = 0; 3 * i < range.length; i++) {
        list = list.concat(settingArrData(range[3 * i], range[3 * i + 1], range[3 * i + 2]))
      }
      return list
    },
    getDefaultIndex(ranges) {
      return [ranges.indexOf(this.data.default)]
    },
  },
  attached: function () {
    // 在组件实例进入页面节点树时执行
    // console.log('attached')
    let ranges = this.ranges()
    this.setData(
      {
        year: this.data.default,
        years: ranges,
      },
      () => {
        this.setData({
          value: this.getDefaultIndex(ranges),
        })
      }
    )
  },
  moved() {
    console.log('moved')
  },
  detached: function () {
    // 在组件实例被从页面节点树移除时执行
    console.log('detached')
  },
})
