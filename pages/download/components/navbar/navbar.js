import { navigateToAll } from '../../../../utils/util'
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    backTo: {
      type: String,
      value: '',
    },
    navBarName: {
      type: String,
      value: '',
    },
  },
  data: {
    // 这里是一些组件内部数据
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'], //顶部状态栏的高度
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
