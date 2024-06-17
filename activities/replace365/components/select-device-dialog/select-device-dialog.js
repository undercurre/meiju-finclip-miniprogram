// activities/replace365/components/select-device-dialog/select-device-dialog.js
// const app = getApp()
Component({
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    list: {
      type: Array,
      value: [],
      observer: function (newVal) {
        console.log('properties-new list', newVal)
        wx.getSystemInfo({
          success: (res) => {
            console.log('this.data', this.data)
            // newVal.length<2?newVal.push({}):''
            let isIphoneX = res.safeArea.top > 20 ? true : false
            console.log(isIphoneX)
            // let height = isIphoneX?newVal.length*184+178:newVal.length*184+110
            // this.setData({
            //   isIpx: res.safeArea.top > 20 ? true : false
            // })
            // this.setData({
            //   popupHeight: `${height}rpx`
            // })
          },
        })
      },
    },
  },
  data: {
    // show:true,
    overlay: true,
    // isIpx:app.globalData.isIpx,
    isIpx: false,
    popupHeight: '478rpx',
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
      let item = e.currentTarget.dataset.item
      console.log(item)
      this.setData({
        show: false,
      })
      this.triggerEvent('selectProduct', item)
    },
  },
})
