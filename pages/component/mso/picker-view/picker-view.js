Component({
  properties: {
    key: {
      type: String,
      value: '',
    },
    mapValues: {
      type: Array,
      value: [],
    },
    value: {
      type: Number | String,
      value: null,
    },
    unit: {
      type: String,
      value: '',
    },
  },
  data: {
    valueIndex: null,
  },
  methods: {
    bindChange: function (e) {
      const valueIndex = e.detail.value
      this.setData({
        valueIndex,
      })
      this.triggerEvent('pickerChange', { key: this.data.key, value: this.data.mapValues[valueIndex[0]]['value'] })
    },
    setValueIndex() {
      let valueIndex = null
      for (let index in this.data.mapValues) {
        if (this.data.mapValues[index].value === this.data.value) {
          valueIndex = index
        }
      }
      this.setData({
        valueIndex: [valueIndex],
      })
    },
  },
  attached: function () {
    // 在组件实例进入页面节点树时执行
    this.setValueIndex()
  },
  moved() {
    console.log('moved')
  },
  detached: function () {
    // 在组件实例被从页面节点树移除时执行
    console.log('detached')
  },
})
