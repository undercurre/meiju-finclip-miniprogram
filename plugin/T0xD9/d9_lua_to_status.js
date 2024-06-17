import convertD9ProgramToWashModeDB from './d9_program_to_wash_mode_db';
import convertD9ProgramToWashModeDC from './d9_program_to_wash_mode_dc';
import convertD9ProgramToWashModeDA from './d9_program_to_wash_mode_da';

export default (status) => {
  let originStatus = {};
  if (!status) {
    return originStatus;
  }
  let bucket = status.bucket;
  for (let key in status) {
    switch (key) {
      case 'bucket':
        originStatus.bucket = status[key];
        break;
      case bucket + '_position':
        originStatus.position = status[key];
        break;
      case bucket + '_location':
        originStatus.location = status[key];
        break;
      // 开关机
      case bucket + '_power':
        originStatus.powerOn = status[key] === 'on';
        break;
      // AI
      case bucket + '_ai':
        originStatus.ai = status[key];
        break;
      // 自定义、db云程序投屏
      case bucket + '_custom_cycle':
        originStatus.custom_cycle = status[key];
        originStatus.customize_machine_cycle = status[key];
        break;
      // dc云程序投屏
      case 'dc_customize_machine_cycle':
        if (bucket === 'dc') {
          originStatus.customize_machine_cycle = status[key];
        }
        break;
      // 童锁
      case bucket + '_baby_lock':
        originStatus.baby_lock = status[key];
        break;
      // 轻松熨
      case bucket + '_easy_ironing':
        originStatus.easy_ironing = status[key];
        break;
      // 夜间洗
      case bucket + '_nightly_wash':
        originStatus.nightly = status[key];
        break;
      // 蒸汽洗
      case bucket + '_steam_wash':
        originStatus.steam_wash = status[key];
        break;
      // 雾态洗
      case bucket + '_spray_wash':
        originStatus.spray_wash = status[key];
        break;
      // 浸泡洗
      case bucket + '_soak_wash':
        originStatus.soak_wash = status[key];
        break;
      // 加强洗
      case bucket + '_strong_wash':
        originStatus.strong_wash = status[key];
        break;
      // 紫外除菌
      case 'db_sterilize':
        if (bucket === 'db') {
          originStatus.ultraviolet_lamp = status[key];
        }
        break;
      // 特渍洗
      case bucket + '_stains_wash':
        originStatus.stains = status[key];
        break;
      // 剩余时间
      case bucket + '_remain_time':
        originStatus.time_remaining = status[key];
        break;
      // 加速洗
      case bucket + '_speedy_wash':
        originStatus.speedy = status[key];
        break;
      // 温度
      case bucket + '_temperature':
        originStatus.temperature = status[key];
        break;
      // 洗涤剂
      case bucket + '_detergent':
        originStatus.detergent = status[key];
        break;
      // 柔顺剂
      case bucket + '_softener':
        originStatus.softener = status[key];
        break;
      // 洗涤时间(档位)
      case bucket + '_wash_time':
        originStatus.wash_time = status[key];
        break;
      // 洗涤时间(数值)
      case bucket + '_set_wash_time':
        originStatus.wash_time_value = status[key];
        break;
      // 脱水时间(档位)
      case bucket + '_dehydration_time':
        originStatus.spin_time = status[key];
        break;
      // 脱水时间(数值)
      case bucket + '_set_dewater_time':
        originStatus.spin_time_value = status[key];
        break;
      // 漂洗次数
      case bucket + '_rinse_count':
        originStatus.rinse = status[key];
        break;
      // 水位
      case bucket + '_water_level':
        if (bucket === 'db') {
          originStatus.water_level = status[key];
        } else if (bucket === 'da') {
          originStatus.wash_waterlevel = status[key];
        }
        break;
      // 脱水速度
      case 'db_dehydration_speed':
        if (bucket === 'db') {
          originStatus.dewatering_speed = status[key];
        }
        break;
      // db烘干
      case 'db_dry':
        if (bucket === 'db') {
          originStatus.dryer = status[key];
        }
        break;
      // db快净
      case 'db_fast_clean_wash':
        if (bucket === 'db') {
          originStatus.fast_clean_wash = status[key];
        }
        break;
      // dc定时(烘干时间)
      case 'dc_dry_time':
        if (bucket === 'dc') {
          originStatus.dry_time_new = status[key];
        }
        break;
      // dc烘干程度
      case 'dc_intensity':
        if (bucket === 'dc') {
          originStatus.dry_level = status[key];
        }
        break;
      // dc蒸汽档位
      case 'dc_steam':
        if (bucket === 'dc') {
          originStatus.steam_level = status[key];
        }
        break;
      // dc除菌
      case 'dc_sterilize':
        if (bucket === 'dc') {
          originStatus.sterilize = status[key];
        }
        break;
      // dc防皱
      case 'dc_prevent_wrinkle':
        if (bucket === 'dc') {
          originStatus.crease_resist = status[key];
        }
        break;
      // dc轻干洗材质材质
      case 'dc_material':
        if (bucket === 'dc') {
          originStatus.texture = status[key];
        }
        break;
      // dc轻干洗味道
      case 'dc_smell':
        if (bucket === 'dc') {
          originStatus.smell = status[key];
        }
        break;
      // dc轻干洗时间档位
      case 'dc_smell_time':
        if (bucket === 'dc') {
          originStatus.smell_time = status[key];
        }
        break;
      //  dc温度档位
      case 'dc_temperature_level':
        if (bucket === 'dc') {
          originStatus.temperature_level = status[key];
        }
        break;
      //  dc多维除菌
      case 'dc_multidimensional_sterilize':
        if (bucket === 'dc') {
          originStatus.multidimensional_sterilize = status[key];
        }
        break;
      //  dc智能防潮
      case 'dc_intelligent_dampproof':
        if (bucket === 'dc') {
          originStatus.intelligent_prevent_damp = status[key];
        }
        break;
      // 柔顺剂缺液提醒
      case bucket + '_softener_needed':
        originStatus.softener_needed = status[key];
        break;
      // 洗涤剂缺液提醒
      case bucket + '_detergent_needed':
        originStatus.detergent_needed = status[key];
        break;
      // 筒自洁提醒
      case 'db_clean_notification':
        originStatus.db_clean_notification = status[key];
        break;
      case 'da_clean_notification':
        originStatus.da_clean_notification = status[key];
        break;
      // 空气洗材质
      case 'db_material':
        originStatus.material = status[key];
        break;
      // 水质联动开关
      case 'db_water_quality_link':
        originStatus.water_quality_link = status[key];
        break;
      // 洗涤剂增量
      case 'db_detergent_increment':
        originStatus.detergent_increment = status[key];
        break;
      // 柔顺剂增量
      case 'db_softener_increment':
        originStatus.softener_increment = status[key];
        break;
      // 实时预约结束时间
      case bucket + '_appointment_end_time':
        if (status[key] >= 1440) {
          originStatus.appointment_end_time = status[key] - 1440;
          originStatus.appointment_end_day = 1;
        } else {
          originStatus.appointment_end_time = status[key];
          originStatus.appointment_end_day = 0;
        }
        break;
      // 预约时间
      case bucket + '_appointment_time':
        originStatus.appointment_time = status[key];
        break;
      // 一键同步
      case bucket + '_cycle_sync':
        originStatus.cycle_sync = status[key];
        if (originStatus.cycle_sync.constructor !== Array) {
          originStatus.cycle_sync = [];
        }
        break;
      // 洗涤剂、柔顺剂、浓度
      case 'db_detergent_density':
        originStatus.detergent_density = status[key];
        break;
      case 'db_softener_density':
        originStatus.softener_density = status[key];
        break;
      case 'db_detergent_all':
        originStatus.detergent_global = status[key];
        break;
      case 'db_softener_all':
        originStatus.softener_global = status[key];
        break;
      // 程序排序记忆开关
      case 'db_cycle_sort_memory':
        originStatus.db_cycle_sort_memory = status[key];
        break;
      // 洗干联动开关
      case 'db_wash_dry_link':
        originStatus.db_wash_dry_link = status[key];
        break;
      // lua版本号
      case 'version':
        originStatus.version = status[key];
        break;
      // 错误码
      case bucket + '_error_code':
        originStatus.fault_warn = status[key].toString(16).toUpperCase();
        if (bucket !== 'da') {
          if (parseInt(status[key]) !== 0) {
            originStatus.fault_warn = 'E' + originStatus.fault_warn;
          }
        }
        break;
      // db程序
      case 'db_program':
        if (bucket === 'db') {
          originStatus.wash_mode = convertD9ProgramToWashModeDB(status[key]);
        }
        break;
      // dc程序
      case 'dc_program':
        if (bucket === 'dc') {
          originStatus.wash_mode = convertD9ProgramToWashModeDC(status[key]);
        }
        break;
      // da程序
      case 'da_program':
        if (bucket === 'da') {
          originStatus.wash_mode = convertD9ProgramToWashModeDA(status[key]);
        }
        break;
      case 'db_progress':
        if (bucket === 'db') {
          originStatus.progress = status[key];
        }
        break;
      case 'da_progress':
        if (bucket === 'da') {
          originStatus.progress = status[key];
        }
        break;
      case 'dc_progress':
        if (bucket === 'dc') {
          originStatus.progress = status[key];
        }
        break;
      // db运行状态
      case 'db_running_status':
        if (bucket === 'db') {
          if (status.db_power === 'on') {
            switch (status.db_running_status) {
              case 'off':
              case 'standby':
                if (status.db_power === 'off') {
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
              case 'delay':
                originStatus.status = 6;
                originStatus.wash = 1;
                originStatus.appointment_wash = 1;
                break;
              case 'start':
                originStatus.wash = 1;
                switch (status.db_progress.toString()) {
                  case '1': //BIT0
                    originStatus.status = 7;
                    break;
                  case '2': //BIT1
                    originStatus.status = 5;
                    break;
                  case '4': //BIT2
                    originStatus.status = 4;
                    break;
                  case '8': //BIT3
                    originStatus.status = 3;
                    break;
                  case '16': //BIT4
                    originStatus.status = 12;
                    break;
                  case '32': //BIT5
                    originStatus.status = 2;
                    break;
                  case '64': //BIT6
                    originStatus.status = 13;
                    break;
                  case '128': //BIT7(洗衣房专用)
                    // originStatus.status = ;
                    break;
                  case '512': //水硬度检测中
                    originStatus.status = 17;
                    break;
                  case '768': //织物感知中
                    originStatus.status = 18;
                    break;
                  case '1024': //自动投放中
                    originStatus.status = 19;
                    break;
                  case '1032': //预洗过程中投放洗涤剂(2字节，0x08,0x04)
                    originStatus.status = 24;
                    break;
                  case '1028': //洗涤过程中投放洗涤剂(2字节，0x04,0x04)
                    originStatus.status = 25;
                    break;
                  case '1026': //漂洗过程中投放柔顺剂(2字节，0x02,0x04)
                    originStatus.status = 26;
                    break;
                  case '1288': //预洗过程根据当地水质进行洗涤剂投放(2字节，0x08,0x05)
                    originStatus.status = 27;
                    break;
                  case '1284': //洗涤过程根据当地水质进行洗涤剂投放(2字节，0x04,0x05)
                    originStatus.status = 28;
                    break;
                  case '1282': //漂洗过程根据当地水质进行柔顺剂投放(2字节，0x02,0x05)
                    originStatus.status = 29;
                    break;
                  default:
                    break;
                }
                break;
            }
          }
        }
        break;
      // dc运行状态
      case 'dc_running_status':
        if (bucket === 'dc') {
          if (status.dc_power === 'on') {
            switch (status.dc_running_status) {
              case 'standby':
              case 'delay_choose':
                if (status.dc_power === 'off') {
                  originStatus.status = 9;
                } else {
                  originStatus.status = 1;
                }
                originStatus.wash = 0;
                break;
              case 'delay_pause':
                originStatus.status = 92;
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
                if (status.dc_dry_status === 'preventwrinkling') {
                  originStatus.status = 29;
                  originStatus.wash = 0;
                } else if (status.dc_dry_status === 'dampproofing') {
                  originStatus.status = 30;
                  originStatus.wash = 0;
                }
                break;
              case 'end_prevent_wrinkle':
                originStatus.status = 8;
                originStatus.wash = 0;
                break;
              case 'delay_choosing':
                originStatus.status = 1;
                originStatus.wash = 0;
                break;
              case 'delay':
                originStatus.status = 6;
                originStatus.wash = 1;
                originStatus.appointment_wash = 1;
                break;
              case 'start':
                originStatus.wash = 1;
                switch (status.dc_dry_status) {
                  case 'heating':
                    originStatus.status = 14;
                    break;
                  case 'ironing':
                    originStatus.status = 15;
                    break;
                  case 'cooling':
                    originStatus.status = 16;
                    break;
                  case 'ending':
                    originStatus.status = 90;
                    break;
                  case 'preventwrinkling':
                    originStatus.status = 20;
                    break;
                  case 'sterilizing':
                    originStatus.status = 21;
                    break;
                  case 'steamironing':
                    originStatus.status = 22;
                    break;
                  default:
                    break;
                }
                break;
            }
          }
        }
        break;
      // da运行状态
      case 'da_running_status':
        if (bucket === 'da') {
          if (status.da_power === 'on') {
            switch (status.da_running_status) {
              case 'standby':
                if (status.da_power === 'off') {
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
              case 'delay':
                originStatus.status = 6;
                originStatus.wash = 1;
                originStatus.appointment_wash = 1;
                break;
              case 'start':
                originStatus.wash = 1;
                switch (status.da_progress.toString()) {
                  case '1': //BIT0
                    originStatus.status = 7;
                    break;
                  case '2': //BIT1
                    originStatus.status = 5;
                    break;
                  case '4': //BIT2
                    originStatus.status = 4;
                    break;
                  case '8': //BIT3
                    originStatus.status = 2;
                    break;
                  case '16': //BIT4
                    originStatus.status = 11;
                    break;
                  case '32': //BIT5
                    originStatus.status = 10;
                    break;
                  default:
                    break;
                }
                break;
            }
          }
        }
        break;
    }
  }
  return originStatus;
};
