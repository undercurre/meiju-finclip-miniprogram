import createRequester from './createRequester'
import buryAction from './buryAction'

const Map = {
  'wechat': {
    'deviceRequest': createRequester,
    'cloudRequest': createRequester,
    'buryAction': buryAction
  }
}

const actionMaper = function (platform, actioner) {
  return Map[platform][actioner]
}

export default actionMaper
