// src/modules/module_plugin/T0xE6/components/smallCard/smallCard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    icon: {
      type: String,
      value: '',
    },
    buttonText: {
      type: String,
      value: '调节',
    },
    titleText:{
      type: String,
      value: '',
    },
    detailText: {
      type: String,
      value: '',
    },
    checked: {
      type: Boolean,
      value: false,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onButtonClick() {
      console.log("调节按钮");
      this.triggerEvent('myevent', { data: 'hello' })
    }
  }
})
