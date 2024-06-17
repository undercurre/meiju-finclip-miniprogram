import { actTemplateImgApi } from '../../../../../api.js'
import { viewActEventClickTracking } from '../../../track/track.js'
import { getPageUrl } from '../../../../../utils/util.js'
//let baseUrl = 'http://fcmms.midea.com/cmimp_beta/file/1/20210311/'
Component({
  behaviors: [],
  // 属性定义（详情参见下文）
  properties: {
    isShowRewardDialog: {
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
    props: {
      type: Object,
      value: {},
    },
    options: {
      type: Object,
      value: {},
    },
    // 奖励页面配置
    composePageSetting: {
      type: Object,
      value: {},
      observer(newVal) {
        console.log('ererererer', newVal)
      },
    },
    // 奖励容器
    composeContainerInfo: {
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
    handleClickBtn(e) {
      let item = e.currentTarget.dataset.item
      //let props = this.properties.props
      //let awardContainerInfo = this.properties.awardContainerInfo
      this.activityTrack(item)
      //custom:14 知道了按钮，custom：15查看奖励按钮
      if (item.custom == 14) {
        this.actionDialogClose()
      }
      if (item.custom == 15) {
        this.goRewardList(e)
      }
    },
    actionDialogClose() {
      this.triggerEvent('actionDialogClose')
    },
    goRewardList() {
      console.log(this.properties.options)
      let { gameId, channelId } = this.properties.options
      let targetUrl = this.properties.props.awardPageId
      this.actionDialogClose()
      let currUrl = `/activities/activitiesTemp/pages/rewardList/rewardList?pageId=${targetUrl}&gameId=${gameId}&channelId=${channelId}&fromSite=1&os=1`
      wx.navigateTo({
        url: currUrl,
      })
    },
    //活动按钮字节埋点
    activityTrack(basicItem) {
      const { options } = this.properties
      let initData = this.properties.pageSetting
      let pageSetting = this.properties.composePageSetting
      options['path'] = getPageUrl()
      let selectContainer = pageSetting['containerList'][0]
      viewActEventClickTracking('activity_widget_event', options, initData, pageSetting, selectContainer, basicItem)
    },
    // //活动按钮字节埋点
    // activityTrack(basicItem) {
    //   const { options } = this.data
    //   let pageSetting = this.properties.composePageSetting
    //   options['path'] = getPageUrl()
    //   let selectContainer = pageSetting['containerList'][0]
    //   actEventClickTracking("activity_widget_event", options, pageSetting, selectContainer, basicItem)
    // }
  },
})
