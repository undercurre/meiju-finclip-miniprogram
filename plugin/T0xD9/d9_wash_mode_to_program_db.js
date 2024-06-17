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
      program = 'eco';
      break;
    case 0x02:
      program = 'fast_wash';
      break;
    case 0x03:
      program = 'mixed_wash';
      break;
    case 0x04:
      program = 'fiber';
      break;
    case 0x05:
      program = 'wool';
      break;
    case 0x06:
      program = 'enzyme';
      break;
    case 0x07:
      program = 'ssp';
      break;
    case 0x08:
      program = 'sport_clothes';
      break;
    case 0x09:
      program = 'single_dehytration';
      break;
    case 0x0a:
      program = 'rinsing_dehydration';
      break;
    case 0x0b:
      program = 'big';
      break;
    case 0x0c:
      program = 'baby_clothes';
      break;
    case 0x0d:
      program = 'underwear';
      break;
    case 0x0e:
      program = 'outdoor';
      break;
    case 0x0f:
      program = 'down_jacket';
      break;
    case 0x10:
      program = 'color';
      break;
    case 0x11:
      program = 'intelligent';
      break;
    case 0x12:
      program = 'quick_wash';
      break;
    case 0x13:
      program = 'kids';
      break;
    case 0x14:
      program = 'water_baby_clothes';
      break;
    case 0x15:
      program = 'air_wash';
      break;
    case 0x16:
      program = 'single_drying';
      break;
    case 0x17:
      program = 'fast_wash_30';
      break;
    case 0x18:
      program = 'water_shirt';
      break;
    case 0x19:
      program = 'water_intelligent';
      break;
    case 0x1a:
      program = 'water_steep';
      break;
    case 0x1b:
      program = 'water_fast_wash_30';
      break;
    case 0x1c:
      program = 'shirt';
      break;
    case 0x1d:
      program = 'steep';
      break;
    case 0x1e:
      program = 'new_water_cotton';
      break;
    case 0x1f:
      program = 'water_mixed_wash';
      break;
    case 0x20:
      program = 'water_fiber';
      break;
    case 0x21:
      program = 'water_kids';
      break;
    case 0x22:
      program = 'water_underwear';
      break;
    case 0x23:
      program = 'specialist';
      break;
    case 0x24:
      program = 'water_eco';
      break;
    case 0x25:
      program = 'wash_drying_60';
      break;
    case 0x26:
      program = 'self_wash_5';
      break;
    case 0x27:
      program = 'fast_wash_min';
      break;
    case 0x28:
      program = 'mixed_wash_min';
      break;
    case 0x29:
      program = 'dehydration_min';
      break;
    case 0x2a:
      program = 'self_wash_min';
      break;
    case 0x2b:
      program = 'baby_clothes_min';
      break;
    case 0x2c:
      program = 'prevent_allergy';
      break;
    case 0x2d:
      program = 'cold_wash';
      break;
    case 0x2e:
      program = 'soft_wash';
      break;
    case 0x2f:
      program = 'remove_mite_wash';
      break;
    case 0x30:
      program = 'water_intense_wash';
      break;
    case 0x31:
      program = 'fast_dry';
      break;
    case 0x32:
      program = 'water_outdoor';
      break;
    case 0x33:
      program = 'spring_autumn_wash';
      break;
    case 0x34:
      program = 'summer_wash';
      break;
    case 0x35:
      program = 'winter_wash';
      break;
    case 0x36:
      program = 'jean';
      break;
    case 0x37:
      program = 'new_clothes_wash';
      break;
    case 0x38:
      program = 'silk';
      break;
    case 0x39:
      program = 'insight_wash';
      break;
    case 0x3a:
      program = 'fitness_clothes';
      break;
    case 0x3b:
      program = 'mink';
      break;
    case 0x3c:
      program = 'fresh_air';
      break;
    case 0x3d:
      program = 'bucket_dry';
      break;
    case 0x3e:
      program = 'jacket';
      break;
    case 0x3f:
      program = 'bath_towel';
      break;
    case 0x40:
      program = 'night_fresh_wash';
      break;
    case 0x41:
      program = 'degerm';
      break;
    case 0x60:
      program = 'heart_wash';
      break;
    case 0x61:
      program = 'water_cold_wash';
      break;
    case 0x62:
      program = 'water_prevent_allergy';
      break;
    case 0x63:
      program = 'water_remove_mite_wash';
      break;
    case 0x64:
      program = 'water_ssp';
      break;
    case 0x65:
      program = 'silk_wash';
      break;
    case 0x66:
      program = 'standard';
      break;
    case 0x67:
      program = 'green_wool';
      break;
    case 0x68:
      program = 'cook_wash';
      break;
    case 0x69:
      program = 'fresh_remove_wrinkle';
      break;
    case 0x6a:
      program = 'steam_sterilize_wash';
      break;
    case 0x70:
      program = 'sterilize_wash';
      break;
    case 0x81:
      program = 'white_clothes_clean';
      break;
    case 0x82:
      program = 'clean_stains';
      break;
    case 0x83:
      program = 'prevent_cross_color';
      break;
    case 0x84:
      program = 'quick_dry_clothes';
      break;
    case 0x85:
      program = 'yoga_clothes';
      break;
    case 0xfe:
      program = 'love';
      break;
    default:
      program = status.wash_mode;
      break;
  }
  return program;
};
