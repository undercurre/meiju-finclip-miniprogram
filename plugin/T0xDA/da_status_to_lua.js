export default (status) => {
  let convertStatus = {};
  console.log('原始下发状态：' + JSON.stringify(status));
  for (let key in status) {
    switch (key) {
      // 开关机
      case 'switch':
        convertStatus.power = status[key] === 1 ? 'on' : 'off';
        break;
      // 启动暂停
      case 'wash':
        convertStatus.control_status = status.wash === 1 ? 'start' : 'pause';
        break;
      // 是否合并
      case 'merge':
        convertStatus.merge = status[key];
        break;
      // 一键脱
      case 'quickSpin':
        convertStatus.one_key_spin = status[key] === 1 ? 'on' : 'off';
        break;
      // 童锁
      case 'baby_lock':
        convertStatus.lock = status[key] === 1 ? 'on' : 'off';
        break;
      // 洗涤水位
      case 'wash_waterlevel':
        convertStatus.wash_level = status[key];
        break;
      // 漂洗水位
      case 'rinse_waterlevel':
        convertStatus.rinse_level = status[key];
        break;
      // 漂洗次数
      case 'rinse':
        convertStatus.rinse_count = status[key] + '';
        break;
      // 漂洗抽水
      case 'rinse_pump':
        convertStatus.rinse_pump = status[key] === 1 ? 'on' : 'off';
        break;
      // 浸泡水位
      case 'soak_waterlevel':
        convertStatus.soak_level = status[key];
        break;
      // 浸泡时间
      case 'soak_time':
        convertStatus.soak_time = status[key];
        break;
      // 洗涤时间
      case 'wash_time':
        convertStatus.wash_time = status[key];
        break;
      // 洗涤强度、强度
      case 'wash_strength':
        convertStatus.wash_strength = status[key];
        break;
      // 洗涤抽水
      case 'wash_pump':
        convertStatus.wash_pump = status[key] === 1 ? 'on' : 'off';
        break;
      // 温度
      case 'temperature':
        convertStatus.temperature = status[key];
        break;
      // 脱水时间
      case 'spin_time':
        convertStatus.dehydration_time = status[key];
        break;
      // 风干
      case 'air_dry':
        convertStatus.air_dry = status[key] === 1 ? 'on' : 'off';
        break;
      // 自动称重
      case 'auto_weighting':
        convertStatus.auto_weighting = status[key] === 1 ? 'on' : 'off';
        break;
      // 留水
      case 'keep_water':
        convertStatus.keep_water = status[key] === 1 ? 'on' : 'off';
        break;
      // 烘干
      case 'dryer':
        convertStatus.dryer = status[key] + '';
        break;
      // 转速
      case 'dewatering_speed':
        switch (status[key]) {
          case 0:
            convertStatus.dehydration_speed = 0;
            break;
          case 1:
            convertStatus.dehydration_speed = 1;
            break;
          case 2:
            convertStatus.dehydration_speed = 1;
            break;
          case 3:
            convertStatus.dehydration_speed = 3;
            break;
          case 4:
            convertStatus.dehydration_speed = 4;
            break;
        }
        break;
      // 柔顺剂
      case 'softener':
        convertStatus.softener = status[key] + '';
        break;
      // 洗涤剂
      case 'detergent':
        convertStatus.detergent = status[key] + '';
        break;
      // 超微净泡
      case 'little_bubble':
        convertStatus.microbubble = status[key] + '';
        break;
      // 预约
      case 'appointment':
        convertStatus.appointment = status[key];
        break;
      case 'appointment_time':
        convertStatus.appointment_time = status[key];
        break;
      // 快净洗
      case 'FCS':
        convertStatus.FCS = status[key] === 1 ? 'on' : 'off';
        break;
      // 清风祛味
      case 'air_fresh':
        convertStatus.air_fresh = status[key] === 1 ? 'on' : 'off';
        break;
      // 杀菌
      case 'sterilize':
        convertStatus.sterilize = status[key] === 1 ? 'on' : 'off';
        break;
      // 天沐
      case 'heaven':
        convertStatus.heaven = status[key] === 1 ? 'on' : 'off';
        break;
      // 蒸汽洗
      case 'steam_wash':
        convertStatus.steam_wash = status[key] === 1 ? 'on' : 'off';
        break;
      // 静音洗/夜间洗
      case 'nightly':
        convertStatus.nightly = status[key] === 1 ? 'on' : 'off';
        break;
      // 雾态洗
      case 'spray_wash':
        convertStatus.spray_wash = status[key] === 1 ? 'on' : 'off';
        break;
      // 加速洗
      case 'speedy':
        // 2019年6月17日以前的产品，使用old_speedy下发，2019年6月17日以后的产品使用speedy下发
        convertStatus.old_speedy = status[key] === 1 ? 'on' : 'off';
        break;
      // 浸泡
      case 'soak':
        convertStatus.soak = status[key] === 1 ? 'on' : 'off';
        break;
      // 活水漂
      case 'fresh_water_rinse':
        convertStatus.over_flow_rinse = status[key] === 1 ? 'on' : 'off';
        break;
      // ai开关
      case 'ai':
        convertStatus.ai_flag = status[key] === 1 ? 'on' : 'off';
        break;
      case 'cycle_memory':
        convertStatus.cycle_memory = status[key] === 1 ? 'on' : 'off';
        break;
      // cycle
      case 'wash_mode':
        switch (status.wash_mode) {
          case 0x00:
            convertStatus.program = 'standard';
            break;
          case 0x01:
            convertStatus.program = 'fast';
            break;
          case 0x02:
            convertStatus.program = 'blanket';
            break;
          case 0x03:
            convertStatus.program = 'wool';
            break;
          case 0x04:
            convertStatus.program = 'embathe';
            break;
          case 0x05:
            convertStatus.program = 'memory';
            break;
          case 0x06:
            convertStatus.program = 'child';
            break;
          case 0x07:
            convertStatus.program = 'strong_wash';
            break;
          case 0x08:
            convertStatus.program = 'down_jacket';
            break;
          case 0x09:
            convertStatus.program = 'stir';
            break;
          case 0x0a:
            convertStatus.program = 'mute';
            break;
          case 0x0b:
            convertStatus.program = 'bucket_self_clean';
            break;
          case 0x0c:
            convertStatus.program = 'air_dry';
            break;
          case 0x0d:
            convertStatus.program = 'cycle';
            break;
          case 0x10:
            convertStatus.program = 'remain_water';
            break;
          case 0x11:
            convertStatus.program = 'summer';
            break;
          case 0x12:
            convertStatus.program = 'big';
            break;
          case 0x13:
            convertStatus.program = 'home';
            break;
          case 0x14:
            convertStatus.program = 'cowboy';
            break;
          case 0x15:
            convertStatus.program = 'soft';
            break;
          case 0x16:
            convertStatus.program = 'hand_wash';
            break;
          case 0x17:
            convertStatus.program = 'water_flow';
            break;
          case 0x18:
            convertStatus.program = 'fog';
            break;
          case 0x19:
            convertStatus.program = 'bucket_dry';
            break;
          case 0x1a:
            convertStatus.program = 'fast_clean_wash';
            break;
          case 0x1b:
            convertStatus.program = 'dehydration';
            break;
          case 0x1c:
            convertStatus.program = 'under_wear';
            break;
          case 0x1d:
            convertStatus.program = 'rinse_dehydration';
            break;
          case 0x1e:
            convertStatus.program = 'five_clean';
            break;
          case 0x1f:
            convertStatus.program = 'degerm';
            break;
          case 0x20:
            convertStatus.program = 'in_15';
            break;
          case 0x21:
            convertStatus.program = 'in_25';
            break;
          case 0x22:
            convertStatus.program = 'love_baby';
            break;
          case 0x23:
            convertStatus.program = 'outdoor';
            break;
          case 0x24:
            convertStatus.program = 'silk';
            break;
          case 0x25:
            convertStatus.program = 'shirt';
            break;
          case 0x26:
            convertStatus.program = 'cook_wash';
            break;
          case 0x27:
            convertStatus.program = 'towel';
            break;
          case 0x28:
            convertStatus.program = 'memory_2';
            break;
          case 0x29:
            convertStatus.program = 'memory_3';
            break;
          case 0x2a:
            convertStatus.program = 'half_energy';
            break;
          case 0x2b:
            convertStatus.program = 'all_energy';
            break;
          case 0x2c:
            convertStatus.program = 'soft_wash';
            break;
          case 0x2d:
            convertStatus.program = 'prevent_allergy';
            break;
          case 0x2e:
            convertStatus.program = 'wash_cube';
            break;
          case 0x2f:
            convertStatus.program = 'winter_jacket';
            break;
          case 0x30:
            convertStatus.program = 'leisure_wash';
            break;
          case 0x31:
            convertStatus.program = 'no_iron';
            break;
          case 0x32:
            convertStatus.program = 'remove_mite_wash';
            break;
          case 0x33:
            convertStatus.program = 'stubborn_stain';
            break;
          case 0x34:
            convertStatus.program = 'silk_wash';
            break;
          case 0x36:
            convertStatus.program = 'cloud_wash';
            break;
          case 0x37:
            convertStatus.program = 'smart';
            break;
          case 0x38:
            convertStatus.program = 'speed_wash_30';
            break;
          case 0x39:
            convertStatus.program = 'ai_intelligence_wash';
            break;
          case 0x3a:
            convertStatus.program = 'mixed_wash';
            break;
          case 0x3b:
            convertStatus.program = 'once_rinse';
            break;
          // Lua22--护形洗
          case 0x3C:
            convertStatus.program = 'huxing_wash';
            break;
          default:
            convertStatus.program = status.wash_mode;
            convertStatus.useCycleValue = 1;
        }
        break;
      // default:
      //     convertStatus[key] = status[key];
    }
  }
  return convertStatus;
};
