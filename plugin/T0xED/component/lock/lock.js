import images from '../../assets/js/img'
import { openSubscribe } from '../../assets/js/openSubscribe.js'

import { getAssistant } from '../../assistant/platform/wechat/plugins/ED/index'
import assistantBehavior from '../../assistant/platform/wechat/ability/mixins/index'
let assistant = getAssistant()

Component({
  behaviors: [
    ...assistantBehavior(assistant, ['$lock.lock', '$lock.lockDisable', 'isMachineBrewing'], ['$lock.toggleLock']),
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
      const { lockDisable, isMachineBrewing } = this.data
      if (lockDisable) return
      openSubscribe(
        assistant.deviceSetting.deviceKind < 4 ? 3 : assistant.deviceSetting.deviceKind,
        assistant.deviceInfo.name,
        assistant.deviceInfo.sn,
        assistant.deviceSetting.deviceKind < 4 ? 3 : assistant.deviceSetting.deviceKind,
        assistant.deviceInfo.sn8,
        assistant.deviceInfo.type,
        assistant.deviceInfo.applianceCode
      )

      let funcsett = assistant.deviceSetting.funcList.find((v) => v.key === 'Lock')
      if (isMachineBrewing) {
        wx.showToast({
          title: `冲泡中无法控制${funcsett.title}`,
          icon: 'none',
          duration: 2000,
        })
        return
      }
      if (assistant.deviceSetting.vacationFlag && assistant.deviceStatus.vacation == 'on') {
        wx.showToast({
          title: `${assistant.deviceSetting.vacationFlag}开启状态下，无法控制${funcsett.title}`,
          icon: 'none',
          duration: 2000,
        })
      } else {
        let tipText = ''
        let modalTitle = assistant.deviceStatus.lock === 'on' ? '是否禁用童锁功能？' : '是否启用童锁功能？'
        if (
          ['63001227', '6300061G', '63001808', '63001627', '63000615', '63000584'].includes(assistant.deviceInfo.sn8)
        ) {
          tipText =
            assistant.deviceStatus.lock === 'on'
              ? '机器童锁功能禁用后将不再自动上锁，可随时直接操作其它功能'
              : '机器童锁功能启用后会自动上锁，需双击童锁按键解锁后才可操作其他功能'
        } else {
          tipText =
            assistant.deviceStatus.lock === 'on'
              ? '机器童锁功能禁用后将不再自动上锁，可随时直接操作其它功能'
              : '机器童锁功能启用后会自动上锁，需解锁后才可操作其他功能'
        }
        wx.showModal({
          title: modalTitle,
          content: tipText,
          success: (res) => {
            if (res.confirm) {
              this.toggleLock()
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          },
        })
      }
    },
  },
})
