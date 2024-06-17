import { imageApi } from '../../../../../api'
const pre = imageApi.getImagePath.url + '/0xB3/'
const imgs = {
    header: 'Sterilizer-header.png',
    triangle: 'grey-triangle.png',

    lock_on: 'lock-on.png',
    lock_off: 'lock-off.png',
    power_on: 'power-on.png',
    power_off: 'power-off.png',
    order_on: 'order-on.png',
    order_off: 'order-off.png',
    run_on: 'run_on.png',
    run_off: 'run_off.png',
    stop: 'running-stop.png',
    start: 'running-continue.png',
    pause: 'running-pause.png',

    // modes:
    'drying_on': 'drying_on.png',
    'drying_off': 'drying_off.png',
    'drying_sub_on': 'drying_sub_on.png',
    'drying_sub_off': 'drying_sub_off.png',

    'uperization_on': 'uperization_on.png',
    'uperization_off': 'uperization_off.png',
    'uperization_sub_on': 'uperization_sub_on.png',
    'uperization_sub_off': 'uperization_sub_off.png',

    // 'ozone_disinfect_on': 'ozone_disinfect_on.png',
    // 'ozone_disinfect_off': 'ozone_disinfect_off.png',
    // 'ozone_disinfect_sub_on': 'ozone_disinfect_sub_on.png',
    // 'ozone_disinfect_sub_off': 'ozone_disinfect_sub_off.png',

    // 'warmdisk_on': 'warmdisk_on.png',
    // 'warmdisk_off': 'warmdisk_off.png',
    // 'warmdisk_sub_on': 'warmdisk_sub_on.png',
    // 'warmdisk_sub_off': 'warmdisk_sub_off.png',

    // 'clean_on': 'clean_on.png',
    // 'clean_off': 'clean_off.png',
    // 'clean_sub_on': 'clean_sub_on.png',
    // 'clean_sub_off': 'clean_sub_off.png',

    // 'diy_on': 'diy_on.png',
    // 'diy_off': 'diy_off.png',
    // 'diy_sub_on': 'diy_sub_on.png',
    // 'diy_sub_off': 'diy_sub_off.png',
}

let rs = {};
Object.keys(imgs).forEach(key => {
    rs[key] = pre + imgs[key]
})

export default rs;