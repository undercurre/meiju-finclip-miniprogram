// plugin/component/c-popup/popup.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多 slot 支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    show: { // 外部传入显示隐藏指令
      value: false,
      type: Boolean
    },
    zindex: { // 层级，用于多弹出时可自定义层级显示
      value: 99,
      type: Number
    },
    boxheight: { // 自定义高度
      value: '548rpx',
      type: String
    },
    background: { // box背景颜色
      value: 'rgba(0,0,0,0)',
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    height: 2000,
    animationData: {},
    isShow: false,
    showdom: false
  },

  observers: {
    show: function () {
      if (this.properties.show) {
        this.setData({height: wx.getSystemInfoSync().windowHeight})
        console.log('popup height', wx.getSystemInfoSync())
        this.triggerEvent('beforeenter')
        this.setData({isShow: true})
        this.showpopup()
      } else {
        this.hidepopup()
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onlayer () {
      this.hidepopup()
      this.triggerEvent('layerClose')
    },
    showpopup () {
      let that = this
      let animation = wx.createAnimation({
        duration: 150,
        timingFunction: 'ease'
      })
      animation.translateY(1000).step()
      that.setData({
        animationData: animation.export(),
        showdom: true
      })
      setTimeout(() => {
        animation.translateY(0).step()
        that.setData({
          animationData: animation.export()
        })
      }, 100)
    },
    hidepopup () {
      let that = this
      let animation = wx.createAnimation({
        duration: 100,
        timingFunction: 'ease'
      })
      animation.translateY(600).step()
      that.setData({
        animationData: animation.export()
      })
      setTimeout(() => {
        animation.translateY(0).step()
        that.setData({
          animationData: animation.export(),
          showdom: false,
          isShow: false
        })
      }, 100)
      this.triggerEvent('onAfterLeave')
    },
    stop () {}
  }
})
