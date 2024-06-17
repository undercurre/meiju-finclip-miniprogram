// m-ui/mx-button-card/mx-button-card.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    label: {
      type: String,
      value: '',
    },
    btnList: {
      type: Array,
      value: [],
    },
    index: {
      type: Number,
      value: 0,
    },
    forbidden: {
      type: Boolean,
      value: false,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    // icon:'/assets/image/example/slider/icon_list_yaotou2.svg',
    // temperatureList:['30','60','90','120'],
    // switchValue:true,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    btnClick(e) {
      let { index } = e.currentTarget.dataset
      this.setData({
        index: index,
      })
      this.triggerEvent('onButtonClicked', { index }, {})
    },
  },
})
