// activities/activitiesTemp/pages/components/view-address-dialog/view-address-dialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShowConfirmDialog: {
      type: Boolean,
      value: false,
      observer(newVal) {
        if (newVal) {
          this.scale()
        } else {
          this.scale1()
        }
      },
    },
    form: {
      type: Object,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShowDialog: false,
    animationData: {},
  },

  ready: function () {
    this.animation = wx.createAnimation()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    sure() {
      // this.onMaskHide()
      this.setData({
        isShowConfirmDialog: false,
      })
      let params = this.data.form
      this.triggerEvent('submitAddress', params)
      // console.log('提交的地址',this.data.form)
    },
    cancel() {
      // this.onMaskHide()
      this.setData({
        isShowConfirmDialog: false,
      })
    },
    onMaskHide() {
      this.setData({
        // isShowConfirmDialog:false
        isShowConfirmDialog: true,
      })
    },

    scale() {
      console.log('显示')
      this.animation.scale(0, 0).step()
      this.setData({ animationData: this.animation.export() })
      setTimeout(() => {
        this.setData({
          isShowDialog: true,
        })
        // setTimeout(() => {
        this.animation.scale(1, 1).step()
        this.setData({ animationData: this.animation.export() })
        // }, 300)
      }, 500)
    },
    scale1() {
      console.log('关闭')
      this.animation.scale(0, 0).step()
      this.setData({ animationData: this.animation.export() })
      setTimeout(() => {
        this.setData({
          isShowDialog: false,
        })
      }, 200)
    },
  },
})
