import { typeObj } from './tools'
import Dep from './Dep'

class Watcher {
  constructor(data, key, cb) {
    Dep.target = this
    this.cb = cb
    this.data = data[key]
    Dep.target = null
  }
  update(newValue, oldValue) {
    if (typeObj(this.data) === 'Array') {
      this.cb(newValue, oldValue)
    } else {
      this.cb(newValue, oldValue)
    }
  }
}

export default Watcher
