// plugin/T0xFB/component/media-notice-bar/media-notice-bar.js
import { imageApi } from '../../assets/scripts/api'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    content: String,
    type: {
      type: String,
      value: 'error',
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
      value: imageApi.getImagePath.url + '/0xFB/icon-error.png',
    },
    closeIcon: {
      type: String,
      value: imageApi.getImagePath.url + '/0xFB/icon-close.png',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    isInit: false,
    isDisplay: false,
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'], //顶部状态栏的高度
    duration: 300,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    show() {
      let icon = imageApi.getImagePath.url + '/0xFB/icon-error.png'
      let closeIcon = imageApi.getImagePath.url + '/0xFB/icon-close.png'
      switch (this.data.type) {
        case 'warn':
          icon = imageApi.getImagePath.url + '/0xFB/icon-warn.png'
          break
        case 'error':
          icon = imageApi.getImagePath.url + '/0xFB/icon-error.png'
          closeIcon = imageApi.getImagePath.url + '/0xFB/icon-close.png'
          break
      }
      this.setData({
        icon,
        closeIcon,
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
