const app = getApp()
Component({
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    overlay: true,
    isIphoneX: app.globalData.isIphoneX,
    list: [
      {
        name: '商用',
        value: '11',
      },
      {
        name: '家用',
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
        show: false,
      })
    },
    toCheck(e) {
      let name = e.currentTarget.dataset.name
      let value = e.currentTarget.dataset.value
      this.setData({
        show: false,
      })
      this.triggerEvent('sendPlace', { name, value })
    },
  },
})
