export const mockData = {
  res: {
    code: 0, //  0:返回成功；50：返回异常
    msg: '',
    data: {
      pageSetting: {
        // 页面设置
        id: 1, // 页面id
        name: '页面标题', // 页面标题
        background: 'https://fcmms.midea.com/cmimp_beta/file/1/20210310/f8073268-ccaa-41e1-b998-f7f5a0c79a6e.png', // 页面背景
        status: 2, // 活动状态，0未发布，1未开始，2进行中，3已结束，4已关闭，5待审核，6审核中
        versionRequired: '', // 版本要求
        enableSafeCheck: true, // 是否开启安全校验
        type: 2, //页面类型(1、首页；2、普通页面；3、toast弹窗;4、按钮弹窗；5、图片或文案弹窗)
        popups: {
          closeButtonPosition: 0, //关闭按钮位置
          content: '弹窗文案', //弹窗文案
          height: 320, //弹窗高度
          imgUrl: '', //弹窗上传图片地址
          rollFlag: true, //滚动标识
          title: '', //弹窗标题
          width: 600, //弹窗宽度
          basicList: [
            {
              //按钮组件列表
              content: '返回', // 按钮文案
              target: '3', // 跳转类型
              targetUrl: '', // 跳转地址
            },
            {
              //按钮组件列表
              content: '确认', // 按钮文案
              target: '4', // 跳转类型
              targetUrl: '', // 跳转地址
            },
          ],
        },
        containerList: [
          // 容器数组
          {
            id: '', // 容器id
            background:
              'https://www.smartmidea.net/activity/sit/202012/minprogram-images/actTemp/images/home-banner.png', // 背景图
            type: 3, //玩法类型；1、邀请注册；2、邀请绑定设备；3、邀请加入家庭
            containerType: 1, // 容器类型(1、通用容器；2、我的奖励卡片；3、邀请注册；4、邀请绑定设备；5、邀请加入家庭)
            height: 400,
            basicList: [
              // 需要渲染的图片
              {
                imgUrl:
                  'https://www.smartmidea.net/activity/sit/202012/minprogram-images/actTemp/images/empty-reward.png', // 图片地址
                type: '3', // 组件类型；1、按钮；2、热区；3、图片；4、占位区
                width: 200, // 宽高
                height: 100,
                positionX: 100, // 坐标
                positionY: 100,
                positionZ: 1, // 层级
                target: '7', // 跳转类型
                targetUrl: '', // 跳转地址
                custom: 0, //1、领取，2、查看，3、提现,4、券码，5、头像，
              },
              {
                imgUrl:
                  'https://www.smartmidea.net/activity/sit/202012/minprogram-images/actTemp/images/empty-reward.png', // 图片地址
                type: '3', // 组件类型；1、按钮；2、热区；3、图片；4、占位区
                width: 200, // 宽高
                height: 100,
                positionX: 100, // 坐标
                positionY: 300,
                positionZ: 1, // 层级
                target: '3', // 跳转类型
                targetUrl: '', // 跳转地址
                custom: 0, //1、领取，2、查看，3、提现,4、券码，5、头像，
              },
              {
                imgUrl:
                  'https://www.smartmidea.net/activity/sit/202012/minprogram-images/actTemp/images/empty-reward.png', // 图片地址
                type: '3', // 组件类型；1、按钮；2、热区；3、图片；4、占位区
                width: 200, // 宽高
                height: 100,
                positionX: 100, // 坐标
                positionY: 600,
                positionZ: 1, // 层级
                target: '4', // 跳转类型
                targetUrl: '', // 跳转地址
                custom: 0, //1、领取，2、查看，3、提现,4、券码，5、头像，
              },
            ],
            data: {
              // 特殊容器的数据
              codeUrl: '', //二维码地址（面对面邀请）
              getAwardsRecord: [], //奖励领取记录（我的奖励卡片）
              awardsList: [
                {
                  receiveTime: '2021-01-29', //领取奖励时间
                  prizeId: 6120, // 奖品ID
                  imgUrl:
                    'http://fcmms.midea.com/cmimp_beta/file/newPrize/20200426/9fd469f8-4c12-4b4e-adfe-7e4e0f875acd.png', //奖品图
                  name: '0.8元红包', //奖品名称
                  status: 0, //状态：0 未领取 1已领取 2已发放
                  type: 1, //奖品类型： 0 实物奖品，1现金红包，2虚拟券
                  desc: '获取奖品的原因', //获取奖品的原因
                },
                {
                  receiveTime: '2021-01-29', //领取奖励时间
                  prizeId: 6120, // 奖品ID
                  imgUrl:
                    'http://fcmms.midea.com/cmimp_beta/file/newPrize/20200426/9fd469f8-4c12-4b4e-adfe-7e4e0f875acd.png', //奖品图
                  name: '0.8元红包', //奖品名称
                  status: 1, //状态：0 未领取 1已领取 2已发放
                  type: 1, //奖品类型： 0 实物奖品，1现金红包，2虚拟券
                  desc: '获取奖品的原因', //获取奖品的原因
                },
                {
                  receiveTime: '2021-01-29', //领取奖励时间
                  prizeId: 6120, // 奖品ID
                  imgUrl:
                    'http://fcmms.midea.com/cmimp_beta/file/newPrize/20200426/9fd469f8-4c12-4b4e-adfe-7e4e0f875acd.png', //奖品图
                  name: '0.8元红包', //奖品名称
                  status: 2, //状态：0 未领取 1已领取 2已发放
                  type: 1, //奖品类型： 0 实物奖品，1现金红包，2虚拟券
                  desc: '获取奖品的原因', //获取奖品的原因
                },
              ], //奖品列表（我的奖励列表）
              inviteRecord: [
                {
                  id: 1,
                  meijuHeadUrl: '', // 美居头像
                  meijuNickName: '美居昵称', // 美居昵称
                  inviteTime: '2020-11-11 11:11:11', // 邀请时间 ex:"2020-11-11 11:11:11"
                  inviteFrom: '邀请来源', // 邀请来源
                },
                {
                  id: 1,
                  meijuHeadUrl: '', // 美居头像
                  meijuNickName: '美居昵称', // 美居昵称
                  inviteTime: '2020-11-11 11:11:11', // 邀请时间 ex:"2020-11-11 11:11:11"
                  inviteFrom: '邀请来源', // 邀请来源
                },
              ], //邀请记录（邀请记录）
              couponInfo: '', //优惠券信息（优惠券查看）
            },
          },
          {
            id: '', // 容器id
            background:
              'https://www.smartmidea.net/activity/sit/202012/minprogram-images/actTemp/images/home-banner.png', // 背景图
            type: 1, //玩法类型；1、邀请注册；2、邀请绑定设备；3、邀请加入家庭
            containerType: 2, // 容器类型(1、通用容器；2、我的奖励卡片；3、邀请注册；4、邀请绑定设备；5、邀请加入家庭)
            height: 500,
            basicList: [
              // 需要渲染的图片
              {
                imgUrl:
                  'https://www.smartmidea.net/activity/sit/202012/minprogram-images/actTemp/images/empty-reward.png', // 图片地址
                type: '3', // 组件类型；1、按钮；2、热区；3、图片；4、占位区
                width: 200, // 宽高
                height: 100,
                positionX: 100, // 坐标
                positionY: 100,
                positionZ: 1, // 层级
                target: '7', // 跳转类型
                targetUrl: '', // 跳转地址
                custom: 0, //1、领取，2、查看，3、提现,4、券码，5、头像，
              },
              {
                imgUrl:
                  'https://www.smartmidea.net/activity/sit/202012/minprogram-images/actTemp/images/empty-reward.png', // 图片地址
                type: '3', // 组件类型；1、按钮；2、热区；3、图片；4、占位区
                width: 200, // 宽高
                height: 100,
                positionX: 100, // 坐标
                positionY: 300,
                positionZ: 1, // 层级
                target: '3', // 跳转类型
                targetUrl: '', // 跳转地址
                custom: 0, //1、领取，2、查看，3、提现,4、券码，5、头像，
              },
              {
                imgUrl:
                  'https://www.smartmidea.net/activity/sit/202012/minprogram-images/actTemp/images/empty-reward.png', // 图片地址
                type: '3', // 组件类型；1、按钮；2、热区；3、图片；4、占位区
                width: 200, // 宽高
                height: 100,
                positionX: 100, // 坐标
                positionY: 600,
                positionZ: 1, // 层级
                target: '4', // 跳转类型
                targetUrl: '', // 跳转地址
                custom: 0, //1、领取，2、查看，3、提现,4、券码，5、头像，
              },
              {
                imgUrl:
                  'https://www.smartmidea.net/activity/sit/202012/minprogram-images/actTemp/images/empty-reward.png', // 图片地址
                type: '3', // 组件类型；1、按钮；2、热区；3、图片；4、占位区
                width: 200, // 宽高
                height: 100,
                positionX: 100, // 坐标
                positionY: 800,
                positionZ: 1, // 层级
                target: '3', // 跳转类型sxcd
                targetUrl: '', // 跳转地址
                custom: 0, //1、领取，2、查看，3、提现,4、券码，5、头像，
              },
            ],
            data: {
              // 特殊容器的数据
              codeUrl: '', //二维码地址（面对面邀请）
              getAwardsRecord: [], //奖励领取记录（我的奖励卡片）
              awardsList: [
                {
                  receiveTime: '2021-01-29', //领取奖励时间
                  prizeId: 6120, // 奖品ID
                  imgUrl:
                    'http://fcmms.midea.com/cmimp_beta/file/newPrize/20200426/9fd469f8-4c12-4b4e-adfe-7e4e0f875acd.png', //奖品图
                  name: '0.8元红包', //奖品名称
                  status: 0, //状态：0 未领取 1已领取 2已发放
                  type: 1, //奖品类型： 0 实物奖品，1现金红包，2虚拟券
                  desc: '获取奖品的原因', //获取奖品的原因
                },
                {
                  receiveTime: '2021-01-29', //领取奖励时间
                  prizeId: 6120, // 奖品ID
                  imgUrl:
                    'http://fcmms.midea.com/cmimp_beta/file/newPrize/20200426/9fd469f8-4c12-4b4e-adfe-7e4e0f875acd.png', //奖品图
                  name: '0.8元红包', //奖品名称
                  status: 1, //状态：0 未领取 1已领取 2已发放
                  type: 1, //奖品类型： 0 实物奖品，1现金红包，2虚拟券
                  desc: '获取奖品的原因', //获取奖品的原因
                },
                {
                  receiveTime: '2021-01-29', //领取奖励时间
                  prizeId: 6120, // 奖品ID
                  imgUrl:
                    'http://fcmms.midea.com/cmimp_beta/file/newPrize/20200426/9fd469f8-4c12-4b4e-adfe-7e4e0f875acd.png', //奖品图
                  name: '0.8元红包', //奖品名称
                  status: 2, //状态：0 未领取 1已领取 2已发放
                  type: 1, //奖品类型： 0 实物奖品，1现金红包，2虚拟券
                  desc: '获取奖品的原因', //获取奖品的原因
                },
              ], //奖品列表（我的奖励列表）
              inviteRecord: [
                {
                  id: 1,
                  meijuHeadUrl: '', // 美居头像
                  meijuNickName: '美居昵称', // 美居昵称
                  inviteTime: '2020-11-11 11:11:11', // 邀请时间 ex:"2020-11-11 11:11:11"
                  inviteFrom: '邀请来源', // 邀请来源
                },
                {
                  id: 1,
                  meijuHeadUrl: '', // 美居头像
                  meijuNickName: '美居昵称', // 美居昵称
                  inviteTime: '2020-11-11 11:11:11', // 邀请时间 ex:"2020-11-11 11:11:11"
                  inviteFrom: '邀请来源', // 邀请来源
                },
              ], //邀请记录（邀请记录）
              couponInfo: '', //优惠券信息（优惠券查看）
            },
          },
          {
            id: '', // 容器id
            background:
              'https://www.smartmidea.net/activity/sit/202012/minprogram-images/actTemp/images/home-banner.png', // 背景图
            type: 1, //玩法类型；1、邀请注册；2、邀请绑定设备；3、邀请加入家庭
            containerType: 3, // 容器类型(1、通用容器；2、我的奖励卡片；3、邀请注册；4、邀请绑定设备；5、邀请加入家庭)
            height: 400,
            basicList: [
              // 需要渲染的图片
              {
                imgUrl: 'https://www.smartmidea.net/activity/sit/202012/yearFeedbackMini/assets/image/small-btn-bg.png', // 图片地址
                type: '3', // 组件类型；1、按钮；2、热区；3、图片；4、占位区
                width: 200, // 宽高
                height: 100,
                positionX: 100, // 坐标
                positionY: 100,
                positionZ: 1, // 层级
                target: '7', // 跳转类型
                targetUrl: '', // 跳转地址
                custom: 1, //1、领取，2、查看，3、提现,4、券码，5、头像，
              },
              {
                imgUrl: 'https://www.smartmidea.net/activity/sit/202012/yearFeedbackMini/assets/image/small-btn-bg.png', // 图片地址
                type: '3', // 组件类型；1、按钮；2、热区；3、图片；4、占位区
                width: 200, // 宽高
                height: 100,
                positionX: 500, // 坐标
                positionY: 100,
                positionZ: 1, // 层级
                target: '1', // 跳转类型
                targetUrl: '', // 跳转地址
                custom: 7, //1、领取，2、查看，3、提现,4、券码，5、头像，
              },
              {
                imgUrl: 'https://www.smartmidea.net/activity/sit/202012/yearFeedbackMini/assets/image/small-btn-bg.png', // 图片地址
                type: '3', // 组件类型；1、按钮；2、热区；3、图片；4、占位区
                width: 200, // 宽高
                height: 100,
                positionX: 300, // 坐标
                positionY: 300,
                positionZ: 1, // 层级
                target: '1', // 跳转类型
                targetUrl: '', // 跳转地址
                custom: 8, //1、领取，2、查看，3、提现,4、券码，5、头像，
              },
            ],
            data: {
              // 特殊容器的数据
              codeUrl: '', //二维码地址（面对面邀请）
              getAwardsRecord: [], //奖励领取记录（我的奖励卡片）
              awardsList: [
                {
                  receiveTime: '2021-01-29', //领取奖励时间
                  prizeId: 6120, // 奖品ID
                  imgUrl:
                    'http://fcmms.midea.com/cmimp_beta/file/newPrize/20200426/9fd469f8-4c12-4b4e-adfe-7e4e0f875acd.png', //奖品图
                  name: '0.8元红包', //奖品名称
                  status: 0, //状态：0 未领取 1已领取 2已发放
                  type: 1, //奖品类型： 0 实物奖品，1现金红包，2虚拟券
                  desc: '获取奖品的原因', //获取奖品的原因
                },
                {
                  receiveTime: '2021-01-29', //领取奖励时间
                  prizeId: 6120, // 奖品ID
                  imgUrl:
                    'http://fcmms.midea.com/cmimp_beta/file/newPrize/20200426/9fd469f8-4c12-4b4e-adfe-7e4e0f875acd.png', //奖品图
                  name: '0.8元红包', //奖品名称
                  status: 1, //状态：0 未领取 1已领取 2已发放
                  type: 1, //奖品类型： 0 实物奖品，1现金红包，2虚拟券
                  desc: '获取奖品的原因', //获取奖品的原因
                },
                {
                  receiveTime: '2021-01-29', //领取奖励时间
                  prizeId: 6120, // 奖品ID
                  imgUrl:
                    'http://fcmms.midea.com/cmimp_beta/file/newPrize/20200426/9fd469f8-4c12-4b4e-adfe-7e4e0f875acd.png', //奖品图
                  name: '0.8元红包', //奖品名称
                  status: 2, //状态：0 未领取 1已领取 2已发放
                  type: 1, //奖品类型： 0 实物奖品，1现金红包，2虚拟券
                  desc: '获取奖品的原因', //获取奖品的原因
                },
              ], //奖品列表（邀请记录列表）
              inviteRecord: [
                {
                  id: 1,
                  meijuHeadUrl: '', // 美居头像
                  meijuNickName: '美居昵称', // 美居昵称
                  inviteTime: '2020-11-11 11:11:11', // 邀请时间 ex:"2020-11-11 11:11:11"
                  inviteFrom: '邀请来源', // 邀请来源
                },
                {
                  id: 1,
                  meijuHeadUrl: '', // 美居头像
                  meijuNickName: '美居昵称', // 美居昵称
                  inviteTime: '2020-11-11 11:11:11', // 邀请时间 ex:"2020-11-11 11:11:11"
                  inviteFrom: '邀请来源', // 邀请来源
                },
              ], //邀请记录（邀请记录）
              couponInfo: '', //优惠券信息（优惠券查看）
            },
          },
        ],
      },
      shareSetting: {
        shareForm: 1, //分享方式：1、H5链接；2、美居小程序
        title: '', //分享H5标题
        description: '', //分享H5内容
        imgUrl: '', //分享H5图片
        appletsTitle: '小程序标题', //小程序标题
        appletsImg: 'http://fcmms.midea.com/cmimp_beta/file/newPrize/20200426/9fd469f8-4c12-4b4e-adfe-7e4e0f875acd.png', //小程序图片
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
        riskSwitch: true, //风险开关
        status: 1, //活动状态 0未发布，1未开始，2进行中，3已结束，4已关闭
      },
      gameRule: [
        {
          channelType: 2, //参与渠道，1 ：不限 ，2：仅限美居app
          playType: 1, //玩法类型，1、邀请注册；2、邀请绑定设备；3、邀请加入家庭
        },
      ],
    },
  },
}
