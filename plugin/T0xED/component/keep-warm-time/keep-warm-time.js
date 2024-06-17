import computedBehavior from '../../../../utils/miniprogram-computed'
import images from '../../assets/js/img'

import { getAssistant } from '../../assistant/platform/wechat/plugins/ED/index'
import assistantBehavior from '../../assistant/platform/wechat/ability/mixins/index'
let assistant = getAssistant()

Component({
  behaviors: [
    computedBehavior,
    ...assistantBehavior(
      assistant,
      ['deviceSetting', '$keepWarm.keepWarmDisable', 'isMachineBrewing', 'deviceStatus'],
      ['$keepWarm.setKeepWarmTime']
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
    title: {
      type: String,
      value: '',
    },
  },
  data: {
    images,
    showPicker: false,
    pickerRange: [],
    pickerValue: 0,
    pickerUnit: '',
  },
  computed: {
    rightText() {
      const { deviceStatus, deviceSetting } = this.data
      if (deviceSetting && deviceSetting.keepWarmRangeLabel && deviceStatus && deviceStatus.keep_warm_time) {
        let idx = deviceSetting.keepWarmRange.indexOf(deviceStatus.keep_warm_time)
        return `${deviceSetting.keepWarmRangeLabel[idx]}小时`
      } else if (deviceSetting && deviceStatus && deviceStatus.keep_warm_time) {
        return `${deviceStatus.keep_warm_time}小时`
      } else {
        return ''
      }
    },
  },
  methods: {
    onConfirm(e) {
      this.setData({
        showPicker: false,
      })
      const { deviceSetting } = this.data
      this.setKeepWarmTime(deviceSetting.keepWarmRange[e.detail])
    },
    onCancel() {
      this.setData({
        showPicker: false,
      })
    },
    onCellClick() {
      const { keepWarmDisable, isMachineBrewing, deviceStatus, deviceSetting } = this.data
      if (keepWarmDisable) return
      if (isMachineBrewing) {
        wx.showToast({
          title: '冲泡中无法控制,请冲泡完成后再试',
          icon: 'none',
        })
        return
      }
      this.setData({
        pickerRange: deviceSetting.keepWarmRangeLabel ? deviceSetting.keepWarmRangeLabel : deviceSetting.keepWarmRange,
        pickerValue: deviceSetting.keepWarmRange.indexOf(deviceStatus.keep_warm_time),
        pickerUnit: '小时',
        showPicker: true,
      })
    },
  },
})
