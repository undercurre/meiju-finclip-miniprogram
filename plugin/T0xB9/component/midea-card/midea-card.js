// plugin/T0xFB/component/media-card.js
const DO_WHILE_FALSE = false
Component({
  options: {
    multipleSlots: true,
  },
  /**
   * 组件的属性列表
   * model的属性
   * model: {
   *     leftWrapper: Wrapper;
   *     rightWrapper: Wrapper;
   * }
   * height: number;      卡片高度
   * disabled: boolean;   卡片是否激活
   *
   * wrapper的属性
   * icon:{
   *     src: string;
   *     width: number;   单位是rpx
   *     height: number;  单位是rpx
   * };
   * text: {
   *     content: string;
   *     style: Object;     就是css属性，但key值需要用string
   * };
   */
  properties: {
    model: {
      type: String,
      observer: function (newValue) {
        this.getModel(JSON.parse(newValue))
      },
    },
    height: Number,
    disabled: {
      type: Boolean,
      value: null,
      observer: function (newValue) {
        let bindModel = this.data.bindModel
        bindModel.disabled = newValue
        this.setData({ bindModel })
      },
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    bindModel: {},
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 设置model
    getModel(model) {
      if (!model && this.data.model) {
        model = JSON.parse(this.data.model)
      }
      let bindModel = {}
      if (model) {
        bindModel = model
        // 设置样式
        bindModel.leftWrapper.textStyle =
          (bindModel.leftWrapper.text.color ? 'color:' + bindModel.leftWrapper.text.color + ';' : '') +
          (bindModel.leftWrapper.text.fontSize ? 'font-size:' + bindModel.leftWrapper.text.fontSize + 'rpx;' : '')
        bindModel.rightWrapper.textStyle =
          (bindModel.rightWrapper.text.color ? 'color:' + bindModel.rightWrapper.text.color + ';' : '') +
          (bindModel.rightWrapper.text.fontSize ? 'font-size:' + bindModel.rightWrapper.text.fontSize + 'rpx;' : '')
        this.setData({
          bindModel: bindModel,
        })
      }
      let disabled = this.data.disabled
      if (disabled === false || disabled === true) {
        bindModel.disabled = disabled
        this.setData({
          bindModel: bindModel,
        })
      }
      return bindModel
    },
    // 点击左侧区域
    onClickLeftWrapper() {
      do {
        let bindModel = this.data.bindModel
        if (bindModel.disabled) {
          break
        }
        let myEventDetail = {} // detail对象，提供给事件监听函数
        let myEventOption = {} // 触发事件的选项
        this.triggerEvent('onClickLeft', myEventDetail, myEventOption)
      } while (DO_WHILE_FALSE)
    },
    // 点击右侧区域
    onClickRightWrapper() {
      do {
        let bindModel = this.data.bindModel
        if (bindModel.disabled) {
          break
        }
        let myEventDetail = {} // detail对象，提供给事件监听函数
        let myEventOption = {} // 触发事件的选项
        this.triggerEvent('onClickRight', myEventDetail, myEventOption)
      } while (DO_WHILE_FALSE)
    },
  },
  attached() {
    this.getModel()
  },
})
