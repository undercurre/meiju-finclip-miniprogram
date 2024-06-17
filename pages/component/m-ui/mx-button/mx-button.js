//toast.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    text: {
      type: String,
      value: '按钮',
    },
    size: {
      type: String,
      value: '',
      observer(val) {
        const map = this.data.map
        const buttonClass = map[val]
        this.setData({
          buttonClass: buttonClass,
        })
      },
    },
    type: {
      type: String,
      value: 'main-bg0',
    },
    color: {
      type: String,
      value: '#FFFFFF',
    },
    background: {
      type: String,
      value: '#267AFF',
    },
    show: {
      type: Boolean,
      value: true,
      observer: function (val) {
        if (val) {
          setTimeout(() => {
            this.setData({
              show: false,
            })
          }, 3000)
        }
      },
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    buttonClass: 'button-size-2',
    map: {
      mini: 'button-size-4',
      small: 'button-size-3',
      normal: 'button-size-2',
      big: 'button-size-1',
    },
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {},
    moved: function () {},
    detached: function () {},
  },
  /**
   * 组件的方法列表
   */
  methods: {
    btnClicked(e) {
      // console.log("btnClicked clicked...e", e)
      let obj = e.currentTarget.dataset
      this.triggerEvent('onButtonClicked', obj, {})
    },
  },
})
