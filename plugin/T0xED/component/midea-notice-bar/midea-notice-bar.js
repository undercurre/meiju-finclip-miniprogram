const app = getApp()
import images from '../../assets/js/img'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    content: String,
    type: {
      type: String,
      value: 'error',
      observer: function (newValue) {
        this.initType(newValue)
      },
    },
    hasCloseBtn: {
      type: Boolean,
      value: true,
    },
    isShow: {
      type: Boolean,
      observer: function (newValue) {
        if (newValue) {
          this.show()
        } else {
          this.close()
        }
      },
    },
    icon: {
      type: String,
      value: images.iconError,
    },
    closeIcon: {
      type: String,
      value: images.iconCloseRed,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    isInit: false,
    isDisplay: false,
    statusNavBarHeight: app.globalData.statusNavBarHeight, //状态栏高 + 标题栏高
    duration: 300,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initType(type) {
      let icon = images.iconError
      let closeIcon = images.iconCloseRed
      switch (type) {
        case 'warn':
          icon = images.iconWarn
          closeIcon = images.iconCloseYellow
          break
        case 'error':
          icon = images.iconError
          closeIcon = images.iconCloseRed
          break
      }
      this.setData({
        icon,
        closeIcon,
      })
    },
    show() {
      this.setData({
        isInit: true,
      })
      wx.nextTick(() => {
        this.setData({
          isDisplay: true,
        })
      })
    },
    close() {
      let bindModel = this.data
      this.setData({
        isDisplay: false,
      })
      setTimeout(() => {
        this.setData({
          isInit: false,
        })
        this.triggerEvent('onClose', bindModel, bindModel)
      }, this.data.duration)
    },
  },
})
