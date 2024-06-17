import {
  openSubscribeModal
} from '../../globalCommon/js/deviceSubscribe' // 注意引用
import {
  modelIds,
  templateIds
} from '../../globalCommon/js/templateIds' // 注意引用

const modelId = modelIds[14] // 各品类修改对应数值
const templateIdList = [templateIds[24][0]] // 各品类修改对应数值

// 微信长消息是调起位置建议根据各品类企划的需求设计
// 作为参考，净饮是在用户操作设备的时候调起
// 需要先申请微信长消息modelId与templateId，并配置到templateIds.js
export function openSubscribe(applianceData) {
  // 这里没有做处理，按耀文的了解，这个接口对订阅是有判断的，如果已经弹出过，再调用是不会弹出的；
  // 同时，同品类的不同设备，调用这个接口也会判断，已调用过会直接订阅
  // 所以可以不做处理直接调用
  openSubscribeModal(
    modelId,
    applianceData.name,
    applianceData.sn,
    templateIdList,
    applianceData.sn8,
    applianceData.type,
    applianceData.applianceCode
  )
}
