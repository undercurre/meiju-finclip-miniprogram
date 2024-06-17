import { showToast } from '../../../utils/util.js'
// import { baseImgApi } from '../../../api'
Component({
  behaviors: [],

  // 属性定义（详情参见下文）
  properties: {},

  data: {
    networklessImg: '../../../assets/img/img_wuwangluo.png',
  }, // 私有数据，可用于模板渲染

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {},
    moved: function () {},
    detached: function () {},
  },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {},
    hide: function () {},
    resize: function () {},
  },

  methods: {
    getNetworkType() {
      return new Promise((resolve, reject) => {
        wx.getNetworkType({
          success(res) {
            resolve(res)
          },
          fail(res) {
            reject(res)
          },
        })
      })
    },
    reloadPage() {
      this.getNetworkType().then((res) => {
        const networkType = res.networkType
        if (networkType === 'none') {
          showToast('网络异常，请稍后再试')
        } else {
          this.triggerEvent('refreshPage')
        }
      })
    },
  },
})
