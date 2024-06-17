/**
 * 子设备通用方法文件
 * 
 * @parseEventLock: 门锁日志解析方法
 * 
 */

// 配置信息导入
const mapConfig = require('./zConfigMapping.js');

// 前面补0
const paddingZero = (str, len) => {
  len = len || 8, str = str + '';
  let _strLen = str.length;
  if (_strLen >= len) return str;
  return (new Array(len - _strLen + 1).join('0') + str)
}
// 门锁日志解析
const parseEventLock = (loginfo, userInfos) => {
  // code here
  let _text = 'BLANK';
  let _lockConfig = mapConfig.zLockConfig;
  let _mapping = _lockConfig.event || {};

  // 1 无事件
  if (!loginfo || !loginfo.event) {
    return _text;
  }

  // 2 有事件，则解析
  let _logObj = loginfo.event;
  for (let item in _logObj) {
    let _mapEvent = _mapping[item], _val = _logObj[item];  //  || _mapping['default']

    switch (item) {
      case 'OpenRecord':                          // OpenRecord
        (() => {
          //
          if (_val == 0) {
            _text += '正常';
          } else {
            // 0 初始化用户角色 是否被劫持
            let _userRole = '', _isAntiHijacking = false;

            // 1 处理值
            let _valInt = parseInt(_val, 10);
            let _codes = paddingZero(_valInt.toString(16), 4);
            let _userNo = parseInt(_codes.substr(2, 2), 16), _userType = parseInt(_codes.substr(0, 2), 16);

            // 2 从用户中查找角色
            let _userItem = userInfos.find((item) => {
              return (item.userNo == _userNo) && (item.userType == _userType)
            })
            if (_userItem) {
              // console.log(_userItem)
              _userRole = _userItem.userRole || '';
              _isAntiHijacking = _userItem.isAntiHijacking || false;
            }

            // 3 角色key和角色名称
            let _userRoleKey = _userRole != undefined && _userRole != null && _userRole != '', _userTypeName = _mapEvent[_userType] || '';

            // 4 开门记录组装
            _text = _userRoleKey
              ? _userRole + "(" + _userTypeName + '用户' + _userNo + ")" + '开锁'
              : ((_userType == 11) ? _userTypeName : _userTypeName + '用户' + _userNo + '开锁');

            // 5 是否劫持报警
            if (_isAntiHijacking) _text += '(劫持报警)';
          }
        })(); break;
      case 'DoorState':                           // DoorState
      case 'BatteryAlarmState':                   // BatteryAlarmState
      case 'ActuatorEnabled':                     // ActuatorEnabled
      case 'ZoneStatus':                          // ZoneStatus
        (() => {
          _text = _mapEvent[_val] || _mapEvent['default'];
        })(); break;
      case 'OnOff':                                // OnOff
        (() => {
          // 追加
          _text += _mapEvent[_val] || _mapEvent['default'];
        })(); break;
      default: (() => {
        _text += _mapping['default'];
      })();
    }
  }
  // return
  return _text;
}

module.exports = {
  parseEventLock
}
