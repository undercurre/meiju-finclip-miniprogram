import { imageApi,imgBaseUrl } from '../../../../../api'
const pre = imageApi.getImagePath.url + '/0xB6/'
const newPre = imgBaseUrl.url + '/plugin/0xB6/'
const imgs = {
    header: 'Smoke-lampblack-machine.png',
    power_off: 'icon_switch_off01@3x.png',
    power_on: 'icon_switch_on01@3x.png',
    gear_max_on: 'fun_speed_max_on.png',
    gear_max_off: 'fun_speed_max_off.png',
    light_on: 'light_blue_on.png',
    light_off: 'light_gray.png',
    delay_off: 'delay_gray.png',
    delay_on: 'delay_blue.png',
    aiDry_off: 'aidryclean-black.png',
    aiDryC_on: 'aidryclean-white.png',
    AirDuctDetection: 'AirDuctDetection.png',
    b6DataJSON: 'b6Data.json',
    cleaning: 'cleaning.png',
    close: 'close.png',
    delayPowerOff: 'delayPowerOff.png',
    fanPollutionDegrees_blue: 'fanPollutionDegrees-blue.png',
    gearIcon: 'gearIcon.png',
    light_white: 'light-white.png',
    oilBox_blue: 'oilBox-blue.png',
    power: 'power.png',
    surfaceCleanliness_blue: 'surfaceCleanliness-blue.png',
    aiLight: 'aiLight-white.png',
    arrow: 'arrow.png',
    cardBg: 'workingBg.png'
}

let rs = {};
Object.keys(imgs).forEach(key => {
    if(imgs[key] == 'Smoke-lampblack-machine.png' || imgs[key] == 'icon_switch_off01@3x.png' || imgs[key] == 'icon_switch_on01@3x.png' || imgs[key] == 'fun_speed_max_on.png' || imgs[key] == 'fun_speed_max_on.png' || imgs[key] == 'fun_speed_max_off.png' || imgs[key] == 'light_blue_on.png' || imgs[key] == 'light_gray.png' || imgs[key] == 'delay_gray.png' || imgs[key] == 'delay_blue.png') {
        rs[key] = pre + imgs[key]
    }
    else {
        rs[key] = newPre + imgs[key]
    }
})

export default rs;