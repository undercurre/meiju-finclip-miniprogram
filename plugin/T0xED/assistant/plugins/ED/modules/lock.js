/**
 * 童锁开关
 */
import consoleFunction from '../../../utils/console/console'
import platformOptions from '../../../platform/wechat/platformOptions'
const console = consoleFunction(platformOptions.platform)
let $this

export default {
  options: {
    // 初始化配置，确定该功能模块的特性
    module: 'lock', // 功能名
    namespace: true,
  },
  states: {
    lock: false,
    lockDisable: false,
  },
  watch: {
    deviceStatus: function (nVal) {
      $this.updateLock(nVal)
    },
  },
  init: function () {
    $this = this.$lock
    $this.initLockAction()
  },
  methods: {
    updateLock(data) {
      $this.lock = data.lock && data.lock == 'on' ? true : false
      $this.lockDisable = [0, 1].includes(this.statusNum)
    },
    toggleLock() {
      if ($this.lockDisable) return
      if (
        this.deviceSetting.awakeList &&
        this.deviceSetting.awakeList.indexOf('lock') !== -1 &&
        this.deviceStatus.sleep &&
        this.deviceStatus.sleep == 'on'
      ) {
        this.control($this.lock ? 'lockOff' : 'lockOn')({ sleep: 'off' })
      } else {
        this.control($this.lock ? 'lockOff' : 'lockOn')({})
      }
    },
    initLockAction() {
      this.initCtrlAction({
        lockOn: (params) => {
          return {
            lock: 'on',
            ...params,
          }
        },
        lockOff: (params) => {
          return {
            lock: 'off',
            ...params,
          }
        },
      })
    },
  },
}
