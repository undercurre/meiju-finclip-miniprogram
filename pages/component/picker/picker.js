// const app = getApp()

Component({
  properties: {
    pickData: {
      type: Object,
      value: {},
      observer: function (newVal) {
        let date = new Date()
        let initValue = [2, date.getMinutes(), 0]
        if (newVal['initValue']) {
          initValue = newVal.initValue
          delete newVal.initValue
        }
        if (typeof newVal === 'object') {
          this.setData({ listData: Object.values(newVal) })
        }
        let { pickeDate } = this.data
        Object.values(this.data.pickData).forEach((item, i) => {
          pickeDate[i] = item[initValue[i]]
        })
        this.setData({ pickeDate, value: initValue })
      },
    },
    sureStyle: {
      type: String,
      value: '',
    },
    cancelStyle: {
      type: String,
      value: '',
    },
    open: {
      type: Boolean,
      value: false,
      observer: function (newVal) {
        if (String(newVal) === 'true') {
          this.setData({ isOpen: true })
          this._openClosePicker()
        }
      },
    },
    maskStyle: {
      type: String,
      value: '',
    },
    indicatorStyle: {
      type: String,
      value: '',
    },
  },
  data: {
    isOpen: false,
    pickerBoxAnimation: {},
    pickerAnimation: {},
    pickeDate: [],
    listData: [],
    value: [],
    info: {
      H: '',
      W: '',
    },
  },
  attached() {
    this._getScreen()
    // let date = new Date()
    // this.setData({
    //   value: [2,date.getMinutes()]
    // })
  },
  methods: {
    _getScreen() {
      let that = this
      wx.getSystemInfo({
        success: function (res) {
          let H = res.windowHeight
          let W = res.windowWidth
          const { info } = that.data
          info.H = H
          info.W = W
          that.setData({ info })
        },
      })
    },
    _closePicker() {
      let { pickeDate } = this.data
      this.triggerEvent('close', pickeDate)
      this.setData({ isOpen: false })
      this._openClosePicker(1)
    },
    _bindChange(e) {
      let oldPickeDate = []
      Object.values(this.data.pickeDate).forEach((item, i) => {
        oldPickeDate[i] = item
      })
      let oldValue = []
      Object.values(this.data.value).forEach((item, i) => {
        oldValue[i] = item
      })
      const val = e.detail.value
      let { pickeDate } = this.data
      Object.values(this.data.pickData).forEach((item, i) => {
        pickeDate[i] = item[val[i]]
      })
      this.setData({ pickeDate, value: val })
      this.triggerEvent('change', {
        oldValue: oldValue,
        oldPickeDate: oldPickeDate,
        pickeDate: pickeDate,
        value: val,
      })
    },
    _surePicker() {
      let { pickeDate } = this.data
      this.triggerEvent('sure', pickeDate)
      this.setData({ isOpen: false })
      this._openClosePicker(1)
    },
    _openClosePicker(flag) {
      let animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
      })
      let animationBox = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
      })
      if (flag === 1) {
        animation.bottom('-100%').step()
        animationBox.bottom('-100%').step()
      } else {
        animation.bottom(0).step()
        animationBox.bottom(0).step()
      }
      this.setData({
        pickerBoxAnimation: animation.export(),
        pickerAnimation: animationBox.export(),
      })
    },
  },
})
