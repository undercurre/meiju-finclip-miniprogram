Component({
  /**
   * 组件的属性列表
   */
  properties: {
    size: {
      type: Number,
      value: 470,
    },
    sizeUnit: {
      type: String,
      value: 'rpx',
    },
    thickness: {
      type: Number,
      value: 8,
    },
    bgColor: {
      type: String,
      value: '#fff',
    },
    completedColor: {
      type: String,
      value: '#ffaa10',
    },
    incompletedColor: {
      type: String,
      value: '#ccc',
    },
    value: {
      type: Number,
      value: 0,
    },
    min: {
      type: Number,
      value: 0,
    },
    minDesc: {
      type: String,
      value: '0',
    },
    max: {
      type: Number,
      value: 100,
    },
    maxDesc: {
      type: String,
      value: '100',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    pregressPercentage: 0,
    part1RotateStart: -135,
    part1RotateGo: -135,
    part2RotateStart: -225,
    part2RotateGo: -225,
    part3RotateStart: -225,
    part3RotateGo: -225,
    centerCoverPos: 0,
    minDescPos: {},
    maxDescPos: {},
  },

  /**
   * 组件的方法列表
   */
  methods: {
    updateProgress: function (value) {
      let totalStep = this.data.max - this.data.min
      let progressStep = (value || this.data.value) - this.data.min
      //执行了百分比
      let pregressPercentage = Number((progressStep / totalStep).toFixed(2))
      //执行了角度（全部一共有270度）
      let runDeg = Math.ceil(270 * pregressPercentage)

      this.setData({
        pregressPercentage: pregressPercentage,
        part1RotateGo: this.data.part1RotateStart + Math.min(90, runDeg),
        part2RotateGo: this.data.part2RotateStart + Math.min(180, runDeg),
        part3RotateGo: this.data.part3RotateStart + Math.min(270, runDeg),
      })
    },
    calPos(x, y, r, n) {
      var th = (n * 2 * Math.PI) / 360
      let point = {}
      point.x = x + r * Math.sin(th)
      point.y = y - r * Math.cos(th)
      return point
    },
  },
  ready() {
    let size = this.data.size
    let maxPoint = this.calPos(size / 2, size / 2, size / 2, 135)
    let minPoint = this.calPos(size / 2, size / 2, size / 2, 225)
    //进度条宽度求得中心覆盖圆形的x和y偏移量
    let centerCoverPos = Math.round(this.data.thickness / Math.sqrt(2))

    this.setData({
      centerCoverPos: centerCoverPos,
      minDescPos: {
        x: minPoint.x,
        y: minPoint.y,
      },
      maxDescPos: {
        x: maxPoint.x,
        y: maxPoint.y,
      },
    })
    this.updateProgress()
  },
})
