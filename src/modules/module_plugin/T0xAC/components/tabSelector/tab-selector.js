// components/tabSelector/tab-selector.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs: {
      type: Array,
      value: ['周', '月', '年'],
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    selected: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(e) {
      this.setData({
        selected: e.currentTarget.dataset.id,
      })
      this.triggerEvent('onChange', this.data.selected)
    },
  },
})
