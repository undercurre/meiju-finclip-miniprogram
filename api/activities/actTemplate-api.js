import config from '../../config.js'
const environment = config.environment
const masPrefix = config.masPrefix
const domain = config.domain
const api = {
  //it部活动配置系统-组件化页面初始化接口未登陆
  getGamePageInit: {
    url: 'https://cmms.midea.com/cmimp/wx/game/page/init',
    masUrl: `${domain[`${environment}`] + masPrefix}/cmimp/wx/game/page/init`,
    api: '/cmimp/wx/game/page/init',
  },
  //it部活动配置系统-组件化页面初始化接口已登陆
  getGamePageInit_token: {
    url: 'https://cmms.midea.com/cmimp/wx/game/page/init_token',
    masUrl: `${domain[`${environment}`] + masPrefix}/cmimp/wx/game/page/init_token`,
    api: '/cmimp/wx/game/page/init_token',
  },
  //it部活动配置系统-获取页面未登录
  getGamePage: {
    url: 'https://cmms.midea.com/cmimp/wx/game/page/info',
    masUrl: `${domain[`${environment}`] + masPrefix}/cmimp/wx/game/page/info`,
    api: '/cmimp/wx/game/page/info',
  },
  //it部活动配置系统-获取页面已登录
  getGamePage_token: {
    url: 'https://cmms.midea.com/cmimp/wx/game/page/info_token',
    masUrl: `${domain[`${environment}`] + masPrefix}/cmimp/wx/game/page/info_token`,
    api: '/cmimp/wx/game/page/info_token',
  },
  //it部活动配置系统-黑产用户校验
  blackUserCheck: {
    url: 'https://cmms.midea.com/cmimp/wx/game/page/user_check_token',
    masUrl: `${domain[`${environment}`] + masPrefix}/cmimp/wx/game/page/user_check_token`,
    api: '/cmimp/wx/game/page/user_check_token',
  },
  //it部活动配置系统-接受邀请
  receiveInvited: {
    url: 'https://cmms.midea.com/cmimp/wx/game/page/receive_invited',
    masUrl: `${domain[`${environment}`] + masPrefix}/cmimp/wx/game/page/receive_invited`,
    api: '/cmimp/wx/game/page/receive_invited',
  },
  //it部活动配置系统-领取奖品
  receivePrize: {
    url: 'https://cmms.midea.com/cmimp/wx/page/receive_prize',
    masUrl: `${domain[`${environment}`] + masPrefix}/cmimp/wx/page/receive_prize`,
    api: '/cmimp/wx/page/receive_prize',
  },
  //it部活动配置系统-加入家庭
  // receiveJoinFamily: {
  //   url: `https://cmms.midea.com/join_family`,
  //   masUrl: `${domain[`${environment}`] + masPrefix}/join_family`,
  //   api: "/join_family"
  // },
  //it部活动配置系统-查询省市区列表
  receiveGetAddress: {
    url: `${domain[`${environment}`] + masPrefix}/v1/activity/province/city/list`,
    masUrl: `${domain[`${environment}`] + masPrefix}/v1/activity/province/city/list`,
    api: '/v1/activity/province/city/list', //todo
  },
  //it部活动配置系统-提交收货人信息
  submitAddress: {
    url: 'https://cmms.midea.com/cmimp/wx/award/prize/submit_token',
    masUrl: `${domain[`${environment}`] + masPrefix}/cmimp/wx/award/prize/submit_token`,
    api: '/cmimp/wx/award/prize/submit_token',
  },
  //滚动签到
  signRolling: {
    url: `${domain[`${environment}`] + masPrefix}/cmimp/wx/game/customize/rollSign_token`,
    masUrl: `${domain[`${environment}`] + masPrefix}/cmimp/wx/game/customize/rollSign_token`,
    api: '/cmimp/wx/game/customize/rollSign_token',
  },
  //签到通知
  signNotice: {
    url: `${domain[`${environment}`] + masPrefix}/cmimp/wx/game/customize/sign/notice_token`,
    masUrl: `${domain[`${environment}`] + masPrefix}/cmimp/wx/game/customize/sign/notice_token`,
    api: '/cmimp/wx/game/customize/sign/notice_token',
  },
  // 活动结束判断接口
  gameStatus: {
    url: `${domain[`${environment}`] + masPrefix}/cmimp/wx/game/status`,
    masUrl: `${domain[`${environment}`] + masPrefix}/cmimp/wx/game/status`,
    api: '/cmimp/wx/game/status',
  },
  // 任务盒子库存接口
  prizeStore: {
    url: `${domain[`${environment}`] + masPrefix}/cmimp/wx/game/task/prize-store`,
    masUrl: `${domain[`${environment}`] + masPrefix}/cmimp/wx/game/task/prize-store`,
    api: '/cmimp/wx/game/task/prize-store',
  },
  // 邀请类库存接口
  invitePrizeStore: {
    url: `${domain[`${environment}`] + masPrefix}/cmimp/wx/game/invite/awardStock_token`,
    masUrl: `${domain[`${environment}`] + masPrefix}/cmimp/wx/game/invite/awardStock_token`,
    api: '/cmimp/wx/game/invite/awardStock_token',
  },
  //九宫格抽奖
  drawGrid: {
    url: `${domain[`${environment}`] + masPrefix}/cmimp/wx/game/page/draw_token`,
    masUrl: `${domain[`${environment}`] + masPrefix}/cmimp/wx/game/page/draw_token`,
    api: '/cmimp/wx/game/page/draw_token',
  },
  //it部活动配置系统-分页获取积分排行列表
  getRankList: {
    url: `${domain[`${environment}`] + masPrefix}/cmimp/wx/game/propScore/getRankList_token`,
    masUrl: `${domain[`${environment}`] + masPrefix}/cmimp/wx/game/propScore/getRankList_token`,
    api: '/cmimp/wx/game/propScore/getRankList_token',
  },
  //it部活动配置系统-获取积分记录页id
  getScorePageId: {
    url: `${domain[`${environment}`] + masPrefix}/cmimp/wx/game/propScore/getScorePageId_token`,
    masUrl: `${domain[`${environment}`] + masPrefix}/cmimp/wx/game/propScore/getScorePageId_token`,
    api: '/cmimp/wx/game/propScore/getScorePageId_token',
  },
  //it部活动配置系统-判断奖励是否需要引导到美居领取
  isPrizeReceiveChannel: {
    url: `${domain[`${environment}`] + masPrefix}/cmimp/wx/award/prize/receiveChannel_token`,
    masUrl: `${domain[`${environment}`] + masPrefix}/cmimp/wx/award/prize/receiveChannel_token`,
    api: '/cmimp/wx/award/prize/receiveChannel_token',
  },
  //it部活动配置系统-领取虚拟券
  receiveVirtualCoupon: {
    url: `${domain[`${environment}`] + masPrefix}/cmimp/wx/award/prize/receiveVirtualCouponl_token`,
    masUrl: `${domain[`${environment}`] + masPrefix}/cmimp/wx/award/prize/receiveVirtualCoupon_token`,
    api: '/cmimp/wx/award/prize/receiveVirtualCoupon_token',
  },
  //邀请加入家庭获取inviteCode
  share: {
    url: 'https://iot-dev.smartmidea.net:443/v1/wx/member/invite/share',
    // masUrl: `${domain[`${environment}`] + masPrefix}/v1/wx/member/invite/share`, //旧配置
    masUrl: `${domain[`${environment}`] + masPrefix}/mjl/v1/wx/member/invite/share`, //新配置
    api: '/v1/wx/member/invite/share',
  },
  //获取当前家庭列表
  homeList: {
    url: 'https://iot-dev.smartmidea.net:443/v1/homegroup/list/get',
    masUrl: `${domain[`${environment}`] + masPrefix}/mjl/v1/homegroup/list/get`,
    api: '/mjl/v1/homegroup/list/get',
  },
  //免费领取接口（免费领取玩法）
  freeReceive: {
    url: `${domain[`${environment}`] + masPrefix}/cmimp/wx/game/page/receive_token`,
    masUrl: `${domain[`${environment}`] + masPrefix}/cmimp/wx/game/page/receive_token`,
    api: '/cmimp/wx/game/page/receive_token',
  },
  //任务盒子拓展 完成任务接口
  finishTask: {
    url: `${domain[`${environment}`] + masPrefix}/cmimp/wx/game/taskCaseExtend/finishTask_token`,
    masUrl: `${domain[`${environment}`] + masPrefix}/cmimp/wx/game/taskCaseExtend/finishTask_token`,
    api: '/cmimp/wx/game/taskCaseExtend/finishTask_token',
  },
  //获取用户是否已通过滑块校验
  getCaptchaStatus: {
    url: `${domain[`${environment}`] + masPrefix}/cmimp/scroll-auth/status_token`,
    masUrl: `${domain[`${environment}`] + masPrefix}/cmimp/scroll-auth/status_token`,
    api: '/cmimp/scroll-auth/status_token',
  },
  //运营活动-校验当前滑块校验的验证码是否正确
  checkCaptcha: {
    url: `${domain[`${environment}`] + masPrefix}/cmimp/scroll-auth/token-auth_token`,
    masUrl: `${domain[`${environment}`] + masPrefix}/cmimp/scroll-auth/token-auth_token`,
    api: '/cmimp/scroll-auth/status_token',
  },
  //运营活动-权益直充：领取第三方直充奖励
  receiveDirectCharge: {
    url: `${domain[`${environment}`] + masPrefix}/cmimp/wx/award/prize/receiveDirectCharge_token`,
    masUrl: `${domain[`${environment}`] + masPrefix}/cmimp/wx/award/prize/receiveDirectCharge_token`,
    api: '/cmimp/wx/award/prize/receiveDirectCharge_token',
  },
  // 美居小程序-美居用户邀请微信用户加入家庭的分享码校验
  joinFaminly: {
    url: `${domain[`${environment}`] + masPrefix}/mjl/v1/wx/member/invite/verify`,
    // masUrl: `${domain[`${environment}`] + masPrefix}/mjl/v1/wx/member/invite/verify`, //旧配置
    masUrl: `${domain[`${environment}`] + masPrefix}/mjl/v1/wx/member/invite/verify/new`, //新配置
    api: '/mjl/v1/wx/member/invite/verify',
  },
}
export default api
