import _ from './myLodash';


export default (status, deviceConfig, deviceStatus) => {
  // 兼容
  // 0000.db.12359  0000.db.12615  烘干参数由原本关闭调节到开启时合并下发drySpeed配置的默认烘干转速
  if (deviceConfig.drySpeed && _.has(status, 'dryer') && !_.has(status, 'dewatering_speed')) {
    if (status.dryer !== 0 && deviceStatus && deviceStatus.dryer === 0) {
      let drySpeed = deviceConfig.drySpeed;
      let modekey = deviceStatus.wash_mode;
      if (drySpeed[modekey + '']) {
        status.dewatering_speed = drySpeed[modekey + ''];
      }
    }
  }

  // 处理云程序index值
  if (_.has(status, 'wash_mode')) {
    let cycle = _.getCycleDataByValue(deviceConfig, status.wash_mode);
    console.log('db_status_to_lua cycle:', cycle);
    if (cycle.isCloudCycle) {
      status.wash_mode = parseInt(status.wash_mode);
      status.cloud_cycle_low = cycle.cloud_cycle;
    } else {
      // 非云程序的情况下，判断如果使用长协议，指定cloud_cycle_low为0
      if (deviceConfig.userProtocolV2) {
        status.cloud_cycle_low = 0;
        status.cloud_cycle_high = 0;
      }
    }
  }

  console.info('db_status_to_lua wash_mode:', status.wash_mode, ' cloud_cycle_low:', status.cloud_cycle_low);

  let convertStatus = {};

  for (let key in status) {
    switch (key) {
      case 'cloud_cycle_low':
        convertStatus.cloud_cycle_low = status[key];
        break;
      case 'cloud_cycle_high':
        convertStatus.cloud_cycle_high = status[key];
        break;
      case 'cloud_cycle_jiepai1':
        convertStatus.cloud_cycle_jiepai1 = status[key];
        break;
      case 'cloud_cycle_jiepai2':
        convertStatus.cloud_cycle_jiepai2 = status[key];
        break;
      case 'cloud_cycle_jiepai3':
        convertStatus.cloud_cycle_jiepai3 = status[key];
        break;
      case 'cloud_cycle_jiepai4':
        convertStatus.cloud_cycle_jiepai4 = status[key];
        break;
      case 'cloud_cycle_jiepai_time1':
        convertStatus.cloud_cycle_jiepai_time1 = status[key];
        break;
      case 'cloud_cycle_jiepai_time2':
        convertStatus.cloud_cycle_jiepai_time2 = status[key];
        break;
      case 'cloud_cycle_jiepai_time3':
        convertStatus.cloud_cycle_jiepai_time3 = status[key];
        break;
      case 'cloud_cycle_jiepai_time4':
        convertStatus.cloud_cycle_jiepai_time4 = status[key];
        break;
      case 'oxygenation':
        convertStatus.active_oxygen = status[key] + '';
        break;
      case 'customize_machine_cycle':
        convertStatus.customize_machine_cycle = status[key];
        break;
      // 开关机
      case 'switch':
        convertStatus.power = status[key] === 1 ? 'on' : 'off';
        break;
      // 是否合并
      case 'merge':
        convertStatus.merge = status[key];
        break;
      // 童锁
      case 'baby_lock':
        convertStatus.lock = status[key] === 1 ? 'on' : 'off';
        break;
      // 水位
      case 'water_level':
        switch (status[key]) {
          case 1:
            convertStatus.water_level = 'low';
            break;
          case 2:
            convertStatus.water_level = 'mid';
            break;
          case 3:
            convertStatus.water_level = 'high';
            break;
          case 4:
            convertStatus.water_level = '4';
            break;
          case 5:
            convertStatus.water_level = 'auto';
            break;
        }
        break;
      // 季节
      case 'season':
        convertStatus.season = status[key];
        break;
      // 漂洗次数
      case 'rinse':
        convertStatus.soak_count = status[key] + '';
        break;
      // 洗涤时间
      case 'wash_time':
        convertStatus.wash_time = status[key];
        break;
      // 特渍洗
      case 'stains':
        convertStatus.stains = status[key] + '';
        break;
      // 强力洗、加强洗
      case 'intense_wash':
        convertStatus.strong_wash = status[key] === 1 ? 'on' : 'off';
        break;
      // 紫外除菌
      case 'ultraviolet_lamp':
        convertStatus.ultraviolet_lamp = status[key] === 1 ? '1' : '0';
        break;
      // 温度
      case 'temperature':
        switch (status[key]) {
          case 1:
            convertStatus.temperature = '0';
            break;
          case 2:
            convertStatus.temperature = '20';
            break;
          case 3:
            convertStatus.temperature = '30';
            break;
          case 4:
            convertStatus.temperature = '40';
            break;
          case 5:
            convertStatus.temperature = '60';
            break;
          case 6:
            convertStatus.temperature = '95';
            break;
        }
        break;
      // 脱水时间
      case 'spin_time':
        convertStatus.dehydration_time = status[key];
        break;
      // 烘干
      case 'dryer':
        convertStatus.dryer = status[key] + '';
        break;
      // 转速
      case 'dewatering_speed':
        switch (status[key]) {
          case 0:
            convertStatus.dehydration_speed = '0';
            break;
          case 1:
            convertStatus.dehydration_speed = '400';
            break;
          case 2:
            convertStatus.dehydration_speed = '600';
            break;
          case 3:
            convertStatus.dehydration_speed = '800';
            break;
          case 4:
            convertStatus.dehydration_speed = '1000';
            break;
          case 5:
            convertStatus.dehydration_speed = '1200';
            break;
          case 6:
            convertStatus.dehydration_speed = '1400';
            break;
          case 7:
            convertStatus.dehydration_speed = '1600';
            break;
          case 8:
            convertStatus.dehydration_speed = '1300';
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
      // 预洗
      case 'pre_wash':
        convertStatus.beforehand_wash = status[key] === 1 ? 'on' : 'off';
        break;
      // 超净漂洗
      case 'extra_rinse':
        convertStatus.super_clean_wash = status[key] === 1 ? 'on' : 'off';
        break;
      // 智能漂洗
      case 'intelligent_wash':
        convertStatus.intelligent_wash = status[key] === 1 ? 'on' : 'off';
        break;
      // 快净
      case 'FCS':
        convertStatus.fast_clean_wash = status[key] === 1 ? 'on' : 'off';
        break;
      // 新风祛味
      case 'air_fresh':
        convertStatus.wind_dispel = status[key] === 1 ? '1' : '0';
        break;
      // 蒸汽洗
      case 'steam_wash':
        convertStatus.steam_wash = status[key] === 1 ? 'on' : 'off';
        break;
      // 静音洗/夜间洗
      case 'nightly':
        convertStatus.nightly = status[key] === 1 ? 'on' : 'off';
        break;
      // 轻松熨
      case 'easy_ironing':
        convertStatus.easy_ironing = status[key] === 1 ? 'on' : 'off';
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
      // 红外开关
      case 'ca_infrared_door':
        convertStatus.ca_infrared_door = status[key] + '';
        break;
      // ai开关
      case 'ai':
        convertStatus.ai = status[key] + '';
        break;
      // 洗涤剂浓度
      case 'detergent_density':
        convertStatus.detergent_density = status[key] + '';
        break;
      // 柔顺剂浓度
      case 'softener_density':
        convertStatus.softener_density = status[key] + '';
        break;
      case 'detergent_global':
        convertStatus.detergent_global = status[key] + '';
        break;
      case 'softener_global':
        convertStatus.softener_global = status[key] + '';
        break;
      // cycle
      case 'wash_mode':
        switch (status.wash_mode) {
          case 0x00:
            convertStatus.program = 'cotton';
            break;
          case 0x01:
            convertStatus.program = 'eco';
            break;
          case 0x02:
            convertStatus.program = 'fast_wash';
            break;
          case 0x03:
            convertStatus.program = 'mixed_wash';
            break;
          case 0x05:
            convertStatus.program = 'wool';
            break;
          case 0x07:
            convertStatus.program = 'ssp';
            break;
          case 0x08:
            convertStatus.program = 'sport_clothes';
            break;
          case 0x09:
            convertStatus.program = 'single_dehytration';
            break;
          case 0x0a:
            convertStatus.program = 'rinsing_dehydration';
            break;
          case 0x0b:
            convertStatus.program = 'big';
            break;
          case 0x0c:
            convertStatus.program = 'baby_clothes';
            break;
          case 0x0f:
            convertStatus.program = 'down_jacket';
            break;
          case 0x10:
            convertStatus.program = 'color';
            break;
          case 0x11:
            convertStatus.program = 'intelligent';
            break;
          case 0x12:
            convertStatus.program = 'quick_wash';
            break;
          case 0x1c:
            convertStatus.program = 'shirt';
            break;
          case 0x04:
            convertStatus.program = 'fiber';
            break;
          case 0x06:
            convertStatus.program = 'enzyme';
            break;
          case 0x0d:
            convertStatus.program = 'underwear';
            break;
          case 0x0e:
            convertStatus.program = 'outdoor';
            break;
          case 0x15:
            convertStatus.program = 'air_wash';
            break;
          case 0x16:
            convertStatus.program = 'single_drying';
            break;
          case 0x1d:
            convertStatus.program = 'steep';
            break;
          case 0x13:
            convertStatus.program = 'kids';
            break;
          case 0x14:
            convertStatus.program = 'water_cotton';
            break;
          case 0x17:
            convertStatus.program = 'fast_wash_30';
            break;
          case 0x18:
            convertStatus.program = 'fast_wash_60';
            break;
          case 0x1f:
            convertStatus.program = 'water_mixed_wash';
            break;
          case 0x20:
            convertStatus.program = 'water_fiber';
            break;
          case 0x21:
            convertStatus.program = 'water_kids';
            break;
          case 0x22:
            convertStatus.program = 'water_underwear';
            break;
          case 0x23:
            convertStatus.program = 'specialist';
            break;
          case 0xfe:
            convertStatus.program = 'love';
            break;
          case 0x19:
            convertStatus.program = 'water_intelligent';
            break;
          case 0x1a:
            convertStatus.program = 'water_steep';
            break;
          case 0x1b:
            convertStatus.program = 'water_fast_wash_30';
            break;
          case 0x1e:
            convertStatus.program = 'new_water_cotton';
            break;
          case 0x24:
            convertStatus.program = 'water_eco';
            break;
          case 0x25:
            convertStatus.program = 'wash_drying_60';
            break;
          case 0x26:
            convertStatus.program = 'self_wash_5';
            break;
          case 0x27:
            convertStatus.program = 'fast_wash_min';
            break;
          case 0x28:
            convertStatus.program = 'mixed_wash_min';
            break;
          case 0x29:
            convertStatus.program = 'dehydration_min';
            break;
          case 0x2a:
            convertStatus.program = 'self_wash_min';
            break;
          case 0x2b:
            convertStatus.program = 'baby_clothes_min';
            break;
          case 0x65:
            convertStatus.program = 'silk_wash';
            break;
          case 0x2c:
            convertStatus.program = 'prevent_allergy';
            break;
          case 0x2d:
            convertStatus.program = 'cold_wash';
            break;
          case 0x2e:
            convertStatus.program = 'soft_wash';
            break;
          case 0x2f:
            convertStatus.program = 'remove_mite_wash';
            break;
          case 0x30:
            convertStatus.program = 'water_intense_wash';
            break;
          case 0x31:
            convertStatus.program = 'fast_dry';
            break;
          case 0x32:
            convertStatus.program = 'water_outdoor';
            break;
          case 0x33:
            convertStatus.program = 'spring_autumn_wash';
            break;
          case 0x34:
            convertStatus.program = 'summer_wash';
            break;
          case 0x35:
            convertStatus.program = 'winter_wash';
            break;
          case 0x36:
            convertStatus.program = 'jean';
            break;
          case 0x37:
            convertStatus.program = 'new_clothes_wash';
            break;
          case 0x38:
            convertStatus.program = 'silk';
            break;
          case 0x39:
            convertStatus.program = 'insight_wash';
            break;
          case 0x3a:
            convertStatus.program = 'fitness_clothes';
            break;
          case 0x3b:
            convertStatus.program = 'mink';
            break;
          case 0x3c:
            convertStatus.program = 'fresh_air';
            break;
          case 0x3d:
            convertStatus.program = 'bucket_dry';
            break;
          case 0x3e:
            convertStatus.program = 'jacket';
            break;
          case 0x3f:
            convertStatus.program = 'bath_towel';
            break;
          case 0x40:
            convertStatus.program = 'night_fresh_wash';
            break;
          case 0x60:
            convertStatus.program = 'heart_wash';
            break;
          case 0x61:
            convertStatus.program = 'water_cold_wash';
            break;
          case 0x62:
            convertStatus.program = 'water_prevent_allergy';
            break;
          case 0x63:
            convertStatus.program = 'water_remove_mite_wash';
            break;
          case 0x64:
            convertStatus.program = 'water_ssp';
            break;
          case 0x66:
            convertStatus.program = 'standard';
            break;
          case 0x67:
            convertStatus.program = 'green_wool';
            break;
          case 0x68:
            convertStatus.program = 'cook_wash';
            break;
          case 0x6a:
            convertStatus.program = 'steam_sterilize_wash';
            break;
          case 0x6b:
            convertStatus.program = 'aromatherapy';
            break;
          case 0x70:
            convertStatus.program = 'sterilize_wash';
            break;
          case 0x83:
            convertStatus.program = 'white_clothes_clean';
            break;
          case 0x84:
            convertStatus.program = 'clean_stains';
            break;
          case 0x85:
            convertStatus.program = 'tube_clean_all';
            break;
          case 0x86:
            convertStatus.program = 'no_channeling_color';
            break;
          case 0x87:
            convertStatus.program = 'scald_wash';
            break;
          case 0x88:
            convertStatus.program = 'hanfu_spring_summer';
            break;
          case 0x89:
            convertStatus.program = 'hanfu_autumn_winter';
            break;
          case 0x8b:
            convertStatus.program = 'skin_care_wash';
            break;
          case 0x8d:
            convertStatus.program = 'hanfu_wash';
            break;
          default:
            convertStatus.program = status.wash_mode;
            convertStatus.useCycleValue = 1;
            break;
        }
        break;
    }
  }

  if (!_.has(status, 'wash')) {
    // do nothing ?
  } else {
    convertStatus.control_status = status.wash === 1 ? 'start' : 'pause';
  }

  if (!deviceConfig.userProtocolV2) {
    // 如果使用的是短协议，那么确保下发的指令中没有cloud_cycle_low和cloud_cycle_high
    delete convertStatus.cloud_cycle_low;
    delete convertStatus.cloud_cycle_high;
  }

  if (deviceConfig.userProtocolV2 && deviceStatus) {
    // 使用长协议，指定协议版本为2
    convertStatus.protocol_v = 2;
    if (deviceStatus.cloud_cycle_low !== undefined && deviceStatus.cloud_cycle_high !== undefined) {
      if (!_.has(status, 'cloud_cycle_low')) {
        convertStatus.cloud_cycle_low = deviceStatus.cloud_cycle_low;
      }
      if (!_.has(status, 'cloud_cycle_high')) {
        convertStatus.cloud_cycle_high = deviceStatus.cloud_cycle_high;
      }
    }
    if (deviceConfig.clearLiquidParam) {
      // 洗涤剂柔顺剂相关参数未主动下发全部置为 0xFF
      if (!_.has(status, 'detergent')) {
        convertStatus.detergent = 0xff;
      }
      if (!_.has(status, 'softener')) {
        convertStatus.softener = 0xff;
      }
      if (!_.has(status, 'detergent_density')) {
        convertStatus.detergent_density = 0xff;
      }
      if (!_.has(status, 'softener_density')) {
        convertStatus.softener_density = 0xff;
      }
      if (!_.has(status, 'detergent_global')) {
        convertStatus.detergent_global = 0xff;
      }
      if (!_.has(status, 'softener_global')) {
        convertStatus.softener_global = 0xff;
      }
    }
  }

  if (deviceConfig.supportCycleProjection) {
    if (!_.has(status, 'customize_machine_cycle')) {
      convertStatus.customize_machine_cycle = 255;
    }
  }
  console.log('userProtocolV2', convertStatus);
  return convertStatus;
};
