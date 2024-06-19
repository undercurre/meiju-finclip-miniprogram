// plugin/T0x32/component/device-status-bar/device-status-bar.js
import { imageDomain } from '../../assets/scripts/api'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: String,
      observer: function (newValue, oldValue) {
        let dotColor = ''
        switch (newValue) {
          case 'disabled':
            dotColor = '#666666'
            break
          case 'error':
            dotColor = '#FF3B30'
            break
          case 'warn':
            dotColor = '#25CF42'
            break
          default:
            dotColor = '#25CF42'
            break
        }
        this.setData({ dotColor })
      },
    },
    text: {
      type: String,
      default: '--',
    },
    enabledClick: {
      type: Boolean,
      default: false,
    },
    isShowInfo: {
      type: Boolean,
      default: false,
    },
    infoTitle: {
      type: String,
      default: '--',
    },
    infoDesc: {
      type: String,
      default: '--',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    dotColor: '#666666',
    iconUrl: {
      arrow: imageDomain + '/0x32/icon-arrow-right.png',
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClick() {
      if (!this.properties.enabledClick) return
      this.triggerEvent('onClick')
    },
  },
})
