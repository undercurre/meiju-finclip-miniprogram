// m-ui/mx-footer/mx-footer.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // footer label
    label: {
      type: String,
      value: '',
    },
    hasArrow: {
      type: Boolean,
      value: false,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    arrowSrc: '../assets/icon/ic_more@2x.png',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    labelClicked() {
      this.triggerEvent('onLabelClicked', {}, {})
    },
  },
})
