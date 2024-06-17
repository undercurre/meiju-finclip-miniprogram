// plugin/component/picker/picker.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      value: false,
      type: Boolean
    },
    mode: { // 选择器模式，mode为selector为字符串类型，mode为multiSelector为数组类型
      value: 'selector',
      type: String
    },
    range: {// 选项，mode为selector为字符串类型，mode为multiSelector为数组类型
      value: [],
      type: Array
    },
    rangeKey: {
      value: '',
      type: String
    },
    value: { // 默认选中项，mode为selector为字符串类型，mode为multiSelector为数组类型
      value: '',
      type: String,
      optionalTypes: [Array],
    },
    unit:  { // 单位，mode为selector为字符串类型，mode为multiSelector为数组类型
      value: '',
      type: String,
      optionalTypes: [Array],
    },
    leftBtnText: { // 自定义左侧按钮文案
      value: '取消',
      type: String
    },
    rightBtnText: { // 自定义右侧按钮文案
      value: '确定',
      type: String
    },
    successType: { // 可选择任意一侧按钮作为确定返回数据的按钮，默认右侧
      value: 'right', // left
      type: String
    },
    close: { // 数组首位不显示单位，一般应用于['关闭',1,2,3],单位为小时的情况
      value: false,
      type: Boolean
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    viewRange: [],
    viewValue: [],
    valueUnit: [],
    picking: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onBeforeEnter () {
      let { mode, range, value, unit, rangeKey } = this.properties
      console.log('onBeforeEnter:', mode, range, value, unit, rangeKey)
      if (mode === 'selector') {
        this.setData({
          viewRange: [range],
          viewUnit: unit !== '' ? [unit] : []
        })
        this.setData({
          viewValue: [value]
        })
      } else if (mode === 'multiSelector') {
        this.setData({
          viewRange: range,
          viewUnit: unit.length > 0 ? unit : []
        })
        this.setData({
          viewValue: value
        })
      }
    },
    onEnter () {},
    onAfterEnter () {},
    onBeforeLeave () {},
    onLeave () {},
    onAfterLeave () {
      this.triggerEvent('afterleave')
    },
    onClickOverlay () {},
    bindChange: function (e) {
      const viewValue = e.detail.value
      this.setData({
        viewValue: viewValue
      })
      this.triggerEvent('change', viewValue)
    },
    pickStart (e) {
      let start = e
      this.setData({
        picking: true
      })
      this.triggerEvent('pickerStart', start)
    },
    pickEnd (e) {
      let end = e
      this.setData({
        picking: false
      })
      this.triggerEvent('pickerEnd', end)
    },
    onClick (e) {
      let { successType, mode } = this.properties
      let { viewValue } = this.data
      let value = mode === 'selector' ? viewValue[0] : viewValue
      if (e.target.dataset.btn === successType) {
        this.triggerEvent('confirm', value)
      } else {
        this.triggerEvent('cancel', value)
      }
    }
  }
})
