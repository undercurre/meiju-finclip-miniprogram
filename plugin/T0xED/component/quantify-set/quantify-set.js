import images from '../../assets/js/img'

import { getAssistant } from '../../assistant/platform/wechat/plugins/ED/index'
import assistantBehavior from '../../assistant/platform/wechat/ability/mixins/index'
let assistant = getAssistant()

Component({
  behaviors: [...assistantBehavior(assistant, ['$quantifySet.quantifySetDisable'], [])],
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
    onCellClick() {
      const { quantifySetDisable } = this.data
      if (quantifySetDisable) return
      wx.navigateTo({
        url: `../multiple-select-page/multiple-select-page?type=quantifySet`,
        events: {},
        success: (res) => {},
      })
    },
  },
})
