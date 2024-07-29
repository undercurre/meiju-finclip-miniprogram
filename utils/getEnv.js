/*
 * @desc:
 * @author: zhucc22
 * @Date: 2024-07-22 16:13:49
 */
let environment = 'sit'
export default function () {
  try {
    ft.getAppInfo({
      success: function (res) {
        console.log('getAppInfo success ------------>', res)
        let env = res.data.data.ENV == 'sit' ? res.data.data.ENV : 'prod'
        environment = env
      },
      fail: function (res) {
        console.log('getAppInfo fail--------->', res)
        environment = 'sit'
      },
    })
  } catch (error) {
    environment = 'sit'
  }
  console.log('environment--------->', environment)
  return environment
}
