// components/time-range-selector/TimeRangeSelector.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    timeData: {
      type: Array,
      value: [{
        text: "6/30-7/09",
        requestMoment: ""
      }, {
        text: "7/10-7/17",
        requestMoment: ""
      }, {
        text: "本周",
        requestMoment: ""
      }],
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    selected: 2,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    resetIndex() {
      this.setData({
        selected: 2,
      })
    },
    setSelected(e) {
      this.setData({
        selected: e.currentTarget.dataset.item,
      })
      this.triggerEvent('onChange', this.data.selected)
    },
  },
})
