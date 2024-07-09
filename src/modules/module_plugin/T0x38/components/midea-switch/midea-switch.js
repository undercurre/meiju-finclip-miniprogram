
Component({
  /**
   * 组件的属性列表
   * model: {
   *     selected: boolean;       是否选中
   *     color: string;           选中颜色
   *     switchColor: string;     未选择颜色
   *     isActive: boolean;       是否激活
   *     disabled: boolean;     是否禁用
   * }
   */
  properties: {
    model: {
      type: String,
      observer: function(newValue){
        this.getModel(JSON.parse(newValue));
      }
    },
    color: {
      type: String,
      observer: function(newValue){
        let bindModel = this.data.bindModel;
        bindModel.color = newValue;
        this.setData({bindModel});
      }
    },
    switchColor: {
      type: String,
      observer: function(newValue){
        let bindModel = this.data.bindModel;
        bindModel.switchColor = newValue;
        this.setData({bindModel});
      }
    }
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
      switchColor: undefined
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 设置model
    getModel(model){
      let bindModel = this.data.bindModel;
      if(!model&&this.data.model&&!bindModel){
        model = JSON.parse(this.data.model);
      }
      if(model){
        bindModel = model;
        this.setData({
          bindModel: bindModel
        });
      }
      return bindModel;
    },
    // 切换开关
    switchSelected(){
      do{
        let bindModel = this.data.bindModel;
        if(bindModel.disabled){
          break;
        }
        bindModel.selected = !bindModel.selected;
        this.setData({
          bindModel: bindModel
        });
        this.triggerEvent('onChange',bindModel,bindModel);
      }while (false);
    }
  }
})