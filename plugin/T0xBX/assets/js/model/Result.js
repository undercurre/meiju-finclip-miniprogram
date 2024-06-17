import {isObject} from '../../../utils/util'

class Result {
  constructor(status, msg = null, data, callbackName) {
    this.status = status
    this.msg = isObject(msg) ? JSON.stringify(msg) : msg
    this.data = data
    this.callbackName = callbackName
  }
}

export default Result