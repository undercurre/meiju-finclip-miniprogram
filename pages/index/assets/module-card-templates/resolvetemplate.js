/*
 * @desc: 解析模板
 * @author: zhucc22
 * @Date: 2023-08-21 10:37:46
 */
function resolveTemplate(applianceItem, jsonData) {
  let templateAppLiance = {
    ...applianceItem,
    ...{
      isOnline: applianceItem.onlineStatus == 1 ? true : false,
      homeId: applianceItem.homegroupId,
      isEditStatus: false,
      isAuth: true,
      deviceImageUrl: applianceItem.deviceImg,
      showRoomName: true,
    },
  }
  let utils = getApp().globalData.cardSDK[applianceItem.smartProductId]
  let resolveTemplate = utils.onUpdate(templateAppLiance, jsonData)
  for (let item in resolveTemplate) {
    resolveTemplate[item] = JSON.parse(resolveTemplate[item])
  }
  return resolveTemplate
}

function resolveUiTemplate(applianceItem) {
  let utils = getApp().globalData.cardSDK[applianceItem.smartProductId + '-ui']
  let resolveUiTemplate = utils.uijson
  return resolveUiTemplate
}

module.exports = { resolveTemplate, resolveUiTemplate }
