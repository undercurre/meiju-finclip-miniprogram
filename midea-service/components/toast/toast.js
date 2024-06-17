Component({
  /**
   * 组件的属性列表
   */
  properties: {
    text: {
      type: String,
      value: '',
      observer: function (val) {
        this.setData({
          text: val,
        })
      },
      // default: []
    },
    show: {
      type: Boolean,
      value: false,
      observer: function (val) {
        if (val) {
          setTimeout(() => {
            this.setData({
              show: false,
            })
          }, 2000)
        }
      },
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    text: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {},
})
