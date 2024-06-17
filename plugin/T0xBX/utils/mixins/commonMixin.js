import {jumpTo, _openMiniProgram} from "../util"
const systemInfo = wx.getSystemInfoSync()

module.exports = Behavior({
  data: {
    rpx2pxRatio: systemInfo['screenWidth'] / 750,
    px2rpxRatio: 750 / systemInfo['screenWidth']
  },
  created() {
    // console.log('created commonMixin')
  },
  methods: {
    jumpTo,

    _openMiniProgram,

    getApp: () => {
      return getApp()
    },

    getTimestamp() {
      return new Date().getTime()
    },

    resetTimestamp(key = 'timestamp') {
      this[key] = this.getTimestamp()
    },

    getTime(key = 'timestamp') {
      const timestamp = this.getTimestamp()
      const t = timestamp - this[key]
      this[key] = timestamp
      return t
    }
  }
})