import { typeObj } from '../../../../assistant/core/tools'

const mapState = function (ast, stateMap) {
  let c = {
    c: null,
    timer: null,
    setData: function (data) {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        if (this.c) {
          this.c.setData(data)
        }
      }, 50)
    },
  }
  console.log('mapState', ast, c)
  let behavior = {}
  let data = {}
  if (typeObj(stateMap) == 'Array') {
    stateMap = stateMap.reduce((data, key) => {
      data[key] = key.split('.').pop()
      return data
    }, {})
  }
  for (let key in stateMap) {
    let watchParams = ast.getWatchParams(key)
    let stateValue = stateMap[key]
    let stateKey = watchParams.keyArr[watchParams.keyArr.length - 1]
    if (typeObj(stateValue) === 'Object') {
      ast.watcher(key, function () {
        setTimeout(() => {
          if (c.c) stateValue.handler.call(c.c)
        }, 50)
      })
    } else {
      data[stateValue] = watchParams.data[stateKey]
      ast.watcher(key, function () {
        data[stateValue] = watchParams.data[stateKey]
        if (c.c) c.c.data[stateValue] = watchParams.data[stateKey]
        c.setData(data)
      })
    }
  }
  behavior['data'] = data
  behavior['lifetimes'] = {
    attached: function () {
      c.c = this
      this.setData(data)
    },
  }
  behavior['onLoad'] = function () {
    c.c = this
    this.setData(data)
  }
  return behavior
}

export default mapState
