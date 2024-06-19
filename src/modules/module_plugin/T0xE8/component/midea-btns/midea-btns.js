// plugin/T0xFB/component/media-card.js
Component({
  options: {
    multipleSlots: true
  },
  properties: {
    model: {
      type: Object,
      observer: function(newValue,oldValue){
        this.getModel()
      }
    },
    disabled: {
      type: Boolean,
      value: null,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    bindModel: {},
    activeIndex: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getModel() {
      console.log(this.properties.model)
      let bindModel = JSON.parse(JSON.stringify(this.properties.model))
      this.setData({bindModel, activeIndex: bindModel.currentTarget.value})
    },
    checkBtn(e) {
      let bindModel = this.data.bindModel
      bindModel.currentTarget = e.currentTarget.dataset.item
      this.triggerEvent('onChange',bindModel);
      // this.setData({bindModel, activeIndex: bindModel.currentTarget.value})
    }
  },
  attached(){
    this.getModel();
  }
})
