import {
  APP_NAME
} from './const'

const LogLevel = {
  Log: 0,
  Warning: 1,
  Error: 2
}
const Styles = ['color: green;', 'color: orange;', 'color: red;']
const Methods = ['info', 'warn', 'error']

class Logger {
  constructor(namespace = 'unknown') {
    this.namespace = namespace
  }

  setNamespace(namespace = '') {
    this.namespace = namespace
    return this
  }

  _log(level, args) {
    if (level === LogLevel.Log) {
      console[Methods[level]](`%c${APP_NAME} ${this.namespace}`, Styles[level], ...args)
      return
    }

    console[Methods[level]](`[${this.namespace}]`, ...args)
  }

  info(...args) {
    this._log(LogLevel.Log, args)
    return this
  }

  warn(...args) {
    this._log(LogLevel.Warning, args)
    return this
  }

  error(...args) {
    this._log(LogLevel.Error, args)
    return this
  }
}

export default new Logger()
