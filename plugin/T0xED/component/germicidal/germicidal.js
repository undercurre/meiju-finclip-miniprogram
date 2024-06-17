import images from '../../assets/js/img'
import { openSubscribe } from '../../assets/js/openSubscribe.js'

import { getAssistant } from '../../assistant/platform/wechat/plugins/ED/index'
import assistantBehavior from '../../assistant/platform/wechat/ability/mixins/index'
let assistant = getAssistant()

Component({
  behaviors: [
    ...assistantBehavior(
      assistant,
      ['$germicidal.germicidalDisable', '$germicidal.germicidal'],
      ['$germicidal.toggleGermicidal']
    ),
  ],
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
      const { germicidal, germicidalDisable } = this.data
      if (germicidalDisable) return
      openSubscribe(
        assistant.deviceSetting.deviceKind < 4 ? 3 : assistant.deviceSetting.deviceKind,
        assistant.deviceInfo.name,
        assistant.deviceInfo.sn,
        assistant.deviceSetting.deviceKind < 4 ? 3 : assistant.deviceSetting.deviceKind,
        assistant.deviceInfo.sn8,
        assistant.deviceInfo.type,
        assistant.deviceInfo.applianceCode
      )
      if (assistant.deviceInfo.sn8 === '63001908') {
        if (germicidal) {
          wx.showModal({
            title: '温馨提示',
            content: '是否关闭高温洗？',
            success: (res) => {
              if (res.confirm) {
                this.toggleGermicidal()
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            },
          })
        } else if (assistant.deviceStatus.vacation == 'on') {
          wx.showToast({
            title: '度假模式开启中，不可开启高温洗',
            icon: 'none',
            duration: 2000,
          })
        } else if (assistant.deviceStatus.waste_water == 'on') {
          wx.showToast({
            title: '上次高温洗完的废水还没倒，请打开下门倒出废水',
            icon: 'none',
            duration: 2000,
          })
        } else if (assistant.deviceStatus.full == 'off') {
          wx.showToast({
            title: '设备水箱未满水，请稍后再试',
            icon: 'none',
            duration: 2000,
          })
        } else {
          if (assistant.deviceStatus.standby_status == 1 || assistant.deviceStatus.sleep == 'on') {
            wx.showModal({
              title: '是否开启高温洗？',
              content: '高温洗时间约10分钟，高温洗过程中暂不能提供其他功能服务',
              success: (res) => {
                if (res.confirm) {
                  this.toggleGermicidal()
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              },
            })
          } else {
            wx.showToast({
              title: '非待机状态，无法开启高温洗',
              icon: 'none',
              duration: 2000,
            })
          }
        }
      } else {
        if (assistant.deviceSetting.deviceKind === 7) {
          // 管线机高温洗
          if (germicidal) {
            wx.showModal({
              title: '温馨提示',
              content: '是否关闭高温杀菌？',
              success: (res) => {
                if (res.confirm) {
                  this.toggleGermicidal()
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              },
            })
          } else {
            if (assistant.deviceStatus.drainage == 'on') {
              wx.showToast({
                title: '设备排水中，无法开启高温杀菌',
                icon: 'none',
                duration: 2000,
              })
            } else if (assistant.deviceStatus.standby_status == 1 || assistant.deviceStatus.sleep == 'on') {
              wx.showModal({
                title: '是否开启高温杀菌？',
                content: `${
                  assistant.deviceSetting.germicidalTime
                    ? `高温杀菌时间约${assistant.deviceSetting.germicidalTime}分钟`
                    : '正在执行高温杀菌'
                }，杀菌过程中暂不能提供其他功能服务`,
                success: (res) => {
                  if (res.confirm) {
                    this.toggleGermicidal()
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                },
              })
            } else {
              wx.showToast({
                title: '非待机状态，无法开启高温杀菌',
                icon: 'none',
                duration: 2000,
              })
            }
          }
        } else {
          this.toggleGermicidal()
        }
      }
    },
  },
})
