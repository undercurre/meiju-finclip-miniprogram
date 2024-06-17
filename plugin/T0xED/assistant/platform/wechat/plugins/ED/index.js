import { createGetAssistant } from '../../../../assistant/index'

import consoleFunction from '../../../../utils/console/console'
import platformOptions from '../../platformOptions'
const console = consoleFunction(platformOptions.platform)

import wechat from '../../modules/wechat'
import deviceInfo from '../../modules/deviceInfo'
import deviceStatus from '../../../../plugins/ED/modules/deviceStatus'
import cloudCommon from '../../modules/cloudCommon'
import status from '../../../../plugins/ED/modules/status'
import wash from '../../../../plugins/ED/modules/wash'
import filterReset from '../../../../plugins/ED/modules/filterReset'
import germicidal from '../../../../plugins/ED/modules/germicidal'
import germicidalTips from '../../../../plugins/ED/modules/germicidalTips'
import bubble from '../../../../plugins/ED/modules/bubble'
import heat from '../../../../plugins/ED/modules/heat'
import keepWarm from '../../../../plugins/ED/modules/keepWarm'
import lock from '../../../../plugins/ED/modules/lock'
import washTea from '../../../../plugins/ED/modules/washTea'
import quantifySet from '../../../../plugins/ED/modules/quantifySet'
import tempSet from '../../../../plugins/ED/modules/tempSet'
import cloudWash from '../../../../plugins/ED/modules/cloudWash'

import getTrackAction from './trackParams'

let getAssistant = createGetAssistant(
  {
    platform: platformOptions.platform,
    plugins: 'ED',
    needPolling: true,
    hasReport: false,
    pollTime: 5000,
    getTrackAction: getTrackAction,
  },
  [
    wechat,
    deviceInfo,
    deviceStatus,
    cloudCommon,
    status,
    wash,
    filterReset,
    germicidal,
    germicidalTips,
    bubble,
    heat,
    keepWarm,
    lock,
    washTea,
    quantifySet,
    tempSet,
    cloudWash,
  ]
)

module.exports = {
  getAssistant,
  console,
}
