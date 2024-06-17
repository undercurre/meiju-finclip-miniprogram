// m-ui/m-mask/mask.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    bgColor: {
      type: String,
      value: 'black',
    },
    closable: {
      type: Boolean,
      value: false,
    },
    ZIndex: {
      type: Number,
      value: 999999,
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
    onclicked() {
      if (this.data.closable) {
        this.setData({
          show: false,
        })
      }
      this.triggerEvent('onMaskClicked')
    },
  },
})
