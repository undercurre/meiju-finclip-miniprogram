/*
 * @desc:
 * @author: zhucc22
 * @Date: 2024-06-17 16:59:38
 */
import discoverApi from './main/discover-api.js' //发现模块接口
import mideaServiceApi from './main/midea-service-api.js' //美的服务模块接口
import wxBindApi from './main/wx-bind-api.js' //绑定到微信设置相关的接口
import distributionNetworkApi from './main/distribution-network-api.js' //配网相关接口
import loginRegisterApi from './main/login-register-api.js' //微信流量限制改版的新登陆接口
import nfcAPi from './main/nfc-api.js' //nfc需求相关的接口
import deviceSubscribeApi from './main/device-subscribe-api' //用户设备订阅相关接口
import mideaVirtualPlugin from './main/midea-virtual-plugin' //插件页相关接口
import wxListApi from './main/wx-list-api.js' //设备卡片相关api
const api = {
  ...discoverApi,
  ...mideaServiceApi,
  ...wxBindApi,
  ...distributionNetworkApi,
  ...loginRegisterApi,
  ...nfcAPi,
  ...deviceSubscribeApi,
  ...wxListApi,
  ...mideaVirtualPlugin,
}
export default api
