import { navigateToAll } from 'm-miniCommonSDK/index'
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    backTo: {
      type: String,
      value: '',
    },
    isInit: {
      type: Boolean,
      value: '',
      observer: function (val) {
        this.setCoverBg(val)
      },
    },
  },
  data: {
    // 这里是一些组件内部数据
    backImgBase:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAIqADAAQAAAABAAAAIgAAAAACeqFUAAAAy0lEQVRYCWNgGCSAkUJ3gPR7Qs3YDqT/U2geWdpBjpgLtRzkAC+yTKFQE7ojBsQh2BwxB+gxkDjdADZHgKJn1BGgNDEaEqBQGA0JWCiMhsRoSICK5jZoroCFBt3LCZAjuID4N5JD6O4IJpArgIAbiFnALAixD0iBQmZAwA6grbBo+QNkRw6IK4CWigLxJSAedQx6DIyGDHqIwPijIQMLCXR6NGTQQwTGHw0ZWEig04M+ZHTQXUwvPnrIJNDLYmz2iAAFJ0MxqCkx9AEA5SJ777yF7hMAAAAASUVORK5CYII=',
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'], //顶部状态栏的高度
    isShowCover: false,
  },
  methods: {
    clickBack() {
      if (!this.data.backTo) {
        wx.navigateBack({
          delta: 1,
          fail: (err) => {
            wx.switchTab({
              url: '/pages/index/index',
            })
          },
        })
        console.log('没传返回指定页面path')
        return
      }
      if (this.data.backTo) {
        navigateToAll(this.data.backTo)
      }
      this.triggerEvent('clickBack')
    },
    setCoverBg(val) {
      setTimeout(() => {
        this.setData({ isShowCover: val })
      }, 300)
    },
  },
})
