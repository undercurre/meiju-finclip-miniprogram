import convertD9WashModeToProgramDB from './d9_wash_mode_to_program_db';
import convertD9WashModeToProgramDC from './d9_wash_mode_to_program_dc';
import convertD9WashModeToProgramDA from './d9_wash_mode_to_program_da';

export default (status, deviceConfig) => {
  let convertStatus = {};
  let bucket = status.bucket;
  console.log('原始下发状态：' + JSON.stringify(status));
  for (let key in status) {
    switch (key) {
      // 开关机
      case 'switch':
        convertStatus[bucket + '_power'] = status[key] === 1 ? 'on' : 'off';
        break;
      // 是否合并
      case 'merge':
        convertStatus.merge = status[key];
        break;
      // 切换上下筒
      case 'position':
        convertStatus[bucket + '_position'] = 1;
        break;
      // 启动暂停
      case 'wash':
        convertStatus[bucket + '_control_status'] = status[key] === 1 ? 'start' : 'pause';
        break;
      // 预约/取消预约
      case 'appointment':
        if (bucket === 'da') {
          convertStatus.da_appointment_status = status[key] === 'on' ? 1 : 0;
        } else {
          convertStatus[bucket + '_appointment'] = status[key] === 'on' ? 1 : 0;
        }
        break;
      // AI
      case 'ai':
        convertStatus[bucket + '_ai'] = status[key];
        break;
      // 自定义、dc云程序投屏
      case 'custom_cycle':
      case 'customize_machine_cycle':
        if (bucket === 'dc') { 
          convertStatus[bucket + '_customize_machine_cycle'] = status[key];
        } else if (bucket === 'db') {
          convertStatus[bucket + '_custom_cycle'] = status[key];
        }
        break;
      // 预约时间
      case 'appointment_time':
        convertStatus[bucket + '_appointment_time'] = status[key];
        break;
      // 童锁
      case 'baby_lock':
        convertStatus[bucket + '_baby_lock'] = status[key];
        break;
      // 轻松熨
      case 'easy_ironing':
        convertStatus[bucket + '_easy_ironing'] = status[key];
        break;
      // 加速洗
      case 'speedy':
        convertStatus[bucket + '_speedy_wash'] = status[key];
        break;
      // 蒸汽洗
      case 'steam_wash':
        convertStatus[bucket + '_steam_wash'] = status[key];
        break;
      // 夜间洗
      case 'nightly':
        convertStatus[bucket + '_nightly_wash'] = status[key];
        break;
      // 雾态洗
      case 'spray_wash':
        convertStatus[bucket + '_spray_wash'] = status[key];
        break;
      // 浸泡洗
      case 'soak_wash':
        convertStatus[bucket + '_soak_wash'] = status[key];
        break;
      // 加强洗
      case 'strong_wash':
        convertStatus[bucket + '_strong_wash'] = status[key];
        break;
      // 紫外除菌
      case 'ultraviolet_lamp':
        convertStatus.db_sterilize = status[key];
        break;
      // 特渍洗
      case 'stains':
        convertStatus[bucket + '_stains_wash'] = status[key];
        break;
      // 水质联动开关
      case 'water_quality_link':
        convertStatus.db_water_quality_link = status[key];
        break;
      case 'temperature':
        convertStatus[bucket + '_temperature'] = status[key];
        break;
      // 烘干(只有db有烘干)
      case 'dryer':
        convertStatus.db_dry = status[key];
        break;
      // db快净
      case 'fast_clean_wash':
        convertStatus[bucket + '_fast_clean_wash'] = status[key];
        break;
      // 洗涤剂
      case 'detergent':
        convertStatus[bucket + '_detergent'] = status[key];
        break;
      // 柔顺剂
      case 'softener':
        convertStatus[bucket + '_softener'] = status[key];
        break;
      // 洗涤时间
      case 'wash_time':
        convertStatus[bucket + '_wash_time'] = status[key];
        break;
      // 脱水时间
      case 'spin_time':
        convertStatus[bucket + '_dehydration_time'] = status[key];
        break;
      // 漂洗次数
      case 'rinse':
        convertStatus[bucket + '_rinse_count'] = status[key];
        break;
      // 水位
      case 'water_level':
      case 'wash_waterlevel':
        convertStatus[bucket + '_water_level'] = status[key];
        break;
      // 脱水速度
      case 'dewatering_speed':
        if (bucket === 'db') {
          convertStatus.db_dehydration_speed = status[key];
        }
        break;
      // dc定时(烘干时间)
      case 'dry_time_new':
        convertStatus.dc_dry_time = status[key];
        break;
      // dc烘干程度
      case 'dry_level':
        convertStatus.dc_intensity = status[key];
        break;
      // dc蒸汽档位
      case 'steam_level':
        convertStatus.dc_steam = status[key];
        break;
      // dc除菌
      case 'sterilize':
        convertStatus.dc_sterilize = status[key];
        break;
      // dc防皱
      case 'crease_resist':
        convertStatus.dc_prevent_wrinkle = status[key];
        break;
      // dc轻干洗材质
      case 'texture':
        convertStatus.dc_material = status[key];
        break;
      case 'smell':
        convertStatus.dc_smell = status[key];
        break;
      case 'smell_time':
        convertStatus.dc_smell_time = status[key];
        break;
      // 空气洗材质
      case 'material':
        convertStatus[bucket + '_material'] = status[key];
        break;
        //  dc温度档位
      case 'temperature_level':
        convertStatus.dc_temperature_level = status[key];
        break;
      // dc多维除菌
      case 'multidimensional_sterilize':
        convertStatus.dc_multidimensional_sterilize = status[key];
        break;
      // dc智能防潮
      case 'intelligent_prevent_damp':
        convertStatus.dc_intelligent_dampproof = status[key];
        break;
      // 一键同步
      case 'cycle_sync':
        convertStatus[bucket + '_cycle_sync'] = status[key];
        break;
      // 洗涤剂、柔顺剂、浓度
      case 'detergent_density':
        convertStatus.db_detergent_density = status[key];
        break;
      case 'softener_density':
        convertStatus.db_softener_density = status[key];
        break;
      case 'detergent_global':
        convertStatus.db_detergent_all = status[key];
        break;
      case 'softener_global':
        convertStatus.db_softener_all = status[key];
        break;
      // 程序排序记忆开关
      case 'db_cycle_sort_memory':
        convertStatus.db_cycle_sort_memory = status[key];
        break;
      // 洗干联动开关
      case 'db_wash_dry_link':
        convertStatus.db_wash_dry_link = status[key];
        break;
      // 程序
      case 'wash_mode':
        if (bucket === 'db') {
          convertStatus.db_program = convertD9WashModeToProgramDB(status);
        } else if (bucket === 'dc') {
          convertStatus.dc_program = convertD9WashModeToProgramDC(status);
        } else if (bucket === 'da') {
          convertStatus.da_program = convertD9WashModeToProgramDA(status);
        }
        break;
      default:
        break;
    }
  }
  return convertStatus;
};
