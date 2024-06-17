// m-ui/m-row/m-row.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 是否全屏 默认为true
    fullScreen: {
      type: Boolean,
      value: true,
    },
    // 上圆角 默认false  在非全屏样式下可以设置圆角
    radiusTop: {
      type: Boolean,
      value: false,
    },
    //  下圆角 默认false
    radiusBottom: {
      type: Boolean,
      value: false,
    },
    label: {
      type: String,
      value: '',
    },
    iconSrc: {
      type: String,
      value: '',
    },
    // sprite icon用
    bgSrc: {
      type: String,
      value: '',
    },
    showArrow: {
      type: Boolean,
      value: true,
    },
    showBorder: {
      type: Boolean,
      value: true,
    },

    // 是否三无居中
    center: {
      type: Boolean,
      value: false,
    },
    // open-type 可选值有feedback、share、contact
    openType: {
      type: String,
      value: '',
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
    rowAction(e) {
      console.log('rowClicked clicked...e', e)
      let obj = e.currentTarget.dataset
      this.triggerEvent('onRowClicked', obj, {})
    },
  },
})
