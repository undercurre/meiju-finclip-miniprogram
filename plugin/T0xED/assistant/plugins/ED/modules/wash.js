/**
 * 冲洗开关
 */
import consoleFunction from '../../../utils/console/console'
import platformOptions from '../../../platform/wechat/platformOptions'
const console = consoleFunction(platformOptions.platform)
let $this

export default {
  options: {
    // 初始化配置，确定该功能模块的特性
    module: 'wash', // 功能名
    namespace: true,
  },
  states: {
    wash: false,
    washDisable: false,
  },
  watch: {
    deviceStatus: function (nVal) {
      $this.updateWash(nVal)
    },
  },
  init: function () {
    $this = this.$wash
    $this.initWashAction()
  },
  methods: {
    updateWash(data) {
      $this.wash = data.wash && data.wash == 'on' ? true : false
      $this.washDisable = [0, 1].includes(this.statusNum)
    },
    toggleWash() {
      if ($this.washDisable) return
      if (
        this.deviceSetting.awakeList &&
        this.deviceSetting.awakeList.indexOf('wash') !== -1 &&
        this.deviceStatus.sleep &&
        this.deviceStatus.sleep == 'on'
      ) {
        this.control($this.wash ? 'washOff' : 'washOn')({ sleep: 'off' })
      } else {
        this.control($this.wash ? 'washOff' : 'washOn')({})
      }
    },
    initWashAction() {
      this.initCtrlAction({
        washOn: (params) => {
          return {
            wash: 'on',
            ...params,
          }
        },
        washOff: (params) => {
          return {
            wash: 'off',
            ...params,
          }
        },
      })
    },
  },
}
