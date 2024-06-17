import Dep from './Dep'
import { typeObj } from './tools'

const observer = function (data) {
  let dep = new Dep()
  return new Proxy(data, {
    get: (target, prop) => {
      Dep.target && dep.addSub(prop, Dep.target)
      return target[prop]
    },
    set: (target, prop, value) => {
      let oldValue = target[prop]
      if (typeObj(value) === 'Object') {
        Reflect.set(target, prop, observer(value))
        dep.notify(prop, value, oldValue)
        return true
      }
      Reflect.set(target, prop, value)
      dep.notify(prop, value, oldValue)
      return true
    },
  })
}

export default observer
