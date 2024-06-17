/**
 * 事务机制
 * 使用场景：用于在执行某个方法前后执行特定处理函数
 * 例子：发送设备控制之前，需要发送埋点，或整理请求参数；发送返回之后，需要发送埋点，或者整理返回数据。
 *      其中，对应的事务分别是埋点事务与请求前后数据处理。
 * 用法：鉴于事务的处理顺序，可以嵌套调用或平级线性调用来调整处理顺序
 * 注意：1.受制于函数返回值只能有一个，事务中的多个参只能以对象的形式传递
 *      2.注意promise的返回值的传递，错误的抛出，合理使用async await
 */

class Transaction {
  constructor(wrappers = []) {
    this.wrappers = wrappers
  }
  initWrappers(wrappers) {
    this.wrappers = [...this.wrappers, ...wrappers]
  }
  perform(methods, scope) {
    let that = this
    return async function (args) {
      let errorThrow
      let ret
      try {
        errorThrow = true
        let retArgs = await that.initializeAll(0, args)
        if (retArgs) {
          ret = methods.call(scope, retArgs)
        } else {
          ret = methods.call(scope, args)
        }
        errorThrow = false
      } catch (e) {
      } finally {
        if (ret) {
          ret = that.closeAll(0, ret)
        } else {
          ret = that.closeAll(0, args)
        }
      }
      return ret
    }
  }
  async initializeAll(startIndex, args) {
    let wrappers = this.wrappers
    let errorThrow
    let ret = args
    for (let i = startIndex; i < wrappers.length; i++) {
      let wrapper = wrappers[i]
      if (wrapper.initialize) {
        try {
          errorThrow = true
          let currentRet = await wrapper.initialize(ret)
          if (currentRet) {
            ret = currentRet
          }
          errorThrow = false
        } catch (e) {
        } finally {
          if (errorThrow) {
            try {
              ret = this.initializeAll(i + 1, args)
            } catch (err) {}
          }
        }
      }
    }
    return ret
  }
  async closeAll(startIndex, args) {
    let wrappers = this.wrappers
    let errorThrow
    let ret = args
    for (let i = startIndex; i < wrappers.length; i++) {
      let wrapper = wrappers[i]
      if (wrapper.close) {
        try {
          errorThrow = true
          let currentRet = await wrapper.close(ret)
          if (currentRet) {
            ret = currentRet
          }
          errorThrow = false
        } catch (e) {
        } finally {
          if (errorThrow) {
            try {
              ret = this.closeAll(i + 1, args)
            } catch (err) {}
          }
        }
      }
    }
    return ret
  }
}

export default Transaction
