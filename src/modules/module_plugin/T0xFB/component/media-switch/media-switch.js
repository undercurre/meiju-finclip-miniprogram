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
      type: String,
      observer: function (newValue) {
        this.getModel(JSON.parse(newValue))
      },
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    bindModel: {
      selected: false,
      disabled: false,
      activeType: '',
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 设置model
    getModel(model) {
      let bindModel = this.data.bindModel
      if (!model && this.data.model && !bindModel) {
        model = JSON.parse(this.data.model)
      }
      if (model) {
        bindModel = model
        this.setData({
          bindModel: bindModel,
        })
      }
      return bindModel
    },
    // 切换开关
    switchSelected() {
      do {
        let bindModel = this.data.bindModel
        if (bindModel.disabled) {
          break
        }
        bindModel.selected = !bindModel.selected
        this.setData({
          bindModel: bindModel,
        })
        this.triggerEvent('onChange', bindModel, bindModel)
      } while (false)
    },
  },
})
