import config from '../../../config'
const environment = config.environment
const masPrefix = config.masPrefix
const domain = config.domain
const api = {
  //集成灶使用状态
  getDeviceStatus: {
    url: `${domain[`${environment}`] + masPrefix}/cfhrs/smartHearth/appliance/getStatus`,
    masUrl: `${domain[`${environment}`] + masPrefix}/cfhrs/smartHearth/appliance/getStatus`,
    api: '/cfhrs/smartHearth/appliance/getStatus',
  },
  getDeviceActivity: {
    url: `${domain[`${environment}`] + masPrefix}/cfhrs/activePopWindow/v1/api/getConfigList`,
    masUrl: `${domain[`${environment}`] + masPrefix}/cfhrs/activePopWindow/v1/api/getConfigList`,
    api: '/cfhrs/activePopWindow/v1/api/getConfigList',
  },
  getWechatDeviceActivity: {
    url: `${
      domain[`${environment}`] + masPrefix
    }/cfhrs/activityIconManage-server/activePopWindow/v1/api/getWxappConfigList`,
    masUrl: `${
      domain[`${environment}`] + masPrefix
    }/cfhrs/activityIconManage-server/activePopWindow/v1/api/getWxappConfigList`,
    api: '/cfhrs/activityIconManage-server/activePopWindow/v1/api/getWxappConfigList',
  },
  sendAdData: {
    url: `${domain[`${environment}`] + masPrefix}/cfhrs/WxappClickStatistics`,
    masUrl: `${domain[`${environment}`] + masPrefix}/cfhrs/WxappClickStatistics`,
    api: '/cfhrs/WxappClickStatistics',
  },
}
export default api
