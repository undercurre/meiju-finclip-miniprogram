import { actTemplateImgApi } from '../../../../../api.js'
import { actEventClickTracking } from '../../../track/track.js'
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
    },
    options: {
      type: Object,
      value: {},
    },
    isLogon: {
      type: Boolean,
      observer(newVal) {
        this.initTaskData(newVal)
      },
    },
    pageSetting: {
      type: Object,
      value: {},
    },
    commonData: {
      type: Object,
      value: {},
    },
    gameRule: {
      type: Array,
      value: [],
      observer(newVal) {
        this.getSelectGameRule(newVal)
      },
    },
  },

  data: {
    imgUrl: actTemplateImgApi.url,
    flag: false,
    selectGameRule: {
      channelType: 1, //参与渠道，1 ：不限 ，2：仅限美居app
      playType: 4, //玩法类型，1、邀请注册；2、邀请绑定设备；3、邀请加入家庭； 4、任务盒子
    },
    gameRuleMap: {
      1: '3',
      2: '4',
      4: '6',
      19: '20',
      18: '19',
    },
    bgSettings: [],
    currentBgSetting: {},
    isAwardStock: true,
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
    async initTaskData(isLogin) {
      console.log('properties====', this.properties.props)
      let info = this.properties.props
      if (info.containerType == 6) {
        this.setData({
          bgSettings: info.containerType == 6 && info.extraSetting.length ? info.extraSetting : [],
        })
        if (!isLogin) return
        let res = await this.isCheckTaskAwardStock(info, '0')
        if (res.code == 2) {
          //库存不足
          this.setCurrentBg()
          this.setData({
            isAwardStock: false,
          })
        }
      } else if (info.containerType == 19 || info.containerType == 20) {
        this.isCheckAwardStock(info).then((res) => {
          if (res.code == 2) {
            this.setData({
              isAwardStock: false,
            })
          }
        })
      }
    },
    // 设置背景图
    setCurrentBg() {
      let currentSetting = this.data.bgSettings.filter((item) => {
        return item.type == 1
      })
      this.setData({
        currentBgSetting: currentSetting.length ? currentSetting[0] : {},
      })
    },
    actionGetphonenumber(e) {
      console.log('授权手机号：', e)
      const item = e.currentTarget.dataset.item
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
    //活动按钮字节埋点
    activityTrack(basicItem) {
      let selectContainer = this.properties.props
      const { options, pageSetting } = this.properties
      actEventClickTracking('activity_widget_event', options, pageSetting, selectContainer, basicItem)
    },
    //跟其他的组件不同，需要重写
    actionLaunchApp(e) {
      let basicItem = e.currentTarget.dataset.item
      let loadType = e.currentTarget.dataset.loadtype
      if (basicItem.custom == 2) {
        return
      }
      let params = {
        from: 'task',
        basicItem: basicItem,
        selectContainer: this.properties.props,
        content: loadType == 1 ? dialogText.toApp : dialogText.toZFB,
        nameList: loadType == 1 ? [dialogText.iKnow, dialogText.buttonToApp] : [dialogText.iKnow],
      }
      this.triggerEvent('actionLaunchAppDialog', params)
    },
    actionHotzoneCustom(e) {
      this.triggerEvent('actionHotzoneCustom', e.detail)
    },
    //因与公共的判断渠道方法不一样，需要重写
    //判断渠道
    getSelectGameRule(list) {
      // 容器类型(1、通用容器；2、我的奖励卡片；3、邀请注册；4、邀请绑定设备；5、邀请加入家庭；6，任务盒子)
      //props.containerType==16||props.containerType==18||props.containerType==22||selectGameRule.channelType =='2'
      if (list.length === 0) return
      const selectContainer = this.properties.props
      const selectGameRule = list.filter((item) => {
        if (item.playType != 5) {
          return this.data.gameRuleMap[item.playType] == selectContainer.containerType
        } else {
          let taskId
          if (selectContainer.data.taskExtendInfo) {
            taskId = selectContainer.data.taskExtendInfo.taskId
          } else if (selectContainer.data.taskInfo) {
            taskId = selectContainer.data.taskInfo.id
          }
          return item.taskId == taskId
        }
      })
      if (selectContainer.containerType == 16) {
        selectGameRule[0] = {
          channelType: [1],
          playType: 5,
        }
      }
      if (selectGameRule.length === 0) return
      //20211124改动，改动渠道字段channelType变为数组，[0]为不限制，[1,2,3] 1美居2微信小程序3支付宝
      // "16": "my-task", //"任务盒子-分享美的美居"
      // "18": "my-task", //"任务盒子-创建场景并启用"
      // "22": "my-task", //"任务盒子-分享食谱（发现页-美食）"
      // 16 18 22 固定引导到app
      if (
        selectContainer.containerType == 16 ||
        selectContainer.containerType == 18 ||
        selectContainer.containerType == 22
      ) {
        selectGameRule[0].min = 1
        selectGameRule[0].needLoad = true
      } else if (
        (Array.isArray(selectGameRule[0].channelType) &&
          !(selectGameRule[0].channelType.includes(0) || selectGameRule[0].channelType.includes(2))) ||
        selectGameRule[0].channelType === 2
      ) {
        let min = selectGameRule[0].channelType === 2 ? 1 : Math.min(...selectGameRule[0].channelType)
        selectGameRule[0] = { ...selectGameRule[0], min: min, needLoad: true }
      } else {
        selectGameRule[0] = { ...selectGameRule[0], needLoad: false }
      }
      console.log(selectGameRule)
      this.setData({
        selectGameRule: selectGameRule[0],
      })
      console.log(this.data.selectGameRule)
    },
    actionHotzoneDialog(e) {
      console.log('热区打开弹框1', e)
      this.triggerEvent('actionHotzoneDialog', e.detail)
    },
    actionLaunchAppError(e) {
      this.triggerEvent('actionLaunchAppError', e.detail)
    },
    actionLaunchAppSuccess(e) {
      this.triggerEvent('actionLaunchAppSuccess', e.detail)
    },
    actionActStatus(e) {
      const status = e.target.dataset.status
      const params = {
        status,
      }
      this.triggerEvent('actionActStatus', params)
    },
    actionContainer(e) {
      const item = e.currentTarget.dataset.item
      const params = {
        basicItem: item,
        selectContainer: this.properties.props,
      }
      const isAwardStock = e.currentTarget.dataset.isawardstock
      if (isAwardStock !== undefined) {
        params['isAwardStock'] = isAwardStock
      }
      this.triggerEvent('actionContainer', params)
    },
    showUpperLimit() {
      this.triggerEvent('showUpperLimit')
    },
  },
})
