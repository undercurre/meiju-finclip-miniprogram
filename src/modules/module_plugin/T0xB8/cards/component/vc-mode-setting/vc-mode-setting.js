// plugin/T0xB8/cards/component/vc-mode-setting/vc-mode-setting.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      value:() => [],
      type: Array
    },
    title: {
      value: "",
      type: String
    },
 
    activeColor: {
      value: "#FFFFFF",
      type: String
    },
    inactiveColor: {
      value: "#333333",
      type: String
    },
    activeBackColor: {
      value: "#29C3FF ",
      type: String
    },
    inactiveBackColor: {
      value: "#F9F9F9",
      type: String
    },
    currentState: {//当前展示的状态
      type: Object
    },
    bottom: {
      value: "32rpx",
      type: String
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentMode: {}//当前模式数据
  },


  observers: {
    'currentState'(newVal) {
      if(newVal) {
        let current = this.properties.list.find((item) => {
          return item.key === newVal.key
        })
        this.setData({
          currentMode: current ? current : {}
        })
      }
    
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    selectCurrent(e) {
      if(e.currentTarget.dataset.item.key == this.data.currentMode.key) {
        return
      }
      this.setData({
        currentMode:  e.currentTarget.dataset.item
      })
      this.triggerEvent("selectCurrentItem",this.data.currentMode)
    }
  }
})
