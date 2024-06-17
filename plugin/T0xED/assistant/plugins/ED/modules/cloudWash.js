/**
 * 智能冲洗
 */
import consoleFunction from '../../../utils/console/console'
import platformOptions from '../../../platform/wechat/platformOptions'
const console = consoleFunction(platformOptions.platform)
let $this

export default {
  options: {
    // 初始化配置，确定该功能模块的特性
    module: 'cloudWash', // 功能名
    namespace: true,
  },
  states: {
    switch: 0,
    studyDays: 0,
    opAfterDays: 0,
    mode: 0,
    cloudWashDisable: false,
  },
  watch: {
    deviceStatus: function (nVal) {
      $this.cloudWashDisable = [0, 1].includes(this.statusNum)
    },
  },
  init: function () {
    $this = this.$cloudWash
    $this.initCloudWashAction()
  },
  methods: {
    initCloudWashAction() {
      this.initCloudAction({
        //获取云冲洗总开关与当前选中的模式
        cloudWashQuery: () => {
          return Promise.all([
            this.cloudRequest('ed', {
              msg: 'cloudWashSwitch',
              params: {
                applianceId: String(this.deviceInfo.applianceCode),
                action: 'get',
              },
            }),
            this.cloudRequest('ed', {
              msg: 'cloudWashMode',
              params: {
                applianceId: String(this.deviceInfo.applianceCode),
                action: 'get',
              },
            }),
          ]).then((res) => $this.updateCloudWash(res))
        },
      })
      this.initCloudActionWithTrack({
        //控制云冲洗总开关 switch: 1开 0关  oldCmd: 1旧指令 0新指令
        cloudWashSwitchOn: () => {
          return this.cloudRequest('ed', {
            msg: 'cloudWashSwitch',
            params: {
              action: 'set',
              applianceId: String(this.deviceInfo.applianceCode),
              oldCmd: this.deviceSetting.oldCtrl ? 1 : 0,
              switch: 1,
            },
          }).then(() => ($this.switch = 1))
        },
        cloudWashSwitchOff: () => {
          return this.cloudRequest('ed', {
            msg: 'cloudWashSwitch',
            params: {
              action: 'set',
              applianceId: String(this.deviceInfo.applianceCode),
              oldCmd: this.deviceSetting.oldCtrl ? 1 : 0,
              switch: 0,
            },
          }).then(() => ($this.switch = 0))
        },
        //选择当选模式 外部传入params包含 mode: 0AI冲洗  1自定义冲洗
        CloudWashModeAI: () => {
          return this.cloudRequest('ed', {
            msg: 'cloudWashMode',
            params: {
              action: 'set',
              applianceId: String(this.deviceInfo.applianceCode),
              mode: 0,
            },
          }).then(() => ($this.mode = 0))
        },
        CloudWashModeDF: () => {
          return this.cloudRequest('ed', {
            msg: 'cloudWashMode',
            params: {
              action: 'set',
              applianceId: String(this.deviceInfo.applianceCode),
              mode: 1,
            },
          }).then(() => ($this.mode = 1))
        },
      })
    },
    queryCloudWash() {
      this.cloudActions['cloudWashQuery']()
      this.createCloudQueryTimer('cloudWash', this.cloudActions['cloudWashQuery'], 10)
    },
    endCloudWashQuery() {
      this.clearCloudQueryTimer('cloudWash')
    },
    toggleSwitch() {
      return this.cloudActions[$this.switch == 1 ? 'cloudWashSwitchOff' : 'cloudWashSwitchOn']()
    },
    toggleMode() {
      return this.cloudActions[$this.mode == 1 ? 'CloudWashModeAI' : 'CloudWashModeDF']()
    },
    updateCloudWash(res = null) {
      if (res && res.length && res[0].retCode == 0 && res[1].retCode == 0) {
        $this.switch = res[0].result.switch
        $this.studyDays = res[0].result.studyDays
        $this.opAfterDays = res[0].result.opAfterDays
        $this.mode = res[1].result.mode
      }
    },
  },
}
