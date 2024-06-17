import { typeObj } from '../../../../assistant/core/tools'

const mapMethod = function (ast, methodMap) {
  let behavior = {}
  let methods = {}
  if (typeObj(methodMap) == 'Array') {
    methodMap = methodMap.reduce((data, key) => {
      data[key] = key.split('.').pop()
      return data
    }, {})
  }
  for (let key in methodMap) {
    let methodParams = ast.getWatchParams(key, 'methods')
    let methodKey = methodParams.keyArr[methodParams.keyArr.length - 1]
    let methodValue = methodMap[key]
    methods[methodValue] = (...args) => {
      return methodParams.data[methodKey](...args)
    }
  }
  behavior['methods'] = methods
  return behavior
}

export default mapMethod
