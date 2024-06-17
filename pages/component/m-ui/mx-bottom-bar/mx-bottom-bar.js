// m-ui/mx-bottom-bar/mx-bottom-bar.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: [],
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    itemClicked(e) {
      const { dataset } = e.currentTarget
      console.log('dataset', dataset)
      this.triggerEvent('onBottomItemClicked', dataset, {})
    },
  },
})
