import computedBehavior from '../../../../utils/miniprogram-computed'
import images from '../../assets/js/img'
import { openSubscribe } from '../../assets/js/openSubscribe.js'

import { getAssistant } from '../../assistant/platform/wechat/plugins/ED/index'
import assistantBehavior from '../../assistant/platform/wechat/ability/mixins/index'
let assistant = getAssistant()

Component({
  behaviors: [
    computedBehavior,
    ...assistantBehavior(
      assistant,
      ['$cloudWash.switch', '$cloudWash.studyDays', '$cloudWash.mode', '$cloudWash.cloudWashDisable'],
      ['$cloudWash.queryCloudWash', '$cloudWash.endCloudWashQuery', '$cloudWash.toggleSwitch', '$cloudWash.toggleMode']
    ),
  ],
  properties: {
    cellStyle: {
      type: String,
      value: 'cell',
    },
    border: {
      type: Boolean,
      value: true,
    },
    iconColor: {
      type: String,
      value: '#7C879B',
    },
  },
  data: {
    images,
    title: 'AI冲洗',
  },
  computed: {
    checked() {
      if (this.data.switch == 1 && this.data.mode == 0) {
        return true
      } else {
        return false
      }
    },
    desc() {
      if (this.data.switch == 1 && this.data.mode == 0 && this.data.studyDays < 14) {
        return `距离AI冲洗生效还要${14 - this.data.studyDays}天`
      } else {
        return '每天首次用水前自动冲洗滤芯'
      }
    },
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      this.queryCloudWash()
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
      this.endCloudWashQuery()
    },
  },
  methods: {
    setCloudWash() {
      if (this.data.checked) {
        //当前开，则关闭总开关
        this.toggleSwitch()
      } else {
        //当前关
        if (this.data.switch == 0) {
          //总开关是关，则打开总开关
          this.toggleSwitch()
        }
        if (this.data.mode == 1) {
          //模式自定义，则改AI
          this.toggleMode()
        }
      }
    },
    onSwitchChange() {
      const { cloudWashDisable } = this.data
      if (cloudWashDisable) return
      openSubscribe(
        assistant.deviceSetting.deviceKind < 4 ? 3 : assistant.deviceSetting.deviceKind,
        assistant.deviceInfo.name,
        assistant.deviceInfo.sn,
        assistant.deviceSetting.deviceKind < 4 ? 3 : assistant.deviceSetting.deviceKind,
        assistant.deviceInfo.sn8,
        assistant.deviceInfo.type,
        assistant.deviceInfo.applianceCode
      )
      if (this.data.checked) {
        wx.showModal({
          title: 'AI冲洗有利于滤芯保养及维持过滤效果,不建议关闭',
          confirmText: '关闭',
          success: (res) => {
            if (res.confirm) {
              this.setCloudWash()
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          },
        })
      } else {
        this.setCloudWash()
      }
    },
  },
})
