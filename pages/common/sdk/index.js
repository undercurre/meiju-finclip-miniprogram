/**
 * 主包配网相关总索引文件
 */
import {
  commonIndex
} from './common/commonIndex'
import {
  bluetoothIndex
} from './bluetooth/bluetoothIndex'
import {
  accessPointIndex
} from './accessPoint/accessPointIndex'
const index = {
  commonIndex,
  bluetoothIndex,
  accessPointIndex
}
module.exports = {
  index
}
