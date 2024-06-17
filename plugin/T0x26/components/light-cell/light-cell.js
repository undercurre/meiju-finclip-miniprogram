import statusX from '../../config/statusX'

Component({
    properties: {
        deviceStatus: {
            type: Object,
            value: {}
        },
        deviceIsOnline: {
            type: Boolean,
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
        isBluetoothConnected: false, // 是否已连接蓝牙
        isOffLine: true, //是否离线
        isMainLightEnable: true, // 主照明是否开启
        isNightLightEnable: true, // 夜灯是否开启
        curThemeColor: '#00CBB8' //开机时的主题色
    },
    methods: {
        onMainLightClick() {
            if (this.data.isOffLine && !this.data.isBluetoothConnected) return
            let isMainLightEnable = statusX.isMainLightEnable();
            if (isMainLightEnable) {
                this.sendControl({light_mode: ''})
            } else {
                this.sendControl({light_mode: 'main_light'})
            }
        },
        onNightLightClick() {
            if (this.data.isOffLine && !this.data.isBluetoothConnected) return
            if (statusX.isNightLightEnable()) {
                this.sendControl({light_mode: ''})
            } else {
                this.sendControl({light_mode: 'night_light'})
            }
        },
        updateView() {
            let isMainLightEnable = statusX.isMainLightEnable();
            let isNightLightEnable = statusX.isNightLightEnable();
            let themeColor = statusX.getThemeColorByStatus();
            this.setData({
                isMainLightEnable: isMainLightEnable,
                isNightLightEnable: isNightLightEnable,
                curThemeColor: themeColor
            })
        },
        sendControl(jsonObj) {
            this.triggerEvent('sendControlJson', jsonObj)
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
