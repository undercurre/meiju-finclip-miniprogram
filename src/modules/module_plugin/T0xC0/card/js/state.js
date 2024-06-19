let hex = 'aa,11,c0,00,00,00,00,00,00,04,00,00,20,00,00,50,00,bb';

class State {
  constructor(hex) {
    this.hex = hex;

    // 设备状态
    this.state = this.transform(hex);
  }

  // 更新厨房秤状态
  updateHex(hex) {
    this.hex = hex;
    this.state = this.transform(hex);
  }

  // 协议转换
  transform(hex) {
    let state = {
      clear: 0,
      status_back: 0,
      over_load: 0,
      low_power: 0,
      charging: 0,
      weight: 0,
      battery_percent: 0,
      weight_unit: 'g'
    }
    if(!hex) return state;
    let hexArr = hex.split(',');

    // 转换json
    state.clear = parseInt(hexArr[11], 16) & 15;
    state.status_back = parseInt(hexArr[12], 16) >> 4 & 15;
    state.over_load = parseInt(hexArr[12], 16) >> 2 & 1;
    state.low_power = parseInt(hexArr[12], 16) >> 1 & 1;
    state.charging = parseInt(hexArr[12], 16) & 1;
    state.battery_percent = parseInt(hexArr[15], 16);
    state.weight = parseInt(hexArr[13], 16) + parseInt(hexArr[14], 16) * 256
    state.weight_unit = parseInt(hexArr[16], 16);

    return state;
  }

  getState(key) {
    return this.state[key];
  }
}

export default State;