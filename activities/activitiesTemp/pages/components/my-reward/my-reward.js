import { actTemplateImgApi, actTemplateH5Addr } from '../../../../../api.js'
import { actEventClickTracking } from '../../../track/track.js'
import { isEmptyObject } from 'm-utilsdk/index'
import { dialogText } from '../../containerCommon.js'
const actTempmetMethodsMixins = require('../../actTempmetMethodsMixins.js')
const commonMixin = require('../../commonMixin.js')
Component({
  behaviors: [actTempmetMethodsMixins, commonMixin],
  // 属性定义（详情参见下文）
  properties: {
    props: {
      type: Object,
      value: {},
      observer(newVal) {
        !isEmptyObject(newVal) && this.initRewardData()
      },
    },
    options: {
      type: Object,
      value: {},
    },
    isLogon: {
      type: Boolean,
      value: false,
    },
    pageSetting: {
      type: Object,
      value: {},
    },
  },

  data: {
    imgUrl: actTemplateImgApi.url,
    flag: false,
    awardsList: [],
    awardsInfo: {},
    cardPageSetting: {},
    cardContainerInfo: {},
    isShowCardDialog: false,
    isShowMoneyDialog: false,
    isShowLogisticsDialog: false,
    logisticsData: {},
    clickFlag: false, //防暴击
    // 新增滑块验证
    captchaShow: false,
    captchaReload: false,
    actionLaunchAppE: '',
    actionReceiveE: '',
  }, // 私有数据，可用于模板渲染

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      console.log('options==reward==1729', this.properties.options)
      // 处理options
      const { gameId, channelId } = this.data.options
      const { fromSite } = this.data
      const encodeWeexUrl = encodeURIComponent(
        actTemplateH5Addr.actHome.url + `?gameId=${gameId}&channelId=${channelId}&fromSite=${fromSite}`
      )
      const appHomePage = `midea-meiju://com.midea.meiju/main?type=jumpWebView&url=${encodeWeexUrl}&needNavi=1`
      console.log('app-param==========', appHomePage)
      this.setData({
        appParameter: appHomePage,
      })
    },
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
    goRewardList(e) {
      const item = e.currentTarget.dataset.item
      console.log('goreward====', item)
      const params = {
        basicItem: item,
        selectContainer: this.properties.props,
      }
      this.triggerEvent('actionGoRewardList', params)
    },
    initRewardData() {
      console.log('properties====', this.properties.props)
      let info = this.properties.props
      //info.data.awardsList[0].status = 0
      this.setData({
        awardsList: info.data.awardsList,
        awardsInfo: info.data.awardsList != null ? (info.data.awardsList.length ? info.data.awardsList[0] : {}) : {},
      })
      console.log('awardsInfo====', info.data.awardsList)
    },
    //活动按钮字节埋点
    activityTrack(basicItem) {
      let selectContainer = this.properties.props
      const { options, pageSetting } = this.properties
      actEventClickTracking('activity_widget_event', options, pageSetting, selectContainer, basicItem)
    },
    actionViewCard(e) {
      let { clickFlag } = this.data
      if (clickFlag) return
      this.setData({
        clickFlag: true,
      })
      let item = this.data.awardsInfo
      let basicItem = e.currentTarget.dataset.item
      this.activityTrack(basicItem)
      item['targetUrl'] = e.currentTarget.dataset.targeturl || ''
      console.log('card=====', item)
      //状态 0 未领取 1已领取 2已发放,3发放失败
      // 奖品类型：  类型列表请查看containerMixins
      if (item.type == '3' || item.type == '4') {
        this.getViewCardData(item['targetUrl'])
          .then((res) => {
            this.setData({
              cardPageSetting: res,
              cardContainerInfo: res.containerList.length ? res.containerList[0] : {},
              cardSelectItem: item,
              isShowCardDialog: true,
              clickFlag: false,
            })
          })
          .catch(() => {
            this.setData({
              clickFlag: false,
            })
          })
      } else if (item.type == '1') {
        this.setData({
          moneySelectItem: item,
          isShowMoneyDialog: true,
          clickFlag: false,
        })
      }
    },
    actionViewHelp() {
      let item = this.data.awardsInfo
      console.log('card=====', item)
      // 奖品类型： 0 实物奖品，1现金红包，2虚拟券 ？？？未知
      if (item.type == '2') {
        this.setData({
          cardSelectItem: item,
          isShowCardDialog: true,
        })
      } else if (item.type == '1') {
        this.setData({
          moneySelectItem: item,
          isShowMoneyDialog: true,
        })
      }
    },
    actionCardDialogClose() {
      console.log('actionCardDialogClose')
      this.setData({
        isShowCardDialog: false,
      })
    },
    actionMoneyDialogClose() {
      this.setData({
        isShowMoneyDialog: false,
      })
    },
    actionGetphonenumber(e) {
      console.log('授权手机号：', e)
      // let basicItem = e.currentTarget.dataset.item
      // this.activityTrack(basicItem)
      const item = e.currentTarget.dataset.item
      e.detail.basicItem = item
      e.detail.selectContainer = this.properties.props
      this.triggerEvent('actionGetphonenumber', e)
    },
    actionReceive(e) {
      let isBeInvite = false
      let page = getCurrentPages()
      if (page[page.length - 1].route.includes('inviteToFamily') || page[page.length - 1].route.includes('beInvite')) {
        isBeInvite = true
      }
      const basicItem = e.currentTarget.dataset.item
      const awardsInfo = this.data.awardsInfo
      awardsInfo['prizeType'] = awardsInfo['prizeType'] || awardsInfo.type
      const prizeId = this.data.awardsInfo.prizeId
      const from = 'my-reward'
      this.activityTrack(basicItem)
      let params = {
        from,
        awardsInfo,
        prizeId,
        basicItem,
        isBeInvite,
      }
      this.triggerEvent('actionReceive', params)
    },
    actionCheckCharge(e) {
      const basicItem = e.currentTarget.dataset.item
      const awardsInfo = this.data.awardsInfo
      awardsInfo['prizeType'] = awardsInfo['prizeType'] || awardsInfo.type
      const prizeId = this.data.awardsInfo.prizeId
      const from = 'my-reward'
      this.activityTrack(basicItem)
      let params = {
        from,
        awardsInfo,
        prizeId,
        basicItem,
        isBeInvite: false,
      }
      this.triggerEvent('actionCheckCharge', params)
    },
    getViewCardData(pageId) {
      return new Promise((resolve, reject) => {
        this.getGamePage_token(pageId, false)
          .then((res) => {
            console.log('view===init=====', res)
            let currData = res.data.data.pageSetting
            resolve(currData)
          })
          .catch((e) => {
            console.log('rewardlist---view-card-dialog========', e)
            reject(e)
          })
      })
    },
    actionLaunchApp(e) {
      const item = e.currentTarget.dataset.item
      const params = {
        from: 'reward',
        basicItem: item,
        selectContainer: this.properties.props,
        content: dialogText.toApp,
        nameList: [dialogText.iKnow, dialogText.buttonToApp],
      }
      this.triggerEvent('actionLaunchAppDialog', params)
    },
    actionGoLogistics(e) {
      console.log(e)
      this.setData({
        logisticsData: this.data.awardsInfo,
        isShowLogisticsDialog: true,
      })
    },
    actionLogisticsDialogClose() {
      this.setData({
        isShowLogisticsDialog: false,
      })
    },
    actionGoAddress(e) {
      let { prizeId } = this.data.awardsInfo
      let basicItem = e.currentTarget.dataset.item
      this.activityTrack(basicItem)
      this.triggerEvent('actionGoAddress', prizeId)
    },
  },
})
