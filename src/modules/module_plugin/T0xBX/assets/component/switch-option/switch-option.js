// plugin/T0xBX/assets/component/switch-option/switch-option.js
const SWITCH_ON = "on"
const SWITCH_OFF = "off"

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    key: {
      type: String,
      value: ''
    },
    icon: {
      type: String,
      value: ''
    },
    label: {
      type: String,
      value: ''
    },
    checked: {
      type: String,
      value: SWITCH_OFF
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _checked: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchChange(e) {
      const {value} = e.detail
      const {key} = this.data
      this.triggerEvent('switchChange', {
        key,
        value: value ? SWITCH_ON : SWITCH_OFF
      })
    }
  },
  attached() {
    this.setData({
      _checked: this.data.checked === SWITCH_ON
    })
  }
})
