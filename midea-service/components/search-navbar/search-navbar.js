Component({
  properties: {},
  data: {
    // 这里是一些组件内部数据
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'], //顶部状态栏的高度
  },
  methods: {
    actionGoBack() {
      this.triggerEvent('actionGoBack')
    },
  },
})
