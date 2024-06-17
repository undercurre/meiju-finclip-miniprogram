Component({
  properties: {
    longText: {
      type: String,
      value: '标题所选地址区域已更新，更新地址信息重新下单',
    },
    isLongToast: {
      type: Boolean,
      value: false,
    },
  },
  options: {
    addGlobalClass: true,
  },
  data: {},
  methods: {},
  /*组件生命周期*/
  lifetimes: {
    created() {},
    attached() {},
    ready() {},
    moved() {},
    detached() {},
    error() {},
    /*组件所在页面的生命周期 */
    pageLifetimes: {
      show: function () {
        // 页面被展示
        console.log('页面被展示')
      },
      hide: function () {
        // 页面被隐藏
        console.log('页面被隐藏')
      },
      resize: function () {
        // 页面尺寸变化
        console.log('页面尺寸变化')
      },
    },
  },
})
