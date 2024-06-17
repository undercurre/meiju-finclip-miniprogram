const app = getApp()
Component({
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    linkProductDetail: {
      type: Array,
      value: [],
    },
  },
  data: {
    overlay: true,
    list: [],
    isPx: app.globalData.isPx,
  },
  options: {
    addGlobalClass: true,
  },
  methods: {
    onClose() {
      this.setData({
        show: false,
      })
      this.triggerEvent('runA')
    },
    gotoMarketDetail(e) {
      console.log(e)
      let items = {
        index: e.currentTarget.dataset.index,
        fiid: e.currentTarget.dataset.fiid,
        state: e.currentTarget.dataset.status,
        extendFieldValue: e.currentTarget.dataset.extendfieldvalue,
        item: e.currentTarget.dataset.item,
      }
      this.triggerEvent('run', items)
    },
  },
})
