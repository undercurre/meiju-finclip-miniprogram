const defalltError = {
  1: 'E1 进水温度传感器故障',
  2: 'E2 发热管温度传感器故障',
  3: 'E3 出水温度传感器故障',
  4: 'E4 即热干烧故障',
  5: 'E5 通信故障',
  6: '出水时间过长，请重新上电',
  7: 'E7 RFID通讯故障',
  8: 'E8 非标准RFID故障',
  9: 'E9 水龙头通信故障',
  10: 'EA TDS通讯故障',
  11: 'EB 倾倒故障',
  12: 'EC 水位故障',
  13: 'ED 水位故障',
  14: 'EE 中转板通信故障',
  16: 'E0 漏水检测故障',
  17: 'F0 过零信号异常故障',
  18: 'F1 热水传感器短路',
  19: 'F2 热水传感器断路',
  20: 'F3 冷水传感器短路',
  21: 'F4 冷水传感器断路',
  22: 'F5 水壶干烧',
  23: 'F6 IGBT过温',
  24: 'F7 IGBT开短',
  25: 'F8 低压保护',
  26: 'F9 高压保护',
  27: 'FA 线圈盘开路',
  28: 'FB 即热管漏水',
  29: 'FC 加热故障',
  34: 'H1 制冰环境温度传感器故障',
  35: 'H2 蒸发器温度传感器故障',
  36: 'H3 满冰温度传感器故障',
  37: 'H4 冷水温度传感器故障',
  38: 'H5 堆冰失败报警',
  39: 'H6 蒸发器温度过低报警',
  40: 'H7 脱冰失败报警',
  41: 'H8 苏打罐温度传感器故障',
  42: 'H9 电机转动异常',
  43: 'HA 低盐位报警',
}
const softError = {
  1: 'E1 一直找不到工作位',
  2: 'E2 光感没有发出信号',
  3: 'E3 电机不转',
  4: 'E4 工作位不正确',
}

function getErrors(setting, sn8, status) {
  if (
    (setting.deviceKind == 1 && !status.e_version && !setting.status03) ||
    (setting.deviceKind == 1 && status.has_error)
  ) {
    //判断配置为01净水品类且无03指令标识且上报状态无电控版本 则用旧净水状态解析
    if (status.rfid_error == 'on') {
      return 'RFID通讯故障'
    }
    if (status.instant_error == 'on') {
      return '即热干烧'
    }
    if (status.out_temperature_sensor_error == 'on') {
      return '出水温度传感器故障'
    }
    if (status.heat_sensor_error == 'on') {
      return '发热管温度传感器故障'
    }
    if (status.in_temperature_sensor_error == 'on') {
      return '进水温度传感器故障'
    }
    if (status.leaking_error == 'on') {
      return '漏水故障'
    }
    if (sn8 !== '6321891A' && sn8 !== '63201882' && status.tds_error == 'on') {
      //两款特殊处理，不上报tds故障
      return 'TDS模组通讯故障'
    }
    if (status.communicate_error == 'on') {
      return '显示板通讯故障'
    }
    if (status.overtime_error == 'on') {
      return '强制待机(机器制水时间过长)'
    }
    return null
  } else if (setting.deviceKind == 9 || setting.deviceKind == 10) {
    //软水机与中央净水机故障
    if (sn8 == '6320084E' && [1, 4].indexOf(Number(status.error)) > -1) {
      //此款中央净水机部分故障没按照协议
      let err = {
        1: 'E1 工作位不正确',
        4: 'E4 一直找不到工作位',
      }
      return err[String(status.error)]
    } else {
      return softError[String(status.error)] ? softError[String(status.error)] : null
    }
  } else {
    if (status.error > 0) {
      if ((sn8 == '6300906A' || sn8 == '63200970') && status.error < 15) {
        let err = {
          1: 'E0 漏水检测故障',
          2: 'E1 进水温度传感器故障',
          3: 'E2 发热管温度传感器故障',
          4: 'E3 出水温度传感器故障',
          5: 'E4 即热干烧故障',
          6: 'E5 通信故障',
          7: '出水时间过长，请重新上电',
          8: 'E7 RFID通讯故障',
          9: 'E8 非标准RFID故障',
          10: 'E9 水龙头通信故障',
          11: 'EA TDS通讯故障',
          12: 'EB 倾倒故障',
          13: 'EC 水位故障',
          14: 'ED 水位故障',
        }
        return err[String(status.error)]
      } else if (sn8 == '63301905' && [18, 19, 22, 29, 30].indexOf(Number(status.error)) > -1) {
        let err = {
          18: 'OU 热水传感器短路',
          19: 'E1 热水传感器断路',
          22: 'E2 水壶干烧',
          29: 'E7 加热故障',
          30: 'E4 过零信号异常',
        }
        return err[String(status.error)]
      } else if ((sn8 == '63000101' || sn8 == '63000103') && [4, 18, 19].indexOf(Number(status.error)) > -1) {
        let err = {
          4: 'E2 即热干烧故障',
          18: 'OU 热水传感器短路',
          19: 'E1 热水传感器断路',
        }
        return err[String(status.error)]
      } else if ((sn8 == '63000107' || sn8 == '63000108') && status.error == 33) {
        //OEM厂商新增的故障 此处做特殊判断 协议不做修改
        return 'H0 过零信号异常故障'
      } else if (sn8 == '0001701S' && [5, 18, 19, 22, 23, 24, 25, 26, 27, 29].indexOf(Number(status.error)) > -1) {
        let err = {
          5: 'E5 通信错误',
          18: 'OU 热水传感器短路',
          19: 'E1 热水传感器断路',
          22: 'E2 水壶干烧',
          23: 'E6 IGBT过温',
          24: 'E7 IGBT温度传感器开路/短路',
          25: 'E8 低压保护',
          26: 'E9 高压保护',
          27: 'EA 线圈盘开路',
          29: 'EB 热水传感器失效',
        }
        return err[String(status.error)]
      } else if ((sn8 == '6320095Y' || sn8 == '6320095W') && status.error == 6) {
        return '系统检测缺水，请检查水源正常后，重新上电'
      } else {
        return defalltError[String(status.error)] ? defalltError[String(status.error)] : null
      }
    }
  }
}
export default getErrors
