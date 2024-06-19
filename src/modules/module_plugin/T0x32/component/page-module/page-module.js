// plugin/T0x32/component/page-module/page-module.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    disabled: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    titleList: {
      type: Array,
      value: [],
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
    // 选择标题
    onChangeTitle(event) {
      let model = event.currentTarget.dataset
      console.log('选择标题: ', model)
      let selectedTitle = model.item
      this.triggerEvent('onChangeTitle', { data: selectedTitle })
    },
    // 点击遮罩层
    onClickDisabled() {
      this.triggerEvent('onClickDisabled')
    },
  },
})
