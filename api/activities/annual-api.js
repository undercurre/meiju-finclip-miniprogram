import config from '../../config.js'
const environment = config.environment
const masPrefix = config.masPrefix
const domain = config.domain
const api = {
  // 年度报告
  annualShare: {
    url: `${domain[`${environment}`] + masPrefix}/v1/activity/year/report/partakeOf/report`,
    masUrl: `${domain[`${environment}`] + masPrefix}/v1/activity/year/report/partakeOf/report`,
    api: '/v1/activity/year/report/partakeOf/report',
  },
}
export default api
