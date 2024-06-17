import { imageApi,imgBaseUrl } from '../../../../../api'
const newPre = imgBaseUrl.url + '/plugin/0x9C/'

export const urls = {
  "6640007E": "jd30.png",//JD30
  "6640007D": "jd30.png",//JD30
  "66490Y36": "y36_normal.png",//Y36
  "664000Y3": "y36_normal.png",
  "664000D3": "D3.png",
  '6640007A': 'd09.png',//D09
  '6640007G': 'd09.png',//d06
  '6640007F': 'd09.png',//d06
  '00090D10': 'd09.png',// 90D11 // 通用，没有这个型号
  '00000D01': 'd09.png',// D01 // 通用
  '66490Z16': 'd09.png',
  '6640007H': "TX10.png", //TX10
  '6640007J': "TX10.png", //TX10
}

export const getEqImgUrl = function (sn8) {
  return urls[sn8] ? (newPre + urls[sn8]) : (newPre + "y36_normal.png")
}