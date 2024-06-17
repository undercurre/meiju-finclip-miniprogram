/**
 * 子设备配置文件
 * 
 * @zLockConfig: 门锁日志解析配置
 * @
 * 
 */
const zLockConfig = {
  name: '智能门锁',
  endpoint: 1,
  event: {
    OnOff: {
      0: '正常',
      1: '异常',
      default: '异常'
    },
    LockState: {
      1: '已锁',
      2: '未锁',
      default: '锁定异常'
    },
    BatteryAlarmState: {
      1: '低电量报警',
      '-1': '电量异常',
      default: '电量正常'
    },
    DoorState: {
      0: '门开',
      1: '门关',
      2: '用户被劫持',
      3: '门锁被撬开',
      4: '键盘锁定',
      5: '感应卡锁定',
      6: '指纹锁定',
      12: '用户被劫持',
      224: '开门失败',
      225: '关门失败',
      default: '状态异常'
    },
    OpenRecord: {
      1: '密码',
      2: '指纹',
      3: '门卡',
      4: '机械钥匙',
      5: '无线遥控',
      6: '应急电源',
      7: 'APP',
      8: '蓝牙',
      9: '虹膜识别',
      10: '人脸识别',
      11: '机械钥匙或者门内开锁',
      17: '管理员密码',
      18: '管理员指纹',
      19: '管理员门卡',
      33: '临时密码',
      34: '临时指纹',
      35: '临时门卡',
      default: '开门异常'
    },
    ZoneStatus: {
      1: '门铃响',
      default: '门铃关'
    },
    ActuatorEnabled: {
      0: '门被反锁',
      1: '解除反锁',
      default: '反锁异常'
    },
    default: '在线'
  }
}

module.exports = {
  zLockConfig
}
