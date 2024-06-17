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
    module: 'tempSet', // 功能名
    namespace: true,
  },
  states: {
    tempSetDisable: false,
  },
  watch: {
    deviceStatus: function (nVal) {
      $this.updateTempSet(nVal)
    },
  },
  init: function () {
    $this = this.$tempSet
    $this.initTempSetAction()
  },
  methods: {
    updateTempSet(data) {
      $this.tempSetDisable = [0, 1].includes(this.statusNum)
    },
    setTemp(params) {
      if ($this.tempSetDisable) return
      this.control('setTemp')(params)
    },
    initTempSetAction() {
      this.initCtrlAction({
        setTemp: (params) => {
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
