import { getMapValues } from '../../../utils/util'

Component({
  properties: {
    key: {
      type: String,
      value: '',
    },
    range: {
      type: Array,
      value: []
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
    list: [],
    valueIndex: null,
  },
  observers: {
    'range': function (val) {
      this.setData({
        list: this._getMapValues()
      })
    },
    'mapValues': function (val) {
      if (val.length) {
        this.setData({
          list: val.concat()
        })
      }
    }
  },
  methods: {
    init() {
      this.initList()
    },
    initList() {
      this.setData({
        list: this._getMapValues()
      }, () => {
        this.setValueIndex()
      })
    },
    bindChange: function (e) {
      const valueIndex = e.detail.value
      this.setData({
        valueIndex,
      })
      this.triggerEvent('pickerChange', {
        key: this.data.key,
        value: this.data.list[valueIndex[0]]['value']
      })
    },
    setValueIndex() {
      let valueIndex = null
      for (let index in this.data.list) {
        if (this.data.list[index].value === this.data.value) {
          valueIndex = index
        }
      }
      this.setData({
        valueIndex: [valueIndex],
      })
    },
    _getMapValues() {
      const {
        range,
        mapValues,
        value
      } = this.data

      return getMapValues(range, mapValues, value)
    }
  },
  attached: function () {
    // 在组件实例进入页面节点树时执行
    this.init()
  },
  moved() {
    console.log('moved')
  },
  detached: function () {
    // 在组件实例被从页面节点树移除时执行
    console.log('detached')
  },
})
