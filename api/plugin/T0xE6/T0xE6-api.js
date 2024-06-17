import config from '../../../config'
const environment = config.environment
const masPrefix = config.masPrefix
const domain = config.domain
const api = {
  common: {
    url: `${domain[`${environment}`] + masPrefix}/cfhrs/common/v1/api`,
    masUrl: `${domain[`${environment}`] + masPrefix}/cfhrs/common/v1/api`,
    api: '/cfhrs/common/v1/api',
  },
  e6: {
    url: `${domain[`${environment}`] + masPrefix}/cfhrs/e6/v1/api`,
    masUrl: `${domain[`${environment}`] + masPrefix}/cfhrs/e6/v1/api`,
    api: '/cfhrs/e6/v1/api',
  },
}
export default api
