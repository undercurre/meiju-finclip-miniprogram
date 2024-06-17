/**
 * 微气泡开关
 */
import consoleFunction from '../../../utils/console/console'
import platformOptions from '../../../platform/wechat/platformOptions'
const console = consoleFunction(platformOptions.platform)
let $this

export default {
  options: {
    // 初始化配置，确定该功能模块的特性
    module: 'bubble', // 功能名
    namespace: true,
  },
  states: {
    bubble: false,
    bubbleDisable: false,
  },
  watch: {
    deviceStatus: function (nVal) {
      $this.updateBubble(nVal)
    },
  },
  init: function () {
    $this = this.$bubble
    $this.initBubbleAction()
  },
  methods: {
    updateBubble(data) {
      $this.bubble = data.bubble && data.bubble == 'on' ? true : false
      $this.bubbleDisable = [0, 1].includes(this.statusNum)
    },
    toggleBubble() {
      if ($this.bubbleDisable) return
      this.control($this.bubble ? 'bubbleOff' : 'bubbleOn')()
    },
    initBubbleAction() {
      this.initCtrlAction({
        bubbleOn: {
          bubble: 'on',
        },
        bubbleOff: {
          bubble: 'off',
        },
      })
    },
  },
}
