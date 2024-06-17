Component({
  properties: {
    title: {
      type: String,
      value: '标题',
    },
    // 弹窗内容
    content: {
      type: String,
      value: '内容',
    },
    // 弹窗取消按钮文字
    btn_no: {
      type: String,
      value: '取消',
    },
    // 弹窗确认按钮文字
    btn_ok: {
      type: String,
      value: '确定',
    },
    // 弹窗确认按钮文字
    btnz_only: {
      type: String,
      value: '知道了',
    },
    isShowDialog: {
      type: Boolean,
      value: false,
    },
  },
  options: {
    addGlobalClass: true,
  },
  data: {
    show: false,
    isShowDialog: false,
  },
  methods: {
    //隐藏弹框
    hideDialog: function () {
      this.setData({
        isShowDialog: false,
      })
    },
    //展示弹框
    showDialog() {
      this.setData({
        isShowDialog: true,
      })
    },
    makeSure() {
      //触发成功回调
      this.setData({
        isShowDialog: false,
      })
      this.triggerEvent('success')
    },
  },
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
