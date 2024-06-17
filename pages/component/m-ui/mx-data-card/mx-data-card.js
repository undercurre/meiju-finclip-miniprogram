// m-ui/mx-data-card/mx-data-card.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: Number,
      value: 0,
    },
    // 单位
    unit: {
      type: String,
      value: '',
    },
    // 下方描述文案
    describe: {
      type: String,
      value: '',
    },
    //是否使用插槽，使用插槽会加高卡片
    useSlot: {
      type: Boolean,
      value: false,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    decreaseIcon: '../assets/icon/data-card/card_ic_-@3x.png', //minus
    increaseIcon: '../assets/icon/data-card/card_ic_+@3x.png', //plus
  },

  /**
   * 组件的方法列表
   */
  methods: {
    decrease() {
      let { value } = this.data
      // console.log("value", value)
      this.triggerEvent('onDecrease', { value }, {})
    },
    increase() {
      let { value } = this.data
      // console.log("value", value)
      this.triggerEvent('onIncrease', { value }, {})
    },
  },
})
