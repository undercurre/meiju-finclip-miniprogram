function fixNum(num, length = 2) {
  return ('' + num).length < length ? (new Array(length + 1).join('0') + num).slice(-length) : '' + num
}

function isNil(value) {
  if (value === null || !value) {
    return true
  }
  return false
}

// 根据cycle值获取json文件中的程序信息
function getCycleDataByValue(deviceConfig, cycleValue) {
  let cycle = {}
  if (!isNil(deviceConfig)) {
    let paramData = deviceConfig.paramData
    if (!isNil(deviceConfig.cycleShop)) {
      paramData = paramData.concat(deviceConfig.cycleShop)
    }
    cycle = paramData.find((item) => {
      return item.value === cycleValue
    })
  }
  return cycle || {}
}

export default {
  fixNum,
  isNil,
  getCycleDataByValue,
}
