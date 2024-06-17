// midea-service/components/address-item/address-item.js
// import { imgBaseUrl } from '../../../api'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    itemData: {
      type: Object,
      value: {},
      // default: []
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
    modifyAddr() {
      console.log('setDefaultAddr')
      let item = this.data.itemData
      this.triggerEvent('modifyAddr', item)
    },

    setDefaultAddr() {
      console.log('setDefaultAddr')
      let item = this.data.itemData
      this.triggerEvent('setDefaultAddr', item)
    },

    delAddr() {
      let item = this.data.itemData
      this.triggerEvent('delAddr', item)
    },
  },
})
