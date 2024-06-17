/**
 * 高温杀菌提醒开关
 */
import consoleFunction from '../../../utils/console/console'
import platformOptions from '../../../platform/wechat/platformOptions'
const console = consoleFunction(platformOptions.platform)
let $this

export default {
  options: {
    // 初始化配置，确定该功能模块的特性
    module: 'heat', // 功能名
    namespace: true,
  },
  states: {
    heat: false,
    heatDisable: false,
  },
  watch: {
    deviceStatus: function (nVal) {
      $this.updateHeat(nVal)
    },
  },
  init: function () {
    $this = this.$heat
    $this.initHeatAction()
  },
  methods: {
    updateHeat(data) {
      $this.heat = data.heat && data.heat == 'on' ? true : false
      $this.heatDisable = [0, 1].includes(this.statusNum)
    },
    toggleHeat() {
      if ($this.heatDisable) return
      this.control($this.heat ? 'heatOff' : 'heatOn')()
    },
    initHeatAction() {
      this.initCtrlAction({
        heatOn: {
          heat: 'on',
        },
        heatOff: {
          heat: 'off',
        },
      })
    },
  },
}
