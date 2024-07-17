const comminMixin = require('../../../utils/mixins/commonMixin')
const NAVBAR_ITEM_WIDTH = 100;

Component({
  behaviors: [comminMixin],
  /**
   * 组件的属性列表
   */
  properties: {
    tabs: {
      type: Array,
      value: []
    },
    activeIndex: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _activeIndex: 0,
    sliderLeft: 0,
    sliderOffset: 0
  },

  attached() {
    this.setData({
      _activeIndex: this.data.activeIndex
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tabClick(e) {
      const _activeIndex = parseInt(e.currentTarget.id)
      const sliderOffset = _activeIndex * NAVBAR_ITEM_WIDTH * this.data.rpx2pxRatio + 'px'

      this.setData({
        _activeIndex,
        sliderOffset
      })

      this.triggerEvent('tabClick', {activeIndex: _activeIndex})
    }
  }
})
