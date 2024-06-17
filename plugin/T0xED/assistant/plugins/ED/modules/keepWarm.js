/**
 * 保温、保温时间
 */
import consoleFunction from '../../../utils/console/console'
import platformOptions from '../../../platform/wechat/platformOptions'
const console = consoleFunction(platformOptions.platform)
let $this

export default {
  options: {
    // 初始化配置，确定该功能模块的特性
    module: 'keepWarm', // 功能名
    namespace: true,
  },
  states: {
    keepWarm: false,
    keepWarmDisable: false,
  },
  watch: {
    deviceStatus: function (nVal) {
      $this.updateKeepWarm(nVal)
    },
  },
  init: function () {
    $this = this.$keepWarm
    $this.initKeepWarmAction()
  },
  methods: {
    updateKeepWarm(data) {
      $this.keepWarm =
        (data.keep_warm && data.keep_warm == 'on') || (data.keep_warm_2 && data.keep_warm_2 == 'on') ? true : false
      $this.keepWarmDisable = [0, 1].includes(this.statusNum)
    },
    toggleKeepWarm() {
      if ($this.keepWarmDisable) return
      if (
        this.deviceSetting.awakeList &&
        this.deviceSetting.awakeList.indexOf('keep_warm') !== -1 &&
        this.deviceStatus.sleep &&
        this.deviceStatus.sleep == 'on'
      ) {
        this.control($this.keepWarm ? 'keepWarmOff' : 'keepWarmOn')({
          keep_warm_time: this.deviceStatus.keep_warm_time ? this.deviceStatus.keep_warm_time : 0,
          sleep: 'off',
        })
      } else {
        this.control($this.keepWarm ? 'keepWarmOff' : 'keepWarmOn')({
          keep_warm_time: this.deviceStatus.keep_warm_time ? this.deviceStatus.keep_warm_time : 0,
        })
      }
    },
    setKeepWarmTime(keep_warm_time) {
      if ($this.keepWarmDisable) return
      if (
        this.deviceSetting.awakeList &&
        this.deviceSetting.awakeList.indexOf('keep_warm') !== -1 &&
        this.deviceStatus.sleep &&
        this.deviceStatus.sleep == 'on'
      ) {
        this.control('setKeepWarmTime')({
          keep_warm:
            this.deviceStatus.keep_warm && this.deviceStatus.keep_warm == 'on'
              ? 1
              : this.deviceStatus.keep_warm_2 && this.deviceStatus.keep_warm_2 == 'on'
              ? 2
              : 0,
          keep_warm_time: keep_warm_time,
          sleep: 'off',
        })
      } else {
        this.control('setKeepWarmTime')({
          keep_warm:
            this.deviceStatus.keep_warm && this.deviceStatus.keep_warm == 'on'
              ? 1
              : this.deviceStatus.keep_warm_2 && this.deviceStatus.keep_warm_2 == 'on'
              ? 2
              : 0,
          keep_warm_time: keep_warm_time,
        })
      }
    },
    initKeepWarmAction() {
      this.initCtrlAction({
        keepWarmOn: (params) => {
          return {
            keep_warm: 'on',
            ...params,
          }
        },
        keepWarmOff: (params) => {
          return {
            keep_warm: 'off',
            ...params,
          }
        },
        setKeepWarmTime: (params) => {
          return {
            ...params,
          }
        },
      })
    },
  },
}
