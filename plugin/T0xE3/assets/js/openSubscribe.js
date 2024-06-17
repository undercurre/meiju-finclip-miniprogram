import { openSubscribeModal } from '../../../../globalCommon/js/deviceSubscribe' // 注意引用
import { modelIds, templateIds } from '../../../../globalCommon/js/templateIds' // 注意引用

const modelId = modelIds[16] // 各品类修改对应数值
const templateIdList = [
  templateIds[25][0], //零冷水已预热完成
  templateIds[26][0], //加热完成
  templateIds[27][0], //滤芯到期
]

const filterMessage = function (templateId) {
  const templateList = [...templateIdList]
  if (templateId) {
    return templateList.filter((item) => item == templateId)
  } else {
    return templateList
  }
}

// 微信长消息是调起位置建议根据各品类企划的需求设计
// 作为参考，净饮是在用户操作设备的时候调起
// 需要先申请微信长消息modelId与templateId，并配置到templateIds.js
export function openSubscribe(applianceData, templateId) {
  // 这里没有做处理，按耀文的了解，这个接口对订阅是有判断的，如果已经弹出过，再调用是不会弹出的；
  // 同时，同品类的不同设备，调用这个接口也会判断，已调用过会直接订阅
  // 所以可以不做处理直接调用
  openSubscribeModal(
    modelId,
    applianceData.name,
    applianceData.sn,
    filterMessage(templateId),
    applianceData.sn8,
    applianceData.type,
    applianceData.applianceCode
  )
}
