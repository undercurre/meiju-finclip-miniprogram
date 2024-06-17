// m-ui/mx-bold-slider/mx-bold-slider.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 是否有slider
    hasMark: {
      type: Boolean,
      value: true,
    },
    min: {
      type: Number,
      value: 0,
    },
    max: {
      type: Number,
      value: 10,
    },
    value: {
      type: Number,
      value: 0,
    },
    blockColor: {
      type: String,
      value: '#FFFFFF',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    // min: 0,  // 最小限制
    // max:10,   // 最大限制
    // value:3, // 当前value
    // activeLen:(value-min)/(max-min)*100
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 拖动过程中触发的事件
    sliderchanging(e) {
      console.log('bold e sliderchange', e)
      // var value = e.detail.value;
      // this.setData({ value: value })
      let obj = e.detail
      this.triggerEvent('onSliderchanging', obj, {})
    },
    // 完成一次拖动后触发的事件
    sliderchange(e) {
      console.log('bold e sliderchange', e)
      // var value = e.detail.value;
      // this.setData({ value: value })
      let obj = e.detail
      this.triggerEvent('onSliderchange', obj, {})
    },
  },
})
