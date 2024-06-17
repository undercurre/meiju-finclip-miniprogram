import lottie from '../../assets/js/lottie-miniprogram/index'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
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

  lifetimes: {
    attached() {
      this.init()
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init() {
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
            loop: true,
            autoplay: true,
            animationData: animationData,
            rendererSettings: {
              context,
            },
          })
          this._inited = true
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
