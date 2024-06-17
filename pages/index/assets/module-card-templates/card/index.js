/*
 * @desc: 物模型卡片组件
 * @author: zhucc22
 * @Date: 2023-10-25 17:53:35
 */
// const getEnv = getApp().getGlobalConfig().getEnv
// const host = getApp().getGlobalConfig().host
// const environment = getEnv()
// const baseHost = host[environment]
// const baseUrl = baseHost.imgPrefix

Component({
  properties: {
    deviceInfo: {
      type: Object,
      value: '',
    },
  },
  data: {
    // jdOnStyle: `background:url(${baseUrl}activities/newstyle/bg/bg_online_device@3x.png) no-repeat;background-size:100%;`,
    // jdOffStyle: `background:url(${baseUrl}activities/newstyle/bg/bg_offline_device@3x.png) no-repeat;background-size:100%;`,
    deviceItem: {},
  },
  lifetimes: {
    attached: function () {},
  },
})
