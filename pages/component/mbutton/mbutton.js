Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    buttonData: {
      type: Object,
      value: function () {
        return {}
      },
    },
    mainImgSize: {
      type: String,
      value: '',
    },
    hasCover: {
      type: Boolean,
      value: true,
    },
    disabled: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    // 这里是一些组件内部数据
    showCover: false,
  },
  methods: {
    buttonTap() {
      if (this.properties.disabled) return false
      this.triggerEvent('buttonTap')
    },
    touchStart() {
      if (this.properties.disabled) return false
      if (this.data.hasCover) {
        this.setData({
          showCover: true,
        })
      }
    },
    touchEnd() {
      this.setData({
        showCover: false,
      })
    },
  },
})
