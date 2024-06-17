export default (program) => {
  let wash_mode;
  switch (program) {
    case 'standard':
      wash_mode = 0x00;
      break;
    case 'fast':
      wash_mode = 0x01;
      break;
    case 'blanket':
      wash_mode = 0x02;
      break;
    case 'wool':
      wash_mode = 0x03;
      break;
    case 'embathe':
      wash_mode = 0x04;
      break;
    case 'memory':
      wash_mode = 0x05;
      break;
    case 'child':
      wash_mode = 0x06;
      break;
    case 'strong_wash':
      wash_mode = 0x07;
      break;
    case 'down_jacket':
      wash_mode = 0x08;
      break;
    case 'stir':
      wash_mode = 0x09;
      break;
    case 'mute':
      wash_mode = 0x0A;
      break;
    case 'bucket_self_clean':
      wash_mode = 0x0B;
      break;
    case 'air_dry':
      wash_mode = 0x0C;
      break;
    case 'cycle':
      wash_mode = 0x0D;
      break;
    case 'remain_water':
      wash_mode = 0x10;
      break;
    case 'summer':
      wash_mode = 0x11;
      break;
    case 'big':
      wash_mode = 0x12;
      break;
    case 'home':
      wash_mode = 0x13;
      break;
    case 'cowboy':
      wash_mode = 0x14;
      break;
    case 'soft':
      wash_mode = 0x15;
      break;
    case 'hand_wash':
      wash_mode = 0x16;
      break;
    case 'water_flow':
      wash_mode = 0x17;
      break;
    case 'fog':
      wash_mode = 0x18;
      break;
    case 'bucket_dry':
      wash_mode = 0x19;
      break;
    case 'fast_clean_wash':
      wash_mode = 0x1A;
      break;
    case 'dehydration':
      wash_mode = 0x1B;
      break;
    case 'under_wear':
      wash_mode = 0x1C;
      break;
    case 'rinse_dehydration':
      wash_mode = 0x1D;
      break;
    case 'one_minute_self_clean':
      wash_mode = 0x1E;
      break;
    case 'degerm':
      wash_mode = 0x1F;
      break;
    case 'in_15':
      wash_mode = 0x20;
      break;
    case 'in_25':
      wash_mode = 0x21;
      break;
    case 'love_baby':
      wash_mode = 0x22;
      break;
    case 'outdoor':
      wash_mode = 0x23;
      break;
    case 'silk':
      wash_mode = 0x24;
      break;
    case 'shirt':
      wash_mode = 0x25;
      break;
    case 'cook_wash':
      wash_mode = 0x26;
      break;
    case 'towel':
      wash_mode = 0x27;
      break;
    default:
      wash_mode = program;
      break;
  }
  return wash_mode;
};
