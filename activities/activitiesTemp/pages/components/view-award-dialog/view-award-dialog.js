import { actTemplateImgApi } from '../../../../../api.js'
import { getPageUrl } from '../../../../../utils/util.js'
import { viewActEventClickTracking } from '../../../track/track.js'
import { actTemplateReceiveAdress } from '../../path.js'
import { dialogText } from '../../containerCommon.js'
Component({
  behaviors: [],
  // 属性定义（详情参见下文）
  properties: {
    isShowAwardDialog: {
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
    // 奖励数据
    props: {
      type: Object,
      value: {},
    },
    // 奖励页面配置
    awardPageSetting: {
      type: Object,
      value: {},
    },
    // 奖励容器
    awardContainerInfo: {
      type: Object,
      value: {},
    },
    pageSetting: {
      type: Object,
      value: {},
    },
    basicSetting: {
      type: Object,
      value: {},
    },
    options: {
      type: Object,
      value: {},
    },
  },

  data: {
    imgUrl: actTemplateImgApi.url,
    isShowDialog1: false,
    animationData: {},
  }, // 私有数据，可用于模板渲染

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {},
    moved: function () {},
    detached: function () {},
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () {}, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function () {
    this.animation = wx.createAnimation()
  },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {},
    hide: function () {},
    resize: function () {},
  },
  methods: {
    scale() {
      console.log('显示')
      this.animation.scale(0, 0).step()
      this.setData({ animationData: this.animation.export() })
      this.setData({
        isShowDialog1: true,
      })
      setTimeout(() => {
        this.animation.scale(1, 1).step()
        this.setData({ animationData: this.animation.export() })
      }, 400)
    },
    scale1() {
      console.log('关闭')
      this.animation.scale(0, 0).step()
      this.setData({ animationData: this.animation.export() })
      setTimeout(() => {
        this.setData({
          isShowDialog1: false,
        })
      }, 500)
    },
    actionDialogClose() {
      this.triggerEvent('actionDialogClose')
    },
    // 按钮点击处理
    handleClickBtn(e) {
      let self = this
      let item = e.currentTarget.dataset.item
      let props = this.properties.props
      let awardContainerInfo = this.properties.awardContainerInfo
      this.activityTrack(item)
      let params = {
        basicItem: item,
        selectContainer: this.properties.props,
      }
      if (item.custom == 10 && awardContainerInfo.lastDrawNum && awardContainerInfo.lastDrawNum > 0) {
        // 再抽一次
        this.triggerEvent('actionDrawAgain', params)
      } else if (props.prizeType == 0) {
        // 实物
        // this.goAddress()
        const awardsInfo = props
        const basicItem = item
        awardsInfo['prizeType'] =
          awardsInfo['prizeType'] || awardsInfo['prizeType'].toString() == '0'
            ? awardsInfo['prizeType']
            : awardsInfo.type
        const prizeId = awardsInfo.prizeId
        const from = 'view-award-dialog'
        let params = {
          from,
          awardsInfo,
          prizeId,
          basicItem,
        }
        this.actionDialogClose()
        this.triggerEvent('actionReceive', params)
      } else if (props.prizeType == 1) {
        // 红包
        this.actionDialogClose()
        setTimeout(() => {
          self.actionLaunchApp(e)
        }, 500)
      } else if (props.prizeType == 3 || props.prizeType == 4) {
        // 优惠券，清洗券
        this.actionBtnCopy()
      } else if (props.prizeType == 5) {
        // 多奖励  两个按钮
        if (item.target == 1) {
          //关闭按钮
          this.actionDialogClose()
        } else if (item.target == 2) {
          //
        }
      } else if (props.prizeType == 9) {
        const awardsInfo = props
        const basicItem = item
        const prizeId = awardsInfo.prizeId
        const from = 'view-award-dialog'
        awardsInfo['pageId'] = item.targetUrl
        let params = {
          from,
          awardsInfo,
          prizeId,
          basicItem,
        }
        this.actionDialogClose()
        this.triggerEvent('actionReceive', params)
      } else if (props.prizeType == 6 || props.prizeType == 8 || props.prizeType == undefined) {
        // 抽奖机会
        this.actionDialogClose()
      } else {
        console.log('暂无对此热区的处理：', item)
      }
    },
    goAddress() {
      this.actionDialogClose()
      let { prizeId } = this.properties.props
      const { gameId, channelId } = this.data.options
      wx.navigateTo({
        url: `${actTemplateReceiveAdress}?prizeId=${prizeId}&gameId=${gameId}&channelId=${channelId}`,
      })
    },
    actionLaunchApp(e) {
      const item = e.currentTarget.dataset.item
      const params = {
        basicItem: item,
        selectContainer: this.properties.props,
        content: dialogText.toApp,
        nameList: [dialogText.iKnow, dialogText.buttonToApp],
        from: 'real-gift',
      }
      this.triggerEvent('actionLaunchAppDialog', params)
    },
    //活动按钮字节埋点
    activityTrack(basicItem) {
      const { options } = this.data
      let pageSetting = this.properties.awardPageSetting
      let initData = this.properties.pageSetting
      options['path'] = getPageUrl()
      let selectContainer = pageSetting['containerList'][0]
      viewActEventClickTracking('activity_widget_event', options, initData, pageSetting, selectContainer, basicItem)
    },
    actionBtnCopy() {
      wx.setClipboardData({
        data: this.properties.props.virtualCouponCode || '',
      })
    },
  },
})
