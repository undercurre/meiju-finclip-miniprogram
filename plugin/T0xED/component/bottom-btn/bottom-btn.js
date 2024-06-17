Component({
  /**
   * 组件的属性列表
   */
  properties: {
    onIcon: {
      type: String,
      value: '',
    },
    offIcon: {
      type: String,
      value: '',
    },
    title: {
      type: String,
      value: '',
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    checked: {
      type: Boolean,
      value: false,
    },
    checkedBg: {
      type: String,
      value: '#29C3FF',
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
    itemClicked(e) {
      this.triggerEvent('btnClicked', e, {})
    },
  },
})
