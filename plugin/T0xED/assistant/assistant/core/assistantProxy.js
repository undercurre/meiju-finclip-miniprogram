const assistantDefaultKeys = ['options', 'states', 'modules', 'methods']

const assistantProxy = function (obj, moduleList) {
  return new Proxy(obj, {
    get(target, prop) {
      if (!target) return true
      let keys
      if (target.__proto__ && prop in target.__proto__) {
        return target.__proto__[prop]
      }
      keys = Reflect.ownKeys(target)
      if (keys.includes(prop)) {
        if (assistantDefaultKeys.includes(prop)) {
          return target[prop]
        }
        if (moduleList instanceof Array) {
          if (moduleList.includes(prop)) {
            return target[prop]
          } else {
            throw new Error(`\'${prop}\' is not in target object `)
          }
        }
        return target[prop]
      }
      if (keys.includes('states')) {
        let sKeys = Reflect.ownKeys(target.states)
        if (sKeys.includes(prop)) {
          return target.states[prop]
        }
      }
      if (keys.includes('methods')) {
        let mkeys = Reflect.ownKeys(target.methods)
        if (mkeys.includes(prop)) {
          return target.methods[prop]
        }
      }
    },
    set(target, prop, value) {
      let keys = Reflect.ownKeys(target)
      if (keys.includes('states')) {
        let sKeys = Reflect.ownKeys(target.states)
        if (sKeys.includes(prop)) {
          return Reflect.set(target.states, prop, value)
        }
      }
      if (keys.includes('states') && assistantDefaultKeys.includes(prop)) {
        return false
      }

      if (keys.includes('states')) {
        return Reflect.set(...arguments)
      } else {
        if (keys.includes(prop)) {
          return Reflect.set(...arguments)
        }
      }
    },
  })
}

export default assistantProxy
