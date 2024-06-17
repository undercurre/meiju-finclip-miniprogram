export const mockData = {
  res: {
    code: 0, //  0:返回成功；50：返回异常
    msg: '',
    data: {
      pageSetting: {
        // 页面设置
        id: 1, // 页面id
        name: '排行玩法', // 页面标题
        background: 'https://filecmms.midea.com/cmimp_prod/plugin/inviteJoinFamily/06.png', // 页面背景
        type: 1, //页面类型(1、首页；2、普通页面；3、toast弹窗;4、按钮弹窗；5、图片或文案弹窗)
        popUps: {
          closeButtonPosition: 0, //关闭按钮位置
          content: '', //弹窗文案
          height: 1, //弹窗高度
          imgUrl: '', //弹窗上传图片地址
          rollFlag: true, //滚动标识
          title: '', //弹窗标题
          width: 1, //弹窗宽度
          basicList: {
            //按钮组件列表
            content: '', // 按钮文案
            target: '', // 跳转类型
            targetUrl: '', // 跳转地址
          },
        },
        containerList: [
          // 容器数组
          {
            id: '122', // 容器id
            background: 'https://filecmms.midea.com/cmimp_prod/plugin/taskBox/04.png', // 容器背景图
            type: 9, //玩法类型；1、邀请注册；2、邀请绑定设备；3、邀请加入家庭；5、任务盒子获得6、滚动签到；7、固定签到
            //8、九宫格抽奖;9、任务盒子-新注册
            containerType: 12, // 容器类型(1、通用容器；2、我的奖励卡片；3、邀请注册；4、邀请绑定设备；
            //5、邀请加入家庭；6，任务盒子；7，滚动签到；8，固定签到,9,九宫格抽奖,10,任务盒子-新注册)
            height: 645,
            marginLeft: 0,
            marginRight: 0,
            borderRadius: 0,
            backgroundColor: '',
            basicList: [
              // 需要渲染的图片
              {
                imgUrl: '', // 图片地址
                basicImgUrl: 'https://filecmms.midea.com/cmimp_prod/plugin/taskBox/09.png',
                type: '2', // 组件类型；1、按钮；2、热区；3、图片；4、占位区
                width: 600, // 宽高
                height: 88,
                positionX: 75,
                positionY: 484.01,
                positionZ: 602,
                target: '2', // 跳转类型
                targetUrl: '', // 跳转地址
                targetUrl2: {
                  appUrl: '', //美居APP渠道链接
                  wxUrl: '', //微信小程序链接
                  webUrl: '', //普通浏览器链接
                  appUrlGoType: 1, //app跳转类型
                },
                name: '排行玩法', //组件名称
                custom: 5, //0：通用组件；1. 道具数 2.排名数 3.我的积分 4.查看榜单详情 5. 登录按钮
                code: '111', //埋点码
              },
              {
                imgUrl: '', // 图片地址
                basicImgUrl: 'https://filecmms.midea.com/cmimp_prod/plugin/inviteRegister/14.png',
                type: '2', // 组件类型；1、按钮；2、热区；3、图片；4、占位区
                width: 600, // 宽高
                height: 88,
                positionX: 75, // 坐标
                positionY: 514,
                positionZ: 666, // 层级
                target: '2', // 跳转类型
                targetUrl: '', // 跳转地址
                targetUrl2: {
                  appUrl: '', //美居APP渠道链接
                  wxUrl: '', //微信小程序链接
                  webUrl: '', //普通浏览器链接
                  appUrlGoType: 1, //app跳转类型
                },
                name: '排行玩法', //组件名称
                custom: 4, //0：通用组件；1. 道具数 2.排名数 3.我的积分 4.查看榜单详情 5. 登录按钮
                code: '111', //埋点码
              },
              {
                imgUrl: '', // 图片地址
                basicImgUrl: 'https://filecmms.midea.com/cmimp_prod/plugin/inviteRegister/04.png',
                type: '2', // 组件类型；1、按钮；2、热区；3、图片；4、占位区
                width: 140, // 宽高
                height: 35,
                positionX: 85, // 坐标
                positionY: 380,
                positionZ: 666, // 层级
                target: '2', // 跳转类型
                targetUrl: '', // 跳转地址
                targetUrl2: {
                  appUrl: '', //美居APP渠道链接
                  wxUrl: '', //微信小程序链接
                  webUrl: '', //普通浏览器链接
                  appUrlGoType: 1, //app跳转类型
                },
                name: '排行玩法', //组件名称
                custom: 3, //0：通用组件；1. 道具数 2.排名数 3.我的积分 4.查看榜单详情 5. 登录按钮
                code: '111', //埋点码
              },
              {
                imgUrl: '', // 图片地址
                basicImgUrl: 'https://filecmms.midea.com/cmimp_prod/plugin/myAward/04.png',
                type: '4', // 组件类型；1、按钮；2、热区；3、图片；4、占位区
                width: 200, // 宽高
                height: 50,
                positionX: 75, // 坐标
                positionY: 300,
                positionZ: 666, // 层级
                target: '2', // 跳转类型
                targetUrl: '', // 跳转地址
                targetUrl2: {
                  appUrl: '', //美居APP渠道链接
                  wxUrl: '', //微信小程序链接
                  webUrl: '', //普通浏览器链接
                  appUrlGoType: 1, //app跳转类型
                },
                name: '排行玩法', //组件名称
                custom: 1, //0：通用组件；1. 道具数 2.排名数 3.我的积分 4.查看榜单详情 5. 登录按钮
                code: '111', //埋点码
              },
              {
                imgUrl: '', // 图片地址
                basicImgUrl: 'https://filecmms.midea.com/cmimp_prod/plugin/myAward/04.png',
                type: '4', // 组件类型；1、按钮；2、热区；3、图片；4、占位区
                width: 200, // 宽高
                height: 50,
                positionX: 400, // 坐标
                positionY: 300,
                positionZ: 666, // 层级
                target: '2', // 跳转类型
                targetUrl: '', // 跳转地址
                targetUrl2: {
                  appUrl: '', //美居APP渠道链接
                  wxUrl: '', //微信小程序链接
                  webUrl: '', //普通浏览器链接
                  appUrlGoType: 1, //app跳转类型
                },
                name: '排行玩法', //组件名称
                custom: 2, //0：通用组件；1. 道具数 2.排名数 3.我的积分 4.查看榜单详情 5. 登录按钮
                code: '111', //埋点码
              },
            ],
            extraSetting: [],
            data: {
              // 特殊容器的数据
              inviteUrl: '', //邀请好友助力跳转地址（邀请注册或绑定设备）
              awardsList: [], //奖品列表（我的奖励卡片和我的奖励列表）
              inviteRecord: [], //邀请记录（邀请记录）
              userInfo: {}, //邀请人信息（受邀主助力页）
              shareSetting: {}, //分享信息
              taskInfo: {},
              propScoreInfo: {
                //道具信息
                propNum: 0, //道具(积分)总数
                activityType: 0, //0-排名,1-兑换
                propRank: 234567, //当前积分排名
                propAwardSetting: [
                  //道具兑换详细信息
                  {
                    awardType: 0, //0-兑换奖品,1-兑换抽奖次数
                    prizeId: 1, //奖品id
                    imgUrl: '', //奖品图片地址
                    name: '', //奖品名称
                    requireScore: 2, //兑换所需积分
                    remainAmount: 3, //奖品剩余量,兑换奖品时有此字段
                    drawTimes: 2, //消耗积分获得抽奖次数,兑换抽奖次数时有此字段
                  },
                ],
                scoreRecord: [
                  //积分记录
                  {
                    changeType: 0, //0-增加积分,1-消耗积分
                    desc: '', //积分变化描述
                    score: 2, //积分数
                    createTime: 1234567898765, //创建时间
                  },
                ],
                exchangeRecord: [
                  //兑换记录
                  {
                    changeType: 0, //0-兑换奖品,1-兑换抽奖次数
                    desc: '', //积分变化描述
                    score: 2, //消耗积分
                    createTime: 1234567898765, //创建时间
                  },
                ],
                rankRecord: [
                  //积分排名列表
                  {
                    rankNum: 1, //排名名次
                    nickName: '', //用户昵称
                    headImgUrl: '', //用户头像
                    score: 343, //积分数
                  },
                ],
              },
            },
          },
          {
            background: 'https://fcmms.midea.com/cmimp_beta/file/1/20210329/b0d2ee66-acd2-4202-b0ac-a977fb600183.png',
            backgroundColor: '',
            backgroundHeight: 400.01,
            borderRadius: 0,
            containerType: 2,
            basicList: [
              {
                appletsJumpType: 0,
                basicImgUrl:
                  'https://fcmms.midea.com/cmimp_beta/file/1/20210225/600315b5-febd-4633-830f-6d379dc4de8c.png',
                basicTitle: '热区：领取',
                closeButtonFlag: false,
                code: '',
                content: '',
                custom: 1,
                description: '',
                functionCode: '',
                height: 79.69,
                hotFlag: false,
                imgUrl: '',
                mjAppJumpLink: '',
                mjAppJumpType: 0,
                name: '领取',
                participantFlag: false,
                positionX: 541.41,
                positionY: 202.27,
                positionZ: 650,
                shareChannel: [],
                shareFrom: 0,
                target: 0,
                targetUrl: '',
                title: '',
                type: 2,
                width: 150,
              },
              {
                appletsJumpType: 0,
                basicImgUrl:
                  'https://fcmms.midea.com/cmimp_beta/file/1/20210306/b1135b27-aace-4f24-a605-5e1f3124ae26.png',
                basicTitle: '热区：查看',
                closeButtonFlag: false,
                code: '',
                content: '',
                custom: 2,
                description: '',
                functionCode: '',
                height: 79.69,
                hotFlag: false,
                imgUrl: '',
                mjAppJumpLink: '',
                mjAppJumpType: 0,
                name: '查看',
                participantFlag: false,
                positionX: 541.41,
                positionY: 202.27,
                positionZ: 650,
                shareChannel: [],
                shareFrom: 0,
                target: 0,
                targetUrl: '20101',
                title: '',
                type: 2,
                width: 150,
              },
              {
                appletsImg: '',
                appletsJumpLink: '',
                appletsJumpType: 0,
                appletsTitle: '',
                basicImgUrl:
                  'https://fcmms.midea.com/cmimp_beta/file/1/20210225/c6db90bf-c89b-4aa3-8893-f4f642c4c5e3.png',
                basicTitle: '热区：查看更多',
                closeButtonFlag: false,
                code: '',
                content: '',
                custom: 3,
                description: '',
                functionCode: '',
                height: 37.5,
                hotFlag: false,
                imgUrl: '',
                mjAppJumpLink: '',
                mjAppJumpType: 0,
                name: '查看更多',
                participantFlag: false,
                positionX: 557.81,
                positionY: 45,
                positionZ: 640,
                shareChannel: [],
                shareFrom: 2,
                target: 2,
                targetUrl: '20100',
                title: '',
                type: 2,
                width: 145.31,
              },
              {
                appletsImg: '',
                appletsJumpLink: '',
                appletsJumpType: 0,
                appletsTitle: '',
                basicImgUrl:
                  'https://fcmms.midea.com/cmimp_beta/file/1/20210308/7e58f783-93ce-4ab5-9c91-88d708ce058f.png',
                basicTitle: '热区：未登录状态图片',
                closeButtonFlag: false,
                code: '',
                content: '',
                custom: 7,
                description: '',
                functionCode: '',
                height: 206.25,
                hotFlag: false,
                imgUrl: '',
                mjAppJumpLink: '',
                mjAppJumpType: 0,
                name: '未登录状态图片',
                participantFlag: false,
                positionX: 51.56,
                positionY: 138.98,
                positionZ: 620,
                shareChannel: [],
                shareFrom: 2,
                target: 0,
                targetUrl: '',
                title: '',
                type: 2,
                width: 646.88,
              },
              {
                appletsImg: '',
                appletsJumpLink: '',
                appletsJumpType: 0,
                appletsTitle: '',
                basicImgUrl:
                  'https://fcmms.midea.com/cmimp_beta/file/1/20210308/552bf5de-19e9-4a8b-b885-007386d73dfc.png',
                basicTitle: '热区：登录按钮',
                closeButtonFlag: false,
                code: '',
                content: '',
                custom: 8,
                description: '',
                functionCode: '',
                height: 67.97,
                hotFlag: false,
                imgUrl: '',
                mjAppJumpLink: '',
                mjAppJumpType: 0,
                name: '登录按钮',
                participantFlag: false,
                positionX: 267.19,
                positionY: 209.3,
                positionZ: 660,
                shareChannel: [],
                shareFrom: 2,
                target: 0,
                targetUrl: '',
                title: '',
                type: 2,
                width: 210.94,
              },
              {
                appletsImg: '',
                appletsJumpLink: '',
                appletsJumpType: 0,
                appletsTitle: '',
                basicImgUrl:
                  'https://fcmms.midea.com/cmimp_beta/file/1/20210306/6a684af3-52b5-4f6a-a639-dc1799908013.png',
                basicTitle: '热区：无奖励的状态图片',
                closeButtonFlag: false,
                code: '',
                content: '',
                custom: 9,
                description: '',
                functionCode: '',
                height: 206.25,
                hotFlag: false,
                imgUrl: '',
                mjAppJumpLink: '',
                mjAppJumpType: 0,
                name: '无奖励的状态图片',
                participantFlag: false,
                positionX: 51.56,
                positionY: 138.98,
                positionZ: 600,
                shareChannel: [],
                shareFrom: 2,
                target: 0,
                targetUrl: '',
                title: '',
                type: 2,
                width: 646.88,
              },
              {
                appletsImg: '',
                appletsJumpLink: '',
                appletsJumpType: 0,
                appletsTitle: '',
                basicImgUrl:
                  'https://fcmms.midea.com/cmimp_beta/file/1/20210407/a6a80210-5034-42a3-9881-4d2ff0d602cd.png',
                basicTitle: '热区：填写地址',
                closeButtonFlag: false,
                code: '',
                content: '',
                custom: 12,
                description: '',
                functionCode: '',
                height: 75,
                hotFlag: false,
                imgUrl: '',
                mjAppJumpLink: '',
                mjAppJumpType: 0,
                name: '填写地址',
                participantFlag: false,
                positionX: 515.63,
                positionY: 199.22,
                positionZ: 661,
                shareChannel: [],
                shareFrom: 2,
                target: 7,
                targetUrl: '20103',
                title: '',
                type: 2,
                width: 173.44,
              },
            ],
            data: {
              awardsList: [
                //   {
                //   addressFlag: 0,
                //   awardRecordRemark: null,
                //   awardSettingId: null,
                //   awardType: null,
                //   awardUrl: null,
                //   desc: "通过完成 'bx - 九宫格玩4 / 8' 任务获得",
                //   imgUrl: "http://fcmms.midea.com/cmimp_beta/file/newPrize/20210408/611ba08c-a4ce-422b-8464-0970a22cdd03.jpg",
                //   logistics: null,
                //   name: "奖品8-红包（惊喜~）（惊喜~）（惊喜~",
                //   prizeId: 104777,
                //   receiveStatus: null,
                //   receiveTime: "2021-04-15",
                //   remark: "红包",
                //   status: 0,
                //   stockFlag: true,
                //   type: 1,
                //   userAddress: null,
                //   userMobile: null,
                //   userName: null,
                //   value: 60,
                //   virtualCouponCode: null,
                //   waybillNumber: null,
                // }
              ],
            },
            extraSetting: [],
            height: 400.78,
            id: 20099,
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 0,
            marginTop: 0,
            modifiableImgList: [],
            type: 4,
          },
        ],
      },
      shareSetting: {
        shareChannel: [1, 2], //分享渠道【1：微信，2：微博，3：微信朋友圈，4：QQ好友，5：QQ空间】
        shareForm: 1, //分享方式：1、H5链接；2、美居小程序
        title: '', //分享H5标题
        description: '', //分享H5内容
        imgUrl: '', //分享H5图片
        appletsTitle: '', //小程序标题
        appletsImg: '', //小程序图片
      },

      userInfo: {
        //我的信息
        id: '',
        nickname: '', //昵称
        headimgurl: '', //头像
      },
      basicSetting: {
        participant: 7, //参与条件
        endTime: '2021-01-21', //活动结束时间
        name: '惊喜大放送', //活动名称
        officialAccountId: 21, //主体ID
        startTime: '2021-01-21', //活动开始时间
        businessClassify: '1', //业务分类
        activityType: 1, //活动类型
        versionAsk: 7.1, //版本
        riskSwitch: 'N', //风险开关,Y开启，N关闭
        status: 2, //活动状态 0未发布，1未开始，2进行中，3已结束，4已关闭
      },

      gameRule: [
        {
          channelType: 1, //参与渠道，1 ：不限 ，2：仅限美居app
          playType: 9, //玩法类型，1、邀请注册；2、邀请绑定设备；3、邀请加入家庭；5，任务盒子；6，滚动签到,7,固定签到获得
          //8,九宫格抽奖获得,9,任务盒子-新注册
        },
      ],
    },
  },
}
