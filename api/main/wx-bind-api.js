import config from '../../config.js'
const environment = config.environment
const masPrefix = config.masPrefix
const domain = config.domain
const api = {
  //获取可绑定的设备列表
  wxbindList: {
    url: `${domain[`${environment}`] + masPrefix}/v1/wxentrance/appliance/sync/list`,
    masUrl: `${domain[`${environment}`] + masPrefix}/v1/wxentrance/appliance/sync/list`,
    api: '/v1/wxentrance/appliance/sync/list',
  },
  //根据微信返回的参数获取设备的详情
  wxDeviceDetail: {
    url: `${domain[`${environment}`] + masPrefix}/v1/wxentrance/appliance/sync/info`,
    masUrl: `${domain[`${environment}`] + masPrefix}/v1/wxentrance/appliance/sync/info`,
    api: '/v1/wxentrance/appliance/sync/info',
  },
  //绑定设备到微信设置页面
  wxBind: {
    url: `${domain[`${environment}`] + masPrefix}/v1/wxentrance/bind/device`,
    masUrl: `${domain[`${environment}`] + masPrefix}/v1/wxentrance/bind/device`,
    api: '/v1/wxentrance/bind/device',
  },
  //解绑微信设置页面设备
  wxUnbind: {
    url: `${domain[`${environment}`] + masPrefix}/v1/wxentrance/unbind/device`,
    masUrl: `${domain[`${environment}`] + masPrefix}/v1/wxentrance/unbind/device`,
    api: '/v1/wxentrance/unbind/device',
  },
}
export default api
