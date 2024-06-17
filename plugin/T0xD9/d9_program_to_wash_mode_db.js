export default (program) => {
  let wash_mode;
  switch (program) {
    case 'cotton':
      wash_mode = 0x00;
      break;
    case 'eco':
      wash_mode = 0x01;
      break;
    case 'fast_wash':
      wash_mode = 0x02;
      break;
    case 'mixed_wash':
      wash_mode = 0x03;
      break;
    case 'fiber':
      wash_mode = 0x04;
      break;
    case 'wool':
      wash_mode = 0x05;
      break;
    case 'enzyme':
      wash_mode = 0x06;
      break;
    case 'ssp':
      wash_mode = 0x07;
      break;
    case 'sport_clothes':
      wash_mode = 0x08;
      break;
    case 'single_dehytration':
      wash_mode = 0x09;
      break;
    case 'rinsing_dehydration':
      wash_mode = 0x0a;
      break;
    case 'big':
      wash_mode = 0x0b;
      break;
    case 'baby_clothes':
      wash_mode = 0x0c;
      break;
    case 'underwear':
      wash_mode = 0x0d;
      break;
    case 'outdoor':
      wash_mode = 0x0e;
      break;
    case 'down_jacket':
      wash_mode = 0x0f;
      break;
    case 'color':
      wash_mode = 0x10;
      break;
    case 'intelligent':
      wash_mode = 0x11;
      break;
    case 'quick_wash':
      wash_mode = 0x12;
      break;
    case 'kids':
      wash_mode = 0x13;
      break;
    case 'water_baby_clothes':
      wash_mode = 0x14;
      break;
    case 'air_wash':
      wash_mode = 0x15;
      break;
    case 'single_drying':
      wash_mode = 0x16;
      break;
    case 'fast_wash_30':
      wash_mode = 0x17;
      break;
    case 'water_shirt':
      wash_mode = 0x18;
      break;
    case 'water_intelligent':
      wash_mode = 0x19;
      break;
    case 'water_steep':
      wash_mode = 0x1a;
      break;
    case 'water_fast_wash_30':
      wash_mode = 0x1b;
      break;
    case 'shirt':
      wash_mode = 0x1c;
      break;
    case 'steep':
      wash_mode = 0x1d;
      break;
    case 'new_water_cotton':
      wash_mode = 0x1e;
      break;
    case 'water_mixed_wash':
      wash_mode = 0x1f;
      break;
    case 'water_fiber':
      wash_mode = 0x20;
      break;
    case 'water_kids':
      wash_mode = 0x21;
      break;
    case 'water_underwear':
      wash_mode = 0x22;
      break;
    case 'specialist':
      wash_mode = 0x23;
      break;
    case 'water_eco':
      wash_mode = 0x24;
      break;
    case 'wash_drying_60':
      wash_mode = 0x25;
      break;
    case 'self_wash_5':
      wash_mode = 0x26;
      break;
    case 'fast_wash_min':
      wash_mode = 0x27;
      break;
    case 'mixed_wash_min':
      wash_mode = 0x28;
      break;
    case 'dehydration_min':
      wash_mode = 0x29;
      break;
    case 'self_wash_min':
      wash_mode = 0x2a;
      break;
    case 'baby_clothes_min':
      wash_mode = 0x2b;
      break;
    case 'prevent_allergy':
      wash_mode = 0x2c;
      break;
    case 'cold_wash':
      wash_mode = 0x2d;
      break;
    case 'soft_wash':
      wash_mode = 0x2e;
      break;
    case 'remove_mite_wash':
      wash_mode = 0x2f;
      break;
    case 'water_intense_wash':
      wash_mode = 0x30;
      break;
    case 'fast_dry':
      wash_mode = 0x31;
      break;
    case 'water_outdoor':
      wash_mode = 0x32;
      break;
    case 'spring_autumn_wash':
      wash_mode = 0x33;
      break;
    case 'summer_wash':
      wash_mode = 0x34;
      break;
    case 'winter_wash':
      wash_mode = 0x35;
      break;
    case 'jean':
      wash_mode = 0x36;
      break;
    case 'new_clothes_wash':
      wash_mode = 0x37;
      break;
    case 'silk':
      wash_mode = 0x38;
      break;
    case 'insight_wash':
      wash_mode = 0x39;
      break;
    case 'fitness_clothes':
      wash_mode = 0x3a;
      break;
    case 'mink':
      wash_mode = 0x3b;
      break;
    case 'fresh_air':
      wash_mode = 0x3c;
      break;
    case 'bucket_dry':
      wash_mode = 0x3d;
      break;
    case 'jacket':
      wash_mode = 0x3e;
      break;
    case 'bath_towel':
      wash_mode = 0x3f;
      break;
    case 'night_fresh_wash':
      wash_mode = 0x40;
      break;
    case 'degerm':
      wash_mode = 0x41;
      break;
    case 'heart_wash':
      wash_mode = 0x60;
      break;
    case 'water_cold_wash':
      wash_mode = 0x61;
      break;
    case 'water_prevent_allergy':
      wash_mode = 0x62;
      break;
    case 'water_remove_mite_wash':
      wash_mode = 0x63;
      break;
    case 'water_ssp':
      wash_mode = 0x64;
      break;
    case 'silk_wash':
      wash_mode = 0x65;
      break;
    case 'standard':
      wash_mode = 0x66;
      break;
    case 'green_wool':
      wash_mode = 0x67;
      break;
    case 'cook_wash':
      wash_mode = 0x68;
      break;
    case 'fresh_remove_wrinkle':
      wash_mode = 0x69;
      break;
    case 'steam_sterilize_wash':
      wash_mode = 0x6a;
      break;
    case 'sterilize_wash':
      wash_mode = 0x70;
      break;
    case 'white_clothes_clean':
      wash_mode = 0x81;
      break;
    case 'clean_stains':
      wash_mode = 0x82;
      break;
    case 'prevent_cross_color':
      wash_mode = 0x83;
      break;
    case 'quick_dry_clothes':
      wash_mode = 0x84;
      break;
    case 'yoga_clothes':
      wash_mode = 0x85;
      break;
    case 'love':
      wash_mode = 0xfe;
      break;
    default:
      wash_mode = program;
      break;
  }
  return wash_mode;
};
