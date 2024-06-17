Component({
  behaviors: [],
  // 属性定义（详情参见下文）
  properties: {
    myProperty: {
      // 属性名
      type: String,
      value: '',
    },
    isShowComponentImage: {
      type: Boolean,
      value: false,
    },
    props: {
      type: Object,
      value: {
        bgUrl: '',
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
    // }
  },
  data: {}, // 私有数据，可用于模板渲染

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
    bindload() {},
  },
})
