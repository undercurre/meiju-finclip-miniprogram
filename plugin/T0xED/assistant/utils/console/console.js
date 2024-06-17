const consoleFunction = function (platform) {
  return function (...args) {
    if (platform == 'meiju' || platform == 'wechat') {
      console.log('assistant ', ...args)
    }
  }
}

export default consoleFunction
