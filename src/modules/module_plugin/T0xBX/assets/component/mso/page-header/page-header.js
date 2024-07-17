Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    theme: {
      type: String,
      value: 'light',
    },
    title: {
      type: String,
      value: '',
    },
    overlay: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    // 这里是一些组件内部数据
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'], //顶部状态栏的高度
    icon: {
      dark: 'http://chuyu-meiyun.oss-cn-shenzhen.aliyuncs.com/2f28103e202f435bb11450f9ebf3095a89.png',
      light: 'http://chuyu-meiyun.oss-cn-shenzhen.aliyuncs.com/70ee32af51044d828c285e391c3cae1c57.png',
    },
  },
  methods: {
    clickBack() {
      this.triggerEvent('clickBack')
    },
  },
})
