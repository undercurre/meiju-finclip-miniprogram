import {
  deviceGuide
} from './deviceGuide'
import {
  selectDevice
} from './selectDevice'
import {
  scanCodeService
} from './scanCodeService'
import {
  wifiService
} from './wifiService'
import {
  udpService
} from './udpService'
import {
  commonUtils
} from './commonUtils'
import {
  linkDeviceService
} from './linkDeviceService'
import {
  addSuccessService
} from './addSuccessService'
import {
  addDeviceMixin
} from './addDeviceMixin'

const commonIndex = {
  deviceGuide,
  selectDevice,
  scanCodeService,
  wifiService,
  udpService,
  commonUtils,
  linkDeviceService,
  addSuccessService,
  addDeviceMixin
}

module.exports = {
  commonIndex
}
