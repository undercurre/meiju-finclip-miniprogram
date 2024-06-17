import { requestService } from '../../../../../utils/requestService'
const service = {
  //禁言状态
  isCanIpush: () => {
    return new Promise((resolve, reject) => {
      let data = {}
      requestService.request('isCanIpush', data).then(
        (resp) => {
          if (resp.data.code == 0) {
            resolve(resp.data.data)
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
