// plugin/T0xBX/assets/component/switch-option/switch-option.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    key: {
      type: String,
      value: ''
    },
    icon: {
      type: String,
      value: ''
    },
    label: {
      type: String,
      value: ''
    },
    unit: {
      type: String,
      value: ''
    },
    mapValues: {
      type: Array,
      value: []
    },
    value: {
      type: Number | String,
      value: null
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isValueInt: true,
    min: 0,
    max: 0,
    step: 0,
    _value: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    sliderChange(e) {
      const {value} = e.detail
      this.setData({
        _value: value
      })
      const {key, isValueInt} = this.data
      this.triggerEvent('sliderChange', {key, value: isValueInt ? value : this.data.mapValues[value].value})
    },

    init() {
      const {mapValues, value} = this.data

      if(typeof value !== 'number') {
        this.data.isValueInt = false
      }

      const {isValueInt} = this.data

      let _value = isValueInt ? value : this.filterIndex(mapValues, value)
      const len = mapValues.length
      const min = isValueInt ? mapValues[0].value : 0
      const max = isValueInt ? mapValues[len - 1].value : len - 1
      const step = isValueInt ? (max - min)/(len - 1) : 1
      this.setData({
        _value,
        min,
        max,
        step
      })
    },

    filterIndex(mapValues, value) {
      for(let i in mapValues) {
        if(mapValues[i].value === value) {
          return i
        }
      }

      return null
    }
  },

  attached() {
    this.init()
  }
})
