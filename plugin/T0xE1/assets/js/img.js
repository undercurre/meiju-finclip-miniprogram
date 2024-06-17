import { imageApi, imgBaseUrl } from '../../../../api'
const pre = imageApi.getImagePath.url + '/0xE1/'
const new_pre = imgBaseUrl.url + '/plugin/0xE1/'
const imgs = {
  header: 'Dishwasher.png',
  triangle: 'grey-triangle.png',

  lock_on: 'lock-on.png',
  lock_off: 'lock-off.png',
  power_on: 'power_on.png',
  power_off: 'power_off.png',
  order_on: 'order_on.png',
  order_off: 'order_off.png',
  run_on: 'run_on.png',
  run_off: 'run_off.png',
  stop: 'running-stop.png',
  start: 'running-continue.png',
  pause: 'running-pause.png',

  // modes:
  auto_wash_on: 'auto_wash_on.png',
  auto_wash_off: 'auto_wash_off.png',
  auto_wash_sub_on: 'auto_wash_sub_on.png',
  auto_wash_sub_off: 'auto_wash_sub_off.png',

  strong_wash_on: 'strong_wash_on.png',
  strong_wash_off: 'strong_wash_off.png',
  strong_wash_sub_on: 'strong_wash_sub_on.png',
  strong_wash_sub_off: 'strong_wash_sub_off.png',

  standard_wash_on: 'standard_wash_on.png',
  standard_wash_off: 'standard_wash_off.png',
  standard_wash_sub_on: 'standard_wash_sub_on.png',
  standard_wash_sub_off: 'standard_wash_sub_off.png',

  eco_wash_on: 'eco_wash_on.png',
  eco_wash_off: 'eco_wash_off.png',
  eco_wash_sub_on: 'eco_wash_sub_on.png',
  eco_wash_sub_off: 'eco_wash_sub_off.png',

  glass_wash_on: 'glass_wash_on.png',
  glass_wash_off: 'glass_wash_off.png',
  glass_wash_sub_on: 'glass_wash_sub_on.png',
  glass_wash_sub_off: 'glass_wash_sub_off.png',

  fast_wash_on: 'fast_wash_on.png',
  fast_wash_off: 'fast_wash_off.png',
  fast_wash_sub_on: 'fast_wash_sub_on.png',
  fast_wash_sub_off: 'fast_wash_sub_off.png',

  soak_wash_on: 'soak_wash_on.png',
  soak_wash_off: 'soak_wash_off.png',
  soak_wash_sub_on: 'soak_wash_sub_on.png',
  soak_wash_sub_off: 'soak_wash_sub_off.png',

  '90min_wash_on': '90min_wash_on.png',
  '90min_wash_off': '90min_wash_off.png',
  '90min_wash_sub_on': '90min_wash_sub_on.png',
  '90min_wash_sub_off': '90min_wash_sub_off.png',

  self_clean_on: 'self_clean_on.png',
  self_clean_off: 'self_clean_off.png',
  self_clean_sub_on: 'self_clean_sub_on.png',
  self_clean_sub_off: 'self_clean_sub_off.png',

  fruit_wash_on: 'fruit_wash_on.png',
  fruit_wash_off: 'fruit_wash_off.png',
  fruit_wash_sub_on: 'fruit_wash_sub_on.png',
  fruit_wash_sub_off: 'fruit_wash_sub_off.png',

  diy_on: 'diy_on.png',
  diy_off: 'diy_off.png',
  diy_sub_on: 'diy_sub_on.png',
  diy_sub_off: 'diy_sub_off.png',
}
const new_imgs = {
  quietnight_off: 'quietnight_off.png',
  quietnight_on: 'quietnight_on.png',
  quietnight_sub_off: 'quietnight_sub_off.png',
  quietnight_sub_on: 'quietnight_sub_on.png',

  hotpot_off: 'hotpot_off.png',
  hotpot_on: 'hotpot_on.png',
  hotpot_sub_off: 'hotpot_sub_off.png',
  hotpot_sub_on: 'hotpot_sub_on.png',

  germ_off: 'germ_off.png',
  germ_on: 'germ_on.png',
  germ_sub_off: 'germ_sub_off.png',
  germ_sub_on: 'germ_sub_on.png',

  killgerm_off: 'killgerm_off.png',
  killgerm_on: 'killgerm_on.png',
  killgerm_sub_off: 'killgerm_sub_off.png',
  killgerm_sub_on: 'killgerm_sub_on.png',

  seafood_off: 'seafood_off.png',
  seafood_on: 'seafood_on.png',
  seafood_sub_off: 'seafood_sub_off.png',
  seafood_sub_on: 'seafood_sub_on.png',

  toyWash_off: 'toyWash_off.png',
  toyWash_on: 'toyWash_on.png',
  toyWash_sub_off: 'toyWash_sub_off.png',
  toyWash_sub_on: 'toyWash_sub_on.png',

  oilnet_off: 'oilnet_off.png',
  oilnet_on: 'oilnet_on.png',
  oilnet_sub_off: 'oilnet_sub_off.png',
  oilnet_sub_on: 'oilnet_sub_on.png',

  bottle_blue: 'bottle_blue.png',
  bottle_gray: 'bottle_gray.png',
  power: 'power.png',
  start: 'start.png',
  pause: 'pause.png',
  stop: 'stop.png',
  appointment: 'appointment.png',
  modeChoose: 'modeChoose.png',
  keep_xd: 'keep_xd.png',
  keep: 'keep.png',
  circle: 'circle.png',

  dry: 'dry.png',
  lock: 'lock.png',
  working: 'working.png',
  standby: 'standby.png',
  closed: 'closed.png',
  waterStrongLevel: 'waterStrongLevel.png',
  waterLevel: 'waterLevel.png',
  washRegion: 'washRegion.png',
  dry_xd_new: 'dry_xd_new_.png',
  dry_xd: 'dry_xd.png',
  autoThrow: 'autoThrow.png',
  autoOpen: 'autoOpen.png',
  addition: 'additon.png',
}

let rs = {}
Object.keys(imgs).forEach((key) => {
  rs[key] = pre + imgs[key]
})
Object.keys(new_imgs).forEach((key) => {
  rs[key] = new_pre + new_imgs[key]
})

export default rs
