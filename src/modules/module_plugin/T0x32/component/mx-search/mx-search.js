// m-ui/m-search/m-search.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    defaultInput: {
      type: String,
      value: '',
      observer: function (newVal) {},
    },
    placeholder: {
      type: String,
      value: '',
    },
    autoFocus: {
      type: Boolean,
      value: false,
    },

    hasBtn: {
      type: Boolean,
      value: false,
    },
    btnText: {
      type: String,
      value: '搜索',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    spritePicture: 'https://www.smartmidea.net/projects/sit/meiju-lite-assets/mideaServices/images/icon.png',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    delKeyWord() {
      this.setData({
        defaultInput: '',
      })
      this.triggerEvent('clickClear')
    },

    actionInput(e) {
      // console.log("input e", e)
      let { value } = e.detail
      if (value) {
        this.setData({
          defaultInput: value,
        })
      }
      this.triggerEvent('onInput', { value }, {})
    },

    // 右边按钮事件
    actionBtnClicked() {
      this.triggerEvent('onBtnClick', {}, {})
    },
    // 键盘右下角搜索按钮事件
    actionKeyboardSearch(e) {
      console.log('软键盘搜索按钮')
      let { value } = e.detail
      this.triggerEvent('onConfirm', { value }, {})
    },
    actionBlur() {
      this.triggerEvent('onBlur', {}, {})
    },
  },
})
