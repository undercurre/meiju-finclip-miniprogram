export default (status) => {
  if (!status) {
    return '';
  }

  let program = '';
  switch (status.wash_mode) {
    case 0x00:
      program = 'cotton';
      break;
    case 0x01:
      program = 'fiber';
      break;
    case 0x02:
      program = 'mixed_wash';
      break;
    case 0x03:
      program = 'jean';
      break;
    case 0x04:
      program = 'bedsheet';
      break;
    case 0x05:
      program = 'outdoor';
      break;
    case 0x06:
      program = 'down_jacket';
      break;
    case 0x07:
      program = 'plush';
      break;
    case 0x08:
      program = 'wool';
      break;
    case 0x09:
      program = 'dehumidify';
      break;
    case 0x0a:
      program = 'cold_air_fresh_air';
      break;
    case 0x0b:
      program = 'hot_air_dry';
      break;
    case 0x0c:
      program = 'sport_clothes';
      break;
    case 0x0d:
      program = 'underwear';
      break;
    case 0x0e:
      program = 'baby_clothes';
      break;
    case 0x0f:
      program = 'shirt';
      break;
    case 0x10:
      program = 'standard';
      break;
    case 0x11:
      program = 'quick_dry';
      break;
    case 0x12:
      program = 'fresh_air';
      break;
    case 0x13:
      program = 'low_temp_dry';
      break;
    case 0x14:
      program = 'eco_dry';
      break;
    case 0x17:
      program = 'intelligent_dry';
      break;
    case 0x18:
      program = 'steam_care';
      break;
    case 0x19:
      program = 'big';
      break;
    case 0x1a:
      program = 'fixed_time_dry';
      break;
    case 0x1b:
      program = 'night_dry';
      break;
    case 0x1c:
      program = 'bracket_dry';
      break;
    case 0x1d:
      program = 'western_trouser';
      break;
    case 0x1e:
      program = 'dehumidification';
      break;
    case 0x1f:
      program = 'silk';
      break;
    case 0x20:
      program = 'bucket_self_clean';
      break;
    case 0x21:
      program = 'ion_degerm';
      break;
    case 0x22:
      program = 'ai_intelligent_dry';
      break;
    case 0x23:
      program = 'small';
      break;
    case 0x24:
      program = 'jacket';
      break;
    case 0x25:
      program = 'air_wash';
      break;
    case 0x26:
      program = 'towel';
      break;
    case 0x27:
      program = 'four_piece_suit';
      break;
    case 0x28:
      program = 'light_dry';
      break;
    case 0x29:
      program = 'degerm';
      break;
    case 0x30:
      program = 'wool_care';
      break;
    case 0x31:
      program = 'sun_quilt';
      break;
    case 0x32:
      program = 'uniforms';
      break;
    default:
      program = status.wash_mode;
      break;
  }
  return program;
};
