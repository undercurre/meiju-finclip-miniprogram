/**
 * 高温杀菌开关
 */
import consoleFunction from '../../../utils/console/console'
import platformOptions from '../../../platform/wechat/platformOptions'
const console = consoleFunction(platformOptions.platform)
let $this

export default {
  options: {
    // 初始化配置，确定该功能模块的特性
    module: 'germicidal', // 功能名
    namespace: true,
  },
  states: {
    germicidal: false,
    germicidalDisable: false,
  },
  watch: {
    deviceStatus: function (nVal) {
      $this.updateGermicidal(nVal)
    },
  },
  init: function () {
    $this = this.$germicidal
    $this.initGermicidalAction()
  },
  methods: {
    updateGermicidal(data) {
      $this.germicidal = data.germicidal && data.germicidal == 'on' ? true : false
      $this.germicidalDisable = [0, 1].includes(this.statusNum)
    },
    toggleGermicidal() {
      if ($this.germicidalDisable) return
      this.control($this.germicidal ? 'germicidalOff' : 'germicidalOn')()
    },
    initGermicidalAction() {
      this.initCtrlAction({
        germicidalOn: {
          germicidal: 'on',
        },
        germicidalOff: {
          germicidal: 'off',
        },
      })
    },
  },
}
