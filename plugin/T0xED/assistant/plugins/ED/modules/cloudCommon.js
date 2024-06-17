/**
 * 云端请求公共模块
 */
import actionMaper from '../../../platform/index'
import consoleFunction from '../../../utils/console/console'
import platformOptions from '../../../platform/wechat/platformOptions'
const console = consoleFunction(platformOptions.platform)

export default {
  options: {
    module: 'cloudCommon',
  },
  states: {
    cloudActions: {},
    pollCloudActions: {},
  },
  init: function () {},
  methods: {
    createCloudQueryTimer(action, callback, duration = 20) {
      this.pollCloudActions[action] = setInterval(() => {
        if (this.destroyAllTimer) {
          this.clearCloudQueryTimer(action)
        }
        callback()
      }, duration * 1000)
    },
    clearCloudQueryTimer(action) {
      console(action, '云端定时器已被清除！')
      if (this.pollCloudActions[action]) clearInterval(this.pollCloudActions[action])
    },
    initCloudAction(actionObj) {
      this.cloudActions = {
        ...this.cloudActions,
        ...actionObj,
      }
    },
    // cloudRequest (api, params) {
    //   return actionMaper(this.options.platform, 'cloudRequest')()(api, params)
    // }
  },
}
