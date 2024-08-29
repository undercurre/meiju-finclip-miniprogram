/*
 * @desc: 环境变量获取
 * @author: zhucc22
 * @Date: 2024-07-22 16:13:49
 */
let environment = 'sit'
export default function () {
  try {
    ft.getAppInfo({
      success: function (res) {
        console.log('config getAppInfo success ------------>', res)
        getApp().globalData.appEnv = res.data.data.ENV
        getApp().globalData.appVersion = res.data.data.VERSION_NAME
        let env = res.data.data.ENV == 'sit' ? res.data.data.ENV : 'prod'
        environment = env
      },
      fail: function (res) {
        console.log('config getAppInfo fail--------->', res)
        environment = 'sit'
      },
    })
  } catch (error) {
    environment = 'sit'
  }
  console.log('getEnv environment--------->', environment)
  return environment
}
