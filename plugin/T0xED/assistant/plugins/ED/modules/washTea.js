/**
 * 洗茶开关
 */
import consoleFunction from '../../../utils/console/console'
import platformOptions from '../../../platform/wechat/platformOptions'
const console = consoleFunction(platformOptions.platform)
let $this

export default {
  options: {
    // 初始化配置，确定该功能模块的特性
    module: 'washTea', // 功能名
    namespace: true,
  },
  states: {
    washTea: false,
    washTeaDisable: false,
  },
  watch: {
    deviceStatus: function (nVal) {
      $this.updateWashTea(nVal)
    },
  },
  init: function () {
    $this = this.$washTea
    $this.initWashTeaAction()
  },
  methods: {
    updateWashTea(data) {
      $this.washTea = data.set_tea_washing && ['1', '2'].includes(data.set_tea_washing + '') ? true : false
      $this.washTeaDisable = [0, 1].includes(this.statusNum)
    },
    toggleWashTea() {
      if ($this.washTeaDisable) return
      this.control($this.washTea ? 'washTeaOff' : 'washTeaOn')({
        tea_washing_quantify: this.deviceStatus.tea_washing_quantify,
        tea_washing_time: this.deviceStatus.tea_washing_time,
      })
    },
    initWashTeaAction() {
      this.initCtrlAction({
        washTeaOn: (params) => {
          return {
            set_tea_washing: 'on',
            ...params,
          }
        },
        washTeaOff: (params) => {
          return {
            set_tea_washing: 'off',
            ...params,
          }
        },
      })
    },
  },
}
