/*
 * @desc: 测试品类数据
 * @author: zhucc22
 * @Date: 2023-10-25 10:11:49
 */
function onUpdate(e, i, t) {
  var a = {},
    o = {},
    n = {},
    r = {},
    l = {},
    d = {},
    s = e['isOnline'] || !1,
    s =
      ((d.hidden = e['isEditStatus'] || !s),
      1 == i['wallAirConditioner.power'] ? (d.selected = !0) : (d.selected = !1),
      '' != e.name && (a.text = e.name),
      '' != e['deviceImageUrl'] && (o.image = e['deviceImageUrl']),
      '' != e['deviceImagePlaceHolder'] && (o.placeHolder = e['deviceImagePlaceHolder']),
      s
        ? ((a.alpha = 1),
        (o.alpha = 1),
        (n.alpha = 1),
        (r.alpha = 1),
        (l.alpha = 1),
        1 == i['wallAirConditioner.workMode']
          ? (l.text = '自动模式 ' + i['wallAirConditioner.targetTemperature'] + '℃')
          : 2 == i['wallAirConditioner.workMode']
            ? (l.text = '制冷模式 ' + i['wallAirConditioner.targetTemperature'] + '℃')
            : 3 == i['wallAirConditioner.workMode']
              ? (l.text = '制热模式 ' + i['wallAirConditioner.targetTemperature'] + '℃')
              : 4 == i['wallAirConditioner.workMode']
                ? (l.text = '抽湿模式 ' + i['wallAirConditioner.targetTemperature'] + '℃')
                : 5 == i['wallAirConditioner.workMode']
                  ? (l.text = '送风模式 ' + i['wallAirConditioner.targetTemperature'] + '℃')
                  : (l.text = '在线'),
        0 == i['wallAirConditioner.power'] && (l.text = '已关机'))
        : ((a.alpha = 0.3), (o.alpha = 0.3), (n.alpha = 0.3), (r.alpha = 0.3), (l.alpha = 0.3), (l.text = '离线')),
      {}),
    i = {}
  1 == e['showRoomName']
    ? ((n.text = e['roomName']), (n.hidden = !1), (r.hidden = !1), (s.display = 'flex'), (i.display = 'flex'))
    : ((n.text = ''), (n.hidden = !0), (r.hidden = !0), (s.display = 'none'), (i.display = 'none'))
  return {
    deviceIcon: JSON.stringify(o),
    deviceName: JSON.stringify(a),
    roomName: JSON.stringify(n),
    roomLine: JSON.stringify(r),
    deviceStatus: JSON.stringify(l),
    powerBtn: JSON.stringify(d),
  }
}

module.exports = {
  onUpdate,
}
