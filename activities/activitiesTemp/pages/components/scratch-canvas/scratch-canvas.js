Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isStartScratch: {
      type: Boolean,
      observer(newVal, oldVal) {
        console.log('isStartScratch newVal', newVal, oldVal)
        this.setData({
          isStart: newVal,
        })
      },
    },
    isAgain: {
      type: Boolean,
      value: '',
      observer(newVal) {
        console.log('isA newVal', newVal)
        if (newVal == true) {
          this.init()
        }
      },
    },
    isCloseDialog: {
      value: false,
      type: Boolean,
      observer(newVal, oldVal) {
        console.log('isHaveDialog newVal', newVal, 'isHaveDialog oldVal', oldVal)
        if (newVal == true) {
          this.init()
        }
      },
    },
    coverScratch: {
      value: '',
      type: String,
      observer(newVal) {
        console.log('scratch.imageResource', newVal)
        this.setData({
          'scratch.imageResource': newVal,
        })
      },
    },
    width: {
      value: '',
      type: String,
      observer(newVal) {
        this.setData({
          'scratch.canvasWidth': newVal,
        })
      },
    },
    height: {
      value: '',
      type: String,
      observer(newVal) {
        this.setData({
          'scratch.canvasHeight': newVal,
        })
      },
    },
    isCanvas: {
      type: Boolean,
      observer(newVal) {
        console.log('isCanvas', newVal)
        this.init()
      },
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    isStart: false,
    isShowBtn: true,
    isShowDialog: false,
    windowWidth: '',
    scratch: {
      canvasWidth: 200,
      canvasHeight: 150,
      imageResource: 'https://fcmms.midea.com/cmimp_beta/file/1/20210702/b316787c-3551-4281-9d74-42b8a9fa6c98.png',

      r: 16,
    },
    ctx: '',
  },

  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
    },
    ready() {
      this.init()
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      this.init()
    },
    hide: function () {},
    resize: function () {},
  },
  /**
   * 组件的方法列表
   */
  methods: {
    init() {
      let self = this
      let ctx = wx.createCanvasContext('back-canvas', this)
      this.setData({
        ctx: ctx,
      })
      wx.getSystemInfo({
        success: function (res) {
          self.setData({
            windowWidth: res.windowWidth, // 获取屏幕尺寸
          })
        },
      })
      let { imageResource, canvasWidth, canvasHeight } = this.data.scratch
      ctx.clearRect(0, 0, canvasWidth, canvasHeight)
      if (imageResource && imageResource != '') {
        wx.downloadFile({
          url: imageResource,
          success: (res) => {
            console.log('imageResourceres1', res)
            ctx.drawImage(
              res.tempFilePath,
              0,
              0,
              (canvasWidth / 750) * this.data.windowWidth,
              (canvasHeight / 750) * this.data.windowWidth
            )
            ctx.draw()
          },
          fail: (res) => {
            console.log('failres', res)
          },
        })
      }
    },

    touchStart(e) {
      if (!this.data.isStart) return
      this.eraser(e, true)
    },
    touchMove(e) {
      if (!this.data.isStart) return
      this.eraser(e, true)
    },
    touchEnd() {
      if (!this.data.isStart) return
      const that = this
      wx.canvasGetImageData(
        {
          canvasId: 'back-canvas',
          x: 0,
          y: 0,
          width: parseInt((that.data.scratch.canvasWidth / 750) * that.data.windowWidth),
          height: parseInt((that.data.scratch.canvasHeight / 750) * that.data.windowWidth),
          success(res) {
            console.log('滑动数据', res.data.length, res.data[1], res.data[115])
            let num = 0

            res.data.forEach((item) => {
              if (item == 0) {
                return num++
              }
            })

            let op = num / res.data.length
            console.log('已刮', op)
            if (op > 0.5) {
              console.log(' this.data.ctx', that.data.ctx)
              that.data.ctx.draw()
              that.triggerEvent('finishScratch')
              that.properties.isAgain = false
              that.setData({
                isStart: false,
              })
            }
          },
        },
        this
      )
    },
    eraser(e) {
      let x = e.touches[0].x,
        y = e.touches[0].y

      this.clearArcFun(x, y, this.data.scratch.r, this.data.ctx)
      this.data.ctx.draw(true)
    },
    clearArcFun(x, y, r, ctx) {
      let stepClear = 1
      clearArc(x, y, r)
      function clearArc(x, y, radius) {
        let calcWidth = radius - stepClear
        let calcHeight = Math.sqrt(radius * radius - calcWidth * calcWidth)

        let posX = x - calcWidth
        let posY = y - calcHeight

        let widthX = 2 * calcWidth
        let heightY = 2 * calcHeight

        if (stepClear <= radius) {
          ctx.clearRect(posX, posY, widthX, heightY)
          stepClear += 1
          clearArc(x, y, radius)
        }
      }
    },
  },
})
