// m-ui/mx-smalllcard/mx-smalllcard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 可选值有nomal、mini
    type: {
      type: String,
      value: 'normal',
    },
    icon: {
      type: String,
      value: '',
    },
    label: {
      type: String,
      value: '',
    },
    describe: {
      type: String,
      value: '',
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
    cardClicked(e) {
      // console.log("cardClicked...e", e)
      let obj = e.currentTarget.dataset
      this.triggerEvent('onCardClicked', obj, {})
    },
  },
})
