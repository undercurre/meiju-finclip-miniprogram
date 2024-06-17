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
    module: 'germicidalTips', // 功能名
    namespace: true,
  },
  states: {
    germicidalTips: false,
    germicidalTipsDisable: false,
    germicidalTipsDays: 7,
    germicidalCountdown: '',
  },
  watch: {
    deviceStatus: function (nVal) {
      $this.updateGermicidalTips(nVal)
    },
  },
  init: function () {
    $this = this.$germicidalTips
    $this.initGermicidalTipsAction()
  },
  methods: {
    updateGermicidalTips(data) {
      $this.germicidalTips = data.set_germicidal_countdown && data.set_germicidal_countdown == 'on' ? true : false
      $this.germicidalTipsDays = data.set_germicidal_countdown_days ? data.set_germicidal_countdown_days : 7
      $this.germicidalCountdown =
        data.set_germicidal_countdown && data.set_germicidal_countdown == 'on'
          ? `预计剩余天数 ${data.germicidal_countdown} 天`
          : ''
      $this.germicidalTipsDisable = [0, 1].includes(this.statusNum)
    },
    toggleGermicidalTips() {
      if ($this.germicidalTipsDisable) return
      this.control($this.germicidalTips ? 'germicidalTipsOff' : 'germicidalTipsOn')({ days: $this.germicidalTipsDays })
    },
    initGermicidalTipsAction() {
      this.initCtrlAction({
        germicidalTipsOn: (params) => {
          return {
            set_germicidal_countdown: 'on',
            set_germicidal_countdown_days: params.days,
          }
        },
        germicidalTipsOff: (params) => {
          return {
            set_germicidal_countdown: 'off',
            set_germicidal_countdown_days: params.days,
          }
        },
      })
    },
  },
}
