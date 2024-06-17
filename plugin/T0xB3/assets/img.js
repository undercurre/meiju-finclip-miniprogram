import { imgBaseUrl } from '../../../api'
const new_pre = imgBaseUrl.url + '/plugin/0xB3/'
const new_imgs = {
  modeSelect: 'modeSelect.png',
  order: 'order.png',
  start: 'start.png',
  pause: 'pause.png',
  stop: 'stop.png',
  off_view_bg: 'off_view_bg.png',
  on_pause_bg: 'on_view_pause.png',
  on_view_bg: 'on_view_bg.png',
  turn_off: 'turn_off.png',
  turn_on: 'turn_on.png',
  leftImg: 'back_black.png',
  tipIcon: 'tip_icon2.png',
  order_temp: 'order_temp.png',
  standby: 'standby.png',
}

let rs = {}
Object.keys(new_imgs).forEach((key) => {
  rs[key] = new_pre + new_imgs[key]
})

export default rs
