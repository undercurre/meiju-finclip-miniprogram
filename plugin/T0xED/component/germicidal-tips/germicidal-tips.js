import images from '../../assets/js/img'
import { openSubscribe } from '../../assets/js/openSubscribe.js'

import { getAssistant } from '../../assistant/platform/wechat/plugins/ED/index'
import assistantBehavior from '../../assistant/platform/wechat/ability/mixins/index'
let assistant = getAssistant()

Component({
  behaviors: [
    ...assistantBehavior(
      assistant,
      [
        '$germicidalTips.germicidalTipsDisable',
        '$germicidalTips.germicidalTips',
        '$germicidalTips.germicidalCountdown',
      ],
      ['$germicidalTips.toggleGermicidalTips']
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
  },
  methods: {
    onSwitchChange() {
      const { germicidalTipsDisable } = this.data
      if (germicidalTipsDisable) return
      openSubscribe(
        assistant.deviceSetting.deviceKind < 4 ? 3 : assistant.deviceSetting.deviceKind,
        assistant.deviceInfo.name,
        assistant.deviceInfo.sn,
        assistant.deviceSetting.deviceKind < 4 ? 3 : assistant.deviceSetting.deviceKind,
        assistant.deviceInfo.sn8,
        assistant.deviceInfo.type,
        assistant.deviceInfo.applianceCode
      )
      this.toggleGermicidalTips()
    },
  },
})
