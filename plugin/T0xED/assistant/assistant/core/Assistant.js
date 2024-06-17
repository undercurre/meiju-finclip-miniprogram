import assistantProxy from './assistantProxy'
import Watcher from './Watcher'
import observer from './observer'

const assistantOptions = {}

const assistantDefaultModuleOptions = {
  // module: '',
  namespace: false,
}

class Assistant {
  constructor(options = {}, list = []) {
    this.options = Object.freeze(Object.assign({}, assistantOptions, options))
    this.states = observer({})
    this.methods = {}
    this.modules = []

    this._that = assistantProxy(this)

    if (list.length > 0) this.createModules(list)

    return this._that
  }
  createModules(list) {
    list = list instanceof Array ? list : [list]
    list.forEach((module) => this._that._initModule(module))
    list.forEach((module) => {
      if (module.watch) {
        Object.keys(module.watch).forEach((key) => {
          this.watcher(key, module.watch[key].bind(this._that))
        })
      }
      if (module.init) {
        let fn = module.init.bind(this._that)
        fn()
      }
    })
  }
  _initModule(module) {
    const options = Object.assign({}, assistantDefaultModuleOptions, module.options)
    if (!options.namespace) {
      if (options.module && options.module !== '') {
        this.modules.push('$' + options.module)
        this['$' + options.module] = Object.freeze({ options })
      }
      if (module.states) {
        let statesKeys = Object.keys(module.states)
        statesKeys.forEach((sKey) => {
          this.states[sKey] = module.states[sKey]
        })
      }
      if (module.methods) {
        let methodKeys = Object.keys(module.methods)
        methodKeys.forEach((mKey) => {
          this.methods[mKey] = module.methods[mKey].bind(this)
        })
      }
    } else {
      this.modules.push('$' + options.module)
      let moduleObj = {}
      moduleObj.options = Object.freeze(options)
      moduleObj.states = observer(module.states || {})
      moduleObj.methods = {}
      if (module.methods) {
        let methodKeys = Object.keys(module.methods)
        methodKeys.forEach((mKey) => {
          moduleObj.methods[mKey] = module.methods[mKey].bind(this)
        })
      }
      this['$' + options.module] = assistantProxy(moduleObj)
    }
    return this._that
  }
  getMapAssistant(list) {
    return assistantProxy(this, list)
  }
  watcher(key, handler) {
    let { data, keyArr } = this.getWatchParams(key)
    new Watcher(data, keyArr[keyArr.length - 1], handler, this)
  }
  getWatchParams(key, prop = 'states') {
    let keyArr = key.split('.')
    let data = this
    if (keyArr[0] === prop) {
    } else if (keyArr[0][0] === '$' && this[keyArr[0]]) {
      if (keyArr[1] === prop) {
      } else {
        keyArr.splice(1, 0, prop)
      }
    } else {
      data = this[prop]
    }
    keyArr.forEach((key, index) => {
      if (keyArr.length - 1 === index) return
      data = data[key]
    })
    return {
      keyArr,
      data,
    }
  }
}

export default Assistant
