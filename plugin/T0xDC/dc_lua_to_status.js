import constants from './constants';
export default (status, deviceConfig) => {
  let originStatus = {};
  if (!status) {
    return originStatus;
  }
  for (let key in status) {
    switch (key) {
      // 项目号
      case 'project_no':
        originStatus.project_no = status[key];
        break;
      // 电控软件版本
      case 'device_software_version':
        originStatus.device_software_version = status[key];
        break;
      // 开关机
      case 'power':
        originStatus.powerOn = status.power === 'on';
        if (status.power === 'off') {
          originStatus.status = 9;
        }
        break;
      // 程序投屏
      case 'customize_machine_cycle':
        if (deviceConfig && deviceConfig.supportCycleProjection) {
          originStatus.customize_machine_cycle = status[key];
        } else {
          originStatus.customize_machine_cycle = 0xff;
        }
        break;
      // 童锁
      case 'baby_lock':
        originStatus.baby_lock = status.baby_lock;
        break;
      case 'ai_switch':
        originStatus.ai = status[key];
        break;
      case 'water_box':
        originStatus.out_of_water = status[key];
        break;
      case 'bucket_clean_switch':
        originStatus.dry_self_clean = status[key];
        break;
      case 'steam_switch':
        originStatus.steam_level_old = status[key];
        break;
      case 'remind_sound':
        originStatus.remind_sound = status[key];
        break;
      case 'door_open':
        originStatus.door_warn = status[key];
        break;
      case 'prevent_wrinkle_switch':
        originStatus.crease_resist_old = status[key];
        break;
      case 'prevent_wrinkle':
        originStatus.crease_resist = status[key];
        break;
      case 'light':
        originStatus.light = status[key];
        break;
      case 'material':
        originStatus.texture = status[key];
        break;
      // 烘干
      case 'dryer':
        originStatus.dryer = parseInt(status[key]);
        break;
      // 烘干+
      case 'intensity':
        originStatus.dry_level = parseInt(status[key]);
        break;
      // 温度档位
      case 'temperature_level':
        originStatus.temperature_level = parseInt(status[key]);
        break;
      // +定时
      case 'dry_time':
        originStatus.dry_time_new = parseInt(status[key]);
        break;
      case 'steam':
        originStatus.steam_level = parseInt(status[key]);
        break;
      case 'remain_time':
        originStatus.time_remaining = status[key];
        break;
      case 'error_code':
        originStatus.fault_warn = status[key].toString(16).toUpperCase();
        if (status[key] !== 0 && status[key] !== '0') {
          originStatus.fault_warn = 'E' + originStatus.fault_warn;
        }
        break;
      case 'program':
        switch (status[key]) {
          case 'cotton':
            originStatus.wash_mode = 0x00;
            break;
          case 'fiber':
            originStatus.wash_mode = 0x01;
            break;
          case 'mixed_wash':
            originStatus.wash_mode = 0x02;
            break;
          case 'jean':
            originStatus.wash_mode = 0x03;
            break;
          case 'bedsheet':
            originStatus.wash_mode = 0x04;
            break;
          case 'outdoor':
            originStatus.wash_mode = 0x05;
            break;
          case 'down_jacket':
            originStatus.wash_mode = 0x06;
            break;
          case 'plush':
            originStatus.wash_mode = 0x07;
            break;
          case 'wool':
            originStatus.wash_mode = 0x08;
            break;
          case 'dehumidify':
            originStatus.wash_mode = 0x09;
            break;
          case 'cold_air_fresh_air':
            originStatus.wash_mode = 0x0a;
            break;
          case 'hot_air_dry':
            originStatus.wash_mode = 0x0b;
            break;
          case 'sport_clothes':
            originStatus.wash_mode = 0x0c;
            break;
          case 'underwear':
            originStatus.wash_mode = 0x0d;
            break;
          case 'baby_clothes':
            originStatus.wash_mode = 0x0e;
            break;
          case 'shirt':
            originStatus.wash_mode = 0x0f;
            break;
          case 'standard':
            originStatus.wash_mode = 0x10;
            break;
          case 'quick_dry':
            originStatus.wash_mode = 0x11;
            break;
          case 'fresh_air':
            originStatus.wash_mode = 0x12;
            break;
          case 'low_temp_dry':
            originStatus.wash_mode = 0x13;
            break;
          case 'eco_dry':
            originStatus.wash_mode = 0x14;
            break;
          case 'quick_dry_30':
            originStatus.wash_mode = 0x15;
            break;
          case 'towel':
            originStatus.wash_mode = 0x16;
            break;
          case 'intelligent_dry':
            originStatus.wash_mode = 0x17;
            break;
          case 'steam_care':
            originStatus.wash_mode = 0x18;
            break;
          case 'big':
            originStatus.wash_mode = 0x19;
            break;
          case 'fixed_time_dry':
            originStatus.wash_mode = 0x1a;
            break;
          case 'night_dry':
            originStatus.wash_mode = 0x1b;
            break;
          case 'bracket_dry':
            originStatus.wash_mode = 0x1c;
            break;
          case 'western_trouser':
            originStatus.wash_mode = 0x1d;
            break;
          case 'dehumidification':
            originStatus.wash_mode = 0x1e;
            break;
          case 'smart_dry':
            originStatus.wash_mode = 0x1f;
            break;
          case 'four_piece_suit':
            originStatus.wash_mode = 0x20;
            break;
          case 'warm_clothes':
            originStatus.wash_mode = 0x21;
            break;
          case 'quick_dry_20':
            originStatus.wash_mode = 0x22;
            break;
          case 'steam_sterilize':
            originStatus.wash_mode = 0x23;
            break;
          case 'enzyme':
            originStatus.wash_mode = 0x24;
            break;
          case 'big_60':
            originStatus.wash_mode = 0x25;
            break;
          case 'steam_no_iron':
            originStatus.wash_mode = 0x26;
            break;
          case 'air_wash':
            originStatus.wash_mode = 0x27;
            break;
          case 'bed_clothes':
            originStatus.wash_mode = 0x28;
            break;
          case 'little_fast_dry':
            originStatus.wash_mode = 0x29;
            break;
          case 'small_piece_dry':
            originStatus.wash_mode = 0x2a;
            break;
          case 'big_dry':
            originStatus.wash_mode = 0x2b;
            break;
          case 'wool_nurse':
            originStatus.wash_mode = 0x2c;
            break;
          case 'sun_quilt':
            originStatus.wash_mode = 0x2d;
            break;
          case 'fresh_remove_smell':
            originStatus.wash_mode = 0x2e;
            break;
          case 'bucket_self_clean':
            originStatus.wash_mode = 0x2f;
            break;
          case 'silk':
            originStatus.wash_mode = 0x30;
            break;
          case 'sterilize':
            originStatus.wash_mode = 0x31;
            break;
          case 'time_drying_30':
            originStatus.wash_mode = 0x36;
            break;
          case 'time_drying_60':
            originStatus.wash_mode = 0x37;
            break;
          case 'time_drying_90':
            originStatus.wash_mode = 0x38;
            break;
          case 'dry_softnurse':
            originStatus.wash_mode = 0x39;
            break;
          case 'uniforms':
            originStatus.wash_mode = 0x40;
            break;
          case 'remove_electricity':
            originStatus.wash_mode = 0x41;
            break;
          default:
            originStatus.wash_mode = status.program;
            break;
        }
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
          case 'delay_choose':
            originStatus.status = 6;
            originStatus.wash = 0;
            originStatus.appointment_wash = 1;
            originStatus.appointment_time = status.appointment_time;
            break;
          case 'delay_choosing':
            originStatus.status = 1;
            originStatus.wash = 0;
            break;
          case 'delay':
            originStatus.status = 6;
            originStatus.wash = 1;
            originStatus.appointment_wash = 1;
            originStatus.appointment_time = status.appointment_time;
            break;
          case 'delay_pause':
            originStatus.status = 92;
            originStatus.wash = 0;
            break;
          case 'start':
            originStatus.wash = 1;
            switch (status.progress) {
              case 1: //BIT0(加热)
                originStatus.status = 14;
                break;
              case 2: //BIT1(熨烫)
                originStatus.status = 15;
                break;
              case 4: //BIT2(冷却)
                originStatus.status = 16;
                break;
              case 8: //BIT3(结束)
                originStatus.status = 17;
                break;
              case 16: //BIT3(防皱)
                originStatus.status = 20;
                break;
              case 32: //BIT5(除菌)
                originStatus.status = 21;
                break;
              case 64: //BIT6(蒸汽)
                originStatus.status = 22;
                break;
              case 128: //BIT7(护理)
                originStatus.status = 23;
                break;
              default:
                originStatus.status = -1;
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
  // 空气洗的烘干中，显示为清新中
  if (originStatus.wash_mode === 39 && originStatus.status === constants.STATUS.HEATING) {
    originStatus.status = constants.STATUS.FRESHING;
  }
  // 蒸汽护理的烘干中，显示为护理中
  if (originStatus.wash_mode === 24 && originStatus.status === constants.STATUS.HEATING) {
    originStatus.status = constants.STATUS.NURSING;
  }
  return originStatus;
};
