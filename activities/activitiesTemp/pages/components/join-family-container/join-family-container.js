Component({
  behaviors: [],
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
      observer() {
        // this.getSelectGameRule(val)
      },
    },
    myProperty2: String, // 简化的定义方式
  },
  data: {
    appParameter: '',
    selectGameRule: {
      channelType: 1, //参与渠道，1 ：不限 ，2：仅限美居app
      playType: 3, //玩法类型，1、邀请注册；2、邀请绑定设备；3、邀请加入家庭
    },
  }, // 私有数据，可用于模板渲染

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      console.log('邀请家庭容器', this.properties.props)
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
    launchAppError() {
      console.log('打开app')
      this.triggerEvent('actionLaunchAppError')
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
    actionContainer(e) {
      const item = e.currentTarget.dataset.item
      const params = {
        basicItem: item,
        selectContainer: this.properties.props,
      }
      this.triggerEvent('actionContainer', params)
    },
    actionActStatus(e) {
      const status = e.target.dataset.status
      const params = {
        status,
      }
      this.triggerEvent('actionActStatus', params)
    },
  },
})
