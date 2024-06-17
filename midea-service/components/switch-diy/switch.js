Component({
  properties: {
    isClicked: {
      type: Boolean,
      value: false,
    },
  },
  observers: {
    isClicked: function (newVal, oldval) {
      console.log(newVal, oldval)
      if (!this.animation) {
        this.animation = wx.createAnimation({
          duration: 400,
          timingFunction: 'linear',
          delay: 0,
        })
      }
      if (newVal == true) {
        this.animation.translate(22).scale(2.25).step()
        this.setData({
          animationData: this.animation.export(),
        })
      } else {
        this.animation.translate(0).scale(1).step()
        this.setData({
          animationData: this.animation.export(),
        })
      }
    },
  },
  data: {
    animationData: {},
  },
  methods: {
    click() {
      this.triggerEvent('toChange')
    },
  },
  /*组件生命周期*/
  lifetimes: {
    created() {},
    attached() {},
    ready() {
      this.animation = wx.createAnimation()
    },
    moved() {},
    detached() {},
    error() {},
    /*组件所在页面的生命周期 */
    pageLifetimes: {
      show: function () {
        // 页面被展示
        console.log('页面被展示')
      },
      hide: function () {
        // 页面被隐藏
        console.log('页面被隐藏')
      },
      resize: function () {
        // 页面尺寸变化
        console.log('页面尺寸变化')
      },
    },
  },
})
