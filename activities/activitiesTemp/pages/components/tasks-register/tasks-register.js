import { actTemplateImgApi } from '../../../../../api.js'
import { isEmptyObject } from 'm-utilsdk/index'
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
        console.log(newVal, 'newVal')
        !isEmptyObject(newVal) && this.initRegisterData()
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
      observer(newVal, oldVal) {
        console.log(newVal, oldVal)
        // this.getSelectGameRule(newVal)
      },
    },
  },

  data: {
    imgUrl: actTemplateImgApi.url,
    flag: false,
    gameRuleMap: {
      9: '10',
    },
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
    initRegisterData() {
      console.log('properties====', this.properties.props)
      console.log('新用户注册玩法刷新数据')
      let info = this.properties.props
      //let conList = this.properties.pageSetting.containerList
      // let awardCon= conList.filter(item=> item.containerType == 2 )
      // awardCon=awardCon.length ? awardCon[0] : {}
      // console.log('新用户注册奖励数据awardCon：',awardCon);
      this.setData({
        taskInfo: info.data.taskInfo,
        bgSettings: info.extraSetting.length ? info.extraSetting : [],
        taskState: info.data.taskInfo && info.data.taskInfo.userStatus ? info.data.taskInfo.userStatus : '',
        firstVisit: info.data.taskInfo && info.data.taskInfo.firstVisit ? true : false,
        awardList: info.data.awardsList && info.data.awardsList.length ? info.data.awardsList : [],
      })
      this.setCurrentBg()
      this.checkShowDialog()
    },
    setCurrentBg() {
      let currentSetting = this.data.bgSettings.filter((item) => {
        return item.type == this.data.taskState
      })
      if (this.data.commonData.isLogoutUser) {
        currentSetting = this.data.bgSettings.filter((item) => {
          return item.type == 4
        })
      }
      this.setData({
        currentBgSetting: currentSetting.length ? currentSetting[0] : {},
      })
      console.log(this.data.currentBgSetting, 'currentBgSetting')
    },
    checkShowDialog() {
      console.log('userStatus：', this.data.taskState)
      console.log('awardList:', this.data.awardList.length)
      console.log('firstVisit:', this.data.firstVisit)
      if (this.data.taskState == 2 && this.data.awardList.length == 0 && this.data.firstVisit) {
        // let imgUrl =`${this.data.imgUrl}newuser-wait.jpg`
        // const params = {
        //   basicItem: {},
        //   selectContainer: this.properties.props,
        //   imgUrl
        // }
        //20211021改成弹窗配置化
        console.log(this.data.taskInfo)
        let pageId = this.data.taskInfo ? this.data.taskInfo.pageId : ''
        const params = {
          pageId: pageId,
          selectContainer: this.properties.props,
        }
        this.triggerEvent('actionContainer', params)
      }
    },
    actionGetphonenumber(e) {
      console.log('授权手机号：', e)
      const item = e.currentTarget.dataset.item
      e.detail.basicItem = item
      e.detail.selectContainer = this.properties.props
      this.triggerEvent('actionGetphonenumber', e)
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
