import { actTemplateH5Addr } from '../../../../../api.js'
import { getReqId, getStamp } from 'm-utilsdk/index'
const commonMixin = require('../../commonMixin.js')
Component({
  behaviors: [commonMixin],
  // 属性定义（详情参见下文）
  properties: {
    myProperty: {
      // 属性名
      type: String,
      value: '',
    },
    myProperty2: String, // 简化的定义方式
    props: {
      type: Object,
      value: {},
      observer(newVal) {
        if (newVal.target == 9) {
          this.actionGetCurrentHome()
        }
      },
    },
    options: {
      type: Object,
      value: {},
    },
    commonData: {
      type: Object,
      value: {},
    },
    selectContainer: {
      type: Object,
      value: {},
    },
    isLogon: {
      type: Boolean,
      value: false,
    },
  },

  data: {
    style: '',
    currentHome: {},
    path: '',
    isHomeowner: false,
    isFullFamilyPeople: false,
  }, // 私有数据，可用于模板渲染

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      const { gameId, channelId } = this.properties.options
      const { fromSite } = this.data
      const encodeWeexUrl = encodeURIComponent(
        actTemplateH5Addr.actHome.url + `?gameId=${gameId}&channelId=${channelId}&fromSite=${fromSite}`
      )
      const appHomePage = `midea-meiju://com.midea.meiju/main?type=jumpWebView&url=${encodeWeexUrl}&needNavi=1`
      const { props } = this.properties
      const style = `width:${props.width}rpx;height:${props.height}rpx;background-image:url(${props.basicImgUrl});background-size:100% auto;background-repeat:no-repeat;top: ${props.positionY}rpx;left: ${props.positionX}rpx;z-index: ${props.positionZ}`
      console.log('热区11', this.properties.options, fromSite, appHomePage)
      this.setData({
        style: style,
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
    actionGetReward() {
      console.log('领取按钮')
    },
    actionHotzoneDialog(e) {
      const item = e.currentTarget.dataset.item
      console.log('热区组件1', e)
      const params = {
        basicItem: item,
        selectContainer: this.properties.selectContainer,
      }
      this.triggerEvent('actionHotzoneDialog', params)
    },
    launchAppError(e) {
      const item = e.currentTarget.dataset.item
      const params = {
        basicItem: item,
        selectContainer: this.properties.selectContainer,
      }
      console.log('打开app失败')
      this.triggerEvent('actionLaunchAppError', params)
    },
    launchAppSuccess(e) {
      const item = e.currentTarget.dataset.item
      const params = {
        basicItem: item,
        selectContainer: this.properties.selectContainer,
      }
      console.log('打开app成功')
      this.triggerEvent('actionLaunchAppSuccess', params)
    },
    actionGetHotzonePhonenumber(e) {
      this.triggerEvent('actionGetHotzonePhonenumber', e)
    },
    actionActStatus() {
      this.triggerEvent('actionActStatus')
    },
    actionHotzoneCustom(e) {
      const item = e.currentTarget.dataset.item
      const isFullFamilyPeople = this.data.isFullFamilyPeople
      const isHomeowner = this.data.isHomeowner
      item.isFullFamilyPeople = isFullFamilyPeople
      item.isHomeowner = isHomeowner
      let params = {
        basicItem: item,
        selectContainer: this.properties.selectContainer,
      }
      if (isFullFamilyPeople === true) {
        params['isFullFamilyPeople'] = isFullFamilyPeople
      }
      if (isHomeowner === false) {
        params['isHomeowner'] = isHomeowner
      }
      console.log('params', params)
      this.triggerEvent('actionHotzoneCustom', params)
    },
    actionGetCurrentHome() {
      if (!this.properties.isLogon) {
        return
      }
      let reqData = {
        reqId: getReqId(),
        stamp: getStamp(),
      }
      this.getHomeList(reqData).then((res) => {
        let defaultHome = undefined
        //判断是否有当前家庭
        let array = res.data.data.homeList.filter((item) => {
          return item.isDefault == '1'
        })
        //有当前家庭选当前家庭为“判断家庭"，没有当前家庭选家庭列表第一个为"判断家庭"
        if (array.length > 0) {
          defaultHome = array[0]
        } else {
          defaultHome = res.data.data.homeList[0]
        }
        //判断“判断家庭”是否是家庭主创建家庭
        if (!!defaultHome && defaultHome.roleId == '1001') {
          this.setData({
            isHomeowner: true,
            currentHome: defaultHome,
          })
          this.actionGetInviteCode()
        } else {
          this.setData({
            isHomeowner: false,
            currentHome: defaultHome,
          })
        }
      })
    },
    actionGetInviteCode() {
      let { homegroupId } = this.data.currentHome
      let reqData = {
        reqId: getReqId(),
        stamp: getStamp(),
        homegroupId: homegroupId,
      }
      this.getInvitationCode(reqData)
        .then((res) => {
          this.setData({
            path: res.data.data.path,
          })
        })
        .catch((res) => {
          if (res.data.code == 2020) {
            this.setData({
              isFullFamilyPeople: true,
            })
            console.log(this.data)
          }
        })
    },
  },
})
