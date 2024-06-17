// m-ui/m-blank/m-blank.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgSrc: {
      type: String,
      value: '',
    },
    desc: {
      type: String,
      value: '',
    },
    showBtn: {
      type: Boolean,
      value: false,
    },
    btnText: {
      type: String,
      value: '',
    },
    btnType: {
      type: String,
      value: 'main-bg0',
    },
    hasReason: {
      type: Boolean,
      value: false,
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
    buttonClicked(e) {
      let obj = e.currentTarget.dataset
      this.triggerEvent('onBlankBtnClicked', obj, {})
    },
  },
})
