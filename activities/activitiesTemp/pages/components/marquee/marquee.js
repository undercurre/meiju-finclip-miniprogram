// activities/activitiesTemp/pages/components/marquee.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    text: {
      type: Array,
      value: [],
      // value: [
      //   {name:'张三', getAwardsUser:'一台冰箱'},
      //   {name:'李四', getAwardsUser:'一台张三'},
      //   {name:'王五', getAwardsUser:'一台电视机'},
      //   {name:'陈六', getAwardsUser:'一台吸尘器'},
      //   {name:'高齐', getAwardsUser:'一台冰箱'},
      //   {name:'阿杜', getAwardsUser:'一台收音机'},
      //   {name:'wade', getAwardsUser:'一部手机'}
      // ],
      observer(newVal) {
        if (newVal) {
          // this._scrolling();
          this.dynamicLength()
          setTimeout(() => {
            this.startAni()
          }, 2500)
        }
      },
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    marqueePace: 3.5,
    marqueeDistance: 375,
    size: 12,
    orientation: 'left',
    interval: 45,
    windowWidth: 750,
    length: 0,
    timer: '',
    ani: '',
    show: true,
  },

  created: function () {},

  pageLifetimes: {
    hide: function () {
      let { timer } = this.data
      console.log('timer0', timer)
      clearInterval(timer)
      console.log('timer1', timer)
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    startAni: function () {
      let { length } = this.data
      // console.log("length", length)
      let duration = Math.round(length) * 7 + 5000
      this.setData({
        duration: duration,
      })
      var animation = wx.createAnimation({
        duration: duration,
        timingFunction: 'linear',
        delay: 0,
      })
      // animation.translateX(375).step()
      // this.setData({
      //   ani:  animation.export()
      // })
      wx.nextTick(() => {
        //原值-(length+350)
        animation.translateX(-(length + 375)).step()
        this.setData({
          ani: animation.export(),
        })
      })
    },

    animationend() {
      // console.log("animationend...........")
      // this.setData({
      //   show:false
      // })
      var animation = wx.createAnimation({
        duration: 0,
        timingFunction: 'linear',
        delay: 0,
      })
      animation.translateX(340).step()
      this.setData({
        ani: animation.export(),
      })
      // this.setData({
      //   show:true
      // })
      let self = this
      setTimeout(() => {
        self.startAni()
      }, 500)
    },

    _scrolling: function () {
      // return;
      var _this = this
      const { interval } = this.data
      var timer = setInterval(() => {
        if (-_this.data.marqueeDistance < _this.data.length) {
          _this.setData({
            marqueeDistance: _this.data.marqueeDistance - _this.data.marqueePace,
          })
          this.setData({
            timer: timer,
          })
        } else {
          clearInterval(timer)
          _this.setData({
            // marqueeDistance: _this.data.windowWidth
            marqueeDistance: 375,
          })
          _this._scrolling()
        }
      }, interval)
    },

    dynamicLength() {
      var _this = this
      //选择器
      const query = wx.createSelectorQuery().in(this)
      query
        .select('#marquee_wrap')
        .boundingClientRect(function (rect) {
          console.log('rect', rect)
          _this.setData({
            length: rect.width,
          })
        })
        .exec()
    },
  },
})
