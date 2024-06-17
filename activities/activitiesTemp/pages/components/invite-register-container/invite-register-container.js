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
      // value: false,
      observer(newVal) {
        console.log(newVal, 'newVal')
        this.initInviteData(newVal)
      },
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
  observers: {
    // isShowToast(val) {
    //   if(val) {
    //     setTimeout(() => {
    //       this.triggerEvent('actionToastClose')
    //     },this.properties.duration)
    //   }
    // },
    // isLogon(val) {
    //   console.log("observers",val)
    //   if(val) {
    //     this.setData({
    //       isLoginComponent: val
    //     })
    //   }
    // }
  },
  data: {
    appParameter: '',
    selectGameRule: {
      channelType: 1, //参与渠道，1 ：不限 ，2：仅限美居app
      playType: 1, //玩法类型，1、邀请注册；2、邀请绑定设备；3、邀请加入家庭
    },
    gameRuleMap: {
      1: '3',
      2: '4',
    },
    isAwardStockNull: false,
    init: false,
    bgSettings: [],
    currentBgSetting: {},
  }, // 私有数据，可用于模板渲染

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      console.log('注册激活容器', this.properties.props)
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
    // 初始化容器数据，这里主要对邀请激活设备容器的容器背景做另外处理，添加奖品已发完场景
    async initInviteData(isLogin) {
      console.log('properties====', this.properties.props)
      console.log('邀请玩法刷新数据')
      let info = this.properties.props
      this.setData({
        bgSettings: info.containerType == 4 && info.extraSetting.length ? info.extraSetting : [],
      })
      try {
        // debugger
        // console.info(isLogin)
        if (!isLogin) return

        let res = await this.isCheckAwardStock(info)
        if (res.code == 2) {
          // 库存不足
          this.setCurrentBg()
          this.setData({
            isAwardStockNull: true,
            init: true,
          })
        } else {
          this.setData({
            isAwardStockNull: false,
            init: true,
          })
        }
      } catch (error) {
        this.setData({
          isAwardStockNull: false,
          init: false,
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
    actionContainer(e) {
      const item = e.currentTarget.dataset.item
      const params = {
        basicItem: item,
        selectContainer: this.properties.props,
      }
      this.triggerEvent('actionContainer', params)
    },
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
    actionHotzoneCustom(e) {
      const basicItem = e.detail.basicItem
      const selectContainer = e.detail.selectContainer

      const params = {
        basicItem: basicItem,
        selectContainer: selectContainer,
      }
      console.log('热区通用', params)
      this.triggerEvent('actionHotzoneCustom', params)
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
    // 我也要参与
    iJoinIn(e) {
      const item = e.currentTarget.dataset.item
      const params = {
        basicItem: item,
        selectContainer: this.properties.props,
      }
      this.triggerEvent('actionJoinIn', params)
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
    launchAppError() {
      console.log('打开app')
      this.triggerEvent('actionLaunchAppError')
    },
  },
})
