// m-ui/m-slider/m-slider.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    min: {
      type: Number,
      value: 0,
    },
    max: {
      type: Number,
      value: 100,
    },
    value: {
      type: Number,
      value: 0,
    },
    blockColor: {
      type: String,
      value: '#267AFF',
    },

    showValue: {
      type: Boolean,
      value: false,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    sliderChange(e) {
      console.log('sliderChange...e', e)
      let obj = e.detail
      this.triggerEvent('onSliderChange', obj, {})
    },
  },
})
