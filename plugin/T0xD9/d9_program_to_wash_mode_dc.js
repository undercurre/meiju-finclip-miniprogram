export default (program) => {
  let wash_mode;
  switch (program) {
    case 'cotton':
      wash_mode = 0x00;
      break;
    case 'fiber':
      wash_mode = 0x01;
      break;
    case 'mixed_wash':
      wash_mode = 0x02;
      break;
    case 'jean':
      wash_mode = 0x03;
      break;
    case 'bedsheet':
      wash_mode = 0x04;
      break;
    case 'outdoor':
      wash_mode = 0x05;
      break;
    case 'down_jacket':
      wash_mode = 0x06;
      break;
    case 'plush':
      wash_mode = 0x07;
      break;
    case 'wool':
      wash_mode = 0x08;
      break;
    case 'dehumidify':
      wash_mode = 0x09;
      break;
    case 'cold_air_fresh_air':
      wash_mode = 0x0a;
      break;
    case 'hot_air_dry':
      wash_mode = 0x0b;
      break;
    case 'sport_clothes':
      wash_mode = 0x0c;
      break;
    case 'underwear':
      wash_mode = 0x0d;
      break;
    case 'baby_clothes':
      wash_mode = 0x0e;
      break;
    case 'shirt':
      wash_mode = 0x0f;
      break;
    case 'standard':
      wash_mode = 0x10;
      break;
    case 'quick_dry':
      wash_mode = 0x11;
      break;
    case 'fresh_air':
      wash_mode = 0x12;
      break;
    case 'low_temp_dry':
      wash_mode = 0x13;
      break;
    case 'eco_dry':
      wash_mode = 0x14;
      break;
    case 'intelligent_dry':
      wash_mode = 0x17;
      break;
    case 'steam_care':
      wash_mode = 0x18;
      break;
    case 'big':
      wash_mode = 0x19;
      break;
    case 'fixed_time_dry':
      wash_mode = 0x1a;
      break;
    case 'night_dry':
      wash_mode = 0x1b;
      break;
    case 'bracket_dry':
      wash_mode = 0x1c;
      break;
    case 'western_trouser':
      wash_mode = 0x1d;
      break;
    case 'dehumidification':
      wash_mode = 0x1e;
      break;
    case 'silk':
      wash_mode = 0x1f;
      break;
    case 'bucket_self_clean':
      wash_mode = 0x20;
      break;
    case 'ion_degerm':
      wash_mode = 0x21;
      break;
    case 'ai_intelligent_dry':
      wash_mode = 0x22;
      break;
    case 'small':
      wash_mode = 0x23;
      break;
    case 'jacket':
      wash_mode = 0x24;
      break;
    case 'air_wash':
      wash_mode = 0x25;
      break;
    case 'towel':
      wash_mode = 0x26;
      break;
    case 'four_piece_suit':
      wash_mode = 0x27;
      break;
    case 'light_dry':
      wash_mode = 0x28;
      break;
    case 'degerm':
      wash_mode = 0x29;
      break;
    case 'wool_care':
      wash_mode = 0x30;
      break;
    case 'sun_quilt':
      wash_mode = 0x31;
      break;
    case 'uniforms':
      wash_mode = 0x32;
      break;
    default:
      wash_mode = program;
      break;
  }
  return wash_mode;
};
