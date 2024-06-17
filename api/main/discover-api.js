import config from '../../config.js'
const environment = config.environment
const masPrefix = config.masPrefix
const domain = config.domain
const api = {
  //评论内容校验接口
  articleCheckMessage: {
    url: `${domain[`${environment}`] + masPrefix}/v1/wx/check/message`,
    // masUrl: `${domain[`${environment}`] + masPrefix}/v1/wx/check/message`, //mas旧配置
    masUrl: `${domain[`${environment}`] + masPrefix}/mjl/v1/wx/check/message`, //mas新配置
    api: '/v1/wx/check/message',
  },
  //精选列表
  choiceManage: {
    url: 'https://ccsuat.midea.com:9001/dcp-web/api-community/Featured/mobile/choiceManage',
    masUrl: `${domain[`${environment}`] + masPrefix}/api-community/Featured/mobile/choiceManage`,
    api: '/api-community/Featured/mobile/choiceManage',
  },
  //精选列表(已登录)
  choiceManageIsLogin: {
    url: 'https://ccsuat.midea.com:9001/dcp-web/api-community/Featured/mobile/choiceManage/isLogin',
    masUrl: `${domain[`${environment}`] + masPrefix}/api-community/Featured/mobile/choiceManage/isLogin`,
    api: '/api-community/Featured/mobile/choiceManage/isLogin',
  },
  // 发布评论禁言
  isCanIpush: {
    url: `${domain[`${environment}`] + masPrefix}/dcpServiceOpmange/socialAccount/qrySocialAccountDetail`,
    masUrl: `${domain[`${environment}`] + masPrefix}/dcpServiceOpmange/socialAccount/qrySocialAccountDetail`,
    api: '/dcpServiceOpmange/socialAccount/qrySocialAccountDetail',
  },
  //菜谱详情  没地方使用过
  detailwithsportquery: {
    url: 'https://ccsuat.midea.com:9001/dcp-web/smart-recipe/api/v1/recipe/detailwithsportquery',
    masUrl: `${domain[`${environment}`] + masPrefix}:443/smart-recipe/api/v1/recipe/detailwithsportquery`,
    api: '/smart-recipe/api/v1/recipe/detailwithsportquery',
  },
  //v3-菜谱详情  menuDetail在使用
  detailquery: {
    url: 'https://ccsuat.midea.com:9001/dcp-web/smart-recipe/api/v3/recipe/detailquery',
    masUrl: `${domain[`${environment}`] + masPrefix}:443/smart-recipe/api/v3/recipe/detailquery`,
    api: ':443/smart-recipe/api/v3/recipe/detailquery',
  },
  // 批量获取菜谱详情
  getCaiList: {
    url: `${domain[`${environment}`] + masPrefix}/smart-recipe/api/v3/recipe/multidetailquery`,
    masUrl: `${domain[`${environment}`] + masPrefix}/smart-recipe/api/v3/recipe/multidetailquery`,
    api: '/smart-recipe/api/v3/recipe/multidetailquery',
  },
  // /smart-recipe/api/v1/recipe/step/note/info
  //发现页详情未登录
  featuredDetail: {
    url: `${
      domain[`${environment}`] + masPrefix
    }/no_token/api/mcsp_cc/cc-web/mcsp/content/external/article/getDetail.do`,
    masUrl: `${
      domain[`${environment}`] + masPrefix
    }/no_token/api/mcsp_cc/cc-web/mcsp/content/external/article/getDetail.do`,
    api: '/no_token/api/mcsp_cc/cc-web/mcsp/content/external/article/getDetail.do',
    // url: `https://iot-dev.smartmidea.net:443/v1/gateway/device/getInfo`,
    // masUrl: `${domain[`${environment}`] + masPrefix}/api-community/Featured/mobile/choiceManage/choice`,
    // api: "/v1/gateway/device/getInfo"
  },
  //发现页详情已登录
  featuredDetailIsLogin: {
    url: `${domain[`${environment}`] + masPrefix}/token/api/mcsp_cc/cc-web/mcsp/content/external/article/getDetail.do`,
    masUrl: `${
      domain[`${environment}`] + masPrefix
    }/token/api/mcsp_cc/cc-web/mcsp/content/external/article/getDetail.do`,
    api: '/token/api/mcsp_cc/cc-web/mcsp/content/external/article/getDetail.do',
    // url: `https://iot-dev.smartmidea.net:443/v1/gateway/device/getInfo/isLogin`,
    // masUrl: `${domain[`${environment}`] + masPrefix}/api-community/Featured/mobile/choiceManage/choice/isLogin`,
    // api: "/v1/gateway/device/getInfo/isLogin"
  },
  //带出同标签的精选
  getFeatureByLabel: {
    url: `${domain[`${environment}`] + masPrefix}:443/api/mcsp_cc/cc-web/mcsp/content/external/article/page.do`,
    masUrl: `${domain[`${environment}`] + masPrefix}:443/api/mcsp_cc/cc-web/mcsp/content/external/article/page.do`,
    api: ':443/api/mcsp_cc/cc-web/mcsp/content/external/article/page.do',
    // url: `https://iot-dev.smartmidea.net:443/api-community/Featured/mobile/getFeatureByLabel`,
    // masUrl: `${domain[`${environment}`] + masPrefix}/api-community/Featured/mobile/getFeatureByLabel`,
    // api: "/api-community/Featured/mobile/getFeatureByLabel"
  },
  //带出同标签的精选(已登录)
  getFeatureByLabelIsLogin: {
    url: `${domain[`${environment}`] + masPrefix}:token/api/mcsp_cc/cc-web/mcsp/content/external/article/page.do`,
    masUrl: `${domain[`${environment}`] + masPrefix}:token/api/mcsp_cc/cc-web/mcsp/content/external/article/page.do`,
    api: ':token/api/mcsp_cc/cc-web/mcsp/content/external/article/page.do',
    // url: `https://iot-dev.smartmidea.net:443/api-community/Featured/mobile/getFeatureByLabel/isLogin`,
    // masUrl: `${domain[`${environment}`] + masPrefix}/api-community/Featured/mobile/getFeatureByLabel/isLogin`,
    // api: "/api-community/Featured/mobile/getFeatureByLabel/isLogin"
  },

  //查看1级评论
  getCommentList4APP: {
    url: `${
      domain[`${environment}`] + masPrefix
    }:443/api/mcsp_evc/evc-web/mcsp/evaluation/external/evaluate/article/list/byTarget.do`,
    masUrl: `${
      domain[`${environment}`] + masPrefix
    }:443/api/mcsp_evc/evc-web/mcsp/evaluation/external/evaluate/article/list/byTarget.do`,
    api: ':443/api/mcsp_evc/evc-web/mcsp/evaluation/external/evaluate/article/list/byTarget.do',
    // url: `https://iot-dev.smartmidea.net:443/api-community/Featured/mobile/getCommentList4APP`,
    // masUrl: `${domain[`${environment}`] + masPrefix}/api-community/Featured/mobile/getCommentList4APP`,
    // api: "/api-community/Featured/mobile/getCommentList4APP"
  },
  //查看1级评论(已登录)
  getCommentList4APPIsLogin: {
    url: `${
      domain[`${environment}`] + masPrefix
    }/api/mcsp_evc/evc-web/mcsp/evaluation/external/evaluate/article/list/byTarget.do`,
    masUrl: `${
      domain[`${environment}`] + masPrefix
    }/api/mcsp_evc/evc-web/mcsp/evaluation/external/evaluate/article/list/byTarget.do`,
    api: '/api/mcsp_evc/evc-web/mcsp/evaluation/external/evaluate/article/list/byTarget.do',
    // url: `https://iot-dev.smartmidea.net:443/api-community/Featured/mobile/getCommentList4APP/isLogin`,
    // masUrl: `${domain[`${environment}`] + masPrefix}/api-community/Featured/mobile/getCommentList4APP/isLogin`,
    // api: "/api-community/Featured/mobile/getCommentList4APP/isLogin"
  },
  //查看2级评论
  getSecondaryCommentList4APP: {
    url: `${
      domain[`${environment}`] + masPrefix
    }:443/api/mcsp_evc/evc-web/mcsp/evaluation/external/evaluate/article/list/byTarget.do`,
    masUrl: `${
      domain[`${environment}`] + masPrefix
    }:443/api/mcsp_evc/evc-web/mcsp/evaluation/external/evaluate/article/list/byTarget.do`,
    api: ':443:443/api/mcsp_evc/evc-web/mcsp/evaluation/external/evaluate/article/list/byTarget.do',
    // url: `https://iot-dev.smartmidea.net:443/api-community/Featured/mobile/getSecondaryCommentList4APP`,
    // masUrl: `${domain[`${environment}`] + masPrefix}/api-community/Featured/mobile/getSecondaryCommentList4APP`,
    // api: "/api-community/Featured/mobile/getSecondaryCommentList4APP"
  },
  //查看2级评论(已登录)
  getSecondaryCommentList4APPIsLogin: {
    url: `${
      domain[`${environment}`] + masPrefix
    }/api/mcsp_evc/evc-web/mcsp/evaluation/external/evaluate/article/list/byTarget.do`,
    masUrl: `${
      domain[`${environment}`] + masPrefix
    }/api/mcsp_evc/evc-web/mcsp/evaluation/external/evaluate/article/list/byTarget.do`,
    api: '/api/mcsp_evc/evc-web/mcsp/evaluation/external/evaluate/article/list/byTarget.do',
    // url: `https://iot-dev.smartmidea.net:443/api-community/Featured/mobile/getSecondaryCommentList4APP/isLogin`,
    // masUrl: `${domain[`${environment}`] + masPrefix}/api-community/Featured/mobile/getSecondaryCommentList4APP/isLogin`,
    // api: "/api-community/Featured/mobile/getSecondaryCommentList4APP/isLogin"
  },

  //精选点赞
  like: {
    url: `${domain[`${environment}`] + masPrefix}/api/mcsp_evc/evc-web/mcsp/evaluation/external/userAction/like.do`,
    masUrl: `${domain[`${environment}`] + masPrefix}/api/mcsp_evc/evc-web/mcsp/evaluation/external/userAction/like.do`,
    api: '/api/mcsp_evc/evc-web/mcsp/evaluation/external/userAction/like.do',
    // url: `https://iot-dev.smartmidea.net:443/api-community/Featured/mobile/like`,
    // masUrl: `${domain[`${environment}`] + masPrefix}/api-community/Featured/mobile/like`,
    // api: "/api-community/Featured/mobile/like"
  },
  //对评论点赞或取消
  likeComment: {
    url: `${domain[`${environment}`] + masPrefix}/api/mcsp_evc/evc-web/mcsp/evaluation/external/userAction/like.do`,
    masUrl: `${domain[`${environment}`] + masPrefix}/api/mcsp_evc/evc-web/mcsp/evaluation/external/userAction/like.do`,
    api: '/api/mcsp_evc/evc-web/mcsp/evaluation/external/userAction/like.do',
    // url: `https://iot-dev.smartmidea.net:443/api-community/Featured/mobile/likeComment`,
    // masUrl: `${domain[`${environment}`] + masPrefix}/api-community/Featured/mobile/likeComment`,
    // api: "/api-community/Featured/mobile/likeComment"
  },
  //发布评论
  publishComment4APP: {
    url: `${domain[`${environment}`] + masPrefix}/api/mcsp_evc/evc-web/mcsp/evaluation/external/evaluate/submit.do`,
    masUrl: `${domain[`${environment}`] + masPrefix}/api/mcsp_evc/evc-web/mcsp/evaluation/external/evaluate/submit.do`,
    api: '/api/mcsp_evc/evc-web/mcsp/evaluation/external/evaluate/submit.do',
    // url: `https://iot-dev.smartmidea.net:443/api-community/Featured/mobile/publishComment4APP`,
    // masUrl: `${domain[`${environment}`] + masPrefix}/api-community/Featured/mobile/publishComment4APP`,
    // api: "/api-community/Featured/mobile/publishComment4APP"
  },
  //删除自己的评论
  deleteComment: {
    url: `${
      domain[`${environment}`] + masPrefix
    }/api/mcsp_evc/evc-web/mcsp/evaluation/external/evaluate/delete/byUser.do`,
    masUrl: `${
      domain[`${environment}`] + masPrefix
    }/api/mcsp_evc/evc-web/mcsp/evaluation/external/evaluate/delete/byUser.do`,
    api: '/api/mcsp_evc/evc-web/mcsp/evaluation/external/evaluate/delete/byUser.do',
    // url: `https://iot-dev.smartmidea.net:443/api-community/Featured/deleteComment`,
    // masUrl: `${domain[`${environment}`] + masPrefix}/api-community/Featured/deleteComment`,
    // api: "/api-community/Featured/deleteComment"
  },
  //获取电商商品详情接口
  getdisskubyidsv2: {
    url: 'https://ecapi.midea.cn/next/mfop_item/getdisskubyidsv2',
    masUrl: `${domain['prod'] + masPrefix}/next/mfop_item/getdisskubyidsv2`,
    // masUrl: `${domain[`${environment}`] + masPrefix}/next/mfop_item/getdisskubyidsv2`,
    api: '/next/mfop_item/getdisskubyidsv2',
  },
}
export default api
