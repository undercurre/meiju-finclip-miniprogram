// midea-service/pages/components/view-address-overlay/view-address-overlay.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    receiveDialog: {
      type: Boolean,
      default: false,
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
    onTap() {
      // this.setData({
      //   receiveDialog:false
      // })
      this.triggerEvent('maskHide')
    },
  },
})
