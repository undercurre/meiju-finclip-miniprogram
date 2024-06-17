import { navigateToAll } from '../../../utils/util'
Component({
  properties: {
    backTo: {
      type: String,
      value: '',
    },
    title: {
      type: String,
      value: '',
    },
    isShowBg: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
  },
  methods: {
    clickBack() {
      if (!this.data.backTo) {
        if (getCurrentPages().length < 2) {
          navigateToAll('/pages/index/index')
        }
        wx.navigateBack({
          delta: 1,
        })
        console.log('没传返回指定页面path')
        return
      }
      if (this.data.backTo) {
        navigateToAll(this.data.backTo)
      }
      this.triggerEvent('clickBack')
    },
  },
})
