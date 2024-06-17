import { imageApi,imgBaseUrl } from '../../../../../api'
const pre = imageApi.getImagePath.url + '/0xB7/'
const newPre = imgBaseUrl.url + '/plugin/0xB7/'
const imgs = {
    // header: 'Gas-stove.png',
    // delay_off: 'delay_gray.png',
    // delay_on: 'delay_orange.png',
    // lock_off: 'lock-off.png',
    // lock_on: 'lock-on.png',
    // power_off: 'icon_switch_off01@3x.png',
    // power_on: 'icon_switch_on02@3x.png',
    // temp_on: 'temps_on.png',
    // temp_off: 'temps_off.png',
    b7DataJSON: 'data.json',
    off: 'off.png',
    templte: 'templte.png',
    time: 'time.png',
    turnOn: 'turnOn.png',
    arrow: 'arrow.png',
    cardBg: 'workingBg.png'
}

let rs = {};
Object.keys(imgs).forEach(key => {
    rs[key] = newPre + imgs[key]
    // if(imgs[key] == 'temps_on.png' || imgs[key] == 'temps_off.png') {
    //     rs[key] = newPre + imgs[key]
    // }
    // else {
    //     rs[key] = pre + imgs[key]
    // }
})

export default rs;