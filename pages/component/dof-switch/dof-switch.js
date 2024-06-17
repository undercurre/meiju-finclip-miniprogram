Component({
  behaviors: [],
  externalClasses: ['inner-class'],
  // 属性定义（详情参见下文）
  properties: {
    checked: {
      type: Boolean,
      value: false,
    },
  },
  observers: {
    checked(newVal) {
      if (!this.animation) {
        this.animation = wx.createAnimation()
      }
      this.startAnimation(newVal)
    },
  },
  ready: function () {
    this.animation = wx.createAnimation()
  },
  data: {
    checkedFlag: false,
  },
  methods: {
    startAnimation(newVal) {
      this.setData({
        checkedFlag: newVal,
      })
      if (newVal) {
        this.animation.scale(2, 2).translateX('24rpx').step()
      } else {
        this.animation.scale(1, 1).translateX('0').step()
      }
      this.setData({ animation: this.animation.export() })
    },
    changeHandler() {
      this.triggerEvent('dofSwitchChanged')
    },
  },
})
