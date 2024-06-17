/**
 * 定量设置
 */
import consoleFunction from '../../../utils/console/console'
import platformOptions from '../../../platform/wechat/platformOptions'
const console = consoleFunction(platformOptions.platform)
let $this

export default {
  options: {
    // 初始化配置，确定该功能模块的特性
    module: 'quantifySet', // 功能名
    namespace: true,
  },
  states: {
    quantifySetDisable: false,
  },
  watch: {
    deviceStatus: function (nVal) {
      $this.updateQuantifySet(nVal)
    },
  },
  init: function () {
    $this = this.$quantifySet
    $this.initQuantifySetAction()
  },
  methods: {
    updateQuantifySet(data) {
      $this.quantifySetDisable = [0, 1].includes(this.statusNum)
    },
    setQuantify(params) {
      if ($this.quantifySetDisable) return
      this.control('setQuantify')(params)
    },
    initQuantifySetAction() {
      this.initCtrlAction({
        setQuantify: (params) => {
          let finalParams = Object.assign({}, params)
          delete finalParams.widget_name
          delete finalParams.ext_info
          return {
            ...finalParams,
          }
        },
      })
    },
  },
}
