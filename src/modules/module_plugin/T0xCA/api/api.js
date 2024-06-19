const api = {
  //获取云管家开关状态
  getCloudKeeperSwitchStatus: '/bx/api/meiju/plugin/switchStatus/get.do',
  //编辑云管家开关状态
  editCloudKeeperSwitchStatus: '/bx/api/meiju/plugin/switchStatus/edit.do',
  //获取开关门记录
  getOpenDoorRecords: '/bx/fridge/FridgeStatistics/openDoorRecord',
  //获取冰箱基本信息
  getFridgeDevInfo: '/bx/fridgesn/v2/getInfo',
  //获取用户的操作步骤信息
  getRecordStep: '/bx/xjzy/opt/getRecordStep',
  //记录用户的操作步骤
  recordStep: '/bx/xjzy/opt/recordStep',
  //获取自检项清单
  getCheckItems: '/bx/xjzy/dev/getCheckItems',
  //获取设备自检信息
  getDevCheckRecord: '/bx/xjzy/dev/getDevCheckRecord',
  //保存自检结果
  saveCheckDevResult: '/bx/xjzy/dev/saveCheckDevResult',
  //获取自检历史
  getDevCheckHistory: '/bx/xjzy/dev/getDevCheckHistory',
  //判断是否首次进入插件
  getPluginInfoRecord: '/bx/api/meiju/plugin/functionRecord/get.do'
}

export default api;
