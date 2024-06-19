export let requestParam = {
  bigVer: 5,
}
export function parseDeviceConfig(options) {
  let json_val = undefined
  if (options) {
    let data = options.value
    switch (options.type) {
      case 'mode':
        let dict = {
          ai: 'constant_temperature',
          eco: 'efficient',
          idle: 'idle_mode',
          coolWind: 'cold_air',
          warmRoom: 'hot_house',
          bath: 'bath_mode',
          warmFoot: 'hot_feet',
          dry: 'hot_dry',
          intelligent: 'auto',

          constant_temperature: 'ai',
          efficient: 'eco',
          idle_mode: 'idle',
          cold_air: 'coolWind',
          hot_house: 'warmRoom',
          bath_mode: 'bath',
          hot_feet: 'warmFoot',
          hot_dry: 'dry',
          auto: 'intelligent',
        }
        if (dict[data]) {
          json_val = dict[data]
        } else {
          json_val = data
        }
        // 历史原因，写死
        if (options.sn8 == '57066723') {
          if (data == 'ai') {
            json_val = 'intelligent'
          } else if (data == 'intelligent') {
            json_val = 'ai'
          }
        }
        let sn8Arr = ['570667DT', '570667DQ', '570667DE', '570667DD']
        if (sn8Arr.includes(options.sn8)) {
          if (data == 'efficient') {
            json_val = 'efficient'
          }
          if (data == 'idle') {
            json_val = 'idle_mode'
          }
        }
        // LN
        if (options.sn8 == '570667EA') {
          if (data == 'cold_air') {
            json_val = 'cold_air'
          }
        }
        break
      case 'timer':
        if (data || data === 0) {
          if (data < 10) {
            json_val = '0' + data
          } else {
            json_val = data
          }
        } else {
          json_val = '00'
        }
        break
      default:
        console.warn('invalid type')
        break
    }
  } else {
    console.warn('invalid options')
  }
  return json_val
}
