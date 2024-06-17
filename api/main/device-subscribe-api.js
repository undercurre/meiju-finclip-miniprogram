import config from '../../config.js'
const environment = config.environment
const masPrefix = config.masPrefix
const domain = config.domain
const api = {
  //批量查询用户设备订阅状态
  queryDeviceSubscribe: {
    url: `${domain[`${environment}`] + masPrefix}/mj/wx/device/subscribe/query`,
    masUrl: `${domain[`${environment}`] + masPrefix}/mj/wx/device/subscribe/query`,
    api: '/mj/wx/device/subscribe/query',
  },

  //批量保存用户设备订阅状态
  saveDeviceSubscribe: {
    url: `${domain[`${environment}`] + masPrefix}/mj/wx/device/subscribe/save`,
    masUrl: `${domain[`${environment}`] + masPrefix}/mj/wx/device/subscribe/save`,
    api: '/mj/wx/device/subscribe/save',
  },

  //获取设备deviceId
  getDeviceId: {
    url: `${domain[`${environment}`] + masPrefix}/v1/wx/get/deviceId`,
    masUrl: `${domain[`${environment}`] + masPrefix}/v1/wx/get/deviceId`,
    api: '/v1/wx/get/deviceId',
  },

  //获取设备snTicket
  getSnTicket: {
    url: `${domain[`${environment}`] + masPrefix}/v1/wx/get/deviceBill`,
    masUrl: `${domain[`${environment}`] + masPrefix}/mjl/v1/wx/get/deviceBill`,
    api: '/v1/wx/get/deviceBill',
  },
}

export default api
