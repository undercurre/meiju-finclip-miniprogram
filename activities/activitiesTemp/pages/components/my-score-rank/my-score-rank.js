// activities/activitiesTemp/pages/components/my-score-rank/my-score-rank.js
import { actTemplateImgApi } from '../../../../../api.js'
import { isEmptyObject } from 'm-utilsdk/index'
const actTempmetMethodsMixins = require('../../actTempmetMethodsMixins.js')
const commonMixin = require('../../commonMixin.js')
Component({
  behaviors: [actTempmetMethodsMixins, commonMixin],
  /**
   * 组件的属性列表
   */
  properties: {
    props: {
      type: Object,
      value: {},
      observer(newVal) {
        !isEmptyObject(newVal) && this.initRankData()
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
    commonData: {
      type: Object,
      value: {},
    },
    gameRule: {
      type: Array,
      value: [],
      observer() {
        // this.getSelectGameRule(newVal)
      },
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: actTemplateImgApi.url,
    selectGameRule: {
      channelType: 1, //参与渠道，1 ：不限 ，2：仅限美居app
      playType: 4, //玩法类型，1、邀请注册；2、邀请绑定设备；3、邀请加入家庭； 4、任务盒子
    },
    gameRuleMap: {
      1: '3',
      2: '4',
      4: '6',
    },
    bgSettings: [],
    nologinSetting: {},
    isTaping: false,
  }, // 私有数据，可用于模板渲染

  /**
   * 组件的方法列表
   */
  methods: {
    initRankData() {
      console.log('积分排行properties.props=====', this.properties.props)
      let conData = this.properties.props
      //let isLogon = this.properties.isLogon
      let propScoreInfo = conData.data.propScoreInfo ? conData.data.propScoreInfo : {}
      this.setData({
        bgSettings: conData.extraSetting.length ? conData.extraSetting : [],
        myTotalScore: propScoreInfo.propNum >= 0 ? propScoreInfo.propNum : '',
        myScoreRank: propScoreInfo.propNum > 0 ? propScoreInfo.propRank : '-',
      })
      this.setNologinBg()
    },
    // 设置未登录背景图
    setNologinBg() {
      let nologinSettings = this.data.bgSettings.filter((item) => {
        return item.type == 1
      })
      this.setData({
        nologinSetting: nologinSettings.length ? nologinSettings[0] : {},
      })
      console.log(this.data.nologinSetting, 'nologinSetting')
    },
    async actionContainer(e) {
      if (this.data.isTaping) return
      this.setData({
        isTaping: true,
      })
      const item = e.currentTarget.dataset.item
      if (item.custom == 4) {
        console.log('查看榜单详情pageId', item.targetUrl)
        try {
          let res = await this.getScorePageId()
          item.targetUrl = res.data.data && res.data.data.scorePageId ? res.data.data.scorePageId : ''
        } catch (error) {
          this.setData({
            isTaping: false,
          })
          return
        }
        console.log('查看榜单详情更换后pageId', item.targetUrl)
      }
      setTimeout(() => {
        this.setData({
          isTaping: false,
        })
      }, 1500)
      const params = {
        basicItem: item,
        selectContainer: this.properties.props,
      }

      this.triggerEvent('actionContainer', params)
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
    actionHotzoneCustom(e) {
      this.triggerEvent('actionHotzoneCustom', e.detail)
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
  },
})
