import { imageApi,imgBaseUrl } from '../../../../../api'
const newPre = imgBaseUrl.url + '/plugin/0x9C/'

const imgs = {
  deviceBg: 'deviceBg.png',
  dianCiLu_on: 'NDPOnline.png',
  nuanDiePan_on: 'NDPOnline.png',
  zaoJu_on: 'NDPOnline.png',
  uvShaJunGui_on: 'XDGOnline.png',
  xiaoDuGui_on: 'XDGOnline.png',
  yinJunCunChuGui_on: 'XDGOnline.png',
  kaoXiang_on: 'KXOnline.png',
  zhengXiang_on: 'ZKXOnline.png',
  dianCiLu: 'dianCiLu.png',
  nuanDiePan: 'nuanDiePan.png',
  zaoJu: 'zaoJu.png',
  uvShaJunGui: 'uvShaJunGui.png',
  xiaoDuGui: 'xiaoDuGui.png',
  yinJunCunChuGui: 'yinJunCunChuGui.png',
  kaoXiang: 'kaoXiang.png',
  zhengXiang: 'zhengXiang.png',
  yanJiDangWei: 'yanJiDangWei.png',
  lightS: 'lightS.png',
  turnOn: 'turnOn.png',
}

let rs = {};
Object.keys(imgs).forEach(key => {
  rs[key] = newPre + imgs[key]
})

export default rs;