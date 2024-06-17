import { createGetAssistant } from '../../../../assistant/index'

import consoleFunction from '../../../../utils/console/console'
import platformOptions from '../../platformOptions'
const console = consoleFunction(platformOptions.platform)

import wechat from '../../modules/wechat'
import deviceInfo from '../../modules/deviceInfo'

let getAssistant = createGetAssistant(
  {
    platform: platformOptions.platform,
    plugins: 'XX',
    needPolling: true,
    hasReport: false,
    pollTime: 5000,
  },
  [wechat, deviceInfo]
)

module.exports = {
  getAssistant,
  console,
}
