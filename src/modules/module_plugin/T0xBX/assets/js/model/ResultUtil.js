import Result from './Result'

const STATUS_SUCCESS = 200
const STATUS_FAIL = 500

class ResultUtil {
  static success(data, msg = null, callbackName = null) {
    let result = new Result(STATUS_SUCCESS, msg, data, callbackName)
    return result
  }

  static fail(data, msg = null, callbackName = null) {
    let result = new Result(STATUS_FAIL, msg, data, callbackName)
    return result
  }

  static isSuccess({status}) {
    return status === STATUS_SUCCESS
  }

  static getData({data}) {
    return data
  }

  static getMsg({msg}) {
    return msg
  }

  static getCallbackName({callbackName}) {
    return callbackName
  }
}

export default ResultUtil