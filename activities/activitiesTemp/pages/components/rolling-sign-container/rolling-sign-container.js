import { gameRuleMap, dialogText } from '../../containerCommon.js'
import { actTemplateImgApi } from '../../../../../api.js'
const viewMoreLen = 7
Component({
  behaviors: [],
  // 属性定义（详情参见下文）
  properties: {
    props: {
      type: Object,
      value: {},
      observer(val) {
        this.getFormatterInitData(val)
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
    commonData: {
      type: Object,
      value: {},
    },
    tempMethod: {
      type: Object,
      value: {},
    },
    gameRule: {
      type: Array,
      value: [],
      observer(val) {
        this.getSelectGameRule(val)
      },
    },
    myProperty2: String, // 简化的定义方式
  },
  observers: {},
  data: {
    imgUrl: actTemplateImgApi.url,
    appParameter: '',
    selectGameRule: {
      channelType: 1, //参与渠道，1 ：不限 ，2：仅限美居app
      playType: 6, //玩法类型，1、邀请注册；2、邀请绑定设备；3、邀请加入家庭
    },
    containerData: {},
    signInfo: [],
    signInfoInit: [],
    isShowMore: false,
    moreOpen: false,
    moreText: '点击展开',
    signNotice: true,
    currentSignDay: 0,
    actionSignE: '',
  }, // 私有数据，可用于模板渲染

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      console.log('滚动签到容器', this.properties.props)
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
    actionToastClose() {},
    actionHotzoneDialog(e) {
      console.log('热区打开弹框1', e)
      const basicItem = e.detail.basicItem
      const selectContainer = e.detail.selectContainer
      const params = {
        basicItem: basicItem,
        selectContainer: selectContainer,
      }
      this.triggerEvent('actionHotzoneDialog', params)
    },
    actionInvite(e) {
      const item = e.currentTarget.dataset.item
      const params = {
        basicItem: item,
        selectContainer: this.properties.props,
      }
      console.log('邀请注册组件', params)
      this.triggerEvent('actionInvite', params)
    },
    actionLaunchAppError(e) {
      const basicItem = e.detail.basicItem
      const selectContainer = e.detail.selectContainer
      const params = {
        basicItem: basicItem,
        selectContainer: selectContainer,
      }
      this.triggerEvent('actionLaunchAppError', params)
    },
    actionLaunchAppSuccess(e) {
      const basicItem = e.detail.basicItem
      const selectContainer = e.detail.selectContainer
      const params = {
        basicItem: basicItem,
        selectContainer: selectContainer,
      }
      this.triggerEvent('actionLaunchAppSuccess', params)
    },
    // 接受邀请
    getPhoneNumber(e) {
      const item = e.currentTarget.dataset.item
      const params = {
        basicItem: item,
        selectContainer: this.properties.props,
      }
      this.triggerEvent('actionAcceptInvite', params)
    },
    acceptEvent(e) {
      console.log('acceptEvent...', e.currentTarget.dataset.item)
      const item = e.currentTarget.dataset.item
      const params = {
        basicItem: item,
        selectContainer: this.properties.props,
      }
      this.triggerEvent('actionAcceptInvite', params)
    },
    actionGetphonenumber(e) {
      console.log('授权手机号：', e)
      const item = e.currentTarget.dataset.item
      // const params = {
      //   basicItem: item,
      //   selectContainer: this.properties.props
      // }
      e.detail.basicItem = item
      e.detail.selectContainer = this.properties.props
      this.triggerEvent('actionGetphonenumber', e)
    },
    //熱区登录
    actionGetHotzonePhonenumber(e) {
      //从熱区传过来的参数会比原来多包装一层，实际e.detail才是原来传的值
      let { detail } = e
      //登录统一调用actionGetphonenumber方法，避免搞更多
      this.actionGetphonenumber(detail)
    },
    actionActStatus(e) {
      const status = e.target.dataset.status
      const params = {
        status,
      }
      this.triggerEvent('actionActStatus', params)
    },
    //没有引入actTempemtMethodsMixins.js,需要另外写判断渠道的方法
    //获取数据中对应玩法的参与渠道限制
    getSelectGameRule(list) {
      // 容器类型(1、通用容器；2、我的奖励卡片；3、邀请注册；4、邀请绑定设备；5、邀请加入家庭；6，任务盒子)
      if (list.length === 0) return
      const selectContainer = this.properties.props
      const selectGameRule = list.filter((item) => {
        return gameRuleMap[item.playType] == selectContainer.containerType
      })
      if (selectGameRule.length === 0) return
      //20211124改动，改动渠道字段channelType变为数组，[0]为不限制，[1,2,3] 1美居2微信小程序3支付宝
      if (
        (Array.isArray(selectGameRule[0].channelType) &&
          !(selectGameRule[0].channelType.includes(0) || selectGameRule[0].channelType.includes(2))) ||
        selectGameRule[0].channelType === 2
      ) {
        let min = selectGameRule[0].channelType === 2 ? 1 : Math.min(...selectGameRule[0].channelType)
        selectGameRule[0] = { ...selectGameRule[0], min: min, needLoad: true }
      } else {
        selectGameRule[0] = { ...selectGameRule[0], needLoad: false }
      }
      console.log('选中的gameRule=====', selectGameRule[0])
      this.setData({
        selectGameRule: selectGameRule[0],
      })
    },
    getConnectDirection(signInfoItem, rollSignInfo, index) {
      const idx = index + 1
      const len = rollSignInfo.currentSignDay
      const todaySignStatus = rollSignInfo.todaySignStatus
      // 1:左边，2：全部，3：右边
      if (idx % viewMoreLen == 1) return 3
      if (
        idx % viewMoreLen == 0 ||
        (signInfoItem.signStatus == 2 && idx == len && todaySignStatus == 2) ||
        (signInfoItem.signStatus == 0 && idx == len + 1)
      )
        return 1
      return 2
      // return signInfoItem.signStatus == 2 && idx < len ? true : false
    },
    checkIfShowConnect(signInfoItem, rollSignInfo, index) {
      const idx = index + 1
      const len = rollSignInfo.currentSignDay
      const todaySignStatus = rollSignInfo.todaySignStatus
      if (idx % viewMoreLen == 1 && signInfoItem.signStatus == 0) return false
      // if((idx % viewMoreLen) == 1 && signInfoItem.signStatus == 2 && idx == len ) return false
      if (idx % viewMoreLen == 1 && signInfoItem.signStatus == 2 && idx == len && todaySignStatus == 2) return false
      return signInfoItem.signStatus == 2 || signInfoItem.signStatus == 0 ? true : false
    },
    getFormatterInitData(selectContainer) {
      if (selectContainer.length == 0) return
      console.log('selectContainer', selectContainer)
      let { basicList, extraSetting, data } = selectContainer
      let rollSignInfo = data.rollSignInfo
      let signInfo = rollSignInfo.signInfo
      //日历签到设置奖品
      let dayAwardSettingInfo = rollSignInfo.dayAwardSettingInfo
      //连续签到设置奖品
      let stageAwardSettingInfo = rollSignInfo.stageAwardSettingInfo
      signInfo.forEach((signInfoItem, index) => {
        signInfoItem.signUrl = this.getSignUrl(signInfoItem, dayAwardSettingInfo, stageAwardSettingInfo, extraSetting)
        signInfoItem.isShowConnect = this.checkIfShowConnect(signInfoItem, rollSignInfo, index)
        signInfoItem.isShowConnectRight = this.getConnectDirection(signInfoItem, rollSignInfo, index)
      })
      // 滚动签到custom：1.点击签到;2.签到日历;3.签到提醒
      basicList.forEach((basicItem) => {
        if (basicItem.custom == 1) {
          basicItem.basicImgUrl = this.getSignButtonBg(basicItem, rollSignInfo, extraSetting)
        }
        // else if(basicItem.custom == 3) {
        //   basicItem.basicImgUrl = this.getSignNoticeBg(basicItem,dayAwardSettingInfo,stageAwardSettingInfo,extraSetting)
        // }
      })
      //需要把熱区排在数组的前面，其他的元素不变，不然熱区会错位，20210923修改添加
      let arr0 = []
      basicList = [
        ...basicList.filter((item) => {
          if (item.custom != 0) {
            arr0.push(item)
          }
          return item.custom == '0'
        }),
        ...arr0,
      ]
      arr0 = null
      //  end
      selectContainer.data.rollSignInfo.signInfo = signInfo
      selectContainer.basicList = basicList
      const signInfo7 = this.getSignInfo(signInfo)
      const isShowMore = this.checkIfShowMore(signInfo)
      const signNotice = this.getSignNotice(rollSignInfo)
      console.log('滚动签到处理后数据', selectContainer, signInfo)
      this.setData({
        containerData: selectContainer,
        signInfo: signInfo7,
        signInfoInit: signInfo,
        isShowMore: isShowMore,
        signNotice: signNotice,
        currentSignDay: rollSignInfo.currentSignDay || 0,
        rollSignInfo: rollSignInfo,
      })
      console.log('更多的开关11', this.data.moreOpen)
      // this.actionViewMore()
    },
    //getSignNoticeBg(basicItem, rollSignInfo, extraSetting) {},
    getSignNotice(rollSignInfo) {
      return rollSignInfo.signNotice == 1 ? true : false
    },
    getSignButtonBg(basicItem, rollSignInfo, extraSetting) {
      console.log(basicItem)
      //todaySignStatus当日签到状态,0-待签到，1-未签到,2-已签到，如果为0或1，
      //则对应extraSetting数组中type为1对象，值为2，对应type为2对象
      const mapSignButtonStatus = {
        0: 1,
        1: 1,
        2: 2,
      }
      const selectSeting = extraSetting.filter((item) => {
        return item.type == mapSignButtonStatus[rollSignInfo.todaySignStatus]
      })
      return selectSeting[0].url
    },
    getSignInfo(signInfo) {
      if (signInfo.length > viewMoreLen && !this.data.moreOpen) {
        return signInfo.slice(0, viewMoreLen)
      }
      return signInfo
    },
    actionViewMore() {
      const { signInfoInit, moreOpen } = this.data
      console.log('更多的开关', moreOpen)
      if (moreOpen) {
        this.setData({
          signInfo: signInfoInit.slice(0, viewMoreLen),
          moreText: '点击展开',
          moreOpen: !moreOpen,
        })
      } else {
        this.setData({
          signInfo: signInfoInit,
          moreText: '点击收起',
          moreOpen: !moreOpen,
        })
      }
    },
    checkIfShowMore(list) {
      return list.length > viewMoreLen ? true : false
    },
    getSignUrl(signInfoItem, dayAwardSettingInfo, stageAwardSettingInfo, extraSetting) {
      const mapSetDayAward = {
        0: 7,
        1: 8,
        2: 6,
      }
      const mapNoSetAward = {
        0: 4,
        1: 5,
        2: 3,
      }
      //extraSetting: type: 1:签到前按钮,2:签到后按钮,3:日历图标-已签到,4:日历图标-今日待签到,5:日历图标-未到签到日,6:奖励图标-已领取,7:奖励图标-今日待领取,8:奖励图标-未到签到日
      if (dayAwardSettingInfo.length > 0) {
        //0-今日待签到，1-未开始签到,2-已签到，如果值为0或1,则对应extraSetting数组中的type为1的对象，值为2，对应type为2对象
        const selectSeting = extraSetting.filter((item) => {
          return item.type == mapSetDayAward[signInfoItem.signStatus]
        })
        console.log('日历奖品规则', selectSeting)
        return selectSeting[0].url
      } else if (stageAwardSettingInfo.length > 0) {
        const hasStage =
          stageAwardSettingInfo.filter((item) => {
            console.log(
              '设置的阶梯',
              item.customizeType,
              signInfoItem.continueSign,
              item.customizeType == signInfoItem.continueSign
            )
            return item.customizeType == signInfoItem.continueSign
          }) || []
        console.log('阶梯奖品规则', hasStage)
        if (hasStage.length > 0) {
          const selectSeting = extraSetting.filter((item) => {
            return item.type == mapSetDayAward[signInfoItem.signStatus]
          })
          return selectSeting[0].url
        } else {
          const selectSeting = extraSetting.filter((item) => {
            return item.type == mapNoSetAward[signInfoItem.signStatus]
          })
          return selectSeting[0].url
        }
      } else {
        const selectSeting = extraSetting.filter((item) => {
          return item.type == mapNoSetAward[signInfoItem.signStatus]
        })
        return selectSeting[0].url
      }
    },
    launchAppError() {
      console.log('打开app')
      this.triggerEvent('actionLaunchAppError')
    },
    actionLaunchApp(e) {
      // let basicItem = e.currentTarget.dataset.item
      // this.activityTrack(basicItem)
      const item = e.currentTarget.dataset.item
      let loadType = e.currentTarget.dataset.loadtype
      const params = {
        basicItem: item,
        selectContainer: this.properties.props,
        content: loadType == 1 ? dialogText.toApp : dialogText.toZFB,
        nameList: loadType == 1 ? [dialogText.iKnow, dialogText.buttonToApp] : [dialogText.iKnow],
      }
      this.triggerEvent('actionLaunchAppDialog', params)
    },
    actionContainer(e) {
      const item = e.currentTarget.dataset.item
      const params = {
        basicItem: item,
        selectGameRule: this.data.selectGameRule,
        selectContainer: this.properties.props,
      }
      this.triggerEvent('actionContainer', params)
    },
    switch1Change(e) {
      console.log('提醒按钮开关1', e)
      //const { signNotice } = this.data
      this.setData({
        signNotice: !e.detail.value,
      })
      // if( signNotice ) {

      // }
      this.actionContainer(e)
    },
    actionSign(e) {
      const item = e.currentTarget.dataset.item
      const { todaySignStatus } = this.properties.props.data.rollSignInfo
      if (item.custom == 1 && todaySignStatus == 2) return

      this.actionContainer(e)
    },
    actionHotzoneCustom(e) {
      const basicItem = e.detail.basicItem
      const selectContainer = e.detail.selectContainer
      const params = {
        basicItem: basicItem,
        selectContainer: selectContainer,
      }
      this.triggerEvent('actionHotzoneCustom', params)
    },
  },
})
