import constants from './constants';
import _ from './myLodash';

export default (status, deviceConfig, deviceStatus) => {
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
      case 'active_oxygen':
        originStatus.oxygenation = status[key];
        break;
      case 'customize_machine_cycle':
        if (deviceConfig && deviceConfig.supportCycleProjection) {
          originStatus.customize_machine_cycle = status[key];
        } else {
          originStatus.customize_machine_cycle = 0xff;
        }
        break;
      case 'detergent_lack':
        originStatus.detergent_lack = status.detergent_lack === 'on' ? 1 : 0;
        break;
      case 'softener_lack':
        originStatus.softener_lack = status.softener_lack === 'on' ? 1 : 0;
        break;
      case 'cloud_cycle_low':
        originStatus.cloud_cycle_low = status[key];
        break;
      case 'cloud_cycle_high':
        originStatus.cloud_cycle_high = status[key];
        break;
      case 'cloud_cycle_jiepai1':
        originStatus.cloud_cycle_jiepai1 = status[key];
        break;
      case 'cloud_cycle_jiepai2':
        originStatus.cloud_cycle_jiepai2 = status[key];
        break;
      case 'cloud_cycle_jiepai3':
        originStatus.cloud_cycle_jiepai3 = status[key];
        break;
      case 'cloud_cycle_jiepai4':
        originStatus.cloud_cycle_jiepai4 = status[key];
        break;
      case 'cloud_cycle_jiepai_time1':
        originStatus.cloud_cycle_jiepai_time1 = status[key];
        break;
      case 'cloud_cycle_jiepai_time2':
        originStatus.cloud_cycle_jiepai_time2 = status[key];
        break;
      case 'cloud_cycle_jiepai_time3':
        originStatus.cloud_cycle_jiepai_time3 = status[key];
        break;
      case 'cloud_cycle_jiepai_time4':
        originStatus.cloud_cycle_jiepai_time4 = status[key];
        break;
      // 开关机
      case 'power':
        originStatus.powerOn = status.power === 'on';
        break;
      // 童锁
      case 'lock':
        originStatus.baby_lock = status.lock === 'on' ? 1 : 0;
        break;
      // 水位
      case 'water_level':
        switch (status.water_level) {
          case 'low':
            originStatus.water_level = 1;
            break;
          case 'mid':
            originStatus.water_level = 2;
            break;
          case 'high':
            originStatus.water_level = 3;
            break;
          case '4':
            originStatus.water_level = 4;
            break;
          case 'auto':
            originStatus.water_level = 5;
            break;
        }
        break;
      // 季节
      case 'season':
        originStatus.season = status.season;
        break;
      // 漂洗次数
      case 'soak_count':
        try {
          originStatus.rinse = parseInt(status.soak_count);
        } catch (e) {
          originStatus.rinse = status.soak_count;
        }
        break;
      // 洗涤时间
      case 'wash_time':
        originStatus.wash_time = status.wash_time;
        break;
      // 温度
      case 'temperature':
        switch (status.temperature) {
          case '0':
            originStatus.temperature = 1;
            break;
          case '20':
            originStatus.temperature = 2;
            break;
          case '30':
            originStatus.temperature = 3;
            break;
          case '40':
            originStatus.temperature = 4;
            break;
          case '60':
            originStatus.temperature = 5;
            break;
          case '95':
            originStatus.temperature = 6;
            break;
        }
        break;
      // 脱水时间
      case 'dehydration_time':
        originStatus.spin_time = status.dehydration_time;
        break;
      // 烘干
      case 'dryer':
        try {
          originStatus.dryer = parseInt(status.dryer);
        } catch (e) {
          originStatus.dryer = status.dryer;
        }
        break;
      // 特渍洗
      case 'stains':
        try {
          originStatus.stains = parseInt(status.stains);
        } catch (e) {
          originStatus.stains = status.stains;
        }
        break;
      // 强力洗、加强洗
      case 'strong_wash':
        originStatus.intense_wash = status.strong_wash === 'on' ? 1 : 0;
        break;
      // 紫外除菌
      case 'ultraviolet_lamp':
        originStatus.ultraviolet_lamp = status.ultraviolet_lamp === '1' ? 1 : 0;
        break;
      // 转速
      case 'dehydration_speed':
        switch (status.dehydration_speed) {
          case '0':
            originStatus.dewatering_speed = 0;
            break;
          case '400':
            originStatus.dewatering_speed = 1;
            break;
          case '600':
            originStatus.dewatering_speed = 2;
            break;
          case '800':
            originStatus.dewatering_speed = 3;
            break;
          case '1000':
            originStatus.dewatering_speed = 4;
            break;
          case '1200':
            originStatus.dewatering_speed = 5;
            break;
          case '1400':
            originStatus.dewatering_speed = 6;
            break;
          case '1600':
            originStatus.dewatering_speed = 7;
            break;
          case '1300':
            originStatus.dewatering_speed = 8;
            break;
        }
        break;
      // 柔顺剂
      case 'softener':
        try {
          originStatus.softener = parseInt(status.softener);
        } catch (e) {
          originStatus.softener = status.softener;
        }
        break;
      // 洗涤剂
      case 'detergent':
        try {
          originStatus.detergent = parseInt(status.detergent);
        } catch (e) {
          originStatus.detergent = status.detergent;
        }
        break;
      // 超微净泡
      case 'microbubble':
        try {
          originStatus.little_bubble = parseInt(status.microbubble);
        } catch (e) {
          originStatus.little_bubble = status.microbubble;
        }
        break;
      case 'remain_time':
        originStatus.time_remaining = status.remain_time;
        break;
      case 'error_code':
        originStatus.fault_warn = status.error_code.toString(16).toUpperCase();
        if (status.error_code !== 0 && status.error_code !== '0') {
          originStatus.fault_warn = 'E' + originStatus.fault_warn;
        }
        break;
      // 静音洗/夜间洗
      case 'nightly':
        originStatus.nightly = status.nightly === 'on' ? 1 : 0;
        break;
      // 轻松熨
      case 'easy_ironing':
        originStatus.easy_ironing = status.easy_ironing === 'on' ? 1 : 0;
        break;
      // 预洗
      case 'beforehand_wash':
        originStatus.pre_wash = status.beforehand_wash === 'on' ? 1 : 0;
        break;
      // 超净漂洗
      case 'super_clean_wash':
        originStatus.extra_rinse = status.super_clean_wash === 'on' ? 1 : 0;
        break;
      // 超净漂洗
      case 'intelligent_wash':
        originStatus.intelligent_wash = status.intelligent_wash === 'on' ? 1 : 0;
        break;
      // 快净
      case 'fast_clean_wash':
        originStatus.FCS = status.fast_clean_wash === 'on' ? 1 : 0;
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
      // 新风祛味
      case 'wind_dispel':
        originStatus.air_fresh = status.wind_dispel === '1' ? 1 : 0;
        break;
      // 红外门开关
      case 'ca_infrared_door':
        originStatus.ca_infrared_door = status.ca_infrared_door ? 1 : 0;
        break;
      // AI
      case 'ai_flag':
        originStatus.ai = status.ai_flag === 'on' ? 1 : 0;
        break;
      case 'program':
        switch (status.program) {
          case 'cotton':
            originStatus.wash_mode = 0x00;
            break;
          case 'eco':
            originStatus.wash_mode = 0x01;
            break;
          case 'fast_wash':
            originStatus.wash_mode = 0x02;
            break;
          case 'mixed_wash':
            originStatus.wash_mode = 0x03;
            break;
          case 'wool':
            originStatus.wash_mode = 0x05;
            break;
          case 'ssp':
            originStatus.wash_mode = 0x07;
            break;
          case 'sport_clothes':
            originStatus.wash_mode = 0x08;
            break;
          case 'single_dehytration':
            originStatus.wash_mode = 0x09;
            break;
          case 'rinsing_dehydration':
            originStatus.wash_mode = 0x0a;
            break;
          case 'big':
            originStatus.wash_mode = 0x0b;
            break;
          case 'baby_clothes':
            originStatus.wash_mode = 0x0c;
            break;
          case 'down_jacket':
            originStatus.wash_mode = 0x0f;
            break;
          case 'color':
            originStatus.wash_mode = 0x10;
            break;
          case 'intelligent':
            originStatus.wash_mode = 0x11;
            break;
          case 'quick_wash':
            originStatus.wash_mode = 0x12;
            break;
          case 'shirt':
            originStatus.wash_mode = 0x1c;
            break;
          case 'fiber':
            originStatus.wash_mode = 0x04;
            break;
          case 'enzyme':
            originStatus.wash_mode = 0x06;
            break;
          case 'underwear':
            originStatus.wash_mode = 0x0d;
            break;
          case 'outdoor':
            originStatus.wash_mode = 0x0e;
            break;
          case 'air_wash':
            originStatus.wash_mode = 0x15;
            break;
          case 'single_drying':
            originStatus.wash_mode = 0x16;
            break;
          case 'steep':
            originStatus.wash_mode = 0x1d;
            break;
          case 'kids':
            originStatus.wash_mode = 0x13;
            break;
          case 'water_cotton':
            originStatus.wash_mode = 0x14;
            break;
          case 'fast_wash_30':
            originStatus.wash_mode = 0x17;
            break;
          case 'fast_wash_60':
            originStatus.wash_mode = 0x18;
            break;
          case 'water_mixed_wash':
            originStatus.wash_mode = 0x1f;
            break;
          case 'water_fiber':
            originStatus.wash_mode = 0x20;
            break;
          case 'water_kids':
            originStatus.wash_mode = 0x21;
            break;
          case 'water_underwear':
            originStatus.wash_mode = 0x22;
            break;
          case 'specialist':
            originStatus.wash_mode = 0x23;
            break;
          case 'love':
            originStatus.wash_mode = 0xfe;
            break;
          case 'water_intelligent':
            originStatus.wash_mode = 0x19;
            break;
          case 'water_steep':
            originStatus.wash_mode = 0x1a;
            break;
          case 'water_fast_wash_30':
            originStatus.wash_mode = 0x1b;
            break;
          case 'new_water_cotton':
            originStatus.wash_mode = 0x1e;
            break;
          case 'water_eco':
            originStatus.wash_mode = 0x24;
            break;
          case 'wash_drying_60':
            originStatus.wash_mode = 0x25;
            break;
          case 'self_wash_5':
            originStatus.wash_mode = 0x26;
            break;
          case 'fast_wash_min':
            originStatus.wash_mode = 0x27;
            break;
          case 'mixed_wash_min':
            originStatus.wash_mode = 0x28;
            break;
          case 'dehydration_min':
            originStatus.wash_mode = 0x29;
            break;
          case 'self_wash_min':
            originStatus.wash_mode = 0x2a;
            break;
          case 'baby_clothes_min':
            originStatus.wash_mode = 0x2b;
            break;
          case 'silk_wash':
            originStatus.wash_mode = 0x65;
            break;
          case 'prevent_allergy':
            originStatus.wash_mode = 0x2c;
            break;
          case 'cold_wash':
            originStatus.wash_mode = 0x2d;
            break;
          case 'soft_wash':
            originStatus.wash_mode = 0x2e;
            break;
          case 'remove_mite_wash':
            originStatus.wash_mode = 0x2f;
            break;
          case 'water_intense_wash':
            originStatus.wash_mode = 0x30;
            break;
          case 'fast_dry':
            originStatus.wash_mode = 0x31;
            break;
          case 'water_outdoor':
            originStatus.wash_mode = 0x32;
            break;
          case 'spring_autumn_wash':
            originStatus.wash_mode = 0x33;
            break;
          case 'summer_wash':
            originStatus.wash_mode = 0x34;
            break;
          case 'winter_wash':
            originStatus.wash_mode = 0x35;
            break;
          case 'jean':
            originStatus.wash_mode = 0x36;
            break;
          case 'new_clothes_wash':
            originStatus.wash_mode = 0x37;
            break;
          case 'silk':
            originStatus.wash_mode = 0x38;
            break;
          case 'insight_wash':
            originStatus.wash_mode = 0x39;
            break;
          case 'fitness_clothes':
            originStatus.wash_mode = 0x3a;
            break;
          case 'mink':
            originStatus.wash_mode = 0x3b;
            break;
          case 'fresh_air':
            originStatus.wash_mode = 0x3c;
            break;
          case 'bucket_dry':
            originStatus.wash_mode = 0x3d;
            break;
          case 'jacket':
            originStatus.wash_mode = 0x3e;
            break;
          case 'bath_towel':
            originStatus.wash_mode = 0x3f;
            break;
          case 'night_fresh_wash':
            originStatus.wash_mode = 0x40;
            break;
          case 'heart_wash':
            originStatus.wash_mode = 0x60;
            break;
          case 'water_cold_wash':
            originStatus.wash_mode = 0x61;
            break;
          case 'water_prevent_allergy':
            originStatus.wash_mode = 0x62;
            break;
          case 'water_remove_mite_wash':
            originStatus.wash_mode = 0x63;
            break;
          case 'water_ssp':
            originStatus.wash_mode = 0x64;
            break;
          case 'standard':
            originStatus.wash_mode = 0x66;
            break;
          case 'green_wool':
            originStatus.wash_mode = 0x67;
            break;
          case 'cook_wash':
            originStatus.wash_mode = 0x68;
            break;
          case 'steam_sterilize_wash':
            originStatus.wash_mode = 0x6a;
            break;
          case 'aromatherapy':
            originStatus.wash_mode = 0x6b;
            break;
          case 'sterilize_wash':
            originStatus.wash_mode = 0x70;
            break;
          case 'white_clothes_clean':
            originStatus.wash_mode = 0x83;
            break;
          case 'clean_stains':
            originStatus.wash_mode = 0x84;
            break;
          case 'tube_clean_all':
            originStatus.wash_mode = 0x85;
            break;
          case 'no_channeling_color':
            originStatus.wash_mode = 0x86;
            break;
          case 'scald_wash':
            originStatus.wash_mode = 0x87;
            break;
          case 'hanfu_spring_summer':
            originStatus.wash_mode = 0x88;
            break;
          case 'hanfu_autumn_winter':
            originStatus.wash_mode = 0x89;
            break;
          case 'skin_care_wash':
            originStatus.wash_mode = 0x8b;
            break;
          case 'hanfu_wash':
            originStatus.wash_mode = 0x8d;
            break;
          default:
            originStatus.wash_mode = status.program;
        }
        break;
      case 'progress':
        try {
          originStatus.progress = parseInt(status.progress);
        } catch (e) {
          originStatus.progress = status.progress;
        }
        break;
      case 'running_status':
        switch (status.running_status) {
          case 'standby':
            if (status.power === 'off') {
              originStatus.status = constants.STATUS.POWER_OFF;
            } else {
              originStatus.status = constants.STATUS.READY;
            }
            originStatus.wash = 0;
            break;
          case 'pause':
            originStatus.status = constants.STATUS.PAUSED;
            originStatus.wash = 0;
            break;
          case 'fault':
            originStatus.status = constants.STATUS.DEVICE_FAULT;
            originStatus.wash = 0;
            break;
          case 'end':
            originStatus.status = constants.STATUS.FINISH_WASH;
            originStatus.wash = 0;
            break;
          case 'idle':
            originStatus.idle = true;
            break;
          case 'delay':
            originStatus.status = constants.STATUS.RESERVED;
            originStatus.wash = 1;
            originStatus.appointment_wash = 1;
            break;
          case 'start':
            originStatus.wash = 1;
            switch (status.progress.toString()) {
              case '1': //BIT0
                originStatus.status = constants.STATUS.DEHYDRATING;
                break;
              case '2': //BIT1
                if (status.expert_step.toString() === '4') {
                  // 漂洗过程自动投放柔顺剂
                  originStatus.status = constants.STATUS.SOFTENER_PUTTING;
                } else {
                  originStatus.status = constants.STATUS.RINSING;
                }
                break;
              case '4': //BIT2
                if (status.expert_step.toString() === '4') {
                  // 洗涤过程自动投放洗涤剂
                  originStatus.status = constants.STATUS.DETERGENT_PUTTING;
                } else {
                  originStatus.status = constants.STATUS.WASHING;
                }
                break;
              case '8': //BIT3
                if (status.expert_step.toString() === '4') {
                  // 预洗过程自动投放
                  originStatus.status = constants.STATUS.PRE_WASH_DETERGENT_PUTTING;
                } else {
                  originStatus.status = constants.STATUS.PRE_WASH;
                }
                break;
              case '16': //BIT4
                originStatus.status = constants.STATUS.DRYING;
                break;
              case '32': //BIT5
                originStatus.status = constants.STATUS.WEIGHING;
                break;
              case '64': //BIT6
                originStatus.status = constants.STATUS.HIGH_SPEED_DEHYDRATING;
                break;
              case '128': //BIT7(洗衣房专用)
                // originStatus['status'] = ;
                break;
              default:
                if (deviceStatus && deviceStatus.status) {
                  originStatus.status = deviceStatus.status;
                }
                break;
            }
            // 筒自洁——清洁中
            if (status.program === 'water_ssp') {
              originStatus.status = constants.STATUS.CLEANING;
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
  if (originStatus.wash_mode === 21 && originStatus.status === constants.STATUS.DRYING) {
    originStatus.status = constants.STATUS.FRESHING;
  }
  // 处理云程序index，直接拼接到wash_mode后
  if (_.isNil(originStatus.cloud_cycle_low) && originStatus.cloud_cycle_low !== 0 && originStatus.cloud_cycle_low !== 0xff) {
    originStatus.wash_mode = parseFloat(originStatus.wash_mode + '.' + _.fixNum(originStatus.cloud_cycle_low, 2));
  } else {
    // 没有上报cloud_cycle_low的情况，需要处理投屏程序，带index的程序，投屏之后，变成面板程序，但是json文件中还是带小数点，需要处理一下
    if (deviceConfig && deviceConfig.supportCycleProjection && _.isNil(deviceConfig.cycleProjection) && originStatus.wash_mode === originStatus.customize_machine_cycle) {
      deviceConfig.cycleProjection.forEach((cycleValue) => {
        if (parseInt(cycleValue) === originStatus.wash_mode) {
          originStatus.wash_mode = cycleValue;
        }
      });
    }
  }
  return originStatus;
};
