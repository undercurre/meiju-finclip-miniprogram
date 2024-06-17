import config from '../../config.js'
const environment = config.environment
const masPrefix = config.masPrefix
const domain = config.domain
const api = {
  //IoT-家庭管理-12.成员请求加入家庭-成员发送请求
  joinDend: {
    url: `${domain[`${environment}`] + masPrefix}/v1/homegroup/member/join/send`,
    masUrl: `${domain[`${environment}`] + masPrefix}/v1/homegroup/member/join/send`,
    api: '/v1/homegroup/member/join/send',
  },
  nfcBindGet: {
    url: `${domain[`${environment}`] + masPrefix}/v1/appliance/nfc/info/bind/get`,
    masUrl: `${domain[`${environment}`] + masPrefix}/v1/appliance/nfc/info/bind/get`,
    api: '/v1/appliance/nfc/info/bind/get',
  },
}
export default api
