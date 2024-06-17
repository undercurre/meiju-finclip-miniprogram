import {
  requestService
} from '../../../../../../utils/requestService';
import { getStamp } from 'm-utilsdk/index'

const createRequester = function (applianceCode = null) {
  if (applianceCode) {
    return function (action, command = {}) {
      return requestService.request(action, {
        applianceCode: applianceCode,
        command: command,
        reqId: getStamp().toString(),
        stamp: getStamp()
      })
    }
  } else {
    return function (action, params = {}) {
      return requestService.request(action, params).then(res => {
        return res.data || null
      })
    }
  }
}

export default createRequester
