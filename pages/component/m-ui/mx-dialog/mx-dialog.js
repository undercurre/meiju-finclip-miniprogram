// m-ui/m-dialog/m-dialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    // 标题
    title: {
      type: String,
      value: '内容',
    },
    // 内容
    content: {
      type: String,
      value: '内容',
    },
    //按钮文案
    cancelLabel: {
      type: String,
      value: '取消',
    },
    confirmLabel: {
      type: String,
      value: '确定',
    },
    //single button text
    single: {
      type: Boolean,
      value: false,
    },
    singleLabel: {
      type: String,
      value: '我知道了',
    },
    textAlign: {
      type: String,
      value: 'center',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    //隐藏弹框
    hideDialog: function () {
      this.setData({
        show: false,
      })
    },

    btnCkicked(e) {
      //触发成功回调
      this.setData({
        show: false,
      })
      const { type } = e.currentTarget.dataset
      // detail对象，提供给事件监听函数
      var myEventDetail = { type }
      var myEventOption = {} // 触发事件的选项
      // 使用 triggerEvent 方法触发自定义组件事件，指定事件名、detail对象和事件选项
      this.triggerEvent('onButtonClicked', myEventDetail, myEventOption)
    },
  },
})
