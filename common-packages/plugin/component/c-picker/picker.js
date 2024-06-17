// plugin/component/c-picker/picker.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
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
    close: {
      value: false,
      type: Boolean
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    click: false,
    isShow: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onAfterLeave () {
      this.close()
    },
    onClick (e) {
      console.log('c-pick onClick e: ', e)
      this.setData({
        click: true
      })
      this.setData({
        isShow: true
      })
    },
    onChange (e) {
      console.log('1111 c-pick onChange e:', e)
      this.trigger('change', e)
    },
    onStart (e) {
      console.log('1111 c-pick onStart e:', e)
      this.trigger('pickerStart', e)
    },
    onEnd (e) {
      console.log('1111 c-pick onEnd e:', e)
      this.trigger('pickerEnd', e)
    },
    onConfirm (e) {
      console.log('1111 c-pick onConfirm e:', e)
      this.close()
      this.trigger('confirm', e)
    },
    onCancel (e) {
      console.log('1111 c-pick onCancel e:', e)
      this.close()
      this.trigger('cancel', e)
    },
    trigger (event, e) {
      let value = e.detail
      this.triggerEvent(event, value)
    },
    close () {
      this.setData({
        isShow: false
      })
      this.setData({
        click: false
      })
    }
  }
})
