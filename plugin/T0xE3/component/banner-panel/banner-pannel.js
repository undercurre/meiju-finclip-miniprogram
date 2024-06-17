import computedBehavior from '../../../../utils/miniprogram-computed'
import images from '../../assets/js/img'

// 故障处理
const getErrorContent = function (code) {
  let errorContent = ''
  switch (code) {
    case 'E0':
      errorContent = 'E0:出水传感器故障'
      break
    case 'E1':
      errorContent = 'E1:意外熄火'
      break
    case 'E2':
      errorContent = 'E2:伪火故障'
      break
    case 'E3':
      errorContent = 'E3:温控器故障'
      break
    case 'E4':
      errorContent = 'E4:超温故障'
      break
    case 'E5':
      errorContent = 'E5:风机故障'
      break
    case 'E6':
      errorContent = 'E6:燃气阀故障'
      break
    case 'E8':
      errorContent = 'E8:水泵故障'
      break
    case 'EA':
      errorContent = 'EA:CO故障'
      break
    case 'EE':
      errorContent = 'EE:超时故障'
      break
    case 'F2':
      errorContent = 'F2:进水温度传感器故障'
      break
    case 'C0':
      errorContent = 'C0:点火失败'
      break
    case 'C1':
      errorContent = 'C1:残火故障'
      break
    case 'C2':
      errorContent = 'C2:风压开关/传感器误接通故障'
      break
    case 'C3':
      errorContent = 'C3:风压开关/传感器无法接通故障'
      break
    case 'C4':
      errorContent = 'C4:风堵故障'
      break
    case 'C5':
      errorContent = 'C5:水路堵塞故障'
      break
    case 'C6':
      errorContent = 'C6:水流传感器故障'
      break
    case 'C7':
      errorContent = 'C7:负荷异常'
      break
    case 'C8':
      errorContent = 'C8:热电偶异常'
      break
    case 'EH':
      errorContent = 'EH:CH4异常'
      break
    case 'EF':
      errorContent = 'EF:气泡水故障'
      break
    default:
      errorContent = '故障'
  }
  return errorContent
}

Component({
  behaviors: [computedBehavior],
  properties: {
    status: {
      type: Number,
      value: 0,
    },
    appData: {
      type: Object,
      value: {},
    },
    setting: {
      type: Object,
      value: {},
    },
    color: {
      type: String,
      value: '',
    },
  },
  data: {
    images,
  },
  computed: {
    errContent() {
      return getErrorContent(this.properties.appData.error_code)
    },
    mainNumber() {
      const { setting, appData } = this.properties
      if (JSON.stringify(setting) && JSON.stringify(appData) !== '{}') {
        return setting.isHalfTem ? (appData.temperature / 2).toFixed(1) || '--' : appData.temperature || '--'
      } else return '--'
    },
    heatStatus() {
      const { status } = this.properties
      return status == 1 || status == 2 || status == 2.1
    },
  },
  methods: {},
})
