Component({
  /**
   * 组件的属性列表
   */
  properties: {
    fromApp: {
      type: Boolean,
      value: false
    },
    appParameter: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //返回app错误回调
    launchAppError(e) {
      wx.showToast({
        title: '未找到美居App，\r\n请确认您的手机是否安装。',
        icon: 'none',
        duration: 2000
      })
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/download/download',
        })
      }, 2000)
    }
  }
})