import images from '../../assets/js/img'
import { openSubscribe } from '../../assets/js/openSubscribe.js'

import { getAssistant } from '../../assistant/platform/wechat/plugins/ED/index'
import assistantBehavior from '../../assistant/platform/wechat/ability/mixins/index'
let assistant = getAssistant()

Component({
  behaviors: [...assistantBehavior(assistant, ['$bubble.bubbleDisable', '$bubble.bubble'], ['$bubble.toggleBubble'])],
  properties: {
    title: {
      type: String,
      value: '',
    },
  },
  data: {
    images,
  },
  methods: {
    onSwitchChange() {
      const { bubble, bubbleDisable } = this.data
      if (bubbleDisable) return
      let ctrlsett = assistant.deviceSetting.ctrlList.find((v) => v.key === 'Bubble')
      openSubscribe(
        assistant.deviceSetting.deviceKind < 4 ? 3 : assistant.deviceSetting.deviceKind,
        assistant.deviceInfo.name,
        assistant.deviceInfo.sn,
        assistant.deviceSetting.deviceKind < 4 ? 3 : assistant.deviceSetting.deviceKind,
        assistant.deviceInfo.sn8,
        assistant.deviceInfo.type,
        assistant.deviceInfo.applianceCode
      )
      if (
        ctrlsett.standbyLimit &&
        (assistant.deviceStatus.standby_status == 'off' || assistant.deviceStatus.standby_status == 0)
      ) {
        if (ctrlsett.limitExceptKey && assistant.deviceStatus[ctrlsett.limitExceptKey] === ctrlsett.limitExceptValue) {
          if (ctrlsett.confirm) {
            //是否二次确认标识
            wx.showModal({
              title: '提示',
              content: ctrlsett.limitExceptText,
              success: (res) => {
                if (res.confirm) this.toggleBubble()
              },
            })
          } else {
            this.toggleBubble()
          }
        } else {
          wx.showToast({
            title: `非待机状态下，无法控制${ctrlsett.title}`,
            icon: 'none',
          })
        }
      } else if (ctrlsett.powerLimit && assistant.deviceStatus.power && assistant.deviceStatus.power == 'off') {
        wx.showToast({ title: `关机状态下，无法控制${ctrlsett.title}`, icon: 'none' })
      } else {
        if (ctrlsett.confirm) {
          //是否二次确认标识
          wx.showModal({
            title: '提示',
            content: `是否${bubble ? '关闭' : '开启'}${ctrlsett.title}？`,
            success: (res) => {
              if (res.confirm) this.toggleBubble()
            },
          })
        } else {
          this.toggleBubble()
        }
      }
    },
  },
})
