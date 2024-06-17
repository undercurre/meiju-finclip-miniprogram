import config from '../../../config.js'
const environment = config.environment
// const environment = 'sit'
const masPrefix = config.masPrefix
const domain = config.domain
const acDomain = config.acDomain
const api = {
  safeModeSet: {
    url: `${acDomain[`${environment}`]}/bluetooth/control/safeMode/set`,
    masUrl: `${domain[`${environment}`] + masPrefix}/bluetooth/control/safeMode/set`,
  },
  passwdCheck: {
    url: `${acDomain[`${environment}`]}/bluetooth/control/passwd/check`,
    masUrl: `${domain[`${environment}`] + masPrefix}/bluetooth/control/passwd/check`,
  },
  safeModeQuery: {
    url: `${acDomain[`${environment}`]}/bluetooth/control/safeMode/query`,
    masUrl: `${domain[`${environment}`] + masPrefix}/bluetooth/control/safeMode/query`,
  },
  safeModeAuthQuery: {
    url: `${acDomain[`${environment}`]}/bluetooth/control/safeMode/auth/query`,
    masUrl: `${domain[`${environment}`] + masPrefix}/bluetooth/control/safeMode/auth/query`,
  },
  safeModeClear: {
    url: `${acDomain[`${environment}`]}/bluetooth/control/safeMode/clear`,
    masUrl: `${domain[`${environment}`] + masPrefix}/bluetooth/control/safeMode/clear`,
  },
  userInfoGet: {
    url: `${acDomain[`${environment}`]}/bluetooth/control/minigram/userInfo/get`,
    masUrl: `${domain[`${environment}`] + masPrefix}/bluetooth/control/minigram/userInfo/get`,
  },
  getSleepCurve: {
    url: `${acDomain[`${environment}`]}/bluetooth/control/sleepCurve/startTemp/query`,
    masUrl: `${domain[`${environment}`] + masPrefix}/bluetooth/control/sleepCurve/startTemp/query`,
  },
  setSleepCurve: {
    url: `${acDomain[`${environment}`]}/bluetooth/control/sleepCurve/startTemp/set`,
    masUrl: `${domain[`${environment}`] + masPrefix}/bluetooth/control/sleepCurve/startTemp/set`,
  },
  getElectric: {
    url: `${acDomain[`${environment}`]}/jykt/bluetooth/control/queryElec`,
    masUrl: `${domain[`${environment}`] + masPrefix}/jykt/bluetooth/control/queryElec`,
  },
}
export default api
