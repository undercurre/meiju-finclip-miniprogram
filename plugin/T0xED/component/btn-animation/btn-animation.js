import computedBehavior from '../../../../utils/miniprogram-computed'

Component({
  behaviors: [computedBehavior],
  data: {
    animationCounte: 0,
  },
  computed: {
    platform() {
      const info = wx.getSystemInfoSync()
      return info.platform
    },
    beforeDuration() {
      return this.data.platform == 'android' ? 'duration0' : 'duration1'
    },
    afterDuration() {
      return this.data.platform == 'android' ? 'duration1' : 'duration0'
    },
  },
  lifetimes: {
    attached() {
      //状态字底色动画  --冲洗  --加热
      setInterval((e) => {
        this.setData({ animationCounte: this.data.animationCounte + 1 })
      }, 1500)
    },
  },
})
