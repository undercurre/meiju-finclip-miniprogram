Component({
  behaviors: [],
  // 属性定义（详情参见下文）
  properties: {
    // containerList:{
    //   type: Array,
    //   value: ()=>[]
    // },
    myProperty: {
      // 属性名
      type: String,
      value: '',
    },
    myProperty2: String, // 简化的定义方式
  },

  data: {
    containerList: [],
  }, // 私有数据，可用于模板渲染

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {},
    moved: function () {},
    detached: function () {},
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () {}, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function () {
    let testData = [
      // 容器数组
      {
        id: '', // 容器id
        background: '', // 背景图
        containerType: 1, // 容器类型(1、通用容器；2、我的奖励卡片；3、我的奖励列表；4、面对面邀请；5、邀请记录；6、优惠券查看)
        height: 200,
        basicList: [
          // 需要渲染的图片
          {
            imgUrl: 'https://www.smartmidea.net/activity/202003/spring-mask/img/rule.ce552ec1.png', // 图片地址
            type: '3', // 组件类型；1、按钮；2、热区；3、图片；4、占位区
            width: 132, // 宽高
            height: 60,
            positionX: 200, // 坐标
            positionY: 64,
            positionZ: 3, // 层级
            target: '7', // 跳转类型
            targetUrl: '', // 跳转地址
            name: '', //组件名称
            custom: 1, //1、领取，2、查看，3、提现,4、券码，5、头像，
          },
        ],
        data: {
          // 特殊容器的数据
          inviteUrl: '', //邀请好友助力跳转地址（邀请注册或绑定设备）
          awardsList: [], //奖品列表（我的奖励卡片和我的奖励列表）
          inviteRecord: [], //邀请记录（邀请记录）
          couponInfo: {}, //优惠券信息（优惠券查看）
          userInfo: {}, //受邀请人信息（受邀主助力页）
        },
      },
    ]
    this.setData({
      containerList: testData,
    })
  },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {},
    hide: function () {},
    resize: function () {},
  },
  methods: {
    btnClick() {
      this.triggerEvent('btnClick')
    },
  },
})
