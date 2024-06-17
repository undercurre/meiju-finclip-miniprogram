// pages/component/edit-delete-card/edit-delete-card.js
Component({
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      this.setPositionStyle()
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的属性列表
   */
  properties: {
    editList: {
      type: Array,
      value: [],
    },
    editFlag: {
      type: Boolean,
      value: false,
    },
    device: {
      type: Object,
      value: '',
    },
    support: {
      type: Boolean,
      value: false,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    positionStyle: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    triggerEventFun(e) {
      console.log('组件', e)
      this.triggerEvent('editBacFun', e.currentTarget.dataset)
    },
    setPositionStyle() {
      // 设置编辑框定位位置
      console.log('setPositionStylethis.properties', this.properties)
      let height = -(this.properties.editList.length * 84 + 6)
      this.setData({
        positionStyle: this.properties.editFlag ? 'top:' + height + 'rpx' : 'bottom:' + height + 'rpx',
      })
    },
  },
})
