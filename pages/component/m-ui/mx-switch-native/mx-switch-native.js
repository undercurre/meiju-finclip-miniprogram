// m-ui/m-switch/m-switch.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    checked: {
      type: Boolean,
      value: false,
    },
    color: {
      type: String,
      value: '#267aff',
    },
    disabled: {
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
    onSwitch(e) {
      // console.log("e",e)
      let value = e.detail.value
      // console.log("child value",value)
      // detail对象，提供给事件监听函数
      var myEventDetail = {
        value: e.detail.value,
      }
      var myEventOption = {} // 触发事件的选项
      // 使用 triggerEvent 方法触发自定义组件事件，指定事件名、detail对象和事件选项
      this.triggerEvent('onSwitch', myEventDetail, myEventOption)
    },
  },
})
