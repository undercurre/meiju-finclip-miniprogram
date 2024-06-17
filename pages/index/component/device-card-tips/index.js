import { getWxSystemInfo } from '../../../../utils/wx/index.js'
Component({
  properties: {
    isShow: {
      type: Boolean,
      value: false,
      observer(val) {
        if (val) {
          this.autoHide()
        }
      },
    },
  },
  data: {
    timeout: null,
    hasShowed: false,
    statusBarHeight: 0,
  },
  methods: {
    autoHide() {
      this.data.timeout = setTimeout(() => {
        this.setData({
          hasShowed: true,
        })
        this.data.timeout = null
      }, 5000)
    },
  },
  lifetimes: {
    attached() {
      getWxSystemInfo(false).then((res) => {
        const statusBarHeight = res?.statusBarHeight
        this.setData({
          statusBarHeight: statusBarHeight * 2,
        })
      })
    },
  },
})
