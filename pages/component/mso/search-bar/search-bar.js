// pages/component/mso/search-bar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    fakeInput: {
      type: Boolean,
      value: false,
    },
    placeholder: {
      type: String,
      value: '',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    keyword: null,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    fakeInputClicked() {
      this.triggerEvent('fakeInputClicked')
    },
    bindinput(event) {
      const { value } = event.detail
      this.setKeyword(value)
    },
    bindconfirm() {
      this.triggerEvent('searchConfirm', { keyword: this.data.keyword })
    },
    setKeyword(keyword) {
      this.setData({
        keyword,
      })
    },
    clickClear() {
      this.setKeyword(null)
    },
    clickCancel() {
      this.triggerEvent('click-cancel')
    },
  },
})
