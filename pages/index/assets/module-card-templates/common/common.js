/*
 * @desc: 物模型组件处理通用方法
 * @author: zhucc22
 * @Date: 2024-03-12 10:44:04
 */

function getNewStyle(styles) {
  let keyMap = { alpha: 'opacity', textColor: 'color', textAlignment: 'textAlign', isFlex: 'flex' }
  let textMap = { 0: 'left', 1: 'center', 2: 'right' }
  let numberOfLines = { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
  let numberOfLinesBreak = { whiteSpace: 'nowrap', overflow: 'hidden' }
  var objs = Object.keys(styles).reduce((newData, key) => {
    let newKey = keyMap[key] || key
    newData[newKey] = styles[key] //旧值赋值给新key的值
    return newData
  }, {})
  if (objs.bold) objs.fontWeight = 'bold'
  if (objs.textAlign || String(objs.textAlign) == '0') {
    objs.textAlign = textMap[objs.textAlign]
  }
  if (objs.numberOfLines == 1) {
    if (objs.lineBreakMode == 0) {
      objs = {
        ...objs,
        ...numberOfLinesBreak,
      }
    } else {
      objs = {
        ...objs,
        ...numberOfLines,
      }
    }
  }
  for (let key in objs) {
    if (typeof objs[key] == 'string') {
      if (objs[key].search('px') != -1) {
        objs[key] = pxToRpx(objs[key])
      }
    }
  }
  if (objs.fontSize) objs.fontSize = objs.fontSize * 2 + 'rpx'
  delete objs['text']
  delete objs['isFlex']
  delete objs['flex-grow']
  delete objs['bold']
  delete objs['numberOfLines']
  return objs
}

function pxToRpx(px) {
  px = px.replace('px', '')
  //获取整个屏幕的宽度单位 px
  //let screenWidth = wx.getSystemInfoSync().screenWidth
  //let pixelRatio = wx.getSystemInfoSync().pixelRatio
  //用整个屏幕的px单位 除以 750
  //let ratio = (375 * pixelRatio) / screenWidth
  let rpxGet = Math.round(px * 2) + 'rpx'
  return rpxGet
}

module.exports = {
  getNewStyle,
}
