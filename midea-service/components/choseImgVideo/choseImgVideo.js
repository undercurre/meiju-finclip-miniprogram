const app = getApp()
Component({
  properties: {
    imgShow: {
      type: Boolean,
      value: false,
    },
    from: {
      type: Number,
      value: 1, // 1,选择视频还是图片
    },
  },
  data: {
    overlay: true,
    isIphoneX: app.globalData.isIphoneX,
    list: [
      {
        name: '上传图片',
        value: '11',
      },
      {
        name: '上传视频（大小不超过40M）',
        value: '10',
      },
    ],
  },
  options: {
    addGlobalClass: true,
  },
  methods: {
    onClose() {
      this.setData({
        imgShow: false,
      })
    },
    onClose1() {
      this.onClose()
    },
    onClose2() {
      this.onClose()
    },
    onClose3() {
      this.onClose()
    },
    toCheck(e) {
      let name = e.currentTarget.dataset.name
      let value = e.currentTarget.dataset.value
      this.setData({
        imgShow: false,
      })
      this.triggerEvent('checkPicker', { name, value })
    },
  },
})
