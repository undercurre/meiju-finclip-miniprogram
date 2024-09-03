/*
 * @desc: 宿主注入接口
 * @author: zhucc22
 * @Date: 2024-07-29 09:22:16
 */
module.exports = {
  extApi: [
    {
      // 字节埋点sdk
      name: 'trackEvent', //扩展api名 该api必须Native方实现了
      sync: false, //是否为同步api
      params: {},
    },
    {
      // 扫码调试小程序
      name: 'startAppletByQrCode', //扩展api名 该api必须Native方实现了
      sync: true, //是否为同步api
      params: {},
    },
    {
      // 切换打开标志
      name: 'changeIsStartAppletByQrCode', //扩展api名 该api必须Native方实现了
      sync: true, //是否为同步api
      params: {},
    },
    {
      // 退出应用
      name: 'terminateSelf', //扩展api名 该api必须Native方实现了
      sync: true, //是否为同步api
      params: {},
    },
    {
      // 拉起应用市场对应的应用详情界面
      name: 'startAppGalleryDetailAbility', //扩展api名 该api必须Native方实现了
      sync: true, //是否为同步api
      params: {},
    },
    {
      // 获取app版本号
      name: 'getAppInfo', //扩展api名 该api必须Native方实现了
      sync: false, //是否为同步api
      params: {},
    },
    {
      name: 'changeIsShowVConsole', //切换vconsole显示
      sync: false, //是否为同步api
      params: {},
    },
    {
      name: 'clearAppCache', //清除app缓存
      sync: false, //是否为同步api
      params: {},
    },
    {
      name: 'changeCustomEnv', //切换当前环境
      sync: false, //是否为同步api
      params: {},
    },
    {
      name: 'restartApp', //重启应用
      sync: false, //是否为同步api
      params: {},
    },
    {
      //监听wifi是否开启
      name: 'wifiStateOnChange',
      sync: false, //是否为同步api
      params: {},
    },
    {
      // 系统蓝牙开关
      name: 'changeBlueTooth',
      sync: true, //是否为同步api
      params: {},
    },
    {
      // 拉起浏览器接口 - 内测升级弹窗
      name: 'startBrowsableAbility',
      sync: true, //是否为同步api
      params: {},
    },
    {
      // 获取app版本号
      name: 'getAppInfoSync',
      sync: true, //是否为同步api
      params: {},
    },
  ],
}
