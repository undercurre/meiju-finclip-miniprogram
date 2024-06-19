// plugin/T0xFB/component/media-switch/media-switch.js
Component({
  /**
   * 组件的属性列表
   * model: {
   *     selected: boolean;       是否选中
   *     color: string;           选中颜色
   *     isActive: boolean;       是否激活
   *     disabled: boolean;     是否禁用
   * }
   */
  properties: {
    model: {
      type: Object,
      observer: function () {
        this.getModel()
      },
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    bindModel: {
      isActive: true,
      selected: false,
      disabled: false,
      color: undefined,
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 设置model
    getModel() {
      let bindModel = JSON.parse(JSON.stringify(this.properties.model))
      this.setData({ bindModel })
    },
    // 切换开关
    switchSelected() {
      let bindModel = this.data.bindModel
      if (bindModel.disabled) {
        return
      }
      bindModel.selected = !bindModel.selected
      // this.setData({bindModel});
      this.triggerEvent('onChange', bindModel)
    },
  },
})
