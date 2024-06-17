import { imgBaseUrl } from '../../../../api'
const newPre = imgBaseUrl.url + '/plugin/0xED/'

const imgs = {
  backBlack: 'back_black.png',
  bubble: 'bubble.png',
  bubbleOff: 'bubble_off.png',
  cloudwash: 'cloudwash.png',
  aiwash: 'ai.png',
  germicidal: 'germicidal.png',
  germicidalOff: 'germicidal_off.png',
  heat: 'heat.png',
  keepWarm: 'keep_warm.png',
  lock: 'lock.png',
  quantify: 'quantify.png',
  temp: 'temp.png',
  washTea: 'wash_tea.png',
  wash: 'wash.png',
  washOff: 'wash_off.png',
  iconCloseRed: 'icon-close-red.png',
  iconCloseYellow: 'icon-close-yellow.png',
  iconError: 'icon-error.png',
  iconWarn: 'icon-warn.png',
  warning: 'warning@2x.png',
}

let rs = {}
Object.keys(imgs).forEach((key) => {
  rs[key] = newPre + imgs[key]
})

export default rs
