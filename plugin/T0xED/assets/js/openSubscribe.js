import { openSubscribeModal } from '../../../../globalCommon/js/deviceSubscribe.js'
import { modelIds, templateIds } from '../../../../globalCommon/js/templateIds.js'
let modelIdList = ['', '', '', modelIds[4], modelIds[5], modelIds[6], modelIds[7], modelIds[8], '', '', '']
let templateIdList = [[], [], [], [templateIds[23][0]], [templateIds[11][0]], [], [], [], [], [], []]

export function openSubscribe(modelId, name, sn, type, sn8, pluginType, applianceCode) {
  // if (!wx.getStorageSync(`openSubscribeModal${modelId}`)) {
  if (modelIdList[modelId] && templateIdList[type].length) {
    openSubscribeModal(modelIdList[modelId], name, sn, templateIdList[type], sn8, pluginType, applianceCode)
    // wx.setStorageSync(`openSubscribeModal${modelId}`, '1')
  }
}
