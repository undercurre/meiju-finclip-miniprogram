import _ from "./myLodash";

function isCloudCycle(cycleValue, deviceConfig) {
  if (parseInt(cycleValue) === 0 || _.isNil(deviceConfig) || _.isNil(deviceConfig.cycleShop)) {
    return false;
  }

  for (let i = 0; i < deviceConfig.cycleShop.length; i++) {
    if (parseInt(cycleValue) === parseInt(deviceConfig.cycleShop[i].value)) {
      return true;
    }
  }
  return false;
}

export default (status, deviceConfig) => {
  let fault_warnMapping = {
    0: '0',
    1: 'E1',
    2: 'E2',
    3: 'E3',
    4: 'E4',
    5: 'E5',
    8: 'Fd',
    9: 'F8',
    10: 'F0',
    11: 'C0',
    12: 'C1',
    13: 'C2',
    14: 'C3',
    15: 'C4',
    16: 'C5',
    17: 'C6',
    18: 'C7',
    19: 'C8',
    21: 'CL',
    22: 'EA',
    23: 'F4',
    24: 'F1',
    25: 'F6',
    26: 'F5',
    27: 'FH'
  };
  let originStatus = {};
  if (!status) {
    return originStatus;
  }
  for (let key in status) {
    switch (key) {
      // 开关机
      case 'power':
        originStatus.powerOn = status.power === 'on';
        break;
      // 一键脱
      case 'one_key_spin':
        originStatus.quickSpin = status.one_key_spin === 'on' ? 1 : 0;
        break;
      // 童锁
      case 'lock':
        originStatus.baby_lock = status.lock === 'on' ? 1 : 0;
        break;
      // 洗涤水位
      case 'wash_level':
        originStatus.wash_waterlevel = parseInt(status.wash_level);
        break;
      // 漂洗水位
      case 'rinse_level':
        originStatus.rinse_waterlevel = parseInt(status.rinse_level);
        break;
      // 漂洗次数
      case 'rinse_count':
        originStatus.rinse = parseInt(status.rinse_count);
        break;
      // 漂洗抽水
      case 'rinse_pump':
        originStatus.rinse_pump = status.rinse_pump === 'on' ? 1 : 0;
        break;
      // 浸泡水位
      case 'soak_level':
        originStatus.soak_waterlevel = status.soak_level;
        break;
      // 浸泡时间
      case 'soak_time':
        originStatus.soak_time = status.soak_time;
        break;
      // 洗涤时间
      case 'wash_time':
        originStatus.wash_time = status.wash_time;
        break;
      // 洗涤强度、强度
      case 'wash_strength':
        originStatus.wash_strength = status.wash_strength;
        break;
      // 洗涤抽水
      case 'wash_pump':
        originStatus.wash_pump = status.wash_pump === 'on' ? 1 : 0;
        break;
      // 脱水时间
      case 'dehydration_time':
        originStatus.spin_time = status.dehydration_time;
        break;
      // 风干
      case 'air_dry':
        originStatus.air_dry = status.air_dry === 'on' ? 1 : 0;
        break;
      // 自动称重
      case 'auto_weighting':
        originStatus.auto_weighting = status.auto_weighting === 'on' ? 1 : 0;
        break;
      // 留水
      case 'keep_water':
        originStatus.keep_water = status.keep_water === 'on' ? 1 : 0;
        break;
      // 烘干
      case 'dryer':
        originStatus.dryer = parseInt(status.dryer);
        break;
      // 转速
      case 'dehydration_speed':
        switch (status.dehydration_speed) {
          case 0:
            originStatus.dewatering_speed = 0;
            break;
          case 1:
            originStatus.dewatering_speed = 1;
            break;
          case 2:
            originStatus.dewatering_speed = 2;
            break;
          case 3:
            originStatus.dewatering_speed = 3;
            break;
          case 4:
            originStatus.dewatering_speed = 4;
            break;
        }
        break;
      // 柔顺剂
      case 'softener':
        originStatus.softener = parseInt(status.softener);
        break;
      // 洗涤剂
      case 'detergent':
        originStatus.detergent = parseInt(status.detergent);
        break;
      // 超微净泡
      case 'microbubble':
        originStatus.little_bubble = parseInt(status.microbubble);
        break;
      case 'error_code':
        {
          originStatus.fault_warn = status.error_code.toString(16).toUpperCase();
          if (status.error_code !== 0 && status.error_code !== '0') {
            originStatus.fault_warn = fault_warnMapping[status.error_code.toString()];
            originStatus.status = 99;
          }
        }
        break;
      // 静音洗/夜间洗
      case 'nightly':
        originStatus.nightly = status.nightly === 'on' ? 1 : 0;
        break;
      // 快净洗
      case 'FCS':
        originStatus.FCS = status.FCS === 'on' ? 1 : 0;
        break;
      // 清风祛味
      case 'air_fresh':
        originStatus.air_fresh = status.air_fresh === 'on' ? 1 : 0;
        break;
      // 杀菌
      case 'sterilize':
        originStatus.sterilize = status.sterilize === 'on' ? 1 : 0;
        break;
      // 天沐
      case 'heaven':
        originStatus.heaven = status.heaven === 'on' ? 1 : 0;
        break;
      // 蒸汽洗
      case 'steam_wash':
        originStatus.steam_wash = status.steam_wash === 'on' ? 1 : 0;
        break;
      // 雾态洗
      case 'spray_wash':
        originStatus.spray_wash = status.spray_wash === 'on' ? 1 : 0;
        break;
      // 加速洗
      case 'speedy':
        originStatus.speedy = status.speedy === 'on' ? 1 : 0;
        break;
      // 浸泡
      case 'soak':
        originStatus.soak = status.soak === 'on' ? 1 : 0;
        break;
      // 活水漂
      case 'over_flow_rinse':
        originStatus.fresh_water_rinse = status.over_flow_rinse === 'on' ? 1 : 0;
        break;
      // ai开关
      case 'ai_flag':
        originStatus.ai = status.ai_flag === 'on' ? 1 : 0;
        break;
      case 'cycle_memory':
        originStatus.cycle_memory = status.cycle_memory === 'on' ? 1 : 0;
        break;
      case 'program':
        switch (status.program) {
          case 'standard':
            originStatus.wash_mode = 0x00;
            break;
          case 'fast':
            originStatus.wash_mode = 0x01;
            break;
          case 'blanket':
            originStatus.wash_mode = 0x02;
            break;
          case 'wool':
            originStatus.wash_mode = 0x03;
            break;
          case 'embathe':
            originStatus.wash_mode = 0x04;
            break;
          case 'memory':
            originStatus.wash_mode = 0x05;
            break;
          case 'child':
            originStatus.wash_mode = 0x06;
            break;
          case 'strong_wash':
            originStatus.wash_mode = 0x07;
            break;
          case 'down_jacket':
            originStatus.wash_mode = 0x08;
            break;
          case 'stir':
            originStatus.wash_mode = 0x09;
            break;
          case 'mute':
            originStatus.wash_mode = 0x0a;
            break;
          case 'bucket_self_clean':
            originStatus.wash_mode = 0x0b;
            break;
          case 'air_dry':
            originStatus.wash_mode = 0x0c;
            break;
          case 'cycle':
            originStatus.wash_mode = 0x0d;
            break;
          case 'remain_water':
            originStatus.wash_mode = 0x10;
            break;
          case 'summer':
            originStatus.wash_mode = 0x11;
            break;
          case 'big':
            originStatus.wash_mode = 0x12;
            break;
          case 'home':
            originStatus.wash_mode = 0x13;
            break;
          case 'cowboy':
            originStatus.wash_mode = 0x14;
            break;
          case 'soft':
            originStatus.wash_mode = 0x15;
            break;
          case 'hand_wash':
            originStatus.wash_mode = 0x16;
            break;
          case 'water_flow':
            originStatus.wash_mode = 0x17;
            break;
          case 'fog':
            originStatus.wash_mode = 0x18;
            break;
          case 'bucket_dry':
            originStatus.wash_mode = 0x19;
            break;
          case 'fast_clean_wash':
            originStatus.wash_mode = 0x1a;
            break;
          case 'dehydration':
            originStatus.wash_mode = 0x1b;
            break;
          case 'under_wear':
            originStatus.wash_mode = 0x1c;
            break;
          case 'rinse_dehydration':
            originStatus.wash_mode = 0x1d;
            break;
          case 'five_clean':
            originStatus.wash_mode = 0x1e;
            break;
          case 'degerm':
            originStatus.wash_mode = 0x1f;
            break;
          case 'in_15':
            originStatus.wash_mode = 0x20;
            break;
          case 'in_25':
            originStatus.wash_mode = 0x21;
            break;
          case 'love_baby':
            originStatus.wash_mode = 0x22;
            break;
          case 'outdoor':
            originStatus.wash_mode = 0x23;
            break;
          case 'silk':
            originStatus.wash_mode = 0x24;
            break;
          case 'shirt':
            originStatus.wash_mode = 0x25;
            break;
          case 'cook_wash':
            originStatus.wash_mode = 0x26;
            break;
          case 'towel':
            originStatus.wash_mode = 0x27;
            break;
          case 'memory_2':
            originStatus.wash_mode = 0x28;
            break;
          case 'memory_3':
            originStatus.wash_mode = 0x29;
            break;
          case 'half_energy':
            originStatus.wash_mode = 0x2a;
            break;
          case 'all_energy':
            originStatus.wash_mode = 0x2b;
            break;
          case 'soft_wash':
            originStatus.wash_mode = 0x2c;
            break;
          case 'prevent_allergy':
            originStatus.wash_mode = 0x2d;
            break;
          case 'wash_cube':
            originStatus.wash_mode = 0x2e;
            break;
          case 'winter_jacket':
            originStatus.wash_mode = 0x2f;
            break;
          case 'leisure_wash':
            originStatus.wash_mode = 0x30;
            break;
          case 'no_iron':
            originStatus.wash_mode = 0x31;
            break;
          case 'remove_mite_wash':
            originStatus.wash_mode = 0x32;
            break;
          case 'stubborn_stain':
            originStatus.wash_mode = 0x33;
            break;
          case 'silk_wash':
            originStatus.wash_mode = 0x34;
            break;
          case 'cloud_wash':
            originStatus.wash_mode = 0x36;
            break;
          case 'smart':
            originStatus.wash_mode = 0x37;
            break;
          case 'speed_wash_30':
            originStatus.wash_mode = 0x38;
            break;
          case 'ai_intelligence_wash':
            originStatus.wash_mode = 0x39;
            break;
          case 'mixed_wash':
            originStatus.wash_mode = 0x3a;
            break;
          case 'once_rinse':
            originStatus.wash_mode = 0x3b;
            break;
          // Lua22--护形洗
          case 'huxing_wash':
            originStatus.wash_mode = 0x3c;
            break;
          default:
            originStatus.wash_mode = status.program;
        }
        break;
      case 'remain_time':
        originStatus.time_remaining = status.remain_time;
        let project_no = status.project_no + '';
        if ('26423' === project_no || '25655' === project_no) {
          if (98 <= originStatus.time_remaining && originStatus.time_remaining <= 103 && status.program === 'cook_wash') {
            originStatus.time_remaining = 98;
          }
        }
        break;
      case 'progress':
        originStatus.progress = parseInt(status.progress);
        break;
      case 'running_status':
        switch (status.running_status) {
          case 'standby':
            if (status.power === 'off') {
              originStatus.status = 9;
            } else {
              originStatus.status = 1;
            }
            originStatus.wash = 0;
            break;
          case 'pause':
            originStatus.status = 98;
            originStatus.wash = 0;
            break;
          case 'fault':
            originStatus.status = 99;
            originStatus.wash = 0;
            break;
          case 'end':
            originStatus.status = 8;
            originStatus.wash = 0;
            break;
          case 'order':
            originStatus.status = 6;
            originStatus.wash = 1;
            originStatus.appointment_wash = 1;
            break;
          case 'work':
            originStatus.wash = 1;
            switch (status.progress.toString()) {
              case '1': //BIT0 排水中(洗衣房专用)
                // originStatus.status = ;
                break;
              case '2': //BIT1
                originStatus.status = 7;
                break;
              case '4': //BIT2
                originStatus.status = 5;
                break;
              case '8': //BIT3
                originStatus.status = 4;
                break;
              case '16': //BIT4
                originStatus.status = 2;
                break;
              case '32': //BIT5
                originStatus.status = 14;
                break;
              case '64': //BIT6
                originStatus.status = 11;
                break;
              case '128': //BIT7
                originStatus.status = 10;
                break;
              default:
                break;
            }
            break;
        }
        break;
      default:
        if (typeof status[key] === 'string') {
          if (status[key] === 'on') {
            originStatus[key] = 1;
          } else if (status[key] === 'off') {
            originStatus[key] = 0;
          } else {
            originStatus[key] = status[key];
          }
        } else {
          originStatus[key] = status[key];
        }
        break;
    }
  }
  // 处理云程序index值
  if (isCloudCycle(originStatus.wash_mode, deviceConfig) && !_.isNil(originStatus.ca_cloud_wash)) {
    originStatus.wash_mode = parseFloat(parseInt(originStatus.wash_mode) + '.' + originStatus.ca_cloud_wash);
  }
  return originStatus;
};
