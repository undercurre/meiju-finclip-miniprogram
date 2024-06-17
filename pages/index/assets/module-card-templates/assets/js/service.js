/*
 * @desc: 物模型卡片点
 * @author: zhucc22
 * @Date: 2024-03-11 10:42:36
 */
import { getReqId } from 'm-utilsdk/index'
const requestService = getApp().getGlobalConfig().requestService

const service = {
  //物模型2.0用于设置设备属性，设置会转化为指令透传到设备。
  controlProperties(url, reqData, method) {
    url = url + '?requestId=' + getReqId() + '&sync=true'
    return new Promise((resolve, reject) => {
      requestService.request(url, reqData, method).then(
        (resp) => {
          if (resp.data.code == 0) {
            resolve(resp.data)
          } else {
            reject(resp)
          }
        },
        (error) => {
          reject(error)
        }
      )
    })
  },
}

export { service }
