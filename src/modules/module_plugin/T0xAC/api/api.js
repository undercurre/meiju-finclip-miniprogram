const api = {
  // 安全模式设置
  safeModeSet: '/bluetooth/control/safeMode/set',
  // 安全模式密码校验
  passwdCheck: '/bluetooth/control/passwd/check',
  // 安全模式状态查询
  safeModeQuery: '/bluetooth/control/safeMode/query',
  // 是否输入过密码查询
  safeModeAuthQuery: '/bluetooth/control/safeMode/auth/query',

  // 
  safeModeClear: '/bluetooth/control/safeMode/clear',
  // 
  userInfoGet: '/bluetooth/control/minigram/userInfo/get',
  
  getSleepCurve: '/bluetooth/control/sleepCurve/startTemp/query',

  setSleepCurve: '/bluetooth/control/sleepCurve/startTemp/set',

  getElectric: '/jykt/bluetooth/control/queryElec',

  radarGetTip: '/jykt-lite/rac-air-screen/screen/radar/getTip',

  getProductImgBySn8: '/jykt/plugins/picInfo/getBySn8'
}
export default api
