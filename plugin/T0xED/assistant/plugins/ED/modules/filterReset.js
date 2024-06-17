/**
 * 滤芯复位
 */
import consoleFunction from '../../../utils/console/console'
import platformOptions from '../../../platform/wechat/platformOptions'
const console = consoleFunction(platformOptions.platform)
let $this

export default {
  options: {
    // 初始化配置，确定该功能模块的特性
    module: 'filterReset', // 功能名
    namespace: true,
  },
  states: {
    filterResetDisable: false,
  },
  watch: {
    deviceStatus: function (nVal) {
      $this.updateFilterReset(nVal)
    },
  },
  init: function () {
    $this = this.$filterReset
    $this.initFilterResetAction()
  },
  methods: {
    updateFilterReset(data) {
      $this.filterResetDisable = [0, 1].includes(this.statusNum)
    },
    setFilterReset(params) {
      if ($this.filterResetDisable) return
      this.control(this.deviceSetting.oldCtrl && this.deviceInfo.sn8 !== '632A1790' ? `resetOld` : `resetNew`)(params)
    },
    initFilterResetAction() {
      this.initCtrlAction({
        resetOld: (params) => {
          return {
            [`reset_filter_${params.index}`]: 'on',
          }
        },
        resetNew: (params) => {
          return {
            [`life_${params.index}`]: 100,
          }
        },
      })
    },
  },
}
