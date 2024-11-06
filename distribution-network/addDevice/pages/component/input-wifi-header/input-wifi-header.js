import { baseImgApi } from '../../../../../api'
const backIconColor = getApp().globalData.brandConfig[getApp().globalData.brand].backButtonColor
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    // isNavCancel:{

    // },
    isNavCancel: {
      type: Boolean,
      value: false,
    },
    buttonColor: {
      type: String,
      value: 'black'
    },
    backText: {
      type: String,
      value: '取消'
    },
    pdLeft: {
      type: String,
      value: '32'
    },
	fontSize: {
		type: String,
		value: '18'
	},
	opacity: {
		type: String,
		value: '1'
	},
    brandName:{
      type:String,
      value:getApp().globalData.brand
    },
    // isCustomClick 是否自定义点击事件
    isCustomClick: {
      type:Boolean,
      value: false
    }
  },
  data: {
    // 这里是一些组件内部数据
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'], //顶部状态栏的高度
    baseImgUrl: baseImgApi.url,
    backIcon:`/distribution-network/addDevice/pages/assets/img/ic_back_${backIconColor}@3x.png`,
  },
  methods: {
    clickCancel() {
      this.triggerEvent('clickCancel')
    },
    back() {
      const this_ = this
      if (this.clickFLag) return
      this.clickFLag = true

      // 是否自定义点击事件
      if(this.data.isCustomClick) {
        return this.triggerEvent('clickCancel')
      }

      if (getCurrentPages().length < 2) {
        wx.reLaunch({
          url: '/pages/index/index',
          complete() {
            this_.clickFLag = false
          }
        })
      } else {
        wx.navigateBack({
          delta: 1,
          complete() {
            this_.clickFLag = false
          }
        })
      }
    },
  },
})
