/**
 * 微信相关公共模块
 */
import actionMaper from '../api/index'
import consoleFunction from '../../../utils/console/console'
import platformOptions from '../platformOptions'
const console = consoleFunction(platformOptions.platform)
import { isFunction } from '../../../utils/tools/tools'

export default {
  options: {
    module: 'weixin',
  },
  states: {
    pageTracks: [],
    destroyAllTimer: 0,
  },
  watch: {
    deviceInfo: function (nV) {
      this.destroyAllTimer = 0
    },
  },
  init: function () {},
  methods: {
    destroyTimers() {
      this.destroyAllTimer = 1
    },
    showLoad(title = '加载中') {
      wx.showLoading({
        mask: true,
        title: title,
      })
    },
    hideLoad() {
      wx.hideLoading()
    },
    showToast(msg, duration = 3000) {
      wx.showToast({
        title: msg,
        icon: 'none',
        duration: duration,
      })
    },
    setPageTrack(trackParams) {
      this.pageTracks.push(trackParams)
      this.viewTrack(trackParams)
    },
    popPageTrack() {
      this.pageTracks.pop()
    },
    getTrackParam(trackKey, params) {
      let pageTrackParams = this.pageTracks[this.pageTracks.length - 1]
      let trackParams = isFunction(this.options.getTrackAction) ? this.options.getTrackAction(trackKey) : null
      if (trackParams) {
        if (isFunction(trackParams)) {
          return Object.assign({}, pageTrackParams, trackParams(params))
        }
        return Object.assign({}, pageTrackParams, trackParams)
      } else {
        return null
      }
    },
    viewTrack(option, method = null, custom = {}) {
      actionMaper(this.options.platform, 'buryAction')('user_page_view', method, option, custom)
    },
    actionTrack(option, method = null, custom = {}) {
      actionMaper(this.options.platform, 'buryAction')('user_behavior_event', method, option, custom)
    },
    deviceRequest(...args) {
      console('deviceRequest', this.deviceInfo)
      if (this.destroyAllTimer) return new Promise(() => {})
      return actionMaper(this.options.platform, 'deviceRequest')(this.deviceInfo.applianceCode)(...args)
    },
    cloudRequest(api, params) {
      if (this.destroyAllTimer) return new Promise(() => {})
      return actionMaper(this.options.platform, 'cloudRequest')()(api, params)
    },
  },
}
