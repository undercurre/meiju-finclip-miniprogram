import config from '../../../config'
const environment = config.environment
const masPrefix = config.masPrefix
const domain = config.domain
const api = {
  //清洁管家接口
  getDeviceCleanStatus: {
    url: `${domain[`${environment}`] + masPrefix}/cfhrs/b6/v1/api`,
    masUrl: `${domain[`${environment}`] + masPrefix}/cfhrs/b6/v1/api`,
    api: '/cfhrs/b6/v1/api',
  },
  getDeviceCommonStatus: {
    url: `${domain[`${environment}`] + masPrefix}/cfhrs/common/v1/api`,
    masUrl: `${domain[`${environment}`] + masPrefix}/cfhrs/common/v1/api`,
    api: '/cfhrs/common/v1/api',
  },
}
export default api
