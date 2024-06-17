import config from '../../../config.js'
const environment = config.environment
const masPrefix = config.masPrefix
const domain = config.domain
const robotActivityDomain = config.robotActivityDomain
const api = {
  //弹窗活动请求接口
  getActiveInfo: {
    url: `${robotActivityDomain[`${environment}`] + masPrefix}/wbhqj/v2/app2pro/activity/get`,
    masUrl: `${domain[`${environment}`] + masPrefix}/wbhqj/v2/app2pro/activity/get`,
    api: '/wbhqj/v2/app2pro/activity/get',
  },
  //活动图片获取
  getActiveImageUrl: {
    url: `${robotActivityDomain[`${environment}`] + masPrefix}/wbhqj/v2/app2pro/activity/icon/get`,
    masUrl: `${domain[`${environment}`] + masPrefix}/wbhqj/v2/app2pro/activity/icon/get`,
    api: '/wbhqj/v2/app2pro/activity/icon/get',
  },
  //活动已读
  getActiveRead: {
    url: `${robotActivityDomain[`${environment}`] + masPrefix}/wbhqj/v2/app2pro/activity/read`,
    masUrl: `${domain[`${environment}`] + masPrefix}/wbhqj/v2/app2pro/activity/read`,
    api: '/wbhqj/v2/app2pro/activity/read',
  },
  //获取活动列表
  getDynamicActivityList: {
    url: `${robotActivityDomain[`${environment}`] + masPrefix}/wbhqj/v2/app2pro/activity/list`,
    masUrl: `${domain[`${environment}`] + masPrefix}/wbhqj/v2/app2pro/activity/list`,
    api: '/wbhqj/v2/app2pro/activity/list',
  },
}
export default api
