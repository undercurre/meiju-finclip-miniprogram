export class Format {
  static formatSeconds(value) {
    let secondTime = parseInt(value) // 秒
    let minuteTime = 0 // 分
    let hourTime = 0 // 小时
    if (secondTime > 60) {
      //如果秒数大于60，将秒数转换成整数
      //获取分钟，除以60取整数，得到整数分钟
      minuteTime = parseInt(secondTime / 60)
      //获取秒数，秒数取佘，得到整数秒数
      secondTime = parseInt(secondTime % 60)
      //如果分钟大于60，将分钟转换成小时
      if (minuteTime >= 60) {
        //获取小时，获取分钟除以60，得到整数小时
        hourTime = parseInt(minuteTime / 60)
        //获取小时后取佘的分，获取分钟除以60取佘的分
        minuteTime = parseInt(minuteTime % 60)
      }
    }
    if (secondTime === 60) {
      minuteTime = 1
      secondTime = 0
    }
    let result = {
      hours: 0,
      minutes: 0,
      seconds: secondTime,
    }

    if (minuteTime > 0) {
      result.minutes = minuteTime
    }
    if (hourTime > 0) {
      result.hours = hourTime
    }
    return result
  }

  static jsonToParam(obj) {
    let rtn = ''
    if (obj) {
      rtn = '?'
      for (let key in obj) {
        rtn = rtn + key + '=' + obj[key] + '&'
      }
      rtn = rtn.slice(0, rtn.length - 1)
    }
    return rtn
  }

  static getTime(value) {
    let rtn = undefined
    if (value || value === 0) {
      if (value < 10) {
        rtn = '0' + value
      } else {
        rtn = value
      }
    } else {
      rtn = 0
    }
    return rtn
  }

  static dateFormat(fmt, date) {
    let ret
    const opt = {
      'Y+': date.getFullYear().toString(), // 年
      'm+': (date.getMonth() + 1).toString(), // 月
      'd+': date.getDate().toString(), // 日
      'H+': date.getHours().toString(), // 时
      'M+': date.getMinutes().toString(), // 分
      'S+': date.getSeconds().toString(), // 秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
    }
    for (let k in opt) {
      ret = new RegExp('(' + k + ')').exec(fmt)
      if (ret) {
        fmt = fmt.replace(ret[1], ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, '0'))
      }
    }
    return fmt
  }
}
