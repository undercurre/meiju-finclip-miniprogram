export class DeviceConfigData {
  // 工作状态
  static workStatus = {
    cooking: 'cooking', // 工作中
    schedule: 'schedule', // 预约中
    keepWarm: 'keep_warm', // 保温中
    cancel: 'cancel', // 取消(待机)
    washRice: 'wash_rice', // 洗米
    error: 'error', //故障
    awakening_rice: 'awakening_rice', //醒米
  }
}
