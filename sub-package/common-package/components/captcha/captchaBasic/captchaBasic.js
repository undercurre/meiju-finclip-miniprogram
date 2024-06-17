//
// 注意 经测试uid只有在滑块验证初始化的时候传入才能正常传到顶象服务器
// 如需使用uid，请以v-if使用组件
//
Component({
  options: {
    styleIsolation: 'isolated',
  },
  properties: {
    captchaShow: {
      type: Boolean,
      value: false,
    },
    captchaReload: {
      type: Boolean,
      value: false,
    },
    uid: {
      type: String,
      observer(val) {
        if (val) {
          this.getUid(val)
        }
      },
    },
  },
  lifetimes: {
    attached() {
      this.triggerEvent('attached')
    },
  },
  data: {
    // v2.3新增滑块验证
    options: {
      appId: 'a8abfe7204ddad1832dca9994bf176c3', // 顶象申请到的appId
      style: 'popup', // 弹出式
    },
  },
  methods: {
    getUid(str) {
      console.log('uid是', str)
      let { options } = this.data
      options.uid = str
      this.setData({
        options,
      })
      console.log('options', this.data.options)
    },
    clicked() {
      this.triggerEvent('clicked')
    },
    captchaSuccess(e) {
      console.log('captchaSuccess', e)
      const item = e.detail
      this.triggerEvent('captchaSuccess', item)
    },
    captchaHide(e) {
      console.log('captchaHide', e)
      this.triggerEvent('captchaHide')
    },
  },
})
