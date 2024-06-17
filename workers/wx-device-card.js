// 设备卡片
/* eslint-disable no-undef */

worker.onMessage(function (res) {
  console.log(res, 'worker onmessage 分线程')
  // res?.wxDevicePanelList
  getWxDeviceCardPanelBatchData(res?.wxDevicePanelList, res?.supportedApplianceList, res?.unsupportedApplianceList)
})

/**
 * 匹配批量添加设备卡片数据 enabled: 卡片可用； disabled:卡片失效； deleted: 卡片已被用户删除
 * @param {Array} wxDevicePanelList 通过微信api获取用户添加的卡片
 * @param {Array} supportedApplianceList 当前家庭的支持设备
 * @param {Array} unsupportedApplianceList 当前家庭的不支持设备
 * @returns Array
 */
function getWxDeviceCardPanelBatchData(wxDevicePanelList, supportedApplianceList, unsupportedApplianceList) {
  const canNotUploadStatus = ['enabled', 'disabled', 'deleted']
  console.log('wxDevicePanelList postmessage传入的微信已添加列表', wxDevicePanelList)
  const hasUploadedWxDeviceCardList = wxDevicePanelList.filter((item) => canNotUploadStatus.includes(item?.status))
  const uploadList = []
  const UPLOAD_LEN = 5
  supportedApplianceList && supportedApplianceList.map((item) => (item.isSupported = true))
  unsupportedApplianceList && unsupportedApplianceList.map((item) => (item.isSupported = false))
  const homeDeviceList = supportedApplianceList.concat(unsupportedApplianceList)
  console.log(
    hasUploadedWxDeviceCardList,
    homeDeviceList,
    'hasUploadedWxDeviceCardList homeDeviceList wxBatchAddDevicePanel'
  )
  for (let i = 0, len = homeDeviceList.length; i < len; i++) {
    const deviceItem = homeDeviceList[i]
    if (uploadList.length === UPLOAD_LEN) {
      break
    } else {
      const hasUploadedWxDeviceCard = hasUploadedWxDeviceCardList.some(
        (item) => item.applianceCode === deviceItem?.applianceCode
      )
      const hasUploadList = uploadList.some((item) => item?.applianceCode === deviceItem?.applianceCode)
      const hasUploaded = hasUploadedWxDeviceCard || hasUploadList
      const isBluetoothDevice = deviceItem.showBluetoothIcon
      console.log(
        hasUploadedWxDeviceCard,
        hasUploadList,
        hasUploaded,
        isBluetoothDevice,
        'hasUploadedWxDeviceCard hasUploadList hasUploaded, isBluetoothDevice'
      )
      if (!hasUploaded && !isBluetoothDevice) {
        uploadList.push(deviceItem)
      }
    }
  }

  worker.postMessage({
    uploadList,
  })
  return uploadList
}
