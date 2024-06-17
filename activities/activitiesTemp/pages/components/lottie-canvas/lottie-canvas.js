Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShowLottie: {
      type: Boolean,
      value: false,
      observer(newVal) {
        if (newVal) {
          this.init()
        }
      },
    },
    animationData: {
      type: Object,
      value: {},
    },
    time: {
      type: Number,
      value: 3000,
    },
    animationContainerInfo: {
      type: Object,
      value: {},
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    width: 300,
    height: 370,
  },
  /**
   * 组件的方法列表
   */
  methods: {
    init() {
      let self = this
      require('../../../../../sub-package/common-package/js/lottie-miniprogram/index.js', (lottie) => {
        console.log(lottie)
        self.initLottie(lottie)
      })
    },
    initLottie(lottie) {
      let self = this
      let { width, height } = this.properties.animationContainerInfo
      let { animationData } = this.properties
      this.setData({
        width,
        height,
      })
      if (this._inited) {
        return
      }
      this.createSelectorQuery()
        .select('#lottieCanvas')
        .node((res) => {
          console.log(res)
          const canvas = res.node
          const context = canvas.getContext('2d')
          canvas.width = width
          canvas.height = height
          lottie.setup(canvas)
          //path:imgUrl,
          this.ani = lottie.loadAnimation({
            loop: false,
            autoplay: true,
            animationData: animationData,
            rendererSettings: {
              context,
            },
          })
          this._inited = true
          setTimeout(() => {
            self.pause()
            self.ani = null
            self.triggerEvent('actionLottieClose')
            this._inited = false
          }, self.properties.time)
        })
        .exec()
    },
    play() {
      this.ani.play()
    },
    pause() {
      this.ani.pause()
    },
    aminalDestroy() {
      this.ani.destroy('')
    },
  },
})
