import statusX from '../../config/statusX'
import { image } from '../../config/getImage';

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
        },
        devInfo: {
            type: Object,
            value: {}
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
        },
        'devInfo'(newVal) {
            if (newVal != null && newVal != undefined) {
                let sn8 = newVal.sn8
                let isSupport = statusX.isSupportWindDirection(sn8);
                this.setData({isDeviceSupport: isSupport})
            }
        }
    },
    data: {
        isBluetoothConnected: false, // 是否已连接蓝牙
        isOffLine: true, //是否离线
        panelIcon: image.baifeng_white,
        isOff: true, //是否电源关
        isAutoWindEnable: true, //自动摆风是否开启
        curWindDirection: 60, //当前角度
        curThemeColor: '#00CBB8', //开机时的主题色
        isPanelEnable: false, // 风速面板是否生效
        isDeviceSupport: false // 设备是否支持风速调节
    },
    methods: {
        onAutoWindClick() {
            if (!this.data.isPanelEnable) return
            let isAutoWindEnable = statusX.isAutoWindDirection();

            let value = 0
            if (isAutoWindEnable) value = 254
            else value = 253

            let param
            if (statusX.isHeatingEnable()) param = {heating_direction: value}
            else if (statusX.isBlowingEnable()) param = {blowing_direction: value}
            else if (statusX.isDryingEnable()) param = {drying_direction: value}
            else if (statusX.isBathEnable()) param = {bath_direction: value}
            else return
            this.sendControl(param)
        },
        onSliderChange(event) {
            // let value = event.detail.value
            // this.setData({curWindDirection: value})
        },
        onSliderEnd(event) {
            if (!this.data.isPanelEnable) return
            let value = event.detail.value
            this.setData({curWindDirection: value})

            let param
            if (statusX.isHeatingEnable()) param = {heating_direction: value}
            else if (statusX.isBlowingEnable()) param = {blowing_direction: value}
            else if (statusX.isDryingEnable()) param = {drying_direction: value}
            else if (statusX.isBathEnable()) param = {bath_direction: value}
            else return
            this.sendControl(param)
        },
        updateView() {
            let isOff = statusX.isOff();
            let isAutoWindEnable = statusX.isAutoWindDirection();
            let themeColor = statusX.getThemeColorByStatus();

            let windDirection = 60
            if (!isAutoWindEnable) {
                windDirection = statusX.windDirection();
            }

            let isModeSupport = false
            if (statusX.isHeatingEnable() || statusX.isBlowingEnable() 
            || statusX.isDryingEnable() || statusX.isBathEnable()) {
                isModeSupport = true
            }

            let isPanelEnable = true
            if ((this.data.isOffLine && !this.data.isBluetoothConnected) || isOff || !isModeSupport) isPanelEnable = false

            this.setData({
                isOff: isOff,
                isAutoWindEnable: isAutoWindEnable,
                curWindDirection: windDirection,
                curThemeColor: themeColor,
                isPanelEnable: isPanelEnable
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
