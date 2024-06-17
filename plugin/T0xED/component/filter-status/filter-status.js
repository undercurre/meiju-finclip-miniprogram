Component({
  properties: {
    disabled: {
      type: Boolean,
      value: false,
    },
    value: {
      type: Array,
      value: [],
    },
  },
  data: {
    eventChannel: null,
  },
  observers: {},
  methods: {
    //跳转滤芯详情页
    goFilterPage(event) {
      if (this.properties.disabled) return
      let idx = event.currentTarget.dataset.idx
      if (this.properties.value[idx].title === '剩余水量') return
      //滤芯详情页不包含剩余水量，下标特殊处理
      if (this.properties.value.some((v) => v.title === '剩余水量')) {
        let title = this.properties.value[idx].title
        let filterList = this.properties.value.filter((item) => item.title !== '剩余水量')
        idx = filterList.findIndex((v) => v.title === title)
      }

      wx.navigateTo({
        url: `../filter-page/filter-page?idx=${idx}`,
        events: {},
        success: (res) => {},
      })
    },
  },
})
