import images from '../../assets/js/img'
import { openSubscribe } from '../../assets/js/openSubscribe.js'

import { getAssistant } from '../../assistant/platform/wechat/plugins/ED/index'
import assistantBehavior from '../../assistant/platform/wechat/ability/mixins/index'
let assistant = getAssistant()

Component({
  behaviors: [...assistantBehavior(assistant, ['$heat.heatDisable', '$heat.heat'], ['$heat.toggleHeat'])],
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
    title: {
      type: String,
      value: '',
    },
    desc: {
      type: String,
      value: '',
    },
  },
  data: {
    images,
  },
  methods: {
    onSwitchChange() {
      const { heat, heatDisable } = this.data
      if (heatDisable) return
      openSubscribe(
        assistant.deviceSetting.deviceKind < 4 ? 3 : assistant.deviceSetting.deviceKind,
        assistant.deviceInfo.name,
        assistant.deviceInfo.sn,
        assistant.deviceSetting.deviceKind < 4 ? 3 : assistant.deviceSetting.deviceKind,
        assistant.deviceInfo.sn8,
        assistant.deviceInfo.type,
        assistant.deviceInfo.applianceCode
      )
      let funcsett = assistant.deviceSetting.funcList.find((v) => v.key === 'Heat')
      if (assistant.deviceSetting.vacationFlag && assistant.deviceStatus.vacation == 'on') {
        wx.showToast({
          title: `${assistant.deviceSetting.vacationFlag}开启状态下，无法控制${funcsett.title}`,
        })
      } else {
        if (
          funcsett.standbyLimit &&
          (assistant.deviceStatus.standby_status == 'off' || assistant.deviceStatus.standby_status == 0)
        ) {
          if (
            funcsett.limitExceptKey &&
            assistant.deviceStatus[funcsett.limitExceptKey] === funcsett.limitExceptValue
          ) {
            if (funcsett.confirm) {
              //是否二次确认标识
              wx.showModal({
                title: '提示',
                content: funcsett.limitExceptText,
                success: (res) => {
                  if (res.confirm) this.toggleHeat()
                },
              })
            } else {
              this.toggleHeat()
            }
          } else {
            wx.showToast({
              title: `非待机状态下，无法控制${funcsett.title}`,
              icon: 'none',
            })
          }
        } else if (funcsett.powerLimit && assistant.deviceStatus.power && assistant.deviceStatus.power == 'off') {
          wx.showToast({ title: `关机状态下，无法控制${funcsett.title}` })
        } else {
          if (funcsett.confirm) {
            //是否二次确认标识
            wx.showModal({
              title: '提示',
              content: `是否${heat ? '关闭' : '开启'}${funcsett.title}？`,
              success: (res) => {
                if (res.confirm) this.toggleHeat()
              },
            })
          } else {
            this.toggleHeat()
          }
        }
      }
    },
  },
})
