/**
 * 自发现通过索引文件
 */
import {
  commonService
} from './commonService'
import {
  commonUtil
} from './commonUtil'
import {
  getApiPromise
} from './getApiPromise'
import {
  addDeviceService
} from './addDeviceService'
const commonIndex = {
  commonService,
  commonUtil,
  getApiPromise,
  addDeviceService
}

module.exports = {
  commonIndex
}
