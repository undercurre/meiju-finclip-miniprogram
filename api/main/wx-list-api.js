import config from '../../config.js'
const environment = config.environment
const masPrefix = config.masPrefix
const domain = config.domain
const api = {
  //微信设备卡片保存接口
  wxAddCard: {
    url: `${domain[`${environment}`] + masPrefix}/v1/wx/device/addDevicePane`,
    masUrl: `${domain[`${environment}`] + masPrefix}/v1/wx/device/addDevicePane`,
    api: '/v1/wx/device/addDevicePane',
  },
  //微信设备卡片删除接口
  wxDeleCard: {
    url: `${domain[`${environment}`] + masPrefix}/v1/wx/device/deleteDevicePane`,
    masUrl: `${domain[`${environment}`] + masPrefix}/v1/wx/device/deleteDevicePane`,
    api: '/v1/wx/device/deleteDevicePane',
  },
  //查询设备是否已经添加为设备卡片接口
  wxSearchBindStatus: {
    url: `${domain[`${environment}`] + masPrefix}/v1/wx/device/getDevicePane`,
    masUrl: `${domain[`${environment}`] + masPrefix}/v1/wx/device/getDevicePane`,
    api: '/v1/wx/device/getDevicePane',
  },
  // 通过sn或者applianceCode查设备信息 /v1/appliance/info/get
  wxGetDeviceInfo: {
    url: `${domain[`${environment}`] + masPrefix}/v1/appliance/info/get`,
    masUrl: `${domain[`${environment}`] + masPrefix}/v1/appliance/info/get`,
    api: '/v1/appliance/info/get',
  },
  // 查询设备状态
  wxGetDeviceAvailabilityVerify: {
    url: `${domain[`${environment}`] + masPrefix}/v1/wx/device/availability/verify`,
    masUrl: `${domain[`${environment}`] + masPrefix}/v1/wx/device/availability/verify`,
    api: '/v1/wx/device/availability/verify',
  },
  // 批量新增设备卡片接口
  wxAddCardBatch: {
    url: `${domain[`${environment}`] + masPrefix}/v1/wx/device/batch/add`,
    masUrl: `${domain[`${environment}`] + masPrefix}/v1/wx/device/batch/add`,
    api: '/v1/wx/device/batch/add',
  },
  // 微信设备卡片—白名单-添加或者判断白名单
  checkIsInWhiteList: {
    url: `${domain[`${environment}`] + masPrefix}/v1/wx/deviceCard/allowList/addOrIsIn`,
    masUrl: `${domain[`${environment}`] + masPrefix}/v1/wx/deviceCard/allowList/addOrIsIn`,
    api: '/v1/wx/deviceCard/allowList/addOrIsIn',
  },
}
export default api
