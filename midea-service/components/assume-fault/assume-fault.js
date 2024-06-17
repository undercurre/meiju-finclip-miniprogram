// const app = getApp()
import { imgBaseUrl } from '../../../api'
Component({
  properties: {
    isShow: {
      type: Boolean,
      value: true,
    },
    flFault: {
      type: Array,
      value: [],
    },
    swiperCurrent: {
      type: Number,
      value: 0,
    },
  },
  observers: {
    isShow: function (newVal) {
      if (newVal) {
        setTimeout(() => {
          this.setData({
            showSwiper: true,
          })
        }, 600)
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    showSwiper: false,
    hideTitle: false,
    imgBurl: imgBaseUrl.url,
    topPosition: 0,
    co: '/mideaServices/images/icon.png',
    // imgUrl: app.conf.imgUrl,
    // helpful: `${app.conf.imgUrl}appointment/helpful.png`,
    // helpfulOn: `${app.conf.imgUrl}appointment/helpful-on.png`,
    // helpless: `${app.conf.imgUrl}appointment/helpless.png`,
    // helplessOn: `${app.conf.imgUrl}appointment/helpless-on.png`,
    // posterImg: `${confTool.getConfig('baseUrl')}${basePath}videobg.jpg`,
  },

  methods: {
    goLink() {
      wx.showToast({
        title: '功能暂未开放',
        icon: 'none',
      })
    },
    hideFaultTips() {
      this.setData({
        isShow: false,
        swiperCurrent: 0,
      })
      this.triggerEvent('getTextarea')
    },
    swiperChange: function (e) {
      if (this.videoContext) {
        this.videoContext.pause()
      }
      this.setData({
        swiperCurrent: e.detail.current,
        topPosition: 0,
        objectFit: 'fill',
        hideTitle: false,
      })
    },
    // 点击有没有帮助
    feedback(e) {
      let fault = e.currentTarget.dataset.fault
      let index = e.currentTarget.dataset.index
      let stasus = e.currentTarget.dataset.stasus
      this.triggerEvent('getCanReson', {
        fault,
        index,
        stasus,
      })
    },
  },
})
