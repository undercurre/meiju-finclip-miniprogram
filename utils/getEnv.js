/*
 * @desc: 环境变量获取
 * @author: zhucc22
 * @Date: 2024-07-22 16:13:49
 */
export default function () {
  let environment = 'prod'
  try {
    const res = ft.getAppInfoSync()
    console.log('同步获取app版本相关信息------>', res.data)
    console.log('同步获取app版本------>', res.data.ENV)
    let env = res.data.ENV == 'sit' ? res.data.ENV : 'prod'
    environment = env
  } catch (error) {
    console.log('同步获取app版本error------->', error)
    environment = 'prod'
  }
  console.log('当前小程序环境-------->', environment)
  return environment
}
