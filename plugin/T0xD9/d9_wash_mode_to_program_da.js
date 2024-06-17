export default (status) => {
  if (!status) {
    return '';
  }

  let program = '';
  switch (status.wash_mode) {
    case 0x00:
      program = 'standard';
      break;
    case 0x01:
      program = 'fast';
      break;
    case 0x02:
      program = 'blanket';
      break;
    case 0x03:
      program = 'wool';
      break;
    case 0x04:
      program = 'embathe';
      break;
    case 0x05:
      program = 'memory';
      break;
    case 0x06:
      program = 'child';
      break;
    case 0x07:
      program = 'strong_wash';
      break;
    case 0x08:
      program = 'down_jacket';
      break;
    case 0x09:
      program = 'stir';
      break;
    case 0x0a:
      program = 'mute';
      break;
    case 0x0b:
      program = 'bucket_self_clean';
      break;
    case 0x0c:
      program = 'air_dry';
      break;
    case 0x0d:
      program = 'cycle';
      break;
    case 0x10:
      program = 'remain_water';
      break;
    case 0x11:
      program = 'summer';
      break;
    case 0x12:
      program = 'big';
      break;
    case 0x13:
      program = 'home';
      break;
    case 0x14:
      program = 'cowboy';
      break;
    case 0x15:
      program = 'soft';
      break;
    case 0x16:
      program = 'hand_wash';
      break;
    case 0x17:
      program = 'water_flow';
      break;
    case 0x18:
      program = 'fog';
      break;
    case 0x19:
      program = 'bucket_dry';
      break;
    case 0x1a:
      program = 'fast_clean_wash';
      break;
    case 0x1b:
      program = 'dehydration';
      break;
    case 0x1c:
      program = 'under_wear';
      break;
    case 0x1d:
      program = 'rinse_dehydration';
      break;
    case 0x1e:
      program = 'one_minute_self_clean';
      break;
    case 0x1f:
      program = 'degerm';
      break;
    case 0x20:
      program = 'in_15';
      break;
    case 0x21:
      program = 'in_25';
      break;
    case 0x22:
      program = 'love_baby';
      break;
    case 0x23:
      program = 'outdoor';
      break;
    case 0x24:
      program = 'silk';
      break;
    case 0x25:
      program = 'shirt';
      break;
    case 0x26:
      program = 'cook_wash';
      break;
    case 0x27:
      program = 'towel';
      break;
    default:
      program = status.wash_mode;
      break;
  }
  return program;
};
