import images from '../../assets/js/img'
import { openSubscribe } from '../../assets/js/openSubscribe.js'

import { getAssistant } from '../../assistant/platform/wechat/plugins/ED/index'
import assistantBehavior from '../../assistant/platform/wechat/ability/mixins/index'
let assistant = getAssistant()

Component({
  behaviors: [...assistantBehavior(assistant, ['$wash.washDisable', '$wash.wash'], ['$wash.toggleWash'])],
  properties: {
    title: {
      type: String,
      value: '',
    },
  },
  data: {
    images,
  },
  computed: {},
  observers: {},
  methods: {
    onSwitchChange() {
      const { wash, washDisable } = this.data
      if (washDisable) return
      let ctrlsett = assistant.deviceSetting.ctrlList.find((v) => v.key === 'Wash')
      openSubscribe(
        assistant.deviceSetting.deviceKind < 4 ? 3 : assistant.deviceSetting.deviceKind,
        assistant.deviceInfo.name,
        assistant.deviceInfo.sn,
        assistant.deviceSetting.deviceKind < 4 ? 3 : assistant.deviceSetting.deviceKind,
        assistant.deviceInfo.sn8,
        assistant.deviceInfo.type,
        assistant.deviceInfo.applianceCode
      )
      if (assistant.deviceSetting.vacationFlag && assistant.deviceStatus.vacation == 'on') {
        wx.showToast({
          title: `${assistant.deviceSetting.vacationFlag}开启状态下，无法进行${ctrlsett.title}`,
          icon: 'none',
          duration: 2000,
        })
      } else if (assistant.deviceStatus.filter == 'on') {
        wx.showToast({
          title: `制水过程中无法进行${ctrlsett.title}！`,
          icon: 'none',
          duration: 2000,
        })
      } else if (
        ctrlsett.standbyLimit &&
        (assistant.deviceStatus.standby_status == 'off' || assistant.deviceStatus.standby_status == 0)
      ) {
        if (ctrlsett.limitExceptKey && assistant.deviceStatus[ctrlsett.limitExceptKey] === ctrlsett.limitExceptValue) {
          if (ctrlsett.confirm) {
            //是否二次确认标识
            wx.showModal({
              title: ctrlsett.limitExceptText,
              content: '',
              success: (res) => {
                if (res.confirm) {
                  this.toggleWash()
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              },
            })
          } else {
            this.toggleWash()
          }
        } else {
          if (assistant.deviceSetting.stopcockTip) {
            //这里只有一种情况，定量出水完没关水龙头
            wx.showToast({
              title: assistant.deviceSetting.stopcockTip,
              icon: 'none',
              duration: 2000,
            })
          } else {
            wx.showToast({
              title: `非待机状态下，无法进行${ctrlsett.title}`,
              icon: 'none',
              duration: 2000,
            })
          }
        }
      } else if (ctrlsett.powerLimit && assistant.deviceStatus.power && assistant.deviceStatus.power == 'off') {
        wx.showToast({
          title: `关机状态下，无法进行${ctrlsett.title}`,
          icon: 'none',
          duration: 2000,
        })
      } else {
        if (ctrlsett.confirm) {
          //是否二次确认标识
          wx.showModal({
            title: `是否${wash ? '关闭' : '进行'}${ctrlsett.title}？`,
            content: wash
              ? ''
              : `超过一天未使用设备，建议冲洗滤芯，确保水质新鲜${
                  assistant.deviceSetting.washTip ? '；' + assistant.deviceSetting.washTip : ''
                }`,
            success: (res) => {
              if (res.confirm) {
                this.toggleWash()
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            },
          })
        } else {
          this.toggleWash()
        }
      }
    },
  },
})
