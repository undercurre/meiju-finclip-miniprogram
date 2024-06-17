Component({
  behaviors: [],
  // 属性定义（详情参见下文）
  properties: {
    myProperty: {
      // 属性名
      type: String,
      value: '',
    },
    isShowToast: {
      type: Boolean,
      value: false,
      observer(newVal) {
        if (newVal) {
          this.opacity()
        } else {
          this.opacity1()
        }
      },
    },
    duration: {
      type: String,
      value: 4000,
    },
    props: {
      type: Object,
      value: {
        // text: '文案可以自定'
      },
    },
    myProperty2: String, // 简化的定义方式
  },
  // observers: {
  //   isShowToast(val) {
  //     if(val) {
  //       setTimeout(() => {
  //         this.triggerEvent('actionToastClose')
  //       },this.properties.duration)
  //     }
  //   }
  // },
  data: {
    isShowToast1: false,
  }, // 私有数据，可用于模板渲染

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {},
    moved: function () {},
    detached: function () {},
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () {}, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function () {
    this.animation = wx.createAnimation()
  },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {},
    hide: function () {},
    resize: function () {},
  },
  methods: {
    actionToastClose() {},
    opacity() {
      this.animation.opacity(0).step()
      this.setData({ animation: this.animation.export() })
      this.setData({
        isShowToast1: true,
      })
      this.animation.opacity(1).step()
      this.setData({ animation: this.animation.export() })
      console.log('关闭')
      setTimeout(() => {
        this.animation.opacity(0).step()
        this.setData({ animation: this.animation.export() })
        this.triggerEvent('actionToastClose')
      }, this.properties.duration)
    },
    opacity1() {
      this.animation.opacity(0).step()
      this.setData({ animation: this.animation.export() })
      this.setData({
        isShowToast1: false,
      })
      this.animation.opacity(1).step()
      this.setData({ animation: this.animation.export() })
    },
  },
})
