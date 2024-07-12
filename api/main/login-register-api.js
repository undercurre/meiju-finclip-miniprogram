/*
 * @desc:
 * @author: zhucc22
 * @Date: 2024-06-17 16:59:38
 */
import config from '../../config.js'
const environment = config.environment
const masPrefix = config.masPrefix
const domain = config.domain
const api = {
  //获取openId
  getOpendId2: {
    url: `${domain[`${environment}`]}/v2/wx/openId/get`,
    masUrl: `${domain[`${environment}`] + masPrefix}/HarmonyOS/mjl/v2/wx/openId/get`,
    api: '/v2/wx/openId/get',
  },
  //登录接口
  loginMuc: {
    url: `${domain[`${environment}`]}/muc/v5/app/mj/user/applet/wx2/login`,
    masUrl: `${domain[`${environment}`] + masPrefix}/HarmonyOS/mjl/wx2/login`,
    api: '/muc/v5/app /mj/user/applet/wx2/login',
  },
  //解密手机号
  getPhoneNumberMuc: {
    url: `${domain[`${environment}`]}/muc/v5/app/mj/user/applet/wx2/mobile/decode`,
    masUrl: `${domain[`${environment}`] + masPrefix}/HarmonyOS/mjl/wx2/mobile/decode`,
    api: '/muc/v5/app/mj/user/applet/wx2/mobile/decode',
  },
  //绑定接口
  bindMuc: {
    url: `${domain[`${environment}`]}/muc/v5/app/mj/user/applet/wx2/mobile/bind
    `,
    masUrl: `${domain[`${environment}`] + masPrefix}/HarmonyOS/mjl/wx2/mobile/bind`,
    api: '/muc/v5/app/mj/user/applet/wx2/mobile/bind',
  },
  //注册接口
  rigisterMuc: {
    url: `${domain[`${environment}`]}/muc/v5/app/mj/user/applet/wx2/mobile/register/bind
    `,
    masUrl: `${domain[`${environment}`] + masPrefix}/HarmonyOS/mjl/wx2/mobile/register/bind`,
    api: '/muc/v5/app/mj/user/applet/wx2/mobile/register/bind',
  },
  // 获取jwt token
  getJwtToken: {
    url: `${domain[`${environment}`]}/v1/user/wx/c4a/getJwtToken`,
    //masUrl: `${domain[`${environment}`] + masPrefix}/v1/user/wx/c4a/getJwtToken`, //旧配置
    masUrl: `${domain[`${environment}`] + masPrefix}/HarmonyOS/v1/user/c4a/getJwtToken`, //新配置
    api: 'v1/user/wx/c4a/getJwtToken',
  },
  //获取用户注销状态信息接口
  getLogOutStatus: {
    url: `${domain[`${environment}`]}/v1/user/wx/c4a/cancelStatusInfo`,
    //masUrl: `${domain[`${environment}`] + masPrefix}/v1/user/wx/c4a/cancelStatusInfo`, //旧配置
    masUrl: `${domain[`${environment}`] + masPrefix}/HarmonyOS/mjl/v1/user/wx/c4a/cancelStatusInfo`, //新配置
    api: '/v1/user/wx/c4a/cancelStatusInfo',
  },
  getChangePhoneSmsCode: {
    url: `${domain[`${environment}`]}/v1/user/sms/code/get`,
    //masUrl: `${domain[`${environment}`] + masPrefix}/v1/user/wx/c4a/cancelStatusInfo`, //旧配置
    masUrl: `${domain[`${environment}`] + masPrefix}/HarmonyOS/v1/user/sms/code/get`, //新配置
    api: '/v1/user/sms/code/get',
  }, //用户更换绑定手机号码，需要发送验证码，文档https://yapi.smartmidea.net/project/209/interface/api/20363
  setBindUserPhone: {
    url: `${domain[`${environment}`]}/v1/user/mobile/modify`,
    //masUrl: `${domain[`${environment}`] + masPrefix}/v1/user/wx/c4a/cancelStatusInfo`, //旧配置
    masUrl: `${domain[`${environment}`] + masPrefix}/HarmonyOS/v1/user/mobile/modify`, //新配置
    api: '/v1/user/mobile/modify',
  }, //更换绑定新的手机号码https://yapi.smartmidea.net/project/209/interface/api/20378
  verifyUserCode: {
    url: `${domain[`${environment}`]}/mj/user/mobileVerify`,
    //masUrl: `${domain[`${environment}`] + masPrefix}/v1/user/wx/c4a/cancelStatusInfo`, //旧配置
    masUrl: `${domain[`${environment}`] + masPrefix}/HarmonyOS/mj/user/mobileVerify`, //新配置
    api: '/mj/user/mobileVerify',
  },
}
export default api
