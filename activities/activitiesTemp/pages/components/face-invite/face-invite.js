import { actTemplateImgApi, actTemplateH5Addr } from '../../../../../api.js'
const actTempmetMethodsMixins = require('../../actTempmetMethodsMixins.js')
const commonMixin = require('../../commonMixin.js')
import { actEventClickTracking } from '../../../track/track.js'
Component({
  behaviors: [actTempmetMethodsMixins, commonMixin],
  // 属性定义（详情参见下文）
  properties: {
    props: {
      type: Object,
      value: {},
    },
    isShowFace: {
      type: Boolean,
      value: false,
      observer(newVal) {
        newVal && this.drawPic() //绘制canvas
      },
    },
    options: {
      type: Object,
      value: {},
    },
    userInfo: {
      type: Object,
      value: {},
    },
    pageSetting: {
      type: Object,
      value: {},
    },
  },
  data: {
    imgUrl: actTemplateImgApi.url,
    canvasLoadFlag: false,
    template: {},
    imagePath: '',
    paintPallette: {},
    customActionStyle: {
      border: {
        borderColor: '#1A7AF8',
      },
      scale: {
        textIcon: '/palette/switch.png',
        imageIcon: '/palette/scale.png',
      },
      delete: {
        icon: '/palette/close.png',
      },
    },
    btnInfo: {}, //保存按钮信息
  }, // 私有数据，可用于模板渲染

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {},
    moved: function () {},
    detached: function () {},
  },
  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () {}, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function () {},

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {},
    hide: function () {},
    resize: function () {},
  },
  methods: {
    actionHideModal() {
      this.setData({
        imagePath: '',
        paintPallette: null,
        canvasLoadFlag: false,
      })
      this.triggerEvent('closeFaceModal')
    },
    drawPic() {
      wx.showLoading({
        title: '生成中',
      })
      console.log('face======', this.properties.userInfo)
      console.log('options======', this.data.options)
      let currData = this.properties.props.containerList[0]
      let info = this.getInfoFromBasicList(currData.basicList)
      console.log('info=====', info)
      let inviteUserId = this.properties.userInfo.id
      let { gameId, channelId } = this.data.options
      let { fromSite } = this.data
      let shareUrl = `${actTemplateH5Addr.actHome.url}?gameId=${gameId}&channelId=${channelId}&fromSite=${fromSite}#/Invited?inviteUserId=${inviteUserId}&pageId=${info.qrcodeInfo.targetUrl}`
      console.log('shareurl=====', shareUrl)
      this.setData({
        btnInfo: info.btnInfo,
        paintPallette: {
          width: '600rpx',
          height: '910rpx',
          background: currData.background,
          views: [
            // {
            // 	type: 'image',
            // 	url: `${actTemplateImgApi.url}face-main-img.png`,
            // 	css: {
            // 		top: '0',
            // 		left: '49rpx',
            // 		width: '555rpx',
            // 		height: '356rpx'
            // 	}
            // },
            {
              type: 'qrcode',
              content: shareUrl,
              css: {
                top: `${info.qrcodeInfo.positionY}rpx`,
                left: `${info.qrcodeInfo.positionX}rpx`,
                borderWidth: '16rpx',
                borderColor: 'white',
                borderRadius: '2rpx',
                background: 'white',
                width: `${info.qrcodeInfo.width}rpx`,
                height: `${info.qrcodeInfo.width}rpx`,
              },
            },
          ],
        },
      })
    },
    onImgOK(e) {
      wx.hideLoading()
      this.setData({
        canvasLoadFlag: true,
        imagePath: e.detail.path,
      })
    },
    saveImage() {
      console.log('save==03151006==', this.data.imagePath)
      this.activityTrack()
      if (!this.data.imagePath) {
        return
      }
      let self = this
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.writePhotosAlbum']) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success() {
                console.log('授权成功')
                self.saveImageToPhotosAlbum()
              },
              fail() {
                wx.showModal({
                  title: '提示',
                  content: '若点击不授权，将无法使用保存图片功能',
                  cancelText: '不授权',
                  cancelColor: '#999',
                  confirmText: '授权',
                  confirmColor: '#f94218',
                  success(res) {
                    if (res.confirm) {
                      wx.openSetting({
                        success(res) {
                          console.log(res.authSetting)
                        },
                      })
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  },
                })
              },
            })
          } else {
            self.saveImageToPhotosAlbum()
          }
        },
      })
    },
    saveImageToPhotosAlbum() {
      wx.saveImageToPhotosAlbum({
        filePath: this.data.imagePath,
        fail() {
          wx.showModal({
            title: '无法保存',
            content: '请在iPhone的“设置-隐私-照片”选项中，允许微信访问你的照片',
            showCancel: false,
            confirmText: '好',
            success(res) {
              if (res.confirm) {
                //
              }
            },
          })
        },
        success(result) {
          console.log(result)
          wx.showToast({
            title: '保存图片成功',
          })
        },
      })
    },
    getInfoFromBasicList(basicList) {
      //custom 2-保存按钮 9-二维码
      let info = {
        qrcodeInfo: {},
        btnInfo: {},
      }
      basicList.forEach((item) => {
        if (item.custom == 2) {
          info.btnInfo = item
        } else if (item.custom == 9) {
          info.qrcodeInfo = item
        }
      })
      return info
    },
    //活动按钮字节埋点
    activityTrack() {
      let selectContainer = this.properties.props.containerList.length ? this.properties.props.containerList[0] : {}
      let basicItem = this.data.btnInfo
      const { options, pageSetting } = this.properties
      actEventClickTracking('activity_widget_event', options, pageSetting, selectContainer, basicItem)
    },
  },
})
