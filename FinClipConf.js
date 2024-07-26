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

  ],
}
