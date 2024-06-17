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
    commonData: {
      type: Object,
      value: {},
    },
    isLogon: {
      type: Boolean,
      value: false,
    },
    tempMethod: {
      type: Object,
      value: {},
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
  }, // 私有数据，可用于模板渲染

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      console.log('通用容器islogin', this.properties.props)
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
    actionHotzoneDialog(e) {
      const basicItem = e.detail.basicItem
      const selectContainer = e.detail.selectContainer

      const params = {
        basicItem: basicItem,
        selectContainer: selectContainer,
      }
      console.log('弹框normal', params)
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
    //熱区登录
    actionGetHotzonePhonenumber(e) {
      //从熱区传过来的参数会比原来多包装一层，实际e.detail才是原来传的值
      let { detail } = e
      detail.detail.basicItem = detail.currentTarget.dataset.item
      detail.detail.selectContainer = detail.currentTarget.dataset.selectcontainer
      this.triggerEvent('actionGetphonenumber', detail)
    },
  },
})
