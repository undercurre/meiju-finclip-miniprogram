import logger from '../../../utils/log'

function simpleTick(fn) {
  return setTimeout(fn, 30)
}

Component({
  properties: {
    time: {
      type: Number,
      value: 0,
    },
    autoStart: {
      type: Boolean,
      value: true,
    },
  },
  data: {
    formattedTime: null,
  },
  observers: {
    time: function (value) {
      if (value === this.time) {
        if(this.data.autoStart) {
          return
        }

        this.reset(false)
        return
      }

      // 暂存上一次传入的time
      this.time = value
      this.reset()
    },
    // "autoStart": function() {
    //   this.reset()
    // }
  },
  methods: {
    // 开始
    start() {
      if (this.counting) {
        return
      }

      this.counting = true
      this.endTime = Date.now() + this.remain
      this.tick()
    },

    // 暂停
    pause() {
      this.counting = false
      clearTimeout(this.tid)
    },

    // 重置
    reset(autoStart = this.data.autoStart) {
      this.pause()
      this.remain = this.data.time
      this.setRemain(this.remain)

      if (autoStart) {
        this.start()
      }
    },

    tick() {
      this.tid = simpleTick(() => {
        this.setRemain(this.getRemain())

        if (this.remain !== 0) {
          this.tick()
        }
      })
    },

    getRemain() {
      return Math.max(this.endTime - Date.now(), 0)
    },

    setRemain(remain) {
      this.remain = remain

      const formattedTime = this.parseTimeData(remain)
      // logger.setNamespace('countdownjs').info('formattedTime ', formattedTime)

      this.triggerEvent('countdown-change', {
        value: formattedTime.split(':'),
      })

      this.setData({
        formattedTime,
      })

      if (remain === 0) {
        this.pause()
        // this.$emit('finish');
      }
    },

    parseTimeData(time) {
      const SECOND = 1000
      const MINUTE = 60 * SECOND
      const HOUR = 60 * MINUTE
      const DAY = 24 * HOUR

      // const days = Math.floor(time / DAY)
      const hours = Math.floor((time % DAY) / HOUR)
      const minutes = Math.floor((time % HOUR) / MINUTE)
      const seconds = Math.floor((time % MINUTE) / SECOND)
      // const milliseconds = Math.floor(time % SECOND)

      return [this._addZero(hours), this._addZero(minutes), this._addZero(seconds)].join(':')
      // return {
      //   hour: hours,
      //   minute: minutes,
      //   second: seconds,
      // }
    },
    _addZero(n) {
      return parseInt(n) < 10 ? '0' + n : n
    },
  },

  attached: function () {
    // 在组件实例进入页面节点树时执行
    console.log('countdown attached')
  },
  moved() {
    console.log('moved')
  },
  detached: function () {
    // 在组件实例被从页面节点树移除时执行
    console.log('countdown detached')
    this.pause()
  },
})
