// m-ui/m-swiper/m-swiper.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bannerList: {
      type: Array,
      value: [],
    },
    // 是否显示面板指示点
    indicatorDots: {
      type: Boolean,
      value: false,
    },
    autoPlay: {
      type: Boolean,
      value: true,
    },
    // 当前所在滑块的 index
    current: {
      type: Number,
      value: 0,
    },
    // 自动切换时间间隔
    interval: {
      type: Number,
      value: 3000,
    },

    // 以下暂时指定为不开放
    duration: {
      type: String,
      value: 500,
    },
    // 是否采用衔接滑动的方式循环播放
    infinite: {
      type: Boolean,
      value: true,
    },
    // 滑动方向是否为纵向
    vertical: {
      type: Boolean,
      value: false,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    swiperChange(e) {
      // console.log("swiperChange e", e)
      let obj = e.detail
      // console.log("obj",  obj)
      this.triggerEvent('onSwiperChange', obj, {})
    },
  },
})
