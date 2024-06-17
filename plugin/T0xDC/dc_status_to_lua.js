export default (status, deviceConfig) => {
  let convertStatus = {};
  console.log('原始下发状态：' + JSON.stringify(status));
  for (let key in status) {
    switch (key) {
      // 开关机
      case 'switch':
        convertStatus.power = status[key] === 1 ? 'on' : 'off';
        break;
      // 程序投屏
      case 'customize_machine_cycle':
        convertStatus.customize_machine_cycle = status[key];
        break;
      // 童锁
      case 'baby_lock':
        convertStatus.baby_lock = status[key];
        break;
      case 'light':
        convertStatus.light = status[key];
        break;
      case 'texture':
        convertStatus.material = status[key];
        break;
      case 'dry_self_clean':
        convertStatus.bucket_clean_switch = status[key];
        break;
      case 'steam_level_old':
        convertStatus.steam_switch = status[key];
        break;
      case 'remind_sound':
        convertStatus.remind_sound = status[key];
        break;
      case 'crease_resist':
        convertStatus.prevent_wrinkle = status[key];
        break;
      // AI
      case 'ai':
        convertStatus.ai_switch = status[key];
        break;
      //  除菌
      case 'sterilize':
        convertStatus.sterilize = status[key];
        break;
      // 防皱
      case 'crease_resist_old':
        convertStatus.prevent_wrinkle_switch = status[key];
        break;
      // 烘干+ ok
      case 'dry_level':
        convertStatus.intensity = status[key];
        break;
      // 温度档位
      case 'temperature_level':
        convertStatus.temperature_level = status[key];
        break;
      // +定时
      case 'dry_time_new':
        convertStatus.dry_time = status[key];
        break;
      // ok
      case 'steam_level':
        convertStatus.steam = status[key];
        break;
      // 烘干
      case 'dryer':
        convertStatus.dryer = status[key] + '';
        break;
      // 预约
      case 'appointment':
        convertStatus.appointment = status[key] === 'on' ? 1 : 0;
        break;
      case 'appointment_time':
        convertStatus.appointment_time = status[key];
        break;
      // cycle
      case 'wash_mode':
        switch (status.wash_mode) {
          case 0x00:
            convertStatus.program = 'cotton';
            break;
          case 0x01:
            convertStatus.program = 'fiber';
            break;
          case 0x02:
            convertStatus.program = 'mixed_wash';
            break;
          case 0x03:
            convertStatus.program = 'jean';
            break;
          case 0x04:
            convertStatus.program = 'bedsheet';
            break;
          case 0x05:
            convertStatus.program = 'outdoor';
            break;
          case 0x06:
            convertStatus.program = 'down_jacket';
            break;
          case 0x07:
            convertStatus.program = 'plush';
            break;
          case 0x08:
            convertStatus.program = 'wool';
            break;
          case 0x09:
            convertStatus.program = 'dehumidify';
            break;
          case 0x0a:
            convertStatus.program = 'cold_air_fresh_air';
            break;
          case 0x0b:
            convertStatus.program = 'hot_air_dry';
            break;
          case 0x0c:
            convertStatus.program = 'sport_clothes';
            break;
          case 0x0d:
            convertStatus.program = 'underwear';
            break;
          case 0x0e:
            convertStatus.program = 'baby_clothes';
            break;
          case 0x0f:
            convertStatus.program = 'shirt';
            break;
          case 0x10:
            convertStatus.program = 'standard';
            break;
          case 0x11:
            convertStatus.program = 'quick_dry';
            break;
          case 0x12:
            convertStatus.program = 'fresh_air';
            break;
          case 0x13:
            convertStatus.program = 'low_temp_dry';
            break;
          case 0x14:
            convertStatus.program = 'eco_dry';
            break;
          case 0x15:
            convertStatus.program = 'quick_dry_30';
            break;
          case 0x16:
            convertStatus.program = 'towel';
            break;
          case 0x17:
            convertStatus.program = 'intelligent_dry';
            break;
          case 0x18:
            convertStatus.program = 'steam_care';
            break;
          case 0x19:
            convertStatus.program = 'big';
            break;
          case 0x1a:
            convertStatus.program = 'fixed_time_dry';
            break;
          case 0x1b:
            convertStatus.program = 'night_dry';
            break;
          case 0x1c:
            convertStatus.program = 'bracket_dry';
            break;
          case 0x1d:
            convertStatus.program = 'western_trouser';
            break;
          case 0x1e:
            convertStatus.program = 'dehumidification';
            break;
          case 0x1f:
            convertStatus.program = 'smart_dry';
            break;
          case 0x20:
            convertStatus.program = 'four_piece_suit';
            break;
          case 0x21:
            convertStatus.program = 'warm_clothes';
            break;
          case 0x22:
            convertStatus.program = 'quick_dry_20';
            break;
          case 0x23:
            convertStatus.program = 'steam_sterilize';
            break;
          case 0x24:
            convertStatus.program = 'enzyme';
            break;
          case 0x25:
            convertStatus.program = 'big_60';
            break;
          case 0x26:
            convertStatus.program = 'steam_no_iron';
            break;
          case 0x27:
            convertStatus.program = 'air_wash';
            break;
          case 0x28:
            convertStatus.program = 'bed_clothes';
            break;
          case 0x29:
            convertStatus.program = 'little_fast_dry';
            break;
          case 0x2a:
            convertStatus.program = 'small_piece_dry';
            break;
          case 0x2b:
            convertStatus.program = 'big_dry';
            break;
          case 0x2c:
            convertStatus.program = 'wool_nurse';
            break;
          case 0x2d:
            convertStatus.program = 'sun_quilt';
            break;
          case 0x2e:
            convertStatus.program = 'fresh_remove_smell';
            break;
          case 0x2f:
            convertStatus.program = 'bucket_self_clean';
            break;
          case 0x30:
            convertStatus.program = 'silk';
            break;
          case 0x31:
            convertStatus.program = 'sterilize';
            break;
          case 0x36:
            convertStatus.program = 'time_drying_30';
            break;
          case 0x37:
            convertStatus.program = 'time_drying_60';
            break;
          case 0x38:
            convertStatus.program = 'time_drying_90';
            break;
          case 0x39:
            convertStatus.program = 'dry_softnurse';
            break;
          case 0x40:
            convertStatus.program = 'uniforms';
            break;
          case 0x41:
            convertStatus.program = 'remove_electricity';
            break;
          default:
            convertStatus.program = status.wash_mode;
            convertStatus.useCycleValue = 1;
        }
        break;
      default:
        convertStatus[key] = status[key];
        break;
    }
  }
  delete convertStatus.wash;
  if (!status.hasOwnProperty('wash')) {
    // convertStatus['control_status'] = 'ignore';
  } else {
    convertStatus.control_status = status.wash === 1 ? 'start' : 'pause';
  }

  if (deviceConfig.supportCycleProjection) {
    if (!Object.hasOwnProperty('customize_machine_cycle')) {
      convertStatus.customize_machine_cycle = 255;
    }
  }
  return convertStatus;
};
