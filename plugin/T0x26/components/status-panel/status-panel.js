import { image } from '../../config/getImage';
import statusX from '../../config/statusX'

Component({
    properties: {
      deviceStatus: {
          type: Object,
          value: {}
      },
      deviceIsOnline: {
          type:Boolean,
          value: false
      },
      isConnectBlue: {
        type:Boolean,
        value: false
      }
    },
    observers: {
        'deviceStatus'(newVal) {
            statusX.setStatus(newVal);
            this.updateView();
        },
        'deviceIsOnline'(newVal) {
			this.setData({
				isOffLine: !newVal
			})
        },
        'isConnectBlue'(newVal) {
            this.setData({
				isBluetoothConnected: newVal
			})
        }
    },
    data: {
        isOffLine: true, // 是否离线
        isOff: true, // 是否全关
        isMainLightEnable: false, // 是否主照明开启
        isNightLightEnable: false, // 是否夜灯开启
        curModeBG: '', // 当前风背景图
        isBluetoothConnected: false, // 是否已连接蓝牙
        curModeText: '', // 当前模式文本
        curSubStatusText: '', // 当前其他功能文本
        isDeHumidityOn: false, // 是否触发自动除湿
        curDehumidityTime: 0, // 当前除湿剩余时间
    },
    methods: {
      updateView() {
          let isOff = statusX.isOff();
          let isMainLightEnable = statusX.isMainLightEnable();
          let isNightLightEnable = statusX.isNightLightEnable();

          let isHeatingEnable = statusX.isHeatingEnable();
          let isStrongHeatingEnable = statusX.isStrongHeatingEnable();
          let isBlowingEnable = statusX.isBlowingEnable();
          let isVentilationEnable = statusX.isVentilationEnable();
          let isDryingEnable = statusX.isDryingEnable();
          let isBathEnable = statusX.isBathEnable();

          let bgImage = '';
          let modeText = '';
          let subStatusText = ''
          if (isOff) {
            if (isMainLightEnable) {
                bgImage = image.zhaoming_bg
                modeText = '照明'
            } else if (isNightLightEnable) {
                bgImage = image.yedeng_bg
                modeText = '夜灯'
            }
          } else {
            if (isDryingEnable) {
                bgImage = image.ganzhao_bg
                if (modeText == '') modeText = '干燥'
                else modeText = '干燥+' + modeText
            }
            if (isVentilationEnable) {
                bgImage = image.huanqi_bg
                if (modeText == '') modeText = '换气'
                else modeText = '换气+' + modeText
            }
            if (isBlowingEnable) {
                bgImage = image.chuifeng_bg
                if (modeText == '') modeText = '吹风'
                else modeText = '吹风+' + modeText
            }
            if (isBathEnable) {
                bgImage = image.muyu_bg
                if (modeText == '') modeText = '安心沐浴'
                else modeText = '安心沐浴+' + modeText
            }
            if (isHeatingEnable) {
                bgImage = image.qunuan_bg
                if (isStrongHeatingEnable) {
                    if (modeText == '') modeText = '强暖'
                    else modeText = '强暖+' + modeText
                } else {
                    if (modeText == '') modeText = '弱暖'
                    else modeText = '弱暖+' + modeText
                }
            }

            if (isMainLightEnable) {
                subStatusText = '照明已开启'
            } else if (isNightLightEnable) {
                subStatusText = '夜灯已开启'
            }
          }

          let isDeHumidityOn = statusX.dehumidificationTrigger();
          let deHumTime = 0
          if (isDeHumidityOn) {
            deHumTime = statusX.dehumidificationTime()
          }

		  this.setData({
			isOff: isOff,
            isMainLightEnable: isMainLightEnable,
            isNightLightEnable: isNightLightEnable,
            curModeBG: bgImage,
            curModeText: modeText,
            curSubStatusText: subStatusText,
            isDeHumidityOn: isDeHumidityOn,
            curDehumidityTime: deHumTime
		  })
      }
    },
    lifetimes: {
        attached: function() {
		  // 在组件实例进入页面节点树时执行
			this.setData({
                isOffLine: !this.properties.deviceIsOnline,
                isBluetoothConnected: this.properties.isConnectBlue
			})
			
          	statusX.setStatus(this.properties.deviceStatus);
          	this.updateView();
        },
        detached: function() {
          // 在组件实例被从页面节点树移除时执行
        },
    }
})
