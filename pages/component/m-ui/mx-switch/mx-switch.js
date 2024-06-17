Component({
  behaviors: [],
  externalClasses: ['inner-class'],
  // 属性定义（详情参见下文）
  properties: {
    checked: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal) {
        // console.log("newVal",newVal)
        // 属性值变化时执行
        // 首次执行并且为false时不触发observer, 否则首次赋值为false也会执行动画和逻辑
        if (this.data.isFirst && !newVal) {
          if (!this.animation) {
            this.animation = wx.createAnimation()
          }
          this.startAnimation(newVal)
          this.setData({
            checkedFlag: newVal,
          })
        } else {
          this.setData({
            isFirst: false,
          })
          if (!this.animation) {
            this.animation = wx.createAnimation()
          }
          this.startAnimation(newVal)
          this.setData({
            checkedFlag: newVal,
          })
        }
      },
    },
    color: {
      type: String,
      value: '#267aff',
    },
    disabled: {
      type: Boolean,
      value: false,
    },
  },
  observers: {
    // 'checked'(newVal){
    //   if(!this.animation){
    //     this.animation = wx.createAnimation()
    //   }
    //   this.startAnimation(newVal)
    //   this.setData({
    //     checkedFlag: newVal
    //   })
    // }
  },
  ready: function () {
    this.animation = wx.createAnimation()
  },
  data: {
    checkedFlag: false,
    isFirst: true,
  },

  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      this.setData({
        isFirst: true,
      })
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  methods: {
    startAnimation() {
      let { checkedFlag } = this.data
      // console.log("checkedFlag:", checkedFlag)

      if (!checkedFlag) {
        this.animation.scale(1.8, 1.8).translateX('29rpx').step()
      } else {
        this.animation.scale(1, 1).translateX('0').step()
      }
      this.setData({
        checkedFlag: !checkedFlag,
      })
      this.setData({ animation: this.animation.export() })
    },
    changeHandler() {
      // detail对象，提供给事件监听函数
      this.startAnimation()
      let { checkedFlag } = this.data
      var myEventDetail = {
        value: checkedFlag,
      }
      var myEventOption = {} // 触发事件的选项
      // 过渡完毕后获取到值
      // setTimeout(() => {
      this.triggerEvent('onSwitch', myEventDetail, myEventOption)
      // }, 60);
    },
  },
})
