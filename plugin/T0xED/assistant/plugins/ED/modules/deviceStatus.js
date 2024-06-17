/**
 * 设备状态模块
 */
// import actionMaper from '../../../platform/index'
import broadcastChannel from '../../../utils/channel/channel'

import consoleFunction from '../../../utils/console/console'
import platformOptions from '../../../platform/wechat/platformOptions'
const console = consoleFunction(platformOptions.platform)

import Transaction from '../../../utils/transaction/transaction'
let transaction = new Transaction()
let transactionCloud = new Transaction()

import { isFunction } from '../../../utils/tools/tools'

export default {
  options: {
    module: 'status',
  },
  states: {
    deviceStatus: {
      // power: 'off'
    },
    queryTimer: -1,
    updateStatusChannel: null,
    ctrlActions: {},
    ctrl: null,
  },
  watch: {
    deviceInfo: function (nV) {
      console('deviceInfo watch', this.deviceInfo, nV)
      this.pollQuery(true)
    },
  },
  init: function () {
    this.updateStatusChannel = broadcastChannel.create('updateStatus')

    let ctrlWrapper = {
      initialize: (options) => {
        console('ctrlWrapper initialize')
        this.showLoad()
        this.clearPollQuery()
        return options
      },
      close: (resultPromise) => {
        console('ctrlWrapper close')
        return resultPromise
          .then((res) => {
            console('control res: ', res, new Date())
          })
          .catch((err) => {
            console('contorl err: ', err)
          })
          .finally(() => {
            this.pollQuery(true)
          })
      },
    }
    let actionWrapper = {
      initialize: (options) => {
        console('actionWrapper initialize', options)
        if (options.trackKey) {
          let trackParams = this.getTrackParam(options.trackKey, options)
          console('actionWrapper initialize', trackParams)
          if (trackParams !== null) this.actionTrack(trackParams)
        }
        return options
      },
      close: (resultPromise) => {
        return resultPromise
      },
    }
    transaction.initWrappers([ctrlWrapper, actionWrapper])
    this.ctrl = transaction.perform((options) => {
      return this.deviceRequest('luaControl', {
        control: Object.assign({}, options.control),
      })
    })

    let cloudCtrlWrapper = {
      initialize: (options) => {
        console('cloudCtrlWrapper initialize')
        this.showLoad()
        return options
      },
      close: (resultPromise) => {
        console('cloudCtrlWrapper close')
        this.hideLoad()
        return resultPromise
      },
    }
    transactionCloud.initWrappers([cloudCtrlWrapper, actionWrapper])
    this.cloudCtrl = transactionCloud.perform((options) => {
      return options.action(options.options)
    })
  },
  methods: {
    pollQuery(update = false) {
      this.clearPollQuery()
      this.query(update)
      if (this.destroyAllTimer) {
        console('设备状态轮询已被清除！')
        return
      }
      this.queryTimer = setTimeout(this.pollQuery, this.options.pollTime || 6000)
    },
    clearPollQuery() {
      if (this.queryTimer) {
        clearTimeout(this.queryTimer)
      }
    },
    query(update = false) {
      return this.deviceRequest('luaGet', {
        query: {
          query_type: this.deviceSetting.deviceKind || 1,
        },
      })
        .then((res) => {
          this.hideLoad()
          console('query res: ', res, new Date())
          if (res.data && res.data.code == '0') {
            let result = Object.assign({}, this.deviceStatus, res.data.data, { offline: false })
            console('deviceStatus == ', JSON.stringify(this.deviceStatus || {}) == JSON.stringify(result))
            if (JSON.stringify(this.deviceStatus || {}) !== JSON.stringify(result) || update) {
              // 做一次判断，如果完全相同，则可以不重新赋值渲染全量变量
              this.deviceStatus = result
              this.updateStatusChannel.postMessage(this.deviceStatus)
            }
          }
        })
        .catch((err) => {
          if (err.data && err.data.code == 1307) {
            this.deviceStatus = Object.assign({}, this.deviceStatus, { offline: true })
          }
          console('query err: ', err)
        })
    },
    initCtrlAction(actionObj) {
      let keys = Object.keys(actionObj)
      keys.forEach((key) => {
        if (isFunction(actionObj[key])) {
          console('initCtrlAction', key)
          this.ctrlActions[key] = (...args) => this.controlFunc(actionObj[key](...args), key, ...args)
        } else {
          this.ctrlActions[key] = () => this.controlFunc(actionObj[key], key)
        }
      })
    },
    control(action) {
      return this.ctrlActions[action]
    },
    controlFunc(control, trackKey, options = null) {
      console('controlFunc', control)
      this.ctrl({ control, trackKey, options })
    },
    initCloudActionWithTrack(actionObj) {
      let keys = Object.keys(actionObj)
      keys.forEach((key) => {
        if (isFunction(actionObj[key])) {
          this.cloudActions[key] = (...args) => this.cloudCtrlFunc(actionObj[key], key, ...args)
        }
      })
    },
    cloudCtrlFunc(action, trackKey, options = null) {
      this.cloudCtrl({ action, trackKey, options })
    },
  },
}
